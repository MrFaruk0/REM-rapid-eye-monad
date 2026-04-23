import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import DreamSoulArtifact from "../utils/DreamSoul.json";
import { runLogicAgent } from "../agents/LogicAgent";
import { runMemoryAgent } from "../agents/MemoryAgent";
import { runDreamAgent } from "../agents/DreamAgent";
import { getActivitySleepEffect, applyTierToLimit, getDreamTier } from "../utils/sleepSystem";

const BASE_DAILY_LIMIT = 500;

const DAILY_TASKS = [
  { id: 1, description: "Bu gece rüyanda sularla bütünleş", targetActivity: "Yüzmek", reward: 10 },
  { id: 2, description: "Doğayla iç içe bir rüya gör", targetActivity: "Koşmak", reward: 10 },
  { id: 3, description: "Dinlendirici bir rüya deneyimi yaşa", targetActivity: "Uyuklamak", reward: 10 },
];

function loadState() {
  try { return JSON.parse(localStorage.getItem("brain_state") || "{}"); } catch { return {}; }
}
function loadDreams() {
  try { return JSON.parse(localStorage.getItem("brain_dreams") || "[]"); } catch { return []; }
}
function saveDream(dream) {
  const dreams = loadDreams();
  dreams.unshift(dream);
  localStorage.setItem("brain_dreams", JSON.stringify(dreams.slice(0, 10)));
}

export function useBrain(sendTx) {
  const saved = loadState();

  const [dayNumber, setDayNumber]         = useState(saved.dayNumber ?? 0);
  const [events, setEvents]               = useState(saved.events ?? []);
  const [logs, setLogs]                   = useState([]);
  const [tokenTotal, setTokenTotal]       = useState(saved.tokenTotal ?? 0);
  const [isNight, setIsNight]             = useState(saved.isNight ?? false);
  const [currentDream, setCurrentDream]   = useState(saved.currentDream ?? null);
  const [dreams, setDreams]               = useState(loadDreams);
  const [taskCompleted, setTaskCompleted] = useState(saved.taskCompleted ?? false);
  const [isProcessing, setIsProcessing]   = useState(false);
  const [memorySummary, setMemorySummary] = useState(saved.memorySummary ?? "");
  
  const [sleepQuality, setSleepQuality]   = useState(saved.sleepQuality ?? 60);
  const [prevTier, setPrevTier]           = useState(saved.prevTier ?? null);
  
  const [contractAddress, setContractAddress] = useState(saved.contractAddress || import.meta.env.VITE_NFT_CONTRACT_ADDRESS || "");

  const dailyTask = DAILY_TASKS[dayNumber % DAILY_TASKS.length];
  const tokenLimit = applyTierToLimit(BASE_DAILY_LIMIT, prevTier);

  // State persist
  useEffect(() => {
    localStorage.setItem("brain_state", JSON.stringify({
      dayNumber, events, tokenTotal, isNight,
      currentDream, taskCompleted, memorySummary, sleepQuality, prevTier, contractAddress
    }));
  }, [dayNumber, events, tokenTotal, isNight, currentDream, taskCompleted, memorySummary, sleepQuality, prevTier, contractAddress]);

  const addLog = useCallback((agent, message, data = null) => {
    setLogs((prev) => [
      { agent, message, data, timestamp: new Date(), id: Date.now() + Math.random() },
      ...prev,
    ].slice(0, 60));
  }, []);

  const wakeUp = useCallback(() => {
    setIsNight(false);
    setEvents([]);
    setTokenTotal(0);
    setTaskCompleted(false);
    setMemorySummary("");
    setDayNumber((d) => d + 1);
    setLogs([]);
    
    // Geçen gecenin rüya tier'ına göre yeni gün limitleri güncellenecek (prevTier'a bakılarak)
    addLog("System", `☀️ Yeni gün başladı! Limit: ${applyTierToLimit(BASE_DAILY_LIMIT, prevTier)} token`);
  }, [addLog, prevTier]);

  const selectActivity = useCallback(async (location, activity) => {
    if (isProcessing || isNight || tokenTotal >= tokenLimit) return;
    setIsProcessing(true);

    // 0. Ödeme İşlemi (MetaMask TX)
    let baseTokenCost = 120; // Tahmini token maliyeti (Logic + Memory ortalaması)
    if (typeof sendTx === "function") {
      addLog("System", `💸 "${activity}" için cüzdan onayı bekleniyor...`);
      const hash = await sendTx(baseTokenCost);
      if (!hash) {
        addLog("TX", "⚠️ Ödeme reddedildi. Aktivite iptal edildi.");
        setIsProcessing(false);
        return;
      }
      addLog("TX", `✅ Ödeme alındı: ${hash.slice(0, 10)}...${hash.slice(-6)}`);
    }

    // 1. LogicAgent
    addLog("System", `⚡ ${location} bölgesinde "${activity}" eylemi başlatıldı`);
    await new Promise(r => setTimeout(r, 800));
    addLog("Logic", "Aktivite analiz ediliyor...");
    
    const logicResult = await runLogicAgent({ location, activity, sleepQuality, previousContext: memorySummary });
    await new Promise(r => setTimeout(r, 1000));
    addLog("Logic", logicResult.interpretation, { event: logicResult.event });

    const newEvent = { id: Date.now(), location, activity, logic: logicResult, timestamp: new Date().toISOString() };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);

    // 2. MemoryAgent
    await new Promise(r => setTimeout(r, 1000));
    addLog("Memory", "Bu anı hafızaya yazılıyor...");
    const memResult = await runMemoryAgent({ logicOutput: logicResult, allEvents: updatedEvents });
    
    await new Promise(r => setTimeout(r, 1000));
    addLog("Memory", memResult.narrative, { tone: memResult.emotionalTone, score: memResult.dayScore });
    setMemorySummary(memResult.narrative);

    // Uyku kalitesi güncelleme
    const sleepEffect = getActivitySleepEffect(activity);
    const newQuality = Math.max(0, Math.min(100, sleepQuality + sleepEffect));
    setSleepQuality(newQuality);
    if (sleepEffect !== 0) addLog("System", `Uyku kalitesi ${sleepEffect > 0 ? "arttı" : "azaldı"} (${newQuality}/100)`);

    // 3. Token hesabı (Sadece UI/Limit hesabı için, ödeme önden alındı)
    // Gerçek API harcaması x Olay çarpanı (Şans faktörü)
    const rawTokens = logicResult.tokens_used + memResult.tokens_used;
    const finalTokens = Math.round(rawTokens * logicResult.tokenMultiplier);
    
    const newTotal = Math.min(tokenTotal + finalTokens, tokenLimit + 10);
    setTokenTotal(newTotal);
    addLog("System", `🔥 ${finalTokens} token yakıldı (Önden ödenen: ${baseTokenCost}) — ${newTotal}/${tokenLimit}`);

    // 4. Gece kontrolü
    if (newTotal >= tokenLimit && !isNight) {
      await enterSleepPhase(newTotal, newQuality, memResult.narrative);
    }

    setIsProcessing(false);
  }, [isProcessing, isNight, tokenTotal, tokenLimit, events, memorySummary, sleepQuality, sendTx, addLog]);

  const enterSleepPhase = async (currentTokens, currentQuality, memNarrative) => {
    setIsNight(true);
    addLog("Dream", "🌙 Yorgunluk zirvede — Uyku evresine geçiliyor...");

    setTimeout(async () => {
      addLog("Dream", "💭 Günün anılarından rüya sentezleniyor...");
      const dreamResult = await runDreamAgent({ memoryNarrative: memNarrative, dailyTask: dailyTask, sleepQuality: currentQuality });
      
      await new Promise(r => setTimeout(r, 1500));
        
        // Task match check
        let isTaskDone = false;
        if (dreamResult.taskMatch) {
          isTaskDone = true;
          setTaskCompleted(true);
          addLog("System", `🏆 Görev tamamlandı! Rüya teması görevle eşleşti.`);
          if (typeof sendTx === "function") sendTx(dailyTask.reward);
        } else {
          addLog("System", `❌ Görev başarısız. Rüya teması uyumsuz.`);
        }

        const tier = getDreamTier(currentQuality);
        setPrevTier(tier.key); // Sonraki gün limitini etkiler
        
        let url = "";
        try {
          addLog("Dream", "🎨 Puter.js ile rüya görseli üretiliyor...");
          const prompt = dreamResult.imagePrompt.slice(0, 500);
          const img = await puter.ai.txt2img(prompt);
          url = img.src;
          addLog("Dream", "✅ Görsel oluşturuldu!");
        } catch (err) {
          console.error("Görsel üretim hatası:", err?.message || err);
          addLog("Dream", `⚠️ Görsel üretilemedi: ${err?.message}`);
          url = "";
        }

        addLog("Dream", `✨ Rüya tamamlandı! Seviye: ${tier.label} ${tier.icon}`);

        const entry = {
          id: Date.now(),
          date: new Date().toLocaleDateString("tr-TR"),
          imageUrl: url,
          prompt: dreamResult.imagePrompt,
          task: dailyTask.description,
          taskCompleted: isTaskDone,
          memorySummary: memNarrative,
          tier: tier,
        };
        setCurrentDream(entry);
        saveDream(entry);
        setDreams(loadDreams());
      }, 1500);
  };

  const forceSleep = useCallback(async () => {
    if (isProcessing || isNight) return;
    setIsProcessing(true);
    addLog("System", "💤 Kullanıcı kendi isteğiyle uykuya daldı.");
    await enterSleepPhase(tokenTotal, sleepQuality, memorySummary);
    setIsProcessing(false);
  }, [isProcessing, isNight, tokenTotal, sleepQuality, memorySummary, addLog]);

  // NFT Minting fonksiyonu — contract yoksa önce deploy eder, sonra mint yapar
  const mintNft = useCallback(async (dreamData) => {
    if (!window.ethereum) {
      addLog("TX", "⚠️ MetaMask bulunamadı.");
      return null;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      let addr = contractAddress;

      // Kayıtlı adres varsa chain'de gerçekten var mı kontrol et
      if (addr) {
        const code = await provider.getCode(addr);
        if (code === "0x") {
          addLog("TX", "⚠️ Kayıtlı contract artık chain'de yok. Yeniden deploy ediliyor...");
          addr = "";
          setContractAddress("");
        }
      }

      // Contract yoksa deploy et
      if (!addr) {
        addLog("TX", "⏳ Contract deploy ediliyor...");
        const factory = new ethers.ContractFactory(DreamSoulArtifact.abi, DreamSoulArtifact.bytecode, signer);
        const deployed = await factory.deploy();
        await deployed.waitForDeployment();
        addr = await deployed.getAddress();
        setContractAddress(addr);
        addLog("TX", `✅ Contract deploy edildi: ${addr.slice(0, 8)}...`);
      }

      addLog("TX", "⛓️ NFT Mint işlemi başlatıldı...");
      const contract = new ethers.Contract(addr, DreamSoulArtifact.abi, signer);
      
      // imageUrl base64 olabilir (çok büyük) — on-chain'e kısa referans koy
      const imageRef = dreamData.imageUrl?.startsWith("data:")
        ? `rem-dream://${dreamData.id}`          // base64 ise kısa ID
        : (dreamData.imageUrl || `rem-dream://${dreamData.id}`); // URL ise direkt kullan

      const metadataUri = JSON.stringify({
        name: `REM Dream #${dreamData.id}`,
        description: (dreamData.memorySummary || "").slice(0, 200),
        image: imageRef,
        attributes: [{ trait_type: "Tier", value: dreamData.tier?.label || "Legendary" }]
      });

      const tx = await contract.mintDream(signer.address, metadataUri);
      addLog("TX", `⏳ TX gönderildi, blok bekleniyor...`);
      const receipt = await tx.wait(1);
      
      addLog("TX", `💎 NFT Başarıyla Mintlendi! Block: ${receipt.blockNumber}`);
      return receipt.hash;
    } catch (e) {
      const msg = e?.reason || e?.shortMessage || e?.message || "Bilinmeyen hata";
      console.error("NFT Mint Hatası:", e);
      addLog("TX", `⚠️ Mint başarısız: ${msg.slice(0, 120)}`);
      return null;
    }
  }, [addLog, contractAddress]);

  const buyMarketplaceItem = useCallback(async (item) => {
    if (typeof sendTx === "function") {
      const hash = await sendTx(item.price * 100000); // Temsili miktar
      if (hash) {
        setSleepQuality(q => Math.min(100, q + item.effect));
        addLog("System", `🛒 "${item.name}" satın alındı! Uyku kalitesi +${item.effect}`);
        return true;
      }
    }
    return false;
  }, [sendTx, addLog]);

  const deployNftContract = useCallback(async () => {
    if (!window.ethereum) return null;
    try {
      addLog("System", "⏳ NFT Kontratı deploy ediliyor...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const factory = new ethers.ContractFactory(DreamSoulArtifact.abi, DreamSoulArtifact.bytecode, signer);
      const contract = await factory.deploy();
      await contract.waitForDeployment();
      
      const deployedAddress = await contract.getAddress();
      setContractAddress(deployedAddress);
      addLog("System", `✅ Kontrat başarıyla oluşturuldu: ${deployedAddress}`);
      return deployedAddress;
    } catch (e) {
      console.error(e);
      addLog("System", "⚠️ Kontrat deploy işlemi başarısız.");
      return null;
    }
  }, [addLog]);

  const clearDreams = useCallback(() => {
    localStorage.removeItem("brain_dreams");
    setDreams([]);
    // Gece döngüsünde uyan butonunun kaybolmaması için currentDream silinmez
    addLog("System", "🧹 Rüya arşivi temizlendi.");
  }, [addLog]);

  return {
    events, logs, tokenTotal, isNight, currentDream,
    dreams, dailyTask, taskCompleted, isProcessing,
    selectActivity, memorySummary, wakeUp, tokenLimit,
    sleepQuality, prevTier, mintNft, buyMarketplaceItem,
    contractAddress, deployNftContract, forceSleep, clearDreams
  };
}
