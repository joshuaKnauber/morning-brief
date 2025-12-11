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
import type * as generatePodcast from "../generatePodcast.js";
import type * as http from "../http.js";
import type * as lib_ai from "../lib/ai.js";
import type * as lib_exa from "../lib/exa.js";
import type * as lib_getUser from "../lib/getUser.js";
import type * as lib_zodConvex from "../lib/zodConvex.js";
import type * as podcasts from "../podcasts.js";
import type * as routes_research_research from "../routes/research/research.js";
import type * as routes_users from "../routes/users.js";
import type * as test_samplePodcast from "../test/samplePodcast.js";
import type * as test_testPodcast from "../test/testPodcast.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  generatePodcast: typeof generatePodcast;
  http: typeof http;
  "lib/ai": typeof lib_ai;
  "lib/exa": typeof lib_exa;
  "lib/getUser": typeof lib_getUser;
  "lib/zodConvex": typeof lib_zodConvex;
  podcasts: typeof podcasts;
  "routes/research/research": typeof routes_research_research;
  "routes/users": typeof routes_users;
  "test/samplePodcast": typeof test_samplePodcast;
  "test/testPodcast": typeof test_testPodcast;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
