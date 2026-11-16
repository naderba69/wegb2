import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { bereitschaftsFazit, fertigkeitenBilanz } from "../lib/bereitschaft";
import { bewerteSimulation, type Rohwerte, type SimFormatId } from "../lib/simulation";
import { simBand } from "../lib/simband";
import { emptyProgress, type Progress } from "../lib/types";

let passed = 0;
const check = (condition: unknown, message: string) => {
  assert.ok(condition, message);
  passed++;
  console.log(`✓ ${message}`);
};

const perfect: Rohwerte = {
  lesenAnteil: 1,
  sprachAnteil: 1,
  hoerenAnteil: 1,
  schreibenRubrik: 100,
  schreibenZuKurz: false,
  sprechenRubrik: 100,
};
const formats: SimFormatId[] = ["goethe-b2", "telc-b2", "goethe-b1", "dtz"];
const results = formats.map((format) => bewerteSimulation(format, perfect));
check(results.every((result) => result.gesamtUrteil === "not_assessed"), "perfect auto scores plus perfect self-reports still produce no overall verdict");
check(results.every((result) => result.objektiv.lesen === 100 && result.objektiv.hoeren === 100
  && result.selbstbericht.schreiben === 100 && result.selbstbericht.sprechen === 100), "objective and self-reported sections have separate typed payloads");

const lowSelf = bewerteSimulation("goethe-b2", { ...perfect, schreibenRubrik: 0, sprechenRubrik: 0 });
const highSelf = bewerteSimulation("goethe-b2", perfect);
check(JSON.stringify(lowSelf.objektiv) === JSON.stringify(highSelf.objektiv), "changing productive self-report cannot change objective scores");
check(highSelf.zeilen.filter((row) => row.ok !== undefined).length === 2
  && highSelf.zeilen.filter((row) => row.titelAr.includes("تقرير ذاتي")).every((row) => row.ok === undefined), "Goethe pass markers are limited to locally auto-scored sections");

const telc = bewerteSimulation("telc-b2", perfect);
check(telc.zeilen.some((row) => row.titelAr === "المجموع المصحح آلياً فقط")
  && telc.zeilen.every((row) => !row.titelAr.includes("المكتوب كاملًا")), "telc never combines self-rated writing into a written or total pass block");
const dtz = bewerteSimulation("dtz", perfect);
check(dtz.zeilen.some((row) => row.titelAr === "مستوى DTZ الكلي" && row.wert === "غير مقاس")
  && !dtz.fazitAr.includes("بلغتَ مستوى"), "DTZ does not infer A2/B1 from mixed provenance");

const legacyAttempt: NonNullable<Progress["simulationen"]>[number] = {
  datum: "2026-11-04",
  seed: 1,
  format: "goethe-b2",
  punkte: { lesen: 90, hoeren: 40, schreiben: 100, sprechen: 100 },
  bestanden: true,
};
const legacyProgress = { ...emptyProgress, simulationen: [legacyAttempt, { ...legacyAttempt, datum: "2026-11-05", seed: 2 }] } as Progress;
const summary = bereitschaftsFazit(legacyProgress);
check(summary.gesamtUrteil === "not_assessed" && !("bestandenAnzahl" in summary)
  && summary.empfehlungAr?.includes("الاستماع"), "analytics ignore legacy aggregate pass and recommend only from objective reading/listening");
const selfBands = fertigkeitenBilanz(legacyProgress).filter((row) => row.key === "schreiben" || row.key === "sprechen");
check(selfBands.every((row) => row.bandAr.includes("تقاريرك الذاتية")), "productive trends remain explicitly self-reported");
check(simBand(legacyProgress).every((row) => row.evidenceType === (row.key === "schreiben" || row.key === "sprechen" ? "self_report" : "local_auto_grader")), "simulation variability rows preserve evidence provenance");

const read = (relative: string) => fs.readFileSync(path.join(process.cwd(), relative), "utf8");
const ui = read("components/simulation.tsx");
const analyticsUi = read("components/bereitschaft.tsx");
const types = read("lib/types.ts");
check(ui.includes("sim-provenance-boundary") && ui.includes("لا حكم نجاح شامل")
  && ui.includes("gesamtUrteil: bewertung.gesamtUrteil") && !ui.includes("bestanden: bewertung"), "result UI and newly stored attempts preserve the no-verdict boundary");
check(analyticsUi.includes("simulation-overall-not-assessed") && analyticsUi.includes("الحكم الشامل:")
  && analyticsUi.includes("غير مقاس") && !analyticsUi.includes("bestandenAnzahl"), "history UI no longer counts mixed-provenance passes");
check(types.includes('gesamtUrteil?: "not_assessed"') && types.includes("objektiv?:") && types.includes("selbstbericht?:")
  && types.includes("حقل تراثي قبل PA-017"), "stored schema separates objective/self-report data and quarantines legacy pass flags");

console.log(`\nSimulation provenance audit: ${passed}/${passed} passed (PA-017; no external validity or examiner sign-off claim).`);
