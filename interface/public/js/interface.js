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

  function updateSensors() {

    // Update light level and status
    $.getJSON('/device', function(data) {
      data = JSON.parse(data);

      $("#lightDisplay").html("Light level: " + data.light + " lux");

      $("#heatindexDisplay").html("Heatindex: " + data.heatindex + " °C");

      $("#status").html("Station Online");
      $("#status").css("color", "green");

      $("#temperatureDisplay").html("Temperature: " + data.temperature + "°C");

      $("#humidityDisplay").html("Humidity: " + data.humidity + "%");
    }).fail(function() {
      $("#status").html("Station Offline");
      $("#status").css("color", "red");
    });
  }

  setTimeout(updateSensors, 500);
  setInterval(updateSensors, 5000);

});
