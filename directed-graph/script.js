function renderChart(data) {

  var width = window.innerWidth
  var height = window.innerHeight

  var chart = d3.select('#chart')
    .attr('height', height)
    .attr('width', width)

  var force = d3.layout.force()
    .size([width, height])
    .linkDistance(30)
    .charge(-100)
    .gravity(0.25)
    .nodes(data.nodes)
    .links(data.links)
    .on('tick', tick)

  var nodes = d3.selectAll('#flags')
    .data(data.nodes)
    .enter().append('img')
    .attr('class', function(d) { return "flag flag-" + d.code; })
    .call(force.drag)

  var links = chart.selectAll('.links')
    .data(data.links)
    .enter().append('line')
    .attr('class', 'links')
    .attr('stroke', 'black')

  function tick() {
    width = window.innerWidth
    height = window.innerHeight

    chart
      .attr('height', height)
      .attr('width', width)

    nodes
      .style('left', function(d) { return d.x + "px"; })
      .style('top', function(d) { return d.y + 60 + "px"; })

    links
      .attr('x1', function(d) { return d.source.x; })
      .attr('x2', function(d) { return d.target.x; })
      .attr('y1', function(d) { return d.source.y; })
      .attr('y2', function(d) { return d.target.y; })

    force.size([width, height]).resume()
  }

  force.start()

}

d3.json('https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json', function(data) {
  renderChart(data);
})