
// hier worden de constante variabelen voor de breedte en de hoogte vastgesteld
const widthLine = 550;
const heightLine = 200;
const marginLine = {top: 50, bottom: 50, right: 20, left:50};


// functie voor het tekenen van beide graphs. Door aan te vullen of je de
// beste of de slechtste wil krijg je de betreffende graph
function drawLineGraph(graph, artist) {

  // hier wordt bepaalt welke graph getekend gaat worden en de betreffende
  // waarden voor deze graph worden hier aangevuld
  if (graph == "best") {
    var which = "first"
    var selection = "#bestsong"
    var selectionclass = "linechartBestSong"
  } else {
    var which = "last"
    var selection = "#worstsong"
    var selectionclass = "linechartWorstSong"
  };

  // select svg element en voeg daar een g element aan toe
  var svg = d3.select(selection)
      .append("svg")
      .attr("class", selectionclass)
      .attr("width", (widthLine + marginLine.left + marginLine.right))
      .attr("height", (heightLine + marginLine.top + marginLine.bottom))
    .append("g")
      .attr("transform", "translate(" + marginLine.top + "," + marginLine.left + ")");

  // bepaal de x-schaal
  var xScale = d3.scaleTime()
      .range([0, widthLine])
      .domain(d3.extent(artist["TOP2000JAAR"], function(d) {return d.Lijst}));

  // bepaal de y-schaal
  var yScale = d3.scaleLinear()
      .range([heightLine, 0])
      .domain([0, 2000]);

  // variabele voor de lijn, bewerkt met de schaal hierboven
  var line = d3.line()
      .x(function (d) {
        return xScale(d.Lijst); })
      .y(function (d) {
        return yScale(d.Data[getFirstOrLast(which, d.Data)].Notering) });

  // schrijf de x-as in het svg element
  svg.append("g")
      .attr("class", "x-axis")
      .call(d3.axisBottom(xScale))
      .attr("transform", "translate(0," + (heightLine) + ")");

  // schrijf de y-as in het svg element
  svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale));

  //  schrijf de lijn in het svg element
  svg.append("g").append("path")
      .datum(artist["TOP2000JAAR"])
      .attr("class", "line")
      .attr("d", line(artist["TOP2000JAAR"]));
};


function updateLineGraph(graph, artist) {

  if (graph == "best") {
    var which = "first"
    var selection = "#bestsong"
    var selectionclass = "linechartBestSong"
  } else {
    var which = "last"
    var selection = "#worstsong"
    var selectionclass = "linechartWorstSong"
  };

  var svg = d3.select(selection).select("svg g")

  var xScale = d3.scaleTime()
      .range([0, widthLine])
      .domain(d3.extent(artist["TOP2000JAAR"], function(d) {return d.Lijst}));

  // bepaal de y-schaal
  var yScale = d3.scaleLinear()
      .range([heightLine, 0])
      .domain([0, 2000]);

  var line = d3.line()
      .x(function (d) {
        return xScale(d.Lijst); })
      .y(function (d) {
        return yScale(d.Data[getFirstOrLast(which, d.Data)].Notering) });

  svg.select(".x-axis")
      .transition()
      .duration(1000)
      .call(d3.axisBottom(xScale))
      .attr("transform", "translate(0," + (heightLine) + ")");

  svg.select(".line")
      .datum(artist["TOP2000JAAR"])
      .transition()
      .duration(1000)
      .attr("d", line(artist["TOP2000JAAR"]));
};
