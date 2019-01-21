// maak de constante variabelen die door het hele script gebruikt worden
const marginBar2 = {top: 20, right:50, bottom:35, left:50}
const widthBar2 = 650
const heightBar2 = 450
const barHeight = "16px"

// creeër een xScale
var yScale2 = d3.scaleBand()
    .range([0, (heightBar2 - marginBar2.top - marginBar2.bottom)])
    .padding(0.1)

// creeër een yScale
var xScale2 = d3.scaleLinear()
    .range([0, (widthBar2 - marginBar2.left - marginBar2.right)])

// functie om de initiële barchart te tekenen
function drawBarChart2(temp_data) {

  data = temp_data.TOP2000JAAR

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

  // teken de x-as
  svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + (heightBar2 - marginBar2.top - marginBar2.bottom) + ")")
      .call(d3.axisBottom(xScale2))
    .selectAll("text")
      .attr("x", -8)
      .attr("y", 6)
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end");

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
      .attr('width', function(d) { return xScale2(d.Data.length); });

  var texts = svg.append("g")
      .attr("class", "text")
    .selectAll("text")
      .data(data)
      .enter()
      .append("text");

  //add a value label to the right of each bar
  texts.attr("class", "mytexts")
      // .attr("class", "label")
      //x position is 3 pixels to the right of the bar
      .attr("x", function (d) {
          return xScale2(d.Data.length) - 20;
      })
      .attr("y", function(d) { return yScale2(d.Lijst) + 13.5; })
      .text(function (d) {
          return d.Data.length;
      })
      .style("fill", "white");
}; //sluiten draw bar chart


// functie voor het updaten van de barchart
function updateBarChart2(artist) {

  console.log(artist["TOP2000JAAR"]);

  data = artist["TOP2000JAAR"];

  // pas de domein van de assen aan aan de nieuwe data
  yScale2.domain(["1999", "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018" ]);
  xScale2.domain([0, d3.max(data, function (d) { return d.Data.length; })]);

  // selecteer de barchart en pas de x-as aan
  d3.select(".barchart2").select("g").select(".x-axis")
      .transition()
      .duration(1000)
      .call(d3.axisBottom(xScale2))
    .selectAll("text")
      .attr("x", -8)
      .attr("y", 6)
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end");

  // selecteer de barchart en pas de y-as aan
  d3.select(".barchart2").select("g").select(".y-axis")
      .transition()
      .duration(1000)
      .call(d3.axisLeft(yScale2));

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
    .merge(bars).transition()
      .duration(1000)
      .attr('x', 0)
      .attr('y', function(d) { return yScale2(d.Lijst); })
      .attr('height', barHeight)
      .attr('width', function(d) { return xScale2(d.Data.length); })

  //add a value label to the right of each bar
  var texts = d3.select(".barchart2").select(".text").selectAll(".mytexts")
      .data(data);

  texts.exit()
      .remove();

  texts.enter()
      .append("text")
      .attr("class", "mytexts")
      .attr('x', 0)
      .attr('y', function(d) { return yScale2(d.Lijst) + 13.5; })
      .attr('height', barHeight)
      .attr('width', function(d) { return xScale2(0); })
      .text(function (d) { return d.Data.length; })
    .merge(texts).transition()
      .duration(1000)
      .attr("x", function (d) {
          return xScale2(d.Data.length) - 20;
      })
      .attr("y", function(d) { return yScale2(d.Lijst) + 13.5; })
      .text(function (d) {
          return d.Data.length;
      })
      .style("fill", "white")




  // texts
  //     .transition().duration(1000)
  //     //x position is 3 pixels to the right of the bar
  //     .attr("x", function (d) {
  //         return xScale2(d.Data.length) - 20;
  //     })
  //     .attr("y", function(d) { return yScale2(d.Lijst) + 13.5; })
  //     .text(function (d) {
  //         return d.Data.length;
  //     });
  //
  // texts.enter().append("text")
  //     .attr("class", "mytexts")
  //     .transition().duration(1000)
  //     //x position is 3 pixels to the right of the bar
  //     .attr("x", function (d) {
  //         return xScale2(d.Data.length) - 20;
  //     })
  //     .attr("y", function(d) { return yScale2(d.Lijst) + 13.5; })
  //     .text(function (d) {
  //         return d.Data.length;
  //     })
  //     .style("fill", "white");




}; // einde van de update barchart functie
