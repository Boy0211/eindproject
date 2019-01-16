// const margin = {top: 50, right:50, bottom:50, left:50}
// const width = 730
// const height = 470
// const barPadding = 2.5

function drawBarChart(temp_data) {

  data = process_Data_BarChart(temp_data)

  var margin = {top: 50, right:50, bottom:50, left:50};
  var width = 730
  var height = 470
  var barPadding = 2.5

  var svg = d3.select("#barchart")
      .append("svg")
      .attr("class", "barchart")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xScale = d3.scaleBand()
      .range([0, (width - margin.right - margin.left)])
      .padding(0.1)
      .domain(data.map(function (d) {
          return d.x;
      }));

  var yScale = d3.scaleLinear()
      .range([(height - margin.top - margin.bottom), 0])
      .domain([0, d3.max(data, function (d) {
          return d.y;
      })]);

  // draw the x-axis
  svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + (370) + ")")
      .call(d3.axisBottom(xScale))
    .selectAll("text")
      .attr("x", -8)
      .attr("y", 6)
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end");

  // drawing the y-axis
  svg.append("g")
    .attr("class", "y-axis")
    // .attr("transform", "translate(0," + (-margin.top) + ")")
    .call(d3.axisLeft(yScale))

  svg.append("g").attr("class", "bars").selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "rect")
      .attr('x', function(d, i) {
       return xScale(d.x);
      })
      .attr('y', function(d) {
          return yScale(d.y)
      })
      .attr('width', (width / data.length) - barPadding)
      .attr('height', function(d){
          return height - 100 - yScale(d.y);
      })
      .on("click", function(d) {
        console.log(d)
        selectedYear = d.x
        dataYearBubbleChart(temp_data, selectedYear)
      })
}; //sluiten draw bar chart

function updateBarChart(temp_data) {

  data = process_Data_BarChart(temp_data)

  var margin = {top: 50, right:50, bottom:50, left:50};
  var width = 800
  var height = 400
  var barPadding = 1.2

  var xScale = d3.scaleBand()
      .range([0, width])
      .padding(0.1)
      .domain(data.map(function (d) {
          return d.x;
      }))

  var yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, function (d) {
          return d.y;
      })]);

  d3.select(".barchart").select("g").select(".x-axis")
      .transition()
      .duration(1000)
      .call(d3.axisBottom(xScale))
    .selectAll("text")
      .attr("x", -8)
      .attr("y", 6)
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end");

  d3.select(".barchart").select("g").select(".y-axis")
      .transition()
      .duration(1000)
      .call(d3.axisLeft(yScale))

  var bars = d3.select(".barchart").select("g").select(".bars").selectAll(".rect")
      .data(data)

  bars.exit()
      .remove()

  bars.enter().append("rect")
      .transition().duration(1000)
      .attr("class", "rect")
      .attr('width', (width / data.length) - barPadding)
      .attr('x', function(d, i) {return xScale(d.x);})
      .attr('height', function(d) {return height - yScale(d.y);})
      .attr('y', function(d) {return yScale(d.y);})

  bars
      .transition().duration(1000)
      .attr("class", "rect")
      .attr('width', (width / data.length) - barPadding)
      .attr('x', function(d, i) {return xScale(d.x);})
      .attr('height', function(d) {return height - yScale(d.y);})
      .attr('y', function(d) {return yScale(d.y);})


  d3.select(".bars").selectAll("rect")
      .on("click", function(d) {
        console.log(d)
        selectedYear = d.x
        dataYearBubbleChart(temp_data, selectedYear)
      })

  console.log(bars);
};

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
