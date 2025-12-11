import { v } from "convex/values";
import { zUserMutation } from "../lib/zodConvex";
import { z } from "zod/v3";

export const saveTopics = zUserMutation({
  args: {
    topics: z.array(
      z.object({
        name: z.string(),
        sources: z.array(z.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    for (const topic of args.topics) {
      await ctx.db.insert("topics", {
        name: topic.name,
        sources: topic.sources.length > 0 ? topic.sources : undefined,
        userId: ctx.user._id,
      });
    }
  },
});
