# Production hardening — 2026-11-04

## Scope

This cycle hardens the newly introduced five-station “Today” flow and restores a zero-known-vulnerability dependency baseline. It does not claim device, field, learning-effect, or external accessibility validation.

## Five-station flow (R310)

The first implementation visually marked later stations as locked, but a task button inside a later station remained enabled once the older retrieval ritual opened. It also treated a station as complete only after a passing score, while the established day engine submits failed attempts and sends them to debt/review. Finally, local quiz points could visually complete a station before an actual submission.

The corrected contract is centralized in `lib/tagesstationen.ts`:

- mandatory debt, retrieval, and delayed verification belong to station 1;
- only a persisted task submission opens the next station;
- a submitted failed attempt counts as submitted and continues through the existing debt/review model;
- local, unsubmitted points never open another station;
- locked buttons are disabled in both the five-station map and the legacy task list;
- a stored position from an older version falls back to the first active task instead of opening locked content.

Automated evidence: K335a–K335f in `scripts/engine_smoke.ts` and R310-1–R310-8 in `scripts/interaktiv_test.tsx`, including axe-core coverage and the interleaved source-order edge case on day 1.

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
- the 20 legacy B2 listening recordings explicitly declare `textScope: "first-paragraph"`: the files contain the original opening paragraph, while the reading bank was later expanded. QC measures the declared spoken excerpt rather than silently comparing those clips with the expanded full text;
- twelve files, `d-b2-38`–`d-b2-49`, were not dialogue recordings at all: their ID3 comments said “pending real voice generation” and all decoded to the same audio as `d-b2-01`. They are now actual German recordings with the selected educational voices and corrected manifest bytes;
- audio QC now rejects explicit placeholder markers and duplicate decoded PCM, so changing only a filename or ID3 tag cannot conceal reused audio. The final machine pass covers 1099/1099 files with zero anomalies. This remains a machine check, not a claim that a human listened to every final recording.

Acceptance condition: `npm audit --audit-level=moderate` reports zero known vulnerabilities, followed by TypeScript, lint, smoke, interactive DOM, content audit, generator stability, and production build gates.
