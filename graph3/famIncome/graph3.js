import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let w = 1200;
let h = 800;
let margin = { top: 50, right: 100, bottom: 100, left: 50 };

let viz = d3.select("#container")
  .append("svg")
  .attr("class", "viz")
  .attr("width", w)
  .attr("height", h)
  .style("background-color", "rgb(255 255 255)")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function gotData(incomingData) {
  console.log(incomingData);

  let incomeByFamily = {};

  incomingData.forEach(function (d) {
    let fid = d.fid10.value;
    let year = d.cyear.value;
    let income = parseFloat(d.fincome1.value);

    if (!isNaN(income)) {
      if (!incomeByFamily[fid]) {
        incomeByFamily[fid] = [];
      }

      let existingIndex = incomeByFamily[fid].findIndex(pair => pair[0] === year);
      if (existingIndex === -1) {
        incomeByFamily[fid].push([year, income]);
      } else {
        if (income > incomeByFamily[fid][existingIndex][1]) {
          incomeByFamily[fid][existingIndex][1] = income;
        }
      }
    }
  });

  console.log("Income by family:", incomeByFamily);

  let allIncomes = Object.values(incomeByFamily).flatMap(pair => pair.map(p => p[1]));
  let maxIncome = d3.max(allIncomes);

  let allYears = Object.values(incomeByFamily).flatMap(pair => pair.map(p => p[0]));
  let minYear = d3.min(allYears);
  let maxYear = d3.max(allYears);

  let colors = d3.scaleOrdinal(d3.schemeCategory10);

  let xScale = d3.scaleLinear()
    .domain([minYear, maxYear])
    .range([margin.left, w - margin.right]);

  let yScale = d3.scaleLinear()
    .domain([0, maxIncome])
    .range([h - margin.bottom, margin.top]);

  Object.keys(incomeByFamily).forEach((fid, index) => {
    let line = d3.line()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]));

    let path = viz.append("path")
      .datum(incomeByFamily[fid])
      .attr("fill", "none")
      .attr("stroke", colors(index))
      .attr("stroke-width", 2)
      .attr("d", line);

    let totalLength = path.node().getTotalLength();

    path.attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .delay(index * 500)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    let dot = viz.append("circle")
      .attr("cx", xScale(incomeByFamily[fid][0][0]))
      .attr("cy", yScale(incomeByFamily[fid][0][1]))
      .attr("r", 10)
      .style("fill", colors(index));

    dot.transition()
      .duration(2000)
      .delay(index * 500)
      .ease(d3.easeLinear)
      .attrTween("cx", function () {
        return function (t) {
          let l = path.node().getTotalLength();
          let p = path.node().getPointAtLength(t * l);
          return p.x;
        };
      })
      .attrTween("cy", function () {
        return function (t) {
          let l = path.node().getTotalLength();
          let p = path.node().getPointAtLength(t * l);
          return p.y;
        };
      });

    viz.append("text")
      .attr("x", xScale(incomeByFamily[fid][0][0]) + 8)
      .attr("y", yScale(incomeByFamily[fid][0][1]) - 8)
      .text(fid)
      .style("fill", colors(index))
      .style("font-size", "10px");
  });

  viz.append("g")
    .attr("transform", "translate(0," + (h - margin.bottom) + ")")
    .call(d3.axisBottom(xScale)
      .ticks(10)
      .tickFormat(d3.format("d"))
    );
  
  viz.append("g")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(d3.axisLeft(yScale));
}

d3.json("all_allyears.json").then(gotData);