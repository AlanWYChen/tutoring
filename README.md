# Alan Chen — Tutoring

Independent project site for `AlanWYChen/tutoring`, published at [alanwychen.github.io/tutoring/](https://alanwychen.github.io/tutoring/). The initial page displays “Tutoring” and “Coming soon.” It retains `noindex` until the full portfolio is ready.

This repository owns its source, dependencies, tests, and Pages deployment. It has no submodules, cross-repository credentials, shared runtime, or navigation to the SWE portfolio.

## Local development and checks

Requires Node.js 22.12+ (`.nvmrc` selects Node 22).

```sh
npm ci
npm run dev
npm run build
npm run verify
npm run preview
npx playwright install chromium
npm run format:check
npm run smoke
```

Open the development URL printed by Vite with `/tutoring/`. Production preview is `http://127.0.0.1:4173/tutoring/`; use `npm run preview -- --port 4183` for another port. The static preview redirects `/tutoring` while preserving queries and returns real 404s for unknown paths.

`smoke` builds, verifies asset paths, and runs desktop, mobile, and narrow Playwright checks against a strict-port preview on port 4182. It checks rendering and refresh at `/tutoring/`, asset isolation, no cross-site navigation, overflow, redirects, and 404s. `npm run test:smoke` reruns tests against an existing build. Tests start and stop their own server.

```sh
npm run smoke:production
# Or, with a local preview already running:
SMOKE_BASE_URL=http://127.0.0.1:4173/tutoring/ npm run smoke:production
```

Production checks verify the live placeholder and JavaScript content types, with bounded polling and two retries for Pages propagation. Reports are in `playwright-report/` and failure traces/screenshots in `test-results/`, with separate `production/` subdirectories. Run `npx playwright show-report` to inspect them.

## Publishing

Set **Settings → Pages → Source** to **GitHub Actions**. Pushes to `main` and manual runs on `main` check formatting, build, verify output, run smoke tests, and publish the exact checked `dist/` artifact. Pull requests validate without deploying. The production job checks the URL returned by Pages. A post-deployment failure flags the run without rolling back the already-published site. Failure evidence is retained for seven days.

Vite's base is `/tutoring/`, but the uploaded artifact contains `index.html` and `assets/` directly: GitHub mounts the project at `/tutoring/`. Do not nest the output inside another `tutoring` folder. Future asset URLs must respect that base.

The workflow uses only this repository's `GITHUB_TOKEN`. Dependabot updates npm and Actions weekly on Monday at 09:00 America/Toronto. The SWE portfolio deploys independently from `AlanWYChen/AlanWYChen.github.io`.
