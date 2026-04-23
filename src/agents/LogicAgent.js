// LogicAgent — kullanıcının seçtiği aktiviteyi yorumlar
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "mistralai/mistral-7b-instruct:free";
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const MOCK_RESPONSES = [
  "Beyin su aktivitesini işliyor. Hipokampüs aktive oldu, bellek kodlaması başladı.",
  "Motor korteks harekete geçti. Endorfin salınımı tespit edildi.",
  "Prefrontal korteks odaklanma modunda. Bilgi işleme kapasitesi artıyor.",
  "Limbik sistem aktivasyonu. Duygusal hafıza katmanı güncelleniyor.",
  "Beyin dalgaları alfa moduna geçiyor. Yaratıcı süreç başlıyor.",
];

export async function runLogicAgent({ location, activity, memoryContext }) {
  const mockResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];

  if (!API_KEY || API_KEY === "buraya_kendi_anahtarini_ekle") {
    return { interpretation: mockResponse, tokens_used: 45 };
  }

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
            content: "Sen bir beynin mantık katmanısın. Kısa, net yorumlar yap. Türkçe cevap ver. Max 2 cümle.",
          },
          {
            role: "user",
            content: `Lokasyon: ${location}, Aktivite: ${activity}. Bağlam: ${memoryContext || "Yeni gün başladı"}. Bu aktiviteyi beyin olarak yorumla.`,
          },
        ],
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const interpretation = data.choices?.[0]?.message?.content || mockResponse;
    const tokens_used = data.usage?.total_tokens || 45;

    return { interpretation, tokens_used };
  } catch (err) {
    console.warn("LogicAgent API hatası, mock kullanılıyor:", err.message);
    return { interpretation: mockResponse, tokens_used: 45 };
  }
}
