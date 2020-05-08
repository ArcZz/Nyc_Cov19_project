
var width = 960,  height = 1160;

var projection = d3.geo.mercator()
                    .scale(10000)
                    .translate([width / 2, height / 2]);

var svg = d3.select("#d3map").append("svg")
            .attr("width", width)
            .attr("height", height);

d3.json("data/NTA.geojson", function(error, NYC_MapInfo) {

// after loading geojson, use d3.geo.centroid to find out 
// where you need to center your map
var center = d3.geo.centroid(NYC_MapInfo);
projection.center(center);

// now you can create new path function with 
// correctly centered projection
var path = d3.geo.path().projection(projection);

// and finally draw the actual polygons
svg.selectAll("path")
  .data(NYC_MapInfo.features)
  .enter()
  .append("path")
  .attr("d", path);
});