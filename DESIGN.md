# Design document

### A list of data sources if you will get data from an external source, including information on how your are going to filter and transform the data for your project

Mijn data is verkregen van de top2000 website (NPO2.nl) en via wikipedia. Ondanks dat mijn data compleet is, heb ik de officiële lijsten ook opgevraagd bij Radio2 om te verifiëren of mijn data correct is.

Al mijn data is te vinden in de map ../Data

### A diagram with an overview of the technical components of your app (visualizations, scraper etc etc)

Het verkrijgen van de data:
![diagram](/Images/Diagram.jpg)

Mijn website bestaat uit 4 pagina's:

* Welkom
<!-- ![afbeelding van pagina lijst per jaar](/Images/sketch1.jpeg) -->
* De lijst per jaar
![afbeelding van pagina lijst per jaar](/Images/Per_Lijst.jpg)
1: Vanuit het dropdown menu kan je een lijst kiezen tussen de '99 en '18. Hiervan geeft de website de top5 weer.
2: Van de top10/alle artiesten artiesten worden in de piechart de hoeveelheid liedjes per artiest weergegeven. Om hun aandeel te zien aan de top2000
3: van de gehele lijst wordt een distributie weergegeven over de jaren van uitgifte.
4 en 5: Door op zo'n jaar te klikken worden de pie chart en de top5 uit dat jaar weergegeven.

* Hoe doen de artiesten het over de jaren
![afbeelding van pagina per artiest](/Images/Per_Artiest.jpg)
Hier zijn de lijnen veel duidelijker. Ik hoop te kunnen maken dat de gebruiker kan zoeken op een artiest in plaats van alleen een drop down menu.
* Hoe doen de songs het over de jaren (Optional)
<!-- ![afbeelding van pagina lijst per jaar](/Images/sketch1.jpeg) -->

### As well as descriptions of each of the components and what you need to implement these

### A list of APIs or D3 plugins that you will be using to provide functionality in your app

Voor nu maak ik alleen gebruik van de d3 library. Als optional zou ik graag een wereldkaart willen toevoegen met de herkomst van de liedjes, echter ben ik nog opzoek naar een dataset met deze informatie over de artiesten. Als dat niet lukt zou het nog handmatig kunnen, maar dat is wel heel veel werk.
