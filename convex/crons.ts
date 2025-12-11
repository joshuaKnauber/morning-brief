import { cronJobs } from "convex/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";

const crons = cronJobs();

export const generateUpdates = internalMutation({
  args: {},
  handler: async (ctx, args) => {
    const topics = await ctx.db.query("topics").collect();
    const userIds = topics.map((topic) => topic.userId);
    for (const userId of userIds) {
      await ctx.scheduler.runAfter(0, internal.crons.researchUserTopics, {
        userId,
      });
    }
  },
});

export const getTopicsForUser = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("topics")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const researchUserTopics = internalAction({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const topics = await ctx.runQuery(internal.crons.getTopicsForUser, {
      userId: args.userId,
    });
    const queryResults = await Promise.all(
      topics.map(async (topic) => {
        const results = await ctx.runAction(
          internal.routes.research.research.researchTopic,
          { topicDescription: topic.description, sources: "" },
        );
        return results;
      }),
    );
    const { script, title } = await ctx.runAction(
      internal.routes.script.write.writeScript,
      {
        topics: queryResults.map((result) => ({
          topic: result.topic,
          results: result.results.map((result) => ({
            text: result.text,
            url: result.url,
            title: result.title ?? null,
            publishedData: result.publishedData ?? null,
          })),
        })),
      },
    );
    await ctx.runAction(
      internal.routes.podcast.generatePodcast.generatePodcastEpisode,
      {
        title,
        text: script,
        userId: args.userId,
      },
    );
  },
});

crons.daily(
  "generate morning update podcast",
  { hourUTC: 3, minuteUTC: 0 },
  internal.crons.generateUpdates,
);

export default crons;
