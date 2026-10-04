## cli

- **claude** im terminal startet den *interaktiven Modus*.
- **One-Shot** : Im Terminal können einmalige Befehle hinter den claude ufruf geschrieben werden. 
- Es existieren **slash** Befehle im interaktiven Modus, um claude zu steuern.

### Slash Befehle

- **/init** – Scannt dein Projekt und erstellt automatisch die optimale CLAUDE.md-Konfigurationsdatei.
- **/clear** – Löscht den bisherigen Chat-Verlauf der aktuellen Session. Wichtig: Verwende dies, wenn du deine CLAUDE.md oder Rules geändert hast, damit Claude sie neu einliest.
- **/search** <Begriff> – Sucht gezielt nach Begriffen in deiner Codebasis.
- **/grep** <Muster> – Durchsucht deine Dateien nach Regex-Mustern.
- **/view** <Dateipfad> – Zeigt den Inhalt einer bestimmten Datei direkt im Terminal an.
- **/help** – Listet alle verfügbaren Befehle und CLI-Optionen auf.
- **/exit** – Beendet die aktuelle Claude-Code-Sitzung.

### Was ist eine Session

- **Start**: Eine Session beginnt in dem Moment, in dem du claude in deinem Terminal tippst und absendest. Claude liest zu diesem Zeitpunkt deine CLAUDE.md, deine .claude/rules/ und deine Projektstruktur ein.
- **Ende**: Eine Session endet, wenn du den Chat mit /exit verlässt oder dein Terminal-Fenster schließt.

### Unterschiede einer Session zwischen CLI und VS-Code
Im normalen Terminal (claude) ist die Session weg, sobald du das Terminal-Fenster schließt (es sei denn, du startest sie mit claude --continue wieder). In VS Code sorgt die Extension dafür, dass deine Chats als eigenständige, speicherbare Verläufe erhalten bleiben.

Eine VS-Code Claude-Session ist im Prinzip erst dann "tot" oder beendet, wenn:
1. Du sie explizit in der Session-Historie der Extension löschst (über das Papierkorb-Symbol).
2. Du im Chat den Befehl /clear eingibst (das leert den aktuellen Chatverlauf und startet im selben Fenster eine frische Session, wodurch auch deine geänderten Rules neu eingelesen werden).
3. Du über das Plus-Symbol ("New Chat") eine komplett neue Unterhaltung beginnst.

## claude.md aktualisieren

Was du beachten solltest:
• **Sitzungsstart /clear**: Da Claude die Datei beim Start der Session liest, werden Änderungen an der CLAUDE.md erst wirksam, wenn du eine neue Session startest oder den Kontext via Befehl (z. B. /clear) zurücksetzt.
• Das **/init**-Kommando: Du kannst im Terminal /init ausführen. Claude scannt dann dein Projekt und legt automatisch eine perfekt strukturierte CLAUDE.md für dich an, falls noch keine existiert.