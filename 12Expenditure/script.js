import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

console.log("hi");
//data from https://towardsdatascience.com/how-to-build-animated-charts-like-hans-rosling-doing-it-all-in-r-570efc6ba382

let w = 1200;
let h = 800;
let xPadding = 50;
let yPadding = 50;

let viz = d3.select("#container")
  .append("svg")
    .attr("width", w)
    .attr("height", h)
    .style("background-color", "lavender")
;




function gotData(incomingData){
  console.log(incomingData);

  // min max fertility rate (for xScale)
  let fertExtent = d3.extent(incomingData, function(d, i){
    return d.fert;
  });
  console.log("fertExtent", fertExtent);

  // make the xscale which we use to locate points along the xaxis
  let xScale = d3.scaleLinear().domain(fertExtent).range([xPadding, w-xPadding]);


  // min max life expectancy
  let incomeExtent = d3.extent(incomingData, function(d, i){
    return d.fincome;
  });
  console.log("Extent", incomeExtent);

  // make the yscale which we use to locate points along the yaxis
  let yScale = d3.scaleLinear().domain(incomeExtent).range([h-yPadding, yPadding]);

  // using the function defined at the bottom of this script to build two axis
  buildXAndYAxis(xScale, yScale);


  // min max Population
  let popExtent = d3.extent(incomingData, function(d, i){
    return d.pop;
  });
  console.log("popExtent", popExtent);
  // you may use this scale to define a radius for the circles
  let rScale = d3.scaleLinear().domain(popExtent).range([5, 50]);




  // the simple output of this complicated bit of code,
  // is an array of all the years the data talks about.
  // the "dates" array looks like:
  // ["1962", "1963", "1964", "1965", ... , "2012", "2013", "2014", "2015"]
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
    if(d.year == currentYear){
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


    // Below here is where your coding should take place! learn from lab 6:
    // https://github.com/leoneckert/critical-data-and-visualization-spring-2020/tree/master/labs/lab-6
    // the three steps in the comments below help you to know what to aim for here
function getKey(d,i){
  return d.fincome;
}
    // bind currentYearData to elements
  let datagroups = vizGroup.selectAll(".datagroup").data(currentYearData,getKey);

  function getGroupPosition(d,i){
    let x = xScale(d.cyear);
    let y = yScale(d.fincome);
    return "translate("+x+","+y+")"
  }
    // take care of entering elements
  let enteringGroups = datagroups.enter()
                           .append("g")
                           .attr("class","datagroup")
                           .attr("transform",getGroupPosition)
  ;
  function getColor(d,i){
    if(d.fid == "110043.0"){
      return "red";
    }else if(d.fid == "120009.0"){
      return "blue";
    }else if(d.fid == "130005.0"){
      return "green";
    }else if(d.fid == "130094.0"){
      return "Lightgreen";
    }else if(d.fid == "130155.0"){
      return "yellow";
    }
      
    
  }
  enteringGroups.append("circle")
       .attr("cx",0)
       .attr("cy",0)
       .attr("r",function(d,i){
        return rScale(d.fincome)
       })
       .attr("fill",getColor)
      ;
    enteringGroups.append("text")
        .text(function(d,i){
          return d.fincome
        })
        .attr('x',0)
        .attr('y',0)
        .attr("fill",getColor)
        .attr("font-family","sans-serif")
        .attr("font-size","10px")
    // take care of updating elements
    //getting small for 3 seconds and getting large again
    datagroups.select("circle")
    .attr("r",function(d,i){
      return rScale(d.pop)
     })

    // function filterChina(d,i){
    //   return d.Country == "China"
    // }

    // datagroups.filter(filterChina).select("circle")
    // .transition()
    // .duration(1000)
    // .attr("r",5)
    // .transition()
    // .duration(1000)
    // .delay(3000)
    // .attr("r",function(d,i){
    //   return rScale(d.pop)
    //  })

     function getDuration(d,i){
      // if(d.Country == "China"){
      //   return 4000
      // }else{
      //   return 100
      // }
      return 1000
     }

    // datagroups.transition().duration(1000).ease(d3.easeLinear).attr("transform", getGroupPosition)
    // function allButChina(d,i){
    //   return d.Country !="China"
    // }
    // datagroups.filter(allButChina).transition()
    //           .duration(getDuration)
    //           .delay(1000)
              // .ease(function(d,i){
              //   if(d.Country == "China"){
              //     return d3.easeBounceIn
              //   }else{
              //     return d3.easeLinear
              //   }
              // })
              //.attr("transform", getGroupPosition)


// function onlyChina(d,i){
//   return d.Country == "China"
// }


  }




  // this puts the YEAR onto the visualization
  let year = viz.append("text")
      .text("")
      .attr("x", 100)
      .attr("y", h-100)
      .attr("font-family", "sans-serif")
      .attr("font-size", "2.7em")

  ;


  drawViz();
  // setTimeout(function(){
  //   currentYearIndex++;
  //   if(currentYearIndex>dates.length){
  //     currentYearIndex = 0;
  //   }
  //   currentYear = dates[currentYearIndex];
  //   drawViz();
  // },2000);

  // this called the drawViz function every second
  // and changes the year of interest
  // and updates the text element that displays the year.
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


// load data
d3.json("fid10_12.json").then(gotData);





// function to build x anc y axis.
// the only reasons these are down here is to make the code above look less polluted

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
  yAxisGroup.attr("transform", "translate("+xPadding+", 0)")

  yAxisGroup.append("g").attr('class', 'xLabel')
    .attr("transform", "translate(-33, "+h/2+") rotate(-90)")
    .append("text")
    .attr("fill", "black")
    .text("Year")
    .attr("font-family", "sans-serif")
    .attr("font-size", "1.7em")

  ;
}
