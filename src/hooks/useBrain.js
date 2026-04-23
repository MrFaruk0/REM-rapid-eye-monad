import { useState, useCallback, useEffect } from "react";
import { runLogicAgent } from "../agents/LogicAgent";
import { runMemoryAgent } from "../agents/MemoryAgent";
import { runDreamAgent } from "../agents/DreamAgent";
import { buildDreamPrompt, getPollinationsUrl } from "../utils/dreamPromptBuilder";

const DAILY_TOKEN_LIMIT = 500;

const DAILY_TASKS = [
  { id: 1, description: "Bu gece rüyanda yüz", targetActivity: "Yüzmek", reward: 10 },
  { id: 2, description: "Bugün parkta vakit geçir", targetActivity: "Koşmak", reward: 10 },
  { id: 3, description: "Eve dön ve dinlen", targetActivity: "Uyuklamak", reward: 10 },
];

function loadState() {
  try {
    return JSON.parse(localStorage.getItem("brain_state") || "{}");
  } catch { return {}; }
}

function loadDreams() {
  try {
    return JSON.parse(localStorage.getItem("brain_dreams") || "[]");
  } catch { return []; }
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

  const dailyTask = DAILY_TASKS[dayNumber % DAILY_TASKS.length];

  // State persist
  useEffect(() => {
    localStorage.setItem("brain_state", JSON.stringify({
      dayNumber, events, tokenTotal, isNight,
      currentDream, taskCompleted, memorySummary,
    }));
  }, [dayNumber, events, tokenTotal, isNight, currentDream, taskCompleted, memorySummary]);

  const addLog = useCallback((agent, message) => {
    setLogs((prev) => [
      { agent, message, timestamp: new Date(), id: Date.now() + Math.random() },
      ...prev,
    ].slice(0, 60));
  }, []);

  // Yeni güne geç
  const wakeUp = useCallback(() => {
    setIsNight(false);
    setEvents([]);
    setTokenTotal(0);
    setCurrentDream(null);
    setTaskCompleted(false);
    setMemorySummary("");
    setDayNumber((d) => d + 1);
    setLogs([]);
    addLog("System", "☀️ Yeni gün başladı! Beyin taze ve hazır.");
  }, [addLog]);

  const selectActivity = useCallback(async (location, activity) => {
    if (isProcessing || isNight || tokenTotal >= DAILY_TOKEN_LIMIT) return;
    setIsProcessing(true);

    addLog("System", `⚡ ${location} → ${activity}`);

    // 1. LogicAgent
    addLog("Logic", "Analiz ediliyor...");
    const logicResult = await runLogicAgent({ location, activity, memoryContext: memorySummary });
    addLog("Logic", logicResult.interpretation);

    // 2. Event kaydet
    const newEvent = { id: Date.now(), location, activity, interpretation: logicResult.interpretation, timestamp: new Date().toISOString() };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);

    // 3. MemoryAgent
    addLog("Memory", "Hafıza güncelleniyor...");
    const memResult = await runMemoryAgent({ events: updatedEvents });
    addLog("Memory", memResult.summary);
    setMemorySummary(memResult.summary);

    // 4. Token
    const used = logicResult.tokens_used + memResult.tokens_used;
    const newTotal = Math.min(tokenTotal + used, DAILY_TOKEN_LIMIT + 10);
    setTokenTotal(newTotal);
    addLog("System", `🔥 ${used} token (Toplam: ${newTotal}/${DAILY_TOKEN_LIMIT})`);

    // 5. Monad TX — sendTx her zaman dene
    if (typeof sendTx === "function") {
      addLog("TX", "⛓️ Monad TX gönderiliyor...");
      const hash = await sendTx(used);
      if (hash) {
        addLog("TX", `✅ ${hash.slice(0, 10)}...${hash.slice(-6)}`);
      } else {
        addLog("TX", "⚠️ TX reddedildi veya hata");
      }
    }

    // 6. Görev kontrolü
    if (!taskCompleted && activity === dailyTask.targetActivity) {
      setTaskCompleted(true);
      addLog("System", `🏆 Görev tamamlandı: "${dailyTask.description}"`);
      if (typeof sendTx === "function") {
        const rh = await sendTx(dailyTask.reward);
        if (rh) addLog("TX", `🎁 Ödül TX: ${rh.slice(0, 10)}...`);
      }
    }

    // 7. Gece tetikle
    if (newTotal >= DAILY_TOKEN_LIMIT && !isNight) {
      setIsNight(true);
      addLog("Dream", "🌙 Token limiti doldu — Rüya işleme başlıyor...");

      setTimeout(async () => {
        addLog("Dream", "💭 DreamAgent çalışıyor...");
        const dreamResult = await runDreamAgent({ memorySummary: memResult.summary, dailyTask });
        addLog("Dream", `Prompt oluşturuldu: "${dreamResult.imagePrompt.slice(0, 50)}..."`);

        const url = getPollinationsUrl(dreamResult.imagePrompt);
        const entry = {
          id: Date.now(),
          date: new Date().toLocaleDateString("tr-TR"),
          imageUrl: url,
          prompt: dreamResult.imagePrompt,
          task: dailyTask.description,
          taskCompleted,
          memorySummary: memResult.summary,
        };
        setCurrentDream(entry);
        saveDream(entry);
        setDreams(loadDreams());
        addLog("Dream", "✨ Rüya görseli yükleniyor...");
      }, 1200);
    }

    setIsProcessing(false);
  }, [isProcessing, isNight, tokenTotal, events, memorySummary, sendTx, dailyTask, taskCompleted, addLog]);

  return {
    events, logs, tokenTotal, isNight, currentDream,
    dreams, dailyTask, taskCompleted, isProcessing,
    selectActivity, memorySummary, wakeUp,
    tokenLimit: DAILY_TOKEN_LIMIT,
  };
}
