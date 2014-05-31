$(document).foundation();

var lo;
var radius;
var request = window.superagent;

var initialize = function() {
  var deviceHeight = $(window).height();
  var mapHeight = deviceHeight * 0.65;
  $('#map').height(mapHeight);
  var mapOptions = {
    zoom: 14,
    draggable: false
  };
  if (Modernizr.geolocation)
  {
    navigator.geolocation.getCurrentPosition(function(pos) {
      mapOptions.center = new google.maps.LatLng(
        pos.coords.latitude,
        pos.coords.longitude
      );
      lo = {
        lat: pos.coords.latitude,
        long: pos.coords.longitude
      };
      radius = 500;
      var map = new google.maps.Map(document.getElementById('map'), mapOptions);
      var marker = new google.maps.Marker({
        position: mapOptions.center,
        animation: google.maps.Animation.DROP,
        map: map,
        title: 'You are here'
      });
      var circleOptions = {
        strokeColor: '#688500',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#7D9E00',
        fillOpacity: 0.35,
        center: mapOptions.center,
        map: map,
        radius: 500
      };
      var circle = new google.maps.Circle(circleOptions);
      $('[data-slider]').on('change', function(){
        var rad = parseInt($('#slider').attr('data-slider'));
        circle.setRadius(rad);
        radius = rad;
      });
      request.get('/data/location?lat=' + lo.lat + '&long=' + lo.long)
  .end(function(msg){
    if(msg.text == 'Yes')
    {
      $('#alert').removeClass('hide');
    }
  });
    });

  } else {
    alert('Your browser does not support location!');
  }
};


$(document).ready(function() {
  $('input#photo').change(function () {
    //add form values
    var data = {
        name: 'wgillis-' + new Date().getTime() + '.png',
        user: 'wgillis',
        radius: radius,
        location: lo,
      };
    $('input#formVals').val(JSON.stringify(data));
    $('#subPhoto').click();
  });
});


$('#photoLink').click(function() {
  $('#photo').click();
});

$(document).ready(initialize);
