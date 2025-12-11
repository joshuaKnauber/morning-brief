import { generateObject } from "ai";
import { v } from "convex/values";
import { z } from "zod/v4";
import { internalAction } from "../../_generated/server";
import { anthropic } from "../../lib/ai";
import { exa } from "../../lib/exa";

export const researchTopic = internalAction({
  args: { topicDescription: v.string(), sources: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const queries = await generateQueries(
      args.topicDescription,
      args.sources ?? "",
    );
    const queryResults = await Promise.all(
      queries.map(async (query) => {
        const results = await exa.searchAndContents(query, {
          numResults: 10,
          type: "auto",
        });
        return results;
      }),
    );
    return {
      topic: args.topicDescription,
      results: queryResults.flatMap((qr) =>
        qr.results.map((r) => ({
          text: r.text,
          url: r.url,
          title: r.title,
          publishedData: r.publishedDate,
        })),
      ),
    };
  },
});

async function generateQueries(topicDescription: string, sources: string) {
  const systemPrompt = `
    You are a helpful assistant that generates queries to search for a given topic.
  `;
  const { object } = await generateObject({
    model: anthropic("claude-sonnet-4-5-20250929"),
    temperature: 0.2,
    schema: z.object({
      queries: z.array(z.string()).describe("Queries to search for"),
    }),
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `
Topic: ${topicDescription}
${sources ? `Sources: ${sources}` : ""}`.trim(),
      },
    ],
  });

  return object.queries;
}
