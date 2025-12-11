# Mockups - AI-Powered Product Mockup Generator

A modern web application that uses AI to generate photorealistic product mockups by seamlessly blending your assets (logos, designs, screenshots) with pre-designed templates.

## Features

### Template Generation
- Generate custom mockup templates using AI (powered by OpenRouter)
- Browse a library of pre-generated templates
- Templates include product shots, lifestyle scenes, and device mockups

### Asset Management
- Upload and manage your design assets
- Support for images and various file types
- Preview and organize your asset library

### Mockup Creation
- **Intuitive 2-step process:**
  1. Select an asset from your library
  2. Describe how to integrate it with the template
- **AI-powered composition:** Advanced image generation that:
  - Matches lighting and perspective
  - Applies realistic shadows and reflections
  - Maintains photorealistic quality
  - Blends textures naturally

### Refinement System
- Refine generated mockups with natural language instructions
- Iterate on designs without starting over
- Fine-tune details like size, position, and lighting

### Export
- Download high-quality mockup images
- One-click download functionality

## Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **TanStack Router** - Type-safe file-based routing
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components (New York variant)
- **Framer Motion** - Smooth animations
- **Masonic** - Masonry grid layouts

### Backend
- **Convex** - Serverless backend platform
  - Real-time database
  - Server functions (queries, mutations, actions)
  - File storage
  - Authentication
- **Convex Auth** - Authentication system

### AI Integration
- **OpenRouter** - AI provider for image generation
- **AI SDK** - Unified AI interface

## Prerequisites

- Node.js 18+ and npm
- OpenRouter API key ([get one here](https://openrouter.ai/))

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd mockups
npm install
```

### 2. Set Up Environment Variables

The project uses the following environment variables:

**Frontend** (`.env.local`):
```env
VITE_CONVEX_URL=<your-convex-deployment-url>
```

**Backend** (Convex dashboard or `convex.json`):
```env
CONVEX_SITE_URL=http://localhost:5173  # or your production URL
OPENROUTER_API_KEY=<your-openrouter-api-key>
```

### 3. Run the Development Server

```bash
npm run dev
```

This will:
1. Start the Convex backend
2. Run the setup script for authentication (first run only)
3. Start the Vite dev server
4. Open your browser to `http://localhost:5173`

The first run will also open the Convex dashboard for configuration.

## Development Commands

```bash
# Run both frontend and backend
npm run dev

# Run frontend only
npm run dev:frontend

# Run backend only
npm run dev:backend

# Build for production
npm run build

# Run linting and type checking
npm run lint
```

## Project Structure

```
mockups/
├── src/                          # Frontend code
│   ├── routes/                   # File-based routes
│   │   ├── __root.tsx           # Root layout
│   │   ├── index.tsx            # Landing page
│   │   ├── create.tsx           # Mockup creation interface
│   │   └── test.tsx             # Testing/admin page
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui components
│   │   └── responsive-modal.tsx # Custom components
│   └── lib/                     # Utility functions
│       ├── utils.ts             # Helper functions
│       └── use-media-query.ts   # Custom hooks
│
├── convex/                       # Backend code
│   ├── routes/                  # Feature-based organization
│   │   ├── templates/           # Template management
│   │   ├── assets/              # Asset upload/management
│   │   └── mockups/             # Mockup generation
│   ├── lib/                     # Shared utilities
│   │   ├── getUser.ts           # Auth helpers
│   │   ├── zodConvex.ts         # Type-safe functions
│   │   └── ai.ts                # AI provider config
│   ├── schema.ts                # Database schema
│   ├── http.ts                  # HTTP routes
│   └── auth.config.ts           # Auth configuration
│
├── CLAUDE.md                     # Development guide for Claude Code
└── README.md                     # This file
```

## How It Works

### 1. Template Creation

Templates are generated using AI with descriptive prompts:

```typescript
// Example: Generate a laptop mockup template
const template = await createTemplate({
  description: "A modern MacBook Pro on a minimalist desk with soft natural lighting"
});
```

### 2. Asset Upload

Users upload their designs (logos, screenshots, UI designs):

```typescript
// Upload flow
1. Select file
2. Generate upload URL
3. Upload to Convex storage
4. Save metadata to database
```

### 3. Mockup Generation

The AI combines templates with assets using a multi-image prompt:

```typescript
// The system:
1. Fetches template and asset images
2. Builds a detailed prompt describing the blend
3. Sends both images to the AI model
4. Generates a photorealistic composition
5. Stores and returns the result
```

### 4. Refinement (Optional)

Users can refine mockups with natural language:

```typescript
// Example refinements
- "Make the logo slightly smaller"
- "Add more contrast"
- "Shift the design to the left"
```

## Database Schema

### Templates
- `name` - Template name
- `imageDescription` - AI generation prompt
- `imageStorageId` - Convex storage ID
- `mockupsCreated` - Usage counter

### Assets
- `fileName` - Original file name
- `fileType` - MIME type
- `fileSize` - Size in bytes
- `storageId` - Convex storage ID
- `uploadedById` - User ID

### Mockups
- `imageStorageId` - Generated mockup storage ID
- `templateId` - Reference to template
- `assetId` - Reference to asset
- `connectionDescription` - User's blend instructions
- `createdById` - User ID

## Authentication

This project uses Convex Auth with domain-based authentication. Users must sign in to:
- Upload assets
- Create mockups
- Access their mockup history

## Customization

### Adding UI Components

This project uses shadcn/ui. To add new components:

```bash
npx shadcn@latest add [component-name]
```

Components are copied into `src/components/ui/` and can be customized directly.

### Modifying AI Behavior

AI configuration is in `convex/lib/ai.ts`. You can:
- Change the AI model
- Adjust generation parameters
- Modify prompts in `convex/routes/mockups/create.ts`

## Contributing

See `CLAUDE.md` for development guidelines and architecture notes.

## License

[Your License Here]

---

Built with [Convex](https://convex.dev/), [React](https://react.dev/), and [OpenRouter](https://openrouter.ai/)
