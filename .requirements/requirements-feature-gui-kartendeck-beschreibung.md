feature : Gui für Kartenstapel mit Ablage- und Nachziehstapel, DragNDrop Ablagebereich für karten und Funktionen um die Stapel zu vermischen.
Das Gui-Kartendeck Feature wird genauso in die Hauptseite eingebunden, wie die anderen features der seite.

Beschreibung :

- Orientiere dich am Layout für das deck-feature aus der Datei ".requirements/requirements-feature-gui-kartendeck.png"
- jedes Kartendeck soll als eigene xml Datei abgepeichert und geladen werden können.
- Eine Karte besteht aus einem bild und einen Beschreibungstext
- Jedes Deck bringt ein eigenes Kartenrückseiten Bild mit, das auf jeder Kartenrückseite zu sehen ist.
- Alle für ein Deck notwendigen Dateien wie Karten Rückseitenbild, Kartenbilder und Deck-konfig-Datei werden unter public/decks/NameDesDecks/ abgelegt
- Wenn Im Ablage- oder Nachziehstapel mehr wie nur eine Karte enthalten sind, soll der Stapel aussehen, als ob unter der obersten Karten noch weitere karten darunter liegen.  Ist nur noch eine Karte vorhanden, dann werden keine weiteren karten unter ihr dargestellt.
- Klickt man auf den Nachziehstapel und es ist dort noch eine Karten enthalten, wird die karten mit ihrer vorderseite nach oben auf den ablagestapel gelegt.
- Per Drag n Drop können karten vom nachziehstapel in eines der freien felder der Sammelablage gezogen werden. Diese Karte bleibt dort liegen.
- per DragNDrop können Karten aus dem Sammelablagebereich auf den Ablagestapel zurückgelegt werden. Wird die Karten auf den nachziehstapel gelegt, wird die karten dort untergemischt.
- Wurde alle Karten vom Nachziehstapel gezogen, wird dort ein latzhalterrahmen angezeigt um zu signalieseren, das es keine Karten mehr zum Nachziehen giebt.
- Klickt man auf den leeren Nachziehstapel, so werden alle Karten aus dem Ablagestapel genommen, Neu gemischt und mit der Rückseite nach oben auf dem nachziehstapel erneut bereitgestellt.


- Über den Knopf : "Restlichen Nachziehstapel mischen" werden alle im nachziehstapel noch enthaltenen Karten neu gemischt und mit der Rückseite nach oben zum nachziehen dort bereitgestellt.
- Über den Knopf : "Restlichen Ablagestapel Mischen" werden alle im Ablagestapel enthaltenen Karten neu gemischt und mit der Vorderseite nach oben  dort bereitgestellt.
- Über den Knopf : "Ablagestapel in Nachziehstapel mischen" werden alle Karten vom Ablage- und Nachziehstapel genommen, alle neu gemischt und mit der Rückseite nach oben auf den Nachziehstapel zum erneuten nachziiehen bereitgestellt
- Über den Knopf : "Deck Laden" kann eine neue Deck Konfigurationsdatei geladen werden, um die darin enthaltenen Kartendefininiotnen auf dem nachziehstapel bereitzulegen.


Bitter erstelle zwei kleine Beispiel Kartendecks mit eigenen Karten, damit ich die Funktionsweise des features nachvollziehen kann. Das eine Kartendeck soll Ereignisse enthalten, welchen beim ziehen eintreten. Das andere Deck soll schätze und auch streunende Monster enthalten, die beim öffnen von loot-kisten eintreten können.