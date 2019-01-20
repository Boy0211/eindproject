// geef constante variabelen mee voor het script
const widthPie = 600;
const heightPie = 400;
const radiusPie = Math.min(widthPie, heightPie) / 2;

// colorset, liefst pas ik deze nog aan zodat hij meegegeven wordt vanuit de main
var colorset = ["#3e92cc", "#2a628f", "#13293d", "#16324f", "#18435a"];
var color = d3.scaleOrdinal(colorset);

// creeër de arc voor de pie
var arc = d3.arc()
    .outerRadius(radiusPie * 0.8)
    .innerRadius(radiusPie * 0.40);

// creeër de arc voor de labels
var outerArc = d3.arc()
    .innerRadius(radiusPie * 0.9)
    .outerRadius(radiusPie * 0.9);

// creeër de d3 pie
var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d["values"].length;});

// voeg de d3 tip toe aan het svg element
var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<span><strong>Artiest: </strong>" +d.data.key + "<br><strong>Aantal titels: </strong>" + d.data.values.length + "</span>"
        });

// functie voor het tekenen van een piechart
function drawPieChart(lijst) {

  // maak een svg element voor de piechart
  var svg = d3.select("#piechart")
      .append("svg")
      .attr("class", "piechart")
      .attr("width", widthPie)
      .attr("height", heightPie)
    .append("g")
      .attr("transform", "translate(" + widthPie / 2 + "," + heightPie / 2 + ")");

  // voeg een g element toe voor de label
  svg.append("g")
    .attr("class", "labels");

  // voeg een g element toe voor de lijnen tussen de labels en de slices
  svg.append("g")
    .attr("class", "lines");

  // creeër de data aan de hand van de meegegeven lijst
  data = getBiggestArtists(lijst);

  // roep de d3 tip op
  svg.call(tip);

  // voeg de slices toe aan de pie
  // en voeg de d3 tip toe aan alle slices
  var path = svg.append("g")
      .attr("class", "slices")
      .datum(data).selectAll("path")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", function(d, i) { return color(i); })
      .attr("d", arc)
      .attr("stroke", "#fff")
      .attr("stroke-width", "6px")
      .on("mouseover", function(d) {
          tip.show(d)
          d3.select(this)
            .style("opacity", 0.8)
            .style("stroke-width", -20)
      })
      .on('mouseout', function(d){
          tip.hide(d);
          d3.select(this)
            .style("opacity", 1)
            .style("stroke-width", "6px")
      });

  // voeg tekst aan het midden van de pie toe
  svg.append("text")
     .attr("id", "piechart-text")
     .text("TOP10")
     .style("fill", "black");

}; //einde van het tekenen van de pie


// functie voor het updaten van de piechart
function updatePieChart(lijst) {

  // get the data of meegegeven lijst
  data = getBiggestArtists(lijst["values"]);

  // selecteer de slices en geef ze nieuwe data mee
  var slices = d3.select(".piechart").select(".slices").selectAll("path")
      .data(pie(data))
      .transition()
      .duration(1000)
      .attr("fill", function(d, i) { return color(i); })
      .attr("d", arc);
};


// Functie voor het pakken van de 10 grootste artiesten
function getBiggestArtists(lijst) {

  // nest de data gebasseerd op de artiest
  var songsbyArtist = d3.nest()
      .key(function(d) {return d.Artiest; })
      .entries(lijst);

  // sorteer deze data weer op grootte
  songsbyArtist.sort(function(a, b) {
    var x = a['values'].length; var y = b['values'].length;
    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
  });

  // Pak de bovenste 10
  data = songsbyArtist.slice(0, 10);

  // return de data
  return data;
};
