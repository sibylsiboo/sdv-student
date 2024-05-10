import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let w = 960;
let h = 640;
let xPadding = 70;
let yPadding = 50;

let viz = d3.select("#viz5")
    .append("svg")
    .attr("class", "viz")
    // .attr("width", w)
    // .attr("height", h)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 "+w+" "+h)
    .style("background-color", "Transparent");

function gotData(incomingData) {
    console.log("Incoming data:", incomingData);

    viz.selectAll("*").remove();

    const expenditureFields = ['food', 'dress', 'house', 'med', 'trco', 'eec'];
    const colors = d3.scaleOrdinal()
        .domain(expenditureFields)
        .range(d3.schemeCategory10);

    const groupedData = d3.group(incomingData, d => d.cyear.value);
    const aggregatedData = Array.from(groupedData, ([cyear, entries]) => {
        const maxValues = {};
        expenditureFields.forEach(field => {
            maxValues[field] = d3.max(entries, entry => entry[field].value);
        });
        return { cyear, ...maxValues };
    });

    const xScale = d3.scaleLinear()
        .domain([2010, 2020])
        .range([xPadding, w - xPadding]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(aggregatedData, d => d3.max(expenditureFields.map(field => d[field])))])
        .range([h - yPadding, yPadding]);

    viz.append("g")
        .attr("transform", `translate(0,${h - yPadding})`)
        .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format("d")));

    viz.append("g")
        .attr("transform", `translate(${xPadding},0)`)
        .call(d3.axisLeft(yScale));

    // Select the container for image groups
    const imageGroups = viz.selectAll(".image-group")
        .data(aggregatedData)
        .enter()
        .append("g")
        .attr("class", "image-group");

    // Enter and append images within each image group
    imageGroups.selectAll("image")
        .data(d => {
            // Extract year and expenditure value pairs from the aggregated data
            return Object.entries(d)
                .filter(entry => entry[0] !== "cyear")
                .map(entry => ({ year: parseInt(d.cyear), field: entry[0], value: entry[1] }));
        })
        .enter()
        .append("image")
        .attr("x", d => xScale(d.year))
        .attr("y", d => yScale(d.value)-40)
        .attr("width", 30) 
        .attr("height", 30) 
        .attr("xlink:href", d => {
            switch (d.field) {
                case 'food':
                    return 'graph5-asset/food.png';
                case 'dress':
                    return 'graph5-asset/dress.png';
                case 'house':
                    return 'graph5-asset/house.png';
                case 'med':
                    return 'graph5-asset/medicine.png';
                case 'trco':
                    return 'graph5-asset/transportation.png';
                case 'eec':
                    return 'graph5-asset/education.png';
                default:
                    return '';
            }
        });

    // Legend
    // const legendWidth = 120;
    // const legendHeight = expenditureFields.length * 20;

    // const legend = viz.append("g")
    //     .attr("class", "legend")
    //     .attr("transform", `translate(${w - legendWidth}, 20)`);

    // legend.selectAll("rect")
    //     .data(expenditureFields)
    //     .enter()
    //     .append("rect")
    //     .attr("x", 0)
    //     .attr("y", (d, i) => i * 20)
    //     .attr("width", 10)
    //     .attr("height", 10)
    //     .attr("fill", d => colors(d));

    // legend.selectAll("text")
    //     .data(expenditureFields)
    //     .enter()
    //     .append("text")
    //     .attr("x", 15)
    //     .attr("y", (d, i) => i * 20 + 9)
    //     .text(d => d)
    //     .attr("alignment-baseline", "middle");
}

function updateData() {
    const family = document.getElementById("familySelect").value;
    d3.json(`${family}_allyears.json`).then(gotData);
}

d3.select("#familySelect").on("change", updateData);

d3.json("f1_allyears.json").then(gotData);
