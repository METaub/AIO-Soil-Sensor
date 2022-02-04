/*
	file:mqtt_sensors.ino
	
	This file is a place to get started for sending sensor data from the microcontroller using MQTT.
	Replace the IP address of the broker with the IP address of the raspberry pi.
	Configure the sensors in the setup.
	Read the data from the sensors in main and send to the corresponding sensor topic.

	author(s): Maxwell Taubert,
	date: 2/3/22
*/

#include <ArduinoMqttClient.h>
#include <WiFiNINA.h>
//#include all sensor libraries here

char ssid[] = SECRET_SSID;        // your network SSID (name)
char pass[] = SECRET_PASS;    // your network password (use for WPA, or use as key for WEP)

WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

const char broker[] = "192.168.68.101"; //IP address of the raspberry pi
int        port     = 1883;

//Topics to 
const char topic[]  = "/air/hum";
const char topic2[]  = "/air/temp";
const char topic3[]  = "/bar/press";
const char topic4[]  = "/bar/alt";
const char topic5[]  = "/soil/temp";
const char topic6[]  = "/soil/moist";
const char topic7[]  = "/lux/value";

//set interval for sending messages (milliseconds) - possibly needs to be longer if you notice any timeouts in the terminal
const long interval = 8000;
unsigned long previousMillis = 0;

int count = 0;

//Declare constants and variables for sensor setup here


//Initialize the sensors here
void setup() {
  //Initialize serial and wait for port to open:
  Serial.begin(9600);

  // attempt to connect to Wifi network:
  Serial.print("Attempting to connect to WPA SSID: ");
  Serial.println(ssid);
  while (WiFi.begin(ssid, pass) != WL_CONNECTED) {
    // failed, retry
    Serial.print(".");
    delay(5000);
  }

  Serial.println("You're connected to the network");
  Serial.println();

  Serial.print("Attempting to connect to the MQTT broker: ");
  Serial.println(broker);

  if (!mqttClient.connect(broker, port)) {
    Serial.print("MQTT connection failed! Error code = ");
    Serial.println(mqttClient.connectError());

    while (1);
  }

  Serial.println("You're connected to the MQTT broker!");
  Serial.println();

 //Put initialization code for sensors here

}

void loop() {
  // call poll() regularly to allow the library to send MQTT keep alive which
  // avoids being disconnected by the broker
  mqttClient.poll();

  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= interval) {
    // save the last time a message was sent
    previousMillis = currentMillis;

    //record random value from A0, A1 and A2 - used as an example, replace with reading sensor data
    int Rvalue = analogRead(A0);
    int Rvalue2 = analogRead(A1);
    int Rvalue3 = analogRead(A2);

    Serial.print("Sending message to topic: ");
    Serial.println(topic);
    Serial.println(Rvalue);

    Serial.print("Sending message to topic: ");
    Serial.println(topic2);
    Serial.println(Rvalue2);

    Serial.print("Sending message to topic: ");
    Serial.println(topic2);
    Serial.println(Rvalue3);

    // send the sensor messages to the respective topicse Print interface can be used to set the message contents
    mqttClient.beginMessage(topic);
    mqttClient.print(Rvalue);
    mqttClient.endMessage();

    mqttClient.beginMessage(topic2);
    mqttClient.print(Rvalue2);
    mqttClient.endMessage();

    mqttClient.beginMessage(topic3);
    mqttClient.print(Rvalue3);
    mqttClient.endMessage();

    Serial.println();
  }
}