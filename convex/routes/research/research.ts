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
    const queryResults: Awaited<ReturnType<typeof exa.searchAndContents>>[] =
      [];
    for (const query of queries) {
      const results = await exa.searchAndContents(query, {
        numResults: 5,
        type: "auto",
      });
      queryResults.push(results);
    }

    const summaryByUrl = await Promise.all(
      queryResults.flatMap((qr) =>
        qr.results.map(async (r) => ({
          url: r.url,
          summary: await summarizeWebsiteText(r.text),
        })),
      ),
    );

    return {
      topic: args.topicDescription,
      results: queryResults.flatMap((qr) =>
        qr.results.map((r) => ({
          text: summaryByUrl.find((s) => s.url === r.url)?.summary ?? "",
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

async function summarizeWebsiteText(text: string) {
  const systemPrompt = `
    You are a helpful assistant that summarizes the text of a website.
    Make sure to include the most important information and the most relevant details.
  `;
  const { object } = await generateObject({
    model: anthropic("claude-sonnet-4-5-20250929"),
    temperature: 0.2,
    schema: z.object({
      summary: z.string().describe("Summary of the text"),
    }),
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: text,
      },
    ],
  });
  return object.summary;
}
