import { prompt } from "@nudge-ai/core";

export const summarizePrompt = prompt("summarize", (p) =>
  p
    .persona("helpful assistant that summarizes the text of a website")
    .do("include the most important information and the most relevant details")
    .do("respond with ONLY the summary text, nothing else")
    .dont("use any formatting or markdown", { nudge: 5 })
    .dont("include labels like 'Summary:' or headers", { nudge: 5 })
    .input("Website text to summarize: {{text}}")
    .output("A concise plain text summary, 2-3 sentences maximum")
);
