// variabele die wordt afgetrokken van een geselecteerd jaar om een optie
// van een lijst te selecteren
const differenceListandYear = 1999

// wanneer de window geladen wordt doe het volgende:
window.onload = function() {

  // de openings variabele. De pagina opent met de lijst van 1999
  var year = 1999

  // het openen van de merged_list voor het maken van het eerste gedeelte van de pagina
  d3.tsv("./Data/merged_list.tsv").then(function(data) {

    // het maken van een globale variabele van de data
    allLists = data

    // nest de data per lijst
    songsbyList = d3.nest()
        .key(function(d) {return d.Lijst; })
        .entries(data)

    // het maken van een dropdown menu voor de update van alle grafieken.
    createDropdown(songsbyList)

    // Met de volgende functies worden de grafieken gemaakt
    drawPieChart(songsbyList[(year-differenceListandYear)].values)
    createTable(songsbyList[year-differenceListandYear].values)
    drawBarChart(songsbyList[(year-differenceListandYear)].values)
    drawBubbleChart(songsbyList[year-differenceListandYear].values)

  }); // sluting d3.tsv

  // het openen van een json per artiest
  d3.json("./Data/artiesten.json").then(function(data) {

    // door gebruik te maken van een globale variabele wordt de tabledata gemaakt
    var temp = listByArtist(allLists)
    tableData = artistbyTitel(temp)

    // het opslaan van de data in een globale variabele
    data2 = data

    // het maken van de autofill voor de zoekopties
    createautofill(data)

    // process de data voor de linecharts
    var allData = processDataLineCharts(data[12]) // data[12] is de artiest Abba als start

    // het tekenen van de drie linegraphs
    drawLineGraph("bestsong", allData.hoogsteNotering)
    drawLineGraph("meansong", allData.gemiddeldeNotering)
    drawLineGraph("worstsong", allData.laagsteNotering)

    // het maken van de tabel
    createTableTitels(tableData[2]) //tableData[2] is wederom Abba

    // het maken van de barchart
    drawBarChart2(data[12]) //data[12] is Abba

  }); // sluting d3,json

}; // sluting window onload function

/**
 * [Dropdown selectie functie voor het updaten vand de grafieken]
 * @param {[array]} songsbyList [een array met daarin de songs per lijst]
 */
function createDropdown(songsbyList) {

  // selecteer de dropdown
  var select = d3.select('#inlineFormCustomSelect')
      .on('change',onchange);

  // wanneer er een jaar wordt geselecteerd bij de dropdown
  function onchange() {

    // sla de geselecteerde value op in een variabele
  	var selectValue = d3.select('select').property('value')

    // update alle functies met betrekking tot de dropdown.
    updateTable(songsbyList[selectValue-differenceListandYear].values)
    updatePieChart(songsbyList[selectValue-differenceListandYear])
    updateBarChart(songsbyList[(selectValue-differenceListandYear)].values)
    updateBubbleChart(songsbyList[selectValue-differenceListandYear].values)
  };
}; // sluiting dropdown

/**
 * [functie voor het updaten van het tweede segment (over de artiest) van de pagina]
 * @param {[array]} artist [een array met daarin de songs per lijst]
 */
function checkforartist(artist) {

  // selecteer de button welke de window naar het artiesten gedeelte verplaatst
  document.getElementById("buttonArtist").click()

  // pas de titel van de 2de pagina aan
  d3.select("#theartist")
      .select("h1")
      .text(artist)

  // wacht een periode voordat de functies zich aanpassen zodat de window al verplaatst is
  // naar het artiesten gedeelte.
  setTimeout(function() {
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

      // pas de placeholder van de zoekbalk aan zodat je ziet om welke artiest het gaat
      d3.select("#myInput")
        .attr("placeholder", artist)
  }, 500)
};

/**
 * [functie voor het aanvullen van de searchbalk, hier wordt de goede data geselecteerd]
 * @param {[array]} data [een array met daarin de songs per lijst]
 */
function createautofill(data) {

  arrayArtists = [];
  data.forEach(function(key) {
    arrayArtists.push(key['Artiest'])
  });

  autocomplete(document.getElementById("myInput"), arrayArtists);
};

/**
 * [Dropdown selectie functie voor het updaten vand de grafieken]
 * @param {[string]} inp [input in de searchbalk]
 * @param {[array]} arr [een array met daarin de songs per lijst]
 */
function autocomplete(inp, arr) {

  //  De searchbalk is overgenomen en aangepast aan de hand van het voorbeeld
  //  van weschools.

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
};
