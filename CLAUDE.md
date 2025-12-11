# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the application
```bash
npm run dev
```
This runs both frontend (Vite) and backend (Convex) in parallel. The first run will:
1. Initialize Convex backend
2. Run the setup script (`setup.mjs`) for Convex Auth configuration
3. Open the Convex dashboard
4. Launch the frontend with browser auto-open

### Frontend only
```bash
npm run dev:frontend
```

### Backend only
```bash
npm run dev:backend
```

### Build
```bash
npm run build
```
Runs TypeScript compiler and Vite build.

### Linting
```bash
npm run lint
```
Runs TypeScript type checking and ESLint. Note: ESLint is configured to allow async functions without await for consistency with Convex handlers.

## Architecture Overview

### Tech Stack
- **Frontend**: React 19 + Vite + TanStack Router (file-based routing)
- **Backend**: Convex (serverless backend with real-time database)
- **Authentication**: Convex Auth
- **Styling**: Tailwind CSS v4 (with Radix UI components)
- **AI Integration**: OpenRouter via AI SDK

### Project Structure

#### Frontend (`src/`)
- **Routing**: File-based routing via TanStack Router
  - Routes are defined in `src/routes/`
  - `__root.tsx` - Root layout
  - `_app.tsx` - Authenticated app layout with navigation header
  - `signIn.tsx` - Sign-in page
  - `index.tsx` - Landing/home page
  - Route tree is auto-generated in `src/routeTree.gen.ts`
- **Components**: Radix UI-based components in `src/components/ui/`
- **Path alias**: `@/*` maps to `./src/*`

#### Backend (`convex/`)
- **Schema**: Defined in `convex/schema.ts`
  - Uses Convex Auth tables
  - Custom `templates` table (currently empty)
- **Functions organized by feature** in `convex/routes/`:
  - `users.ts` - User-related queries
  - `imagegen/generate.ts` - Image generation functionality
- **Shared utilities** in `convex/lib/`:
  - `getUser.ts` - User authentication helpers (`getUserOrThrow`, `getUserById`)
  - `zodConvex.ts` - Zod-validated Convex functions using `convex-helpers`
  - `ai.ts` - OpenRouter AI provider configuration
  - `schemas/` - Zod schemas (e.g., `openrouter.ts`)
  - `utils/` - Utility functions (e.g., `dataUrltoBlob.ts`)
- **HTTP routes**: Configured in `convex/http.ts` (currently only auth routes)
- **Auth config**: `convex/auth.config.ts` defines authentication providers

### Authentication Flow
- Uses Convex Auth with domain-based authentication
- Protected routes wrapped in `_app.tsx` layout
- Unauthenticated users redirected to landing page
- Auth state managed via `ConvexAuthProvider` in `main.tsx`

### Convex Backend Patterns

#### Standard functions
Use vanilla Convex functions from `_generated/server`:
```typescript
import { query, mutation, action } from "./_generated/server";
```

#### Zod-validated functions
Use helpers from `convex/lib/zodConvex.ts` for type-safe, validated functions:
```typescript
import { zQuery, zMutation, zAction, zUserQuery, zUserMutation } from "./lib/zodConvex";
```
- `zUserQuery` and `zUserMutation` automatically inject authenticated user into context
- Uses `getUserOrThrow` to ensure user is authenticated

#### User authentication
- `getUserOrThrow(ctx)` - Gets authenticated user or throws error
- `getUserById(ctx, userId)` - Gets user by ID or throws error

### AI Integration
- OpenRouter configured in `convex/lib/ai.ts`
- API key stored in `process.env.OPENROUTER_API_KEY`
- Uses AI SDK with OpenRouter provider

### shadcn/ui Components
This project uses [shadcn/ui](https://ui.shadcn.com/) for UI components:
- **Style**: New York variant
- **Theme**: Neutral base color with CSS variables
- **Icon library**: Lucide React
- **Location**: All components in `src/components/ui/`
- **Utility**: `cn()` helper in `src/lib/utils.ts` for className merging

**Installed components**:
- accordion, alert-dialog, button, card, checkbox, dialog, drawer
- field, input, label, select, separator, sheet, spinner, textarea, empty

**Adding new components**:
```bash
npx shadcn@latest add [component-name]
```
Components are copied into your project and can be customized directly.

## Environment Variables
- `VITE_CONVEX_URL` - Convex deployment URL (frontend)
- `CONVEX_SITE_URL` - Site URL for auth (backend)
- `OPENROUTER_API_KEY` - OpenRouter API key (backend)
- Setup script (`setup.mjs`) handles Convex Auth configuration on first run

## Code Conventions
- TypeScript strict mode enabled
- ESLint allows unused variables/args starting with `_`
- Async Convex handlers don't require await
- Generated files in `convex/_generated/` and `src/routeTree.gen.ts` should not be edited
