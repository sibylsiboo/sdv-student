import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let w = 1200;
let h = 800;
let xPadding = 150;
let yPadding = 70;
let fid10s;

let viz = d3.select("#container")
  .append("svg")
  .attr("class", "viz")
  .attr("width", w)
  .attr("height", h)
  .style("background-color", "rgb(255,255,255)")
  ;

function gotData(incomingData) {
  console.log(incomingData);



  let timeParser = d3.timeParse("%Y");
  let test = timeParser("2020");
  console.log(test)

  function mapFunction(datapoint) {


    if ("cyear" in datapoint) {
      datapoint.cyear = timeParser(parseInt(datapoint.cyear));
    } else if ("CYEAR" in datapoint) {
      datapoint.cyear = timeParser(parseInt(datapoint.CYEAR));
    }
    let year = datapoint.cyear.getFullYear()
    // simplified_datapoint.cyear = timeParser( parseInt(datapoint.cyear) );
    datapoint.fid = parseInt(datapoint.fid)

    datapoint.edu = parseFloat(datapoint.EEC);
    //if (year >= 2014 && year >=2018 ) {
    if (year == 2014) {
      console.log(datapoint)
      datapoint.edu = parseFloat(datapoint.eec);
    } //else if (year == 2016) {
    //    console.log(datapoint)
    //    datapoint.edu = parseFloat(datapoint.eec);

    // }else if(year == 2018){
    //   datapoint.edu = parseFloat(datapoint.eec)
    // }
    return datapoint

  }

  let filteredDataWithTimeObjects = incomingData.map(mapFunction);
  filteredDataWithTimeObjects = filteredDataWithTimeObjects.filter(d => !isNaN(d.edu))
  console.log(filteredDataWithTimeObjects)

  fid10s = [];
  for (let i = 0; i < filteredDataWithTimeObjects.length; i++) {
    let fid = filteredDataWithTimeObjects[i].fid10;
    if (!fid10s.includes(fid)) {
      fid10s.push(fid);
    }
  }
  console.log(fid10s);


  // optional；
  // 130094.0-3; 130299.0-7 130533.0-11
  // show just one family:
  let famidx = 7;
  filteredDataWithTimeObjects = filteredDataWithTimeObjects.filter(d => d.fid10 == fid10s[famidx])


  function getFamilyIdx(fid) {
    for (let i = 0; i < familyGroups.length; i++) {
      console.log(familyGroups[i], i, fid, familyGroups[i].includes(fid))
      if (familyGroups[i].includes(fid)) {

        return i
      }
    }
  }

  let getFamilyColor = d3.scaleOrdinal(fid10s, d3.schemeTableau10)





  function getYear(d, i) {
    return d.cyear
  }
  let minyear = d3.min(filteredDataWithTimeObjects, getYear)
  console.log(minyear)
  let maxyear = d3.max(filteredDataWithTimeObjects, getYear)
  console.log(maxyear)

  // let yearExtent = d3.extent(filteredDataWithTimeObjects,getYear)
  //x scale
  let xScale = d3.scaleTime().domain([minyear, maxyear]).range([xPadding, w - xPadding])

  //make group to contain axis
  let xAxisGroup = viz.append("g").attr("class", "xAxisGroup");
  //build axis
  let xAxis = d3.axisBottom(xScale);
  //put the axis element into group

  xAxisGroup.call(xAxis);
  xAxisGroup.attr("transform", "translate(0, " + (h - 60) + ")")

  //y scale
  function getEdu(d, i) {
    return d.edu
  }
  let eduExtent = d3.extent(filteredDataWithTimeObjects, getEdu)
  console.log(eduExtent)

  let yScale = d3.scaleLinear().domain(eduExtent).range([h - yPadding, yPadding])

  let yAxisGroup = viz.append("g").attr("class", "yAxisGroup");
  let yAxis = d3.axisLeft(yScale);
  yAxisGroup.call(yAxis);
  yAxisGroup.attr("transform", "translate(70,0)")

  // // function getYearLabel(d, i) {
  // //   return d.leonADDEDYEAR.getFullYear();
  // // }

  let datagroups = viz.selectAll(".datagroup")
    .data(filteredDataWithTimeObjects)
    .enter()
    .append("g")
    .attr("class", "datagroup");

  let circles  = datagroups.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 5)
    .attr("fill", getColor);

  function getColor(d, i) {
    // console.log(getFamilyIdx(d.fid))
    return getFamilyColor(d.fid10)


  }
  //return "red"

  function getFID(d, i) {
    return d.fid10 + " (fid10)"

  }
  // function getPID(d, i) {
  //   return d.pid_a_1 + " (pid_a_1)"
  // }

  datagroups.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 5)
    .attr("fill", getColor)
    ;
  function getCircleCenter(d, i) {
    let x = xScale(d.cyear);
    let y = yScale(d.edu);
    return [x, y];
  }

  for (let i = 0; i < filteredDataWithTimeObjects.length - 1; i++) {
    let currentCircle = circles._groups[0][i];
    let nextCircle = circles._groups[0][i + 1];

    let currentCenter = getCircleCenter(filteredDataWithTimeObjects[i], i);
    let nextCenter = getCircleCenter(filteredDataWithTimeObjects[i + 1], i + 1);

    viz.append("line")
      .attr("x1", currentCenter[0])
      .attr("y1", currentCenter[1])
      .attr("x2", nextCenter[0])
      .attr("y2", nextCenter[1])
      .attr("stroke", getColor(filteredDataWithTimeObjects[i]))
      .attr("stroke-width", 2);
  }


  datagroups.append("text")
    .attr("class", "dif")
    .attr("x", 10)
    .attr("y", 0)
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .text(getFID)
    ;
  // datagroups.append("text")
  //   .attr("class", "pid")
  //   .attr("x", 10)
  //   .attr("y", 12)
  //   .attr("font-family", "sans-serif")
  //   .attr("font-size", "10px")
  //   .text(getPID)
  //   ;

  function getGroupPosition(d, i) {
    console.log(d.netIncome, d)
    let x = xScale(d.cyear) + (-20 + Math.random() * 40);
    let y = yScale(d.edu) + (-20 + Math.random() * 40);
    // y = h-y
    return "translate(" + x + ", " + y + ")";
  }

  datagroups.attr("transform", getGroupPosition)

  
}


// d3.json("fiveFamilies.json").then(gotData);
// d3.json("family_1stTwoFamilies.json").then(gotData);

d3.json("fid10_12.json").then(gotData)
