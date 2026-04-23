// Memory summary'den Pollinations için görsel prompt üretir
export function buildDreamPrompt(memorySummary, dailyTask) {
  const taskText = dailyTask ? dailyTask.description : "a peaceful day";
  const base = memorySummary || "a day full of exploration and wonder";
  return (
    `Surrealist dreamscape, glowing neural networks in deep purple cosmos, ` +
    `${base.slice(0, 70)}, ethereal floating memories, bioluminescent particles, ` +
    `cinematic lighting, ultra detailed digital art, 8k`
  );
}

// YENİ endpoint — image.pollinations.ai legacy çalışmıyor (auth sorunu)
export function getPollinationsUrl(prompt) {
  const encoded = encodeURIComponent(prompt);
  return `https://pollinations.ai/p/${encoded}?width=800&height=500&seed=${Date.now()}&nologo=true`;
}
