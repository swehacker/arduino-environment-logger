# Environment logger using Arduino, NodeJS and Mongodb
Logs temperature, humidity, heatindex and light level to a web application running node.js and mongodb.

## Install and run
### Pre-req.
NodeJS

Install the dependencies
```javascript
// When standing in the interface catalogue
npm install
```
You can list all the serial (usb) ports in your computer
```javascript
node app.js
```
Start the application
```javascript
node app.js <path to port>
```

## Project setup
![alt text](https://github.com/swehacker/arduino-environment-logger/raw/master/schema/Breadboard.png "Breadboard Setup")

### Components
Arduino Uno
DHT11 sensor
10K Resistor
Light Resistor

### Libraries
#### DHT
Clone the following libs into Arduino/libraries catalogue
git clone git@github.com:marcoschwartz/aREST.git

https://github.com/RobTillaart/Arduino/tree/master/libraries/DHTlib
