---
name: interview-me
description: Führt ein Interview mit dem Nutzer durch, basierend auf dem /grill-me Skill. Verwenden, wenn der Nutzer ein Interview durchführen lassen will, z. B. "/interview-me topic".
---

# Interview durchführen

Argumente: `$ARGUMENTS` — Thema des Interviews.

## Interview durchführen

- Interviewe mich mithilfe deines /grill-me Skills.
- Fragen klar und präzise formulieren, um Missverständnisse zu vermeiden.
- Bei Unklarheiten Rückfragen stellen, bevor Annahmen getroffen werden.
- Den Kontext der bisherigen Kommunikation berücksichtigen, um Wiederholungen zu vermeiden.
- Alle relevanten Informationen bereitstellen, damit der Nutzer die Anfrage ohne zusätzliche Nachfragen beantworten kann.
- Annahmen dokumentieren, damit sie im Plan und in der Verifikation nachvollziehbar sind.
- Vor der Umsetzung sicherstellen, dass alle Anforderungen und Beobachtungen korrekt verstanden wurden.

## Leistungsstatistik ausgeben

- Am Ende des Interviews gib eine Statistik aus, damit ich mir ein Bild über deine Effektivität machen kann.
- Ermittlung und Format nach `.claude/rules/work-statistics.md`: `node scripts/claude/work-statistics.mjs --skill interview-me --slug <thema>`.
- Unter der Statistik die **Zeile des aktuellen Laufs im Statistiklog** als Markdown-Tabelle (Kopf + Zeile) unverändert aus der Skript-Ausgabe übernehmen („Zeile für das Statistiklog (Vorschau)“ bzw. nach dem `--append` „Zeile im Statistiklog“).
- Danach die Zeile ins Statistiklog schreiben (ohne Punkte, zählt nicht in den Effizienz-Index): `node scripts/claude/work-statistics.mjs --skill interview-me --slug <thema> --append`, bei neuem Harness-Stand mit Einordnung (`--harness-impact`, `--harness-note`, `--harness-hypothesis`).
