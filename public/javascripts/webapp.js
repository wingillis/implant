$(document).foundation({
    slider: {
        on_change: function() {
            var val = $('#slider').attr('data-slider');

        }
    }
});

var initialize = function() {
  var deviceHeight = $(window).height();
  var mapHeight = deviceHeight * 0.65;
  $('#map').height(mapHeight);
  var mapOptions = {};
  mapOptions.zoom = 16;
  if (Modernizr.geolocation)
    {
      navigator.geolocation.getCurrentPosition(function(pos) {
        mapOptions.center = new google.maps.LatLng(
          pos.coords.latitude,
          pos.coords.longitude
        );
      var map = new google.maps.Map(document.getElementById('map'), mapOptions);
      var marker = new google.maps.Marker({
        position: mapOptions.center,
        animation: google.maps.Animation.DROP,
        map: map,
        title: 'You are here'
      });
      });
    } else {
      mapOptions.center = new google.maps.LatLng(-41.2, 72.2);
    }
};

//$(document).ready(initialize);

var request = window.superagent;


$('#map-icon').click(function() {
  $('#map-icon').parent().addClass('active');
  $('#home').parent().removeClass('active');
  request.get('/data/test', function(response) {
    alert(response.text);
  });
});

$('#home').click(function() {
  $('#home').parent().addClass('active');
  $('#map-icon').parent().removeClass('active');
  request.post('/data/test', function(response) {
    alert(response.text);
  });
});
