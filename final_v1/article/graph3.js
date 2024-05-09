import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let w = 1200;
let h = 800;
let margin = { top: 50, right: 100, bottom: 100, left: 50 };


let viz = d3.select("#viz3")
  .append("svg")
  .attr("class", "viz")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 "+w+" "+h)
  .style("background-color", "Transparent")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  let imageUrls = {
    fid1: "graph3-asset/family1.png",
    fid2: "graph3-asset/family2.png",
    fid3: "graph3-asset/family3.png"
  };

function gotData(incomingData) {
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

  let lineGenerator1 = d3.line()
    .x(d => xScale(d[0]))
    .y(d => yScale(d[1]))
    .curve(d3.curveMonotoneX);

  let lineGenerator2 = d3.line()
    .x(d => xScale(d[0]))
    .y(d => yScale(d[1]))
    .curve(d3.curveMonotoneX);

  let lineGenerator3 = d3.line()
    .x(d => xScale(d[0]))
    .y(d => yScale(d[1]))
    .curve(d3.curveMonotoneX);

  Object.keys(incomeByFamily).forEach((fid, index) => {
    let lineGenerator = index % 3 === 0 ? lineGenerator1 : index % 3 === 1 ? lineGenerator2 : lineGenerator3;
    
    let path = viz.append("path")
      .datum(incomeByFamily[fid])
      .attr("fill", "none")
      .attr("stroke", colors(index % 3))
      .attr("stroke-width", 4)
      .attr("d", lineGenerator)
      //.style("opacity",1)
  

    let totalLength = path.node().getTotalLength();

    path.attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .delay(index * 500)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    incomeByFamily[fid].forEach((d, idx) => {
      let imageUrl = imageUrls[fid]; 
      let dot = viz.append("image")
        .attr("x",xScale(d[0])-12)
        .attr("y", yScale(d[1])-12)
        .attr("width",20)
        .attr("height",20)
        .attr("xlink:href", imageUrl)
        .style("opacity", 1);

      dot.transition()
        .delay(index * 500 + idx * 100)
        .duration(500)
        .style("opacity", 1);
        
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
})
}

d3.json("graph3-data/all_allyears.json").then(gotData);
