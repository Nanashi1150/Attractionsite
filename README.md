# Kamphaeng Phet tourism — main application

This is V2 promoted to the main application. The earlier version remains in the
sibling Kamphaeng_Phet_Redesign_v1_backup directory.

## Run

```powershell
npm install
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

From the parent Tourist directory, use npm run dev.

## Checks

- npm run build — production build.
- npm test — page rendering, public/admin boundaries, the ten-click gesture,
  local persistence, Maps destinations and photo/source coverage.

## Administrator interface

Click anywhere ten consecutive times, leaving no more than one second between
clicks. Manage Attractions appears in the navigation. Exit admin returns to the
public home page. Reloading also exits admin mode.

This is a browser-local interface switch, not authentication. The application
has no server or shared database. Catalogue edits persist in this browser's
local storage and do not update other visitors' catalogues. Browser storage
limits may prevent saving large uploads; errors are shown instead of claiming
success. Added images must be at most 2 MB.

## Content and photos

See [reference/SOURCES.md](reference/SOURCES.md) for research and photo licenses.
Maps use specific names and localities; no Google API key is required.
Run scripts/download_photos.py followed by scripts/optimize_photos.py to rebuild
the local images (Python and Pillow required).
