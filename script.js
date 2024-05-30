const datasetURL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

const tooltip = d3.select('#tooltip');

const svgWidth = 800;
const svgHeight = 400;
const margin = { top: 20, right: 30, bottom: 50, left: 60 };
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

const svg = d3.select('#chart')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

const xScale = d3.scaleTime()
  .range([0, chartWidth]);

const yScale = d3.scaleLinear()
  .range([chartHeight, 0]);

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

d3.json(datasetURL)
  .then(data => {
    data.data.forEach(d => {
      d[0] = new Date(d[0]);
      d[1] = +d[1];
    });

    xScale.domain([d3.min(data.data, d => d[0]), d3.max(data.data, d => d[0])]);
    yScale.domain([0, d3.max(data.data, d => d[1])]);

    svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(${margin.left}, ${chartHeight + margin.top})`)
      .call(xAxis);

    svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(yAxis);

    svg.selectAll('.bar')
      .data(data.data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('data-date', d => d[0])
      .attr('data-gdp', d => d[1])
      .attr('x', d => xScale(d[0]) + margin.left)
      .attr('y', d => yScale(d[1]) + margin.top)
      .attr('width', chartWidth / data.data.length)
      .attr('height', d => chartHeight - yScale(d[1]))
      .on('mouseover', (event, d) => {
        tooltip.style('display', 'block')
          .attr('data-date', d[0])
          .html(`${d[0].toDateString()}<br>GDP: $${d[1].toFixed(2)} Billion`);
      })
      .on('mousemove', (event) => {
        tooltip.style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY}px`);
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
      });
  })
  .catch(error => console.error('Error loading data:', error));
