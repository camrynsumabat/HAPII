// dynamic y axis bar graph

var fileName = "../data/alphabet.csv";

d3.csv(fileName, function(error, data) {
    if (error) { throw error; }
    makeVis(data);
});

// initialize graph container
var makeVis = function(data) {

    // define dimensions of container
    var svg = d3.select("svg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;

    // make x and y scale
    var xScale = d3.scaleBand()
                   .domain(data.map(function(d) { return d.letter; }))
                   .range ([0, width])
                   .padding(0.1),
        yScale = d3.scaleLinear()
                   .range ([height, 0]);

    // create canvas
    var canvas = svg.append("g")
                    .attr("transform", "translate(" + 100 + "," + 100 + ")");

    // make x-axis and add to canvas
    var xAxis = d3.axisBottom(xScale);

    canvas.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height +")")
          .call(xAxis)
          .append("text")
          .attr("y", height - 250)
          .attr("x", width - 100)
          .attr("text-anchor", "end")
          .attr("stroke", "black")
          .text("Letter");

    // make y-axis and add to canvas
    var yAxis = d3.axisLeft(yScale);

    var yAxisHandleForUpdate = canvas.append("g")
                                     .attr("class", "y axis")
                                     .call(yAxis);

    yAxisHandleForUpdate.append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", "-5.13em")
                        .attr("text-anchor", "end")
                        .attr("stroke", "black")
                        .text("Frequency (%)");

    var updateBars = function(data, inc) {

        // update the y-axis domain to match data
        yScale.domain([0, d3.max(data, function(d) {
                return d.frequency;
        })]);

        yAxisHandleForUpdate.transition().duration(1000).call(yAxis.tickFormat(function(d) {
            return Math.round(d*inc) + "%";
        }).ticks(10));

        var bars = canvas.selectAll("rect").data(data);

        // add bars for new data
        bars.enter().append("rect")
            .merge(bars)
            .transition()
            .duration(1000)
            .attr("class", "bar")
            .attr("fill", "green")
            .attr("x", function(d) { return xScale(d.letter); })
            .attr("width", xScale.bandwidth())
            .attr("y", function(d) { return yScale(d.frequency/(inc/100)); })
            .attr("height", function(d) {return height - yScale(d.frequency/(inc/100)); });

        // remove old bars
        bars.exit().remove();

    };

    // handler for dropdown value change
    d3.select("#options").on("change", function(d) {
        var sect = document.getElementById("options");
        var inc = sect.options[sect.selectedIndex].value;
        updateBars(data, inc);
    });

    // initial data
    updateBars(data, 100);
};