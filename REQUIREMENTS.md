# Funktionale Anforderungen (Product Requirements)

## 0. HQ-Master WebApp Übersicht

- **Ziel**: Die App soll zur Unterstrützung für den Dungeon Master eines Dungeon-And-Dragons ähnlichem selbst gebauten Spiels dienen. Das programm soll ihn während einer Spielesession mit einem Tablet zu unterstützen stehen. Die Spieler selbst spielen auf einem real existerenden Spielbrett. Der Dungeon Master übernimmt das einhalten der Spielregeln und das Managment des gesamten Spielablaufs. Der DM soll durch die App übersicht über die Spielrelevanten Dinge behalten, z.b. IngameZeit verlauf, Charakter/Monster Zustände, InGame-Ereignissen, Probenwürfen, etc.

  - Er muss den Überblick über die Vergangene Zeit ingame behalten und braucht informaionen darüber, welche effekte in der aktuellen Spielzeit schaden verursachen. Z.b brauch er auch die information, ob die Brennzeit einer Heldenfackel vorbei ist und diese im Dunkel stehen.
  - Er muss Überblick über die Position und zustände der Spieler und der Gegner haben. Auch wenn die Spieler nur einen kleinen Teil der aktuellen Session auf dem realen Spielbrett sehen, muss der Dungeon Master mithilfe dieser App den gesamten Spielsession Zustand nachvollziehen können.
  - Alle Features greifen auf die gleiche SpieleSession Daten zu. D.h. wenn im TimeTracker eine neue Runde registriert wird, wirkt sich das auf alle anderen Features aus, wie z.b. das automatische berechnen von Gift schaden für diese Runde.
  - Alle Features beziehen sich auf den zustand der aktuellen Spielesession. Die Spielesession soll auch erhalten bleiben, wenn der Browser das Fenster schliesst und danach öffnet.
  - Die Gruppen der linken Seitenleiste lassen sich in allen Features über ihre Überschrift einzeln auf- und zuklappen, über einen Button neben dem Titel auch alle auf einmal. Welche Gruppen zugeklappt sind, bleibt im Browser erhalten, gehört aber nicht zur Spielesession.

## 1. Time Tracker (`/timetracker`)

- **Ziel:** Erfassen und manipulieren der aktuell vergangenen Runden- und Aktionsbasierten ingame Zeit.
- **Funktionen:**
  - Loggen aller Zeitrelevanten Dinge, wie z.b. das ein Character Schaden durch gift zu diesem Zeitpunkt erhalten hat.
  - Verschiedene Zeitspannen sollen durch UI-Elemente hinzugefügt werden können. Z.b. + 10 Ingame-Sekunden auf die Ingame Zeit wenn der benutzer auf den Button "Nächste Runde beginnen" klickt.
  - Änderungen an der inGame Zeit führen automatisch zur Ermittlung zeitabhängiger zustandsveränderungen (z.b. wie lange brennt die Fackel der Helden noch - Bekommt ein charakter wieder Schaden durch Vergiftung, weil 1 Minute ingame zeit abgelaufen ist)
  - Im TimeTracker können verschiedene Ereignisse per Knopfdruck im Spielzeitablauf registriert werden.
  - Jede Änderunge oder zeitlich abhängige und ausgelöste Aktion soll in einem einsehbaren Log für den Dungeon Master einsehbar sein.

## 2. Dungeon Tracker ('/dungeontracker)

- **Ziel:** Im DungeonTracker kann der Dungeon Master (DM) die genaue Spielposition der einzelnen erzeugten Charactere auf einem Bild des aktuelle Spielplans bestimmen. Der Dungeon Tracker ist die Startseite der App. Alle Charaktere der Spielesession sind auf dem Dungeon Tracker als kleine Symbole zu finden. Die Im DungeonTracker angezeigtne CharacterSymbole können auf einem Raster, das über dem Spielplan Bild liegt verschoben und positioniert werden. Das Raster entspricht dem Spielplan kacheln, auf denen die Figurenmodelle abgesetllt werden können. Ein Doppelklick auf eines der kleinen Charaktersymbole öffnet den Charakter-Editor als Dialog. Dort können alle Eigenschaften des Charakters geändert werden; „Übernehmen“ schreibt die Änderungen sofort in die Spielesession, „Abbrechen“ verwirft sie. Über „Entfernen“ löscht der DM den Charakter nach einer Rückfrage, am PC wie auf dem Tablet, aus der Spielesession; er verschwindet sofort vom Spielbrett und aus der Legende, und der Dialog schließt sich. Über den „+“-Button „Neuer Charakter“ in der Schnellzugriffsleiste links neben dem Spielbrett (über dem Zoom-Regler) legt der DM, auch bei eingeklappter Seitenleiste, direkt im Dungeon Tracker einen neuen Charakter an; er erscheint sofort als Token auf dem ersten freien Feld. Im Dialog kann er über „Zufälliger Charakter erstellen“ alle Felder mit Zufallswerten füllen und vor dem Übernehmen anpassen. Der Name passt zur Charakterklasse. Unter jedem Charaktersymbol und in der Legende stehen das Leben (rot) und die Rüstung (blau) des Charakters. Ein Klick auf ein Charaktersymbol oder auf seinen Eintrag in der Legende markiert den Charakter an beiden Stellen; ein erneuter Klick auf den Legendeneintrag hebt die Markierung auf. Unter dem markierten Symbol und unter seinem Legendeneintrag erscheint dieselbe Menüleiste: Über „Charakter editieren“ öffnet der DM den Charakter-Editor, über einen roten Button trägt er Schaden direkt auf die Lebensenergie und über einen blauen Button Schaden auf die Rüstung ein; der Wert wird in einem Dialog gewählt. Liegt der markierte Charakter außerhalb des sichtbaren Bereichs, scrollen Spielbrett bzw. Legende zu ihm. Schneller geht es über die Legende: Ein Klick auf das Leben bzw. die Rüstung eines Charakters öffnet direkt den passenden Schadensdialog. Über einen kleinen Griff am rechten Rand der Seitenleiste klappt der DM die Leiste ein und wieder aus, damit das Spielbrett auf Handy und Tablet mehr Platz bekommt. Die Leiste startet bei jedem Aufruf ausgeklappt.
  Über einen Bild-Laden Button soll eine Bilddatei mit dem Foto des aktuellen Spielbretts hochgeladen und gespiehcert werden können. Anschliessend kann der DM ein 2 Dimensionales Raster über dieses Bild legen, um die positionierung der VirtuellenCharactere zu erleichtern. Das Raster soll einstellbar sein, damit der DM das Raster exakt auf das Raster der fotogrfierten Spielbretts anpassen kann. Die Zellgröße lässt sich auch mit Nachkommastellen eingeben. Für randlose Bilder, z. B. aus dem Dungeon Builder, stellt der DM das Raster über die Spaltenanzahl in einem Schritt passend ein. Im Modus „Nullpunkt verschieben“ zieht der DM den markierten Nullpunkt des Rasters auf eine Kachelecke im Foto. Von dort wächst das Raster in alle Richtungen, wenn er die Zellgröße ändert. Charaktere lassen sich auch links und oberhalb des Nullpunkts ablegen. Jeder Raster-Regler lässt sich über „−“ und „+“ in feinsten Schritten nachstellen. Über einen senkrechten Zoom-Regler in einem schmalen Streifen oben links neben dem Spielbrett, der beim Scrollen stehen bleibt, kein Feld verdeckt und auch bei eingeklappter Seitenleiste erreichbar ist, vergrößert der DM Foto, Raster und Charaktere gemeinsam; den Ausschnitt verschiebt er per Ziehen auf einer freien Stelle oder über die Bildlaufleisten. Das Raster bleibt dabei und bei jeder Fenstergröße fest auf dem Foto.

## 3. GameSession ('/gamesession')

- **Ziel:** Der DungeonMaste kann über das GameSession Feature alle Aspekte der aktuellen SpieleSession einstellen.
- **Funktionen:**
  - Starten oder beenden der aktuellen Spielesession
  - Einstellen der Start ingamezeit der Spielesession beim starten einer neuen session
  - Abspeichern aller Session relevanten Zustände in einer einzogen XML SaveSession Datei
  - Möglichkeit zum laden einer abgepsiecherten SaveSession Datei.

## 4. Dungeon Builder ('/dungeonbuilder')

- **Ziel:** Im Dungeon Builder baut der DM eigene Dungeon-Layouts aus Boden, Wänden, Türen, Möbeln, Treppen und Hindernissen und exportiert sie als JPEG, das er im Dungeon Tracker über „Bild hochladen“ lädt. Builder und Tracker bleiben getrennt; die Übergabe läuft nur über die Bilddatei. Das Layout bleibt im Browser erhalten, gehört aber nicht zur Spielesession.
- **Funktionen:**
  - Die Bibliothek in der linken Seitenleiste kommt aus einer Katalog-Datei (`public/dungeon-builder/catalog.xml`). Neue Möbelstücke usw. kommen über eine Grafik und einen Katalogeintrag dazu, ohne Code.
  - Über ein Suchfeld findet der DM Einträge aller Gruppen nach ihrem Namen. Die Gruppe „Zuletzt verwendet“ zeigt oben die letzten 8 Türen und Möbel, die er als Stempel gewählt oder auf den Plan gezogen hat; sie bleibt im Browser erhalten.
  - Elemente werden per Drag & Drop aus der Bibliothek oder als Stempel per Tipp auf den Plan gesetzt. Möbel, Treppen und Hindernisse belegen ganze Kacheln, auch in beliebig zusammenhängender Form; Wände und Türen liegen auf den Gitterlinien.
  - Boden entsteht per Pinsel, Rechteck, Füllen und Radierer; Wände zieht der DM entlang der Gitterlinien. Eine Tür ersetzt dort das Wandstück.
  - Jedes Element lässt sich markieren, verschieben, in 90°-Schritten drehen und löschen, über eine Menüleiste am Element und am PC auch per Taste. Änderungen lassen sich rückgängig machen und wiederholen.
  - Die Plangröße ist einstellbar. Das Layout wird als XML gespeichert und wieder geladen, um daran weiterzuarbeiten, und als JPEG ohne Raster exportiert.
  - Der Builder ist am PC und auf dem Tablet bedienbar.
