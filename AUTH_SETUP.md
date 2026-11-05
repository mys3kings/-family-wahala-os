# Username + password accounts and private cloud sync

The app now provides username-only signup/login (no email login), password hashing, an HTTP-only signed session cookie, and per-account cloud data. Each data API request derives the account username from the signed server session; the browser cannot choose another user's data owner.

## Important one-time deployment requirement

A Supabase publishable key is intentionally not enough to create protected tables or perform secure server-side authentication. For security, the app does **not** put a service-role key in browser JavaScript. The supplied publishable key is not a substitute for this privileged server secret.

To activate the feature:

1. In Supabase SQL Editor, run the included `supabase-setup.sql` once. It creates `wahala_users` and `wahala_data`, enables RLS, and deliberately creates no browser-access policies.
2. In your hosting provider's server environment settings, add `SUPABASE_URL` (already shown in `.env.example`), `SUPABASE_SERVICE_ROLE_KEY` (the project's service-role/secret key), and `AUTH_SESSION_SECRET` (a unique random secret of at least 32 characters). These are server-only values. Never add the service-role key to client-side code or a `NEXT_PUBLIC_` variable.
3. Redeploy the app.

After this one-time setup, users can create accounts and sign in from any device using only their username and password. Their income, budget, requests, expenses, upcoming bills, and goals are loaded from the cloud. Logging out does not delete their account or data.

## Security notes

- Passwords are salted and hashed with Node.js scrypt; the original password is never stored.
- Sessions use a signed, HTTP-only, same-site cookie.
- All user data reads and writes are scoped server-side to the username in that signed session.
- The service-role key is used only by server API routes and bypasses RLS; therefore never expose it. Direct browser access to the tables has no RLS policies.
- This custom username/password system does not use Supabase Auth or email addresses.
- This is not a password-recovery system. Users should keep their password safe; a future secure reset process would require an additional verified recovery method.
