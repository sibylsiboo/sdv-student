d3.json("./hebei.json").then(mapJSON => {
  let scenery = [
    { "name": "family1", fid:'130094.0 ', "coordinates": [114.63902, 40.237889] }, 
    { "name": "family2", fid:'130299.0', "coordinates": [115.08722, 37.50227] }, 
    { "name": "family2", fid:'130533.0', "coordinates": [118.89221, 40.31553] }, 
  
  ]
  mapJSON.features = mapJSON.features.map(function (feature) {
    return turf.rewind(feature, { reverse: true });
  })
   let svg = d3.select("svg");
  let width = +svg.attr("width");
  let height = +svg.attr("height");
  //let tooltip = d3.select(".tooltip");
  let projection = d3.geoMercator().fitSize([width, height], mapJSON); 
  
  let path = d3.geoPath().projection(projection);
  let bounds = d3.geoBounds(mapJSON);
  let color = d3.schemeCategory10;
  
  svg.selectAll("path")
    .data(mapJSON.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", "white")
    .attr("stroke", "grey")
    .attr("stroke-linejoin", "round")
  
  

  scenery.forEach(item => {
  
    svg.append("circle")
      .attr("cx", projection(item.coordinates)[0])
      .attr("cy", projection(item.coordinates)[1])
      .attr("r", 5)
      .attr("fill", "red")
      .on("mouseover", function (event, d) {
        console.log(event,item,'====')
        d3.select(".a").text(item.name)
        d3.select(".b").text(item.fid)
        d3.select(".tooltip1").attr("style",`left:${event.pageX+30}px;top:${event.pageY+30}px;display:block`)
        d3.select(this).attr("r", 8)
      })
      .on("mouseout", function (d) {
        d3.selectAll(".tooltip1").attr('style','display:none');
        d3.select(this).attr("r", 5)
      })
    
  
    svg.append("text")
      .attr("x", projection(item.coordinates)[0] + 15)
      .attr("y", projection(item.coordinates)[1] + 5)
      .text(item.name)
      .attr("font-size", "12px")
      .attr("fill", "black");
  
  })
})