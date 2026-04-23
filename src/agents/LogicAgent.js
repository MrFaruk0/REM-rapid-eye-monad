// LogicAgent — Beynin mantık korteksi
// OUTPUT → MemoryAgent'a input olarak geçer
const URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "mistralai/mistral-7b-instruct:free";
const KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const SYSTEM_PROMPT = `Sen bir yapay zeka beyninin mantık korteksisin (Prefrontal Cortex).
Kullanıcının seçtiği aktiviteyi analiz ederek:
1. Aktivitenin beyin üzerindeki etkisini yorumla (1-2 cümle, bilimsel ton, Türkçe)
2. Bu aktivite sırasında yaşanabilecek bir olayı belirle: GOOD (iyi) / BAD (kötü) / NEUTRAL (nötr)
3. Olayı kısaca açıkla (1 cümle)

YANIT FORMAT (kesinlikle bu JSON formatında yanıt ver, başka metin ekleme):
{"interpretation":"...","event":{"type":"good|bad|neutral","description":"..."},"tokenMultiplier":0.8}

tokenMultiplier: good=0.8, neutral=1.0, bad=1.3`;

function mockOutput(activity) {
  const events = [
    { type: "good", description: "Beklenmedik bir enerji dalgası yakaladın!", multiplier: 0.8 },
    { type: "neutral", description: "Aktivite sorunsuz tamamlandı.", multiplier: 1.0 },
    { type: "bad", description: "Konsantrasyon dağıldı, enerji harcandı.", multiplier: 1.3 },
  ];
  const e = events[Math.floor(Math.random() * events.length)];
  return {
    interpretation: `Beyin ${activity} aktivitesini işliyor. Nöral ağlar aktive oldu, sinaptik bağlantılar güçleniyor.`,
    event: { type: e.type, description: e.description },
    tokenMultiplier: e.multiplier,
    tokens_used: 45,
  };
}

export async function runLogicAgent({ location, activity, sleepQuality, previousContext }) {
  if (!KEY) return mockOutput(activity);
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
            content: `Lokasyon: ${location} | Aktivite: ${activity} | Uyku Kalitesi: ${sleepQuality}/100 | Önceki bağlam: ${previousContext || "Yeni gün"}`,
          },
        ],
      }),
    });
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || "{}");
    return {
      interpretation: parsed.interpretation || `${activity} beyin tarafından işleniyor.`,
      event: parsed.event || { type: "neutral", description: "Normal aktivite." },
      tokenMultiplier: parsed.tokenMultiplier ?? 1.0,
      tokens_used: data.usage?.total_tokens || 45,
    };
  } catch (e) {
    console.warn("LogicAgent hata:", e.message);
    return mockOutput(activity);
  }
}
