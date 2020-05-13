// var $animation_elements = $('.animation-element');
// var $window = $(window);

// function check_if_in_view() {
//   var window_height = $window.height();
//   var window_top_position = $window.scrollTop();
//   var window_bottom_position = (window_top_position + window_height);

//   $.each($animation_elements, function() {
//     var $element = $(this);
//     var element_height = $element.outerHeight();
//     var element_top_position = $element.offset().top;
//     var element_bottom_position = (element_top_position + element_height);

//     //check to see if this current container is within viewport
//     if ((element_bottom_position >= window_top_position) &&
//       (element_top_position <= window_bottom_position)) {
//       $element.addClass('in-view');
//     } else {
//       $element.removeClass('in-view');
//     }
//   });
// }

// $window.on('scroll resize', check_if_in_view);
// $window.trigger('scroll');


var odometer = new Odometer({
  el: $('.odometer')[0],
  value: 0,
  theme: 'minimal',
  duration: 1000
});
odometer.render();


$(window).scroll(function () {
  var height = $(window).scrollTop();
  var flag = 0;
  if ((height > 500) && (flag == 0)) {
    flag = 1;
    // var iframe = $("#b");
    // iframe.attr("src", iframe.data("src"));
    $('#o1').text(184319);
    $('#o2').text(15101);
    $('#o3').text(48939);


  }
});






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
  .defer(d3.json, "data/nyctop.json")
  .defer(d3.csv, "data/zdata.csv")
  .await(makeMap);


function toPercent(point) {
  var str = Number(point * 100).toFixed(2);
  str += "%";
  return str;
}

function makeMap(error, nyctopo, zdata) {

  if (error) throw error;
  // console.log(data.objects.zipcode.geometries.)

  var num = {}; // Create empty object for holding dataset
  var posi = [];
  zdata.forEach(function (d) {

    num[d.MODZCTA] = +parseInt(d.Positive);
    posi.push(parseInt(d.Positive))

  });


  var color = d3.scaleSequential(d3.interpolateYlOrRd)
    .domain(d3.extent(posi))


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

      if (typeof (num[zipcode]) == "undefined") {
        return "Lavender";
      }

      return color(num[zipcode]);
    })

    .on("mouseover", function (d, i) {


      var zipcode = d.properties.zipcode;
      if (typeof (num[zipcode]) == "undefined") {
        return "Lavender";
      }
      //d3.select(this).attr("fill",color(num[zipcode]));
      d3.select(this).attr("fill", '#73bd41');


      $("#myzip").text(d.properties.zipcode + " " + "(" + d.properties.borough + ")");
      $("#myname").text(d.properties.neighborhood);
      $("#myboro").text(d.properties.borough);
      $("#po_name").text(d.properties.po_name);
      $("#mypos").text(d.properties.positive_num);
      $("#mytest").text(d.properties.test_num);
      $("#myrate").text(d.properties.zcta_prec);
      $("#mypop").text(d.properties.population);
      $("#inco1").text(toPercent(d.properties.agi_1_lt25 / d.properties.agi_total));
      $("#inco2").text(toPercent(d.properties.agi_25_lt50 / d.properties.agi_total));
      $("#inco3").text(toPercent(d.properties.agi_50_lt75 / d.properties.agi_total));
      $("#inco4").text(toPercent(d.properties.agi_75_lt100 / d.properties.agi_total));
      $("#inco5").text(toPercent(d.properties.agi_100_lt200 / d.properties.agi_total));
      $("#inco6").text(toPercent(d.properties.agi_gte200 / d.properties.agi_total));


    })

    .on("mouseout", function (d, i) {
      var zipcode = d.properties.zipcode;
      if (typeof (num[zipcode]) == "undefined") {
        return "Lavender";
      }
      d3.select(this).attr("fill", color(num[zipcode]));
    });


};



$(document).ready(function () {
  $(".dropdown-item").click(function () {
    var val = $(this).attr("id");
    switch (val) {
      case "dpd2":
        console.log(val)
        $("#showingmap").attr('src',"nycrate.html"); 
        break;
      case "dpd3":
        $("#showingmap").attr('src',"zctab.html"); 
        break;
      case "dpd4":
        $("#showingmap").attr('src',"zctap.html"); 
        break;
      default:
         $("#showingmap").attr('src',"nycnum.html");
    }
});
 $(".borobutton").click(function () {
    var val = $(this).attr("id");
    switch (val) {
      case "img1":
        console.log(val)
        $("#showimag").attr('src',"picture/part1/bronx_data.png"); 
        break;
      case "img2":
        $("#showimag").attr('src',"picture/part1/borrklyn_data.png"); 
        break;
      case "img3":
        $("#showimag").attr('src',"picture/part1/manhattan_data.png"); 
        break;
      case "img4":
        $("#showimag").attr('src',"picture/part1/queens_data.png"); 
        break;
      default:
         $("#showimag").attr('src',"picture/part1/Staten_Island_data.png");
    }

  });


});

