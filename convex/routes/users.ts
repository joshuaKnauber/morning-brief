import { ConvexError, v } from "convex/values";
import { internalQuery } from "../_generated/server";

export const getUserById = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new ConvexError("User not found");
    return user;
  },
});
