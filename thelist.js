window.onload = function() {

  var cc = 1999
  var year = 1999 // later vervangen voor een dropdown menu
      // yearcsv = year + ".csv"
  var secondColorset = ["#A1C3D1", "#B39BC8", "#F0EBF4", "#F172A1", "#E64938"]
  var colorset = ["#59253A","#4E4E50","#6F2232","#950740","#C3073F"]

  d3.tsv("../Data/merged_list.tsv").then(function(data) {

    var songsbyList = d3.nest()
        .key(function(d) {return d.Lijst; })
        .entries(data)

    createDropdown(songsbyList)
    drawPieChart(songsbyList[(year-cc)].values)
    createTable(songsbyList[year-cc].values)
    drawBarChart(songsbyList[(year-cc)].values)
    drawBubbleChart(songsbyList[year-cc].values)
  }); // sluting d3.tsv

  function createDropdown(songsbyList) {

    var lists = []
    songsbyList.forEach(function(key, values) {
      lists.push(key['key'])
    });

    // var dropdown = d3.select("body").append("div")
    //     .attr("class", "dropdown")
    //   .append("button")
    //     .attr("class", "btn btn-secondary dropdown-toggle")
    //     .attr("type", "button")
    //     .attr("id", "dropdownMenuButton")
    //     .attr("data-toggle", "dropdown")
    //     .attr("aria-haspopup", "true")
    //     .attr("aria-expanded", "false")
    //     .text("1999")
    //
    // var options = d3.select(".dropdown")
    //   .append("div")
    //     .on("change", onchange)
    //     .attr("class", "dropdown-menu")
    //     .attr("aria-labelledby", "dropdownMenuButton")
    //     .selectAll("a")
    //     .data(lists).enter()
    //   	.append('a')
    //       .attr("class", "dropdown-menu")
    //   		.text(function (d) { return d; });


    var select = d3.select('#inlineFormCustomSelect')
        // .select('select')
      	// .attr('class','select')
        .on('change',onchange)

    var options = select
      .selectAll('option')
    	.data(lists).enter()
    	.append('option')
    		.text(function (d) { return d; });

    function onchange() {
    	selectValue = d3.select('select').property('value')
      updateTable(songsbyList[selectValue-cc].values)
      updatePieChart(songsbyList[selectValue-cc])
      updateBarChart(songsbyList[(selectValue-cc)].values)
      updateBubbleChart(songsbyList[selectValue-cc].values)
    };
  };

  function updateTable(lijst) {

    d3.select(".divtable").select(".table")
      .remove()

    var width = 500
    var height = 500

    columns = ["Notering", "Titel", "Artiest", "Jaar"]
    data = lijst.slice(0, 8)
    tabulate(data, columns)
  };

  function createTable(lijst) {

    var width = 500
    var height = 500

    var div = d3.select("#tabel")
        .append("div")
        .attr("class", "divtable")
        .attr("width", width)
        .attr("height", height)

    columns = ["Notering", "Titel", "Artiest", "Jaar"]
    data = lijst.slice(0, 8)
    tabulate(data, columns)

  };

  function updatePieChart(lijst) {

    var width = 600
    var height = 400
    var radius = Math.min(width, height) / 2;
    var color = d3.scaleOrdinal(colorset);

    data = getBiggestArtists(lijst["values"])
    var arc = d3.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.55)
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
  }

  function drawPieChart(lijst) {

    var width = 600
    var height = 400
    var radius = Math.min(width, height) / 2;

    var svg = d3.select("#piechart")
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
    console.log(data);

    // var color = d3.scaleOrdinal(["#2E1114", "#501B1D", "#64485C", "#83677B", "#ADADAD"]);
    var color = d3.scaleOrdinal(colorset)

    var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<span><strong>Artiest: </strong>" +d.data.key + "<br><strong>Aantal titels: </strong>" + d.data.values.length + "</span>"
            })

    svg.call(tip);

    var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d["values"].length;})

    var arc = d3.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.55)

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
        .attr("stroke", "#222629")
        .attr("stroke-width", "6px")
        .on("mouseover", function(d) {
            tip.show(d)

            d3.select(this)
              .style("opacity", 0.8)
              .style("stroke-width",3)
        })
        .on('mouseout', function(d){
            tip.hide(d);

            d3.select(this)
              .style("opacity", 1)
              .style("stroke-width", "6px")
        });

    svg.append("text")
       .attr("id", "piechart-text")
       .text("TOP10 Artiesten")
       .style("fill", "white")
  }

  function dataYearBubbleChart(listByYears, year) {

    // nest de data per jaar dat het is uitgebracht
    var songsbyYear = d3.nest()
        .key(function(d) {return d.Jaar; })
        .entries(listByYears)

    // sorteer deze weer op chronologische volgorde
    songsbyYear.sort(function(a, b) {
      var x = a['key']; var y = b['key'];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    })

    console.log(songsbyYear);
    console.log(year);

    var right_list = []
    songsbyYear.forEach(function(key) {
      console.log(key);
      if (key["key"] == year) {
        right_list = key["values"]
      }
    })
    updateBubbleChart(right_list)
  }

  function updateBubbleChart(lijst) {

    temp_data = listByArtist(lijst)
    data = createDataforBubblechart(temp_data)


    var diameter = 450
    var color = d3.scaleOrdinal(colorset);

    var bubble = d3.pack(data)
        .size([diameter, diameter])
        .padding(1.5)

    var svg = d3.select("#bubblechart").select(".bubble")

    var nodes = d3.hierarchy(data).sum(function(d) { return d.AantalTitels})

    var node = svg.selectAll(".node")
        .data(bubble(nodes).descendants())

    var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<span><strong>Artiest: </strong>" +d.data["Artiest"] + "<br><strong>Aantal titels: </strong>" + d.data["AantalTitels"] + "</span>"
            })

    svg.call(tip);

    node.exit().remove()
        .transition()
        .duration(1000)

    node
        .transition()
        .duration(1000)
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
        .attr("r", function(d) {
            return d.r;})
        .style("fill", function(d,i) {
          if( i == 0) {
            return "#222629"
          }
          return color(i);})

    node.enter().append("circle")
        .transition()
        .duration(1000)
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
        .attr("r", function(d) {
            return d.r;})
        .style("fill", function(d,i) { return color(i);})

    d3.select(".bubble").selectAll("circle")
        .attr("id", "aapje")
        .on("mouseover", function(d, i) {
            if( i != 0) {
              tip.show(d)
              console.log(d);
              d3.select(this)
                .style("opacity", 0.8)
                .style("stroke","#222629")
                .style("stroke-width", 3)
            }
        })
        .on('mouseout', function(d){
            tip.hide(d);

            d3.select(this)
              .style("opacity", 1)
              .style("stroke","#222629")
              .style("stroke-width", 1.5)
        });
  };

  function drawBubbleChart(lijst) {

    temp_data = listByArtist(lijst)
    data = createDataforBubblechart(temp_data)

    var diameter = 450
    var paddingBubble = 20

    var color = d3.scaleOrdinal(colorset);

    var bubble = d3.pack(data)
        .size([diameter, diameter])
        .padding(1.5)

    var svg = d3.select("#bubblechart")
        .append("svg")
        .attr("width", diameter + paddingBubble)
        .attr("height", diameter + paddingBubble)
        .attr("class", "bubble");

    var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<span><strong>Artiest: </strong>" +d.data["Artiest"] + "<br><strong>Aantal titels: </strong>" + d.data["AantalTitels"] + "</span>"
            })

    svg.call(tip);

    var nodes = d3.hierarchy(data).sum(function(d) { return d.AantalTitels})

    var node = svg.selectAll(".node")
          .data(bubble(nodes).descendants())
          .enter()
          // .filter(function(d){
          //     return  !d.children
          // })
          .append("circle")
          .attr("class", "node")
          .attr("transform", function(d) {
              return "translate(" + d.x + "," + d.y + ")";
          })
          .attr("r", function(d) {
              return d.r;})
          .style("fill", function(d,i) {
            if( i == 0) {
              return "#222629"
            }
            return color(i);})
          .on("mouseover", function(d,i) {
              if( i != 0) {
                tip.show(d)
                console.log(d);
                d3.select(this)
                  .style("opacity", 1)
                  .style("stroke","#222629")
                  .style("stroke-width", 3)
              }
          })
          .on('mouseout', function(d){
              tip.hide(d);

              d3.select(this)
                .style("opacity", 0.8)
                .style("stroke","#222629")
                .style("stroke-width", 1.5)
          });

    d3.select("#bubblechart").append("text")
        .attr("x", (diameter / 2))
        .attr("y", 0 - 0.1)
        .text("Aantal titels per artiest");


    // node.append("text")
    //         .attr("dy", ".2em")
    //         .style("text-anchor", "middle")
    //         .text(function(d) {
    //             return d.data["Artiest"].substring(0, d.r / 5);
    //         })
    //         .attr("font-family", "sans-serif")
    //         .attr("font-size", function(d){
    //             return d.r/10;
    //         })
    //         .attr("fill", "white");
    //
    // node.append("text")
    //     .attr("dy", "1.3em")
    //     .style("text-anchor", "middle")
    //     .text(function(d) {
    //         return d.data["AantalTitels"];
    //     })
    //     .attr("font-family",  "Gill Sans", "Gill Sans MT")
    //     .attr("font-size", function(d){
    //         return d.r/2;
    //     })
    //     .attr("fill", "white");

    // d3.select(self.frameElement)
    //     .style("height", diameter + "px");

  }

  // process data for bubble chart
  function createDataforBubblechart(data) {
    var dataforBubbleChart = []
    data.forEach(function(key, values) {
      dataforBubbleChart.push({
        Artiest : key['key'],
        AantalTitels : key['values'].length
      })
    })
    data = {"children" : dataforBubbleChart}
    return data
  }

  function getBiggestArtists(lijst) {

    var songsbyArtist = d3.nest()
        .key(function(d) {return d.Artiest; })
        .entries(lijst)

    songsbyArtist.sort(function(a, b) {
      var x = a['values'].length; var y = b['values'].length;
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    })

    data = songsbyArtist.slice(0, 10);

    return data
  };

  function listByArtist(lijst) {

    var songsbyArtist = d3.nest()
        .key(function(d) {return d.Artiest; })
        .entries(lijst)

    songsbyArtist.sort(function(a, b) {
      var x = a['values'].length; var y = b['values'].length;
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    })

    return songsbyArtist
  }

  function tabulate(data, columns) {
    var table = d3.select(".divtable").append("table")
        .attr("class", "table table-striped table-bordered");
    var header = table.append("thead").attr("class", "dark")
    var tbody = table.append("tbody")

    d3.select("thead").append('tr')
        .selectAll('th')
        .data(columns)
        .enter()
        .append('th')
          .text(function (column) { return column; });

    var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr');

    var cells = rows.selectAll('td')
    .data(function (row) {
      return columns.map(function (column) {
        return {column: column, value: row[column]};
      });
    })
    .enter()
    .append('td')
      .text(function (d) { return d.value; });

    return table;
  }

}; // sluting window onload function
