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

## Progress-store lifecycle (R140)

`useProgress.update` previously called `saveProgress` from inside a functional React state updater. Because saving synchronously broadcasts the progress event, a second subscriber could update while React was still rendering the writer, producing the runtime warning “Cannot update a component while rendering a different component.” Persistence and event delivery now happen outside the state-updater callback, while a synchronized ref preserves sequential updates and the existing save-failure rollback contract. The calibration panel receives its owner’s updater rather than opening a nested subscription. K342 and R316 cover two immediate writes, two subscribers, persistent equality, and absence of the cross-render warning; the complete interactive suite returns with clean stderr.

Acceptance condition: `npm audit --audit-level=moderate` reports zero known vulnerabilities, followed by TypeScript, lint, smoke, interactive DOM, content audit, generator stability, and production build gates.
