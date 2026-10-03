# Funktionale Anforderungen (Product Requirements)

## 0. HQ-Master WebApp Übersicht
- **Ziel**: Die SPA soll zur Unterstrützung für den Dungeon Master eines Dungeon-And-Dragons ähnlichem selbst gebauten Spiel dienen, um ihn während einer Spielesession mit einem Tablet zu unterstützen damit er auf Spielrelevante Dinge zugreifen kann. Der DM soll bei IngameZeit, Zustände , Ereignisse, Charactere und Probenwürfe Hilfreich unterstützt werden. 
    -Er muss den Überblcik über die Vergangene Zeit ingame behalten und braucht informaionen darüber, welche effekte in der aktuellen Spielzeit schaden verursachen. Z.b brauch er auch die information, ob die Brennzeit einer Heldenfackel vorbei ist und diese im Dunkel stehen. 
    - Ausserdem muss er den Überblick über die Position der Gegner auf dem realen Spielbrett virtuell behalten, damit er nachvollziehen kann, an welcher Stelle sich die Monster im aktuellen Zug im Fog-Of-War der Spieler befinden.    
    - Alle Features greifen auf die gleiche SpieleSession Daten zu. D.h. wenn im TimeTracker eine neue Runde registriert wird, wirkt sich das auf alle anderen Features aus, wie z.b. das automatische berechnen von Gift schaden für diese Runde.
- **Funktionen:**
    - Im TimeTracker können Ereignisse per Knopfdruck im Spielzeitablauf registriert werden. 
    - Im Charakter Tracker werden neuen Charactere/Monster erstellt und erlauben dem DungeonMaster (DM) das tracken der einzelnen Statuswerte. Die Verschiedenen Charaktere können über kleine verschiebbare Boxen auf dem Bildschirm positioniert werden, um den DM beim auseinanderhalten der Verschiedenen Charakteren anhand deren positionierung auf die positionen des Spielbretts zu übertragen.
    - Im DungeonTracker kann der DM die genaue Spielposition der einzelnen erzeugten Charactere auf einem Bild des aktuelle Spielplans bestimmen. Alle im Charakter Tracker erstellen Charactere sind ebenfalls auf dem Dungeon Tracker als kleine Symbole zu finden. Die CharacterSymbole können auf einem Raster, das über dem Spielplan Bild liegt verschoben und positioniert werden. Ein Doppelklcik auf eines der kleinen Charactersymbole springt in die Detailansicht des Charakters. 



## 1. Character Tracker (`/charactertracker`)
- **Ziel:** Erlaubt es Nutzern, Rollenspiel-Charaktere zu erstellen und deren Zustände zu Verwalten.
- **Funktionen:**
  - Der Benutzer kann eine verschiebbare Box mit den beiden Werten Health in Rot und Defense in Blau erzeugen. Die Positionsverschiebung wird für die positionierung säter auf dem Spielbrett verwendet 
  - Neuen Charakter anlegen (Name, Klasse, Level).
  - Level-Up-Button: Erhöht das Level um 1.
- **Datenstruktur:** Ein Charakter-Objekt besteht aus `id (string)`, `name (string)`, `class (string)` und `level (number)`.

## 2. Time Tracker (`/timetracker`)
- **Ziel:** Erfassung von Arbeitszeiten für Projekte.
- **Funktionen:**
  - Start-/Stopp-Button für die aktuelle Zeiterfassung.
  - Anzeige einer Historie der vergangenen Einträge mit Datum, Dauer und Beschreibung.

## 3. Dungeon Tracker ('/dungeontracker)
- **Ziel:** Im DungeonTracker kann der Dungeon Master (DM) die genaue Spielposition der einzelnen erzeugten Charactere auf einem Bild des aktuelle Spielplans bestimmen. Alle im Charakter Tracker erstellen Charactere sind ebenfalls auf dem Dungeon Tracker als kleine Symbole zu finden. Die Im DungeonTracker angezeigtne CharacterSymbole können auf einem Raster, das über dem Spielplan Bild liegt verschoben und positioniert werden. Das Raster entspricht dem Spielplan kacheln, auf denen die Figurenmodelle abgesetllt werden können. Ein Doppelklcik auf eines der kleinen Charactersymbole springt in die Detailansicht des Charakters. 
Über einen Bild-Laden Button soll eine Bilddatei mit dem Foto des aktuellen Spielbretts hochgeladen und gespiehcert werden können. Anschliessend kann der DM ein 2 Dimensionales Raster über dieses Bild legen, um die positionierung der VirtuellenCharactere zu erleichtern. Das Raster soll einstellbar sein, damit der DM das Raster exakt auf das Raster der fotogrfierten Spielbretts anpassen kann.