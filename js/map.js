var width = 960,
  height = 960;
 fetchdata = 0;

var projection = d3.geoMercator()
  .scale(81000)
  .translate([width / 2, height / 2]);

var svg = d3.select("#d3map")
  .append("svg")
  .attr("viewBox", [0, 0, 960, 960]);

// var anima = d3.select("#anima")
//   .append("svg")
//   .attr("viewBox", [0, 0, 960, 960]);


function toPercent(point) {
  var str = Number(point * 100).toFixed(2);
  str += "%";
  return str;
}




d3.queue()
  .defer(d3.json, "data/nyctop.json")
  .defer(d3.csv, "data/zdata.csv")

  .await(makeMap);


function makeMap(error, nyctopo, zdata, ) {
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


  //  var newArr = zcta.filter(function(p){
  //   return p.timestamp === "2020-05-12T04:00:00Z";
  // });

  //   var ba = newArr.filter(function(p){
  //         return p.zcta === "10001";
  //         });
  // console.log(ba)

  // anima.selectAll("path")
  //   .data(nyc.features)
  //   .enter().append("path")
  //   .attr("d", d3.geoPath().projection(projection))
  //   .attr("stroke", "#747473")
  //   .attr("stroke-width", 1)
  //   .attr("fill", function (d) {


  //     var zipcode = d.properties.zipcode;
  //     var ba = newArr.filter(function(p){
  //       return p.zcta === zipcode.toString()  ;
  //       });

  //     if ((ba.length === 0) || (typeof (ba[0].positive) == "undefined")) {
  //       return "white";
  //     }
  //     if ( (ba[0].positive) == 0) {
  //       return "white";
  //     }
  //      return color(ba[0].positive);
  //   })

};

function makeMapDate(a, b) {
  var date = a + " " + b;
 
  return date;
}
// $( function() {
//     $( "#timeslider" ).slider({
//       range: "min",
//       value: new Date('2020.03.31').getTime() / 1000,
//        step: 86400,
//       min: new Date('2020.03.31').getTime() / 1000,
//       max: new Date('2020.05.10').getTime() / 1000,
//       slide: function( event, ui ) {
//         $( "#amount" ).val( new Date(ui.value *1000).toDateString()   );
//         let time =  new Date(ui.value *1000) 
//          let date = time.getDate()
//          let month = time.getMonth()
//        makeMapDate(date,month);
//       }
//     });

//     $( "#amount" ).val(new Date($( "#timeslider" ).slider( "value" )*1000).toDateString() );

//   } );





$(document).ready(function () {

  var datasummary = " ";
  numid = 0;
  tempsummary = [];


  d3.csv("https://raw.githubusercontent.com/nychealth/coronavirus-data/master/summary.csv", function (error, csvdata) {

    if (error) {
      console.log(error);
    }

    datasummary = csvdata;
    temparray = [];
    for (let i in csvdata[0]) {
      // debugger
      var obj = {
        id: i,
        name: csvdata[0][i]
      }
      temparray.push(obj);
    }

    var apiid = temparray[0].id;
    numid = apiid;
    var apiname = temparray[1].id;

    for (var i = 0, len = datasummary.length; i < len; i++) {
      // console.log(datasummary[i][apiid])
      // console.log(datasummary[i][apiname])
      var obj = {
        name: datasummary[i][apiname],
        number: datasummary[i][apiid]

      }
      tempsummary.push(obj);
    }



  })




  $(".dropdown-item").click(function () {
    var val = $(this).attr("id");
    switch (val) {
      case "dpd2":

        $("#showingmap").attr('src', "nycrate.html");
        break;
      case "dpd3":
        $("#showingmap").attr('src', "zctab.html");
        break;
      case "dpd4":
        $("#showingmap").attr('src', "zctap.html");
        break;
      default:
        $("#showingmap").attr('src', "nycnum.html");
    }
  });



  $(".borobutton").click(function () {
    var val = $(this).attr("id");
    switch (val) {
      case "img1":

        $("#showimag").attr('src', "picture/part1/bronx_data.png");
        break;
      case "img2":
        $("#showimag").attr('src', "picture/part1/borrklyn_data.png");
        break;
      case "img3":
        $("#showimag").attr('src', "picture/part1/manhattan_data.png");
        break;
      case "img4":
        $("#showimag").attr('src', "picture/part1/queens_data.png");
        break;
      default:
        $("#showimag").attr('src', "picture/part1/Staten_Island_data.png");
    }

  });


});

var $animation_elements = $('#ssummary');
var $window = $(window);
var flag = 0;

function check_if_in_view() {
  var window_height = $window.height();
  var window_top_position = $window.scrollTop();
  var window_bottom_position = (window_top_position + window_height);

  $.each($animation_elements, function () {
    var $element = $(this);
    var element_height = $element.outerHeight();
    var element_top_position = $element.offset().top;
    var element_bottom_position = (element_top_position + element_height);

    //check to see if this current container is within viewport
    if ((element_bottom_position >= window_top_position) &&
      (element_top_position <= window_bottom_position)) {


      setTimeout(function () {

  
        $("#o1").html(fetchdata.cases);
        $("#o2").html(fetchdata.deaths);
        $("#o3").html(fetchdata.ever_hospitalized);
        flag = 1;
      }, 1000);
    } else {

    }
  });
}


function number_animation() {
  if (flag == 0) {
    if (fetchdata == 0) {
      d3.csv("https://raw.githubusercontent.com/thecityny/covid-19-nyc-data/master/nyc.csv", function (error, data) {
        if (error) {
          console.log(error);
        }

        len = data.length;

        fetchdata = data[(len - 1)];

        d = new Date(fetchdata.timestamp)
      
         dateTime= d.setTime(d.getTime()+24*60*60*1000);
   
         time = new Date(dateTime).toDateString()
        $("#myupdate").html("update: " + " " +time + " "+ "(from 2020-03-12) ")

      })

    } 

    check_if_in_view();

  } else {

  }
}


$window.on('scroll resize', number_animation);
$window.trigger('scroll');

// $(window).scroll(function () {
//   var height = $(window).scrollTop();
//   var flag = 0;
//   if ((height > 400) && (flag == 0)) {
//     flag = 1;
//     // var iframe = $("#b");
//     // iframe.attr("src", iframe.data("src"));
//    setTimeout(function(){
//     $("#o1").html("184319");
//      $("#o2").html("15101");
//       $("#o3").html("48939");

// }, 2000);


//   }
// });