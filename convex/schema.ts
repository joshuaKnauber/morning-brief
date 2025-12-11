import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  topics: defineTable({
    name: v.string(),
    description: v.string(),
    userId: v.id("users"),
  }),
});
