// maak de constantes gebruikt voor de tabel
const widthTable2 = 200
const heightTable2 = 400

// functie voor het maken van een tabel
function createTableTitels(data) {

  // maak een variabele waarin de tabel is opgeslagen
  var div = d3.select("#tabelTitels")
      .append("div")
      .attr("class", "divtable")
      .attr("width", widthTable2)
      .attr("height", heightTable2);

  // maak de columns
  var columns = ["Naam", "Jaar"];

  // maak de tabel
  tabulateTitels(data.Titels, columns);
};


// functie voor het updaten van de tabel
function updateTableTitels(data) {

  // selecteer de tabel
  d3.select("#tabelTitels .divtable").select(".table")
      .remove();

  // maak de columns
  var columns = ["Naam", "Jaar"];
  console.log(data.Titels);
  // update de tabel
  tabulateTitels(data.Titels, columns)
};

// functie voor het maken van de tabellen
function tabulateTitels(data, columns) {

  // variabele voor het selecteren van de juiste divtable
  var table = d3.select("#tabelTitels").select(".divtable").append("table")
      .attr("class", "table table-striped table-bordered");

  // variabele voor de header van de tabel
  var header = table.append("thead");

  // variabele voor de body van de tabel
  var tbody = table.append("tbody");

  // selecteer de header van de tabel en voeg daar de data aan toe
  d3.select("#tabelTitels").select("thead").append('tr')
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
