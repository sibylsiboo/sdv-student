import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let w = d3.select("#container").style("width").split("px").shift();
let h = window.innerHeight;
let xPadding = 70;
let yPadding = 50;

// let tooltip = d3.select("#container")
//   .append("div")
//   .style("opacity", 0)
//   .attr("class", "tooltip")
//   .style("position", "absolute")
//   .style("background-color", "white")
//   .style("padding", "10px")
//   .style("border", "solid")
//   .style("border-width", "1px")
//   .style("border-radius", "5px");

let viz = d3.select("#container")
  .append("svg")
     .attr("class", "viz")
     .attr("width", w)
     .attr("height", h)
     .style("background-color", "rgb(255 255 255)");

     function gotData(incomingData) {
        console.log(incomingData);
    
        // Clear the previous visualization
        viz.selectAll("*").remove();
    
        // Extract required fields and prepare data for visualization
        const expenditureFields = ['food', 'dress', 'house', 'med', 'trco', 'eec'];
        const colors = d3.scaleOrdinal()
            .domain(expenditureFields)
            .range(d3.schemeCategory10); // Assigning different colors to each expenditure field
    
        // Group data by 'cyear' and keep only the maximum value for each year
        const groupedData = d3.group(incomingData, d => d.cyear.value);
        const aggregatedData = Array.from(groupedData, ([cyear, entries]) => {
            const maxValues = {};
            expenditureFields.forEach(field => {
                maxValues[field] = d3.max(entries, entry => entry[field].value);
            });
            return { cyear, ...maxValues };
        });
    
        // Set up scales for x and y axes
        const xScale = d3.scaleLinear()
            .domain([2010, 2020]) // Assuming data spans from 2010 to 2020
            .range([xPadding, w - xPadding]);
    
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(aggregatedData, d => d3.max(expenditureFields.map(field => d[field])))])
            .range([h - yPadding, yPadding]);
    
        // Set up line generator
        const line = d3.line()
            .x(d => xScale(d.cyear))
            .y(d => yScale(d.value))
            .curve(d3.curveMonotoneX); 
    
        // Draw x-axis
        viz.append("g")
            .attr("transform", `translate(0,${h - yPadding})`)
            .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format("d")));
    
        // Draw y-axis
        viz.append("g")
            .attr("transform", `translate(${xPadding},0)`)
            .call(d3.axisLeft(yScale));
    
        // Plot lines for each expenditure field
        expenditureFields.forEach((field, i) => {
            viz.append("path")
                .datum(aggregatedData)
                .attr("fill", "none")
                .attr("stroke", colors(field))
                .attr("stroke-width", 2)
                .attr("d", line)
                .attr("d", d => line(d.map(entry => ({cyear: entry.cyear, value: entry[field]}))))
                .on("mouseover", function(event, d) {
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                    tooltip.html(`${field}: ${d[field]}`)
                        .style("left", (event.pageX) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
        });
    
        // Add legend
        const legendWidth = 120; // Adjust as needed
        const legendHeight = expenditureFields.length * 20; // Adjust as needed
    
        const legend = viz.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${w - legendWidth}, 20)`); // Position the legend at the top right
    
        legend.selectAll("rect")
            .data(expenditureFields)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", (d, i) => i * 20)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", d => colors(d));
    
        legend.selectAll("text")
            .data(expenditureFields)
            .enter()
            .append("text")
            .attr("x", 15)
            .attr("y", (d, i) => i * 20 + 9)
            .text(d => d)
            .attr("alignment-baseline", "middle");
    
        // Style the chart
    }

function updateData() {
    const family = document.getElementById("familySelect").value;
    d3.json(`${family}_allyears.json`).then(gotData);
}

d3.select("#familySelect").on("change", updateData);

// Load default data
d3.json("f1_allyears.json").then(gotData);
