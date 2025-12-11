import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

const crons = cronJobs();

export const generateUpdates = internalAction({
  args: {},
  handler: async (ctx, args) => {},
});

crons.daily(
  "generate morning update podcast",
  { hourUTC: 3, minuteUTC: 0 },
  internal.crons.generateUpdates,
);

export default crons;
