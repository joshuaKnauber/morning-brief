import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  podcasts: defineTable({
    title: v.string(),
    text: v.string(),
    audioStorageId: v.id("_storage"),
    userId: v.id("users"),
    duration: v.optional(v.number()),
  }),
  topics: defineTable({
    name: v.string(),
    sources: v.optional(v.string()),
    userId: v.id("users"),
  }).index("by_user", ["userId"]),
});
