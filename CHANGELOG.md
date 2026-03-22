# Changelog

All notable changes to the FrankenSQLite website are documented here.

This project has no tagged releases or GitHub releases. History is organized chronologically by commit, grouped by date and capability area.

Repository: <https://github.com/Dicklesworthstone/frankensqlite_website>
Live site: <https://frankensqlite.com>

---

## 2026-03-16

### Bug Fixes

- **fix(cursor): stop DataDebris particles from corrupting shared mouse MotionValues** — [`13d7dc3`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/13d7dc37a328b9e97badbfbda6cebe20a65f9ff5)
  The DataDebris component (floating hex/binary characters near code blocks) passed the shared `mouseX`/`mouseY` MotionValues to each particle via `style={{ x, y }}` while also animating those same properties with keyframe arrays. Framer-motion's animation engine writes keyframe values back into the supplied MotionValues, so five particles were continuously overwriting `mouseX`/`mouseY` with near-zero drift offsets. This caused the custom cursor to jump to ~(0,0) when the mouse entered any `<pre>` or `<code>` element. Since the native cursor is hidden via `cursor: none !important`, the user saw no cursor at all. Fix: wrap particles in a single container that reads MotionValues via `style={{ x, y }}`, and have individual particles use only `style={{ left, top }}` for offsets with internal-only animation values.

---

## 2026-02-28

### Performance — Spec Evolution Viewer

A series of targeted optimizations to the `/spec_evolution` route viewer, addressing render performance, filtering latency, and module-loading overhead.

- **perf(spec-evolution): cache dynamic imports as singleton promises and load in parallel** — [`26c477b`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/26c477b65412022519e97373bd73b731e6eed316)
  The viewer was re-importing `marked`, `DOMPurify`, and `diff2html` on every render cycle. Cache each import promise in a module-level singleton using `??=` so `import()` fires once per page lifetime. Use `Promise.all()` to load related modules in parallel, cutting wall-clock time roughly in half versus sequential awaits. Extracted `getMarkedModule()`, `getDomPurifyModule()`, `getDiff2HtmlModule()`, `getDiff2HtmlTypesModule()` helpers.

- **perf(spec-evolution): replace O(n) findIndex lookups with Map-based index for filtered navigation** — [`8368ad8`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/8368ad8e9381bf6a8a87f2ee209383921cd84d05)
  Navigation actions (prev/next/playback/selection) were calling `filtered.findIndex()` per action across potentially thousands of commits. Build a `Map<commitIdx, filteredIdx>` via `useMemo` that updates only when the filtered array changes. All five `findIndex()` call sites replaced with O(1) `Map.get()` lookups.

- **perf(spec-evolution): precompute searchText field to eliminate per-filter string concatenation** — [`888f156`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/888f1562b002acda22ca73a70bcb12dfd89f3c16)
  The global filter was building a lowercase search string from `subject + hash + short + author` on every row for every keystroke. Add a pre-lowercased `searchText` field to the `Commit` interface, computed once at load time. Reduces cost from O(n * fields) per filter invocation to a single `.includes()` call per row.

- **perf(spec-evolution): eliminate redundant state updates and cache computed values** — [`70ba472`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/70ba472869f6f4ecbc68a02e83375257895b04ad)
  Add `specLineCountCache` and `addedPatchLinesCache` to avoid recomputing on every render. Wrap all `viewerStore.setState` calls with equality checks so React skips re-renders when values are unchanged. Replace `isNaN()` with `Number.isNaN()` for stricter type checking in the hash-based initial commit index parser.

- **perf(spec-evolution): cache rendered spec HTML and diff HTML to avoid redundant markdown/diff2html processing** — [`76fdc4c`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/76fdc4c4086f688d645b0686254b25b7d56ae334)
  Add `specHtmlCache` and `diffHtmlCache` maps to memoize output of `marked.parse` and `Diff2Html.html` rendering. Revisiting a previously viewed snapshot returns cached HTML immediately. Fix `useEffect` dependency arrays to include `currentIdx`.

### Refactoring

- **refactor: extract siteConfig and navItems into dedicated site-config module** — [`8416ced`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/8416ced625e0bd823dcc009eda2b090efe8fb41a)
  Move `siteConfig` and `navItems` from `lib/content.tsx` to `lib/site-config.ts` to break a circular dependency and reduce bundle size for layout/header/footer components. Original exports preserved as re-exports for backward compatibility.

### Housekeeping

- **chore(beads): sync issue tracker — add filtered navigation optimization task** — [`c8b2649`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/c8b2649378ac49d7536791b108ea2c7aa742f9cf)
- **chore(beads): close isomorphic website performance optimization task (bd-k6u)** — [`9f572db`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/9f572dbb4100029a9e594a293f2da4bbb21f973d)
- **chore(beads): track perf optimization task and fix Next.js type route path** — [`bf59a8e`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/bf59a8ec9555a79d4db23f620cb6c23c9a6ef496)
  Also updates `next-env.d.ts` path from `.next/dev/types/routes.d.ts` to `.next/types/routes.d.ts` to match current Next.js build output.

---

## 2026-02-27

### Performance — Initial Load Optimization

- **perf: defer heavy visualizations with IntersectionObserver and optimize bundle loading** — [`8848f75`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/8848f752ad388e1b162e4df0f85f84681c5e6e63)
  Reduce initial page load weight by deferring 19 visualization components until they enter the viewport (600px `rootMargin` for preloading). Add `DeferredViz` wrapper using `useIntersectionObserver` with `triggerOnce`. Lazy-load `CustomCursor` and `SignalHUD` with `next/dynamic` (SSR disabled). In the spec-evolution viewer: internalize `QueryClientProvider`, add proper TypeScript types for ECharts refs, pre-compute chart data with `useMemo`, and batch-load all patches with `getAllPatches()` to eliminate N+1 async calls. Configure `turbopack.root` in `next.config.ts` for correct module resolution.

### Features

- **feat: add GitHub OpenGraph social preview image (1280x640)** — [`87d0317`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/87d0317e1adaadd8d0485dd3c7addbc78deba9e0)
  Branded share image for GitHub social previews and link unfurling on social media, Slack, Discord, etc.

### Housekeeping

- **chore(beads): sync issue tracker with performance optimization task entries** — [`d8dc3dc`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/d8dc3dcd525f1d7a5fb56d0708a6cc685a1fd58e)

---

## 2026-02-26 — Initial Build

The entire site was created in a single session across four commits.

### Core Website Framework

- **feat(site): establish core FrankenSQLite website framework and content architecture** — [`bb86026`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/bb86026297d65000780512cd8730920ed18ffdea) _(120 files, +22,744 lines)_
  Primary application scaffold for the FrankenSQLite marketing/documentation site:
  - Next.js App Router route structure: homepage (`/`), architecture deep dive (`/architecture`), getting-started guide (`/getting-started`), showcase gallery (`/showcase`), and shared metadata/image routes
  - Global shell and UI composition: header/footer, cursor/HUD, section wrappers, animated metrics, comparison/table visuals, and timeline presentation
  - Full visualization component suite under `components/viz/` for MVCC, WAL, learned indexes, conflict resolution, safety, and storage demonstrations
  - Centralized content/state/util layers in `lib/`: static content model, site interaction state, and utility helpers
  - Reusable hooks for simulation loops, body scroll control, and intersection observer behavior
  - Test foundations: unit tests, E2E suites, shared test helpers, and runner configuration (Vitest + Playwright)
  - Static assets for diagramming and branded visuals
  - Project config: TypeScript, ESLint, PostCSS, AGENTS/beads metadata, `.gitignore`

### Spec Evolution Viewer

- **feat: add browser-based spec evolution viewer with SQLite-backed patch engine** — [`bd67c8d`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/bd67c8d09b07833c77aff32f3ee9baf7c2a1569a) _(10 files, +2,834 lines)_
  New `/spec_evolution` route with an interactive viewer for browsing FrankenSQLite specification history as patches applied against a local SQLite database (sql.js in browser). Includes route entry point, dynamic OG/Twitter image generation, main viewer component with diff rendering and section navigation, lazy-load wrapper with suspense boundary, client-side patch engine, TypeScript interfaces, configuration constants, custom viewer CSS, and the pre-built SQLite database (`public/spec_evolution_v1.sqlite3`, 2.5 MB).

### Visualization Fixes

- **fix(viz): improve layout, accessibility, and interaction across 5 viz components** — [`07c3659`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/07c36596aac06866054e05d2bd6a1fa135f4cde8)
  - **conflict-ladder**: Widen decision node width (140 to 160px) to prevent text truncation
  - **cow-btree**: Fix broken indentation in AnimatePresence/info-panel causing layout misalignment
  - **eprocess-monitor**: Wire `playSfx("click")` into simulate/reset button; add `focus-visible` ring for keyboard accessibility
  - **ssi-validation**: Tighten page indicator dot layout (smaller gap, overflow-hidden, centered justify) to prevent overflow with many transactions
  - **witness-plane**: Wrap graph SVG in horizontally-scrollable container with `touch-pan-x` for mobile; shorten label text; add `focus-visible` rings to navigation buttons

### Project Manifest and Documentation

- **feat: add package.json with dependencies, bun.lock, README, and hero illustration** — [`458fe11`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/458fe11f317156e291d671b1d9badd318c579148) _(4 files, +1,912 lines)_
  Project manifest establishing the dependency tree: Next.js 16.1.6, React 19.2.4, sql.js, d3, framer-motion, echarts, TanStack Query/Table/Virtual, diff2html, Tailwind CSS 4. Dev tooling: Vitest, Playwright, Next.js bundle analyzer. README documenting project structure, tech stack, development workflow, and deployment. Hero illustration (`frankensqlite_website_illustration.webp`).

---

## Commit Index

| Date | Hash | Type | Scope | Summary |
|---|---|---|---|---|
| 2026-02-26 | [`bb86026`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/bb86026297d65000780512cd8730920ed18ffdea) | feat | site | Establish core website framework and content architecture |
| 2026-02-26 | [`07c3659`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/07c36596aac06866054e05d2bd6a1fa135f4cde8) | fix | viz | Improve layout, accessibility, and interaction across 5 viz components |
| 2026-02-26 | [`bd67c8d`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/bd67c8d09b07833c77aff32f3ee9baf7c2a1569a) | feat | spec-evolution | Add browser-based spec evolution viewer with SQLite-backed patch engine |
| 2026-02-26 | [`458fe11`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/458fe11f317156e291d671b1d9badd318c579148) | feat | project | Add package.json, bun.lock, README, and hero illustration |
| 2026-02-27 | [`87d0317`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/87d0317e1adaadd8d0485dd3c7addbc78deba9e0) | feat | social | Add GitHub OpenGraph social preview image |
| 2026-02-27 | [`8848f75`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/8848f752ad388e1b162e4df0f85f84681c5e6e63) | perf | bundle | Defer heavy visualizations with IntersectionObserver |
| 2026-02-27 | [`d8dc3dc`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/d8dc3dcd525f1d7a5fb56d0708a6cc685a1fd58e) | chore | beads | Sync issue tracker with performance optimization tasks |
| 2026-02-28 | [`bf59a8e`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/bf59a8ec9555a79d4db23f620cb6c23c9a6ef496) | chore | beads | Track perf optimization task; fix Next.js type route path |
| 2026-02-28 | [`8416ced`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/8416ced625e0bd823dcc009eda2b090efe8fb41a) | refactor | config | Extract siteConfig and navItems into dedicated module |
| 2026-02-28 | [`76fdc4c`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/76fdc4c4086f688d645b0686254b25b7d56ae334) | perf | spec-evolution | Cache rendered spec HTML and diff HTML |
| 2026-02-28 | [`9f572db`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/9f572dbb4100029a9e594a293f2da4bbb21f973d) | chore | beads | Close isomorphic website performance optimization task |
| 2026-02-28 | [`70ba472`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/70ba472869f6f4ecbc68a02e83375257895b04ad) | perf | spec-evolution | Eliminate redundant state updates and cache computed values |
| 2026-02-28 | [`888f156`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/888f1562b002acda22ca73a70bcb12dfd89f3c16) | perf | spec-evolution | Precompute searchText field for filtering |
| 2026-02-28 | [`8368ad8`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/8368ad8e9381bf6a8a87f2ee209383921cd84d05) | perf | spec-evolution | Replace O(n) findIndex with Map-based O(1) index |
| 2026-02-28 | [`c8b2649`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/c8b2649378ac49d7536791b108ea2c7aa742f9cf) | chore | beads | Sync issue tracker — filtered navigation optimization |
| 2026-02-28 | [`26c477b`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/26c477b65412022519e97373bd73b731e6eed316) | perf | spec-evolution | Cache dynamic imports as singleton promises; load in parallel |
| 2026-03-16 | [`13d7dc3`](https://github.com/Dicklesworthstone/frankensqlite_website/commit/13d7dc37a328b9e97badbfbda6cebe20a65f9ff5) | fix | cursor | Stop DataDebris particles from corrupting shared mouse MotionValues |
