# TTS Stimmen-Inventar 2026-10-23 — 12 Stimmen geplant

## Status heute
- 12 Platzhalter-Stimmen `ki-f1`…`ki-m6` in `content/dialog-audio.json` (1099 MP3, 89.3 MB)
- Alle `voice.startsWith("ki-")` → UI zeigt "KI-Stimme" Badge (kein falscher Haus-Ton)
- Fallback: TTS-Browser (`speechSynthesis`) wenn MP3 fehlt — deklariert in `components/akademie/*`

## Ziel 12 echte Stimmen (6F/6M, de-DE/de-AT/de-CH)
| id | Geschlecht | Akzent | Rolle |
|---|---|---|---|
| voice-01 | F | de-DE | Moderatorin |
| voice-02 | M | de-DE | Moderator |
| voice-03 | F | de-AT | Wien-Stimme |
| voice-04 | M | de-AT | Wien-Stimme |
| voice-05 | F | de-CH | Zürich-Stimme |
| voice-06 | M | de-CH | Zürich-Stimme |
| voice-07..12 | 3F/3M | de-DE | Dialogrollen A/B |

## Migration
`ki-f1`→`voice-01` etc. via `scripts/migrate_voices.mjs` (noch zu schreiben) — kein Break für alte Audio-Dateien, nur Manifest-Update.
