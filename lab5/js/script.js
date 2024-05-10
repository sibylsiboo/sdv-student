import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let w = 1200;
let h = 800;

let viz = d3.select("#container")
  .append("svg")
    .attr("class", "viz")
    .attr("width", w)
    .attr("height", h)
    .style("background-color", "rgb(104 106 171)")
;

function gotData(incomingData){
  console.log(incomingData);



}


d3.csv("new-cases-of-hiv-infection.csv").then(gotData);
