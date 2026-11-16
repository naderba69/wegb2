import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { alleVokabeln } from "../lib/content";
import {
  lexikEinheiten,
  lexikUebersicht,
  normalisiereLemma,
  referenzBericht,
  schnellsteRezeptiv,
} from "../lib/referenz";
import { emptyProgress } from "../lib/types";

let passed = 0;
const check = (condition: unknown, message: string) => {
  assert.ok(condition, message);
  passed++;
  console.log(`✓ ${message}`);
};

check(normalisiereLemma("das Ergebnis, -se") === "ergebnis"
  && normalisiereLemma("  Die  soziale   Marktwirtschaft ") === "soziale marktwirtschaft", "display forms normalize articles, inflection suffixes, case, and whitespace");

const units = lexikEinheiten();
const overview = lexikUebersicht();
const rows = referenzBericht();
check(overview.roheKarten === alleVokabeln.length && overview.roheKarten > overview.eindeutigeEinheiten, "raw cards are kept distinct from deduplicated lexical units");
check(new Set(units.map((unit) => unit.lemma)).size === units.length && units.length === overview.eindeutigeEinheiten, "every normalized lexical unit is unique");
check(overview.einzelwoerter + overview.mehrwortEinheiten === overview.eindeutigeEinheiten
  && overview.mehrwortEinheiten > 0, "single words and multiword units are counted separately");
check(rows.length === 5 && rows.at(-1)?.kumuliertEindeutig === overview.eindeutigeEinheiten
  && rows.reduce((sum, row) => sum + row.eindeutigHier, 0) === overview.eindeutigeEinheiten, "first-introduction levels partition the unique inventory without duplicate inflation");
check(overview.rezeptivImAppKorpus > 0 && overview.rezeptivImAppKorpus < overview.eindeutigeEinheiten
  && overview.rezeptivAbdeckungPct > 0 && overview.rezeptivAbdeckungPct < 100, "internal receptive coverage is corpus attestation, not automatic 100 percent");
const und = units.find((unit) => unit.lemma === "und");
const undSoWeiter = units.find((unit) => unit.lemma === "und so weiter");
check(!!und && !!undSoWeiter && und.korpusTreffer > undSoWeiter.korpusTreffer, "multiword attestation counts the exact phrase rather than the first token frequency");
check(overview.produktivAusgewiesen === null && rows.every((row) => row.produktivAusgewiesen === null)
  && overview.externeAbdeckung === "not_assessed", "productive mastery and external Goethe/CEFR coverage remain explicitly unassessed");

const recommended = schnellsteRezeptiv(emptyProgress, 20);
check(recommended.length === 20 && new Set(recommended.map((entry) => normalisiereLemma(entry.karte.de))).size === recommended.length
  && recommended.every((entry) => entry.n > 0), "receptive recommendations are unique attested units, not duplicate cards");

const read = (relative: string) => fs.readFileSync(path.join(process.cwd(), relative), "utf8");
const source = read("lib/referenz.ts");
const ui = read("components/referenz.tsx");
const expansionSource = read("lib/erweiterung.ts");
const expansionUi = read("components/erweiterung.tsx");
const practiceUi = read("app/ueben/page.tsx");
check(!source.includes("const REFERENZ") && !source.includes("b2Luecke") && !ui.includes("فوق المرجع")
  && !ui.includes("فجوة محتوى") && !expansionSource.includes("Lücke zum B2-Rezeptivumfang")
  && expansionUi.includes("ليست 912 headword خارجية") && practiceUi.includes("بطاقات البنك الـ6202"),
"invalid raw-card-versus-headword reference comparison is removed");
check(ui.includes("lexical-scope-boundary") && ui.includes("ليس مقارنة بقائمة Goethe/CEFR")
  && ui.includes("التغطية الخارجية:") && ui.includes("غير مقاسة"), "UI states the app-corpus scope and external/productive limits");

console.log(`\nLexical inventory audit: ${passed}/${passed} passed (PA-020; no external vocabulary-coverage claim).`);
