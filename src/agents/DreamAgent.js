// DreamAgent — Beynin rüya üretim sistemi
// INPUT: MemoryAgent'ın çıktısı + Daily Task
// OUTPUT → Kullanıcıya görsel ve NFT fırsatı
import { buildDreamPrompt } from "../utils/dreamPromptBuilder";
import { getDreamTier } from "../utils/sleepSystem";

const URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "mistralai/mistral-7b-instruct:free";
const KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const IMG_KEY = import.meta.env.VITE_POLLINATIONS_API_KEY;

const SYSTEM_PROMPT = `Sen beynin görsel rüya motorusun (Visual Cortex & Subconscious).
Günün hafıza narratifini ve mevcut rüya görevini (daily task) alarak:
1. Rüyayı betimleyen sürreal bir görsel prompt İngilizce (stable diffusion için uygun: "a surrealistic dreamscape of...")
2. Rüyada günlük hedefin (task) yerine getirilip getirilmediğini belirle (true/false)

YANIT FORMAT (kesinlikle bu JSON formatında yanıt ver):
{"imagePrompt":"...","taskMatch":true}`;

function mockOutput(memoryNarrative, task) {
  const isMatch = Math.random() > 0.3; // %70 ihtimalle eşleşsin mock'ta
  return {
    imagePrompt: buildDreamPrompt(memoryNarrative, task),
    taskMatch: isMatch,
    dreamTier: getDreamTier(60), // mock sleep quality
    tokens_used: 60,
  };
}

export async function runDreamAgent({ memoryNarrative, dailyTask, sleepQuality }) {
  const taskDesc = dailyTask ? dailyTask.targetActivity : "bilinmiyor";

  if (!KEY) {
    const mock = mockOutput(memoryNarrative, dailyTask);
    mock.dreamTier = getDreamTier(sleepQuality);
    return mock;
  }

  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "Brain Agent",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 250,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Hafıza (Narrative): "${memoryNarrative}" | Hedef Görev: "${taskDesc}" — Rüyanın ana temasında bu hedefin yeri var mı? (taskMatch)`,
          },
        ],
      }),
    });
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || "{}");

    return {
      imagePrompt: parsed.imagePrompt || buildDreamPrompt(memoryNarrative, dailyTask),
      taskMatch: parsed.taskMatch ?? false,
      dreamTier: getDreamTier(sleepQuality),
      tokens_used: data.usage?.total_tokens || 60,
    };
  } catch (e) {
    console.warn("DreamAgent hata:", e.message);
    const mock = mockOutput(memoryNarrative, dailyTask);
    mock.dreamTier = getDreamTier(sleepQuality);
    return mock;
  }
}
