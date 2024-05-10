import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let w = 1200;
let h = 800;

// create dictionary for province
let mapDict = [];
makeDict(); // bottom of code
console.log(mapDict)



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


      // console.log(datapoint.customProvIdx)

    }
  } 




  datapoint.customProvIdx = parseInt(datapoint.customProvIdx)
 
  return datapoint
}

function gotData(geoData, incomingData) {
  console.log(geoData);
  console.log(incomingData);

  let fixedProvinceCodes = incomingData.map(mapFixProvinceCode)
  console.log(fixedProvinceCodes)

  let groupByProvince = d3.groups(fixedProvinceCodes, (d) => d.customProvIdx); 
  console.log(groupByProvince);
  
  function getFamilyIncome(family) {
    console.log(family.fincome1)
  
    return parseInt(family.fincome1)
  
  }

  let statsByProvince = groupByProvince.map(function(provinceData){
    // 
    // provinceData looks like [ 11, [fam, fam, fam]]
    // we can pull out the prov ID like this:
    let provID = provinceData[0]
    // 1. select familyArray from
    let familyArray = provinceData[1]

    // // map:
    // // creating prvince income array [213213, 123421341, 12342134]
    // // based on povince fmailiy array [{family...}, {family....}, {family...}]
    let familyIncomes = familyArray.map(getFamilyIncome)
    console.log(familyIncomes)


     // caluclate of vaerage of bj income arrray

     let cityStats = {
         average:d3.mean(familyIncomes), 
         min:d3.min(familyIncomes), 
         max:d3.max(familyIncomes), 
         median:d3.median(familyIncomes), 
         numFamilies:familyIncomes.length
       };

       return [provID, cityStats];


  })

  console.log(statsByProvince);

  // what you want to visualize on a map is tyhis data: statsByProvince
 


// console.log(beijingStats)
// let average = d3.mean(bjIncomes)
// let min = d3.min(bjIncomes)
// let max = d3.max(bjIncomes)
// let median = d3.median(bjIncomes)
// let numFamilies = bjIncomes.length;

// console.log(min);
// console.log(max);
// console.log(average);
// console.log(median);


  // let projection = d3.geoEqualEarth()
  //   .translate([w / 2, h / 2])
  //   .fitExtent([[0, 0], [w, h]], geoData)


  // console.log(projection([114.4698, 38.0360]))

  // let pathMaker = d3.geoPath(projection);

  // viz.selectAll(".province").data(geoData.features).enter()
  //   .append("path")
  //   .attr("class", "province")
  //   .attr("d", pathMaker)
  //   .attr("fill", "black")


  // viz.append("circle")
  //   .attr("cx", function (d, i) {
  //     return projection([114.4698, 38.0360])[0]
  //   })
  //   .attr("cy", function (d, i) {
  //     return projection([114.4698, 38.0360])[1]
  //   })
  //   .attr("r", 10)
  //   .attr("fill", "red")
  //   ;



  //let pathMaker = d3.geoPath(projection);




}



d3.json("china.json").then(function (geoData) {
  d3.csv("cfps2020famecon_202306.csv").then(function (incomingData) {
    gotData(geoData, incomingData)
  })
})







function makeDict(){
  mapDict[11] = {
    province: "Beijing",
    longtitude: 39.9042,
    latitude: 116.4074,
  };
  
  mapDict[12] = {
    province: "Tianjin",
    longtitude: 39.0851,
    latitude: 117.1994,
  };
  
  mapDict[13] = {
    province: "Hebei",
    longtitude: 39.0851,
    latitude: 117.1994,
  };
  
   mapDict[14]= {
    province: "Shanxi",
    longtitude: 37.8734,
    latitude: 112.5627,
  
  };
  
  mapDict[15] = {
    province: "Inner Mongolia",
    longtitude: 40.8173,
    latitude: 111.7652,
  };
  
  mapDict[21] = {
    province: "Liaoning",
    longtitude:41.8357,
    latitude: 123.4292,
  };
  
  mapDict[22] = {
    province: "Jilin",
    longtitude:43.8378,
    latitude: 126.5494,
  };
  
  mapDict[23] = {
    province: "Heilongjiang",
    longtitude:45.7421,
    latitude: 126.6629,
  };
  
  mapDict[31] = {
    province: "Shanghai",
    longtitude:31.2304,
    latitude: 121.4737,
  };
  
  mapDict[32] = {
    province: "Jiangsu",
    longtitude:32.0607,
    latitude: 118.7630,
  };
  
  mapDict[33] = {
    province: "Zhjianng",
    longtitude:30.2655,
    latitude: 120.1536
  };
  
  mapDict[34] = {
    province: "Anhui",
    longtitude:31.8616,
    latitude: 117.2857
  };
  
  mapDict[35] = {
    province: "Fujian",
    longtitude:26.0998,
    latitude: 119.2966
  };
  
  mapDict[36] = {
    province: "Jiangxi",
    longtitude:28.6742,
    latitude: 115.9100
  };
  
  mapDict[36] = {
    province: "Jiangxi",
    longtitude:28.6742,
    latitude: 115.9100
  };
  
  mapDict[37] = {
    province: "Shandong",
    longtitude:36.6683,
    latitude: 117.0208
  };
  
  mapDict[41] = {
    province: "Henan",
    longtitude:34.7657,
    latitude: 113.7532
  };
  
  mapDict[42] = {
    province: "Hubei",
    longtitude:30.5454,
    latitude: 114.3423
  };
  
  mapDict[43] = {
    province: "Hunan",
    longtitude:28.1142,
    latitude: 112.9833
  };
  
  mapDict[44] = {
    province: "Guangdong",
    longtitude:23.1317,
    latitude: 113.2663
  };
  
  mapDict[45] = {
    province: "Guangxi",
    longtitude:24.3255,
    latitude: 109.4155
  };
  
  mapDict[46] = {
    province: "Hainan",
    longtitude:20.0200,
    latitude: 110.3486,
  };
  
  mapDict[50] = {
    province: "Chongqing",
    longtitude:29.5657,
    latitude: 106.5512,
  };
  
  mapDict[51] = {
    province: "Sichuan",
    longtitude:30.6509,
    latitude: 104.0757,
  };
  
  mapDict[52] = {
    province: "Guizhou",
    longtitude:26.5982,
    latitude: 106.7072,
  };
  
  mapDict[53] = {
    province: "Yunnan",
    longtitude:25.0453,
    latitude: 102.7097,
  };
  
  mapDict[61] = {
    province: "Shaanxi",
    longtitude:34.2649,
    latitude: 108.9542,
  };
  
  mapDict[62] = {
    province: "Gansu",
    longtitude:36.0594,
    latitude: 103.8263,
  };
  
  mapDict[64] = {
    province: "Ningxia",
    longtitude:38.4712,
    latitude: 106.2587,
  };
  
  mapDict[65] = {
    province: "Xinjiang",
    longtitude:43.7934,
    latitude: 87.6271,
  };
}