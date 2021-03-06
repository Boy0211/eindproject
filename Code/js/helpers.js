/**
 * [functie nests en sorteert de lijst per artiest]
 * @param {[array]} lijst [een array met daarin de songs per lijst]
 * @return {[array]} [lijst van alle artiesten met hun songs]
 */
function listByArtist(lijst) {

  // nest de data per artiest
  var songsbyArtist = d3.nest()
      .key(function(d) {return d.Artiest; })
      .entries(lijst);

  // sorteer de lijst op grootte van het aantal liedjes
  songsbyArtist.sort(function(a, b) {
    var x = a['values'].length; var y = b['values'].length;
    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
  });

  // return de lijst
  return songsbyArtist;
};

/**
 * [functie nests en sorteert de lijst per artiest]
 * @param {[array]} data [een array met daarin de songs per lijst]
 * @return {[array]} [lijst van alle artiesten met hun songs, als toevoeging een children dict]
 */
function createDataforBubblechart(data) {

  // maak een lege lijst
  var dataforBubbleChart = [];

  // voor elk datapunt sla de artiest en het aantal titels op
  data.forEach(function(key, values) {
    dataforBubbleChart.push({
      Artiest : key['key'],
      AantalTitels : key['values'].length
    })
  });

  // sla de data op in een associative array
  data = {"children" : dataforBubbleChart}

  // return de data
  return data
};

/**
 * [functie nests en sorteert de lijst per artiest uit een jaar]
 * @param {[array]} listByYears [een array met daarin de songs per year]
 * @param {[int]} year [een integer welke aangeeft op welke jaar geselecteerd moet worden ]
 * @return {[array]} [lijst van alle artiesten uit dat jaar met hun songs]
 */
function dataYearBubbleChart(listByYears, year) {

  // nest de data per jaar dat het is uitgebracht
  var songsbyYear = d3.nest()
      .key(function(d) {return d.Jaar; })
      .entries(listByYears);

  // sorteer deze weer op chronologische volgorde
  songsbyYear.sort(function(a, b) {
    var x = a['key']; var y = b['key'];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });

  // maak een lege lijst
  var right_list = [];

  // sla de key en de juiste data op in songsbyYear
  songsbyYear.forEach(function(key) {
    console.log(key);
    if (key["key"] == year) {
      right_list = key["values"]
    }
  });

  // update de bubblechart
  updateBubbleChart(right_list);
};

/**
 * [functie nests en sorteert de lijst per jaar]
 * @param {[array]} lijst [een array met daarin de songs per lijst]
 * @return {[array]} [lijst van alle jaren met het aantal songs]
 */
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

/**
 * [functie nests en sorteert de lijst per artiest per song]
 * @param {[array]} lijst [een array met daarin de songs per lijst]
 * @return {[array]} [lijst van alle artiesten met hun songs bedoeld voor de tweede barchart]
 */
function artistbyTitel(lijst) {

  var nestedsongsAll = []
  lijst.forEach(function(artiest) {
    var nestedsongs = d3.nest()
        .key(function(d) {return d.Titel; })
        .entries(artiest.values);

    var titelnames = []
    nestedsongs.forEach(function(titel) {
      titelnames.push({
        Naam: titel.key,
        Jaar: titel.values[0].Jaar});
    })
    nestedsongsAll.push({
      Artiest: artiest.key,
      Titels: titelnames
    })
  })

  return nestedsongsAll;
};
