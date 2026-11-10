# Production hardening — 2026-11-04

## Scope

This cycle hardens the newly introduced five-station “Today” flow and restores a zero-known-vulnerability dependency baseline. It does not claim device, field, learning-effect, or external accessibility validation.

## Five-station flow (R137)

The first implementation visually marked later stations as locked, but a task button inside a later station remained enabled once the older retrieval ritual opened. It also treated a station as complete only after a passing score, while the established day engine submits failed attempts and sends them to debt/review. Finally, local quiz points could visually complete a station before an actual submission.

The corrected contract is centralized in the existing `lib/today-steps.ts` module:

- mandatory debt, retrieval, and delayed verification belong to station 1;
- only a persisted task submission opens the next station;
- a submitted failed attempt counts as submitted and continues through the existing debt/review model;
- local, unsubmitted points never open another station;
- locked buttons are disabled in both the five-station map and the legacy task list;
- a stored position from an older version falls back to the first active task instead of opening locked content.

Automated evidence: the existing K335 contract plus K340a–K340f in `scripts/engine_smoke.ts`, and R315-1–R315-8 in `scripts/interaktiv_test.tsx`, including axe-core coverage and the interleaved source-order edge case on day 1.

## Dependency security

The baseline lockfile installed with 9 known vulnerabilities: 1 critical, 1 high, and 7 moderate. The critical/high production findings affected Next.js 15.5.27 (including GHSA-2464-fhr4-w9xw and GHSA-p3m5-59mp-jv5r). Development findings came through jsdom/undici and the TypeScript ESLint minimatch chain.

Changes:

- Next.js `15.5.27 → 15.5.29`;
- jsdom `29.1.1 → 30.1.3`, resolving to patched undici 8;
- typescript-eslint `8.71.2 → 8.72.1`;
- the TypeScript ESTree minimatch dependency is narrowly overridden to `11.0.4`; the unrelated ESLint packages keep their compatible minimatch 3 line;
- `npm run audit:deps` is now an explicit script and a blocking CI step immediately after `npm ci`;
- the matching Next ESLint plugin and Core Web Vitals rules are active at the root config level, removing the build-time “plugin not detected” blind spot;
- the vocabulary-card asset uses `next/image` with explicit dimensions and responsive sizing instead of an unoptimized raw image element;
- `npm run audio:qc` now prepares a pinned, ignored Python tool environment instead of failing on a clean machine, and its inventory expectation is corrected from 164 to the actual 176 dialogue files;
- 39 legacy recordings whose reading/dialogue banks were later expanded use explicit snapshots in `content/audio-transcript-overrides.json`; QC measures those documented recording-time transcripts rather than silently comparing clips with newer expanded text;
- twelve files, `d-b2-38`–`d-b2-49`, were not dialogue recordings at all: their ID3 comments said “pending real voice generation” and all decoded to the same audio as `d-b2-01`. They are now actual German recordings with the selected educational voices and corrected manifest bytes;
- audio QC now rejects explicit placeholder markers and duplicate decoded PCM, so changing only a filename or ID3 tag cannot conceal reused audio. The final machine pass covers 1099/1099 files with zero anomalies. This remains a machine check, not a claim that a human listened to every final recording.

## CI lifecycle (R138)

The full gate previously ran once for a feature-branch push and again for the pull-request event at the same commit. CI now runs once per pull request and once on `main` after merge. A concurrency group cancels an older run for the same PR/ref, the workflow has read-only repository permission, and the gate job has a 30-minute ceiling. React and React DOM are refreshed in the lockfile from 19.3.0 to the compatible 19.3.1 patch without widening the declared major range. K341 guards this configuration and lock state.

## Lighthouse dependency boundary (R141)

Lighthouse CI was invoked through `npx`, so its transitive dependency tree was downloaded outside the repository lockfile and never appeared in the blocking dependency audit. `@lhci/cli` 0.16.0 is now an exact development dependency and the script calls the local `lhci` binary. Once visible to `npm audit`, its proxy chain exposed nine high-severity paths to GHSA-c475-qrg2-pj4r; the affected `basic-ftp` package is overridden to patched 6.2.6. A clean install audits the complete 617-package tree with zero known moderate-or-higher findings. K343 guards the exact LHCI and patched transitive versions.

## CI action supply chain (R142)

The CI workflow previously referenced `actions/checkout@v7`, `actions/setup-node@v7`, and `actions/setup-python@v6`. Those major tags are convenient but mutable: a later tag move could change executable CI code without any repository diff or review.

The three actions are now pinned to the full commit SHAs corresponding to checkout 7.0.1, setup-node 7.1.0, and setup-python 7.1.0. Checkout also sets `persist-credentials: false`, so the workflow token is removed from Git configuration after the initial read-only checkout. A weekly, grouped GitHub Actions Dependabot configuration preserves maintainability: updates arrive as bounded pull requests and must pass the same production gates before merge. The first generated update moved setup-python from 6.3.0 to its reviewed, signed 7.1.0 tag and passed the Python cache/audio path. K344 rejects unknown actions, mutable tag/branch references, missing full-SHA pins or version annotations, a missing credential restriction, or removal of the update policy; it does not hard-code a stale SHA snapshot that would make every legitimate Dependabot update fail before functional CI can assess it.

## Python audio-QC dependency integrity (R143)

The isolated audio-QC environment used exact Python versions, but `pip install -r` still trusted whichever artifact the package index returned for those versions and allowed source distributions to execute build steps. Version pinning alone therefore did not give the Python toolchain the artifact integrity already provided by npm's lockfile.

The four-package audio-QC lock now records all 201 published wheel SHA-256 hashes for miniaudio 1.71, NumPy 2.4.6, cffi 2.1.1, and pycparser 3.12. The runner validates that every exact requirement has at least one well-formed hash even when a prepared environment already exists, then installs with both `--require-hashes` and `--only-binary=:all:`. A missing/unlisted wheel, changed bytes, unpinned transitive dependency, or source distribution now fails before any QC code runs. K345 guards the four exact versions, complete unique hash inventory, lock validation, and the two enforcing pip flags.

## npm update governance (R144)

The npm lockfile and blocking audit provide a reproducible zero-known-vulnerability baseline, but without a scheduled npm update channel that baseline could age until a manual review happened to notice it. GitHub Actions already had bounded Dependabot maintenance; the 617-package application/tooling tree did not.

Dependabot now checks npm weekly with `increase-if-necessary`, groups minor and patch proposals into separate production and development pull requests, and limits the queue to two. This preserves a small review surface while allowing exact direct pins to receive reviewed patches rather than silently remaining frozen. Next, React, and React DOM major upgrades are excluded from this maintenance lane because they require a dedicated compatibility cycle; they are not silently applied. No auto-merge is configured: every proposal exposes its manifest/lockfile diff and must pass clean `npm ci`, the moderate-or-higher dependency audit, browser E2E, Lighthouse, and the other production gates. K346 parses the YAML policy and guards its cadence, queue bound, grouping, versioning strategy, and framework-major boundaries.

## First governed npm refresh (R145)

The first grouped development proposal proved why `npm ci` remains the first blocking gate: Dependabot PR #42 updated Tailwind/PostCSS but emitted an internally incomplete lockfile that omitted nested optional proxy packages still required by the Lighthouse/Puppeteer graph. CI rejected it before any generator or application code ran, so the red bot lock was not merged.

The lock was regenerated from current `main` with the repository's npm toolchain, advancing resolutions within the compatible ranges to Tailwind CSS and `@tailwindcss/postcss` 4.3.5 and PostCSS 8.5.32 while retaining the complete transitive and cross-platform optional inventory. A clean `npm ci` now succeeds and the audited installed tree remains at zero known vulnerabilities. K347 guards that the Tailwind package, PostCSS adapter, Node bridge, and Oxide binary selector resolve to one 4.x version with registry integrity metadata; it also keeps PostCSS on its declared 8.x boundary without freezing future reviewed patches.

## jsdom 31 compatibility boundary (R146)

Dependabot PR #43 proposed the jsdom 31 major but carried the same incomplete generated lock pattern as the rejected grouped update. The major also changes CSS/selector internals, parser timing, optional canvas support, and its Node engine floor, so a green deployment preview alone was not sufficient evidence.

The dependency was reinstalled from current `main` and pinned at 31.0.0. The complete 981-case interaction suite passed against the real externalized jsdom package, including React rendering, clicks, text input, accessibility checks, and clean stderr. The tests construct a static document without resource-executing scripts, and canvas remains an explicit deterministic no-op; the new optional `@napi-rs/canvas` backend is not installed. Because jsdom 31 requires Node `^22.22.2` or newer supported lines, the repository now declares `>=22.22.2 <23` and CI uses 22.22.3 rather than an ambiguous Node 22 major. K348 binds the package, lock, runtime floor, workflow version, and canvas boundary.

## npm lifecycle-script boundary (R147)

A hash-locked npm tree still allowed dependency lifecycle hooks to execute during the first CI step, before repository, dependency, or application audits ran. The current lock declares one such package, esbuild 0.28.2; its install hook verifies or repairs binary selection, but the locked Linux package already contains the required executable. Letting every future transitive package run arbitrary install code was therefore broader authority than the build needs.

CI now installs with `npm ci --ignore-scripts`. A clean installation under that policy successfully invoked esbuild 0.28.2, passed all 1974 engine-smoke assertions, and produced the optimized Next.js build. K349 derives the lifecycle-hook inventory from `package-lock.json` and requires it to remain exactly the reviewed esbuild entry while also guarding that script suppression happens before generators. A future package may request a hook, but it will remain unexecuted and make the policy gate fail until its need and artifact behavior are reviewed explicitly.

## Vocabulary-card asset footprint (R148)

The production `public/cards` directory still contained 378 original PNG files even though every one already had a WebP counterpart and the live vocabulary manifest referenced WebP exclusively. Because Next.js publishes everything under `public`, these unreachable source copies remained part of the deployment artifact: 194,446,590 bytes of duplicate raster data. The largest individual PNG was 9.1 MB, while the live card UI requests responsive images through `next/image`.

The duplicate PNG set is removed. Card inventory falls from 210,039,140 to 15,592,550 bytes (92.6%), and the tracked `public` inventory falls from 339,918,281 to 145,471,691 bytes (57.2%) without changing a live URL or image payload. After `prebuild` generates the ignored 3,065,305-byte core bank, the production `public` tree is 148,536,996 bytes instead of 342,983,586 (56.7% smaller). K350 now enforces a WebP-only card directory under 20 MB, validates every `img` value in `content/vocab.json` as a safe existing local WebP path, and caps the currently referenced set at 4 MB total and 120 KB per source image. The current 208 declarations resolve to 180 unique files totaling 2,960,118 bytes; their largest source is 91,052 bytes. These figures measure repository/deployment assets, not end-user transfer or real-device rendering performance.

## Orphan card-asset closure (R149)

R148 removed redundant formats, but 318 WebP files still had no `img` reference anywhere in the live vocabulary bank. They included superseded batches and historical generated assets totaling 12,632,432 bytes; they could not be requested by the only runtime card-image path, which renders `card.img` from `content/vocab.json`. Keeping them under `public` nevertheless shipped them with every deployment.

The orphan set is removed, leaving exactly the 180 unique files reached by the bank’s 208 image declarations. `public/cards` falls again from 15,592,550 to 2,960,118 bytes (81.0% in this cycle; 98.6% from the original PNG+WebP inventory). The tracked `public` tree is now 132,839,259 bytes, and the post-`prebuild` production tree is 135,904,564 bytes, 60.4% below its original 342,983,586-byte state. K351 compares the complete card-directory filename set with the manifest-derived reference set and rejects both orphan files and missing assets; K350’s inventory ceiling is tightened from 20 MB to 4 MB. This establishes repository reachability, not a claim that historical external deep links remain supported.

## Progress-store lifecycle (R140)

`useProgress.update` previously called `saveProgress` from inside a functional React state updater. Because saving synchronously broadcasts the progress event, a second subscriber could update while React was still rendering the writer, producing the runtime warning “Cannot update a component while rendering a different component.” Persistence and event delivery now happen outside the state-updater callback, while a synchronized ref preserves sequential updates and the existing save-failure rollback contract. The calibration panel receives its owner’s updater rather than opening a nested subscription. K342 and R316 cover two immediate writes, two subscribers, persistent equality, and absence of the cross-render warning; the complete interactive suite returns with clean stderr.

Acceptance condition: `npm audit --audit-level=moderate` reports zero known vulnerabilities, followed by TypeScript, lint, smoke, interactive DOM, content audit, generator stability, and production build gates.
