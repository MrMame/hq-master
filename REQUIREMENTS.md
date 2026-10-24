# Funktionale Anforderungen (Product Requirements)

## 0. HQ-Master WebApp Übersicht

- **Ziel**: Die App soll zur Unterstrützung für den Dungeon Master eines Dungeon-And-Dragons ähnlichem selbst gebauten Spiels dienen. Das programm soll ihn während einer Spielesession mit einem Tablet zu unterstützen stehen. Die Spieler selbst spielen auf einem real existerenden Spielbrett. Der Dungeon Master übernimmt das einhalten der Spielregeln und das Managment des gesamten Spielablaufs. Der DM soll durch die App übersicht über die Spielrelevanten Dinge behalten, z.b. IngameZeit verlauf, Charakter/Monster Zustände, InGame-Ereignissen, Probenwürfen, etc.

  - Er muss den Überblick über die Vergangene Zeit ingame behalten und braucht informaionen darüber, welche effekte in der aktuellen Spielzeit schaden verursachen. Z.b brauch er auch die information, ob die Brennzeit einer Heldenfackel vorbei ist und diese im Dunkel stehen.
  - Er muss Überblick über die Position und zustände der Spieler und der Gegner haben. Auch wenn die Spieler nur einen kleinen Teil der aktuellen Session auf dem realen Spielbrett sehen, muss der Dungeon Master mithilfe dieser App den gesamten Spielsession Zustand nachvollziehen können.
  - Alle Features greifen auf die gleiche SpieleSession Daten zu. D.h. wenn im TimeTracker eine neue Runde registriert wird, wirkt sich das auf alle anderen Features aus, wie z.b. das automatische berechnen von Gift schaden für diese Runde.
  - Alle Features beziehen sich auf den zustand der aktuellen Spielesession. Die Spielesession soll auch erhalten bleiben, wenn der Browser das Fenster schliesst und danach öffnet.

## 1. Time Tracker (`/timetracker`)

- **Ziel:** Erfassen und manipulieren der aktuell vergangenen Runden- und Aktionsbasierten ingame Zeit.
- **Funktionen:**
  - Loggen aller Zeitrelevanten Dinge, wie z.b. das ein Character Schaden durch gift zu diesem Zeitpunkt erhalten hat.
  - Verschiedene Zeitspannen sollen durch UI-Elemente hinzugefügt werden können. Z.b. + 10 Ingame-Sekunden auf die Ingame Zeit wenn der benutzer auf den Button "Nächste Runde beginnen" klickt.
  - Änderungen an der inGame Zeit führen automatisch zur Ermittlung zeitabhängiger zustandsveränderungen (z.b. wie lange brennt die Fackel der Helden noch - Bekommt ein charakter wieder Schaden durch Vergiftung, weil 1 Minute ingame zeit abgelaufen ist)
  - Im TimeTracker können verschiedene Ereignisse per Knopfdruck im Spielzeitablauf registriert werden.
  - Jede Änderunge oder zeitlich abhängige und ausgelöste Aktion soll in einem einsehbaren Log für den Dungeon Master einsehbar sein.

## 2. Dungeon Tracker ('/dungeontracker)

- **Ziel:** Im DungeonTracker kann der Dungeon Master (DM) die genaue Spielposition der einzelnen erzeugten Charactere auf einem Bild des aktuelle Spielplans bestimmen. Der Dungeon Tracker ist die Startseite der App. Alle Charaktere der Spielesession sind auf dem Dungeon Tracker als kleine Symbole zu finden. Die Im DungeonTracker angezeigtne CharacterSymbole können auf einem Raster, das über dem Spielplan Bild liegt verschoben und positioniert werden. Das Raster entspricht dem Spielplan kacheln, auf denen die Figurenmodelle abgesetllt werden können. Ein Doppelklick auf eines der kleinen Charaktersymbole öffnet den Charakter-Editor als Dialog. Dort können alle Eigenschaften des Charakters geändert werden; „Übernehmen“ schreibt die Änderungen sofort in die Spielesession, „Abbrechen“ verwirft sie. Über „Entfernen“ löscht der DM den Charakter nach einer Rückfrage, am PC wie auf dem Tablet, aus der Spielesession; er verschwindet sofort vom Spielbrett und aus der Legende, und der Dialog schließt sich. Über den Button „Neuer Charakter“ in der Seitenleiste legt der DM direkt im Dungeon Tracker einen neuen Charakter an; er erscheint sofort als Token auf dem ersten freien Feld. Im Dialog kann er über „Zufälliger Charakter erstellen“ alle Felder mit Zufallswerten füllen und vor dem Übernehmen anpassen. Der Name passt zur Charakterklasse. Unter jedem Charaktersymbol und in der Legende stehen das Leben (rot) und die Rüstung (blau) des Charakters. Ein Klick auf ein Charaktersymbol markiert es. Unter dem markierten Symbol trägt der DM über einen blauen Button Schaden auf die Rüstung und über einen roten Button Schaden direkt auf die Lebensenergie ein; der Wert wird in einem Dialog gewählt. Schneller geht es über die Legende: Ein Klick auf das Leben bzw. die Rüstung eines Charakters öffnet direkt den passenden Schadensdialog.
  Über einen Bild-Laden Button soll eine Bilddatei mit dem Foto des aktuellen Spielbretts hochgeladen und gespiehcert werden können. Anschliessend kann der DM ein 2 Dimensionales Raster über dieses Bild legen, um die positionierung der VirtuellenCharactere zu erleichtern. Das Raster soll einstellbar sein, damit der DM das Raster exakt auf das Raster der fotogrfierten Spielbretts anpassen kann. Über einen Zoom-Regler in den Raster-Einstellungen vergrößert der DM Foto, Raster und Charaktere gemeinsam; den Ausschnitt verschiebt er per Ziehen auf einer freien Stelle oder über die Bildlaufleisten. Das Raster bleibt dabei und bei jeder Fenstergröße fest auf dem Foto.

## 3. GameSession ('/gamesession')

- **Ziel:** Der DungeonMaste kann über das GameSession Feature alle Aspekte der aktuellen SpieleSession einstellen.
- **Funktionen:**
  - Starten oder beenden der aktuellen Spielesession
  - Einstellen der Start ingamezeit der Spielesession beim starten einer neuen session
  - Abspeichern aller Session relevanten Zustände in einer einzogen XML SaveSession Datei
  - Möglichkeit zum laden einer abgepsiecherten SaveSession Datei.
