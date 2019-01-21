
// hier worden de constante variabelen voor de breedte en de hoogte vastgesteld
const widthLine = 550;
const heightLine = 150;
const marginLine = {top: 20, bottom: 30, right: 20, left:50};


// functie voor het tekenen van beide graphs. Door aan te vullen of je de
// beste of de slechtste wil krijg je de betreffende graph

function getDataforLineGraphs(artist) {
  console.log(artist);
  var hoogsteNotering = []
  var laagsteNotering = []
  var gemiddeldeNotering = []
  artist["TOP2000JAAR"].forEach(function(d) {

      hoogsteNotering.push({
        x : d.Lijst,
        y : d.Data[0].Notering
      })

      laagsteNotering.push({
        x : d.Lijst,
        y : d.Data[d.Data.length - 1].Notering
      })

      var sum = 0
      d.Data.forEach(function(e) {
          sum += e.Notering
      })

      gemiddeldeNotering.push({
        x : d.Lijst,
        y : sum / d.Data.length
      })
  })
  console.log(hoogsteNotering);
  console.log(laagsteNotering);
  console.log(gemiddeldeNotering);

  
  drawLineGraph("bestsong", hoogsteNotering)
  drawLineGraph("worstsong", laagsteNotering)
  drawLineGraph("meansong", gemiddeldeNotering)

};

function drawLineGraph(graph, data) {

  // hier wordt bepaalt welke graph getekend gaat worden en de betreffende
  // waarden voor deze graph worden hier aangevuld
  selection = "#" + graph
  selectionclass = "linechart" + graph

  // select svg element en voeg daar een g element aan toe
  var svg = d3.select(selection)
      .append("svg")
      .attr("class", selectionclass)
      .attr("width", (widthLine + marginLine.left + marginLine.right))
      .attr("height", (heightLine + marginLine.top + marginLine.bottom))
    .append("g")
      .attr("transform", "translate(" + marginLine.left + "," + marginLine.top + ")");

  // bepaal de x-schaal
  var xScale = d3.scaleTime()
      .range([0, widthLine])
      .domain(d3.extent(data, function(d) {return d.x}));

  // bepaal de y-schaal
  var yScale = d3.scaleLinear()
      .range([heightLine, 0])
      .domain([d3.min(data, function(d) { return d.y;} ), d3.max(data, function(d) { return d.y;} )]);

  // variabele voor de lijn, bewerkt met de schaal hierboven
  var line = d3.line()
      .x(function (d) {
        return xScale(d.x); })
      .y(function (d) {
        return yScale(d.y); });

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
      .datum(data)
      .attr("class", "line")
      .attr("d", line(data));
};


function updateLineGraph(graph, artist) {

  selection = "#" + graph
  selectionclass = "linechart" + graph

  var svg = d3.select(selection).select("svg g")

  var xScale = d3.scaleTime()
      .range([0, widthLine])
      .domain(d3.extent(data, function(d) {return d.x}));

  // bepaal de y-schaal
  var yScale = d3.scaleLinear()
      .range([heightLine, 0])
      .domain([d3.min(data, function(d) { return d.y;} ), d3.max(data, function(d) { return d.y;} )]);

  var line = d3.line()
      .x(function (d) {
        return xScale(d.x); })
      .y(function (d) {
        return yScale(d.y); });

  svg.select(".y-axis")
      .transition()
      .duration(1000)
      .call(d3.axisLeft(yScale))

  svg.select(".x-axis")
      .transition()
      .duration(1000)
      .call(d3.axisBottom(xScale))
      .attr("transform", "translate(0," + (heightLine) + ")");

  svg.select(".line")
      .datum(data)
      .transition()
      .duration(1000)
      .attr("d", line(d.y));
};
