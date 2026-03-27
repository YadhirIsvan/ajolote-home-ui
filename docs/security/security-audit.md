# Security Audit Report
**Project:** ajolote-home-ui
**Date:** 2026-03-26
**Auditor:** frontend-security-auditor (Claude Opus)
**Scope:** Partial source audit -- src/auth/, src/buy/, src/home/, src/myAccount/client/, src/myAccount/router/, src/router/, src/shared/api/, index.html, .env files, dependencies

**Excluded from scope:** src/myAccount/admin/, src/myAccount/agent/

---

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 2     |
| HIGH     | 5     |
| MEDIUM   | 7     |
| LOW      | 5     |

---

## CRITICAL -- Fix before any deployment

### [C1] Auth tokens (access_token, refresh_token) stored in localStorage -- vulnerable to XSS exfiltration
- **File:** `src/auth/actions/verify-otp.actions.ts:30-31`, `src/auth/actions/login-with-google.actions.ts:17-18`, `src/auth/actions/login-with-apple.actions.ts:17-18`, `src/shared/api/axios.instance.ts:12,44,55-56`
- **Description:** Access and refresh tokens are stored in `localStorage` across all login flows (OTP, Google, Apple) and read from `localStorage` in the Axios interceptor. `localStorage` is accessible to any JavaScript running on the page, including XSS payloads injected via third-party scripts or browser extensions. An attacker who achieves XSS can exfiltrate both tokens and fully impersonate the user.
- **Fix:** Migrate token storage to `httpOnly`, `Secure`, `SameSite=Strict` cookies managed by the backend. If the backend cannot set cookies, store tokens in a closure/module-scoped variable (memory-only) and accept that they will not survive page reloads. As an interim measure, at minimum move `refresh_token` to an `httpOnly` cookie and keep only a short-lived `access_token` in memory.

### [C2] Sensitive credentials and Supabase anon key committed to version control in .env
- **File:** `.env:3-6`
- **Description:** The file `.env` (tracked by git -- `.gitignore` does not exclude `.env`, only `*.local`) contains the Google OAuth Client ID, the Supabase project ID, the Supabase publishable/anon key, and the Supabase URL. While the Supabase anon key is designed for client-side use, committing it alongside the project ID and API URL in version control makes it trivially discoverable and exposes the full Supabase surface. The Google Client ID is semi-public but should still not live in a tracked `.env` file that could contain more sensitive values in the future.
- **Fix:**
  1. Add `.env` to `.gitignore` immediately (currently only `*.local` is ignored).
  2. Rotate the Supabase anon key via the Supabase dashboard, since the current key is already in the git history.
  3. Provide a `.env.example` file with placeholder values for documentation.
  4. Run `git rm --cached .env` to stop tracking the file, then force-push or use BFG to purge history.

---

## HIGH -- Fix before launch

### [H1] Axios instance configured without a request timeout
- **File:** `src/shared/api/axios.instance.ts:5-8`
- **Description:** The Axios instance is created without a `timeout` property. This means HTTP requests can hang indefinitely, which can degrade the user experience (spinners that never stop) and can be exploited in slow-loris style denial of service against the client if the backend is slow or unresponsive.
- **Fix:** Add a timeout to the Axios instance configuration:
  ```typescript
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 15000, // 15 seconds
  });
  ```

### [H2] Full user object (PII) stored in localStorage
- **File:** `src/auth/actions/login-with-google.actions.ts:19`, `src/auth/actions/login-with-apple.actions.ts:19`, `src/auth/actions/verify-otp.actions.ts:32`, `src/shared/hooks/auth.context.tsx:51`, `src/myAccount/client/components/ClientDashboard.tsx:36`, `src/buy/hooks/use-property-detail.buy.hook.ts:127`
- **Description:** The entire `AuthUser` object (including name, email, phone, memberships/roles) is serialized to `localStorage` as JSON. This data persists after browser close, is accessible to any JS on the page, and is read back in multiple components. If an attacker achieves XSS, they can exfiltrate all user PII. Additionally, the user data is parsed from `localStorage` in components (`ClientDashboard`, `usePropertyDetail`) to extract name, email, and phone, bypassing the auth context.
- **Fix:** Store only the minimal required identifier in memory (not `localStorage`). Fetch user data from the API on app initialization. If persistence is required, encrypt the data before storage or use session-scoped storage with shorter lifetimes.

### [H3] Missing Content-Security-Policy (CSP) header in index.html
- **File:** `index.html`
- **Description:** The HTML entry point has no `<meta http-equiv="Content-Security-Policy">` tag. Without CSP, the browser allows execution of inline scripts, loading of scripts from any origin, and other behaviors that make XSS exploitation significantly easier. This is especially concerning given that tokens are in `localStorage` (C1).
- **Fix:** Add a restrictive CSP meta tag to `index.html`:
  ```html
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'self'; script-src 'self' https://accounts.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; connect-src 'self' https://api.avakanta.com https://*.supabase.co; font-src 'self';" />
  ```
  Adjust the policy to match your actual resource origins. Deploy a `Content-Security-Policy` HTTP header from your server/CDN for stronger enforcement.

### [H4] Hardcoded HTTP fallback in Axios base URL allows insecure connections
- **File:** `src/shared/api/axios.instance.ts:3`
- **Description:** The line `const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1"` uses a plain HTTP fallback. If `VITE_API_BASE_URL` is undefined or empty in a production build, all API requests (including those carrying auth tokens) will be sent over unencrypted HTTP. Additionally, `.env.local` contains `VITE_API_BASE_URL=http://localhost:8000/api/v1` (HTTP), which could leak into production if the file is misused.
- **Fix:** Ensure the production `.env` only contains HTTPS URLs (already the case in `.env`). Change the fallback to throw an error rather than silently using HTTP:
  ```typescript
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  if (!BASE_URL) throw new Error("VITE_API_BASE_URL is not defined");
  ```

### [H5] react-router-dom vulnerable to XSS via Open Redirects (GHSA-2w69-qvjg-hvjx)
- **File:** `package.json` (dependency: react-router-dom)
- **Description:** The installed version of `react-router-dom` (6.x, <=6.30.2) is affected by a HIGH severity vulnerability (CVSS 8.0) that allows XSS via open redirects. The `@remix-run/router` transitive dependency (<=1.23.1) is the root cause. This directly affects route handling in `src/router/app.router.tsx` and `src/myAccount/router/my-account.router.tsx`.
- **Fix:** Update `react-router-dom` to version 6.30.3 or later:
  ```bash
  npm install react-router-dom@latest
  ```

---

## MEDIUM -- Fix within first sprint post-launch

### [M1] JWT decoded client-side to determine token expiration without server validation
- **File:** `src/shared/hooks/auth.context.tsx:13-23`
- **Description:** The `getRefreshTokenExpiresInMs` function decodes the JWT payload client-side using `atob` to read the `exp` claim. While this is used for auto-logout (a reasonable UX pattern), the comment explicitly says "without signature verification." If the same pattern is used elsewhere for authorization decisions, it could be spoofed. The client should never trust the JWT payload for access control.
- **Fix:** This usage (auto-logout timer) is acceptable for UX, but add a comment clarifying that all authorization decisions MUST be enforced server-side. Ensure no other code path uses client-decoded JWT data for role checks or access decisions.

### [M2] Role-based routing relies entirely on client-side role from localStorage
- **File:** `src/shared/hooks/auth.context.tsx:57`, `src/myAccount/router/my-account.router.tsx:12-22`, `src/auth/guardian/AuthGuard.tsx:24`
- **Description:** The user's role is extracted from `user.memberships[0].role` which comes from `localStorage` (parsed user JSON). The `MyAccountRouter` component uses this role to decide which sub-application to render (client, agent, admin). The `AuthGuard` checks `isAuthenticated` and `role` -- both derived from client-side state. If an attacker modifies `localStorage`, they could potentially access admin or agent UIs. While the API should reject unauthorized requests, the UI would still render, potentially exposing admin-only UI patterns or information.
- **Fix:** The API must enforce role-based access on every endpoint (verify this server-side). On the client, consider fetching the user profile/role from the API on app load rather than trusting `localStorage`. At minimum, add a server-side role verification call on protected route mount.

### [M3] Protected route /mi-cuenta lacks a proper ProtectedRoute wrapper in app.router.tsx
- **File:** `src/router/app.router.tsx:29`
- **Description:** The route `<Route path="/mi-cuenta" element={<MiCuentaPage />} />` is rendered without any `ProtectedRoute` or `AuthGuard` wrapper at the router level. Authentication is handled inside `MiCuentaPage` itself. This means any user can navigate to `/mi-cuenta` and the page component loads before deciding to show a login prompt. Additionally, `/auth/register` and `/auth/verify` are fully public, which is correct, but `/mi-cuenta` should have a route-level guard.
- **Fix:** Wrap the `/mi-cuenta` route with `AuthGuard` or a `ProtectedRoute` component at the router level:
  ```tsx
  <Route path="/mi-cuenta" element={
    <AuthGuard><MiCuentaPage /></AuthGuard>
  } />
  ```

### [M4] File upload (avatar, documents) lacks client-side MIME type and size validation
- **File:** `src/myAccount/client/components/ClientDashboard.tsx:49-61`, `src/myAccount/client/actions/upload-client-property-files.actions.ts:3-20`, `src/myAccount/client/api/client.api.ts:22-25,74-79`
- **Description:** The avatar upload input uses `accept="image/*"` (line 190 of ClientDashboard), which is a hint to the browser but is trivially bypassed. There is no programmatic validation of file MIME type or file size before uploading. The `uploadClientPropertyFilesAction` sends files without any client-side validation. Large or malicious files could overwhelm the server or be used for resource exhaustion.
- **Fix:** Add explicit client-side validation before upload:
  ```typescript
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  if (!ALLOWED_TYPES.includes(file.type)) {
    // reject with user-friendly error
  }
  if (file.size > MAX_FILE_SIZE) {
    // reject with user-friendly error
  }
  ```
  Server-side validation is also essential and should be verified independently.

### [M5] console.error calls in production code may leak sensitive data
- **File:** `src/auth/actions/login-with-google.actions.ts:29`, `src/auth/actions/login-with-apple.actions.ts:29`, `src/shared/actions/logout.actions.ts:10`, `src/myAccount/client/actions/upload-client-property-files.actions.ts:15`, and 15+ other action files in scope
- **Description:** Multiple action files use `console.error` with the raw `error` object, which in production will output full Axios error responses (potentially including server headers, URLs, and stack traces) to the browser console. While not directly exploitable, this aids attackers in reconnaissance.
- **Fix:** Strip `console.error` calls from production builds. Use a Vite plugin or configure the build to drop console statements:
  ```typescript
  // vite.config.ts
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  }
  ```
  Alternatively, use a logging library that respects environment settings.

### [M6] Registration form inputs lack maxLength constraints
- **File:** `src/auth/pages/RegisterPage.tsx:72-128`, `src/auth/components/AuthModal.tsx:215-253`
- **Description:** The registration form fields (first_name, last_name, email, phone) in `RegisterPage.tsx` and the new-user fields in `AuthModal.tsx` do not have `maxLength` attributes. While the OTP input correctly has `maxLength={6}`, the name and email fields allow arbitrary-length input which could be used to attempt buffer overflow or storage exhaustion attacks on the backend.
- **Fix:** Add `maxLength` to all text inputs:
  ```tsx
  <Input maxLength={100} ... /> // for name fields
  <Input maxLength={254} ... /> // for email (RFC 5321 limit)
  <Input maxLength={20} ... />  // for phone
  ```

### [M7] MyAccountRouter returns null for unknown roles instead of redirecting
- **File:** `src/myAccount/router/my-account.router.tsx:20-21`
- **Description:** The `default` case in the role switch returns `null`, rendering a blank page. If a user has an unexpected or manipulated role value, they see nothing rather than being redirected to a safe fallback. This could confuse users or mask authorization issues.
- **Fix:** Redirect to the home page or show an error component for unknown roles:
  ```tsx
  default:
    return <Navigate to="/" replace />;
  ```

---

## LOW -- Best practices to implement

### [L1] Google Sign-In SDK loaded without Subresource Integrity (SRI)
- **File:** `index.html:18`
- **Description:** The script tag `<script src="https://accounts.google.com/gsi/client" async defer></script>` loads a third-party script without an `integrity` attribute. If Google's CDN is compromised, malicious code could be injected into the application.
- **Fix:** Google's GSI library does not support SRI (they update it frequently). As a mitigation, add a strong CSP that restricts script sources to `'self'` and `https://accounts.google.com` only (see H3). Monitor for any anomalies in network requests.

### [L2] User email exposed in URL query parameters on /auth/verify
- **File:** `src/auth/pages/RegisterPage.tsx:42`, `src/auth/pages/VerifyOtpPage.tsx:12`
- **Description:** After registration, the user is redirected to `/auth/verify?email=user@example.com&mode=register`. The email address appears in the URL, which means it will be logged in browser history, server access logs, referrer headers, and potentially analytics tools. On the verify page, the email is read from `searchParams`.
- **Fix:** Pass the email via React state (using `useNavigate`'s state parameter) or a shared context/store rather than URL query parameters:
  ```tsx
  navigate("/auth/verify", { state: { email: form.email, mode: "register" } });
  ```

### [L3] Open Graph image references external lovable.dev domain
- **File:** `index.html:13,17`
- **Description:** The OG image and Twitter card image URLs point to `https://lovable.dev/opengraph-image-p98pqg.png`. This is a remnant from the Lovable-generated project and exposes a dependency on a third-party domain. If that domain goes down or changes content, the social media previews will be incorrect.
- **Fix:** Host the OG image on your own domain or CDN and update the meta tags accordingly.

### [L4] Email validation on login is minimal (only checks for @ character)
- **File:** `src/auth/hooks/use-auth-modal.auth.hook.ts:91`
- **Description:** The email validation in `handleEmailSubmit` only checks `!email || !email.includes("@")`. This allows malformed emails like `@`, `user@`, or strings with spaces. While the server should validate properly, a more robust client-side check improves UX and reduces unnecessary API calls.
- **Fix:** Use a proper email regex or a validation library:
  ```typescript
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EMAIL_REGEX.test(email)) {
    setError("Por favor ingresa un correo valido");
    return;
  }
  ```

### [L5] selected_tenant_id stored in localStorage without cleanup on logout
- **File:** `src/auth/actions/login-with-google.actions.ts:21-24`, `src/auth/actions/login-with-apple.actions.ts:21-24`, `src/auth/actions/verify-otp.actions.ts:33-37`, `src/shared/hooks/auth.context.tsx:78-83`
- **Description:** On login, the `selected_tenant_id` is stored in `localStorage`. However, the logout handler in `auth.context.tsx` only removes `access_token`, `refresh_token`, and `user` -- it does not remove `selected_tenant_id`. This leaves a stale tenant identifier that could cause issues if a different user logs in on the same browser.
- **Fix:** Add `localStorage.removeItem("selected_tenant_id")` to both `handleLogout` and `handleAutoLogout` in `auth.context.tsx`.

---

## Dependency Vulnerabilities (npm audit)

**Total: 15 vulnerabilities (0 critical, 8 high, 7 moderate)**

### HIGH severity

| Package | Vulnerability | Advisory | Fix Available |
|---------|--------------|----------|---------------|
| `react-router-dom` (direct) | XSS via Open Redirects, unexpected external redirect | GHSA-2w69-qvjg-hvjx, GHSA-9jcx-v3wj-wh4m | Yes |
| `react-router` | XSS via Open Redirects, unexpected external redirect | GHSA-2w69-qvjg-hvjx, GHSA-9jcx-v3wj-wh4m | Yes |
| `@remix-run/router` | XSS via Open Redirects | GHSA-2w69-qvjg-hvjx (CVSS 8.0) | Yes |
| `flatted` | Unbounded recursion DoS in parse(), Prototype Pollution | GHSA-25h7-pfq9-p65f, GHSA-rf6f-7fwh-wjgh | Yes |
| `glob` | Command injection via --cmd flag | GHSA-5j98-mcp5-4vw2 (CVSS 7.5) | Yes |
| `minimatch` | ReDoS via multiple patterns | GHSA-3ppc-4f35-3m26, GHSA-7r86-cg39-jmmj, GHSA-23c5-xmqv-rm74 | Yes |
| `picomatch` | ReDoS via extglob quantifiers | GHSA-c2c7-rcm5-vvqj (CVSS 7.5) | Yes |
| `rollup` | Arbitrary File Write via Path Traversal | GHSA-mw96-cpmx-2vgc | Yes |

### MODERATE severity

| Package | Vulnerability | Advisory |
|---------|--------------|----------|
| `vite` (direct) | Path traversal, server.fs bypass | GHSA-g4jq-h2w9-997c, GHSA-jqfw-vq24-v9c3, GHSA-93m4-6634-74q7 |
| `esbuild` | Dev server request forgery | GHSA-67mh-4wv8-2f99 |
| `ajv` | ReDoS with $data option | GHSA-2g4f-4pwh-qvx6 |
| `brace-expansion` | Zero-step sequence DoS | GHSA-f886-m6hf-6m8v |
| `js-yaml` | Prototype pollution in merge | GHSA-mh29-5h37-fv8m |
| `lodash` | Prototype Pollution in _.unset/_.omit | GHSA-xxjr-mmjv-4gpg |
| `yaml` | Stack Overflow via deeply nested collections | GHSA-48c2-rrv3-qjmp |

**Recommended action:**
```bash
npm audit fix
```
If that does not resolve all issues, manually update the direct dependencies:
```bash
npm install react-router-dom@latest vite@latest
```

---

## Notes

1. **Scope limitation:** This audit excluded `src/myAccount/admin/` and `src/myAccount/agent/` per the user's instructions. Those domains contain extensive action files with `console.error` calls and likely share the same patterns flagged here.

2. **Server-side enforcement not verifiable:** Several findings (M2, M4) depend on the backend enforcing role-based access control and file upload validation. This audit is frontend-only and cannot confirm whether the API properly validates roles, file types, and sizes. A complementary backend security audit is recommended.

3. **No dangerouslySetInnerHTML usage in scoped domains:** The only instance of `dangerouslySetInnerHTML` found is in `src/shared/components/ui/chart.tsx` (a Shadcn component), which is outside the audited domain scope and is a controlled usage for injecting chart styles.

4. **No console.log/warn/debug/info found:** Only `console.error` calls were found in the codebase. While better than `console.log`, these still output raw error objects in production.

5. **No hardcoded API keys in source code:** All API configuration uses `import.meta.env.VITE_*` variables, which is correct. The concern is that the `.env` file containing these values is committed to git.

6. **CORS configuration:** CORS is not configured on the frontend Axios instance (this is expected -- CORS is a server-side concern). However, the Axios base URL does not enforce HTTPS at the code level (see H4).

7. **The `.env.local` file is correctly gitignored** via the `*.local` pattern in `.gitignore`. However, the main `.env` file is NOT gitignored, which is the root cause of C2.

8. **No refresh token rotation detected:** When the Axios interceptor refreshes the access token (`src/shared/api/axios.instance.ts:52-56`), the server returns new access and refresh tokens. This pattern supports rotation, but it should be verified that the backend actually invalidates the old refresh token upon use.
