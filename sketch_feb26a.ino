// load libraries
#include <WiFi.h>
#include <HTTPClient.h>

// add credentials
const char* WIFI_SSID = "LC Wireless";
const char* WIFI_PASS = "";
const String AIO_USERNAME = "E00S";
const String AIO_KEY = "aio_kRry69eyuH8kMkNPAp98nBR18Lkh";
const String AIO_FEED = "sensor-test";
HTTPClient http;

// keep track of sensor pins
const int FSR_PIN = A2;

boolean isStep = false;
int step_counter = 0;
int old_step_counter = 0;
unsigned long time_passed;
unsigned long previous_time;
unsigned long battery_check = 0;


void setup() {
  // start the serial connection and wait for it to open
  Serial.begin(115200);
  while(! Serial);
}


void loop() {
    time_passed = millis();
//    Serial.println(time_passed);

  // make sure we're connected
   checkBattery();

  // grab the current state of the sensor
  int fsr_value = analogRead(FSR_PIN);
//  Serial.print("fsr_value -> ");
//  Serial.println(fsr_value);

  // if it's a relevant value, send it to AIO
  if (fsr_value > 2600 && !isStep) {
      step_counter++;
      Serial.print("Step Counter-> ");
      Serial.println(step_counter);
      isStep = true;
  }
  else if (fsr_value < 1000) {
    isStep = false;  
  }
  
  if (time_passed - previous_time < 30000){
    if(step_counter > old_step_counter){
     previous_time = time_passed;
     old_step_counter = step_counter; 
    }
  }
  else if (step_counter > 5) {
    connectToWifi();
    if(WiFi.status() == WL_CONNECTED){
      sendData(step_counter * 2);
      step_counter = 0;
    }
    previous_time = time_passed;
    old_step_counter = step_counter; 
  }
  else {
    Serial.println("Not Enough Steps");
    previous_time = time_passed;
    step_counter = 0;
    old_step_counter = step_counter;
  }

  // always include a short delay
  delay(50);
}

void connectToWifi() {
  previous_time = time_passed;
  if (WiFi.status() != WL_CONNECTED) {
    Serial.print("Connecting to wifi...");
    int i = 0;
    while (WiFi.status() != WL_CONNECTED) {
      if (i % 10 == 0) {
        WiFi.disconnect();
        delay(250);
        WiFi.begin(WIFI_SSID, WIFI_PASS);
      }
      delay(1000);
      Serial.print(".");
      i++;
      if(time_passed - previous_time > 60000) {
          break;
        }
    }
    Serial.println();
    Serial.println("--> connected");
  }
  
}

//void connectToWifi() {
//  if (WiFi.status() != WL_CONNECTED) {
////    Serial.print("Connecting to wifi...");
//    for(int j =0; j < 100; j++) {
//      WiFi.begin(WIFI_SSID, WIFI_PASS);
//      delay(100);
//    }
////    Serial.println();
//    if (WiFi.status() == WL_CONNECTED) {
//      Serial.println("--> connected");
//    }
//    else {
//      Serial.println("--> Connection Failed");
//    }
//  }
//}


void sendData(int datum) {
  Serial.print("Sending data... ");
  String url = "https://io.adafruit.com/api/v2/" + AIO_USERNAME + "/feeds/" + AIO_FEED + "/data";
  String object = "{\"X-AIO-Key\": \"" + AIO_KEY + "\", \"value\": " + datum + "}";
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  int httpResponseCode = http.POST(object);
  Serial.println(httpResponseCode);
  http.end();  
  delay(2000); // delay 2 seconds to avoid AIO rate limit
}

void checkBattery() {
  unsigned long t = millis();
  if (battery_check == 0 || t - battery_check > 5 * 60 * 1000) {
    float voltage = ((analogRead(A13) * 2) / 4096.0) * 3.3;
    Serial.print("Battery at ");
    Serial.print(voltage);
    Serial.println("v");
//    sendData("battery", voltage);   // report battery level every 5 minutes
    battery_check = t;
  }
}
