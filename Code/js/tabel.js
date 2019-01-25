// maak de constantes gebruikt voor de tabel
const widthTable = 200
const heightTable = 400

/**
 * [Een functie voor het tekenen van de tabel.]
 * @param {[array]} lijst [een array van de noteringen van een bepaald jaar]
 */
function createTable(lijst) {

  // maak een variabele waarin de tabel is opgeslagen
  var div = d3.select("#tabel")
      .append("div")
      .attr("class", "divtable")
      .attr("width", widthTable)
      .attr("height", heightTable);

  // maak de columns
  var columns = ["Notering", "Titel", "Artiest", "Jaar"];

  // creeër de data gebruikt voor de tabel
  var data = lijst.slice(0, 10);

  // maak de tabel
  tabulate(data, columns);
};


/**
 * [Een functie voor het updaten van de tabel.]
 * @param {[array]} lijst [een array van de noteringen van een bepaald jaar]
 */
function updateTable(lijst) {

  // selecteer de tabel
  d3.select(".divtable").select(".table")
      .remove();

  // maak de columns
  var columns = ["Notering", "Titel", "Artiest", "Jaar"]

  // creeër de data gebruikt voor de tabel
  data = lijst.slice(0, 10)

  // update de tabel
  tabulate(data, columns)
};

/**
 * [Een functie voor het uittekenen van de tabel, wordt opgeroepen in make and update tabel.]
 * @param {[array]} data [een array van de noteringen van een bepaald jaar]
 * @param {[array]} columns [de kolom namen van de tabel]
 */
function tabulate(data, columns) {

  // variabele voor het selecteren van de juiste divtable
  var table = d3.select(".divtable").append("table")
      .attr("class", "table table-striped table-bordered");

  // variabele voor de header van de tabel
  var header = table.append("thead");

  // variabele voor de body van de tabel
  var tbody = table.append("tbody");

  // selecteer de header van de tabel en voeg daar de data aan toe
  d3.select("thead").append('tr')
      .selectAll('th')
      .data(columns)
      .enter()
      .append('th')
        .text(function (column) {return column; })


  // voeg het aantal rijen toe, gelijkend aan de lengte van de data
  var rows = tbody.selectAll('tr')
      .data(data)
      .enter()
      .append('tr');

  // voeg de data toe aan de goede column
  var cells = rows.selectAll('td')
      .data(function (row) {
        return columns.map(function (column) {
          return {column: column, value: row[column] };
        });
      })
  .enter()
  .append('td')
    .text(function (d) { return d.value; });

  // return de tabel
  return table;
};
