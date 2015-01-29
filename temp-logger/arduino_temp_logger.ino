#include <dht11.h>

dht11 DHT11;

#define DHT11PIN 7
        
void setup() {
  Serial.begin(9600);
  Serial.println("DHT11 Test");
}

void loop() {
  Serial.println("\n");
  int chk = DHT11.read(DHT11PIN);
  Serial.print("Read sensor: ");
  
  switch (chk) {
    case DHTLIB_OK:
      Serial.println("OK");
      break;
    case DHTLIB_ERROR_CHECKSUM:
      Serial.println("Checksum error");
      break;
    case DHTLIB_ERROR_TIMEOUT:
      Serial.println("Timeout error");
      break;
    default:
      Serial.println("Unknown error");
      break;
  }
  
  Serial.print("Humidity (%): ");
  Serial.println((float)DHT11.humidity, DHT11PIN);
  Serial.print("Temperature: ");
  Serial.println((float)DHT11.temperature, DHT11PIN);
  
  delay(2000);
}

