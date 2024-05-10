import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let w = 1200;
let h = 800;
let xPadding = 150;
let yPadding = 70;

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
    // datapoint.Year = timeParser(datapoint.Year);
    //console.log(datapoint.cyear)
    // let simplified_datapoint = {}
    // console.log(datapoint.fincome1
    // datapoint.cyear = timeParser(datapoint.leonADDEDYEAR)

    if ("cyear" in datapoint) {
      datapoint.cyear = timeParser(parseInt(datapoint.cyear));
    } else if ("CYEAR" in datapoint) {
      datapoint.cyear = timeParser(parseInt(datapoint.CYEAR));
    }
    let year = datapoint.cyear.getFullYear()
    // simplified_datapoint.cyear = timeParser( parseInt(datapoint.cyear) );
   // datapoint.fid = parseInt(datapoint.fid)

    datapoint.netIncome = parseFloat(datapoint.fincome1);
    if (year == 2012) {
      console.log(datapoint)
      datapoint.netIncome = parseFloat(datapoint.FINCOME1);
    } else if (year == 2010) {
      // console.log(datapoint)
      datapoint.netIncome = parseFloat(datapoint.faminc_net);

    }
    return datapoint

  }

  let filteredDataWithTimeObjects = incomingData.map(mapFunction);
  filteredDataWithTimeObjects = filteredDataWithTimeObjects.filter(d=>!isNaN(d.netIncome))
  console.log(filteredDataWithTimeObjects)


  // console.log(130533)
  console.log(filteredDataWithTimeObjects.filter(res=>{
    return res.fid10 == 130533 && res.cyear.getFullYear() == 2014
  }))

  // make a fmaily book


  // let familyGroups = [];

  // for (let i = 0; i < filteredDataWithTimeObjects.length; i++) {
  //   if (filteredDataWithTimeObjects[i].cyear.getFullYear() == 2020) {
  //     console.log(filteredDataWithTimeObjects[i])
  //     let famIds = [
  //       parseInt(filteredDataWithTimeObjects[i].fid20), parseInt(filteredDataWithTimeObjects[i].fid10)
  //     ]
  //     familyGroups.push(famIds)
  //   }
  // }
  // console.log(familyGroups)

  let fid10s = []
  for (let i = 0; i < filteredDataWithTimeObjects.length; i++) {
    let fid = filteredDataWithTimeObjects[i].fid10;
    if(fid10s.includes(fid) == false){
      fid10s.push(fid)

    }
  }
  console.log(fid10s)

  // optional；
  // show just one family:
  //  // 130094.0-3; 130299.0-7 130533.0-11
  let famidx = 11;
  filteredDataWithTimeObjects = filteredDataWithTimeObjects.filter(d=>d.fid10 == fid10s[famidx])


  function getFamilyIdx(fid) {
    for (let i = 0; i < familyGroups.length; i++) {
      console.log(familyGroups[i], i, fid, familyGroups[i].includes(fid))
      if (familyGroups[i].includes(fid)) {

        return i
      }
    }
  }

  let getFamilyColor = d3.scaleOrdinal(fid10s,d3.schemeTableau10)







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
  function getIncome(d, i) {
    return d.netIncome
  }
  let incomeExtent = d3.extent(filteredDataWithTimeObjects, getIncome)
  console.log(incomeExtent)

  let yScale = d3.scaleLinear().domain(incomeExtent).range([h - yPadding, yPadding])

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

  function getColor(d, i) {
   // console.log(getFamilyIdx(d.fid))
    return getFamilyColor(d.fid10)
    // if (getFamilyIdx(d.fid) == 0) {
    //   return "red"
    // } else if (getFamilyIdx(d.fid) == 1) {
    //   return "black"
    // } else if(getFamilyIdx(d.fid) == 2){
    //   return "yellow"
    // }

  }
  //return "red"

  function getFID(d, i) {
    return d.fid10 + " (fid10)"
    // if("pid_a_1" in d){
    //   return d.fid + "  " + d.pid_a_1;
    // }else if("PID_A_1" in d){
    //   return d.fid + "  " + d.PID_A_1;
    // }else{
    //   return d.fid 
    // }
    
  }
  // function getPID(d, i){
  //   return d.pid_a_1 + " (pid_a_1)"
  // }

  datagroups.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 5)
    .attr("fill", getColor)
    ;

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
  // ;

  function getGroupPosition(d, i) {
    console.log(d.netIncome, d)
    let x = xScale(d.cyear) + (-20 + Math.random() * 40);
    let y = yScale(d.netIncome) + (-20 + Math.random() * 40);
    // y = h-y
    return "translate(" + x + ", " + y + ")";
  }

  datagroups.attr("transform", getGroupPosition)





}


// d3.json("fiveFamilies.json").then(gotData);
// d3.json("family_1stTwoFamilies.json").then(gotData);
d3.json("fid10_12.json").then(gotData);


