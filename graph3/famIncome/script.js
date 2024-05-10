import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let w = 1200;
let h = 800;
let margin = { top: 50, right: 100, bottom: 100, left: 50 };

let viz = d3.select("#container")
  .append("svg")
  .attr("class", "viz")
  .attr("width", w)
  .attr("height", h)
  .style("background-color", "rgb(228 228 233)")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function gotData(incomingData) {
  console.log(incomingData);


  //clearing out everything here :))
//fid: 130094, 130299, 10533
// let selectedFamilyId = 130299;
// let selectedFamilyData = incomingData.filter(d => d.fid10.value === selectedFamilyId.toString());

let incomeByFamily = {}

incomingData.forEach(function (d) {
  let fid = d.fid10.value;
  let year = d.cyear.value;
  let income = parseFloat(d.fincome1.value);

  // Check if income is a valid number
  if (!isNaN(income)) {
    // If the family ID doesn't exist in incomeByFamily, create a new entry
    if (!incomeByFamily[fid]) {
      incomeByFamily[fid] = [];
    }

    let existingIndex = incomeByFamily[fid].findIndex(pair => pair[0] === year);
    if (existingIndex === -1) {
      // If the year doesn't exist for the family, add a new entry
      incomeByFamily[fid].push([year, income]);
    } else {
      // If the year exists, update the income if it's higher
      if (income > incomeByFamily[fid][existingIndex][1]) {
        incomeByFamily[fid][existingIndex][1] = income;
      }
    }
  }
});

console.log("Income by family:", incomeByFamily);

  //console.log(incomeByFamily);

  // accessing income array for a specific family (e.g., family with fid10 = 130094)
  console.log("Income array for family 130094:", incomeByFamily[130094]);
  console.log("Income array for family 130299:", incomeByFamily[130299]);
  console.log("Income array for family 130533:", incomeByFamily[130533]);

  let allIncomes = incomeByFamily.map(pair => pair[1]);
  let maxIncome = d3.max(allIncomes);

  let allYears = incomeByFamily.map(pair => pair[0]);
  let minYear = d3.min(allYears);
  let maxYear = d3.max(allYears);

  let colors = d3.scaleOrdinal(d3.schemeCategory10);


  // x scale
  let xScale = d3.scaleLinear()
    .domain([minYear, maxYear])
    .range([margin.left, w - margin.right]);

  // y scale
  let yScale = d3.scaleLinear()
    .domain([0, maxIncome])
    .range([h - margin.bottom, margin.top]);

  
  // Lines
 // Object.keys(incomeByFamily[selectedFamilyId]).forEach((fid, index) => {
    let line = d3.line()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]));

    let path = viz.append("path")
      .datum(incomeByFamily)
      .attr("fill", "none")
      .attr("stroke", colors(index))
      .attr("stroke-width", 2)
      .attr("d", line);

   let totalLength = path.node().getTotalLength();

    //animation here
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
      .style("fill", colors(index)); // the same as the line color

    dot.transition()
      .duration(2000)
      .delay(index * 500) // delay
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

  
  // x axis
  viz.append("g")
    .attr("transform", "translate(0," + (h - margin.bottom) + ")")
    .call(d3.axisBottom(xScale)
      .ticks(10)
      .tickFormat(d3.format("d"))
    );
  
  // y axis
  viz.append("g")
    .attr("transform", "translate(" + margin.left + ",0)")
    .call(d3.axisLeft(yScale));

}



d3.json("all_allyears.json").then(gotData);
