# Private visit statistics setup

This project uses Upstash Redis (`@upstash/redis`) rather than `@vercel/kv` because Vercel KV and its SDK have been deprecated. Upstash Redis is the maintained replacement.

## Vercel environment variables

1. Add an Upstash Redis database from the Vercel Marketplace and connect it to this Vercel project.
2. Add the database's REST credentials to Vercel Project Settings → Environment Variables:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
3. Add `ADMIN_KEY` with a long, random secret (do not use the example `kings123` for a public production site).
4. Redeploy after adding the variables.
5. Open `/admin?key=YOUR_ADMIN_KEY` to view the total visit count. The main app contains no navigation link to the admin page.

The app sends at most one visit ping per local calendar day per browser/device, tracked in localStorage. The server increments `total_visits` and `visits:YYYY-MM-DD` in Redis. This is a daily-per-device counter, not unique human analytics; clearing browser storage or using another device can count again.

`ADMIN_KEY` is checked on the server for both the page and stats API. The query key is visible in browser history and URL logs, so use a strong random value and do not share the admin URL.
