// maak de constante variabelen die door het hele script gebruikt worden
const marginBar1 = {top: 50, right:50, bottom:50, left:50}
const widthBar1 = 725
const heightBar1 = 470
const barPadding = 2.5

// creeër een xScale
var xScale = d3.scaleBand()
    .range([0, (widthBar1 - marginBar1.right - marginBar1.left)])
    .padding(0.1)

// creeër een yScale
var yScale = d3.scaleLinear()
    .range([(heightBar1 - marginBar1.top - marginBar1.bottom), 0])


// functie om de initiële barchart te tekenen
function drawBarChart(temp_data) {

  // process de data zo, dat die gebruikt kan worden voor de barchart
  var data = process_Data_BarChart(temp_data);
  var max = d3.max(data, function(d) {return d.y;});

  // creeër het svg element op de goede plek in de html
  var svg = d3.select("#barchart")
      .append("svg")
      .attr("class", "barchart")
      .attr("width", widthBar1)
      .attr("height", heightBar1)
    .append("g")
      .attr("transform", "translate(" + marginBar1.left + "," + marginBar1.top + ")");

  // geef de x en y-as de goede domeinen mee
  xScale.domain(data.map(function (d) { return d.x; }));
  yScale.domain([0, d3.max(data, function (d) { return d.y; })]);

  // custom x-axis
  var xAxis = d3.axisBottom(xScale)
      .tickValues(xScale.domain().filter(function(d,i){ return !(i%2)}));

  // teken de x-as
  svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + (heightBar1 - marginBar1.top - marginBar1.bottom) + ")")
      .call(xAxis)
    .selectAll("text")
      .attr("x", -8)
      .attr("y", 6)
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end");

  // teken de y-as
  svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale));

  // teken alle rectangles
  svg.append("g").attr("class", "bars").selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "rect")
      .attr('x', function(d) { return xScale(d.x); })
      .attr('y', function(d) { return yScale(d.y); })
      .attr('width', (widthBar1 / data.length) - barPadding)
      .attr('height', function(d) { return heightBar1 - 100 - yScale(d.y); })
      .attr('opacity', function(d) {return ((d.y * 0.6) + (0.4 * max)) / max})
      .on("click", function(d) {
        selectedYear = d.x
        dataYearBubbleChart(temp_data, selectedYear) // wanneer er op de barchart wordt gedrukt, pas de bubblechart aan
      });
}; //sluiten draw bar chart


// functie voor het updaten van de barchart
function updateBarChart(temp_data) {

  // proces de data zo dat het gebruikt kan worden voor de barchart
  var data = process_Data_BarChart(temp_data);
  var max = d3.max(data, function(d) {return d.y;});

  // pas de domein van de assen aan aan de nieuwe data
  xScale.domain(data.map(function (d) { return d.x; }));
  yScale.domain([0, d3.max(data, function (d) { return d.y; })]);

  // custom x-axis
  var xAxis = d3.axisBottom(xScale)
      .tickValues(xScale.domain().filter(function(d,i){ return !(i%2)}));

  // selecteer de barchart en pas de x-as aan
  d3.select(".barchart").select("g").select(".x-axis")
      .transition()
      .duration(1000)
      .call(xAxis)
    .selectAll("text")
      .attr("x", -8)
      .attr("y", 6)
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end");

  // selecteer de barchart en pas de y-as aan
  d3.select(".barchart").select("g").select(".y-axis")
      .transition()
      .duration(1000)
      .call(d3.axisLeft(yScale));

  // selecteer alle bars en geef ze nieuwe data mee
  var bars = d3.select(".barchart").select("g").select(".bars").selectAll(".rect")
      .data(data);

  // verwijder de bars die overbodig zijn
  bars.exit()
      .remove();

  bars.enter().append("rect")
      .attr("class", "rect")
      .attr("width", (widthBar1 / data.length) - barPadding)
      .attr('x', function(d) {return xScale(d.x);})
      .attr("height", 0)
      .attr("y", function(d) {return yScale(0);})
      .attr('opacity', function(d) {return ((d.y * 0.6) + (0.4 * max)) / max})
    .merge(bars).transition()
      .duration(1000)
      .attr('width', (widthBar1 / data.length) - barPadding)
      .attr('x', function(d, i) {return xScale(d.x);})
      .attr('height', function(d) {return heightBar1 - marginBar1.top - marginBar1.bottom - yScale(d.y);})
      .attr('y', function(d) {return yScale(d.y);})
      .attr('opacity', function(d) {return ((d.y * 0.6) + (0.4 * max)) / max});

  // geef alle bars de on click functie mee
  d3.select(".bars").selectAll("rect")
      .on("click", function(d) {
        selectedYear = d.x
        dataYearBubbleChart(temp_data, selectedYear)
      });
}; // einde van de update barchart functie


// functie voor het processen van de data voor een barchart
function process_Data_BarChart(lijst) {

  // nest de data per jaar dat het is uitgebracht
  var songsbyYear = d3.nest()
      .key(function(d) {return d.Jaar; })
      .entries(lijst)

  // sorteer deze weer op chronologische volgorde
  songsbyYear.sort(function(a, b) {
    var x = a['key']; var y = b['key'];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  })

  // creeër versimpelde versie van de data voor makkelijkere berekeningen
  var dataForBarChart = []
  songsbyYear.forEach(function(key, values) {
    dataForBarChart.push({
      x : key['key'],
      y : key['values'].length
    })
  })

  // return de data
  return dataForBarChart
};
