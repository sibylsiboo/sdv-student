import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

     let w = 1200;
     let h = 800;
     
     
     
     let viz = d3.select("#container")
       .append("svg")
       .attr("class", "viz")
       .attr("width", w)
       .attr("height", h)
       .style("background-color", "rgb(255 255 255)")
       .style("stroke-color", "rgb(255 255 255)")
     
     function mapFixProvinceCode(datapoint) {
       // fix all prvince code problems
       if (datapoint.provcd20 != undefined) {
         datapoint.customProvIdx = datapoint.provcd20
       } else if (datapoint.provcd18 != undefined) {
         datapoint.customProvIdx = datapoint.provcd18
       } else if (datapoint.provcd16 != undefined) {
         datapoint.customProvIdx = datapoint.provcd16
       } else if (datapoint.provcd14 != undefined) {
         datapoint.customProvIdx = datapoint.provcd14
       } else if (datapoint.provcd != undefined) {
         datapoint.customProvIdx = datapoint.provcd
       }
     
       if (isNaN(datapoint.customProvIdx) == true) {
         // console.log(datapoint.customProvIdx)
         if (datapoint.customProvIdx == "北京市") {
     
           datapoint.customProvIdx = 11;
         } else if (datapoint.customProvIdx == "天津市") {
           datapoint.customProvIdx = 12;
         } else if (datapoint.customProvIdx == "湖南省") {
           datapoint.customProvIdx = 43;
         } else if (datapoint.customProvIdx == "河北省") {
           datapoint.customProvIdx = 13;
     
     
           console.log(datapoint.customProvIdx)
     
         }
       } 
     
     
     
     
       datapoint.customProvIdx = parseInt(datapoint.customProvIdx)
      
       return datapoint
     }
     

function gotData(incomingData){
    console.log(incomingData);

    let fixedProvinceCodes = incomingData.map(mapFixProvinceCode)
    console.log(fixedProvinceCodes)

    function getHebeiIncome(family){
      if 
    }



  }


  d3.csv("cfps2010famecon_202008.csv").then(gotData)


  