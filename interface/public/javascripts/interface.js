$(document).ready(function() {

    function updateSensors() {

        // Update light level and status
        $.getJSON('/device', function(data) {
            data = JSON.parse(data);

            $("#lightDisplay").html("Light level: " + data.light + "%");

            $("#status").html("Station Online");
            $("#status").css("color","green");

            $("#temperatureDisplay").html("Temperature: " + data.temperature + "°C");

            $("#humidityDisplay").html("Humidity: " + data.humidity + "%");
        }).fail(function() {
          $("#status").html("Station Offline");
          $("#status").css("color","red");
        });
    }

    setTimeout(updateSensors, 500);
    setInterval(updateSensors, 5000);

});
