import "../../src/prompts.gen";
import { generateObject, generateText } from "ai";
import { v } from "convex/values";
import { z } from "zod/v4";
import { internalAction } from "../../_generated/server";
import { openrouter } from "../../lib/ai";
import { exa } from "../../lib/exa";
import { reasearchPrompt } from "../../src/prompts/research.prompt";
import { summarizePrompt } from "../../src/prompts/summarize.prompt";

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
  const { object } = await generateObject({
    model: openrouter("tngtech/deepseek-r1t2-chimera:free"),
    temperature: 0.2,
    schema: z.object({
      queries: z.array(z.string()).describe("Queries to search for"),
    }),
    prompt: reasearchPrompt.toString({
      topicDescription,
      hasSources: Boolean(sources),
      sources,
    })
  });

  return object.queries;
}

async function summarizeWebsiteText(text: string) {
  const { text: summary } = await generateText({
    model: openrouter("tngtech/deepseek-r1t2-chimera:free"),
    temperature: 0.2,
    prompt: summarizePrompt.toString({ text }),
  });
  return summary;
}
