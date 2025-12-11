import { zUserQuery } from "../lib/zodConvex";

export const getUserPodcasts = zUserQuery({
  args: {},
  handler: async (ctx) => {
    const podcasts = await ctx.db
      .query("podcasts")
      .filter((q) => q.eq(q.field("userId"), ctx.user._id))
      .order("desc")
      .collect();

    return Promise.all(
      podcasts.map(async (podcast) => ({
        ...podcast,
        audioUrl: await ctx.storage.getUrl(podcast.audioStorageId),
      })),
    );
  },
});
