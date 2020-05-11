var width = 960,
  height = 960;
var draw = 0;



var projection = d3.geoMercator()
  .scale(81000)
  .translate([width / 2, height / 2]);

var svg = d3.select("#d3map")
  .append("svg")
  .attr("viewBox", [0, 0, 960, 960]);




// var color = d3.scaleSequential(d3.interpolateYlOrRd)
//               .domain(d3.extent(data, d => d[encoding_defaults.color]))
//               .domain(d3.extent(data.map(function (item) {
//             return (item.glazed);
//     }))
//    )

//               .unknown('#eee')

d3.queue()
  .defer(d3.json, "data/nyctopo.json")
  .defer(d3.csv, "data/zdata.csv")
  .await(makeMap);


function makeMap(error, nyctopo, zdata) {

  if (error) throw error;
  // console.log(data.objects.zipcode.geometries.)

  var num = {}; // Create empty object for holding dataset
  var posi = [];
  zdata.forEach(function (d) {

    num[d.MODZCTA] = +parseInt(d.Positive);
    posi.push(parseInt(d.Positive))

  });
  console.log(num[11209])


  var color = d3.scaleSequential(d3.interpolateYlOrRd)
    .domain(d3.extent(posi))


  //   d3.max(data, function(d){ return d.value; })
  //   ])    


  var nyc = topojson.feature(nyctopo, nyctopo.objects.zipcode);
  // projection.fitExtent([[0, 0],[960, 960],], nyc);
  projection = d3.geoIdentity()
    .reflectY(true)
    .fitSize([width, height], nyc)




  svg.selectAll("path")
    .data(nyc.features)
    .enter().append("path")
    .attr("d", d3.geoPath().projection(projection))
    .attr("stroke", "#747473")
    .attr("stroke-width", .8)

    .attr("fill", function (d) {
      var zipcode = d.properties.zipcode;
      console.log(num[zipcode])
      if (typeof (num[zipcode]) == "undefined") {
        return "Lavender";
      }
      //d.total = data.get(d.id) || 0;
      return color(num[zipcode]);
    })
    // .attr('fill', 'Lavender')

    // .attr("fill", function(d,i){
    //       return d3.color(i);
    //     })
    .on("mouseover", function (d, i) {

      var zipcode = d.properties.zipcode;
      if (typeof (num[zipcode]) == "undefined") {
        return "Lavender";
      }

      //d3.select(this).attr("fill",color(num[zipcode]));
      d3.select(this).attr("fill", '#add588');

    })
    // .on("mouseout",function(d,i){
    //     d3.select(this).attr("fill",d3.color(i));
    //   });
    .on("mouseout", function (d, i) {
      var zipcode = d.properties.zipcode;
      if (typeof (num[zipcode]) == "undefined") {
        return "Lavender";
      }
      d3.select(this).attr("fill", color(num[zipcode]));
    });




};




// let mouseOver = function(d) {
//   d3.selectAll(".zipcode")
//     .transition()
//     .duration(0)
//     .style("opacity", .6)
//   d3.select(this)
//     .transition()
//     .duration(200)
//     .style("opacity", 1)
//     .style("stroke", "black")
// }

// let mouseLeave = function(d) {
//   d3.selectAll(".zipcode")
//     .transition()
//     .duration(200)
//     .style("opacity", .8)
//   d3.select(this)
//     .transition()
//     .duration(200)
//     .style("stroke", "transparent")
// }

// var center = d3.geoCentroid(nyc);
// projection.center(center)
// projection.fitExtent([[0, 0],[960, 960],], nyc);


// svg.selectAll("path")
//   .data(nyc.features)
//   .enter()
//   .append("path")
//   .attr("d", d3.geoPath().projection(projection))
//   .attr("stroke","#747473")
//   .attr("stroke-width",.8)
//   .attr('fill', 'Lavender')
//   // .attr("fill", function (d) {
//   //   d.total = data.get(d.id) || 0;
//   //   return colorScale(d.total);
//   // })
//   // .attr("fill", function(d,i){
//   //       return d3.color(i);
//   //     })
//   .on("mouseover",function(d,i){
//       d3.select(this).attr("fill","yellow");
//       })
//   // .on("mouseout",function(d,i){
//   //     d3.select(this).attr("fill",d3.color(i));
//   //   });
//   .on("mouseout",function(d,i){
//       d3.select(this).attr("fill",'Lavender');
//     });      






// my_info = (data) => {
//   const info = document.getElementById('graphic-info');

//   if (!info) return;

//   if (data) info.innerHTML = `<div class="info">
//     <h4>${data.zipcode}</h4>
//     <h5>${new RegExp(`${data.borough}$`).test(data.neighborhood)
//       ? data.neighborhood || data.po_name
//       : `${data.neighborhood}, ${data.borough}`}</h5>
//     <table>
//       <tr>
//         <th>Population</th>
//         <td>${format_int(data.population)} (${format_int(data.density)} people per sq mi)</td>
//       </tr>
//       <tr>
//         <th>Tests</th>
//         <td>${format_int(data.tested || 0)}${data.tested && ` (${format_int(data.tested_per_1k)} of every 1k residents)` || ''}</td>
//       </tr>
//       <tr>
//         <th>Positives</th>
//         <td>${format_int(data.positive || 0)}${data.positive && ` (${format_percent(data.positive_ratio)}, ${format_int(data.positive_per_1k)} of every 1k residents)` || ''}</td>
//       </tr>
//       <tr>
//         <th>Income</th>
//         <td>${data.agi_total &&
//           `<ul>
//             ${[25, 50, 75, 100, 200]
//               .map(agi => [`$${agi}k`, format_percent(data[`agi_lt${agi}`])])
//               .map(([key, value]) => `<li>${value} made under ${key} in 2017</li>`)
//               .join('')}
//           </ul>` || '—'
//         }</td>
//       </tr>
//     </table>
//   </div>`;

//   else info.innerHTML = '';
// }