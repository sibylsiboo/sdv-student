// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let colorMap = {
    130299: "#FFBF00",
    130094: "#00D22E",
    130533: "#D70087"
}


let w = 1200;
let h = 800;

let viz = d3.select("#container")
  .append("svg")
  .attr("class", "viz")
  .attr("width", w)
  .attr("height", h)
  .style("background-color", "rgb(255 255 255)");

function gotData(allData) {
    console.log(allData)
    let f1data = allData[0];
    let f2data = allData[1];
    let f3data = allData[2];

    // Calculate total expenditure and savings for each year

    // let expenditureData = f3data.map(d => {
    //     let totalExpenditure = d.food.value + d.dress.value + d.house.value + d.med.value + d.trco.value + d.eec.value;
    //     return {
    //         year: d.cyear.value,
    //         expenditure: totalExpenditure,
    //         savings: d.savings.value
    //     };
    // });

    


    let timeParse = d3.timeParse("%Y")
    f1data = f1data.map(d=>{
        d.cyear.value = timeParse(d.cyear.value)
        return d
    }) 
    f2data = f2data.map(d=>{
        d.cyear.value = timeParse(d.cyear.value)
        return d
    }) 
    f3data = f3data.map(d=>{
        d.cyear.value = timeParse(d.cyear.value)
        return d
    }) 



    let timeExtent = d3.extent(f1data, d=>d.cyear.value)
    console.log(timeExtent)
    // x & y scale
    let xScale = d3.scaleTime()
        .domain(timeExtent)
        .range([50, w - 50])
        // .padding(0.1);

    let combinedData = f1data.concat(f2data).concat(f3data)
    console.log(combinedData)

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(combinedData, d => d.savings.value)])
        .range([h - 50, 50]);

    let lineMaker = d3.line()
        .x(d=>xScale(d.cyear.value))
        .y(d=>yScale(d.savings.value))
        .curve(d3.curveMonotoneX98)
    ;


    function averageTheData(dataToAverage){
        let groupedByYear = d3.groups(dataToAverage, d=>d.cyear.value);
        let averageEachYear = groupedByYear.map(d=>{
            if(d[1].length == 1){
                return d[1][0]
            }else{
                // console.log(Object.keys(d[1][0]))
                let newDataPoint = {}
                for(key of Object.keys(d[1][0])){
                    if(key == "cyear" || key == "ft501"){
                        newDataPoint[key] = d[1][0][key]
                        continue
                    } 

                    // console.log(key)
                    let sum = 0
                    for(record of d[1]){
                        // console.log("    ", record[key])
                        sum += record[key].value;
                        if(isNaN(record[key].value)){
                            console.log("bad key", key)
                            alert("cant compute average, check the code sibyl!!!")
                        }
                    }
                    let average = sum/d[1].length
                    newDataPoint[key] = {value: average, description: d[1][0][key].description};
                    // console.log("    ", average)
                }
                return newDataPoint
            }
            // return d
        })
        return averageEachYear.sort((a, b)=>a.cyear.value-b.cyear.value)
    }

    let f1average = averageTheData(f1data);
    let f2average = averageTheData(f2data);
    let f3average = averageTheData(f3data);
    // console.log(f2average)


    // totall expenditure bar
    viz.selectAll(".expenditure-line")
        .data([ f1average, f2average, f3average])
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", function(d){
            console.log(d)
            let famID = d[0].fid10.value;
            console.log(famID, colorMap[famID])
            // if(famID == )
            return colorMap[famID]
        })
        .attr("stroke-width", 3)
        .attr("d", lineMaker)

        // .attr("class", "expenditure-bar")
        // .attr("x", d => xScale(d.year))
        // .attr("y", d => yScale(d.expenditure))
        // .attr("width", xScale.bandwidth() / 2)
        // .attr("height", d => h - 50 - yScale(d.expenditure))
        // .attr("fill", "grey")
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

    // // savings bar
    // viz.selectAll(".savings-bar")
    //     .data(expenditureData)
    //     .enter()
    //     .append("rect")
    //     .attr("class", "savings-bar")
    //     .attr("x", d => xScale(d.year) + xScale.bandwidth() / 2)
    //     .attr("y", d => yScale(d.savings))
    //     .attr("width", xScale.bandwidth() / 2)
    //     .attr("height", d => h - 50 - yScale(d.savings))
    //     .attr("fill", "black")
    //     .each(function(d) {
            
    //         d3.select(this.parentNode)
    //             .append("text")
    //             .attr("class", "savings-value")
    //             .attr("x", xScale(d.year) + xScale.bandwidth() * 3 / 4)
    //             .attr("y", yScale(d.savings) - 10)
    //             .attr("text-anchor", "middle")
    //             .style("fill", "black")
    //             .text(d.savings);
    //     });

    // //  x-axis
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
