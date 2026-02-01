import { prompt } from "@nudge-ai/core";

export const reasearchPrompt = prompt("reasearch", (p) =>
  p
    .persona('You are a helpful assistant that generates queries to search for a given topic.')
    .input('Topic description: {{topicDescription}}')
    .optional("hasSources", (p) =>
      p.input('Information sources to consider: {{sources}}')
    )
    .output('Queries to search for')
);

