export function buildDreamPrompt(memoryNarrative, dailyTask) {
  const task = dailyTask?.targetActivity || "exploration";
  const base = memoryNarrative?.slice(0, 80) || "a surreal day";
  return (
    `Surrealist dreamscape: ${base}. ` +
    `Glowing neural cosmos, deep purple void, bioluminescent memories floating like jellyfish, ` +
    `cinematic lighting, ultra-detailed digital art, 8k, dreamlike atmosphere involving ${task}`
  );
}

export function getPollinationsUrl(prompt) {
  const encoded = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 1000000);
  
  // Ücretsiz ve her zaman çalışan endpoint (eski public endpoint)
  return `https://pollinations.ai/p/${encoded}?width=800&height=500&seed=${seed}&nologo=true`;
}
