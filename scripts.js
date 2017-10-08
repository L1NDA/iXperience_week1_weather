var map;
var pos; 
var flag = true;
  
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 18,
      mapTypeId: 'satellite'
    });
  
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        map.setCenter(pos);
        weather(pos);
        city(pos);
      });
    }
  }
  
function generateIcon(iconPath) {
    var iconElement = `/static/${iconPath}.gif`;
    return iconElement;
  }
  
function weather(location) { 
    $.ajax({
      method: "GET",
      url: `https://api.darksky.net/forecast/b9c81608cec6dbd961aa072371322835/${location.lat},${location.lng}`,
      dataType: "jsonp",
      success: function(response) {
        timeConverter(response.currently.time);
        document.getElementById("icon").src = generateIcon(response.currently.icon);
        var high = Math.round(response.daily.data[0].temperatureMax*10)/10;
        var low = Math.round(response.daily.data[0].temperatureMin*10)/10;
        $(".high-temp").text(high + "°F");
        $(".low-temp").text(low + "°F");
        /*document.getElementById("content").style.visibility = "visible";*/
        $("#hidden").css("visibility", "visible");
      }
    });
  }
  
function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    // var sec = a.getSeconds();
    var time = /*hour + ":" + min + " // "+*/ date + ' ' + month + ' ' + year;
    $(".date").text(time);
    // return time;
  }
  
  function city(pos) {
    $.ajax({
      url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.lat},${pos.lng}&key=AIzaSyCnfM-cXdKjdtEzv9YTbNIDzkQRWdsk5u4`,
      success: function(response) {
        $(".city").text(response.results[7].address_components[0].long_name);
      }
    });
  }

  function animate() {
    $("#search").animate({
          left: "+=100px",
        });
        $(".outline").css("background-image", "none");
        $("#welcome").fadeOut(0);
        $("#current").fadeOut(0);
        $("#backdrop").fadeOut(1500);
        $("#hidden").fadeIn(1500);
        $("#search").attr("placeholder", "Where should we explore next?").focus().blur();
        flag = false;
  }
  
  $("#current").click(function() {
    animate();
  });

  function rerun() {
    
  }

$("#search").keypress(function(e) {
    if(e.which == 13) {
      /*$(".hidden").css("visibility", "visible");*/
      
      // changes from home screen
      if (flag) {animate()}
      var $city = $("#search").val();
      $("#search").val("");
      $.ajax({
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${$city}&key=AIzaSyCnfM-cXdKjdtEzv9YTbNIDzkQRWdsk5u4`,
        success: function(response) {
          map.setCenter(response.results[0].geometry.location);
          weather(response.results[0].geometry.location);
          $(".city").text($city);
        }
      });
    }
  });


$('document').ready(function() {
  
});