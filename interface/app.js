"use strict";

// Modules
var express = require('express');
var app = express();
// View engine
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Define port
var port = 3000;
var baudrate = 115200;

var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var latest = JSON.parse("{\"id\": 1, \"heatindex\": 20, \"temperature\": 22, \"humidity\": 32, \"light\": 65}");

var myPort;

function showPortOpen() {
  console.log('Port open. Data rate: ' + myPort.options.baudRate);
}

function saveLatestData(data) {
  latest = data;
}

function showPortClose() {
  console.log('Port closed. Retrying...');
}

function showError(error) {
  console.log('Serial port error: ' + error);
}

function setupSerial() {
  console.log("Setting up " + portName + " with baudrate " + baudrate);
  myPort = new SerialPort(portName, {
   baudRate: baudrate,
   // look for return and newline at the end of each data packet:
   parser: serialport.parsers.readline("\r\n")
 });

  myPort.on('open', showPortOpen);
  myPort.on('data', saveLatestData);
  myPort.on('close', showPortClose);
  myPort.on('error', showError);
}

portName = process.argv[2];
if ( portName !== undefined) {
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
  res.json(latest);
});
app.listen(port);
console.log("Listening for http request on port " + port);
