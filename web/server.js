"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express'),
    Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    Connection = require('mongodb').Connection,
    serialport = require("serialport");

var db = new Db('arduino-environment-logger', new Server('localhost', Connection.DEFAULT_PORT, {}), { native_parser: false});
db.open(function(err, db) {
  if (err) throw err;
});

var app = express();
app.use(express.static(__dirname + '/public'));

// Define port
var port = 3000;
var baudrate = 115200;

var SerialPort = serialport.SerialPort;
var myPort;

function showPortOpen() {
  console.log('Port open. Data rate: ' + myPort.options.baudRate);
}

function saveLatestData(data) {
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

function showPortClose() {
  console.log('Port closed. Retrying...');
}

function showError(error) {
  console.log('Serial port error: ' + error);
}

function setupSerial() {
  console.log("Setting up " + process.argv[2] + " with baudrate " + baudrate);
  myPort = new SerialPort(process.argv[2], {
   baudRate: baudrate,
   // look for return and newline at the end of each data packet:
   parser: serialport.parsers.readline("\r\n")
 });

  myPort.on('open', showPortOpen);
  myPort.on('data', saveLatestData);
  myPort.on('close', showPortClose);
  myPort.on('error', showError);
}

if ( process.argv[2] !== undefined) {
  setupSerial();
} else {
  console.log("You did not provide a serial port to connect to!");
  console.log("  node app.js <port>\r\n");
  console.log("Available ports:");
  // list serial ports:
  serialport.list(function (err, ports) {
    ports.forEach(function(port) {
      console.log(port.comName);
    });
  });

  return;
}

// Serve interface
app.get('/device', function(req, res) {
  db.collection('log', function(err, collection) {
    collection.find({}).toArray(function(err, items) {
      res.json(items[items.length -1]);
    });
  });
});

app.get('/device/legend', function(req, res) {
  db.collection('log', function(err, collection) {
    collection.find({}).toArray(function(err, items) {
      res.json(items);
    });
  });
});

app.listen(port);
module.exports = app;
console.log("Listening for http request on port " + port);
