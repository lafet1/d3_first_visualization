
// basic SVG object
var svg = d3.select("svg"),
    margin = 50,
    width = svg.attr("width") - 2 * margin,
    height = svg.attr("height") - margin

// tick labels
var tick_labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 
                    'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// scales of my axis
var xScale = d3.scaleBand().range([0, width]).padding(0.15),
    yScale = d3.scaleLinear().range([height - 70, 0]);

// grouping
var g = svg.append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")");




d3.csv("meteo.csv", function(d){ 

   return {
       year : d.year,
       month : d.month,
       day : d.day,
       temperature : +d.temperature // changing temperature to float
   };


    }, 
    
    function(data) {

    var year0 = d3.min(data, function(d) { return d.year; }),
        year1 = d3.max(data, function(d) { return d.year; }),
        year = year1;

    // title
    svg.append("text")
        .attr("class", "title")
        .attr("transform", "translate(100,0)")
        .attr("x", 50)
        .attr("y", 50)
        .attr("font-size", "24px")
        .text("Average temperature at Schiphol airport " + year);

    // just one year, interactive filter needed
    var filtered_data = data.filter(function (el) {
        return el.year === year
    
        });

    // just two columns
   var small_data = filtered_data.map(function(d) {
            return {
               month : d.month,
               temperature : d.temperature
           };

   });

   // taking the average
   var temp_by_month = d3.nest()
           .key(function(d) {    
                return d.month
            ;})
           .rollup(function(v) {
               return d3.mean(v, function(d) {
                   return d.temperature / 10;
               })
           })
           .entries(small_data);
   
    
    
   xScale.domain(data.map(function(d) { return d.month; }));
   yScale.domain([0, d3.max(temp_by_month, function(d) { 
        return d.value; })]);

   g.append("g")
        .attr("transform", `translate(0, ${height - 70})`)
        .call(d3.axisBottom(xScale)
              .tickFormat(function(d, i){ return tick_labels[i] }));
        /*
        .append("text")
        .attr("y", height - margin)
        .attr("x", width - margin)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Month");
        */

    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale));
        /*
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("Temperature");
        */

    g.selectAll(".bar")
        .data(temp_by_month)
        .enter().append("rect") 
        .attr("class", "bar") 
        .attr("x", function(d) { return xScale(d.key); })
        .attr("y", function(d) { return yScale(d.value); })
        .attr("width", xScale.bandwidth()) 
        .attr("height", function(d) { 
            return height - 70 - yScale(d.value); });

    g.selectAll(".bartext")
        .data(temp_by_month)
        .enter()
        .append("text")
        .attr("class", "bartext")
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr('font-size', '14')
        .attr("fill", 'rgba(0, 0, 0, 0.5)')
        .attr("x", function(d) {
            return xScale(d.key) + xScale.bandwidth() / 2;
        })
        .attr("y", function(d) {
            return yScale(d.value + 0.2);
        })
        .text(d => d.value.toFixed(1));

    // Allow the arrow keys to change the displayed year.
    window.focus();
    d3.select(window).on("keydown", function() {
        switch (d3.event.keyCode) {
        case 37: year = Math.max(year0, parseInt(year) - 1); break;
        case 39: year = Math.min(year1, parseInt(year) + 1); break;
        }
        update();
    });

    function update() {
        year = String(year)
        console.log(typeof year)
        console.log(year)

        
        svg.select('text.title')
            .text("Average temperature at Schiphol airport " + year);

        filtered_data = data.filter(function (el) {
            return el.year === year
        
            });
    
        // just two columns
        small_data = filtered_data.map(function(d) {
                return {
                    month : d.month,
                    temperature : d.temperature
                };
    
        });
    
        // taking the average
        temp_by_month = d3.nest()
                .key(function(d) {    
                    return d.month
                ;})
                .rollup(function(v) {
                    return d3.mean(v, function(d) {
                        return d.temperature / 10;
                    })
                })
                .entries(small_data);
        


        yScale.domain([0, d3.max(temp_by_month, function(d) { 
                return d.value; })]);
        
        g.select(".y.axis").transition()
            .call(d3.axisLeft(yScale));


     

        g.selectAll(".bar")
            .data(temp_by_month)
            .attr("x", function(d) { return xScale(d.key); })
            .attr("y", function(d) { return yScale(d.value); })
            .attr("width", xScale.bandwidth()) 
            .attr("height", function(d) { 
                return height - 70 - yScale(d.value); });

        g.selectAll(".bartext")
            .data(temp_by_month)
            .attr("class", "bartext")
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .attr("x", function(d) {
                return xScale(d.key) + xScale.bandwidth() / 2;
            })
            .attr("y", function(d) {
                return yScale(d.value + 0.2);
            })
            .text(d => d.value.toFixed(1));

    }
});
    
