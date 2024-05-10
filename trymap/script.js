import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let w = 1200;
let h = 800;

// create dictionary for province
let mapDict = {};
makeDict(); // bottom of code
console.log(mapDict);

let viz = d3
  .select("#container")
  .append("svg")
  .attr("class", "viz")
  .attr("width", w)
  .attr("height", h)
  .style("background-color", "rgb(255 255 255)")
  .style("stroke-color", "rgb(255 255 255)");

function mapFixProvinceCode(datapoint) {
  // fix all prvince code problems
  if (datapoint.provcd20 != undefined) {
    datapoint.customProvIdx = datapoint.provcd20;
  } else if (datapoint.provcd18 != undefined) {
    datapoint.customProvIdx = datapoint.provcd18;
  } else if (datapoint.provcd16 != undefined) {
    datapoint.customProvIdx = datapoint.provcd16;
  } else if (datapoint.provcd14 != undefined) {
    datapoint.customProvIdx = datapoint.provcd14;
  } else if (datapoint.provcd != undefined) {
    datapoint.customProvIdx = datapoint.provcd;
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

  datapoint.customProvIdx = parseInt(datapoint.customProvIdx);

  return datapoint;
}

function gotData(geoData, incomingData) {
  let fixedProvinceCodes = incomingData.map(mapFixProvinceCode);

  let groupByProvince = d3.groups(fixedProvinceCodes, (d) => d.customProvIdx);

  console.log(
    "first",
    d3.group(fixedProvinceCodes, (d) => d.customProvIdx).keys()
  );

  const provinceIds = geoData.features.map((d) => +d.properties.id);
  console.log("geoData", groupByProvince);
  console.log("provinceIds", provinceIds);
  groupByProvince.forEach((item) => {
    if (!provinceIds.includes(item[0])) {
      console.log("first-----------", item[0]);
    }
  });

  function getFamilyIncome(family) {
    return parseInt(family.fincome1);
  }

  let statsByProvince = groupByProvince.map(function (provinceData) {
    //
    // provinceData looks like [ 11, [fam, fam, fam]]
    // we can pull out the prov ID like this:
    let provID = provinceData[0];
    // 1. select familyArray from
    let familyArray = provinceData[1];

    // // map:
    // // creating prvince income array [213213, 123421341, 12342134]
    // // based on povince fmailiy array [{family...}, {family....}, {family...}]
    let familyIncomes = familyArray.map(getFamilyIncome);

    // caluclate of vaerage of bj income arrray

    let cityStats = {
      average: d3.mean(familyIncomes),
      min: d3.min(familyIncomes),
      max: d3.max(familyIncomes),
      median: d3.median(familyIncomes),
      numFamilies: familyIncomes.length,
    };

    return [provID, cityStats];
  });

  let projection = d3.geoMercator().fitSize([w, h], geoData);

  let pathMaker = d3.geoPath(projection);

  viz
    .selectAll(".province")
    .data(geoData.features)
    .enter()
    .append("path")
    .attr("class", "province")
    .attr("d", pathMaker)
    .attr("fill", "#fff")
    .attr("stroke", "#ccc");

  const provinceGroup = viz
    .selectAll(".province-group")
    .data(statsByProvince)
    .join("g")
    .attr("transform", (d) => {
      const tempItem = geoData.features.find(
        (province) => +province.properties.id == d[0]
      );

      let [x, y] = pathMaker.centroid(tempItem);
      if (mapDict[d[0]].province == "Hebei") {
        x -= 10;
        y += 20;
      }
      return `translate(${x},${y})`;
    });

  provinceGroup
    .append("text")
    .attr("class", "province-name")
    .text((d) => mapDict[d[0]].province)
    .attr("fill", "#000")
    .attr("text-anchor", "middle")
    .attr("font-size", "0.7em")
    .attr("y", 10);

  const h_scale = d3
    .scaleLinear()
    .domain([0, d3.max(statsByProvince, (d) => d[1].average)])
    .range([0, 100]);

  provinceGroup
    .append("rect")
    .attr("width", 10)
    .attr("height", (d) => {
      return h_scale(d[1].average);
    })
    .attr("y", (d) => {
      return -h_scale(d[1].average);
    })
    .attr("x", -5)
    .attr("fill", "pink")
    .attr("fill-opacity", "0.7");

  provinceGroup
    .append("text")
    .attr("class", "value")
    .text((d) => (+d[1].average).toFixed(1))
    .attr("fill", "#000")
    .attr("text-anchor", "middle")
    .attr("font-size", "0.6em")
    .attr("y", (d) => {
      return -h_scale(d[1].average) - 5;
    });
}

d3.json("geojson-map-china-master/china.json").then(function (geoData) {
  d3.csv("cfps2020famecon_202306.csv").then(function (incomingData) {
    gotData(geoData, incomingData);
  });
});

function makeDict() {
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

  mapDict[14] = {
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
    longtitude: 41.8357,
    latitude: 123.4292,
  };

  mapDict[22] = {
    province: "Jilin",
    longtitude: 43.8378,
    latitude: 126.5494,
  };

  mapDict[23] = {
    province: "Heilongjiang",
    longtitude: 45.7421,
    latitude: 126.6629,
  };

  mapDict[31] = {
    province: "Shanghai",
    longtitude: 31.2304,
    latitude: 121.4737,
  };

  mapDict[32] = {
    province: "Jiangsu",
    longtitude: 32.0607,
    latitude: 118.763,
  };

  mapDict[33] = {
    province: "Zhjianng",
    longtitude: 30.2655,
    latitude: 120.1536,
  };

  mapDict[34] = {
    province: "Anhui",
    longtitude: 31.8616,
    latitude: 117.2857,
  };

  mapDict[35] = {
    province: "Fujian",
    longtitude: 26.0998,
    latitude: 119.2966,
  };

  mapDict[36] = {
    province: "Jiangxi",
    longtitude: 28.6742,
    latitude: 115.91,
  };

  mapDict[36] = {
    province: "Jiangxi",
    longtitude: 28.6742,
    latitude: 115.91,
  };

  mapDict[37] = {
    province: "Shandong",
    longtitude: 36.6683,
    latitude: 117.0208,
  };

  mapDict[41] = {
    province: "Henan",
    longtitude: 34.7657,
    latitude: 113.7532,
  };

  mapDict[42] = {
    province: "Hubei",
    longtitude: 30.5454,
    latitude: 114.3423,
  };

  mapDict[43] = {
    province: "Hunan",
    longtitude: 28.1142,
    latitude: 112.9833,
  };

  mapDict[44] = {
    province: "Guangdong",
    longtitude: 23.1317,
    latitude: 113.2663,
  };

  mapDict[45] = {
    province: "Guangxi",
    longtitude: 24.3255,
    latitude: 109.4155,
  };

  mapDict[46] = {
    province: "Hainan",
    longtitude: 20.02,
    latitude: 110.3486,
  };

  mapDict[50] = {
    province: "Chongqing",
    longtitude: 29.5657,
    latitude: 106.5512,
  };

  mapDict[51] = {
    province: "Sichuan",
    longtitude: 30.6509,
    latitude: 104.0757,
  };

  mapDict[52] = {
    province: "Guizhou",
    longtitude: 26.5982,
    latitude: 106.7072,
  };

  mapDict[53] = {
    province: "Yunnan",
    longtitude: 25.0453,
    latitude: 102.7097,
  };

  mapDict[54] = {
    province: "Xizang",
    longtitude: 31.56375,
    latitude: 88.388277,
  };

  mapDict[61] = {
    province: "Shaanxi",
    longtitude: 34.2649,
    latitude: 108.9542,
  };

  mapDict[62] = {
    province: "Gansu",
    longtitude: 36.0594,
    latitude: 103.8263,
  };
  mapDict[63] = {
    province: "Qinhai",
    longtitude: 35.726403,
    latitude: 96.043533,
  };

  mapDict[64] = {
    province: "Ningxia",
    longtitude: 38.4712,
    latitude: 106.2587,
  };

  mapDict[65] = {
    province: "Xinjiang",
    longtitude: 43.7934,
    latitude: 87.6271,
  };
}
