import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

type ReadingText = {
  id: string;
  level: string;
  de: string;
};

type AudioManifestEntry = {
  id: string;
  file: string;
  voice: string;
  level: string;
  bytes: number;
};

type TranscriptSnapshot = {
  id: string;
  file: string;
  group: string;
};

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
  transcriptSnapshotLedger: {
    before: number;
    removed: number;
    after: number;
  };
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

const root = process.cwd();
const readJson = <T>(relativePath: string): T => JSON.parse(
  fs.readFileSync(path.join(root, relativePath), "utf8"),
) as T;
const sha256 = (value: string | Buffer): string => createHash("sha256").update(value).digest("hex");

const expectedIds = [
  "t-b1-01", "t-b1-03", "t-b1-06", "t-b1-07", "t-b1-08", "t-b1-09",
  "t-b2-21", "t-b2-22", "t-b2-23", "t-b2-24",
];
const expectedSet = new Set(expectedIds);
const voice = "voice-02 (de-DE, Arena TTS)";
const fixture = readJson<RefreshFixture>("scripts/fixtures/audio-refresh-pa039-01.json");
const texts = readJson<ReadingText[]>("content/texts.json");
const manifest = readJson<{ count: number; einsaetze: AudioManifestEntry[] }>("content/hoeren-audio.json");
const publicManifest = readJson<Array<{ p: string; b: number }>>("public/audio-manifest.json");
const snapshots = readJson<{ items: TranscriptSnapshot[] }>("content/audio-transcript-overrides.json");
const qc = readJson<QcReport>(fixture.validation.technicalAudioQcReport);
const textById = new Map(texts.map((entry) => [entry.id, entry]));
const manifestById = new Map(manifest.einsaetze.map((entry) => [entry.id, entry]));
const qcByPath = new Map(qc.dateien.map((entry) => [entry.datei, entry]));
const errors: string[] = [];

const fail = (message: string): void => {
  errors.push(message);
};

if (fixture.schema !== "wegb2-audio-refresh-batch-v1" || fixture.batch !== "PA-039-01"
  || fixture.generatedAt !== "2026-11-04" || fixture.sourcePath !== "content/texts.json"
  || fixture.voice !== voice) {
  fail("fixture identity, date, source, or voice is not the bounded PA-039-01 contract");
}

const fixtureIds = fixture.items.map((entry) => entry.id);
if (fixture.items.length !== expectedIds.length || new Set(fixtureIds).size !== expectedIds.length
  || expectedIds.some((id) => !fixtureIds.includes(id))
  || fixtureIds.some((id) => !expectedSet.has(id))) {
  fail("fixture must contain exactly the ten bounded PA-039-01 reading IDs");
}

if (manifest.count !== 157 || manifest.einsaetze.length !== 157) {
  fail("HörLabor manifest must remain complete at 157 entries");
}

for (const item of fixture.items) {
  const text = textById.get(item.id);
  const entry = manifestById.get(item.id);
  const diskPath = path.join(root, "public", item.file.replace(/^\//, ""));
  const audio = fs.existsSync(diskPath) ? fs.readFileSync(diskPath) : Buffer.alloc(0);
  const qcEntry = qcByPath.get(item.file);
  const publicEntry = publicManifest.find((candidate) => candidate.p === item.file);
  if (!text || !entry) {
    fail(`${item.id}: missing current text or manifest entry`);
    continue;
  }
  if (item.level !== text.level || entry.level !== text.level
    || item.file !== `/audio/hoeren/${item.id}.mp3` || entry.file !== item.file
    || entry.voice !== voice) {
    fail(`${item.id}: level, local path, or voice does not match the current manifest contract`);
  }
  if (sha256(text.de) !== item.sourceTextSha256) {
    fail(`${item.id}: current German source text drifted from the exact generation-input hash`);
  }
  if (audio.subarray(0, 3).toString() !== "ID3" || audio.length !== item.bytes
    || entry.bytes !== item.bytes || publicEntry?.b !== item.bytes
    || sha256(audio) !== item.generatedAudioSha256) {
    fail(`${item.id}: generated MP3 bytes/hash/header drifted from fixture or manifest`);
  }
  if (item.generatedAudioSha256 === item.previousAudioSha256 || item.bytes === item.previousBytes) {
    fail(`${item.id}: fixture does not prove replacement of the prior recording identity`);
  }
  if (!/^[a-f0-9]{64}$/.test(item.removedTranscriptSnapshotSha256)
    || !/^[a-f0-9]{40}$/.test(item.removedTranscriptAudioCommit)) {
    fail(`${item.id}: removed recording-time snapshot provenance is malformed`);
  }
  if (!qcEntry || qcEntry.id !== item.id || qcEntry.gruppe !== "hoeren"
    || qcEntry.voice !== voice || qcEntry.bytes !== item.bytes
    || qcEntry.zeichen !== [...text.de].length || !qcEntry.ok || qcEntry.fehler.length !== 0) {
    fail(`${item.id}: current full-stock technical Audio-QC result is missing or inconsistent`);
  }
}

if (snapshots.items.length !== 87 || snapshots.items.some((entry) => expectedSet.has(entry.id))
  || fixture.transcriptSnapshotLedger.before !== 97
  || fixture.transcriptSnapshotLedger.removed !== expectedIds.length
  || fixture.transcriptSnapshotLedger.after !== snapshots.items.length
  || fixture.transcriptSnapshotLedger.before - fixture.transcriptSnapshotLedger.removed
    !== fixture.transcriptSnapshotLedger.after) {
  fail("recording-time transcript snapshot ledger must truthfully fall from 97 to 87");
}

if (!fixture.validation.generationInputWasExactCurrentGermanText
  || fixture.validation.technicalAudioQc !== "pass-1099-of-1099"
  || fixture.validation.humanListening !== false
  || fixture.validation.pronunciationQualityJudged !== false
  || fixture.validation.naturalnessJudged !== false
  || fixture.validation.independentLinguisticSignOff !== false
  || fixture.validation.externalCefrOrExamValidation !== false
  || !fixture.scope.includes("no human listening")
  || !fixture.claimBoundary.includes("do not establish that a human heard every word")) {
  fail("generation provenance and no-human/no-pronunciation claim boundaries must remain explicit");
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

console.log("PA-039-01 audio refresh: 10 current-text recordings guarded; snapshot ledger 97 -> 87; technical QC passed; no human listening/pronunciation claim");
