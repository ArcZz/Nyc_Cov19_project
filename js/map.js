
var width = 960,  height = 960;

var projection = d3.geoMercator()
                    .scale(81000)
                    .translate([width / 2, height / 2]);

var svg = d3.select("#d3map")
            .append("svg")
            .attr("viewBox", [0, 0, 960, 960]);
   


d3.json("data/zip.geojson", function(error, nyc) {
    if (error){
        return console.error(error);
    }
    
    // var center = d3.geoCentroid(nyc);
    // projection.center(center)
    projection.fitExtent(
      [
          [0, 0],
          [960, 960],
      ], nyc);
    var path = d3.geoPath().projection(projection);

    svg.selectAll("path")
      .data(nyc.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("stroke","#faf9f8")
      .attr("stroke-width",1)
      .attr('fill', 'Lavender')
      // .attr("fill", function(d,i){
      //       return d3.color(i);
      //     })
      .on("mouseover",function(d,i){
          d3.select(this).attr("fill","yellow");
          })
      // .on("mouseout",function(d,i){
      //     d3.select(this).attr("fill",d3.color(i));
      //   });
      .on("mouseout",function(d,i){
          d3.select(this).attr("fill",'Lavender');
        });      


});