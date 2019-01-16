const cc = 1999

window.onload = function() {

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
}; // sluting window onload function

function createDropdown(songsbyList) {

  var lists = []
  songsbyList.forEach(function(key, values) {
    lists.push(key['key'])
  });


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
