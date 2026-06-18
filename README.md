# SharpDev.tools

**600+ single-purpose browser tools. No ads. No cookies. No sign-up. No tracking.**

Live at **[sharpdev.tools](https://sharpdev.tools)** — converters, calculators, text and code utilities,
PDF and image tools, generators, and more. Every tool does one job and does it fast.

This repository holds the **client-side source of every tool**, published so you can verify
the one thing that matters most: there really is no tracking.

---

## Why the source is public

Plenty of "free online tool" sites are walls of ads, cookie banners, trackers and upsells.
SharpDev.tools is the opposite by design — and a privacy promise you can't verify is just marketing.

So: read the code. Open any tool in `tools/`, or hit "View source" on the live page. You'll find:

- **No analytics-on-you, no third-party trackers, no cookies.** (The site uses [Plausible](https://plausible.io),
  a cookieless, privacy-friendly page-view counter — no personal data, no cross-site tracking.)
- **Everything runs in your browser.** Files and text you paste are processed locally and never uploaded.
- **No build step, no framework, no magic.** Plain HTML, CSS and vanilla JavaScript.

## How it's built

- **Vanilla HTML / CSS / JS.** No framework, no bundler, no build step — each tool page is self-contained.
- **Hosted on [Cloudflare Pages](https://pages.cloudflare.com/)** (static), EU/GDPR-friendly.
- **Structure:**
  - `tools/<name>/` — one folder per tool: `index.html`, `<name>.css`, `<name>.js`. Open one to see exactly how it works.
  - `shared/` — the shared nav, command-palette search, and stylesheet used across all pages.
  - `index.html` + category folders (`converters/`, `developers/`, …) — the homepage and category indexes.

## What's intentionally *not* here

This repo is the **client-side tool code**, for transparency — not a turnkey copy of the whole operation:

- The build/generator scripts and internal notes are kept private.
- The small server-side API helpers (a YouTube metadata proxy, a CORS fetch helper, the contact-form
  mailer) live elsewhere — so a few network-dependent tools won't run from a bare checkout. Everything
  else is fully self-contained.

## Usage

The source is **public so you can audit it and learn from it** — clean, dependency-free, client-side
implementations of a few hundred everyday tools.

It is **not licensed for re-hosting.** Please don't clone this and put it back online as your own tool
site (the web has enough of those). If you want to run something like it, build your own — and if a
specific tool's approach is useful to you, you're very welcome to learn from it.

Found a bug or want a tool added? There's a "Request a tool" and a bug-report form on
[sharpdev.tools](https://sharpdev.tools).

---

© Gillian Scharf · [sharpdev.tools](https://sharpdev.tools) · All rights reserved.
