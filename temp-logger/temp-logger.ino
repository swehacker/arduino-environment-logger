#include <DHT.h>

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
  
  Serial.print("Humidity (%):\t");
  Serial.println((float)h, 2);
  Serial.print("Temperature:\t");
  Serial.println((float)t, 2);
  Serial.print("Heat index:\t");
  Serial.println(hi);
}

void serialEvent() {
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    if (inChar == '\n') {
      updateClient();
    } 
  }
}
