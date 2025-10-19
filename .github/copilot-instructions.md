<!-- .github/copilot-instructions.md -->
# Project-specific instructions for AI coding agents

This project is a Next.js 13 (App Router) TypeScript frontend called "Toyota Financial Navigator". Keep suggestions focused, small, and consistent with the patterns below.

Important context (read before editing):
- Entry UI: `app/page.tsx` controls the single-page flow (hero → profile → dashboard). Changes there affect navigation state and props passed to `Dashboard` and `FinancialProfile`.
- Layout & global UI: `app/layout.tsx` and `app/globals.css` define global layout, Toaster, Tailwind utilities and custom classes (`.btn-primary`, `.card`, `.input-field`, etc.). Prefer using these classes rather than adding new utilities unless necessary.
- Types: Domain shapes are in `types/financial.ts`. Use these interfaces for new component props and helpers to keep consistent typings.
- Forms: `components/FinancialProfile.tsx` uses `react-hook-form` + `zod` via `zodResolver`. Follow the same pattern for validation and default values in new forms.
- Client components: Files that use state or hooks are marked with `"use client"` at the top. Keep server/client boundaries in mind — avoid using browser APIs or hooks in server components.

Build / run / lint
- Dev server: `npm run dev` (runs `next dev`).
- Production build: `npm run build` then `npm run start`.
- Linting: `npm run lint` (uses `next lint`).

Conventions & patterns to follow
- Path aliases: imports use `@/` (see `tsconfig.json` paths). Use `@/components/...` or `@/types/...` when referencing project files.
- Styling: Tailwind utility-first classes + a few custom component classes in `globals.css`. Reuse `.btn-primary`, `.btn-secondary`, `.card`, `.input-field` where possible.
- Icons & animation: `lucide-react` for icons, `framer-motion` for basic entrance/transition animations. Keep motion subtle and consistent with existing components.
- Data flow: `app/page.tsx` holds high-level UI state and passes `FinancialData` to `Dashboard`. Avoid introducing global state libraries; prefer prop drilling or lightweight context only if justified.
- Types-first: Use `types/financial.ts` interfaces for any data that represents user financial info, vehicle recommendations, or AI suggestions.

What to change in PRs (practical guidance)
- Small, focused changes: prefer incremental PRs that update one component or behavior. Each PR should include a brief note about which UX state was affected (e.g., "Profile default values" or "Dashboard health calc").
- Follow existing validation: when adding forms, mirror `zod` schemas and `react-hook-form` integration from `FinancialProfile.tsx`.
- Accessibility: keep semantic inputs and labels as in `FinancialProfile.tsx`. Buttons use descriptive text and icons.

Examples from the codebase (use as templates)
- Form + validation: `components/FinancialProfile.tsx` — uses `zod`, `zodResolver`, `useForm`, and `defaultValues`.
- Type-driven UI: `components/Dashboard.tsx` reads `FinancialData` and computes `FinancialHealthScore` in a `useEffect` based on `types/financial.ts`.
- Styling primitives: `app/globals.css` defines `.input-field`, `.card`, `.btn-primary`, `.btn-secondary` — reuse them.

Restrictions / gotchas
- Do not add server-only logic into client components. If a helper needs node-only APIs, move it to a server module and call via API route or server component.
- Avoid introducing a global state manager (Redux, Zustand) unless a real need arises; current flow uses local state and props.
- Keep bundle size small: importing large datasets or heavy libraries (beyond existing deps in `package.json`) requires justification.

If you need more info
- Look first at `app/page.tsx`, `components/FinancialProfile.tsx`, `components/Dashboard.tsx`, `types/financial.ts`, and `app/globals.css` for the majority of conventions.
- If something isn't discoverable (e.g., backend API keys, CI steps), ask the repo owner.

Ask the human for clarification when uncertain about product intent (e.g., changing loan formulas, UX flows that affect downstream pages).

-- End of file
