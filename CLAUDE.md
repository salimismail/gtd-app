# CLAUDE.md

## Project

GTD Flow — Personal productivity app based on GTD (Getting Things Done) with voice-first input via Wispr Flow. Claude API parses natural language into structured GTD items. Local-only storage with IndexedDB.

## Commands

All commands run from `gtd-app/` directory:

- Install dependencies: `npm install`
- Dev server: `npm run dev` (http://localhost:5173)
- Build: `npm run build`
- Type check: `npx tsc --noEmit`

## Tech Stack

- Vite + React 19 + TypeScript (strict mode)
- Tailwind CSS 4 (via @tailwindcss/vite plugin)
- Dexie.js v4 (IndexedDB) + dexie-react-hooks for reactive queries
- Zustand for UI state
- Claude API (tool_use with strict schema) for GTD parsing
- Lucide React for icons

## Architecture

- **Data layer**: Dexie `useLiveQuery` hooks for reactive IndexedDB queries (single source of truth)
- **State**: Zustand stores for ephemeral UI state only; persistent data lives in Dexie
- **AI parsing**: Captures go to Inbox instantly, Claude parses in background, auto-moves if confidence > 0.8
- **Projects**: Ukraine, Luck, YxO, ExO, MoL, Household, Finance (seeded on first load)

## Coding Conventions

- TypeScript strict mode
- Named exports, no default exports
- async/await over raw promises
- camelCase functions/variables, PascalCase types/interfaces
- kebab-case file names (e.g., `capture-input.tsx`)
