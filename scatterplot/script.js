function renderChart(data) {
  var dataset = data;

  // Chart Setup
  var margin = { top: 50, right: 50, bottom: 50, left: 50 };
  var height = 500 - margin.top - margin.bottom;
  var width = 800 - margin.left - margin.right;
  var maxTime = dataset[dataset.length - 1].Seconds;
  var minTime = dataset[0].Seconds;
  var xScale = d3.scaleLinear()
    .domain([maxTime + 10, minTime - 10])
    .range([0, width]);
  var yScale = d3.scaleLinear()
    .domain([0, 37])
    .range([0, height]);
  var chart = d3.select('#chart')
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.right + margin.left)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // Tooltip
  var tip = d3.tip()
    .attr('class', 'tooltip')
    .offset(function (dataPoint) {
      return dataPoint.Place > 9 ? [0, 75] : [100, -50]
    })
    .html(function (dataPoint) {
      return "<div>" +
        "<p>Name: " + dataPoint.Name + "</p>" +
        "<p>Country: " + dataPoint.Nationality + "</p>" +
        "<p>Ascent Time: " + dataPoint.Time + "</p>" +
        "<p>Year: " + dataPoint.Year + "</p>" +
        "</div>";
    })

  // DataPoints
  chart.selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('cx', function (dataPoint) {
      return xScale(dataPoint.Seconds);
    })
    .attr('cy', function (dataPoint) {
      return yScale(dataPoint.Place);
    })
    .attr('r', 5)
    .attr('fill', function (dataPoint) {
      return dataPoint.Doping === "" ? "green" : "red";
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    .call(tip)

  // X-Axis
  var xAxis = d3.axisBottom(xScale)
    .tickSizeOuter(0)
    .tickValues([2380, 2360, 2340, 2320, 2300, 2280, 2260, 2240, 2220, 2200]);
  chart.append('g').call(xAxis);
  chart.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', "translate(-15," + (height / 2) + ")rotate(-90)")
    .text('Rank')

  // Y-Axis
  var yAxis = d3.axisRight(yScale)
    .tickSizeOuter(0)
    .tickValues([5, 10, 15, 20, 25, 30, 35]);
  chart.append('g').call(yAxis);
  chart.append('text')
    .attr('text-anchor', 'middle')
    .attr('transform', "translate(" + (width / 2) + "," + height + ")")
    .text("Seconds to Ascend Alpe d'Huez")

  // Legend
  chart.append('rect')
    .attr('x', width)
    .attr('y', (height/2) - 10)
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', 'red')
  chart.append('text')
    .attr('x', width - 100)
    .attr('y', (height/2))
    .attr('text-anchor', 'right')
    .attr('class', 'legend')
    .text('Alleged Doping')
  chart.append('rect')
    .attr('x', width)
    .attr('y', (height/2) + 10)
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', 'green')
  chart.append('text')
    .attr('x', width - 45)
    .attr('y', (height/2) + 20)
    .attr('text-anchor', 'left')
    .attr('class', 'legend')
    .text('Clean')

}

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', function (data) {
  renderChart(data);
});