// constante variabelen gebruikt door het hele script heen
const diameterBubble = 450;
const paddingBubble = 20;

// colorset, liefst pas ik deze nog aan zodat hij meegegeven wordt vanuit de main
var colorset = ["#59253A","#4E4E50","#6F2232","#950740","#C3073F"];
var color = d3.scaleOrdinal(colorset);

// var bubble waarin het maken van de bubbles is opgeslagen
var bubble = d3.pack()
    .size([diameterBubble, diameterBubble])
    .padding(1.5);


// functie voor het maken van de bubblechart
function drawBubbleChart(lijst) {

  // processen van de data zodat het gebruikt kan worden voor een bubblechart
  temp_data = listByArtist(lijst);
  data = createDataforBubblechart(temp_data);

  // svg variabele voor het selecteren van de juiste html element
  var svg = d3.select("#bubblechart")
      .append("svg")
      .attr("width", diameterBubble + paddingBubble)
      .attr("height", diameterBubble + paddingBubble)
      .attr("class", "bubble");

  // variabele waarin de tip is opgeslagen
  var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return "<span><strong>Artiest: </strong>" +d.data["Artiest"] + "<br><strong>Aantal titels: </strong>" + d.data["AantalTitels"] + "</span>"
          });

  // voeg de tip toe aan het svg element
  svg.call(tip);

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
        ;})
        .on('mouseout', function(d,i) {
            if( i != 0) {
              tip.hide(d)
              d3.select(this)
                .style("opacity", 0.8)
                .style("stroke","#222629")
                .style("stroke-width", 1.5)
            }
        ;});


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

};

// functie voor het updaten van de bubblechart
function updateBubbleChart(lijst) {

  // process de data zo dat het nuttig is voor de bubblechart
  temp_data = listByArtist(lijst);
  data = createDataforBubblechart(temp_data);

  // selecteer het svg element van de barchart
  var svg = d3.select("#bubblechart").select(".bubble")

  // variabele waarin de tip is opgeslagen
  var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
            return "<span><strong>Artiest: </strong>" +d.data["Artiest"] + "<br><strong>Aantal titels: </strong>" + d.data["AantalTitels"] + "</span>"
          });

  // roep de tip op
  svg.call(tip);

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

  // pas de huidige nodes aan
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

  // voeg nodes toe indien nodig
  node.enter().append("circle")
      .transition()
      .duration(1000)
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d,i) { return color(i);})

  // select alle bubbles en laat ze weer reageren op de d3-tip
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
