// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

//import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let w = 1200;
let h = 800;

let viz = d3.select("#viz4")
    .append("svg")
    .attr("class", "viz")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + w + " " + h)
    .style("background-color", "Transparent");

function gotData(allData) {
    let f1data = allData[0];
    let f2data = allData[1];
    let f3data = allData[2];

    //default data selection

    let selectedData = f1data;

    function updateVisualization(data) {
        let expenditureData = data.map(d => {
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

        // Update
        let expenditureBars = viz.selectAll(".expenditure-bar")
            .data(expenditureData);

        expenditureBars.enter()
            .append("rect")
            .attr("class", "expenditure-bar")
            .merge(expenditureBars)
            // .transition()
            // .duration(1000)
            .attr("x", d => xScale(d.year))
            .attr("y", d => yScale(d.expenditure))
            .attr("width", xScale.bandwidth() / 2)
            .attr("height", d => h - 50 - yScale(d.expenditure))
            .attr("fill", "#C64A44");

        expenditureBars.exit().remove();

        // Append images on top of each expenditure rectangle
        let expenditureImages = viz.selectAll(".expenditure-image")
            .data(expenditureData);

        expenditureImages.enter()
            .append("image")
            .attr("class", "expenditure-image")
            .attr("x", d => xScale(d.year))
            .attr("y", d => yScale(d.expenditure) - 20) // Adjust the positioning as needed
            .attr("width", xScale.bandwidth() / 2)
            .attr("height", 20) // Adjust the height of the image as needed
            .attr("xlink:href", "graph4-asset/expenditures.png")
            .attr("preserveAspectRatio", "xMidYMid meet");

        expenditureImages.exit().remove();

        // Update savings bars
        let savingsBars = viz.selectAll(".savings-bar")
            .data(expenditureData);

        savingsBars.enter()
            .append("rect")
            .attr("class", "savings-bar")
            .merge(savingsBars)
            // .transition()
            // .duration(1000)
            .attr("x", d => xScale(d.year) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(d.savings))
            .attr("width", xScale.bandwidth() / 2)
            .attr("height", d => h - 50 - yScale(d.savings))
            .attr("fill", "green");

        savingsBars.exit().remove();

        // Append images on top of each savings rectangle
        let savingsImages = viz.selectAll(".savings-image")
            .data(expenditureData);

        savingsImages.enter()
            .append("image")
            .attr("class", "savings-image")
            .attr("x", d => xScale(d.year) + xScale.bandwidth() / 2)
            .attr("y", d => yScale(d.savings) - 20) // Adjust the positioning as needed
            .attr("width", xScale.bandwidth() / 2)
            .attr("height", 20) // Adjust the height of the image as needed
            .attr("xlink:href", "graph4-asset/savings.png")
            .attr("preserveAspectRatio", "xMidYMid meet");

        savingsImages.exit().remove();

        // x-axis
        viz.select(".x-axis")
            .transition()
            .duration(1000)
            .call(d3.axisBottom(xScale));

        // Update y-axis
        viz.select(".y-axis")
            .transition()
            .duration(1000)
            .call(d3.axisLeft(yScale));
    }
    updateVisualization(selectedData);

    d3.select("#family-select").on("change", function () {
        let selectedValue = this.value;
        if (selectedValue === "f1") {
            selectedData = f1data;
        } else if (selectedValue === "f2") {
            selectedData = f2data;
        } else if (selectedValue === "f3") {
            selectedData = f3data;
        }
        // Clear previous visualization
        viz.selectAll("*").remove();
        // Update visualization with new data
        updateVisualization(selectedData);
    });
}

Promise.all([
    d3.json("f1_allyears.json"),
    d3.json("f2_allyears.json"),
    d3.json("f3_allyears.json")
]).then(gotData);
