import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let w = 1200;
let h =800;
let xPadding = 70;
let yPadding = 70;

let viz = d3.select("#container")
  .append("svg")
     .attr("class", "viz")
     .attr("width", w)
     .attr("height", h)
     .style("background-color", "rgb(255 255 255)")

function gotData(incomingData){
    console.log(incomingData);

 // min max year (for xScale)
 let yearExtent = d3.extent(incomingData, function(d, i){
  return d.cyear;
});
console.log("yearExtent", yearExtent);

// make the xscale which we use to locate points along the xaxis
let xScale = d3.scaleLinear().domain(yearExtent).range([xPadding, w-xPadding]);

// min max fincome (for yScale)
let incomeExtent = d3.extent(incomingData, function(d, i){
  return d.fincome1;
});
console.log("incomeExtent", incomeExtent);

// make the yscale which we use to locate points along the yaxis
let yScale = d3.scaleLinear().domain(incomeExtent).range([h-yPadding, yPadding]);


let dates = incomingData.reduce(function(acc,d,i){
  if(!acc.includes(d.cyear)){
    acc.push(d.cyear)
  }
  return acc
}, [])

console.log("dates", dates);

// this block of code is needed to select a subsection of the data (by year)
let currentYearIndex = 0;
let currentYear = dates[currentYearIndex];
function filterYear(d, i){
  if(d.cyear == currentYear){
    return true;
  }else{
    return false;
  }
}

// make a group for all things visualization:
let vizGroup = viz.append("g").attr("class", "vizGroup");


// this function is called every second.
// inside it is a data variable that always carries the "latest" data of a new year
// inside it we want to draw shapes and deal wirth both updating and entering element.
function drawViz(){

  let currentYearData = incomingData.filter(filterYear);
  console.log("---\nthe currentYearData array now carries the data for year", currentYear);
  function getKey(d,i){
    return d.fid10;
  }
      // bind currentYearData to elements
    let datagroups = vizGroup.selectAll(".datagroup").data(currentYearData,getKey);
  
    function getGroupPosition(d,i){
      let x = xScale(d.cyear);
      let y = yScale(d.fincome1);
      return "translate("+x+","+y+")"
    }

     // take care of entering elements
     let enteringGroups = datagroups.enter()
                                .append("g")
                                .attr("class", "datagroup")
                                .attr("transform", getGroupPosition);

function getColor(d,i){
  if(d.fid10 == "130094.0"){
    return "red";
  }else if(d.fid10 == "130299.0"){
    return "blue";
  }else if(d.fid10 == "130533.0"){
    return "green";
  }
}
enteringGroups.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 0)
    .attr("fill", getColor);

  enteringGroups.append("text")
    .text(function(d) {
      return d.fid10;
    })
    .attr('x', 10)
    .attr('y', 0)
    .attr("fill", getColor)
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px");

     // take care of updating elements
    //getting small for 3 seconds and getting large again
    datagroups.select("circle")
             .attr("r",20)

     function getDuration(d,i){
      return 1000
     }

     datagroups.transition().duration(2000).ease(d3.easeLinear).duration(2000).attr("transform", getGroupPosition)

  }


    let year = viz.append("text")
      .text("")
      .attr("x", 100)
      .attr("y", h-100)
      .attr("font-family", "sans-serif")
      .attr("font-size", "2.7em")

  ;

  drawViz();

  setInterval(function(){
    currentYearIndex++;
    if(currentYearIndex>dates.length){
      currentYearIndex = 0;
    }
    currentYear = dates[currentYearIndex];
    year.text(currentYear)
    drawViz();
  }, 3000);


}


  d3.json("3families_data.json").then(gotData)

  
  function buildXAndYAxis(xScale, yScale){
    let xAxisGroup = viz.append("g").attr("class", 'xaxis');
    let xAxis = d3.axisBottom(xScale);
    xAxisGroup.call(xAxis)
    xAxisGroup.attr("transform", "translate(0, "+ (h-yPadding) +")")
    xAxisGroup.append("g").attr('class', 'xLabel')
      .attr("transform", "translate("+w/2+", 40)")
      .append("text")
      .attr("fill", "black")
      .text("Income")
      .attr("font-family", "sans-serif")
      .attr("font-size", "1.7em")
  
    ;
  
    let yAxisGroup = viz.append("g").attr("class", 'yaxis');
    let yAxis = d3.axisLeft(yScale);
    yAxisGroup.call(yAxis)
    yAxisGroup.attr("transform", "translate("+xPadding+", 100)")
  
    yAxisGroup.append("g").attr('class', 'xLabel')
      .attr("transform", "translate(-33, "+h/2+") rotate(0)")
      .append("text")
      .attr("fill", "black")
      .text("Year")
      .attr("font-family", "sans-serif")
      .attr("font-size", "1.7em")
  
    ;
  }