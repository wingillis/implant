var request = window.superagent;
// stores the location data
var lo, radius;

//add the components that will only display a certain part of the page at a time

Vue.component('map', {
    template: '<div id="alert" class="hide">\
  <div data-alert="data-alert" class="alert-box">You have stumbled upon a seed!<a class="close">&times;</a></div>\
</div>\
<div id="map"></div>\
  <div class="row">\
    <div style="padding-right:0;" class="small-2 columns">\
      <p style="padding-top:14px;" class="text-right">Range:</p>\
    </div>\
    <div class="small-10 columns">\
      <div data-slider="data-slider" data-options="start:0; end: 1000;" id="slider" class="range-slider radius"><span class="range-slider-handle"></span><span class="range-slider-active-segment"></span>\
        <input type="hidden"/>\
      </div>\
    </div>\
  </div>\
  <div class="row">\
    <div class="large-6 small-6 columns upload"><a id="photoLink" class="button expand">Upload Photo</a>\
      <div class="hide">\
        <form method="post" action="/data/upload" enctype="multipart/form-data">\
          <input type="file" id="photo" accept="image/*" name="photo"/>\
          <input type="text" id="formVals" name="formVals"/>\
          <input type="submit" id="subPhoto"/>\
        </form>\
      </div>\
    </div>\
    <div class="large-6 small-6 columns upload"><a data-reveal-id="message" class="button expand">Upload Message</a>\
      <div id="message" data-reveal="data-reveal" class="reveal-modal">\
        <h3>Message:</h3>\
        <form method="post" action\'/data/message="action\'/data/message">\
          <textarea rows="10" id="textMessage" name="message"></textarea>\
          <div class="hide">\
            <input type="text" id="formVals" name="formVals"/>\
            <input type="submit" id="messageSubmit"/>\
          </div><a id="sendMessage" class="button expand">Send message!</a>\
          <p>Message sending functionality coming soon!</p>\
        </form><a class="close-reveal-modal">&#215;</a>\
      </div>\
    </div>\
  </div>\
  <footer class="row">\
    <div class="large-12 columns">\
      <p>© Copyright symbol because now it looks professional</p>\
    </div>\
  </footer>'
});

Vue.component('seeds', {
    template: '<div class="row">\
    <div class="large-12 small-12 columns">\
      <ul data-clearing class="clearing-thumbs small-block-grid-2">\
        <li v-repeat="sidebar"><a href="{{img}}" class="th"><img data-caption="{{header}}" v-attr="src: img"/></a></li>\
      </ul>\
    </div>\
  </div>'
});


var views = [{
    title: 'Map',
    view: 'map'
}, {
    title: 'Seeds',
    view: 'seeds'
}];

var sideBarData = [{
  img: 'http://kerlabs.net/wp-content/uploads/2013/09/Colorfull-Cool-Wallpapers-HD-for-PC.jpeg',
  header: 'look at the picture I took!',
  sub: "I'm the best"
},{
  img: 'https://lh4.googleusercontent.com/-6B8DT1kPwQ0/AAAAAAAAAAI/AAAAAAAADyk/oU9uRjOJu_g/photo.jpg',
  header: 'Found at Sammy\'s apartment',
  sub: 'Found on You\'re stupid day'
},{
  img: 'http://www.fullhdwallpapers3d.com/wp-content/uploads/2013/11/Cool-Cat-HD-Wallpapers-Widescreen.jpg',
  header: 'Found on Commonwealth Ave',
  sub: 'Found Yesterday'
},{
  img: 'https://pbs.twimg.com/profile_images/378800000511665910/75ec77e003ab9fcd44fcd46e2aa40015.jpeg',
  header: 'Found near Star Market',
  sub: 'Found today'
},{
  img: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSGj7WRv6KphMGd2dGsMt-5lvawzRo-Q5FiLVhfggkEie_RY-371g',
  header: 'Found in Boston',
  sub: 'Found the other day'
}];


//start the vue object
var vm = new Vue({
    el: '#app',
    data: {
        views: views,
        currentView: 'seeds',
        sidebar: sideBarData
    },
    methods: {
        changeView: function(view) {
            this.currentView = view;
            if ((view === 'map')) {
                setTimeout(initializeMap, 500);
            }
        },
        loadFoundation: function() {
            $(document).foundation();
        }
    }
});

vm.loadFoundation();

var initializeMap = function() {
    // get device height and set the map to 65% of that
    var deviceHeight = $(window).height();
    var mapHeight = deviceHeight * 0.65;
    $('#map').height(mapHeight);

    // initiate the map only if they have geolocation services
    if (Modernizr.geolocation) {
        //start mapOptions object
        var mapOptions = {
            zoom: 15,
            draggable: false
        };

        navigator.geolocation.getCurrentPosition(function(pos){
            mapOptions.center = new google.maps.LatLng(
                pos.coords.latitude, pos.coords.longitude);
            lo = {
                lat: pos.coords.latitude,
                long: pos.coords.longitude
            };
            radius = 0; //meters
            var map = new google.maps.Map(document.getElementById('map'), mapOptions);
            var marker = new google.maps.Marker({
                position: mapOptions.center,
                animation: google.maps.Animation.DROP,
                map: map,
                title: 'Your location'
            });
            // set up circle for drawing
            var circleOptions = {
                strokeColor: '#688500',
                strokeOpacity: 0.8,
                strokeWeight: 3,
                fillColor: '#7D9E00',
                fillOpacity: 0.35,
                center: mapOptions.center,
                map: map,
                radius: radius
            };
            //draw circle
            var circle = new google.maps.Circle(circleOptions);
            vm.loadFoundation();
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

        //end navigator getCurrentPosition
        });
    } else {alert('No geolocation available!');}
};
