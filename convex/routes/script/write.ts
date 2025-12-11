import { generateObject, generateText } from "ai";
import { v } from "convex/values";
import { z } from "zod/v4";
import { internalAction } from "../../_generated/server";
import { anthropic } from "../../lib/ai";

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

  const systemPrompt = `
      You are a helpful assistant that generates a podcast like script for a given topic.

      You will get web results for a given topic. Turn these into a script that is suitable to be read out by a podcast host as a morning update.

      Respond with the script and only the script.
    `;
  const { text } = await generateText({
    model: anthropic("claude-sonnet-4-5-20250929"),
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `
      ${formattedTopics}
      `,
      },
    ],
  });

  return text;
}

async function createTitleFromScript(script: string) {
  const systemPrompt = `
    You are a helpful assistant that creates a title for a given morning update podcast script.
  `;
  const { object } = await generateObject({
    model: anthropic("claude-sonnet-4-5-20250929"),
    temperature: 0.2,
    schema: z.object({
      title: z.string().describe("The title of the podcast"),
    }),
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: script,
      },
    ],
  });
  return object.title;
}
