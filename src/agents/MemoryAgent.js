// MemoryAgent — günün olaylarını biriktirir ve özetler
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "mistralai/mistral-7b-instruct:free";
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const MOCK_SUMMARIES = [
  "Bugün beyin aktif bir gün geçirdi. Birçok farklı ortamda deneyim biriktirildi.",
  "Hatıralar katmanlanıyor. Duygusal izler güçleniyor, bağlantılar pekişiyor.",
  "Günün deneyimleri uzun süreli belleğe aktarılıyor. Sinaptik bağlar kuvvetlendi.",
  "Yoğun bir günün izi hafızaya kazındı. Rüya işleme için hazırlanıyor.",
];

export async function runMemoryAgent({ events }) {
  const mockSummary = MOCK_SUMMARIES[Math.floor(Math.random() * MOCK_SUMMARIES.length)];

  if (!events || events.length === 0) {
    return { summary: "Henüz kayıt yok.", tokens_used: 0 };
  }

  if (!API_KEY || API_KEY === "buraya_kendi_anahtarini_ekle") {
    return { summary: mockSummary, tokens_used: 50 };
  }

  // Son 5 event'i al
  const recentEvents = events.slice(-5);
  const eventList = recentEvents
    .map((e) => `${e.location} - ${e.activity}: ${e.interpretation}`)
    .join("\n");

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "Brain Agent",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 150,
        messages: [
          {
            role: "system",
            content: "Sen bir beynin hafıza katmanısın. Günü kısaca özetle, duygusal ton ekle. Türkçe, max 2 cümle.",
          },
          {
            role: "user",
            content: `Bugünün aktiviteleri:\n${eventList}\n\nBu günü özetle.`,
          },
        ],
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content || mockSummary;
    const tokens_used = data.usage?.total_tokens || 50;

    return { summary, tokens_used };
  } catch (err) {
    console.warn("MemoryAgent API hatası, mock kullanılıyor:", err.message);
    return { summary: mockSummary, tokens_used: 50 };
  }
}
