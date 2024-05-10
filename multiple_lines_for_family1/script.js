import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let w = 1200;
let h = 800;
let xPadding = 150;
let yPadding = 70;
let fid10s;
let fields = ["dress", "food", "house", "med", "eec","fincome1"];

let viz = d3.select("#container")
  .append("svg")
  .attr("class", "viz")
  .attr("width", w)
  .attr("height", h)
  .style("background-color", "rgb(255,255,255)");

function gotData(incomingData) {
  let timeParse = d3.timeParse("%Y");
  //let year = timeParse(d.cyear).getFullYear();


  //let test = timeParser("2020");
  //console.log(test)


  //create array for cyear & all elements in fields[]
  function mapFunction(datapoint) {
    if ("cyear" in datapoint) {
      datapoint.cyear = timeParse(datapoint.cyear);
    } else if ("CYEAR" in datapoint) {
      datapoint.cyear = timeParse(datapoint.CYEAR);
    }

  // console.log(year)
    
    fields.forEach(field => {
      if(isNaN(datapoint[field])){
         console.log(field);
         console.log(datapoint[field]);
         console.log("-----");
      }
      datapoint[field] = parseFloat(datapoint[field])
}); 
    console.log(datapoint);
    return datapoint

    }

  

    let filteredDataWithTimeObjects = incomingData.map(mapFunction);
    console.log(filteredDataWithTimeObjects);
    filteredDataWithTimeObjects = filteredDataWithTimeObjects.filter(d => fields.every(field => !isNaN(d[field])));
    console.log(filteredDataWithTimeObjects);

  
  fid10s = [];
  for (let i = 0; i < filteredDataWithTimeObjects.length; i++) {
    let fid = filteredDataWithTimeObjects[i].fid10;
    if (!fid10s.includes(fid)) {
      fid10s.push(fid);
    }
  }

//3 7 11
  let famidx = 3;
  filteredDataWithTimeObjects = filteredDataWithTimeObjects.filter(d => d.fid10 == fid10s[famidx]);
  let getFamilyColor = d3.scaleOrdinal(fid10s,d3.schemeTableau10);
  
  // function getFamilyIdx(fid) {
  //   for (let i = 0; i < familyGroups.length; i++) {
  //     console.log(familyGroups[i], i, fid, familyGroups[i].includes(fid))
  //     if (familyGroups[i].includes(fid)) {

  //       return i
  //     }
  //   }
  // }



  let minyear = d3.min(filteredDataWithTimeObjects, d => d.cyear);
  let maxyear = d3.max(filteredDataWithTimeObjects, d => d.cyear);
  
//x scale & axis
  let xScale = d3.scaleTime().domain([minyear, maxyear]).range([xPadding, w - xPadding]);
  let xAxisGroup = viz.append("g").attr("class","xAxisGroup");
  let xAxis = d3.axisBottom(xScale);

  viz.append("g")
   .attr("class", "x axis")
   .call(xAxis)
   .attr("transform", "translate(0, "+ (h - yPadding) +")");
	
d3.selectAll(".ticks");
  //xAxisGroup.call(xAxis);
xAxisGroup.attr("transform", "translate(-80, "+ (h-70) +")")

  // Extract values of all fields into a single array
let allFieldValues = [];
filteredDataWithTimeObjects.forEach(d => {
  fields.forEach(field => {
      allFieldValues.push(d[field]);
  });
});

//calculate yextent

let yExtent = d3.extent(allFieldValues);

//y scale & axis

  let yScale = d3.scaleLinear().domain(yExtent).range([h - yPadding, yPadding]);

  let yAxisGroup = viz.append("g").attr("class", "yAxisGroup");
  let yAxis = d3.axisLeft(yScale);
  yAxisGroup.call(yAxis);
  yAxisGroup.attr("transform", "translate(70,0)");

  // Define line generators for each element
  let lineEdu = d3.line()
    .x(d => xScale(d.cyear))
    .y(d => yScale(d.eec));

  let lineFood = d3.line()
    .x(d => xScale(d.cyear))
    .y(d => yScale(d.FOOD));

  let lineHouse = d3.line()
    .x(d => xScale(d.cyear))
    .y(d => yScale(d.house));

  let lineDress = d3.line()
    .x(d => xScale(d.cyear))
    .y(d =>yScale(d.dress))
  
  let lineMed = d3.line()
    .x(d =>xScale(d.cyear))
    .y(d =>yScale(d.med))

  let lineIncome = d3.line()
    .x(d =>xScale(d.cyear))
    .y(d =>yScale(d.fincome))

  // Draw lines
  viz.append('path')
    .datum(filteredDataWithTimeObjects)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 2)
    .attr('d', lineEdu);

  viz.append('path')
    .datum(filteredDataWithTimeObjects)
    .attr('fill', 'none')
    .attr('stroke', 'green')
    .attr('stroke-width', 2)
    .attr('d', lineFood);

  viz.append('path')
    .datum(filteredDataWithTimeObjects)
    .attr('fill', 'none')
    .attr('stroke', 'red')
    .attr('stroke-width', 2)
    .attr('d', lineHouse);
  
  viz.append('path')
    .datum(filteredDataWithTimeObjects)
    .attr("fill","none")
    .attr("stroke","black")
    .attr("stroke-width",2)
    .attr("d",lineDress);

  viz.append('path')
    .datum(filteredDataWithTimeObjects)
    .attr("fill","none")
    .attr("stroke","black")
    .attr("stroke-width",2)
    .attr("d",lineMed);

  viz.append('path')
    .datum(filteredDataWithTimeObjects)
    .attr("fill","none")
    .attr("stroke","black")
    .attr("stroke-width",2)
    .attr("d",lineIncome);
  
  // Add circles, text, and apply transform for each data point
  let datagroups = viz.selectAll(".datagroup")
    .data(filteredDataWithTimeObjects)
    .enter()
    .append("g")
    .attr("class", "datagroup");

  // let circles = datagroups.append("circle")
  //   .attr("cx", 0)
  //   .attr("cy", 0)
  //   .attr("r", 5)
  //   .attr("fill", getColor);

  function getColor(d, i) {
    return getFamilyColor;
  }

  function getFID(d, i) {
    return d.fid10 + " (fid10)";
  }

  datagroups.append("text")
    .attr("class", "dif")
    .attr("x", 10)
    .attr("y", 0)
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .text(getFID);

  function getGroupPosition(d, i) {
    let x = xScale(d.cyear) + (-20 + Math.random() * 40);
    let y = yScale(d[field]) + (-20 + Math.random() * 40);
    return "translate(" + x + ", " + y + ")";
  }

  datagroups.attr("transform", getGroupPosition);

}



d3.json("fid10_12.json").then(gotData);