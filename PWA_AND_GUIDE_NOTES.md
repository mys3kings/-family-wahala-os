# Family Wahala OS updates

## Included
- PWA manifest at `public/manifest.json` with standalone display, app name, theme color, and the supplied app-image URL.
- A service worker that does not cache personal records or API responses.
- An Install app control. It invokes Chrome's native installation prompt when the browser exposes it and otherwise displays installation instructions.
- Social share preview metadata using the supplied share-image URL.
- A professional first-visit Quick Start walkthrough for Dashboard, Expenses, Family Requests, Budget & Goals, and More Tools. It can be revisited using the book icon.

## Important deployment checks
- Deploy over HTTPS for Chrome installation support.
- Chrome needs valid install icons in the required sizes. The supplied app image URL is referenced as both 192x192 and 512x512, but the image dimensions could not be verified in this environment. If Chrome does not offer installation, create actual square 192x192 and 512x512 PNG icon files from the supplied image and point the manifest entries to those files.
- WhatsApp/social platforms may cache link previews; use their preview debugger or wait for their cache to refresh after deployment.
- The project dependency installation timed out in this environment, so a full production build and TypeScript check were not completed here.
