import { customCtx, NoOp } from "convex-helpers/server/customFunctions";
import {
  zCustomAction,
  zCustomMutation,
  zCustomQuery,
} from "convex-helpers/server/zod";
import { action, mutation, query } from "../_generated/server";
import { getUserOrThrow } from "./getUser";

export const zQuery = zCustomQuery(query, NoOp);
export const zMutation = zCustomMutation(mutation, NoOp);
export const zAction = zCustomAction(action, NoOp);

export const zUserQuery = zCustomQuery(
  query,
  customCtx(async (ctx) => {
    const user = await getUserOrThrow(ctx);
    return { user };
  }),
);
export const zUserMutation = zCustomMutation(
  mutation,
  customCtx(async (ctx) => {
    const user = await getUserOrThrow(ctx);
    return { user };
  }),
);
