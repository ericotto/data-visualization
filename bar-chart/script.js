function renderChart(data) {
  var dataset = data.data;

  // Data Cleaning
  // http://stackoverflow.com/questions/17721929/date-format-in-d3-js
  var parseDate = d3.timeParse("%Y-%m-%d");
  dataset.forEach( function(d) {
    d[0] = parseDate(d[0]);
  });

  // Chart Size
  var height = 450;
  var width = 1000;
  var xScale = d3.scaleTime()
                 .domain([dataset[0][0], dataset[dataset.length - 1][0]])
                 .range([0, width]);
  var yScale = d3.scaleLinear()
                 .domain([0, dataset[dataset.length - 1][1]])
                 .range([height, 0]);
  var chart = d3.select('#chart')
                .append('svg')
                .attr('height', height)
                .attr('width', width);

  // Tooltip
  var formatDate = d3.timeFormat("%B %Y");
  var formatCurrency = d3.format("($.2f");
  var tip = d3.tip()
              .attr('class', 'tooltip')
              .offset(function(d) {
                return d[0].getFullYear() < 2000 ? [0, 50] : [100, -50];
              })
              .html(function(d) {
                return "<div>" +
                       "<p>" + formatDate(d[0]) + "</p>" +
                       "<p>" + formatCurrency(d[1]) + "</p>" +
                       "</div>";
              });

  // Bars
  chart.selectAll('rect')
       .data(dataset)
       .enter()
       .append('rect')
       .attr('class', 'bar')
       .attr('x', function(d) {
         return xScale(d[0]);
       })
       .attr('y', function(d) {
         return yScale(d[1]);
       })
       .attr('height', function(d) {
         return height - yScale(d[1]);
       })
       .attr('width',  Math.ceil(width / dataset.length))
       .on('mouseover', tip.show)
       .on('mouseout', tip.hide)
       .call(tip);

  // X-Axis
  var xAxis = d3.axisBottom(xScale).ticks(5);
  chart.append('g').call(xAxis);

  // Y-Axis
  var yAxis = d3.axisRight(yScale).ticks(5);
  chart.append('g').call(yAxis);

}

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(data) {
  renderChart(data);
});
