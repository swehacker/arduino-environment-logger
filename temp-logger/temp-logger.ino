#include <DHT.h>

/**
 * temp.logger:
 *
 * When the arduino receives a newline character it will respond with temperature, humidity and heat index.
 * 
 * <temperature in celsius>,<humidity in percent>,<heat index in celsius>\n
 * e.g: 36.00,22.00,24.86
 */

#define DHTPIN 2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);
        
void setup() {  
  Serial.begin(9600);
  dht.begin();
}

void loop() {  
}

void updateClient() {
 float h = dht.readHumidity();
  // Read temperature as Celsius
  float t = dht.readTemperature();
  // Read temperature as Fahrenheit
  float f = dht.readTemperature(true);
  
  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t) || isnan(f)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  
  // Compute heat index
  // Must send in temp in Fahrenheit!
  float hi = dht.computeHeatIndex(f, h);
  Serial.print((float)h, 2);
  Serial.print(",");
  Serial.print((float)t, 2);
  Serial.print(",");
  Serial.println((hi-32)/1.8);
}

void serialEvent() {
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    if (inChar == '\n') {
      updateClient();
    } 
  }
}
