import "../../src/prompts.gen";
import { generateObject, generateText } from "ai";
import { v } from "convex/values";
import { z } from "zod/v4";
import { internalAction } from "../../_generated/server";
import { openrouter } from "../../lib/ai";
import { scriptPrompt } from "../../src/prompts/script.prompt";
import { titlePrompt } from "../../src/prompts/title.prompt";

export const writeScript = internalAction({
  args: {
    topics: v.array(
      v.object({
        topic: v.string(),
        results: v.array(
          v.object({
            text: v.string(),
            url: v.string(),
            title: v.union(v.string(), v.null()),
            publishedData: v.union(v.string(), v.null()),
          }),
        ),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const script = await scriptFromResults(args.topics);
    const title = await createTitleFromScript(script);
    return {
      script,
      title,
    };
  },
});

async function scriptFromResults(
  topics: {
    topic: string;
    results: {
      text: string;
      url: string;
      title: string | null;
      publishedData: string | null;
    }[];
  }[],
) {
  const formattedTopics = topics
    .map(
      (topic) => `
      Topic: ${topic.topic}
      Results: ${topic.results
          .map(
            (result) => `
        Text: ${result.text}
        URL: ${result.url}
        Title: ${result.title ?? "-"}
        Published Data: ${result.publishedData ?? "-"}
      `,
          )
          .join("\n")}
    `,
    )
    .join("\n");

  const { text } = await generateText({
    model: openrouter("tngtech/deepseek-r1t2-chimera:free"),
    temperature: 0.2,
    prompt: scriptPrompt.toString({ formattedTopics }),
  });

  return text;
}

async function createTitleFromScript(script: string) {
  const { object } = await generateObject({
    model: openrouter("tngtech/deepseek-r1t2-chimera:free"),
    temperature: 0.2,
    schema: z.object({
      title: z.string().describe("The title of the podcast"),
    }),
    prompt: titlePrompt.toString({ script }),
  });
  return object.title;
}
