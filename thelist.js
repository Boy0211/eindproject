window.onload = function() {

  var year = 1999 // later vervangen voor een dropdown menu

  d3.tsv("../Data/2018.csv").then(function(data) {

    console.log(data);
    var songsbyYear = d3.nest()
        .key(function(d) {return d.Jaar; })
        .entries(data)

    sortByKey(songsbyYear, 'key')
    console.log(songsbyYear);

    var dataForBarChart = []
    songsbyYear.forEach(function(key, values) {
        console.log(key['key']);
        console.log(key['values'].length);
        // dataForBarChart[key['key']] = key['values'].length
        dataForBarChart.push({
          x : key['key'],
          y : key['values'].length
        })
    })
    console.log(dataForBarChart);
    drawBarChart(dataForBarChart)

    function drawBarChart(data) {

      // yearcsv = year + ".csv"

      var margin = {top: 50, right:50, bottom:50, left:50};
      var width = 1000
      var height = 600
      var barPadding = 1.2

      var svg = d3.select("body")
          .append("svg")
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

      var xAxis = d3.axisBottom(xScale)
      d3.select("svg")
          .append("g")
          .call(xAxis)
          .attr('transform', 'translate(' + margin.left + ',' + (height) + ')')

      var yAxis = d3.axisLeft(yScale)
      d3.select("svg")
          .append("g")
          .call(yAxis)
          .attr("transform", 'translate(' + margin.left + ',0)')

      d3.select("svg").selectAll('rect')
          .data(data)
          .enter()
          .append('rect')
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
          .attr("transform", "translate(" + margin.left + ",0)")
          .attr('fill', 'steelblue')












      // xScale.domain(data.map(function (d) {
      //     return d.key;
      // }));
      // console.log(songsbyYear.key);
      // // yScale.domain([0, d3.max(data['values'].length])




    }; //sluiten draw bar chart

  }); // sluting d3.tsv

  // function for sorting an object based on his keys
  function sortByKey(array, key) {
      return array.sort(function(a, b) {
          var x = a[key]; var y = b[key];
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
  };

} // sluting window onload function
