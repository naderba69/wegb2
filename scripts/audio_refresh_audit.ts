import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

type ReadingText = { id: string; level: string; de: string };
type AudioManifestEntry = { id: string; file: string; voice: string; level: string; bytes: number };
type TranscriptSnapshot = { id: string; file: string; group: string };
type RefreshItem = {
  id: string;
  level: string;
  file: string;
  sourceTextSha256: string;
  generatedAudioSha256: string;
  bytes: number;
  previousAudioSha256: string;
  previousBytes: number;
  removedTranscriptSnapshotSha256: string;
  removedTranscriptAudioCommit: string;
};
type RefreshFixture = {
  schema: string;
  batch: string;
  generatedAt: string;
  scope: string;
  voice: string;
  sourcePath: string;
  items: RefreshItem[];
  transcriptSnapshotLedger: { before: number; removed: number; after: number };
  validation: {
    generationInputWasExactCurrentGermanText: boolean;
    technicalAudioQc: string;
    technicalAudioQcReport: string;
    humanListening: boolean;
    pronunciationQualityJudged: boolean;
    naturalnessJudged: boolean;
    independentLinguisticSignOff: boolean;
    externalCefrOrExamValidation: boolean;
  };
  claimBoundary: string;
};
type QcEntry = {
  id: string;
  gruppe: string;
  datei: string;
  voice: string;
  bytes: number;
  zeichen: number;
  ok: boolean;
  fehler: string[];
};
type QcReport = {
  datum: string;
  anomalienGesamt: number;
  abdeckung: { luecken: string[] };
  dateien: QcEntry[];
};
type BatchSpec = {
  batch: string;
  fixturePath: string;
  ids: string[];
  ledgerBefore: number;
  ledgerAfter: number;
};

const root = process.cwd();
const readJson = <T>(relativePath: string): T => JSON.parse(
  fs.readFileSync(path.join(root, relativePath), "utf8"),
) as T;
const sha256 = (value: string | Buffer): string => createHash("sha256").update(value).digest("hex");
const voice = "voice-02 (de-DE, Arena TTS)";
const batchSpecs: BatchSpec[] = [
  {
    batch: "PA-039-01",
    fixturePath: "scripts/fixtures/audio-refresh-pa039-01.json",
    ids: [
      "t-b1-01", "t-b1-03", "t-b1-06", "t-b1-07", "t-b1-08", "t-b1-09",
      "t-b2-21", "t-b2-22", "t-b2-23", "t-b2-24",
    ],
    ledgerBefore: 97,
    ledgerAfter: 87,
  },
  {
    batch: "PA-039-02",
    fixturePath: "scripts/fixtures/audio-refresh-pa039-02.json",
    ids: [
      "t-b2-25", "t-b2-31", "t-b2-32", "t-b2-33", "t-b2-34",
      "t-b2-35", "t-b2-36", "t-b2-37", "t-b2-38", "t-b2-39",
    ],
    ledgerBefore: 87,
    ledgerAfter: 77,
  },
];
const fixtures = batchSpecs.map((spec) => ({ spec, fixture: readJson<RefreshFixture>(spec.fixturePath) }));
const texts = readJson<ReadingText[]>("content/texts.json");
const manifest = readJson<{ count: number; einsaetze: AudioManifestEntry[] }>("content/hoeren-audio.json");
const publicManifest = readJson<Array<{ p: string; b: number }>>("public/audio-manifest.json");
const snapshots = readJson<{ items: TranscriptSnapshot[] }>("content/audio-transcript-overrides.json");
const qc = readJson<QcReport>("docs/audio-qc-all-2026-11-04.json");
const textById = new Map(texts.map((entry) => [entry.id, entry]));
const manifestById = new Map(manifest.einsaetze.map((entry) => [entry.id, entry]));
const publicByPath = new Map(publicManifest.map((entry) => [entry.p, entry]));
const qcByPath = new Map(qc.dateien.map((entry) => [entry.datei, entry]));
const errors: string[] = [];
const fail = (message: string): void => { errors.push(message); };
const allExpectedIds = batchSpecs.flatMap((spec) => spec.ids);
const allExpectedSet = new Set(allExpectedIds);

if (allExpectedSet.size !== allExpectedIds.length) {
  fail("PA-039 batches must not overlap");
}
if (manifest.count !== 157 || manifest.einsaetze.length !== 157) {
  fail("HörLabor manifest must remain complete at 157 entries");
}

for (const { spec, fixture } of fixtures) {
  if (fixture.schema !== "wegb2-audio-refresh-batch-v1" || fixture.batch !== spec.batch
    || fixture.generatedAt !== "2026-11-04" || fixture.sourcePath !== "content/texts.json"
    || fixture.voice !== voice) {
    fail(`${spec.batch}: fixture identity, date, source, or voice is outside the bounded contract`);
  }
  const expectedSet = new Set(spec.ids);
  const fixtureIds = fixture.items.map((entry) => entry.id);
  if (fixture.items.length !== spec.ids.length || new Set(fixtureIds).size !== spec.ids.length
    || spec.ids.some((id) => !fixtureIds.includes(id))
    || fixtureIds.some((id) => !expectedSet.has(id))) {
    fail(`${spec.batch}: fixture must contain exactly its ten bounded reading IDs`);
  }
  if (fixture.transcriptSnapshotLedger.before !== spec.ledgerBefore
    || fixture.transcriptSnapshotLedger.removed !== spec.ids.length
    || fixture.transcriptSnapshotLedger.after !== spec.ledgerAfter
    || spec.ledgerBefore - spec.ids.length !== spec.ledgerAfter) {
    fail(`${spec.batch}: transcript-snapshot ledger transition is inconsistent`);
  }
  if (!fixture.validation.generationInputWasExactCurrentGermanText
    || fixture.validation.technicalAudioQc !== "pass-1099-of-1099"
    || fixture.validation.technicalAudioQcReport !== "docs/audio-qc-all-2026-11-04.json"
    || fixture.validation.humanListening !== false
    || fixture.validation.pronunciationQualityJudged !== false
    || fixture.validation.naturalnessJudged !== false
    || fixture.validation.independentLinguisticSignOff !== false
    || fixture.validation.externalCefrOrExamValidation !== false
    || !fixture.scope.includes("no human listening")
    || !fixture.claimBoundary.includes("do not establish that a human heard every word")) {
    fail(`${spec.batch}: generation provenance and no-human/no-pronunciation boundaries must remain explicit`);
  }

  for (const item of fixture.items) {
    const text = textById.get(item.id);
    const entry = manifestById.get(item.id);
    const diskPath = path.join(root, "public", item.file.replace(/^\//, ""));
    const audio = fs.existsSync(diskPath) ? fs.readFileSync(diskPath) : Buffer.alloc(0);
    const qcEntry = qcByPath.get(item.file);
    const publicEntry = publicByPath.get(item.file);
    if (!text || !entry) {
      fail(`${spec.batch}/${item.id}: missing current text or manifest entry`);
      continue;
    }
    if (item.level !== text.level || entry.level !== text.level
      || item.file !== `/audio/hoeren/${item.id}.mp3` || entry.file !== item.file
      || entry.voice !== voice) {
      fail(`${spec.batch}/${item.id}: level, local path, or voice does not match the current manifest contract`);
    }
    if (sha256(text.de) !== item.sourceTextSha256) {
      fail(`${spec.batch}/${item.id}: current German text drifted from the exact generation-input hash`);
    }
    if (audio.subarray(0, 3).toString() !== "ID3" || audio.length !== item.bytes
      || entry.bytes !== item.bytes || publicEntry?.b !== item.bytes
      || sha256(audio) !== item.generatedAudioSha256) {
      fail(`${spec.batch}/${item.id}: generated MP3 bytes/hash/header drifted from fixture or manifests`);
    }
    if (item.generatedAudioSha256 === item.previousAudioSha256 || item.bytes === item.previousBytes) {
      fail(`${spec.batch}/${item.id}: fixture does not prove replacement of the prior recording identity`);
    }
    if (!/^[a-f0-9]{64}$/.test(item.removedTranscriptSnapshotSha256)
      || !/^[a-f0-9]{40}$/.test(item.removedTranscriptAudioCommit)) {
      fail(`${spec.batch}/${item.id}: removed recording-time snapshot provenance is malformed`);
    }
    if (!qcEntry || qcEntry.id !== item.id || qcEntry.gruppe !== "hoeren"
      || qcEntry.voice !== voice || qcEntry.bytes !== item.bytes
      || qcEntry.zeichen !== [...text.de].length || !qcEntry.ok || qcEntry.fehler.length !== 0) {
      fail(`${spec.batch}/${item.id}: current full-stock technical Audio-QC result is missing or inconsistent`);
    }
  }
}

const finalLedgerCount = batchSpecs.at(-1)?.ledgerAfter ?? -1;
if (snapshots.items.length !== finalLedgerCount
  || snapshots.items.some((entry) => allExpectedSet.has(entry.id))
  || batchSpecs.some((spec, index) => index > 0 && batchSpecs[index - 1].ledgerAfter !== spec.ledgerBefore)) {
  fail("recording-time transcript snapshot ledger must truthfully fall from 97 to 77 across both batches");
}
if (qc.datum !== "2026-11-04" || qc.dateien.length !== 1099
  || qc.anomalienGesamt !== 0 || qc.abdeckung.luecken.length !== 0) {
  fail("full-stock Audio-QC must pass 1099/1099 with zero anomalies and gaps");
}

if (errors.length > 0) {
  console.error(`audio refresh audit failed (${errors.length})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("PA-039-01/02 audio refresh: 20 current-text recordings guarded; snapshot ledger 97 -> 77; technical QC passed; no human listening/pronunciation claim");
