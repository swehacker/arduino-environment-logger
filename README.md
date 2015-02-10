# Environment logger using Arduino, NodeJS and Mongodb
Logs temperature, humidity, heatindex and light level to a web application running node.js and mongodb.

![alt text](https://github.com/swehacker/arduino-environment-logger/raw/master/images/interface.png "Web Interface")

## Install and run
### Pre-req.
* NodeJS
* MongoDB

### Setup mongodb
Install MongoDB locally. If you want to connect to a database on another server you need to change the connection url in the mongodb config.

#### Install
Ununtu
```bash
sudo apt-get install mongodb
```

OSX
```bash
brew install mongodb
```

#### Create the database
Connect to the database locally
```bash
mongo
```

Create the database

```bash
use arduino-environment-logger
```

Create a capped collection (rotates out old documents)
```bash
db.createCollection("log", { capped : true, size : 5242880, max : 5000 } )
```

### Setup the server
Install the dependencies
```javascript
// When standing in the web catalogue
npm install
// Setup JS framworks (download jQuery, jQuert.Gauge...)
bower install
```
You can list all the serial (usb) ports in your computer
```javascript
node server.js
```
Start the application
```javascript
node server.js <path to port>
```

### Arduino
![alt text](https://github.com/swehacker/arduino-environment-logger/raw/master/schema/Breadboard.png "Breadboard Setup")

#### Components
* Arduino Uno
* DHT11 sensor
* 10K Resistor
* Light Resistor

#### Libraries
Copy the following libs into Arduino/libraries catalogue

##### DHT
```
https://github.com/RobTillaart/Arduino/tree/master/libraries/DHTlib
```
