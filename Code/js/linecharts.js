
// hier worden de constante variabelen voor de breedte en de hoogte vastgesteld
const widthLine = 550;
const heightLine = 150;
const marginLine = {top: 15, bottom: 30, right: 20, left:50};

/**
 * [een overkoepelende functie voor het aanroepen van de goede data en graphs]
 * @param {[array]} artist [een array met artiesten en hun titels]
 */
function getDataforLineGraphs(artist) {

  // save the processed data
  var allData = processDataLineCharts(artist);

  // draw the different linegraphs
  updateLineGraph("bestsong", allData.hoogsteNotering);
  updateLineGraph("meansong", allData.gemiddeldeNotering);
  updateLineGraph("worstsong", allData.laagsteNotering);

};

var tipline = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<span><strong>Titel: </strong>" + d.titel + "<br><strong>Notering: </strong>" + d.y + "</span>"
        });

/**
 * [Een functie voor het maken van de piechart.]
 * @param {[string]} graph [een string met welke de goede div selecteert]
 * @param {[array]} data [een array met daarin de songs van de artiest]
 */
function drawLineGraph(graph, data) {

  // hier wordt bepaalt welke graph getekend gaat worden en de betreffende
  // waarden voor deze graph worden hier aangevuld
  var selection = "#" + graph
  var selectionclass = "linechart" + graph

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

  // voeg punten aan de lijn toe
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
            .attr("r", 7)
        })
      .on('mouseout', function(d) {
        tipline.hide(d)
        d3.select(this)
          .attr("r", 4)
      });
};

/**
 * [Een functie voor het maken van de piechart.]
 * @param {[string]} graph [een string met welke de goede div selecteert]
 * @param {[array]} data [een array met daarin de songs van de artiest]
 */
function updateLineGraph(graph, data) {

  // schrijf de goede selctie variabele voor het selecteren van het div-element
  var selection = "#" + graph
  var selectionclass = "linechart" + graph

  // selecteer het svg element
  var svg = d3.select(selection).select("svg g")

  // schrijf een vernieuwde xScale
  var xScale = d3.scaleTime()
      .range([0, widthLine])
      .domain(d3.extent(data, function(d) {return d.x}));

  // bepaal de y-schaal
  var yScale = d3.scaleLinear()
      .range([heightLine, 0])
      .domain([d3.min(data, function(d) { return d.y;} ) - 1, d3.max(data, function(d) { return d.y;} ) + 1]);

  // bepaal welke data de line nodig heeft.
  var line = d3.line()
      .x(function (d) {
        return xScale(d.x); })
      .y(function (d) {
        return yScale(d.y); })
      .curve(d3.curveMonotoneX);

  // selecteer de Y-axis en pas deze aan
  svg.select(".y-axis")
      .transition()
      .duration(1000)
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickFormat(d3.format(",.0f")));

  // selecteer de x-axis en pas deze aan
  svg.select(".x-axis")
      .transition()
      .duration(1000)
      .attr("transform", "translate(0," + (heightLine) + ")")
      .call(d3.axisBottom(xScale)
        .tickFormat(d3.format(".0f")))

  // selecteer de line en pas deze aan
  svg.select(".line")
      .datum(data)
      .transition()
      .duration(1000)
      .attr("d", line(data));

  // selecteer de dots en geef ze niewe data
  var dots = svg.select(".dots").selectAll("circle")
      .data(data)

  // verwijder dots indien nodig
  dots.exit()
      .remove()

  // voeg dots toe indien nodig
  dots.enter()
      .append("circle")
      .attr("r", 4)
      .attr("cx", function(d) { return xScale(d.x); })
      .attr("cy", function(d) { return yScale(d.y); })
      .attr("opacity", 0)
    // laat deze nieuwe dots mergen met de bestaande dots en bewerk ze
    .merge(dots)
      .transition()
      .duration(1000)
      .attr("cx", function(d) { return xScale(d.x); })
      .attr("cy", function(d) { return yScale(d.y); })
      .attr("opacity", 1);

  // selecteer alle dots en laat ze weer reageren op de mouse-tip
  svg.select(".dots").selectAll("circle")
      .on("mouseover", function(d) {
          tipline.show(d)
          d3.select(this)
            .attr("r", 7)
        })
      .on('mouseout', function(d) {
        tipline.hide(d)
        d3.select(this)
          .attr("r", 4)
      });

}; // einde update functie

/**
 * [Een functie voor het maken van de piechart.]
 * @param {[array]} artist [een array met alle data van alle artiesten]
 */
function processDataLineCharts(artist) {

  // maak lege variabelen voor elke graph
  var hoogsteNotering = []
  var laagsteNotering = []
  var gemiddeldeNotering = []

  // loop over de array van artiesten
  artist["TOP2000JAAR"].forEach(function(d) {

      // sla de hoogste notering op
      hoogsteNotering.push({
        x : d.Lijst,
        y : d.Data[0].Notering,
        titel : d.Data[0].Titel,
      })

      // sla de laagste notering op
      laagsteNotering.push({
        x : d.Lijst,
        y : d.Data[d.Data.length - 1].Notering,
        titel : d.Data[d.Data.length - 1].Titel,
      })

      // bepaal het gemiddelde
      var sum = 0
      d.Data.forEach(function(e) {
          sum += e.Notering
      })

      // sla de gemiddelde notering op
      gemiddeldeNotering.push({
        x : d.Lijst,
        y : sum / d.Data.length,
        titel : d.Data.length + " titels"
      })
  })

  // sla alle data op in een lijst zodat de functie het kan returnen
  var newData = []
  newData.hoogsteNotering = hoogsteNotering
  newData.gemiddeldeNotering = gemiddeldeNotering
  newData.laagsteNotering = laagsteNotering

  return newData

}
