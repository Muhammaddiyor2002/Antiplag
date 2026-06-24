---
name: testing-antiplag
description: End-to-end test the AntiPlag SaaS locally — log in as the seeded admin, drive /dashboard/check via the GUI, and verify the 3 critical fixes (plan-limit enforcement, atomic decrement + refund, duplicate-sentence cursor highlights) using a Playwright-over-CDP helper plus direct Prisma writes. Use when verifying changes to src/app/api/checks/route.ts, src/lib/plagiarism.ts, src/lib/ai-detector.ts, the dashboard report UI, or the PDF endpoint.
---

# Testing AntiPlag end-to-end

## Devin secrets needed
- None for local testing. The dev server runs in demo mode without
  `OPENAI_API_KEY` / `GOOGLE_SEARCH_API_KEY`, which is the intended test
  surface.
- Seeded admin credentials are baked into `prisma/seed.ts` and are safe to
  share: `admin@antiplag.uz` / `Admin123!`.

## 1. Bring up the dev environment

```sh
# Postgres 16 in Docker (named container, recreate if needed)
docker rm -f antiplag-pg 2>/dev/null
docker run -d --name antiplag-pg -p 5432:5432 \
  -e POSTGRES_DB=antiplag \
  -e POSTGRES_USER=antiplag_user \
  -e POSTGRES_PASSWORD=antiplag_password \
  postgres:16-alpine

# .env (local)
cat > .env <<EOF
DATABASE_URL="postgresql://antiplag_user:antiplag_password@localhost:5432/antiplag?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-only-secret-please-change-in-production-12345678"
EOF

npx prisma db push
npm run db:seed
npm run dev
```

## 2. Log in via Playwright over CDP (do NOT click the form via xdotool)

The login form is hosted in a Chrome browser whose CSS viewport (≈1600x1069)
does not match the screenshot resolution (1024x768), so xdotool clicks at the
"obvious" pixel often miss. Drive Chrome through its CDP endpoint at
`http://localhost:29229` instead.

Use `playwright-core` already in `node_modules` (no install needed):

```js
// /tmp/login.mjs
import { chromium } from 'playwright-core';
const browser = await chromium.connectOverCDP('http://localhost:29229');
const ctx = browser.contexts()[0];
const page = ctx.pages().find(p => p.url().includes('localhost:3000')) || ctx.pages()[0];
await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
await page.fill('input[name="identifier"]', 'admin@antiplag.uz');
await page.fill('input[name="password"]', 'Admin123!');
await page.click('button[type="submit"]');
await page.waitForTimeout(1500);
await browser.close();
```

```sh
node /tmp/login.mjs
```

The `next-auth.session-token` cookie is set on the live Chrome instance; from
that point on, navigate via the address bar (`Ctrl+L`, type URL, Enter) to use
the GUI for the recording.

**Note**: the login form's `onSubmit` handler does not always preventDefault —
you will see the post-submit URL contain `?identifier=...&password=...` in
query string, but the session cookie is still set correctly. Proceed.

## 3. Drive the dashboard via the GUI

The textarea on `/dashboard/check` is a controlled React component. Setting
`textarea.value` directly is silently ignored by React; use the native setter
so `onChange` fires:

```js
const ta = document.querySelector('textarea');
Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')
  .set.call(ta, '<your test text>');
ta.dispatchEvent(new Event('input', { bubbles: true }));
```

Then click "Start check" via xdotool. Compute screenshot coordinates from
`element.getBoundingClientRect()` and scale: `x_screen = x_css * 1024/1600`,
`y_screen = y_css * 768/1069`. The Y-scaling has ≈15px error in practice;
aim for the centre of the visible button.

## 4. Verify the three critical fixes

All three are exercised most cleanly by hitting `/api/checks` directly with the
Playwright `request` context (which inherits the logged-in cookie) while
toggling `User.plan` and `checksLeft` via Prisma between calls.

### Fix #1 — STANDARD/FREE plan limit enforcement

```js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const u = await prisma.user.findFirst({ where: { email: 'admin@antiplag.uz' } });
await prisma.user.update({
  where: { id: u.id }, data: { plan: 'STANDARD', checksLeft: 0 }
});
const r = await ctx.request.post('http://localhost:3000/api/checks', {
  multipart: { type: 'PLAGIARISM', text: '...60+ word valid Uzbek text...' }
});
console.log(r.status(), await r.json());
// expect: 403 { message: 'Limit tugadi. Tarifni yangilang' }
```

Repeat with `plan: 'FREE'` and confirm the same 403.

If this returns 200 it means the guard regressed back to `=== "FREE"` only.

### Fix #2 — atomic decrement + refund

```js
await prisma.user.update({
  where: { id: u.id }, data: { plan: 'FREE', checksLeft: 2 }
});
// Submit a <30-word text → 400 with refund
// Then read checksLeft — must still be 2
// Submit valid text → 201 → checksLeft = 1
// Submit valid text → 201 → checksLeft = 0
// Submit again → 403 → checksLeft = 0
```

Restore admin to `plan: 'PREMIUM', checksLeft: 999` at the end of the test.

### Fix #3 — duplicate-sentence cursor highlights

The demo plagiarism algorithm flags ~45% of sentences via a hash-seeded RNG.
To make the test deterministic enough to actually exercise the cursor, use a
text where the duplicated sentence is the first sentence and is followed by a
mix of unique sentences — the seeded RNG flags multiple of the duplicates with
high probability:

```text
Bu juda muhim ilmiy tadqiqotdir bizning institutimiz uchun katta yutuq.
Olma daraxtlari bog'da gullaydi har bahorda hayajonli.
Bu juda muhim ilmiy tadqiqotdir bizning institutimiz uchun katta yutuq.
Quyosh chiqishi nurlarini taratadi har kuni ertalab tinch.
Bu juda muhim ilmiy tadqiqotdir bizning institutimiz uchun katta yutuq.
Tadqiqot natijalarini biz hammaga yetkazamiz konferensiyalarda.
```

Submit via UI, then `GET /api/checks/<id>` and inspect
`d.check.highlights.plag`:

- The duplicated sentence sits at text positions `[0, 127, 258]`.
- With the cursor fix, the highlights for whichever duplicates were flagged
  carry their **real** `start` (e.g. 127, 258).
- Without the fix, every flagged duplicate would have `start = 0` because
  `text.indexOf(sentence)` always returns the first match.

If you change the seed text, recompute the duplicate positions with
`text.indexOf(sentence, prev+1)` and assert the highlight starts include the
non-zero values.

## 5. Verify PDF

```js
const r = await ctx.request.get(`http://localhost:3000/api/checks/${id}/pdf`);
const body = await r.body();
// expect: status 200, headers['content-type'] === 'application/pdf',
// body.slice(0,5).toString() === '%PDF-'
```

## Useful gotchas
- The viewport-vs-screenshot scaling means `xdotool click` coordinates differ
  from `getBoundingClientRect`. Always compute the scale factor first.
- `playwright-core` is already in `node_modules` after `npm install`; no
  separate install of `playwright` needed.
- `pdf-parse` is imported lazily in `src/lib/parser.ts`; the static
  `pdf-parse/index.js` open-on-import bug surfaces only if a `.pdf` is
  uploaded, so plain-text submissions are fine for most tests.
- Restoring the admin user to `PREMIUM` at the end keeps subsequent dev work
  from being limited.
