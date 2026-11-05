# Family Wahala OS — Change and Verification Notes

## Changes applied
- Responsive family request cards now show the full name, relationship/category badge, reason, amount, due date/status, and three accessible action buttons with 44px tap targets.
- Simplified the header to the app identity, theme toggle, and Request action on small screens. Install and guide controls are available in More tools.
- Dashboard summary now shows Income, Spent, Pending, and Remaining. The detailed Wahala Level card remains and includes a “Why” explanation.
- Budget page separates “Budget left” (budget minus paid expenses) from “Cash left after bills” (income minus paid expenses).
- Refined dark theme colors and mobile spacing; added overflow protection and bottom navigation clearance.
- Added Share App section in More tools with copy feedback and native share support/fallback. App URL is https://family-wahala-os.vercel.app/.
- Preserved existing localStorage keys and structures; no backend/authentication added. Existing manifest and social metadata were left in place.

## Verification
- TypeScript/TSX parser reported zero syntax parse diagnostics for app/page.tsx.
- `npm run build` could not be completed because dependency installation did not finish in the available environment; therefore a production build is not certified.
- Test `npm ci` and `npm run build` before deploying to Vercel.

## Username/password + cloud account update (2026-11-05)
- Added username-only signup/login and logout UI; no Supabase email Auth is used.
- Added server-side scrypt password hashing and signed HTTP-only sessions.
- Added per-account cloud storage for income, budget, requests, expenses, upcoming bills, and goals.
- Account data ownership is taken from the verified session cookie on the server, not from a client-supplied username.
- Added `supabase-setup.sql` and `AUTH_SETUP.md` for the required one-time database setup and server-only secrets.
- Existing local-only records are imported into the cloud on the first signup in that browser.
- Validation: all changed TypeScript/TSX files passed TypeScript transpile/syntax diagnostics. A full Next.js production build could not be run because dependency installation timed out in this environment. Live Supabase signup/login and cross-device tests could not be performed without the project's server-only secret and database setup.
