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
