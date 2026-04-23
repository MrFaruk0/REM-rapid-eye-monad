// DreamAgent — gece çalışır, görsel prompt yazar
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "mistralai/mistral-7b-instruct:free";
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const MOCK_PROMPTS = [
  "Surrealist dreamscape, glowing neural pathways in deep purple cosmos, floating memories like luminous bubbles, bioluminescent particles, cinematic lighting, ultra detailed digital art",
  "Ethereal brain in a neon ocean, synapses firing like lightning storms, crystalline memories drifting through violet fog, hyperrealistic dreamlike atmosphere",
  "A neural network garden in moonlight, thoughts blooming as iridescent flowers, memories woven into silver threads, cosmic purple sky, 8k digital painting",
  "Deep dream sequence, fractured reality with glowing synaptic connections, abstract consciousness visualized as aurora borealis, ultra detailed surrealism",
];

export async function runDreamAgent({ memorySummary, dailyTask }) {
  const mockPrompt = MOCK_PROMPTS[Math.floor(Math.random() * MOCK_PROMPTS.length)];

  if (!API_KEY || API_KEY === "buraya_kendi_anahtarini_ekle") {
    return { imagePrompt: mockPrompt, tokens_used: 60 };
  }

  const taskText = dailyTask ? dailyTask.description : "a peaceful exploration";

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
            content: "You are a dream layer of a brain. Write a surrealist visual prompt in English for an AI image generator. Max 50 words. Include: surrealism, neural, cosmic, purple tones.",
          },
          {
            role: "user",
            content: `Memory summary: ${memorySummary}. Daily task: ${taskText}. Create a dream image prompt.`,
          },
        ],
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const imagePrompt = data.choices?.[0]?.message?.content || mockPrompt;
    const tokens_used = data.usage?.total_tokens || 60;

    return { imagePrompt, tokens_used };
  } catch (err) {
    console.warn("DreamAgent API hatası, mock kullanılıyor:", err.message);
    return { imagePrompt: mockPrompt, tokens_used: 60 };
  }
}
