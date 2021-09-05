    var svg = d3.select("svg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;

    var xScale = d3.scaleBand()
                   .range ([0, width])
                   .padding(0.1),
        yScale = d3.scaleLinear()
                   .range ([height, 0]);

    var g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");

    d3.csv("alphabet.csv", function(error, data) {
        if (error) {
            throw error;
        }

        xScale.domain(data.map(function(d) {return d.letter; }));
        yScale.domain([0, d3.max(data, function(d) {return d.frequency; })]);

        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale))
         .append("text")
         .attr("y", height - 250)
         .attr("x", width - 100)
         .attr("text-anchor", "end")
         .attr("stroke", "black")
         .text("Letter");

        g.append("g")
         .call(d3.axisLeft(yScale).tickFormat(function(d){
            return (d*100) + "%";
         })
         .ticks(10))
         .append("text")
         .attr("transform", "rotate(-90)")
         .attr("y", 6)
         .attr("dy", "-5.1em")
         .attr("text-anchor", "end")
         .attr("stroke", "black")
         .text("Frequency");

        g.selectAll(".bar")
         .data(data)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("fill", "green")
         .attr("x", function(d) { return xScale(d.letter); })
         .attr("y", function(d) { return yScale(d.frequency); })
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) {return height - yScale(d.frequency); });
    });