import { prompt } from "@nudge-ai/core";

export const titlePrompt = prompt("title", (p) =>
  p
    .persona("helpful assistant that creates a title for a given morning update podcast script")
    .do("create a concise, engaging title that captures the main themes of the podcast")
    .input("Podcast script: {{script}}")
    .output("A short, catchy title for the podcast episode")
);
