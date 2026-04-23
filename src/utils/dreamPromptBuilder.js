export function buildDreamPrompt(memoryNarrative, dailyTask) {
  const task = dailyTask?.targetActivity || "exploration";
  const base = memoryNarrative?.slice(0, 80) || "a surreal day";
  return (
    `Surrealist dreamscape: ${base}. ` +
    `Glowing neural cosmos, deep purple void, bioluminescent memories floating like jellyfish, ` +
    `cinematic lighting, ultra-detailed digital art, 8k, dreamlike atmosphere involving ${task}`
  );
}
