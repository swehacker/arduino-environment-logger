
/**
 * temp.logger:
 *
 * When the arduino receives a newline character it will respond with temperature, humidity and heat index.
 * 
 * <temperature in celsius>,<humidity in percent>,<heat index in celsius>\n
 * e.g: 36.00,22.00,24.86
 */

#include <DHT.h>
#include <aREST.h>

#define DHTPIN 2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);
aREST rest = aREST();

int temperature;
int humidity;
int heatindex;
int light;

void setup() {  
  Serial.begin(9600);
  
  // Expose variables to rest
  rest.variable("temperature", &temperature);
  rest.variable("humidity", &humidity);
  rest.variable("heatindex", &heatindex);
  rest.variable("light", &light);
  // Set devicename and id
  rest.set_id("1");
  rest.set_name("temperature_station");
  
  // Setup DHT
  dht.begin();
}

void loop() {  
  humidity = (int)dht.readHumidity();
  // Read temperature as Celsius
  temperature = (int)dht.readTemperature();
  // Read temperature as Fahrenheit
  float temp_f = dht.readTemperature(true);
  
  // Check if any reads failed and exit early (to try again).
  if (isnan(humidity) || isnan(temperature) || isnan(temp_f)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  
  // Compute heat index
  // Must send in temp in Fahrenheit!
  heatindex = dht.computeHeatIndex(temp_f, humidity);
  
  float light_reading = analogRead(A0);
  light = (int)(light_reading/1024*100);
  
  rest.handle(Serial);
  
  delay(100);
}

