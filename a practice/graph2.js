import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

console.log("hi")
// Load the JSON file containing the map data
d3.json("./hebei.json").then(mapJSON => {
  // Define the coordinates and names of the families
  let scenery = [
    { "name": "family1", "fid": '130094.0', "coordinates": [114.63902, 40.237889] },
    { "name": "family2", "fid": '130299.0', "coordinates": [115.08722, 37.50227] },
    { "name": "family3", "fid": '130533.0', "coordinates": [118.89221, 40.31553] }
  ];
  
  let width = d3.select("#container").style("width").split("px").shift();
  let height = window.innerHeight;
  
  // Rewind the map features
  mapJSON.features = mapJSON.features.map(feature => turf.rewind(feature, { reverse: true }));

  // Select the SVG container
  let viz = d3.select("#container2").append("svg");

  
  // Create a projection to fit the map data to the SVG container
  let projection = d3.geoMercator().fitSize([width, height], mapJSON);

  // Create a path generator
  let path = d3.geoPath().projection(projection);

  // Set up the SVG container
  viz.attr("width", width)
    .attr("height", height);

  // Draw the map
  viz.selectAll("path")
    .data(mapJSON.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", "white")
    .attr("stroke", "grey")
    .attr("stroke-linejoin", "round");

  // Draw the families and set up mouseover and mouseout events
  scenery.forEach(item => {
    viz.append("circle")
      .attr("cx", projection(item.coordinates)[0])
      .attr("cy", projection(item.coordinates)[1])
      .attr("r", 5)
      .attr("fill", "red")
      .on("mouseover", function (event, d) {
        d3.select(".a").text(item.name);
        d3.select(".b").text(item.fid);
        d3.select(".tooltip1").attr("style", `left:${event.pageX + 30}px;top:${event.pageY + 30}px;display:block`);
        d3.select(this).attr("r", 8);
      })
      .on("mouseout", function (d) {
        d3.selectAll(".tooltip1").attr('style', 'display:none');
        d3.select(this).attr("r", 5);
      });

    viz.append("text")
      .attr("x", projection(item.coordinates)[0] + 15)
      .attr("y", projection(item.coordinates)[1] + 5)
      .text(item.name)
      .attr("font-size", "12px")
      .attr("fill", "black");
  });
});
