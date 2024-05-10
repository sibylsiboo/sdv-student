import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let w = 1200;
let h = 800;
let barPadding = 5;
let duration = 1000;

let viz = d3.select("#container")
  .append("svg")
     .attr("class", "viz")
     .attr("width", w)
     .attr("height", h)
     .style("background-color", "rgb(255 255 255)");

function updateBars(data) {
    let maxIncome = d3.max(data, d => d.fincome1.value);
    
    let yScale = d3.scaleBand()
        .domain(data.map(d => d.description))
        .range([h - 50, 0])
        .padding(0.1);

    let bars = viz.selectAll(".bar")
        .data(data, d => d.description);

    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", d => yScale(d.description))
        .attr("height", yScale.bandwidth() - barPadding)
        .attr("x", 0)
        .attr("width", d => (d.fincome1.value / maxIncome) * (w - 100))
        .attr("fill", "steelblue")
      .merge(bars)
        .transition()
        .duration(duration)
        .attr("width", d => (d.fincome1.value / maxIncome) * (w - 100));

    let labels = viz.selectAll(".label")
        .data(data, d => d.description);

    labels.enter()
        .append("text")
        .attr("class", "label")
        .attr("x", 10)
        .attr("y", d => yScale(d.description) + yScale.bandwidth() / 2)
        .text(d => d.description)
        .attr("alignment-baseline", "middle")
        .attr("fill", "black");

    labels.exit().remove();
}

function animate(data) {
    let years = Object.keys(data);

    let index = 0;

    function animateYear() {
        let year = years[index];
        updateBars(data[year]);
        index++;
        if (index < years.length) {
            setTimeout(animateYear, duration);
        }
    }

    animateYear();
}

function gotData(incomingData) {
    console.log(incomingData);

    // Prepare data for animation
    let dataByYear = {};
    incomingData.forEach(function(d) {
        let year = d.cyear.value;
        if (!(year in dataByYear)) {
            dataByYear[year] = [];
        }
        let fields = Object.keys(d);
        fields.forEach(function(field) {
            if (field !== "cyear" && field !== "fid10" && field !== "fincome1") {
                dataByYear[year].push({
                    description: d[field].description,
                    fincome1: d.fincome1,
                    value: d[field].value
                });
            }
        });
    });

    animate(dataByYear);
}

d3.json("f1_allyears.json").then(gotData);
