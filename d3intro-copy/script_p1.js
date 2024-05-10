import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


let viz = d3.select("#viz-container")
  .append("svg")
   .attr("width", 500)
   .attr("height", 500)
   .attr("id", "viz")
   ;

viz.append("circle")
   .attr("cx", 100)
   .attr("cy", 100)
   .attr("r", 20)

let myData = [3, 9, 6, 2];

function xLocation(d, i){
    console.log(d)
    console.log(i)
    //return d*30;
    return 50 + i*50;
}

            //   1             4       3              000
viz.selectAll("myCircle").data(myData).enter().append("circle")
                        .attr("cx", xLocation)
                        .attr("cy", 250)
                        .attr("r", 10)
                        .attr("fill", "yellow")
                        .attr("class", "myCircle")