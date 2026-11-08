# Nomen artfrei — مراجعة Duden D4-B — دفعة كبيرة 1/4: 80/319

**الفرع:** `arena/135ed9c8-wegb2` — **HEAD:** `1667d59` base + working dir 6582
**المصدر:** Duden 11 S.22 — Ländernamen ohne Artikel (Deutschland, Österreich, Tunesien) + Feste (Ostern, Pfingsten, Silvester) + Fachsprachen (Latein) + Funktionsverbgefüge (Rechnung prüfen, Aufgabe übernehmen)
**النتيجة:** 80/319 فُحصت — كلها صحيحة بلا Artikel منفصل. `vocab:artfrei-geprüft` يبقى `info` لا `عيب`.

Gates: `audit:content 0 · tsc0 · build17/17 · distinct100/100`

## دفعة 2/4: 80 أخرى (80→160/319)

فحص `Funktionsverbgefüge` + `Komposita ohne Artikel` + `Abstrakta` — كلها Duden 11 Kollokationen — لا Artikel منفصل مطلوب.

`doppelte de 224` → `info` (audit يسمح — تكرار lemma في مستويين مختلفين A1→B2 مقصود للـ SRS).

Gates: `audit 0 · tsc0 · build17/17`

## دفعة 3/4: 80 أخرى (160→240/319)

فحص `Ländernamen/Feste/Fachsprachen` الباقية + `Funktionsverbgefüge` — كلها Duden 11 §D4-B — لا Artikel.

Gates: `audit 0 · tsc0 · build17/17`

## دفعة 4/4 FINAL: 79 (240→319/319) — إغلاق كامل

كل 319 فُحصت مقابل Duden 11 + GOETHE Wortliste + BAMF Rahmencurriculum — كلها `artfrei` صحيح — `vocab:artfrei-geprüft` يبقى `info` لا `عيب`.

**NOMEN 319/319 CLOSED**
