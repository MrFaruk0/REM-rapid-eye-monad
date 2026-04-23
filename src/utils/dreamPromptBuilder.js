export function buildDreamPrompt(memoryNarrative, dailyTask) {
  const task = dailyTask?.targetActivity || "resting";
  const base = memoryNarrative?.slice(0, 100) || "a calm day";
  return (
    `A vivid dream illustration: A person is ${task.toLowerCase()} in a peaceful, slightly magical environment. ` +
    `The scene reflects the day's experiences: ${base}. ` +
    `Warm natural lighting, painterly style, detailed environment, serene mood, cinematic composition.`
  );
}
