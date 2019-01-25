// constante variabelen gebruikt door het hele script heen
const diameterBubble = 450;
const paddingBubble = 20;

// colorset, liefst pas ik deze nog aan zodat hij meegegeven wordt vanuit de main
var colorset = ["#3e92cc", "#2a628f", "#13293d", "#16324f", "#18435a"];
var color = d3.scaleOrdinal(colorset);

// var bubble waarin het maken van de bubbles is opgeslagen
var bubble = d3.pack()
    .size([diameterBubble, diameterBubble])
    .padding(1.5);

// variabele waarin de tip is opgeslagen
var bubbletip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 30])
        .html(function(d) {
          return "<span><strong>Artiest: </strong>" +d.data["Artiest"] + "<br><strong>Aantal titels: </strong>" + d.data["AantalTitels"] + "</span>"
        });

/**
 * [Een functie voor het tekenen van de bubblechart.]
 * @param {[array]} lijst [een array van alle artiesten met hun liedjes]
 */
function drawBubbleChart(lijst) {

  // processen van de data zodat het gebruikt kan worden voor een bubblechart
  var temp_data = listByArtist(lijst);
  var data = createDataforBubblechart(temp_data);

  // svg variabele voor het selecteren van de juiste html element
  var svg = d3.select("#bubblechart")
      .append("svg")
      .attr("width", diameterBubble + (paddingBubble * 3))
      .attr("height", diameterBubble + paddingBubble)
      .attr("id", "bubbleblock")
    .append("g")
      .attr("class", "bubblechart");

  // voeg de tip toe aan het svg element
  svg.call(bubbletip);

  // creeër de nodes en voeg de data toe
  var nodes = d3.hierarchy(data)
      .sum(function(d) { return d.AantalTitels });

  // creeër voor elk element een node en plaats deze in de svg
  // negeer de eerste node (overkoepelende element)
  var node = svg.selectAll(".node")
        .data(bubble(nodes).descendants())
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d,i) {
          if( i == 0) {
            return "#fff"
          }
          return color(i);})
        .on("mouseover", function(d,i) {
            if( i != 0) {
              bubbletip.show(d)
              d3.select(this)
                .style("opacity", 1)
                .style("stroke","#fff")
                .style("stroke-width", 3)
            }
        ;})
        .on('mouseout', function(d,i) {
            if( i != 0) {
              bubbletip.hide(d)
              d3.select(this)
                .style("opacity", 0.8)
                .style("stroke","#fff")
                .style("stroke-width", 1.5)
            }
        ;})
        .on("click", function(d) { checkforartist(d.data.Artiest); });
};

/**
 * [Een functie voor het updaten van de bubblechart.]
 * @param {[array]} lijst [een array van alle artiesten met hun liedjes]
 */
function updateBubbleChart(lijst) {

  // process de data zo dat het nuttig is voor de bubblechart
  var temp_data = listByArtist(lijst);
  var data = createDataforBubblechart(temp_data);

  // selecteer het svg element van de barchart
  var svg = d3.select("#bubblechart").select(".bubblechart")

  // roep de tip op
  svg.call(bubbletip);

  // voeg de data toe aan de nodes
  var nodes = d3.hierarchy(data)
      .sum(function(d) { return d.AantalTitels});

  // voeg de data toe aan elke node
  var node = svg.selectAll(".node")
      .data(bubble(nodes)
      .descendants())

  // verwijder nodes die teveel zijn
  node.exit().remove()
      .transition()
      .duration(1000)

  // voeg nodes toe indien nodig
  node.enter().append("circle")
      .attr("class", "node")
      .style("fill", "#fff")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .merge(node)
      .transition()
      .duration(1000)
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d,i) {
        if( i == 0) {
          return "#fff"
        }
        return color(i);})

  d3.select("#bubblechart").selectAll("circle")
      .on("mouseover", function(d, i) {
        if( i != 0) {
          bubbletip.show(d)
          d3.select(this)
            .style("opacity", 1)
            .style("stroke","#fff")
            .style("stroke-width", 3)
        }
      })
      .on('mouseout', function(d){
          bubbletip.hide(d);
          d3.select(this)
            .style("opacity", 1)
            .style("stroke","#fff")
            .style("stroke-width", 1.5)
      })
      .on("click", function(d) { checkforartist(d.data.Artiest); });
};
