import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

type DialogueLine = { who: string; de: string };
type Dialogue = { id: string; level: string; lines: DialogueLine[] };
type ManifestEntry = { id: string; file: string; bytes: number; voice: string; level: string; stimmen: number };
type GenerationSegment = {
  speaker: string;
  voice: string;
  sourceTextSha256: string;
  characters: number;
  generatedSegmentAudioSha256: string;
  bytes: number;
};
type RefreshItem = {
  id: string;
  level: string;
  file: string;
  sourceTextSha256: string;
  sourceLineCount: number;
  generatedAudioSha256: string;
  bytes: number;
  voice: string;
  previousAudioSha256: string;
  previousBytes: number;
  removedTranscriptSnapshotSha256: string;
  removedTranscriptAudioCommit: string;
  generationSegments: GenerationSegment[];
};
type RefreshFixture = {
  schema: string;
  batch: string;
  generatedAt: string;
  scope: string;
  sourcePath: string;
  sourceLineJoiner: string;
  voices: { oneSpeaker: string; twoSpeaker: string };
  items: RefreshItem[];
  transcriptSnapshotLedger: { before: number; removed: number; after: number };
  validation: {
    generationInputWasExactCurrentGermanText: boolean;
    speakerOrderHashGuarded: boolean;
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
const batchSpecs: BatchSpec[] = [
  {
    batch: "PA-040-01",
    fixturePath: "scripts/fixtures/dialog-audio-refresh-pa040-01.json",
    ids: ["d-a0-ht01", "d-a0-ht02", "d-a2-ht01", "d-a2-ht03", "d-b1-04"],
    ledgerBefore: 71,
    ledgerAfter: 66,
  },
  {
    batch: "PA-040-02",
    fixturePath: "scripts/fixtures/dialog-audio-refresh-pa040-02.json",
    ids: ["d-b1-06", "d-b1-ht01", "d-b1-ht02", "d-b2-ht01", "d-b2-ht02"],
    ledgerBefore: 66,
    ledgerAfter: 61,
  },
  {
    batch: "PA-040-03",
    fixturePath: "scripts/fixtures/dialog-audio-refresh-pa040-03.json",
    ids: ["d-b2-ht03", "hoer-a1-01", "hoer-a1-02", "hoer-a2-02", "hoer-b1-01", "hoer-b2-01"],
    ledgerBefore: 61,
    ledgerAfter: 55,
  },
  {
    batch: "PA-040-04",
    fixturePath: "scripts/fixtures/dialog-audio-refresh-pa040-04.json",
    ids: ["d-b1-32", "d-b1-07"],
    ledgerBefore: 55,
    ledgerAfter: 53,
  },
];
const twoSpeakerVoices: Record<string, string[]> = {
  "d-b1-04": ["voice-02", "voice-03", "voice-02", "voice-03", "voice-02"],
  "d-b1-06": ["voice-03", "voice-02", "voice-03", "voice-02", "voice-03", "voice-02"],
  "d-b1-07": ["voice-03", "voice-02", "voice-03", "voice-02", "voice-03"],
  "d-b1-32": ["voice-03", "voice-02", "voice-03", "voice-02", "voice-03"],
};
const fixtures = batchSpecs.map((spec) => ({ spec, fixture: readJson<RefreshFixture>(spec.fixturePath) }));
const dialogues = readJson<Dialogue[]>("content/dialogues.json");
const manifest = readJson<{ count: number; einsaetze: ManifestEntry[] }>("content/dialog-audio.json");
const publicManifest = readJson<Array<{ p: string; b: number }>>("public/audio-manifest.json");
const snapshots = readJson<{ items: Array<{ id: string; group: string }> }>("content/audio-transcript-overrides.json");
const qc = readJson<QcReport>("docs/audio-qc-all-2026-11-04.json");
const dialogueById = new Map(dialogues.map((entry) => [entry.id, entry]));
const manifestById = new Map(manifest.einsaetze.map((entry) => [entry.id, entry]));
const publicByPath = new Map(publicManifest.map((entry) => [entry.p, entry]));
const qcByPath = new Map(qc.dateien.map((entry) => [entry.datei, entry]));
const errors: string[] = [];
const fail = (message: string): void => { errors.push(message); };
const allExpectedIds = batchSpecs.flatMap((spec) => spec.ids);
const allExpectedSet = new Set(allExpectedIds);

if (allExpectedSet.size !== allExpectedIds.length) fail("PA-040 batches must not overlap");
if (manifest.count !== 176 || manifest.einsaetze.length !== 176) {
  fail("dialog audio manifest must remain complete at 176 entries");
}

for (const { spec, fixture } of fixtures) {
  if (fixture.schema !== "wegb2-dialog-audio-refresh-batch-v1" || fixture.batch !== spec.batch
    || fixture.generatedAt !== "2026-11-04" || fixture.sourcePath !== "content/dialogues.json"
    || fixture.sourceLineJoiner !== " "
    || fixture.voices.oneSpeaker !== "ki-voice-02 (Arena voice-02, de-DE TTS)"
    || fixture.voices.twoSpeaker !== "ki-voice-02+voice-03 (Arena de-DE TTS)") {
    fail(`${spec.batch}: fixture identity, source, date, joiner, or voices drifted`);
  }
  const expectedSet = new Set(spec.ids);
  const fixtureIds = fixture.items.map((entry) => entry.id);
  if (fixture.items.length !== spec.ids.length || new Set(fixtureIds).size !== spec.ids.length
    || spec.ids.some((id) => !fixtureIds.includes(id)) || fixtureIds.some((id) => !expectedSet.has(id))) {
    fail(`${spec.batch}: fixture must contain exactly its bounded dialogue IDs`);
  }
  if (fixture.transcriptSnapshotLedger.before !== spec.ledgerBefore
    || fixture.transcriptSnapshotLedger.removed !== spec.ids.length
    || fixture.transcriptSnapshotLedger.after !== spec.ledgerAfter
    || spec.ledgerBefore - spec.ids.length !== spec.ledgerAfter) {
    fail(`${spec.batch}: transcript-snapshot ledger transition is inconsistent`);
  }
  if (!fixture.validation.generationInputWasExactCurrentGermanText || !fixture.validation.speakerOrderHashGuarded
    || fixture.validation.technicalAudioQc !== "pass-1099-of-1099"
    || fixture.validation.technicalAudioQcReport !== "docs/audio-qc-all-2026-11-04.json"
    || fixture.validation.humanListening !== false || fixture.validation.pronunciationQualityJudged !== false
    || fixture.validation.naturalnessJudged !== false || fixture.validation.independentLinguisticSignOff !== false
    || fixture.validation.externalCefrOrExamValidation !== false
    || !fixture.scope.includes("no human listening")
    || !fixture.claimBoundary.includes("do not establish that a human heard every word")) {
    fail(`${spec.batch}: generation provenance and no-human/no-pronunciation boundaries must remain explicit`);
  }

  for (const item of fixture.items) {
    const dialogue = dialogueById.get(item.id);
    const entry = manifestById.get(item.id);
    const diskPath = path.join(root, "public", item.file.replace(/^\//, ""));
    const audio = fs.existsSync(diskPath) ? fs.readFileSync(diskPath) : Buffer.alloc(0);
    const publicEntry = publicByPath.get(item.file);
    const qcEntry = qcByPath.get(item.file);
    if (!dialogue || !entry) {
      fail(`${spec.batch}/${item.id}: current dialogue or manifest entry is missing`);
      continue;
    }
    const source = dialogue.lines.map((line) => line.de).join(" ");
    const voices = twoSpeakerVoices[item.id];
    const expectedTexts = voices ? dialogue.lines.map((line) => line.de) : [source];
    const expectedSpeakers = voices ? dialogue.lines.map((line) => line.who) : [dialogue.lines[0].who];
    const expectedVoices = voices ?? ["voice-02"];
    const expectedVoiceLabel = voices ? "ki-voice-02+voice-03" : "ki-voice-02";
    const expectedSpeakerCount = voices ? 2 : 1;
    if (item.level !== dialogue.level || entry.level !== dialogue.level
      || item.file !== `/audio/dialog/${item.id}.mp3` || entry.file !== item.file
      || item.voice !== expectedVoiceLabel || entry.voice !== expectedVoiceLabel
      || entry.stimmen !== expectedSpeakerCount || item.sourceLineCount !== dialogue.lines.length) {
      fail(`${spec.batch}/${item.id}: level, path, voice, speaker count, or source-line count drifted`);
    }
    if (item.sourceTextSha256 !== sha256(source)) {
      fail(`${spec.batch}/${item.id}: current German dialogue drifted from its exact generation-input hash`);
    }
    if (audio.subarray(0, 3).toString() !== "ID3" || audio.length !== item.bytes
      || entry.bytes !== item.bytes || publicEntry?.b !== item.bytes
      || item.generatedAudioSha256 !== sha256(audio)) {
      fail(`${spec.batch}/${item.id}: generated MP3 bytes/hash/header drifted from fixture or manifests`);
    }
    let offset = 0;
    const segmentsValid = item.generationSegments.length === expectedTexts.length
      && expectedTexts.join(" ") === source
      && item.generationSegments.every((segment, index) => {
        const bytes = audio.subarray(offset, offset + segment.bytes);
        offset += segment.bytes;
        return segment.speaker === expectedSpeakers[index] && segment.voice === expectedVoices[index]
          && segment.characters === expectedTexts[index].length
          && segment.sourceTextSha256 === sha256(expectedTexts[index])
          && segment.generatedSegmentAudioSha256 === sha256(bytes)
          && bytes.subarray(0, 3).toString() === "ID3";
      }) && offset === audio.length;
    if (!segmentsValid) {
      fail(`${spec.batch}/${item.id}: source segment, speaker order, voice order, or MP3 segment identity drifted`);
    }
    if (item.generatedAudioSha256 === item.previousAudioSha256 || item.bytes === item.previousBytes) {
      fail(`${spec.batch}/${item.id}: fixture does not prove replacement of the prior recording identity`);
    }
    if (!/^[a-f0-9]{64}$/.test(item.removedTranscriptSnapshotSha256)
      || !/^[a-f0-9]{40}$/.test(item.removedTranscriptAudioCommit)) {
      fail(`${spec.batch}/${item.id}: removed recording-time snapshot provenance is malformed`);
    }
    if (!qcEntry || qcEntry.id !== item.id || qcEntry.gruppe !== "dialog"
      || qcEntry.voice !== expectedVoiceLabel || qcEntry.bytes !== item.bytes
      || qcEntry.zeichen !== [...source].length || !qcEntry.ok || qcEntry.fehler.length !== 0) {
      fail(`${spec.batch}/${item.id}: current full-stock technical Audio-QC result is missing or inconsistent`);
    }
  }
}

const finalLedgerCount = batchSpecs.at(-1)?.ledgerAfter ?? -1;
if (snapshots.items.length > finalLedgerCount
  || snapshots.items.some((entry) => entry.group !== "dialog" || allExpectedSet.has(entry.id))
  || batchSpecs.some((spec, index) => index > 0 && batchSpecs[index - 1].ledgerAfter !== spec.ledgerBefore)) {
  fail("recording-time transcript snapshot ledger must reach 53 across PA-040-01/02/03/04 and may only fall later");
}
if (qc.datum !== "2026-11-04" || qc.dateien.length !== 1099
  || qc.anomalienGesamt !== 0 || qc.abdeckung.luecken.length !== 0) {
  fail("full-stock Audio-QC must pass 1099/1099 with zero anomalies and gaps");
}

if (errors.length > 0) {
  console.error(`dialog audio refresh audit failed (${errors.length})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("PA-040-01/02/03/04 dialogue audio refresh: 18 current-text recordings guarded; snapshot ledger 71 -> 53; technical QC passed; no human listening/pronunciation claim");
