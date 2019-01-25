const cc = 1999

window.onload = function() {

  var year = 1999 // later vervangen voor een dropdown menu
      // yearcsv = year + ".csv"
  var secondColorset = ["#A1C3D1", "#B39BC8", "#F0EBF4", "#F172A1", "#E64938"]
  var colorset = ["#59253A","#4E4E50","#6F2232","#950740","#C3073F"]

  d3.tsv("./Data/merged_list.tsv").then(function(data) {

    allLists = data
    songsbyList = d3.nest()
        .key(function(d) {return d.Lijst; })
        .entries(data)

    createDropdown(songsbyList)
    drawPieChart(songsbyList[(year-cc)].values)
    createTable(songsbyList[year-cc].values)
    drawBarChart(songsbyList[(year-cc)].values)
    drawBubbleChart(songsbyList[year-cc].values)
  }); // sluting d3.tsv

  d3.json("./Data/artiesten.json").then(function(data) {

    var temp = listByArtist(allLists)
    tableData = artistbyTitel(temp)
    data2 = data
    createautofill(data)

    var allData = processDataLineCharts(data[12])

    drawLineGraph("bestsong", allData.hoogsteNotering)
    drawLineGraph("meansong", allData.gemiddeldeNotering)
    drawLineGraph("worstsong", allData.laagsteNotering)



    createTableTitels(tableData[2])
    drawBarChart2(data[12])


  }); // sluting d3,json

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

function checkforartist(artist) {

  data2.forEach(function(d) {
    if (d.Artiest == artist) {
      getDataforLineGraphs(d)
      updateBarChart2(d)
    }
  });
  tableData.forEach(function(d) {
    if (d.Artiest == artist) {
      updateTableTitels(d)
    }
  });

  d3.select("#myInput")
    .attr("placeholder", artist)

};

function createautofill(data) {

  arrayArtists = [];
  data.forEach(function(key) {
    arrayArtists.push(key['Artiest'])
  });

  autocomplete(document.getElementById("myInput"), arrayArtists);
};

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              checkforartist(inp.value)
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}