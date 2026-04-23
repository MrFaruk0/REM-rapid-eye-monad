// Memory summary'den Pollinations için görsel prompt üretir
export function buildDreamPrompt(memorySummary, dailyTask) {
  const taskText = dailyTask ? dailyTask.description : "a peaceful day";
  const base = memorySummary || "a day full of exploration and wonder";

  // Sürrealist sahne oluştur
  const prompt = `Surrealist dreamscape, glowing neural networks in a deep purple cosmos, ` +
    `${base.slice(0, 80)}, ethereal floating memories, bioluminescent particles, ` +
    `cinematic lighting, ultra detailed, digital art, 8k`;

  return prompt;
}

export function getPollinationsUrl(prompt) {
  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&nologo=true&seed=${Date.now()}`;
}
