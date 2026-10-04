# Funktionale Anforderungen (Product Requirements)

## 0. HQ-Master WebApp Übersicht
- **Ziel**: Die App soll zur Unterstrützung für den Dungeon Master eines Dungeon-And-Dragons ähnlichem selbst gebauten Spiels dienen. Das programm soll ihn während einer Spielesession mit einem Tablet zu unterstützen stehen. Die Spieler selbst spielen auf einem real existerenden Spielbrett. Der Dungeon Master übernimmt das einhalten der Spielregeln und das Managment des gesamten Spielablaufs. Der DM soll durch die App übersicht über die Spielrelevanten Dinge behalten, z.b. IngameZeit verlauf, Charakter/Monster Zustände, InGame-Ereignissen, Probenwürfen, etc.

    - Er muss den Überblick über die Vergangene Zeit ingame behalten und braucht informaionen darüber, welche effekte in der aktuellen Spielzeit schaden verursachen. Z.b brauch er auch die information, ob die Brennzeit einer Heldenfackel vorbei ist und diese im Dunkel stehen. 
    - Er muss Überblick über die Position und zustände der Spieler und der Gegner haben. Auch wenn die Spieler nur einen kleinen Teil der aktuellen Session auf dem realen Spielbrett sehen, muss der Dungeon Master mithilfe dieser App den gesamten Spielsession Zustand nachvollziehen können.
    - Alle Features greifen auf die gleiche SpieleSession Daten zu. D.h. wenn im TimeTracker eine neue Runde registriert wird, wirkt sich das auf alle anderen Features aus, wie z.b. das automatische berechnen von Gift schaden für diese Runde.
    - Alle Features beziehen sich auf den zustand der aktuellen Spielesession. Die Spielesession soll auch erhalten bleiben, wenn der Browser das Fenster schliesst und danach öffnet.



## 1. Character Tracker (`/charactertracker`)
- **Ziel:** Erlaubt es Nutzern, Rollenspiel-Charaktere zu erstellen und deren Zustände zu Verwalten.
- **Funktionen:**
  - Der Benutzer kann eine verschiebbare Box mit den beiden Werten Health in Rot und Defense in Blau erzeugen. Die Positionsverschiebung wird für die positionierung säter auf dem Spielbrett verwendet 
  - Neuen Charakter anlegen (Name, Klasse, Level).
  - Level-Up-Button: Erhöht das Level um 1.
- **Datenstruktur:** Ein Charakter-Objekt besteht aus `id (string)`, `name (string)`, `class (string)` und `level (number)`.

## 2. Time Tracker (`/timetracker`)
- **Ziel:** Erfassen und manipulieren der aktuell vergangenen Runden- und Aktionsbasierten ingame Zeit.
- **Funktionen:**
  - Loggen aller Zeitrelevanten Dinge, wie z.b. das ein Character Schaden durch gift zu diesem Zeitpunkt erhalten hat.
  - Verschiedene Zeitspannen sollen durch UI-Elemente hinzugefügt werden können. Z.b. + 10 Ingame-Sekunden auf die Ingame Zeit wenn der benutzer auf den Button "Nächste Runde beginnen" klickt.
  - Änderungen an der inGame Zeit führen automatisch zur Ermittlung zeitabhängiger zustandsveränderungen (z.b. wie lange brennt die Fackel der Helden noch - Bekommt ein charakter wieder Schaden durch Vergiftung, weil 1 Minute ingame zeit abgelaufen ist)
  - Im TimeTracker können verschiedene Ereignisse per Knopfdruck im Spielzeitablauf registriert werden.
  - Jede Änderunge oder zeitlich abhängige und ausgelöste Aktion soll in einem einsehbaren Log für den Dungeon Master einsehbar sein. 


## 3. Dungeon Tracker ('/dungeontracker)
- **Ziel:** Im DungeonTracker kann der Dungeon Master (DM) die genaue Spielposition der einzelnen erzeugten Charactere auf einem Bild des aktuelle Spielplans bestimmen. Alle im Charakter Tracker erstellen Charactere sind ebenfalls auf dem Dungeon Tracker als kleine Symbole zu finden. Die Im DungeonTracker angezeigtne CharacterSymbole können auf einem Raster, das über dem Spielplan Bild liegt verschoben und positioniert werden. Das Raster entspricht dem Spielplan kacheln, auf denen die Figurenmodelle abgesetllt werden können. Ein Doppelklcik auf eines der kleinen Charactersymbole springt in die Detailansicht des Charakters. 
Über einen Bild-Laden Button soll eine Bilddatei mit dem Foto des aktuellen Spielbretts hochgeladen und gespiehcert werden können. Anschliessend kann der DM ein 2 Dimensionales Raster über dieses Bild legen, um die positionierung der VirtuellenCharactere zu erleichtern. Das Raster soll einstellbar sein, damit der DM das Raster exakt auf das Raster der fotogrfierten Spielbretts anpassen kann.

## 4. GameSession ('/gamesession')
- **Ziel:** Der DungeonMaste kann über das GameSession Feature alle Aspekte der aktuellen SpieleSession einstellen.
- **Funktionen:**
  - Starten oder beenden der aktuellen Spielesession
  - Einstellen der Start ingamezeit der Spielesession beim starten einer neuen session
  - Abspeichern aller Session relevanten Zustände in einer einzogen XML SaveSession Datei
  - Möglichkeit zum laden einer abgepsiecherten SaveSession Datei.