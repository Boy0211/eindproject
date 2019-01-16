window.onload = function() {

  d3.json("../Data/artiesten.json").then(function(data) {

    console.log(data);
    // drawLineGraphBest(data[12])
    drawLineGraph("best", data[12])
    drawLineGraph("worst", data[12])
    // drawBarChart(data[12])


  })

  function drawBarChart(artist) {

    console.log(artist);

    var margin = {top: 50, right:50, bottom:50, left:50};
    var width = 800
    var height = 400
    var barPadding = 1.2

    var svg = d3.select("#barchart")
        .append("svg")
        .attr("class", "barchart")
        .attr("width", (width + margin.left + margin.right))
        .attr("height", (height + margin.top + margin.bottom))
      .append("g")
        .attr("transform", "translate(" + margin.top + "," + margin.left + ")");

    var xScale = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(data.map(function (d) {
            return d.x;
        }));

    var yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, function (d) {
            return d.y;
        })]);

    // draw the x-axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + (height) + ")")
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
            return height - yScale(d.y);
        })
        .on("click", function(d) {
          console.log(d)
          selectedYear = d.x
          dataYearBubbleChart(temp_data, selectedYear)
        })

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .text("Titels per het jaar van uitbrenger:");

  };

  function updateLineGraphBest(artist) {

  }

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
    }

    // Hier wordt de breedte en de hoogte van de graph bepaalt
    var width = 600
    var height = 300
    var margin = {top: 50, bottom: 50, right: 50, left:50}

    // select svg element en voeg daar een g element aan toe
    var svg = d3.select(selection)
        .append("svg")
        .attr("class", selectionclass)
        .attr("width", (width + margin.left + margin.right))
        .attr("height", (height + margin.top + margin.bottom))
      .append("g")
        .attr("transform", "translate(" + margin.top + "," + margin.left + ")");

    // bepaal de x-schaal
    var xScale = d3.scaleTime()
        .range([0, width])
        .domain(d3.extent(artist["TOP2000JAAR"], function(d) {return d.Lijst}))

    // bepaal de y-schaal
    var yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 2000])

    // variabele voor de lijn, bewerkt met de schaal hierboven
    var line = d3.line()
        .x(function (d) {
          return xScale(d.Lijst); })
        .y(function (d) {
          return yScale(d.Data[getFirstOrLast(which, d.Data)].Notering) })

    // schrijf de x-as in het svg element
    svg.append("g")
        .attr("class", "x-axis")
        .call(d3.axisBottom(xScale))
        .attr("transform", "translate(0," + (height) + ")")

    // schrijf de y-as in het svg element
    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))

    //  schrijf de lijn in het svg element
    svg.append("g").append("path")
        .datum(artist["TOP2000JAAR"])
        .attr("class", "line")
        .attr("d", line(artist["TOP2000JAAR"]))
  }
}

// deze functie geeft of de eerste uit een array terug of de laatste.
function getFirstOrLast(which, data) {

  if (which == "first") {
    return 0
  } else {
    return (data.length - 1)
  }
}
