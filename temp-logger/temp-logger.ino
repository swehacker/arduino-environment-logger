
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

#define LIGHTPIN A0
#define DHTPIN 7
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);
aREST rest = aREST();

int temperature;
int humidity;
int heatindex;
float lux;

void setup() {
  Serial.begin(115200);

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

  // Calculate the lux (amount of ligth) (assuming a typical LDR)
  // Volt = 5V, R = 10k
  // Typical LDR: Ea= 10 lux, Ra = 10 k, sens = 0.8 (check datasheet)
   // 1. Get the analog reading. Arduino Uno, Mega, between 0 and 1023
  int analogLDR = analogRead(LIGHTPIN);
  
  // 2. Get the output voltage, if Vdd=5V 
  float VOut = 5.0 * analogLDR / 1023.0;
  
  // 3. Get the LDR resistence (kohm)
  float resisLDR = 10.0 * (5.0 / VOut - 1.0);
 
  // 4. Get the amount of light (lux) assuming a typical LDR
  lux = 10.0 * pow(10.0 / resisLDR, 1.0 / 0.8);

  Serial.print("{\"id\": 1,\"temperature\": ");
  Serial.print(temperature);
  Serial.print(",\"humidity\": ");
  Serial.print(humidity);
  Serial.print(",\"heatindex\": ");
  Serial.print(heatindex);
  Serial.print(",\"light\": ");
  Serial.print(lux);
  Serial.println("}");

  delay(1000);
}

