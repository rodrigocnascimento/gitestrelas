# Agent Guidelines for gitestrelas

## Commands
- Dev server: `npm run dev`
- Build (prod): `npm run build`
- Build (dev): `npm run build:dev`
- Lint: `npm run lint`
- Test: `npm run test`
- Test watch: `npm run test:watch`
- Preview: `npm run preview`

## Project Structure
- Entry point: `src/main.tsx`
- App component: `src/App.tsx`
- Pages: `src/pages/`
- Components: `src/components/` (UI components in `src/components/ui/`)
- Styles: Tailwind CSS (configured in `tailwind.config.ts` and `postcss.config.js`)
- Path alias: `@` maps to `src/` (configured in tsconfig.json and vite.config.ts)

## Testing
- Uses Vitest
- Test files: `*.test.ts` or `*.test.tsx` colocated with source or in `__tests__` folders
- Single test: `npx vitest run src/file.test.ts` (or use `npm test` for all)
- Test setup: `src/test/setup.ts` (includes jest-dom and matchMedia mock)
- Test config: `vitest.config.ts` (uses jsdom environment, globals, and @ alias)

## Linting
- Uses ESLint with React and TypeScript plugins
- Config: `eslint.config.js`

## Notes
- Uses React Router v6 for routing
- State management: React Query (QueryClient in App.tsx)
- UI library: Shadcn UI components
- Theme: next-themes (system theme toggle in App.tsx)
- Error reporting: Sentry (configured in main.tsx)