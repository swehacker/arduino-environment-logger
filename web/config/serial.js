'use strict';

var config = require('./config'),
    serialport = require("serialport");

var SerialPort = serialport.SerialPort;
var myPort;

function showPortOpen() {
  console.log('Port open. Data rate: ' + myPort.options.baudRate);
}

function showPortClose() {
  console.log('Port closed. Retrying...');
}

function showError(error) {
  console.log('Serial port error: ' + error);
}

exports.connect = function(port, onData) {
  console.log("Setting up " + port + " with baudrate " + config.baudrate);
  myPort = new SerialPort(port, {
   baudRate: config.baudrate,
   // look for return and newline at the end of each data packet:
   parser: serialport.parsers.readline("\r\n")
 });

  myPort.on('open', showPortOpen);
  myPort.on('data', onData);
  myPort.on('close', showPortClose);
  myPort.on('error', showError);
}

exports.listPorts = function() {
  // list serial ports:
  serialport.list(function (err, ports) {
    ports.forEach(function(port) {
      console.log(port.comName);
    });
  });
};
