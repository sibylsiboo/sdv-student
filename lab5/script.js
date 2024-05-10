import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let w = 1200;
let h =800

let viz = d3.select("#container")
  .append("svg")
     .attr("class", "viz")
     .attr("width", w)
     .attr("height", h)
     .style("background-color", "rgb(104 106 171)")

function gotData(incomingData){
    console.log(incomingData);

function filterFunction(datapoint){
  if(datapoint.Code == "CN"){
    return true
  }else{
    return false
  }
    
}
let filtered data = incomingData.filter(filterFunction)
}

let timeParser = d3.timeParse("%Y");
//let test = timeParser("2011");
//console.log(test)

function mapFunction(datapoint){
  datapoint.Year = timeParser(datapoint.Year);
  return datapoint
}

let filteredDataWithTimeObjects = filteredData.map(mapfunction);
console.log(filteredDataWithTimeObjects)

let datagroups = viz.selectAll(".datagroup").data(filtereddatawithTimeObjects).enter()
   .append("g")
   .attr("class", "datagroup")

datagroups.append("circle")
    .attr("cx", 0)
    .attr("cy")
d3.csv("new-cases-of-hiv-infection.csv").then(gotData)