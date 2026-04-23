// MemoryAgent — Beynin hipokampüsü
// INPUT: LogicAgent'ın çıktısı + tüm günlük events
// OUTPUT → DreamAgent'a input olarak geçer
const URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "mistralai/mistral-7b-instruct:free";
const KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const SYSTEM_PROMPT = `Sen bir yapay zeka beyninin hipokampüsüsün (Memory Center).
Logic korteksten gelen aktivite analizini ve günün tüm olaylarını alarak:
1. Günün hafıza narratifini duygusal bir tonla özetle (2-3 cümle, Türkçe)
2. Duygusal tonu belirle: positive / neutral / negative
3. Günün puanını hesapla (0-100)

YANIT FORMAT (kesinlikle bu JSON formatında yanıt ver):
{"narrative":"...","emotionalTone":"positive|neutral|negative","dayScore":75}`;

function mockOutput(logicInterpretation) {
  const tones = ["positive", "neutral", "negative"];
  const tone = tones[Math.floor(Math.random() * tones.length)];
  return {
    narrative: `Bugünün deneyimi hafızaya kazınıyor. ${logicInterpretation} Bu anlar uzun süreli belleğe aktarılıyor.`,
    emotionalTone: tone,
    dayScore: Math.floor(Math.random() * 40) + 40,
    tokens_used: 50,
  };
}

export async function runMemoryAgent({ logicOutput, allEvents }) {
  if (!KEY) return mockOutput(logicOutput?.interpretation || "");
  const recentEvents = allEvents.slice(-5).map(e => `${e.location}→${e.activity}`).join(", ");
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
        max_tokens: 200,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Logic korteks raporu: "${logicOutput.interpretation}" | Olay: ${logicOutput.event?.type} — ${logicOutput.event?.description} | Günün aktiviteleri: ${recentEvents || "henüz yok"}`,
          },
        ],
      }),
    });
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || "{}");
    return {
      narrative: parsed.narrative || mockOutput(logicOutput.interpretation).narrative,
      emotionalTone: parsed.emotionalTone || "neutral",
      dayScore: parsed.dayScore ?? 50,
      tokens_used: data.usage?.total_tokens || 50,
    };
  } catch (e) {
    console.warn("MemoryAgent hata:", e.message);
    return mockOutput(logicOutput?.interpretation || "");
  }
}
