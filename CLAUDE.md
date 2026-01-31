# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Morning Brief is an AI-powered personalized morning podcast generator. Users specify topics of interest, and the system automatically researches those topics daily using web search (via Exa), generates a podcast script with Claude, and converts it to audio with Google Cloud Text-to-Speech.

**Tech Stack:**
- **Frontend:** React 19 + TanStack Router + Tailwind CSS v4
- **Backend:** Convex (serverless backend with real-time database)
- **AI:** Anthropic Claude (via AI SDK), Exa (web search), Google Cloud TTS
- **Auth:** Convex Auth

## Development Commands

```bash
# Start development (runs frontend + backend in parallel)
npm run dev

# Development servers individually
npm run dev:frontend  # Vite dev server on http://localhost:5173
npm run dev:backend   # Convex backend dev mode

# Build
npm run build         # TypeScript check + Vite build

# Lint (runs TypeScript check + ESLint)
npm run lint

# Preview production build
npm run preview
```

## Convex Backend Architecture

This project uses Convex extensively. **Follow the Convex coding guidelines in `.cursor/rules/convex_rules.mdc` strictly** - this is critical for maintaining consistency.

### Key Convex Patterns

1. **New Function Syntax (Required):** Always use the object syntax with explicit `args`, `returns`, and `handler`:
   ```typescript
   export const myFunction = query({
     args: { userId: v.id("users") },
     returns: v.array(v.string()),
     handler: async (ctx, args) => { /* ... */ },
   });
   ```

2. **Node Runtime Actions:** Actions that use Node.js APIs (like ElevenLabs SDK, AI SDK) require `"use node";` at the top of the file.

3. **Internal vs Public Functions:**
   - Use `internalAction`, `internalQuery`, `internalMutation` for backend-only functions
   - Use `action`, `query`, `mutation` for public API endpoints
   - Import from `internal` object (from `_generated/api`) for internal function references

4. **File-based Routing:** Convex uses file-based routing. A function `f` in `convex/routes/topics.ts` is referenced as `api.routes.topics.f` (or `internal.routes.topics.f` for internal functions).

### Database Schema

Located in `convex/schema.ts`:
- **users:** From `@convex-dev/auth` (authentication tables)
- **topics:** User-defined topics to research (indexed by `userId`)
- **podcasts:** Generated podcast episodes with audio stored in Convex file storage

### Cron Jobs

Daily podcast generation runs at 3:00 AM UTC (see `convex/crons.ts`):
1. Fetch all user topics
2. For each user, research their topics in parallel
3. Generate podcast script from research results
4. Convert script to audio via ElevenLabs
5. Save podcast to database

### Pipeline Flow

**Research → Script → Audio Generation:**

1. **Research** (`convex/routes/research/research.ts`):
   - Generate search queries from topic descriptions using Claude
   - Execute searches via Exa API
   - Summarize each result with Claude
   - Return structured research data

2. **Script Writing** (`convex/routes/script/write.ts`):
   - Takes research results for multiple topics
   - Generates a conversational podcast script optimized for TTS
   - **Critical:** Script must be plain text (no markdown, special chars) for Google TTS
   - Generates title from script

3. **Audio Generation** (`convex/routes/podcast/generatePodcast.ts`):
   - Converts script to audio using Google Cloud Text-to-Speech API
   - Uses the high-quality "en-US-Journey-F" voice for natural-sounding speech
   - **Configuration**: All TTS settings (voice, language, pitch, speaking rate, volume) are centralized in the `TTS_CONFIG` constant at the top of the file for easy customization
   - Stores audio in Convex file storage (`_storage` table)
   - Saves podcast metadata to `podcasts` table

## Frontend Architecture

**TanStack Router** is used for routing with file-based route definitions in `src/routes/`:
- `__root.tsx`: Root layout
- `_layout.tsx`: Authenticated layout wrapper
- `_layout/index.tsx`: Main dashboard
- `signIn.tsx`: Sign-in page

**Auth Flow:**
- Uses `@convex-dev/auth/react` with `ConvexAuthProvider`
- Auth configuration in `convex/auth.config.ts` (currently configured for Convex domain-based auth)

**State Management:**
- Convex React hooks (`useQuery`, `useMutation`, `useAction`) provide real-time reactivity
- No separate state management library needed

## Environment Variables

Required environment variables (set in Convex dashboard for backend):
- `ANTHROPIC_API_KEY`: Claude API key
- `EXA_API_KEY`: Exa web search API key
- `GOOGLE_TTS_API_KEY`: Google Cloud Text-to-Speech API key
- `CONVEX_SITE_URL`: Your deployed site URL (for auth)
- `OPENROUTER_API_KEY`: Optional, if using OpenRouter (configured but not actively used)

For local development:
- `VITE_CONVEX_URL`: Convex deployment URL (auto-generated, set in `.env.local`)

## AI Integration Notes

- **Claude Sonnet 4.5** is the primary model (`tngtech/deepseek-r1t2-chimera:free`)
- AI SDK (`ai` package) is used for structured generation (`generateObject`, `generateText`)
- All AI calls use `temperature: 0.2` for consistency
- Zod v4 schemas define AI output structure

## Important Patterns

1. **Sequential Processing in Crons:** The cron job processes topics sequentially (not in parallel) to avoid rate limits. Consider parallelization if performance becomes an issue.

2. **TTS-Optimized Text:** When generating scripts, ensure output is plain text without markdown formatting, as it goes directly to Google Cloud TTS.

3. **File Storage:** Audio files are stored in Convex's built-in file storage (`ctx.storage.store()`). Access via `ctx.storage.getUrl(storageId)` which returns signed URLs.

4. **Type Safety:** Strongly typed IDs (`Id<"users">`, `Id<"podcasts">`, etc.) are enforced throughout. Use `Id` type from `_generated/dataModel`.

5. **Path Alias:** `@/` is aliased to `./src/` in both Vite and TypeScript configs for clean imports.
