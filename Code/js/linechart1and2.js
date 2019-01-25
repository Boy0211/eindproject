
// hier worden de constante variabelen voor de breedte en de hoogte vastgesteld
const widthLine = 550;
const heightLine = 150;
const marginLine = {top: 15, bottom: 30, right: 20, left:50};


// functie voor het tekenen van beide graphs. Door aan te vullen of je de
// beste of de slechtste wil krijg je de betreffende graph

function getDataforLineGraphs(artist) {

  allData = processDataLineCharts(artist)

  updateLineGraph("bestsong", allData.hoogsteNotering)
  updateLineGraph("meansong", allData.gemiddeldeNotering)
  updateLineGraph("worstsong", allData.laagsteNotering)

};

var tipline = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<span><strong>Titel: </strong>" + d.titel + "<br><strong>Notering: </strong>" + d.y + "</span>"
        });

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
      .domain([d3.min(data, function(d) { return d.y;} ) - 1, d3.max(data, function(d) { return d.y;} ) + 1]);

  // variabele voor de lijn, bewerkt met de schaal hierboven
  var line = d3.line()
      .x(function (d) {
        return xScale(d.x); })
      .y(function (d) {
        return yScale(d.y); })
      .curve(d3.curveMonotoneX);

  // voeg de tip toe aan het svg element
  svg.call(tipline);

  // schrijf de x-as in het svg element
  svg.append("g")
      .attr("class", "x-axis")
      .call(d3.axisBottom(xScale)
        .tickFormat(d3.format(".0f")))
      .attr("transform", "translate(0," + (heightLine) + ")");

  // schrijf de y-as in het svg element
  svg.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickFormat(d3.format(".0f")));

  //  schrijf de lijn in het svg element
  svg.append("g").append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line(data));

  svg.append("g")
      .attr("class", "dots")
    .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 4)
      .attr("cx", function(d) { return xScale(d.x); })
      .attr("cy", function(d) { return yScale(d.y); })
      .on("mouseover", function(d) {
          tipline.show(d)
          d3.select(this)
            // .style("opacity", 0.8)
            .style("stroke-width", -20)
      })
      .on('mouseout', function(d){
          tipline.hide(d);
          d3.select(this)
            .style("opacity", 1)
            .style("stroke-width", "6px")
      });
};


function updateLineGraph(graph, data) {

  selection = "#" + graph
  selectionclass = "linechart" + graph

  var svg = d3.select(selection).select("svg g")

  var xScale = d3.scaleTime()
      .range([0, widthLine])
      .domain(d3.extent(data, function(d) {return d.x}));

  // bepaal de y-schaal
  var yScale = d3.scaleLinear()
      .range([heightLine, 0])
      .domain([d3.min(data, function(d) { return d.y;} ) - 1, d3.max(data, function(d) { return d.y;} ) + 1]);

  var line = d3.line()
      .x(function (d) {
        return xScale(d.x); })
      .y(function (d) {
        return yScale(d.y); })
      .curve(d3.curveMonotoneX);

  svg.select(".y-axis")
      .transition()
      .duration(1000)
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickFormat(d3.format(",.0f")));

  svg.select(".x-axis")
      .transition()
      .duration(1000)
      .attr("transform", "translate(0," + (heightLine) + ")")
      .call(d3.axisBottom(xScale)
        .tickFormat(d3.format(".0f")))


  svg.select(".line")
      .datum(data)
      .transition()
      .duration(1000)
      .attr("d", line(data));

  var dots = svg.select(".dots").selectAll("circle")
      .data(data)

  dots.exit()
      .remove()

  dots.enter()
      .append("circle")
      .attr("r", 4)
      .attr("cx", function(d) { return xScale(d.x); })
      .attr("cy", function(d) { return yScale(d.y); })
      .attr("opacity", 0)
    .merge(dots)
      .transition()
      .duration(1000)
      .attr("cx", function(d) { return xScale(d.x); })
      .attr("cy", function(d) { return yScale(d.y); })
      .attr("opacity", 1)

  svg.select(".dots").selectAll("circle")
      .on("mouseover", function(d) {
          tipline.show(d)
          d3.select(this)
            // .style("opacity", 0.8)
            .style("stroke-width", -20)
      })
      .on('mouseout', function(d){
          tipline.hide(d);
          d3.select(this)
            .style("opacity", 1)
            .style("stroke-width", "6px")
      });
};

function processDataLineCharts(artist) {

  var hoogsteNotering = []
  var laagsteNotering = []
  var gemiddeldeNotering = []
  artist["TOP2000JAAR"].forEach(function(d) {

      console.log(d);

      hoogsteNotering.push({
        x : d.Lijst,
        y : d.Data[0].Notering,
        titel : d.Data[0].Titel,
      })

      laagsteNotering.push({
        x : d.Lijst,
        y : d.Data[d.Data.length - 1].Notering,
        titel : d.Data[d.Data.length - 1].Titel,
      })

      var sum = 0
      d.Data.forEach(function(e) {
          sum += e.Notering
      })

      gemiddeldeNotering.push({
        x : d.Lijst,
        y : sum / d.Data.length,
        titel : d.Data.length + " titels"
      })
  })

  var newData = []

  newData.hoogsteNotering = hoogsteNotering
  newData.gemiddeldeNotering = gemiddeldeNotering
  newData.laagsteNotering = laagsteNotering

  console.log(newData);

  return newData

}