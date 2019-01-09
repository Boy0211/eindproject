window.onload = function() {

  var cc = 1999
  var year = 1999 // later vervangen voor een dropdown menu
      // yearcsv = year + ".csv"

  d3.tsv("../Data/merged_list.tsv").then(function(data) {

    var songsbyList = d3.nest()
        .key(function(d) {return d.Lijst; })
        .entries(data)

    barchartData = process_Data_BarChart(songsbyList[(year-cc)].values)

    createDropdown(songsbyList)
    drawBarChart(barchartData)
    drawPieChart(songsbyList[(year-cc)].values)
  }); // sluting d3.tsv

  function createDropdown(songsbyList) {

    var lists = []
    songsbyList.forEach(function(key, values) {
      lists.push(key['key'])
    });

    var select = d3.select('body')
      .append('select')
      	.attr('class','select')
        .on('change',onchange)

    var options = select
      .selectAll('option')
    	.data(lists).enter()
    	.append('option')
    		.text(function (d) { return d; });

    function onchange() {
    	selectValue = d3.select('select').property('value')
      updateBarChart(process_Data_BarChart(songsbyList[(selectValue-cc)].values))
      updatePieChart(songsbyList[selectValue-cc])
    };
  };

  function updatePieChart(lijst) {
    var width = 1000
    var height = 1000
    var radius = Math.min(width, height) / 2;
    var color = d3.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f"])
    console.log(lijst);
    data = getBiggestArtists(lijst["values"])
    var arc = d3.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4)
    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d["values"].length;})

    var slices = d3.select(".piechart").select(".slices").selectAll("path")
        .data(pie(data))

    // slices
        .transition()
        .duration(1000)

          .attr("fill", function(d, i) { return color(i); })
          .attr("d", arc)
          .attr("stroke", "white")
          .attr("stroke-width", "6px")
    console.log("ik ben gek");
  }

  function drawPieChart(lijst) {

    var width = 1000
    var height = 1000
    var radius = Math.min(width, height) / 2;

    var svg = d3.select("body")
        .append("svg")
        .attr("class", "piechart")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

    svg.append("g")
    	.attr("class", "labels");
    svg.append("g")
    	.attr("class", "lines");

    data = getBiggestArtists(lijst)

    var color = d3.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f"])

    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d["values"].length;})

    var arc = d3.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4)

    var outerArc = d3.arc()
        .innerRadius(radius * 0.9)
      	.outerRadius(radius * 0.9)

    var path = svg.append("g")
        .attr("class", "slices")
        .datum(data).selectAll("path")
        .data(pie(data))
      .enter().append("path")
        .attr("fill", function(d, i) { return color(i); })
        .attr("d", arc)
        .attr("stroke", "white")
        .attr("stroke-width", "6px")
  }

  function updateBarChart(data) {

    var margin = {top: 50, right:50, bottom:50, left:50};
    var width = 1000
    var height = 600
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

    d3.select("svg").select("g").select(".x-axis")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(xScale))
      .selectAll("text")
        .attr("x", -8)
        .attr("y", 6)
        .attr("transform", "rotate(-40)")
        .style("text-anchor", "end");

    d3.select("svg").select("g").select(".y-axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(yScale))

    var bars = d3.select("svg").select("g").selectAll(".rect")
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
  };

  function drawBarChart(data) {

    var margin = {top: 50, right:50, bottom:50, left:50};
    var width = 1000
    var height = 600
    var barPadding = 1.2

    var svg = d3.select("body")
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

    svg.append("g").selectAll("rect")
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
        .attr('fill', 'grey')

  }; //sluiten draw bar chart

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

  function getBiggestArtists(lijst) {

    var songsbyArtist = d3.nest()
        .key(function(d) {return d.Artiest; })
        .entries(lijst)

    songsbyArtist.sort(function(a, b) {
      var x = a['values'].length; var y = b['values'].length;
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    })

    data = songsbyArtist.slice(0, 10);

    console.log(data);
    return data
  };

}; // sluting window onload function
