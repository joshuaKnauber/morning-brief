/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as lib_ai from "../lib/ai.js";
import type * as lib_exa from "../lib/exa.js";
import type * as lib_getUser from "../lib/getUser.js";
import type * as lib_zodConvex from "../lib/zodConvex.js";
import type * as routes_research_research from "../routes/research/research.js";
import type * as routes_users from "../routes/users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  http: typeof http;
  "lib/ai": typeof lib_ai;
  "lib/exa": typeof lib_exa;
  "lib/getUser": typeof lib_getUser;
  "lib/zodConvex": typeof lib_zodConvex;
  "routes/research/research": typeof routes_research_research;
  "routes/users": typeof routes_users;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
