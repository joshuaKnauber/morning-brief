import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

export const savePodcast = internalMutation({
  args: {
    title: v.string(),
    text: v.string(),
    audioStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("podcasts", args);
  },
});

export const listPodcasts = query({
  handler: async (ctx) => {
    return await ctx.db.query("podcasts").order("desc").collect();
  },
});

export const getPodcast = query({
  args: { id: v.id("podcasts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getAudioUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
