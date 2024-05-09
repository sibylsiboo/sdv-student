import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

console.log("hi")
// Load the JSON file containing the map data
d3.json("graph2-data/hebei.json").then(mapJSON => {
  // Define the coordinates, names, and colors of the families
  let scenery = [
    {
      "name": "family1",
      "fid": '130094.0',
      "coordinates": [114.63902, 40.237889],
      "color": "#a4aac4",
      "imagePath": "graph2-asset/family1.png" // Specify the path to the image for family 1
    },
    {
      "name": "family2",
      "fid": '130299.0',
      "coordinates": [115.08722, 37.50227],
      "color": "#83889C",
      "imagePath": "graph2-asset/family2.png" // Specify the path to the image for family 2
    },
    {
      "name": "family3",
      "fid": '130533.0',
      "coordinates": [118.89221, 40.31553],
      "color": "#686C7C",
      "imagePath": "graph2-asset/family3.png" // Specify the path to the image for family 3
    }
  ]
  
  let width = d3.select("#viz2").style("width").split("px").shift();
  let height = window.innerHeight;
  
  // Rewind the map features
  mapJSON.features = mapJSON.features.map(feature => turf.rewind(feature, { reverse: true }));

  // Select the SVG container
  let w = 700;
  let h = 800;
  let viz = d3.select("#viz2").append("svg")
  .attr("background-color","Transparent")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 "+w+" "+h)
  ;
  
  // Create a projection to fit the map data to the SVG container
  let projection = d3.geoMercator().fitSize([width, height], mapJSON);

  // Create a path generator
  let path = d3.geoPath().projection(projection);


  // Draw the map
  viz.selectAll("path")
    .data(mapJSON.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", "Transparent")
    .attr("stroke", "grey")
    .attr("stroke-weight","300px")
    .attr("stroke-linejoin", "round");

  // Draw the families and set up mouseover and mouseout events
  scenery.forEach(item => {
    viz.append("image")
      .attr("x", projection(item.coordinates)[0] - 10) 
      .attr("y", projection(item.coordinates)[1] - 10) 
      .attr("height", 50) // Adjust the size of the image
      .attr("xlink:href", item.imagePath) // Specify the path to the image for the current family
      .on("mouseover", function (event, d) {
        d3.select(".a").text(item.name);
        d3.select(".b").text(item.fid);
        d3.select(".tooltip1").html(item.info); // Set HTML content based on the info property
        d3.select(".tooltip1").attr("fill","White").attr("style", `left:${event.pageX + 30}px;top:${event.pageY + 30}px;display:block`);
      })
      .on("mouseout", function (d) {
        d3.selectAll(".tooltip1").attr('style', 'display:none');
      });
  
    viz.append("text")
      .attr("x", projection(item.coordinates)[0] + 40)
      .attr("y", projection(item.coordinates)[1] + 15)
      .text(item.name)
      .attr("font-size", "12px")
      .attr("fill", "black");
  })
})
