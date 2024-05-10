 import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let w = 1200;
let h = 800;

let viz = d3.select("#container")
    .append("svg")
    .attr("class", "viz")
    .attr("width", w)
    .attr("height", h)
    .style("background-color", "rgb(255 255 255)");

function gotData(allData) {
    let f1data = allData[0];
    let f2data = allData[1];
    let f3data = allData[2];

    // Calculate total expenditure and savings for each year
    let expenditureData = f3data.map(d => {
        let totalExpenditure = d.food.value + d.dress.value + d.house.value + d.med.value + d.trco.value + d.eec.value;
        return {
            year: d.cyear.value,
            expenditure: totalExpenditure,
            savings: d.savings.value
        };
    });

    // x & y scale
    let xScale = d3.scaleBand()
        .domain(expenditureData.map(d => d.year))
        .range([50, w - 50])
        .padding(0.1);

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(expenditureData, d => Math.max(d.expenditure, d.savings))])
        .range([h - 50, 50]);

    // total expenditure bar
    viz.selectAll(".expenditure-bar")
    .data(expenditureData)
    .enter()
    .append("rect")
    .attr("class", "expenditure-bar")
    .attr("x", d => xScale(d.year))
    .attr("y", d => h - 50) // Initial position at the bottom
    .attr("width", xScale.bandwidth() / 2)
    .attr("height", 0) // Initial height
    .attr("fill", "#C64A44")
       .transition() // Transition to final position
       .duration(1000) // Animation duration
       .attr("y", d => yScale(d.expenditure))
       .attr("height", d => h - 50 - yScale(d.expenditure));


        // .each(function(d) {
        //     // Append text labels for expenditure values
        //     d3.select(this.parentNode)
        //         .append("text")
        //         .attr("class", "expenditure-value")
        //         .attr("x", xScale(d.year) + xScale.bandwidth() / 4)
        //         .attr("y", yScale(d.expenditure) - 10)
        //         .attr("text-anchor", "middle")
        //         .style("fill", "black")
        //         .text(d.expenditure);
        // });

    // savings bar
    viz.selectAll(".savings-bar")
    .data(expenditureData)
    .enter()
    .append("rect")
    .attr("class", "savings-bar")
    .attr("x", d => xScale(d.year) + xScale.bandwidth() / 2)
    .attr("y", d => h - 50) // Initial position at the bottom
    .attr("width", xScale.bandwidth() / 2)
    .attr("height", 0) // Initial height
    .attr("fill", "#8FAF6B")
       .transition() // Transition to final position
       .duration(1000) // Animation duration
       .attr("y", d => yScale(d.savings))
       .attr("height", d => h - 50 - yScale(d.savings));
        // .each(function(d) {
        //     d3.select(this.parentNode)
        //         .append("text")
        //         .attr("class", "savings-value")
        //         .attr("x", xScale(d.year) + xScale.bandwidth() * 3 / 4)
        //         .attr("y", yScale(d.savings) - 10)
        //         .attr("text-anchor", "middle")
        //         .style("fill", "black")
        //         .text(d.savings);
        // });

    // x-axis
    viz.append("g")
        .attr("transform", `translate(0, ${h - 50})`)
        .call(d3.axisBottom(xScale));

    // y-axis
    viz.append("g")
        .attr("transform", `translate(50, 0)`)
        .call(d3.axisLeft(yScale));
}

Promise.all([
    d3.json("f1_allyears.json"),
    d3.json("f2_allyears.json"),
    d3.json("f3_allyears.json")
]).then(gotData);
