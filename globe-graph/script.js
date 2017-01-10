function renderChart(data) {

  var meteors = data.features;
  // var strictIsoParse = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");
  meteors.forEach( function(d) {
    d.properties.year = new Date(d.properties.year)
  })
  var height = 600;
  var width = 1000;
  var chart = d3.select('#chart').append('svg')
    .attr('height', height)
    .attr('width', width);
  var projection = d3.geoMercator()
    .scale(150)
    .translate([width / 2, height / 2])
    .precision(0.1)
  var path = d3.geoPath()
    .projection(projection);

  var getYear = d3.timeFormat("%Y")
  var tip = d3.tip()
    .attr('class', 'tooltip')
    .offset([0, 100])
    .html(function(d) {
      return '<div>' +
             '<h5>' + d.properties.name + '</h5>' +
             '<p><strong>Year:</strong> ' + d.properties.year.getFullYear() + '</p>' +
             '<p><strong>Mass:</strong> ' + d.properties.mass + '</p>' +
            //  '<p><strong>Lat:</strong> ' + d.properties.reclat + '</p>' +
            //  '<p><strong>Lon:</strong> ' + d.properties.reclong + '</p>' +
             '</div>'
    });

  chart.append('path')
    .datum(d3.geoGraticule())
    .attr('class', 'graticule')
    .attr('d', path);

  d3.json("https://gist.githubusercontent.com/abenrob/787723ca91772591b47e/raw/8a7f176072d508218e120773943b595c998991be/world-50m.json", function(world) {
    
    chart.insert('path', '.graticule')
      .datum(topojson.feature(world, world.objects.land))
      .attr('class', 'land')
      .attr('d', path);

    chart.insert('path', '.graticule')
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr('class', 'boundary')
      .attr('d', path);
    
    chart.selectAll('circle')
      .data(meteors).enter()
      .append('circle')
      .attr('class', 'meteor')
      .attr('r', function(d) {
        var mass = d.properties.mass;
        if (mass < 1000) { return 2; } 
        else if (mass < 100000) { return 3; } 
        else if (mass < 1000000) { return 7; }
        else if (mass < 10000000) { return 15; } 
        else { return 25; }
      })
      .attr('fill', function(d) {
        var mass = d.properties.mass;
        if (mass < 1000) { return "#64E500"; } 
        else if (mass < 100000) { return "#C3E100"; } 
        else if (mass < 1000000) { return "#DD9C00"; }
        else if (mass < 10000000) { return "#D93D00"; } 
        else { return "#D6001F"; }
      })
      .attr('transform', function(d) {
        return "translate(" + projection([d.properties.reclong, d.properties.reclat]) + ")";
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .call(tip)

  });
  
}

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json', function(data) {
  renderChart(data)
})