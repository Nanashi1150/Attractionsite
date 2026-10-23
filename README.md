# Kamphaeng Phet tourism — main application

A bilingual tourism website for Kamphaeng Phet, with researched visitor
information, Google Maps destinations and a browser-local catalogue editor.

## Run

```powershell
npm ci
npm run dev
```

Open http://127.0.0.1:5173/. The development server binds to loopback by default.

## Checks

```powershell
npm test
npm run build
npm run check:http
npm audit
```

Tests cover page rendering, public/admin boundaries, the ten-click gesture,
local persistence, Maps destinations, photo/source coverage, unsafe URLs,
malformed storage and image input. HTTP checks require a current build and
exercise local dev/production responses, access restrictions and assets.

Use `npm run preview` to inspect the production build at http://127.0.0.1:4173/.

## Administrator interface

Click anywhere ten consecutive times, leaving no more than one second between
clicks. Manage Attractions appears in the navigation. Exit admin returns to the
public home page. Reloading also exits admin mode.

This is a browser-local interface switch, not authentication. The application
has no server or shared database. Catalogue edits persist in this browser's
local storage and do not update other visitors' catalogues. Browser storage
limits may prevent saving large uploads; errors are shown instead of claiming
success. Added images must be at most 2 MB.

The editor accepts up to 100 attractions, bounds text and catalogue sizes, checks
reference URL schemes and raster-image signatures, and rejects malformed saved
data. Unsafe or corrupt saved catalogues fall back to the researched defaults;
the existing storage key is retained so valid edits continue to load.

## Security and deployment

See [the security review](reference/SECURITY_REVIEW.md) for findings, fixes,
verification results and limits. Dependency scans check known published
advisories; they do not prove the application is free of vulnerabilities.

Deploy the generated `dist/` directory using an HTTPS static host. The production
HTML includes a Content Security Policy. Configure the headers from
`config/security.mjs` on the production host as well; the Vite configuration
applies those response headers only to local dev/preview servers. Frame embedding
protection requires the host's `X-Frame-Options` or `frame-ancestors` header.
The development server is for local development and must not be used as public
production hosting.

A shared administration service would require a backend, real authentication
and server-side authorization. The current click gesture and browser storage
must not be used to protect sensitive records or credentials.

## Content and photos

See [reference/SOURCES.md](reference/SOURCES.md) for research and photo licenses.
Maps use specific names and localities; no Google API key is required.
Run scripts/download_photos.py followed by scripts/optimize_photos.py to rebuild
the local images (Python and Pillow required).
