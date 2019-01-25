// geef constante variabelen mee voor het script
const widthPie = 700;
const heightPie = 400;
const radiusPie = Math.min(widthPie, heightPie) / 2;

// colorset, liefst pas ik deze nog aan zodat hij meegegeven wordt vanuit de main
var colorset = ["#3e92cc", "#2a628f", "#13293d", "#16324f", "#18435a"];
var color = d3.scaleOrdinal(colorset);

// creeër de arc voor de pie
var arc = d3.arc()
    .outerRadius(radiusPie * 0.8)
    .innerRadius(radiusPie * 0.40);

// creeër de arc voor de labels
var outerArc = d3.arc()
    .innerRadius(radiusPie * 0.9)
    .outerRadius(radiusPie * 0.9);

// het verkrijgen van de key uit de data
var key = function(d) { return d.data.key; };

// creeër de d3 pie
var pie = d3.pie()
    .sort(null)
    .value(function(d) { return d["values"].length;});

// voeg de d3 tip toe aan het svg element
var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<span><strong>Artiest: </strong>" +d.data.key + "<br><strong>Aantal titels: </strong>" + d.data.values.length + "</span>"
        });

// function voor het bepalen van de midangle
function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle)/2; };

/**
 * [Een functie voor het maken van de piechart.]
 * @param {[array]} lijst [een array met de top 10 artiesten en hun titels]
 */
function drawPieChart(lijst) {

  // maak een svg element voor de piechart
  var svg = d3.select("#piechart")
      .append("svg")
      .attr("class", "piechart")
      .attr("width", widthPie)
      .attr("height", heightPie)
    .append("g")
      .attr("transform", "translate(" + widthPie / 2 + "," + heightPie / 2 + ")");

  // voeg een g element toe voor de label
  svg.append("g")
    .attr("class", "labels");

  // voeg een g element toe voor de lijnen tussen de labels en de slices
  svg.append("g")
    .attr("class", "lines");

  // creeër de data aan de hand van de meegegeven lijst
  data = getBiggestArtists(lijst);

  // roep de d3 tip op
  svg.call(tip);

  // voeg de slices toe aan de pie
  // en voeg de d3 tip toe aan alle slices
  var path = svg.append("g")
      .attr("class", "slices")
      .datum(data).selectAll("path")
      .data(pie(data))
    .enter().append("path")
      .attr("fill", function(d, i) { return color(i); })
      .attr("d", arc)
      .attr("stroke", "#fff")
      .attr("stroke-width", "6px")
      .on("mouseover", function(d) {
          tip.show(d)
          d3.select(this)
            // .style("opacity", 0.8)
            .style("stroke-width", -20)
      })
      .on('mouseout', function(d){
          tip.hide(d);
          d3.select(this)
            .style("opacity", 1)
            .style("stroke-width", "6px")
      });

  var text = svg.select(".labels").selectAll("text")
      .data(pie(data), key)

  // het volgende stuk waarmee de labels zijn geplaatst is overgenomen en bewerkt aan de hand van het volgende voorbeeld:
  // http://bl.ocks.org/dbuezas/9306799
  text.enter()
      .append("text")
      .attr("dy", ".35em")
      .text(key)
      .transition()
      .duration(1000)
  		.attrTween("transform", function(d) {
  			this._current = this._current || d;
  			var interpolate = d3.interpolate(this._current, d);
  			this._current = interpolate(0);
  			return function(t) {
  				var d2 = interpolate(t);
  				var pos = outerArc.centroid(d2);
  				pos[0] = radiusPie * (midAngle(d2) < Math.PI ? 1 : -1);
  				return "translate("+ pos +")";
  			};
  		})
  		.styleTween("text-anchor", function(d){
  			this._current = this._current || d;
  			var interpolate = d3.interpolate(this._current, d);
  			this._current = interpolate(0);
  			return function(t) {
  				var d2 = interpolate(t);
  				return midAngle(d2) < Math.PI ? "start":"end";
  			};
  		});

  var polyline = svg.select(".lines").selectAll("polyline")
      .data(pie(data), key)

  polyline.enter()
      .append("polyline")
      .transition().duration(1000)
      .attrTween("points", function(d){
	        this._current = this._current || d;
	        var interpolate = d3.interpolate(this._current, d);
	        this._current = interpolate(0);
	        return function(t) {
      				var d2 = interpolate(t);
      				var pos = outerArc.centroid(d2);
      				pos[0] = radiusPie * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
      				return [arc.centroid(d2), outerArc.centroid(d2), pos];
			    };
		  });

}; //einde van het tekenen van de pie

/**
 * [Een functie voor het updaten van de piechart.]
 * @param {[array]} lijst [een array van alle jaren met hun hoeveelheid liedjes]
 */
function updatePieChart(lijst) {

  // get the data of meegegeven lijst
  data = getBiggestArtists(lijst["values"]);

  // selecteer de slices en geef ze nieuwe data mee
  var slices = d3.select(".piechart").select(".slices").selectAll("path")
      .data(pie(data))
      .transition()
      .duration(1000)
      .attr("fill", function(d, i) { return color(i); })
      .attr("d", arc);

  // variabele voor het selecteren en het binden van de data
  var text = d3.select(".piechart").select(".labels").selectAll("text")
      .data(pie(data), key)

  // ook voor dit gedeelte geldt dat het is overgenomen en bewerkt aan de hand van
  // de hierboven beschreven link.

  // enter en append als er te weinig text is
  text.enter()
      .append("text")
      .attr("dy", ".35em")
      .text(key)
      .transition()
      .duration(1000)
      .attrTween("transform", function(d) {
  			this._current = this._current || d;
  			var interpolate = d3.interpolate(this._current, d);
  			this._current = interpolate(0);
  			return function(t) {
  				var d2 = interpolate(t);
  				var pos = outerArc.centroid(d2);
  				pos[0] = radiusPie * (midAngle(d2) < Math.PI ? 1 : -1);
  				return "translate("+ pos +")";
  			};
  		})
  		.styleTween("text-anchor", function(d){
  			this._current = this._current || d;
  			var interpolate = d3.interpolate(this._current, d);
  			this._current = interpolate(0);
  			return function(t) {
  				var d2 = interpolate(t);
  				return midAngle(d2) < Math.PI ? "start":"end";
  			};
  		});

  // pas de bestaande text aan
  text
      .transition()
      .duration(1000)
      .text(key)
      .attrTween("transform", function(d) {
  			this._current = this._current || d;
  			var interpolate = d3.interpolate(this._current, d);
  			this._current = interpolate(0);
  			return function(t) {
  				var d2 = interpolate(t);
  				var pos = outerArc.centroid(d2);
  				pos[0] = radiusPie * (midAngle(d2) < Math.PI ? 1 : -1);
  				return "translate("+ pos +")";
  			};
  		})
  		.styleTween("text-anchor", function(d){
  			this._current = this._current || d;
  			var interpolate = d3.interpolate(this._current, d);
  			this._current = interpolate(0);
  			return function(t) {
  				var d2 = interpolate(t);
  				return midAngle(d2) < Math.PI ? "start":"end";
  			};
  		});

  // exit remove de text die teveel is
  text.exit()
      .remove()

  // variabele voor het selecteren en binden van de data
  var polyline = d3.select(".piechart").select(".lines").selectAll("polyline")
      .data(pie(data), key)

  // enter append indien er te weinig polylines zijn
  polyline.enter()
      .append("polyline")
      .transition().duration(1000)
      .attrTween("points", function(d){
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
              var d2 = interpolate(t);
              var pos = outerArc.centroid(d2);
              pos[0] = radiusPie * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
              return [arc.centroid(d2), outerArc.centroid(d2), pos];
          };
      });

  // pas de bestaande polylines aan
  polyline
      .transition().duration(1000)
      .attrTween("points", function(d){
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function(t) {
              var d2 = interpolate(t);
              var pos = outerArc.centroid(d2);
              pos[0] = radiusPie * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
              return [arc.centroid(d2), outerArc.centroid(d2), pos];
          };
      });

  // verwijder polylines die teveel zijn
  polyline.exit()
      .remove()
}; // einde van de update functie


/**
 * [Een functie voor het updaten van de barchart.]
 * @param {[array]} lijst [een array met alle lijsten onder elkaar]
 * @return {[array]} [lijst gesorteerd op artiest]
 */
function getBiggestArtists(lijst) {

  // nest de data gebasseerd op de artiest
  var songsbyArtist = d3.nest()
      .key(function(d) {return d.Artiest; })
      .entries(lijst);

  // sorteer deze data weer op grootte
  songsbyArtist.sort(function(a, b) {
    var x = a['values'].length; var y = b['values'].length;
    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
  });

  // Pak de bovenste 10
  data = songsbyArtist.slice(0, 10);

  // return de data
  return data;
};
