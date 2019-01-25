### Project Report

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

# Technisch design

De website in het algemeen is gemaakt met behulp van javascript, HTML5 en de plug in bootstrap. Daarbovenop zijn de grafieken gemaakt met behulp van D3. index.html, data.html, index.css en data.css zijn te vinden in de main-folder. De visualisaties zijn te vinden in de code folder. Elke grafiek heeft zijn eigen .js bestand. Als er data op een bepaalde manier geproccessd moest worden gebeurde dit mbv functies uit de helpers.js.

Voordat ik functionele data had heb ik gebruik gemaakt van python om dit in het goede format te kunnen importeren. Dit gebeurde mbv "data_processing.py". Hierin zet ik de data om naar een pandas dataframe om het vervolgens naar hartelust te bewerken en te converten naar tsv. Ik heb gebruik gemaakt van tsv bestanden, omdat tabs als seperator makkelijker te gebruiken was als komma. Dit voornamelijk doordat titels natuurlijk komma's konden bevatten.

*Index.html*

* maakt gebruik van bootstrap om alle visualisaties op de juiste plek te krijgen.
* maakt gebruik van een navbar, ook gedistrubueerd door bootstrap.
* de divs zijn herleidbaar. Voor elke visualisatie een div.

*Index.css*

Heeft maar zeer beperkt aantal functies. Kleine styling is hierin toegepast om de index pagina overeen te laten komen met de data pagina.
