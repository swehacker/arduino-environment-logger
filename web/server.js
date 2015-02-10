"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/config'),
    mongodb = require('./config/mongodb'),
    express = require('express'),
    serial = require('./config/serial');

var db = mongodb();
var app = express();
app.use(express.static(__dirname + '/public'));

// Setup the serial interface or list ports that can be used
if ( process.argv[2] !== undefined) {
  serial.connect(process.argv[2], onNewData);
} else {
  console.log("You did not provide a serial port to connect to!");
  console.log("  node server.js <port>\r\n");
  console.log("Available ports:");
  serial.listPorts();
  return;
}

// When new data is sent from arduino store it in the database
function onNewData(data) {
  try {
    data = JSON.parse(data);
    db.collection('log', function( err, collection ) {
      if (err) console.log(err);

      collection.insert(data, { safe: true }, function(err, result) {
        if ( err ) console.log(err);
      });
    });
  } catch (err) {
    console.log("Read error: " + err);
  }
}


// Serve latest sensor data as JSON
app.get('/device', function(req, res) {
  db.collection('log', function(err, collection) {
    collection.find({}).toArray(function(err, items) {
      res.json(items[items.length -1]);
    });
  });
});

// Serve all sensor data as JSON
app.get('/device/legend', function(req, res) {
  db.collection('log', function(err, collection) {
    collection.find({}).toArray(function(err, items) {
      res.json(items);
    });
  });
});

// Listen to port
app.listen(config.serverport);

// Notify the user that we are in business
console.log("Listening for http request on port " + config.serverport);

// Export our express instance for external usage
module.exports = app;
