// maak de constante variabelen die door het hele script gebruikt worden
const marginBar2 = {top: 20, right:50, bottom:35, left:50}
const widthBar2 = 580
const heightBar2 = 417
const barHeight = "16px"

// creeër een xScale
var yScale2 = d3.scaleBand()
    .range([0, (heightBar2 - marginBar2.top - marginBar2.bottom)])
    .padding(0.1)

// creeër een yScale
var xScale2 = d3.scaleLinear()
    .range([0, (widthBar2 - marginBar2.left - marginBar2.right)])

/**
 * [Een functie voor het tekenen van de 2de barchart.]
 * @param {[array]} temp_data [een array van de liedjes per artiest]
 */
function drawBarChart2(temp_data) {

  // het selecteren van de values uit de temp_data
  var data = temp_data.TOP2000JAAR

  // creeër het svg element op de goede plek in de html
  var svg = d3.select("#barchart2")
      .append("svg")
      .attr("class", "barchart2")
      .attr("width", widthBar2)
      .attr("height", heightBar2)
    .append("g")
      .attr("transform", "translate(" + marginBar2.left + "," + marginBar2.top + ")");

  // geef de x en y-as de goede domeinen mee
  yScale2.domain(["1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018" ]);
  xScale2.domain([0, d3.max(data, function (d) { return d.Data.length; })]);

  // het opslaan vand de max_value van de data
  var max = d3.max(data, function(d) {return d.Data.length;});

  // teken de x-as
  svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + (heightBar2 - marginBar2.top - marginBar2.bottom) + ")")
      .call(d3.axisBottom(xScale2))

  // teken de y-as
  svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale2));

  // teken alle rectangles
  svg.append("g")
      .attr("class", "bars2")
    .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "rect2")
      .attr('x', 0)
      .attr('y', function(d) { return yScale2(d.Lijst); })
      .attr('height', barHeight)
      .attr('width', function(d) { return xScale2(d.Data.length); })
      .attr('opacity', function(d) {return ((d.Data.length * 0.6) + (0.4 * max)) / max})

  // voeg de tekst toe aan de rectangles
  var texts = svg.append("g")
      .attr("id", "labelsbarchart2")
    .selectAll("text")
      .data(data)
      .enter()
      .append("text");

  //add a value label to the right of each bar
  texts.attr("class", "mytexts")
      .attr("x", function (d) { return xScale2(d.Data.length) - 2; })
      .attr("y", function(d) { return yScale2(d.Lijst) + 13.5; })
      .text(function (d) { return d.Data.length; });
}; //sluiten draw bar chart


/**
 * [Een functie voor het tekenen van de tabel.]
 * @param {[array]} artist [een array van de liedjes per artiest]
 */
function updateBarChart2(artist) {

  // sla de data op in de variabele data
  var data = artist.TOP2000JAAR;

  // pas de domein van de assen aan aan de nieuwe data
  yScale2.domain(["1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018" ]);
  xScale2.domain([0, d3.max(data, function (d) { return d.Data.length; })]);

  // selecteer de barchart en pas de x-as aan
  d3.select(".barchart2").select("g").select(".x-axis")
      .transition()
      .duration(1000)
      .call(d3.axisBottom(xScale2))

  // selecteer de barchart en pas de y-as aan
  d3.select(".barchart2").select("g").select(".y-axis")
      .transition()
      .duration(1000)
      .call(d3.axisLeft(yScale2));

  // bepaal de maximum value van de dataset voor de color change
  var max = d3.max(data, function(d) {return d.Data.length;});

  // selecteer alle bars en geef ze nieuwe data mee
  var bars = d3.select(".barchart2").select("g").select(".bars2").selectAll(".rect2")
      .data(data);

  // verwijder de bars die overbodig zijn
  bars.exit()
      .remove();

  // voeg bars toe als er te weinig zijn
  bars.enter().append("rect")
      .attr("class", "rect2")
      .attr('x', 0)
      .attr('y', function(d) { return yScale2(d.Lijst); })
      .attr('height', barHeight)
      .attr('width', function(d) { return xScale2(0); })
    // merge de nieuwe bars met de bestaande, en pas ze aan volgens de dataset
    .merge(bars).transition()
      .duration(1000)
      .attr('x', 0)
      .attr('y', function(d) { return yScale2(d.Lijst); })
      .attr('height', barHeight)
      .attr('width', function(d) { return xScale2(d.Data.length); })
      .attr('opacity', function(d) {return ((d.Data.length * 0.6) + (0.4 * max)) / max})

  //add a value label to the right of each bar
  var texts = d3.select(".barchart2").select("#labelsbarchart2").selectAll(".mytexts")
      .data(data);

  // exit als er teveeld bars zijn
  texts.exit()
      .remove();

  // append niewe text als er te weinig is.
  texts.enter()
      .append("text")
      .attr("class", "mytexts")
      .attr('x', 0)
      .attr('y', function(d) { return yScale2(d.Lijst) + 13.5; })
      .attr('height', barHeight)
      .attr('width', function(d) { return xScale2(0); })
      .text(function (d) { return d.Data.length; })
    // merge de nieuwe met de al bestaande en breng ze naar de juiste data
    .merge(texts).transition()
      .duration(1000)
      .attr("x", function (d) { return xScale2(d.Data.length) - 2; })
      .attr("y", function(d) { return yScale2(d.Lijst) + 13.5; })
      .text(function (d) { return d.Data.length; });

}; // einde van de update barchart functie
