import { generateObject, generateText } from "ai";
import { v } from "convex/values";
import { z } from "zod/v4";
import { internalAction } from "../../_generated/server";
import { openrouter } from "../../lib/ai";

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
      You are a helpful assistant that generates a podcast script for a morning briefing.

      # Goal
      Transform web search results into a natural, conversational script optimized for text-to-speech synthesis.

      # Text Formatting Requirements
      CRITICAL: The output will be converted to speech using text-to-speech AI. Follow these formatting rules strictly:

      - DO NOT use any markdown formatting (no asterisks, underscores, hashtags, brackets, etc.)
      - DO NOT use special characters or symbols
      - Write out ALL URLs in spoken form (e.g., "You can read more at example dot com" instead of "example.com")
      - Write out ALL numbers, dates, and abbreviations in full words (e.g., "twenty twenty-five" not "2025")
      - Write out currency as words (e.g., "one thousand dollars" not "$1,000")
      - Use only plain text with basic punctuation (periods, commas, question marks, exclamation points)
      - Use ellipses (...) for natural pauses in speech
      - Use dashes for longer pauses or dramatic effect
      - Write exactly as you would want someone to read it aloud

      # Content Guidelines
      - Write in a conversational, podcast host tone
      - Structure as a natural morning briefing with smooth transitions between topics
      - Keep language clear and engaging
      - Include context and explanations that make sense when heard, not read
      - Avoid phrases like "click here" or "see below" that only make sense in written form

      # Output Formatq
      Respond with ONLY the plain text script, ready to be spoken. No formatting, no metadata, no preamble.
    `;
  const { text } = await generateText({
    model: openrouter("tngtech/deepseek-r1t2-chimera:free"),
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
    model: openrouter("tngtech/deepseek-r1t2-chimera:free"),
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
