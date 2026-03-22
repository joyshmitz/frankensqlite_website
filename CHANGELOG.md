# Changelog

All notable changes to the **FrankenSQLite Website** are documented here, organized by capability area.

This project has no tagged releases or GitHub Releases. The repository uses a linear commit history on `main` with [Conventional Commits](https://www.conventionalcommits.org/) prefixes. Every hash below links to its full commit on GitHub.

- **Repository:** <https://github.com/Dicklesworthstone/frankensqlite_website>
- **Live site:** <https://frankensqlite.com>
- **Engine source:** <https://github.com/Dicklesworthstone/frankensqlite>

---

## Site Foundation (2026-02-26)

Four commits on launch day stood up the entire site from scratch.

### Core Framework and Content Architecture

[`bb86026`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/bb86026297d65000780512cd8730920ed18ffdea) — _120 files, +22,744 lines_

The primary application scaffold, covering everything except the spec-evolution subsystem and project manifest.

- **Routing** -- Next.js App Router with five routes: homepage (`/`), architecture deep dive (`/architecture`), getting-started guide (`/getting-started`), showcase gallery (`/showcase`), and shared metadata/OG-image routes.
- **UI composition** -- Global shell with header, footer, custom cursor, signal HUD, section wrappers, animated metric counters, comparison tables, and timeline presentation components.
- **Visualization suite** -- 35 interactive components under `components/viz/` demonstrating MVCC race conditions, WAL lane management, learned indexes, conflict resolution ladders, safety dashboards, storage mode switching, B-tree page exploration, copy-on-write trees, encryption pipelines, RaptorQ healing, VDBE bytecode, and more.
- **Content system** -- Centralized static content model in `lib/content.tsx`, site interaction state in `lib/site-state.tsx`, and shared utilities in `lib/utils.ts`.
- **Hooks** -- Reusable hooks for simulation loops (`use-simulation`), body scroll locking (`use-body-scroll-lock`), haptic feedback (`use-haptic-feedback`), and intersection observation (`use-intersection-observer`).
- **Testing** -- Unit test suite (Vitest) covering content model integrity, utility functions, and patch engine logic. E2E suite (Playwright) with smoke tests, mobile responsive checks, performance baselines, and visualization interaction tests.
- **Static assets** -- FrankenMermaid WASM diagram renderer, branded SVG/WebP images.
- **Configuration** -- TypeScript strict mode, ESLint flat config, PostCSS/Tailwind CSS 4, Playwright config, Vitest config, AGENTS.md, beads issue tracker bootstrap, and `.gitignore`.

### Browser-Based Spec Evolution Viewer

[`bd67c8d`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/bd67c8d09b07833c77aff32f3ee9baf7c2a1569a) — _10 files, +2,834 lines_

A self-contained subsystem at `/spec_evolution` that loads a SQLite database in the browser (via sql.js/WASM), reconstructs specification snapshots by applying patches, and renders diffs between revisions.

- Route entry point, dynamic OG/Twitter image generation.
- Main viewer component with diff rendering (diff2html), section navigation, and patch timeline.
- Lazy-load wrapper with Suspense boundary for WASM initialization.
- Client-side patch application engine.
- TypeScript interfaces, configuration constants, and custom viewer CSS.
- Pre-built SQLite database (`public/spec_evolution_v1.sqlite3`, 2.5 MB) containing the initial spec snapshot and full patch history.

### Visualization Fixes (Accessibility and Layout)

[`07c3659`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/07c36596aac06866054e05d2bd6a1fa135f4cde8) — _5 files changed_

Layout, accessibility, and interaction improvements across five visualization components:

- **conflict-ladder** -- Widen decision node width from 140px to 160px to prevent text truncation in longer verdict labels.
- **cow-btree** -- Fix broken indentation in the AnimatePresence/info-panel section that caused layout misalignment in the right sidebar.
- **eprocess-monitor** -- Wire `playSfx("click")` into the simulate/reset button for audio feedback consistency; add `focus-visible` ring for keyboard accessibility.
- **ssi-validation** -- Tighten page indicator dot layout with smaller gap, `overflow-hidden`, centered justify, and constrained width to prevent overflow when many transactions access the same page.
- **witness-plane** -- Wrap the graph SVG in a horizontally-scrollable container with `touch-pan-x` for mobile viewability; shorten label text; add `focus-visible` rings to Reset/Back/Next buttons.

### Project Manifest and Documentation

[`458fe11`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/458fe11f317156e291d671b1d9badd318c579148) — _4 files, +1,912 lines_

- `package.json` establishing the full dependency tree: Next.js 16.1.6, React 19.2.4, sql.js, d3, framer-motion, echarts, TanStack Query/Table/Virtual, diff2html, Tailwind CSS 4. Dev tooling: Vitest, Playwright, Next.js bundle analyzer.
- `bun.lock` lockfile (Bun-only package management by project policy).
- `README.md` documenting project structure, tech stack, routes, development workflow, troubleshooting, and deployment.
- `frankensqlite_website_illustration.webp` hero image.

---

## Social and Branding (2026-02-27)

### GitHub Social Preview Image

[`87d0317`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/87d0317e1adaadd8d0485dd3c7addbc78deba9e0)

Add a 1280x640 branded share image (`gh_og_share_image.png`) for GitHub social previews and link unfurling on social media, Slack, Discord, etc.

---

## Performance (2026-02-27 through 2026-02-28)

Two rounds of performance work targeting both initial page load and spec-evolution viewer responsiveness.

### Initial Load Optimization

[`8848f75`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/8848f752ad388e1b162e4df0f85f84681c5e6e63)

Reduce initial page load weight by deferring 19 visualization components until they enter the viewport.

- Add `DeferredViz` wrapper component using `useIntersectionObserver` with `triggerOnce` and 600px `rootMargin` for preloading. Viz sections render a skeleton placeholder until near-viewport.
- Lazy-load `CustomCursor` and `SignalHUD` with `next/dynamic` (SSR disabled) -- these are client-only decorative components.
- Spec-evolution viewer changes: internalize `QueryClientProvider`, add proper TypeScript types for ECharts refs, pre-compute chart data with `useMemo`, batch-load all patches with `getAllPatches()` to eliminate N+1 async calls, add canvas-based evolution map background renderer.
- Configure `turbopack.root` in `next.config.ts` for correct module resolution.

### Spec Evolution Viewer -- Rendering Cache

[`76fdc4c`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/76fdc4c4086f688d645b0686254b25b7d56ae334)

Add `specHtmlCache` and `diffHtmlCache` maps to memoize the output of `marked.parse` and `Diff2Html.html` rendering. Revisiting a previously viewed snapshot or diff mode returns cached HTML immediately instead of re-parsing. Fix `useEffect` dependency arrays to include `currentIdx` so renders correctly invalidate when the snapshot index changes.

### Spec Evolution Viewer -- State Update Deduplication

[`70ba472`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/70ba472869f6f4ecbc68a02e83375257895b04ad)

- Add `specLineCountCache` and `addedPatchLinesCache` to avoid recomputing line counts and parsing patch diffs on every render cycle.
- Wrap all `viewerStore.setState` calls with equality checks so React skips re-renders when the new value matches current state -- this was the primary source of unnecessary DOM thrashing in the spec and diff tabs.
- Extract `getSpecLineCount()` and `getAddedPatchLines()` as pure cached helpers, replacing inline splits and forEach loops.
- Replace `isNaN()` with `Number.isNaN()` for stricter type checking in the hash-based initial commit index parser.

### Spec Evolution Viewer -- Filter Performance

[`888f156`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/888f1562b002acda22ca73a70bcb12dfd89f3c16)

The global filter was building a lowercase search string from `subject + hash + short + author` on every row for every keystroke, causing noticeable lag on large commit datasets.

- Add a pre-lowercased `searchText` field to the `Commit` interface, computed once at load time.
- Replace the multi-field `.toLowerCase().includes()` chain with a single `.includes()` against the cached field.
- Cost reduction: O(1) string allocation at load vs O(n * fields) per filter invocation.

### Spec Evolution Viewer -- Navigation Complexity

[`8368ad8`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/8368ad8e9381bf6a8a87f2ee209383921cd84d05)

Navigation actions (prev, next, playback, selection) were calling `filtered.findIndex()` per action -- O(n) across potentially thousands of commits.

- Build a `Map<commitIdx, filteredIdx>` via `useMemo`, updating only when the filtered array changes.
- Replace all five `findIndex()` call sites with O(1) `Map.get()` lookups.

### Spec Evolution Viewer -- Module Loading

[`26c477b`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/26c477b65412022519e97373bd73b731e6eed316)

The viewer was re-importing `marked`, `DOMPurify`, and `diff2html` on every render cycle, creating new module-loading promises each time.

- Cache each dynamic import promise in a module-level singleton using nullish coalescing assignment (`??=`) so `import()` fires once per page lifetime.
- Use `Promise.all()` to load related modules in parallel (marked + DOMPurify together; diff2html + types + DOMPurify together), cutting wall-clock time roughly in half versus sequential awaits.
- Extracted helper functions: `getMarkedModule()`, `getDomPurifyModule()`, `getDiff2HtmlModule()`, `getDiff2HtmlTypesModule()`.

---

## Architecture and Code Quality (2026-02-28)

### Extract Site Configuration Module

[`8416ced`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/8416ced625e0bd823dcc009eda2b090efe8fb41a)

Move `siteConfig` and `navItems` from `lib/content.tsx` to a new `lib/site-config.ts` module to break a circular dependency and reduce bundle size for layout/header/footer components that only need site metadata. Original exports preserved as re-exports for backward compatibility.

### Next.js Type Route Path Fix

[`bf59a8e`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/bf59a8ec9555a79d4db23f620cb6c23c9a6ef496) _(bundled with beads tracker update)_

Update `next-env.d.ts` path from `.next/dev/types/routes.d.ts` to `.next/types/routes.d.ts` to match the canonical route type generated by the current Next.js version, keeping TypeScript resolution aligned with actual build output.

---

## Bug Fixes (2026-03-16)

### Custom Cursor Corruption by DataDebris Particles

[`13d7dc3`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/13d7dc37a328b9e97badbfbda6cebe20a65f9ff5)

The DataDebris component (floating hex/binary characters near code blocks) passed the shared `mouseX`/`mouseY` MotionValues to each particle via `style={{ x, y }}` while simultaneously animating those same properties with keyframe arrays. Framer-motion's animation engine writes keyframe values directly back into MotionValues supplied via `style`, so five particles were continuously overwriting `mouseX`/`mouseY` with near-zero drift offsets. This caused the custom cursor (outer ring, inner dot, crosshair) to fly off to approximately (0, 0) the instant the mouse entered any `<pre>` or `<code>` element. Because the native cursor is hidden via `cursor: none !important`, the user saw no cursor at all, and it never recovered until a tab switch triggered a document `mouseenter` to reset visibility state.

**Fix:** Wrap all particles in a single `motion.div` container that follows the mouse via `style={{ x, y }}` (read-only MotionValue consumption). Individual particles now use only `style={{ left, top }}` for their offsets, and their `animate={{ x, y }}` keyframes create internal animation values that do not touch the shared MotionValues.

---

## Issue Tracker Housekeeping (beads)

These commits update the `.beads/issues.jsonl` issue tracker metadata. They carry no production code changes.

| Date | Hash | Summary |
|---|---|---|
| 2026-02-27 | [`d8dc3dc`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/d8dc3dcd525f1d7a5fb56d0708a6cc685a1fd58e) | Sync issue tracker with performance optimization task entries |
| 2026-02-28 | [`bf59a8e`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/bf59a8ec9555a79d4db23f620cb6c23c9a6ef496) | Track perf optimization task _(also fixes next-env.d.ts, listed above)_ |
| 2026-02-28 | [`9f572db`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/9f572dbb4100029a9e594a293f2da4bbb21f973d) | Close isomorphic website performance optimization task (bd-k6u) |
| 2026-02-28 | [`c8b2649`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/c8b2649378ac49d7536791b108ea2c7aa742f9cf) | Add filtered navigation optimization task |

---

## Full Commit Index

All 17 commits in chronological order.

| # | Date | Hash | Type | Summary |
|---|---|---|---|---|
| 1 | 2026-02-26 | [`bb86026`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/bb86026297d65000780512cd8730920ed18ffdea) | feat | Establish core website framework and content architecture |
| 2 | 2026-02-26 | [`07c3659`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/07c36596aac06866054e05d2bd6a1fa135f4cde8) | fix | Improve layout, accessibility, and interaction across 5 viz components |
| 3 | 2026-02-26 | [`bd67c8d`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/bd67c8d09b07833c77aff32f3ee9baf7c2a1569a) | feat | Add browser-based spec evolution viewer with SQLite-backed patch engine |
| 4 | 2026-02-26 | [`458fe11`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/458fe11f317156e291d671b1d9badd318c579148) | feat | Add package.json, bun.lock, README, and hero illustration |
| 5 | 2026-02-27 | [`87d0317`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/87d0317e1adaadd8d0485dd3c7addbc78deba9e0) | feat | Add GitHub OpenGraph social preview image |
| 6 | 2026-02-27 | [`8848f75`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/8848f752ad388e1b162e4df0f85f84681c5e6e63) | perf | Defer heavy visualizations with IntersectionObserver; optimize bundle loading |
| 7 | 2026-02-27 | [`d8dc3dc`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/d8dc3dcd525f1d7a5fb56d0708a6cc685a1fd58e) | chore | Sync issue tracker with performance optimization tasks |
| 8 | 2026-02-28 | [`bf59a8e`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/bf59a8ec9555a79d4db23f620cb6c23c9a6ef496) | chore | Track perf optimization task; fix Next.js type route path |
| 9 | 2026-02-28 | [`8416ced`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/8416ced625e0bd823dcc009eda2b090efe8fb41a) | refactor | Extract siteConfig and navItems into dedicated site-config module |
| 10 | 2026-02-28 | [`76fdc4c`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/76fdc4c4086f688d645b0686254b25b7d56ae334) | perf | Cache rendered spec HTML and diff HTML |
| 11 | 2026-02-28 | [`9f572db`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/9f572dbb4100029a9e594a293f2da4bbb21f973d) | chore | Close isomorphic website performance optimization task |
| 12 | 2026-02-28 | [`70ba472`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/70ba472869f6f4ecbc68a02e83375257895b04ad) | perf | Eliminate redundant state updates and cache computed values |
| 13 | 2026-02-28 | [`888f156`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/888f1562b002acda22ca73a70bcb12dfd89f3c16) | perf | Precompute searchText field for filtering |
| 14 | 2026-02-28 | [`8368ad8`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/8368ad8e9381bf6a8a87f2ee209383921cd84d05) | perf | Replace O(n) findIndex with Map-based O(1) index |
| 15 | 2026-02-28 | [`c8b2649`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/c8b2649378ac49d7536791b108ea2c7aa742f9cf) | chore | Sync issue tracker -- filtered navigation optimization |
| 16 | 2026-02-28 | [`26c477b`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/26c477b65412022519e97373bd73b731e6eed316) | perf | Cache dynamic imports as singleton promises; parallel loading |
| 17 | 2026-03-16 | [`13d7dc3`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/13d7dc37a328b9e97badbfbda6cebe20a65f9ff5) | fix | Stop DataDebris particles from corrupting shared mouse MotionValues |
