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
  voices: { oneSpeaker: string; twoSpeaker: string; additionalTwoSpeaker?: string };
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
  additionalTwoSpeakerVoice?: string;
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
  {
    batch: "PA-040-05",
    fixturePath: "scripts/fixtures/dialog-audio-refresh-pa040-05.json",
    ids: ["d-b2-07", "d-b2-32"],
    ledgerBefore: 53,
    ledgerAfter: 51,
    additionalTwoSpeakerVoice: "ki-voice-02+voice-04 (Arena voice-04 separately selected for the second masculine role, de-DE TTS)",
  },
  {
    batch: "PA-040-06",
    fixturePath: "scripts/fixtures/dialog-audio-refresh-pa040-06.json",
    ids: ["d-b1-09"],
    ledgerBefore: 51,
    ledgerAfter: 50,
  },
  {
    batch: "PA-040-07",
    fixturePath: "scripts/fixtures/dialog-audio-refresh-pa040-07.json",
    ids: ["d-b1-22"],
    ledgerBefore: 50,
    ledgerAfter: 49,
  },
  {
    batch: "PA-040-08",
    fixturePath: "scripts/fixtures/dialog-audio-refresh-pa040-08.json",
    ids: ["d-b1-13"],
    ledgerBefore: 49,
    ledgerAfter: 48,
  },
  {
    batch: "PA-040-09",
    fixturePath: "scripts/fixtures/dialog-audio-refresh-pa040-09.json",
    ids: ["d-b2-45"],
    ledgerBefore: 48,
    ledgerAfter: 47,
  },
  {
    batch: "PA-040-10",
    fixturePath: "scripts/fixtures/dialog-audio-refresh-pa040-10.json",
    ids: ["d-b1-17"],
    ledgerBefore: 47,
    ledgerAfter: 46,
    additionalTwoSpeakerVoice: "ki-voice-05+voice-06 (Arena voices voice-05 feminine for Lehrerin Kern and voice-06 masculine for Selim, each separately selected by the user via Arena auditions, de-DE TTS)",
  },
  {
    batch: "PA-040-11",
    fixturePath: "scripts/fixtures/dialog-audio-refresh-pa040-11.json",
    ids: ["d-b2-44"],
    ledgerBefore: 46,
    ledgerAfter: 45,
    additionalTwoSpeakerVoice: "ki-voice-07+voice-08 (Arena voices voice-07 feminine for the Lehrerin and voice-08 masculine for the Teilnehmer in d-b2-44, each separately selected by the user via Arena auditions, de-DE TTS)",
  },
  {
    batch: "PA-040-12",
    fixturePath: "scripts/fixtures/dialog-audio-refresh-pa040-12.json",
    ids: ["d-b2-48"],
    ledgerBefore: 45,
    ledgerAfter: 44,
    additionalTwoSpeakerVoice: "ki-voice-09+voice-10 (Arena voices voice-09 feminine for the Vorsitzende and voice-10 masculine for the Mitglied in d-b2-48, each separately selected by the user via Arena auditions, de-DE TTS)",
  },
  {
    batch: "PA-040-13",
    fixturePath: "scripts/fixtures/dialog-audio-refresh-pa040-13.json",
    ids: ["d-b2-43"],
    ledgerBefore: 44,
    ledgerAfter: 43,
    additionalTwoSpeakerVoice: "ki-voice-11+voice-12 (Arena voices voice-11 feminine for the Journalistin and voice-12 masculine for the Kollege in d-b2-43, each separately selected by the user via Arena auditions, de-DE TTS)",
  },
  {
    batch: "PA-040-14",
    fixturePath: "scripts/fixtures/dialog-audio-refresh-pa040-14.json",
    ids: ["d-b2-46"],
    ledgerBefore: 43,
    ledgerAfter: 42,
    additionalTwoSpeakerVoice: "ki-voice-13+voice-14 (Arena voices voice-13 feminine for the Expertin and voice-14 masculine for the Moderator in d-b2-46, each separately selected by the user via Arena auditions, de-DE TTS)",
  },
  {
    batch: "PA-040-15",
    fixturePath: "scripts/fixtures/dialog-audio-refresh-pa040-15.json",
    ids: ["d-b2-47"],
    ledgerBefore: 42,
    ledgerAfter: 41,
    additionalTwoSpeakerVoice: "ki-voice-15+voice-16 (Arena voices voice-15 masculine for the Professor and voice-16 feminine for the Studentin in d-b2-47, each separately selected by the user via Arena auditions, de-DE TTS)",
  },
  {
    batch: "PA-040-16",
    fixturePath: "scripts/fixtures/dialog-audio-refresh-pa040-16.json",
    ids: ["d-b1-11"],
    ledgerBefore: 41,
    ledgerAfter: 40,
    additionalTwoSpeakerVoice: "voice-17+voice-18 (Arena voices voice-17 feminine for the Frau Bähr and voice-18 feminine for the Nadia in d-b1-11, each separately selected by the user via Arena auditions, de-DE TTS; second historically non-KI dialogue moved to explicit dual real-voice labeling)",
  },
  {
    batch: "PA-040-17",
    fixturePath: "scripts/fixtures/dialog-audio-refresh-pa040-17.json",
    ids: ["d-b2-49"],
    ledgerBefore: 40,
    ledgerAfter: 39,
    additionalTwoSpeakerVoice: "ki-voice-19+voice-20 (Arena voices voice-19 masculine for the Bürgermeister and voice-20 feminine for the Bürgerin in d-b2-49, each separately selected by the user via Arena auditions, de-DE TTS)",
  },
];
const twoSpeakerVoices: Record<string, string[]> = {
  "d-b1-04": ["voice-02", "voice-03", "voice-02", "voice-03", "voice-02"],
  "d-b1-06": ["voice-03", "voice-02", "voice-03", "voice-02", "voice-03", "voice-02"],
  "d-b1-07": ["voice-03", "voice-02", "voice-03", "voice-02", "voice-03"],
  "d-b1-09": ["voice-02", "voice-03", "voice-02", "voice-03", "voice-02", "voice-03"],
  "d-b1-13": ["voice-03", "voice-02", "voice-03", "voice-02", "voice-03", "voice-02", "voice-03", "voice-02"],
  "d-b1-17": ["voice-05", "voice-06", "voice-05", "voice-06", "voice-05", "voice-06", "voice-05", "voice-06"],
  "d-b1-22": ["voice-03", "voice-02", "voice-03", "voice-02", "voice-03", "voice-02", "voice-03", "voice-02"],
  "d-b1-32": ["voice-03", "voice-02", "voice-03", "voice-02", "voice-03"],
  "d-b2-07": ["voice-02", "voice-04", "voice-02", "voice-04", "voice-02"],
  "d-b2-32": ["voice-03", "voice-02", "voice-03", "voice-02", "voice-03"],
  "d-b2-44": ["voice-07", "voice-08", "voice-07", "voice-08", "voice-07", "voice-08", "voice-07"],
  "d-b2-43": ["voice-11", "voice-12", "voice-11", "voice-12", "voice-11", "voice-12", "voice-11"],
  "d-b2-46": ["voice-13", "voice-14", "voice-13", "voice-14", "voice-13", "voice-14", "voice-13"],
  "d-b2-47": ["voice-15", "voice-16", "voice-15", "voice-16", "voice-15", "voice-16", "voice-15"],
  "d-b1-11": ["voice-17", "voice-18", "voice-17", "voice-18", "voice-17", "voice-18", "voice-17", "voice-18"],
  "d-b2-49": ["voice-19", "voice-20", "voice-19", "voice-20", "voice-19", "voice-20", "voice-19"],
  "d-b2-48": ["voice-09", "voice-10", "voice-09", "voice-10", "voice-09", "voice-10", "voice-09"],
  "d-b2-45": ["voice-03", "voice-02", "voice-03", "voice-02", "voice-03", "voice-02", "voice-03"],
};
const twoSpeakerVoiceLabels: Record<string, string> = {
  "d-b1-04": "ki-voice-02+voice-03",
  "d-b1-06": "ki-voice-02+voice-03",
  "d-b1-07": "ki-voice-02+voice-03",
  "d-b1-09": "ki-voice-02+voice-03",
  "d-b1-13": "ki-voice-02+voice-03",
  "d-b1-17": "ki-voice-05+voice-06",
  "d-b1-22": "ki-voice-02+voice-03",
  "d-b1-32": "ki-voice-02+voice-03",
  "d-b2-07": "ki-voice-02+voice-04",
  "d-b2-32": "ki-voice-02+voice-03",
  "d-b2-44": "ki-voice-07+voice-08",
  "d-b2-43": "ki-voice-11+voice-12",
  "d-b2-46": "ki-voice-13+voice-14",
  "d-b2-47": "ki-voice-15+voice-16",
  "d-b1-11": "voice-17+voice-18",
  "d-b2-49": "ki-voice-19+voice-20",
  "d-b2-48": "ki-voice-09+voice-10",
  "d-b2-45": "ki-voice-02+voice-03",
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
    || fixture.voices.twoSpeaker !== "ki-voice-02+voice-03 (Arena de-DE TTS)"
    || fixture.voices.additionalTwoSpeaker !== spec.additionalTwoSpeakerVoice) {
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
    const expectedVoiceLabel = voices ? twoSpeakerVoiceLabels[item.id] : "ki-voice-02";
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
  fail("recording-time transcript snapshot ledger must reach 39 across PA-040-01/02/03/04/05/06/07/08/09/10/11/12/13/14/15/16/17 and may only fall later");
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

console.log("PA-040-01/02/03/04/05/06/07/08/09/10/11/12/13/14/15/16/17 dialogue audio refresh: 32 current-text recordings guarded; snapshot ledger 71 -> 39; technical QC passed; no human listening/pronunciation claim");
