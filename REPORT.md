### Project Report

[Link naar mijn website](https://boy0211.github.io/eindproject/index.html)

Sam Kuilboer // 12442690

# Korte beschrijving

De website is een korte samenvatting van de (openbare) data die schuil gaat achter de top2000. In het kort zijn dit de lijsten met daarin de notering, de titel, de artiest en het jaar van uitgifte. De website bestaat uit 3 segmenten: de home-pagina, de grafieken-pagina en de bronnen pagina. De grafieken pagina bestaat daarin weer uit 2 delen. Het deel gebasseerd op de lijst en het deel gebasseerd op de artiesten.

De grafieken pagina bestaat in totaal uit de volgende visualisaties:

* Een tabel van de top 10 songs
* Een interactieve piechart van de top 10 artiesten
* Een interactieve barchart van de titels per jaar
* Een interactieve bubblechart met de titels per artiest
* 3 linegraphs met daarin de beste, slechtste en gemiddelde notering per artiest
* Nog een barchart met het aantal liedjes per lijst van elke artiest
* Nog een tabel met daarin de liedjes van de artiest, welke linkt naar YouTube

Naast deze vizualisaties is er ook nog een search balk met de mogelijkheid een artiest op te zoeken en een dropdown met de mogelijkheid een top2000-lijst op te zoeken.

![Afbeelding van mijn website](/Images/example_website.jpeg)

# Technisch design

De website in het algemeen is gemaakt met behulp van javascript, HTML5 en de plug in bootstrap. Daarbovenop zijn de grafieken gemaakt met behulp van D3. index.html, data.html, index.css en data.css zijn te vinden in de main-folder. De visualisaties zijn te vinden in de code folder. Elke grafiek heeft zijn eigen .js bestand. Als er data op een bepaalde manier geproccessd moest worden gebeurde dit mbv functies uit de helpers.js.

Voordat ik functionele data had, heb ik gebruik gemaakt van python om dit in het goede format te kunnen importeren. Dit gebeurde mbv "data_processing.py". Hierin zet ik de data om naar een pandas dataframe om het vervolgens naar hartelust te bewerken en te converten naar tsv. Ik heb gebruik gemaakt van tsv bestanden, omdat tabs als seperator makkelijker te gebruiken was als komma. Dit voornamelijk doordat titels natuurlijk komma's konden bevatten.

Met deze functionele data worden de grafieken gemaakt. Ik heb een standaard format aangehouden voor mijn site. ELke grafiek heeft een DRAW en een UPDATE functie. Zo bestaat de "kale" site (de site waar je zonder updates op terecht komt) al uit een aantal mooie grafieken. De gekozen standaard waarden zijn de lijst van 1999 en de artiest ABBA.

Vervolgens kan **elke** grafiek geupdate worden. Wel allemaal op een andere manier. Daarnaast zijn de grafieken waarbij een tooltip extra waarde had, voorzien van een tooltip. Hieronder een kort overzicht van de functionaliteiten.

| Grafiek       | Hoe wordt hij geüpdate?  | Tooltip |
|---------------|--------------------------|---------|
| Tabel         | Dropdown                 | Nee     |
| Piechart      | Dropdown                 | Ja      |
| Bubblechart   | Dropdown en Barchart1    | Ja      |
| BarchartLijst | Dropdown                 | Nee     |
| TabelArtiest  | Bubblechart en Searchbalk| Nee     |
| BarchartArtist| Bubblechart en Searchbalk| Nee     |
| AllLineGraphs | Bubblechart en Searchbalk| Ja      |

# Korte opsomming per file:

*Index.html*

* maakt gebruik van bootstrap om alle visualisaties op de juiste plek te krijgen.
* maakt gebruik van een navbar, ook gedistrubueerd door bootstrap.
* de divs zijn herleidbaar. Voor elke visualisatie een div.

*Index.css*

Heeft maar zeer beperkt aantal functies. Kleine styling is hierin toegepast om de index pagina overeen te laten komen met de data pagina.

*data.html*

Hierin wordt het mainframe uiteengezet voor de pagina met alle visualisaties. Aan de hand van bootstrap zijn er rijen en kolommen gemaakt die het mogelijk maken alle figuren mooi te plaatsen en gevoelig te maken voor voor scroll en kleinere schermen.

*data.css*

In deze file vindt alle styling plaats van mijn gehele data pagina. Er komen 2 gedeeltes in voor die zijn afgeleid van we-schools. Het gedeelte van de tooltip komt daar vandaan en het gedeelte van de help-tip. Voorderest is er consequent gebruik gemaakt van id's en classes om zaken als assen, achtergrond, lettertypes en plaatsing te stylen.

*/js*

In deze map staan alle files voor de verschillende visualisaties. Ze zijn allemaal voorzien van comments waarin verwijzingen naar andere functies duidelijk zijn.

*/data_processing*

In deze map staat één python process file. Hiervan is gebruik gemaakt in het begin stadium om de data te ordenen en om te schrijven naar een .tsv file.

# Challenges:

In de afgelopen weken ben ik er voornamelijk tegen aan gelopen dat het moeilijk was genoeg uitdagende visualisaties te maken van de beschikbare data. Uiteindelijk heb ik er daardoor voor gekozen te gaan voor de bubblechart welke het mogelijk maakte wat meer inzicht te geven in de artiesten. Ook gaf de bubblechart de mogelijkheid goed door te linken naar het tweede gedeelte van de pagina.

Uiteindelijk heb ik hierdoor de uitdaging gezocht in het ontwikkelen van meer visualisaties en het ontwikkelen van mooie overgangen. Ook het toevoegen van tooltips na afloop van een update heeft mij een aantal dagen gekost, maar heeft wel gezorgd voor een mooi en volledig design.

Een andere challenge was het gebruiken van meerdere html pagina's. Dit heeft er zelfs voor gezorgd dat ik heb afgeweken van mij orginele design. Het was zo goed als onmogelijk om data op een mooie manier over te geven van de ene html pagina naar de andere. Hierdoor heb ik er voor gekozen gebruik te maken van een bootstrap slider die ervoor zorgde dat ik mijn pagina in 2 segmenten kon verdelen.

Uiteindelijk heb ik het idee om een derde segment met daarin hoe de titels het over de jaren doen laten varen. Het had een mooie extra toevoeging kunnen zijn, maar ik kreeg er een beetje het gevoel bij dat het dezelfde data zou weergeven op een net wat andere manier.

# Verdere overwegingen en beslissingen:

In mijn proposal staat als keuze nog het toevoegen van belangrijke gebeurtenissen per jaar die van invloed zouden zijn op de lijst. Dit idee bleek totaal overbodig en zinloos. Er was geen nuttige informatie over te vinden anders dan bataclan een aantal jaren geleden. Het toevoegen hiervan zou de pagina een zwaar karakter geven ipv louter informatief.

Andere mogelijkheid aan de hand van mijn proposal was het toevoegen van een landkaart. Dit bleek ook erg ingewikkeld. Er is namelijk geens standaard data te vinden over de liedjes in de lijst. Als ik een dergelijke wereldkaart met herkomst van elk liedje zou willen toevoegen had ik handmatig van elke artiest zijn geboorteland moeten toevoegen. Dit was teveel werk voor te weinig resultaat.
