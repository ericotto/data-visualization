function renderChart(dataset) {
  
  var data = dataset.monthlyVariance;
  data.map(function(d) {
    d.temp = (d.variance + dataset.baseTemperature).toFixed(2);
    d.tempF = (d.temp * 1.8 + 32).toFixed(2);
  })

  // Chart Setup
  var margin = { top: 50, right: 50, bottom: 100, left: 80};
  var height = 500 - margin.top -margin.bottom;
  var width = 1000 - margin.left - margin.right;
  var minYear = data[0].year;
  var maxYear = data[data.length - 1].year;
  var maxTemp = Math.max.apply(Math, data.map( function(d) { 
    return d.temp;
  }))
  var minTemp = Math.min.apply(Math, data.map( function(d) { 
    return d.temp;
  }))
  var colors = ['#002FE5', '#1C2BCD', '#3827B5', '#55249D',
                '#712085', '#8D1D6E', '#AA1956', '#C6163E',
                '#E21226', '#FF0F0F'];
  var xScale = d3.scaleLinear()
    .domain([minYear, maxYear])
    .range([0, width])
  var yScale = d3.scaleLinear()
    .domain([1, 12])
    .range([0, height])
  var colorScale = d3.scaleQuantile()
    .domain([minTemp, maxTemp])
    .range(colors)
  var chart = d3.select('#chart')
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.right + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // Tooltip
  var parseDate = d3.timeParse("%m %Y")
  var formatDate = d3.timeFormat("%B %Y")
  var tip = d3.tip()
    .attr('class', 'tooltip')
    .offset(function(d) {
      return d.month < 7 ? [125, 0] : [-10, 0]
    })
    .html(function(d) {
      return "<div>" +
             "<p>" + formatDate(parseDate(d.month + " " + d.year)) + "</p>" +
             "<p>" + d.temp + "° C</p>" +
             "<p>" + d.tempF + "° F</p>" +
             "</div>"
    })

  // Chart Bars
  chart.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', function(d) {
      return xScale(d.year)
    })
    .attr('y', function(d) {
      return yScale(d.month)
    })
    .attr('width', Math.ceil(width / (maxYear - minYear)))
    .attr('height', Math.ceil(height / 12))
    .attr('fill', function(d) {
      return colorScale(d.temp)
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    .call(tip)

  // X-Axis
  var xAxis = d3.axisTop(xScale)
    .tickFormat(d3.format('d'))
    .tickSizeOuter(0)
  chart.append('g').call(xAxis)

  // Y-Axis
  var months = [ "January", "February", "March", "April", 
                 "May", "June", "July", "August", "September", 
                 "October", "November", "December"];
  chart.selectAll('.month')
    .data(months)
    .enter()
    .append('text')
    .attr('x', -5)
    .attr('y', function(d, i) {
      return yScale(i) + margin.top + 5;
    })
    .style('text-anchor', 'end')
    .attr('class', 'month')
    .text(function(d) {
      return d;
    })

  // Legend
  chart.selectAll('.legend-color')
    .data(colors)
    .enter()
    .append('rect')
    .attr('x', function(d, i) {
      return 500 + (i * 30)
    })
    .attr('y', height + 50)
    .attr('width', 30)
    .attr('height', 20 )
    .attr('fill', function(d) {
      return d;
    })
    .attr('class', 'legend-color')
  chart.selectAll('.legend-text')
    .data(colorScale.quantiles())
    .enter()
    .append('text')
    .attr('x', function(d, i) {
      return 500 + (i * 33)
    })
    .attr('y', height + 90)
    .text(function(d) {
      return d.toFixed(1);
    })
  

}

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', function(data) {
  renderChart(data);
})