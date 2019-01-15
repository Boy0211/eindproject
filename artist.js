window.onload = function() {

  d3.json("../Data/artiesten.json").then(function(data) {

    console.log(data);
    // drawLineGraphBest(data[12])
    drawLineGraph("best", data[12])
    drawLineGraph("worst", data[12])

  })


  function updateLineGraphBest(artist) {

  }

  function drawLineGraph(graph, artist) {

    if (graph == "best") {
      var which = "first"
      var selection = "#bestsong"
      var selectionclass = "linechartBestSong"
    } else {
      var which = "last"
      var selection = "#worstsong"
      var selectionclass = "linechartWorstSong"
    }

    var width = 600
    var height = 300
    var margin = {top: 50, bottom: 50, right: 50, left:50}

    var svg = d3.select(selection)
        .append("svg")
        .attr("class", selectionclass)
        .attr("width", (width + margin.left + margin.right))
        .attr("height", (height + margin.top + margin.bottom))
      .append("g")
        .attr("transform", "translate(" + margin.top + "," + margin.left + ")");

    var parseTime = d3.timeParse("%Y")
    var bisectDate = d3.bisector(function(d) {return d.Lijst})

    var xScale = d3.scaleTime()
        .range([0, width])
        .domain(d3.extent(artist["TOP2000JAAR"], function(d) {return d.Lijst}))
    var yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 2000])

    var line = d3.line()
        .x(function (d) {
          return xScale(d.Lijst); })
        .y(function (d) {
          return yScale(d.Data[getFirstOrLast(which, d.Data)].Notering) })

    svg.append("g")
        .attr("class", "x-axis")
        .call(d3.axisBottom(xScale))
        .attr("transform", "translate(0," + (height) + ")")

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))

    svg.append("g").append("path")
        .datum(artist["TOP2000JAAR"])
        .attr("class", "line")
        .attr("d", line(artist["TOP2000JAAR"]))
  }
}

function getFirstOrLast(which, data) {

  if (which == "first") {
    return 0
  } else {
    return (data.length - 1)
  }
}
