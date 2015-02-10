"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Modules
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

var mongoose = require('./config/mongoose');
var db = mongoose();
if (db.collectionExist("log")) {
  db.createCollection("log", { capped : true, max : 5000 } );
}

// Define port
var port = 3000;
var baudrate = 115200;

var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var myPort;

function showPortOpen() {
  console.log('Port open. Data rate: ' + myPort.options.baudRate);
}

function saveLatestData(data) {
  db.log.insert(JSON.parse(data));
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
  res.json(db.log.find().sort({$natural:-1}).limit(1));
});

app.get('/device/legend', function(req, res) {
  res.json(db.log.find());
});

app.listen(port);
module.exports = app;
console.log("Listening for http request on port " + port);
