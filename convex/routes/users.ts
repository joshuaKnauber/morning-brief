import { ConvexError, v } from "convex/values";
import { internalQuery, query } from "../_generated/server";
import { zQuery } from "../lib/zodConvex";

export const getUserById = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new ConvexError("User not found");
    return user;
  },
});

export const getCurrentUser = zQuery({
  args: {},
  handler: async (ctx) => {
    return ctx.auth.getUserIdentity();
  },
});
