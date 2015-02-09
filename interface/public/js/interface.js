var firstApp = angular.module('temp-logger', []);
firstApp.controller('TempController', function($scope) {
  $scope.first = 'Some';
  $scope.last = 'One';
  $scope.heading = 'Message: ';
  $scope.updateMessage = function() {
    $scope.message = 'Hello ' + $scope.first + ' ' + $scope.last + '!';
  };
});

$(document).ready(function() {
  var lightGauge = new Gauge(document.getElementById("lightGauge"),{
    color: "#707070",
    bgcolor: "#AEAEAE",
    unit: " lux",
    title: "Light"
  });

  var temperaturGauge = new Gauge(document.getElementById("temperatureGauge"),{
    color: "#707070",
    bgcolor: "#AEAEAE",
    unit: " °C",
    title: "Temperature"
  });

  var heatindexGauge = new Gauge(document.getElementById("heatindexGauge"),{
    color: "#707070",
    bgcolor: "#AEAEAE",
    unit: " °C",
    title: "Heatindex"
  });

  var humidityGauge = new Gauge(document.getElementById("humidityGauge"),{
    color: "#707070",
    bgcolor: "#AEAEAE",
    unit: " %",
    title: "Humidity"
  });

  lightGauge.value(0);
  temperaturGauge.value(0);
  heatindexGauge.value(0);
  humidityGauge.value(0);

  function updateSensors() {

    // Update light level and status
    $.getJSON('/device', function(data) {
      data = JSON.parse(data);

      $("#status").html("Station Online");
      $("#status").css("color", "green");

      lightGauge.value(Math.round(data.light));
      temperaturGauge.value(data.temperature);
      heatindexGauge.value(Math.round(data.heatindex));
      humidityGauge.value(Math.round(data.humidity));
      //updateValue(data.light);
    }).fail(function() {
      $("#status").html("Station Offline");
      $("#status").css("color", "red");
    });
  }

  setTimeout(updateSensors, 500);
  setInterval(updateSensors, 5000);

});
