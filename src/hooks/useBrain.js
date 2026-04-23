import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import DreamSoulArtifact from "../utils/DreamSoul.json";
import { runLogicAgent } from "../agents/LogicAgent";
import { runMemoryAgent } from "../agents/MemoryAgent";
import { runDreamAgent } from "../agents/DreamAgent";
import { getPollinationsUrl } from "../utils/dreamPromptBuilder";
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

    addLog("System", `⚡ ${location} bölgesinde "${activity}" eylemi başlatıldı`);

    // 1. LogicAgent
    addLog("Logic", "Aktivite işleniyor...");
    const logicResult = await runLogicAgent({ location, activity, sleepQuality, previousContext: memorySummary });
    addLog("Logic", logicResult.interpretation, { event: logicResult.event });

    const newEvent = { id: Date.now(), location, activity, logic: logicResult, timestamp: new Date().toISOString() };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);

    // 2. MemoryAgent
    addLog("Memory", "Hafıza güncelleniyor...");
    const memResult = await runMemoryAgent({ logicOutput: logicResult, allEvents: updatedEvents });
    addLog("Memory", memResult.narrative, { tone: memResult.emotionalTone, score: memResult.dayScore });
    setMemorySummary(memResult.narrative);

    // Uyku kalitesi güncelleme
    const sleepEffect = getActivitySleepEffect(activity);
    const newQuality = Math.max(0, Math.min(100, sleepQuality + sleepEffect));
    setSleepQuality(newQuality);
    if (sleepEffect !== 0) addLog("System", `Uyku kalitesi ${sleepEffect > 0 ? "arttı" : "azaldı"} (${newQuality}/100)`);

    // 3. Token hesabı ve TX
    // Gerçek API harcaması x Olay çarpanı (Şans faktörü)
    const rawTokens = logicResult.tokens_used + memResult.tokens_used;
    const finalTokens = Math.round(rawTokens * logicResult.tokenMultiplier);
    
    const newTotal = Math.min(tokenTotal + finalTokens, tokenLimit + 10);
    setTokenTotal(newTotal);
    addLog("System", `🔥 ${finalTokens} token yakıldı (Çarpan: ${logicResult.tokenMultiplier}x) — ${newTotal}/${tokenLimit}`);

    if (typeof sendTx === "function") {
      const hash = await sendTx(finalTokens);
      if (hash) addLog("TX", `✅ ${hash.slice(0, 10)}...${hash.slice(-6)}`);
      else addLog("TX", "⚠️ TX reddedildi veya hata");
    }

    // 4. Gece kontrolü
    if (newTotal >= tokenLimit && !isNight) {
      setIsNight(true);
      addLog("Dream", "🌙 Token limiti doldu — Uyku evresine geçiliyor...");

      setTimeout(async () => {
        addLog("Dream", "💭 DreamAgent hafızayı rüyaya dönüştürüyor...");
        const dreamResult = await runDreamAgent({ memoryNarrative: memResult.narrative, dailyTask: dailyTask, sleepQuality: newQuality });
        
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

        const tier = getDreamTier(newQuality);
        setPrevTier(tier.key); // Sonraki gün limitini etkiler
        addLog("Dream", `✨ Rüya görseli oluşturuldu! Seviye: ${tier.label} ${tier.icon}`);

        const url = getPollinationsUrl(dreamResult.imagePrompt);
        const entry = {
          id: Date.now(),
          date: new Date().toLocaleDateString("tr-TR"),
          imageUrl: url,
          prompt: dreamResult.imagePrompt,
          task: dailyTask.description,
          taskCompleted: isTaskDone,
          memorySummary: memResult.narrative,
          tier: tier,
        };
        setCurrentDream(entry);
        saveDream(entry);
        setDreams(loadDreams());
      }, 1500);
    }

    setIsProcessing(false);
  }, [isProcessing, isNight, tokenTotal, tokenLimit, events, memorySummary, sleepQuality, sendTx, dailyTask, addLog]);

  // NFT Minting fonksiyonu (Hardhat contract entegrasyonu)
  const mintNft = useCallback(async (dreamData) => {
    if (!window.ethereum) return null;
    if (!contractAddress) {
      addLog("System", "⚠️ NFT Kontratı henüz deploy edilmedi!");
      return null;
    }
    try {
      addLog("TX", "⛓️ NFT Mint işlemi başlatıldı...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const contract = new ethers.Contract(contractAddress, DreamSoulArtifact.abi, signer);
      
      // Metadata (basit JSON stringify)
      const metadataUri = JSON.stringify({
        name: `REM Dream #${dreamData.id}`,
        description: dreamData.memorySummary,
        image: dreamData.imageUrl,
        attributes: [{ trait_type: "Tier", value: dreamData.tier?.label || "Legendary" }]
      });

      const tx = await contract.mintDream(signer.address, metadataUri);
      addLog("TX", `⏳ NFT Mint TX gönderildi...`);
      const receipt = await tx.wait(1);
      
      addLog("TX", `💎 NFT Başarıyla Mintlendi! (Block: ${receipt.blockNumber})`);
      return receipt.hash;
    } catch (e) {
      console.error(e);
      addLog("TX", "⚠️ NFT Mint işlemi başarısız veya reddedildi.");
      return null;
    }
  }, [addLog]);

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

  return {
    events, logs, tokenTotal, isNight, currentDream,
    dreams, dailyTask, taskCompleted, isProcessing,
    selectActivity, memorySummary, wakeUp, tokenLimit,
    sleepQuality, prevTier, mintNft, buyMarketplaceItem,
    contractAddress, deployNftContract
  };
}
