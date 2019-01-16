// constante variabelen gebruikt door het hele script heen
const diameterBubble = 450;
const paddingBubble = 20;

// colorset, liefst pas ik deze nog aan zodat hij meegegeven wordt vanuit de main
var colorset = ["#59253A","#4E4E50","#6F2232","#950740","#C3073F"];
var color = d3.scaleOrdinal(colorset);

// var bubble waarin het maken van de bubbles is opgeslagen
var bubble = d3.pack()
    .size([diameterBubble, diameterBubble])
    .padding(1.5)

var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<span><strong>Artiest: </strong>" +d.data["Artiest"] + "<br><strong>Aantal titels: </strong>" + d.data["AantalTitels"] + "</span>"
        })

function drawBubbleChart(lijst) {

  temp_data = listByArtist(lijst)
  data = createDataforBubblechart(temp_data)

  var svg = d3.select("#bubblechart")
      .append("svg")
      .attr("width", diameterBubble + paddingBubble)
      .attr("height", diameterBubble + paddingBubble)
      .attr("class", "bubble");

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
      .attr("x", (diameterBubble / 2))
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
  //     .style("height", diameterBubble + "px");

}


function updateBubbleChart(lijst) {

  temp_data = listByArtist(lijst)
  data = createDataforBubblechart(temp_data)

  var svg = d3.select("#bubblechart").select(".bubble")

  svg.call(tip);

  var nodes = d3.hierarchy(data).sum(function(d) { return d.AantalTitels})

  var node = svg.selectAll(".node")
      .data(bubble(nodes)
      .descendants())

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
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d,i) { return color(i);})

  d3.select(".bubble").selectAll("circle")
      .on("mouseover", function(d, i) {
          if( i != 0) {
            tip.show(d)
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

  var right_list = []
  songsbyYear.forEach(function(key) {
    console.log(key);
    if (key["key"] == year) {
      right_list = key["values"]
    }
  })
  updateBubbleChart(right_list)
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
