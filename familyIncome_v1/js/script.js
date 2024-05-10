import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let w = 1200;
let h = 800;
let xPadding = 70;
let yPadding = 70;

let viz = d3.select("#container")
  .append("svg")
    .attr("class", "viz")
    .attr("width", w)
    .attr("height", h)
    .style("background-color", "rgb(255,255,255)")
;

function gotData(incomingData){
  console.log(incomingData);
  
  let timeParser = d3.timeParse("%Y");
  let test = timeParser("2020");
  console.log(test)

  function mapFunction(datapoint){
    // datapoint.Year = timeParser(datapoint.Year);
    //console.log(datapoint.leonADDEDYEAR)
    let simplified_datapoint = {}
    // console.log(datapoint.fincome1)
    // datapoint.leonADDEDYEAR = timeParser(datapoint.leonADDEDYEAR)
    simplified_datapoint.leonADDEDYEAR = timeParser(datapoint.leonADDEDYEAR);
    simplified_datapoint.netIncome = parseFloat(datapoint.fincome1);
    if(datapoint.leonADDEDYEAR == 2012){
      simplified_datapoint.netIncome = parseFloat(datapoint.FINCOME1);
    }else if(datapoint.leonADDEDYEAR == 2010){
      // console.log(datapoint)
      simplified_datapoint.netIncome = parseFloat(datapoint.faminc_net);
      
    }
    return simplified_datapoint

  }
// let filteredDataWithTimeObjects = incomingData.map(mapFunction);

  console.log(filteredDataWithTimeObjects)

  function getYear(d,i){
    return d.leonADDEDYEAR
  }
  let minyear = d3.min(filteredDataWithTimeObjects, getYear )
  console.log(minyear)
  let maxyear = d3.max(filteredDataWithTimeObjects,getYear)
  console.log(maxyear)

  // let yearExtent = d3.extent(filteredDataWithTimeObjects,getYear)
  //x scale
  let xScale=d3.scaleTime().domain([minyear,maxyear]).range([xPadding, w-xPadding])
 
  //make group to contain axis
  let xAxisGroup = viz.append("g").attr("class","xAxisGroup");
  //build axis
  let xAxis = d3.axisBottom(xScale);
  //put the axis element into group
  
  xAxisGroup.call(xAxis);
  xAxisGroup.attr("transform", "translate(0, "+ (h-60) +")")

  //y scale
  function getIncome(d,i){
    return d.netIncome
  }
  let incomeExtent=d3.extent(filteredDataWithTimeObjects,getIncome)
console.log(incomeExtent)

let yScale = d3.scaleLinear().domain(incomeExtent).range([h-yPadding, yPadding])

let yAxisGroup = viz.append("g").attr("class","yAxisGroup");
let yAxis = d3.axisLeft(yScale);
yAxisGroup.call(yAxis);
yAxisGroup.attr("transform", "translate(70,0)")

// function getYearLabel(d, i) {
//   return d.leonADDEDYEAR.getFullYear();
// }

let datagroups = viz.selectAll(".datagroup")
        .data(filteredDataWithTimeObjects)
        .enter()
        .append("g")
        .attr("class", "datagroup");

    datagroups.append("circle")
        .attr("cx",0)
        .attr("cy",0)
        .attr("r", 10);

    // datagroups.append("text")
    //     .attr("class", "yearLabel")
    //     .attr("x", 10)
    //     .attr("y", 12)
    //     .text(getYearLabel);

function getGroupPosition(d, i) {
  let x = xScale(d.leonADDEDYEAR);
  let y = yScale(d.netIncome);
  // y = h-y
  return "translate(" + x + ", " + y + ")";
}

  datagroups.attr("transform", getGroupPosition)





  }


d3.json("family_100051.json").then(gotData);
