window.onload = getMyLocation;


var ourCoords = {
  latitude: 47.624851,
  longitude: -122.52099,

};

function getMyLocation() {
  if (navigator.geolocation) {
    var watchButton = document.getElementById("watch");
    watchButton.onclick = watchLocation;
    var clearWatchButton = document.getElementById("clearWatch");
    clearWatchButton.onclick = clearWatch;
  } else {
    alert("oops,no geolocation");
  }
}

var wacthId = null;

function watchLocation() {
  watchId = navigator.geolocation.watchPosition(displayLocation, displayError);
}

function clearWatch() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

var map;

function displayLocation(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  var div = document.getElementById("location");
  div.innerHTML = "You are at latitude: " + latitude + ", longitude:  " + longitude;
  div.innerHTML += "(with " + position.coords.accuracy + " meters accuracy)";

  var km = computeDistance(position.coords, ourCoords);
  console.log(km);
  var distance = document.getElementById('distance');
  distance.innerHTML = "You are " + km + " km from the wickedly smart";
  if(map==null){
  showMap(position.coords);}

}

function displayError(error) {
  var errorType = {
    0: "unknown error",
    1: "permission denied",
    2: "position is not available",
    3: "request timed out"
  };
  var errorMessage = errorType[error.code];
  if (error.code == 0 || error.code == 2) {
    errorMessage = errorMessage + " " + error.message;
  }

  var div = document.getElementById("location");
  div.innerHTML = errorMessage;

}

function computeDistance(startCoords, destCoords) {
  var startLatRads = degreesToRadians(startCoords.latitude);
  var startlongRads = degreesToRadians(startCoords.longitude);
  var destLatRads = degreesToRadians(destCoords.latitude);
  var destLongRads = degreesToRadians(destCoords.longitude);

  var Radius = 6371;
  var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) + Math.cos(startLatRads) * Math.cos(destLatRads) * Math.cos(startlongRads - destLongRads)) * Radius;

  return distance;
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}



function showMap(coords) {
   map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),

    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([coords.longitude, coords.latitude]),
      zoom: 15
    })
  });


  var layer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [
        new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([coords.longitude, coords.latitude]))
        })
      ]
    })
  });
  map.addLayer(layer);

  var container = document.getElementById('popup');
  var content = document.getElementById('popup-content');
  var closer = document.getElementById('popup-closer');

  var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
      duration: 250
    }
  });
  map.addOverlay(overlay);

  closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };

  map.on('singleclick', function(event) {
    if (map.hasFeatureAtPixel(event.pixel) === true) {
      var coordinate = event.coordinate;

      content.innerHTML = '<b>Hello world!</b><br />I am a popup.';
      overlay.setPosition(coordinate);
    } else {
      overlay.setPosition(undefined);
      closer.blur();
    }
  });

}
