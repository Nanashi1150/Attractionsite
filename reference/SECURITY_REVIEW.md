# Functionality and security review

Checked: 23 October 2026, Asia/Bangkok.
Scope: application source, installed dependencies and lockfile, React renderer
tests, and HTTP requests to this application's local development and production
preview servers. This application is a static frontend with browser-local edits.

## Findings and changes

| Finding | Impact and scope | Resolution |
| --- | --- | --- |
| Known dependency advisories | Initial `npm audit` reported 2 high-severity packages: Vite 6.3.5 and React Router 7.13.0. Vite advisories include development-server file access issues. React Router was installed but not imported or used by the application, so its framework/server advisories did not establish a reachable remote exploit here. | Updated Vite to 6.4.5, updated the package-manager override, and removed unused React Router. Final audit: 0 known advisories across all installed dependencies. |
| Incomplete persisted-data validation | The previous storage loader checked only required fields. Invalid optional fields could break rendering; a saved reference URL could bypass form-only URL checks. Scope is the same browser/origin, not a public shared database. | Added bounded, explicit schema validation on load and every mutation, safe reference/image URL handling at rendering boundaries, unique IDs, finite numeric ranges and Unicode validation. Unknown object keys are discarded. |
| Stale editor callbacks | A mutation callback captured while admin mode was enabled retained the old authorization state after exit. It could still change this browser's catalogue. | Mutation methods now consult live session state. Exit and unmount revoke old callbacks immediately. |
| Consecutive local updates | Multiple mutations in a single render batch could overwrite a preceding change or restore an entry just deleted locally. | Mutations now use the latest committed catalogue through a ref; storage failures leave the in-memory catalogue unchanged. |
| Browser-storage access errors | Language initialization and switching could throw when the browser blocked local storage. | Guarded reads/writes, usable in-memory language switching, and synchronized the document language. |
| Image validation and recovery | File upload relied on declared MIME type, and a failed image stayed in the fallback state even after changing its URL. | Added raster signature, data-URI, URL and size checks; prevented stale upload completion from overwriting a newer selection; made image fallback recover on source changes. External image requests omit the referrer. |
| Local server and production policy | Development servers expose source by design and need explicit file/origin boundaries. Production HTML had no CSP. | Bound local servers to loopback, restricted filesystem access, disabled cross-origin CORS permission, kept Host validation, added defensive local response headers, and inserted a production CSP restricting scripts to the same origin. Production hosting must apply response headers separately. |

## Verification

- `npm test`: 25 tests passed, including public/editor separation, click count and
  timeout, CRUD persistence, stale-callback revocation, consecutive changes,
  blocked storage, text escaping, malformed/oversized data, unsafe URLs, image
  signatures, image fallback recovery and catalogue/location coverage.
- `npm run build`: passed using Vite 6.4.5.
- `npm run check:http`: passed development and production HTTP checks. Verified
  defensive response headers; no CORS permission for an untrusted origin; a 403
  for an untrusted Host header; blocked environment files including Windows
  alternate-path and raw/import forms; blocked Git metadata, original photos and
  outside-root files; production HTML/CSP/JS/CSS; all five photo assets; and no
  original application source exposed by the production preview.
- `npm audit`: 0 known vulnerabilities after changes. This is a snapshot of
  published advisory data and installed versions at review time.

## Remaining limits

1. **The ten-click gesture is not authentication.** Any visitor can enable the
   local editor. Changes affect that browser's catalogue. No backend or shared
   records are protected by this switch. Add real authentication and server-side
   authorization before introducing shared administration.
2. Local storage is editable by users and accessible to scripts on the same
   origin. It is unsuitable for secrets, sessions or sensitive records. Valid
   edits are retained under the existing key; invalid catalogues fall back to
   defaults without overwriting the stored value automatically.
3. Third-party images, fonts and Google Maps require network access. URL scheme
   validation does not certify the trustworthiness of an external website.
4. The generated CSP is embedded in HTML. Production header deployment, HTTPS,
   frame-embedding controls and host-specific configuration remain the hosting
   operator's responsibility. No hosted production environment was available
   for this review.
5. No connected browser was available. Visual/mobile layout, full browser
   interaction, CSP enforcement in a browser and live Google Maps rendering were
   not verified. Renderer tests and local HTTP checks passed; this review is
   not a comprehensive browser penetration test.

## References

- [OWASP HTML5 Security Cheat Sheet — storage](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)
- [Vite server options](https://v6.vite.dev/config/server-options)
- [Vite Windows file-access advisory](https://github.com/vitejs/vite/security/advisories/GHSA-fx2h-pf6j-xcff)
- [React Router framework-mode advisory and applicability](https://github.com/remix-run/react-router/security/advisories/GHSA-49rj-9fvp-4h2h)
