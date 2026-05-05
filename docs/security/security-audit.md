# Security Audit Report
**Project:** ajolote-home-ui
**Original audit date:** 2026-03-26 — **Last updated:** 2026-05-04
**Auditor:** frontend-security-auditor (Claude Opus)
**Scope:** Partial source audit — src/auth/, src/buy/, src/home/, src/myAccount/client/, src/myAccount/router/, src/router/, src/shared/api/, index.html, .env files, dependencies

**Excluded from scope:** src/myAccount/admin/, src/myAccount/agent/

---

## Current Status Summary

| Severity | Original | Remaining |
|----------|----------|-----------|
| CRITICAL | 2        | 0         |
| HIGH     | 5        | 1         |
| MEDIUM   | 7        | 1         |
| LOW      | 5        | 1         |

---

## CRITICAL

### [C1] ~~Auth tokens stored in localStorage~~ — **RESOLVED**
> **Resolved:** Cookie migration completed. `access_token` and `refresh_token` are now
> set as `httpOnly=True, Secure=True, SameSite=Lax` cookies by the backend
> (`apps/users/views/auth.py → _set_auth_cookies`). The Axios instance uses
> `withCredentials: true` so the browser sends them automatically. No token ever
> touches `localStorage` or JS-accessible state.
>
> The `session_active=1` cookie is intentionally `httpOnly=False` — it is a boolean
> signal (value is literally `"1"`) that lets the frontend avoid the flash-of-login-screen
> on page load and detect cross-tab logouts. It contains no secret data.

### [C2] ~~Sensitive credentials committed to version control~~ — **RESOLVED**
> **Resolved:** `.env` is listed in `.gitignore`. A `.env.example` with placeholder
> values is committed instead. All runtime config uses `import.meta.env.VITE_*`.

---

## HIGH

### [H1] ~~Axios instance configured without a request timeout~~ — **RESOLVED**
> **Resolved:** `axios.instance.ts` now includes `timeout: 15000`.

### [H2] ~~Full user object (PII) stored in localStorage~~ — **RESOLVED**
> **Resolved:** No user data is written to `localStorage`. The user object lives
> exclusively in the `AuthContext` React state, populated from `/auth/me` on mount.

### [H3] Missing Content-Security-Policy (CSP) header — **OPEN**
- **File:** `index.html`
- **Description:** No `Content-Security-Policy` meta tag or server header is set.
  Without CSP, the browser permits inline scripts and third-party script execution,
  making XSS exploitation easier.
- **Note:** With tokens in httpOnly cookies (C1 resolved), an XSS attacker cannot
  exfiltrate credentials — they can only make authenticated requests same-origin.
  Severity is lower than when tokens were in localStorage, but CSP is still best practice.
- **Fix:** Add a `Content-Security-Policy` HTTP header in Nginx/server config (preferred
  over meta tag for stronger enforcement). Minimum viable policy:
  ```
  default-src 'self';
  script-src 'self' https://accounts.google.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' https: data:;
  connect-src 'self' https://api.avakanta.com;
  font-src 'self';
  ```

### [H4] ~~Hardcoded HTTP fallback in Axios base URL~~ — **RESOLVED**
> **Resolved:** `axios.instance.ts` now throws `new Error("VITE_API_BASE_URL is not defined")`
> if the env var is absent. No HTTP fallback.

### [H5] ~~react-router-dom vulnerable to XSS via Open Redirects~~ — **RESOLVED**
> **Resolved:** Upgraded to `react-router-dom@7.13.2`, well past the affected 6.x range.

---

## MEDIUM

### [M1] ~~JWT decoded client-side via atob without signature verification~~ — **RESOLVED**
> **Resolved:** No client-side JWT decoding. `auth.context.tsx` uses the
> `refresh_expires_at` field returned by the `/auth/me` and login responses
> (a millisecond epoch set server-side) as the auto-logout timer. No `atob` or
> JWT parsing in the frontend.

### [M2] ~~Role-based routing relies on role from localStorage~~ — **RESOLVED**
> **Resolved:** `role` is derived from `user.memberships[0].role`, where `user` comes
> from the `/auth/me` API response (verified by the backend JWT). The backend enforces
> role-based access on every protected endpoint via `TenantMiddleware` and
> `CookieJWTAuthentication`. The frontend role is used only for UI routing, not
> for access control decisions.

### [M3] ~~Protected route /mi-cuenta lacks a router-level guard~~ — **RESOLVED**
> **Resolved:** `/mi-cuenta` is now wrapped in `<ProtectedRoute>` in `app.router.tsx`.
> `ProtectedRoute` (`src/auth/guardian/ProtectedRoute.tsx`) reads `isLoadingUser` and
> `isAuthenticated` from `AuthContext` and renders a spinner → `LoginPage` → children,
> with no race condition. `AuthGuard` was removed from `MiCuentaPage`.

### [M4] File upload lacks client-side MIME type and size validation — **OPEN**
- **File:** `src/myAccount/client/actions/upload-client-property-files.actions.ts`
- **Description:** Files are sent to the backend without client-side validation of
  MIME type or size. The backend must validate server-side; the frontend currently
  provides no early feedback for oversized or wrong-format files.
- **Fix:** Validate before upload:
  ```typescript
  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
  const ALLOWED = ["application/pdf", "image/jpeg", "image/png"];
  if (!ALLOWED.includes(file.type) || file.size > MAX_SIZE) { /* reject */ }
  ```

### [M5] ~~console.error calls expose data in production browser console~~ — **RESOLVED**
> **Resolved:** `vite.config.ts` includes `esbuild: { drop: mode === "production" ? ["console", "debugger"] : [] }`.
> All `console.*` calls are stripped from production builds.

### [M6] ~~Registration inputs lack maxLength constraints~~ — **RESOLVED**
> **Resolved:** `RegisterPage.tsx` has `maxLength={100}` (name), `maxLength={254}` (email),
> `maxLength={20}` (phone). `AuthModal.tsx` has `maxLength={6}` (OTP), `maxLength={100}` (name fields).

### [M7] ~~MyAccountRouter returns null for unknown roles~~ — **RESOLVED**
> **Resolved:** `my-account.router.tsx` default case returns `<Navigate to="/" replace />`.

---

## LOW

### [L1] Google Sign-In SDK loaded without Subresource Integrity (SRI) — **OPEN**
- **File:** `index.html`
- **Description:** `<script src="https://accounts.google.com/gsi/client">` has no
  `integrity` attribute. Google does not publish SRI hashes for this library (they
  update it frequently). Mitigated by a CSP that restricts `script-src` to
  `'self' https://accounts.google.com` only (see H3).
- **Fix:** Implement CSP (H3) as the primary mitigation. No code change needed here.

### [L2] ~~User email exposed in URL query parameters on /auth/verify~~ — **RESOLVED**
> **Resolved:** `useVerifyOtpPage` reads email from `location.state` (React Router
> state), not from URL search params. The email does not appear in the URL, browser
> history, or server logs.

### [L3] ~~Open Graph image references external lovable.dev domain~~ — **RESOLVED**
> **Resolved:** `index.html` OG image points to `https://avakanta.com/og-image.png`.

### [L4] ~~Email validation minimal (only checks for @ character)~~ — **RESOLVED**
> **Resolved:** `handleEmailSubmit` in `use-auth-modal.auth.hook.ts` validates with
> `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` before submitting.

### [L5] ~~selected_tenant_id stored in localStorage~~ — **RESOLVED**
> **Resolved:** `saveTenantPreference()` and all `localStorage` usage removed entirely.
> `selected_tenant_id` was dead code: it was written after login but never read
> anywhere in the frontend, and the backend derives tenant context from the JWT
> (not from any header or body value sent by the client). No `localStorage` calls
> remain in production code.

---

## Dependency Vulnerabilities

All previously reported HIGH severity CVEs resolved by upgrading to `react-router-dom@7.13.2`.
Run `npm audit` to verify current state of remaining moderate-severity transitive deps.

---

## Notes

1. **Tokens are in httpOnly cookies — the XSS threat model has changed.** With C1
   resolved, XSS can no longer exfiltrate auth credentials. An attacker with XSS
   can still make authenticated API requests same-origin (the browser sends httpOnly
   cookies automatically), but cannot steal the tokens themselves. CSP (H3) is the
   primary remaining mitigation.

2. **`session_active` cookie design.** The `session_active=1` cookie is readable by
   JS intentionally: it lets the frontend initialize `isAuthenticated` synchronously
   on page load (avoiding a flash of the login screen) and detect cross-tab logouts
   via `visibilitychange`. Its value is `"1"` — no sensitive data. This is a standard
   pattern in cookie-based SPAs.

3. **Server-side enforcement verified.** `CookieJWTAuthentication` reads `access_token`
   from the httpOnly cookie. `TenantMiddleware` resolves tenant from the authenticated
   user's DB membership, not from any client-supplied value.

4. **Scope limitation:** `src/myAccount/admin/` and `src/myAccount/agent/` were excluded
   from the original audit. M4 (file upload validation) and M5 (console.error) likely
   apply there too and should be verified.
