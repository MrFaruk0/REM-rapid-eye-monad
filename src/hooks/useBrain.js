import { useState, useCallback, useRef } from "react";
import { runLogicAgent } from "../agents/LogicAgent";
import { runMemoryAgent } from "../agents/MemoryAgent";
import { runDreamAgent } from "../agents/DreamAgent";
import { tokenCounter } from "../utils/tokenCounter";
import { buildDreamPrompt, getPollinationsUrl } from "../utils/dreamPromptBuilder";

const DAILY_TASKS = [
  { id: 1, description: "Bu gece rüyanda yüz", targetActivity: "Yüzmek", reward: 10 },
  { id: 2, description: "Bugün parkta vakit geçir", targetActivity: "Koşmak", reward: 10 },
  { id: 3, description: "Eve dön ve dinlen", targetActivity: "Uyuklamak", reward: 10 },
];

function getTodayTask() {
  const dayIndex = Math.floor(Date.now() / 86400000) % DAILY_TASKS.length;
  return DAILY_TASKS[dayIndex];
}

function loadDreams() {
  try {
    return JSON.parse(localStorage.getItem("brain_dreams") || "[]");
  } catch {
    return [];
  }
}

function saveDream(dream) {
  const dreams = loadDreams();
  dreams.unshift(dream);
  localStorage.setItem("brain_dreams", JSON.stringify(dreams.slice(0, 10)));
}

export function useBrain(sendTx) {
  const [events, setEvents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [tokenTotal, setTokenTotal] = useState(0);
  const [isNight, setIsNight] = useState(false);
  const [currentDream, setCurrentDream] = useState(null);
  const [dreams, setDreams] = useState(loadDreams);
  const [dailyTask] = useState(getTodayTask);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [memorySummary, setMemorySummary] = useState("");

  const addLog = useCallback((agent, message) => {
    setLogs((prev) => [
      { agent, message, timestamp: new Date(), id: Date.now() + Math.random() },
      ...prev,
    ].slice(0, 50));
  }, []);

  const selectActivity = useCallback(async (location, activity) => {
    if (isProcessing || tokenCounter.isLimitReached()) return;
    setIsProcessing(true);

    addLog("System", `⚡ ${location} → ${activity} seçildi`);

    // 1. LogicAgent
    addLog("Logic", "Beyin aktiviteyi analiz ediyor...");
    const logicResult = await runLogicAgent({
      location,
      activity,
      memoryContext: memorySummary,
    });
    addLog("Logic", logicResult.interpretation);

    // 2. Yeni event oluştur
    const newEvent = {
      id: Date.now(),
      location,
      activity,
      interpretation: logicResult.interpretation,
      timestamp: new Date().toISOString(),
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);

    // 3. MemoryAgent
    addLog("Memory", "Hafıza katmanı güncelleniyor...");
    const memResult = await runMemoryAgent({ events: updatedEvents });
    addLog("Memory", memResult.summary);
    setMemorySummary(memResult.summary);

    // 4. Token hesapla
    const totalUsed = logicResult.tokens_used + memResult.tokens_used;
    const newTotal = tokenCounter.addTokens(totalUsed);
    setTokenTotal(newTotal);
    addLog("System", `🔥 ${totalUsed} token harcandı (Toplam: ${newTotal}/500)`);

    // 5. Monad TX
    if (sendTx) {
      addLog("TX", "⛓️ Monad TX gönderiliyor...");
      try {
        const hash = await sendTx(totalUsed);
        if (hash) {
          addLog("TX", `✅ TX onaylandı: ${hash.slice(0, 10)}...${hash.slice(-6)}`);
        } else {
          addLog("TX", "⚠️ TX atlandı (MetaMask yok veya reddedildi)");
        }
      } catch {
        addLog("TX", "⚠️ TX hatası, devam ediliyor");
      }
    }

    // 6. Görev tamamlama kontrolü
    if (!taskCompleted && activity === dailyTask.targetActivity) {
      setTaskCompleted(true);
      addLog("System", `🏆 Görev tamamlandı: "${dailyTask.description}"`);
      if (sendTx) {
        const rewardHash = await sendTx(dailyTask.reward);
        if (rewardHash) {
          addLog("TX", `🎁 Ödül TX: ${rewardHash.slice(0, 10)}...`);
        }
      }
    }

    // 7. Token limiti dolunca gece başlasın
    if (tokenCounter.isLimitReached() && !isNight) {
      setIsNight(true);
      addLog("Dream", "🌙 Gece başlıyor... Rüya işleme başlatılıyor.");

      setTimeout(async () => {
        // DreamAgent
        const dreamResult = await runDreamAgent({
          memorySummary: memResult.summary,
          dailyTask,
        });
        addLog("Dream", `💭 Rüya promptu: "${dreamResult.imagePrompt.slice(0, 60)}..."`);

        const pollinationsUrl = getPollinationsUrl(dreamResult.imagePrompt);
        const dreamEntry = {
          id: Date.now(),
          date: new Date().toLocaleDateString("tr-TR"),
          imageUrl: pollinationsUrl,
          prompt: dreamResult.imagePrompt,
          task: dailyTask.description,
          taskCompleted,
          memorySummary: memResult.summary,
        };

        setCurrentDream(dreamEntry);
        saveDream(dreamEntry);
        setDreams(loadDreams());
        addLog("Dream", "✨ Rüya görseli yükleniyor...");
      }, 1500);
    }

    setIsProcessing(false);
  }, [isProcessing, events, memorySummary, sendTx, dailyTask, taskCompleted, isNight, addLog]);

  return {
    events,
    logs,
    tokenTotal,
    isNight,
    currentDream,
    dreams,
    dailyTask,
    taskCompleted,
    isProcessing,
    selectActivity,
    memorySummary,
  };
}
