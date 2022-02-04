# title:air_csv.py

# This file takes in the incoming MQTT messages for the air sensor and plots it to a csv file to be displayed on the air graphs.
# The subscribed topics can be changed based on the desired sensor. 
# The IP of the MQTT server HAS to be changed to the Pi ip address (find in the terminal with "ipconfig" or "ifconfig"

# author(s): Maxwell Taubert,
# date: 2/3/22

import paho.mqtt.client as mqtt
import csv
from threading import *
from datetime import datetime
from time import sleep

mqttc = mqtt.Client() # Initialize the mqtt client as mqttc

def on_connect(mqttc, obj, flags, rc):
    print("rc: " + str(rc))

def on_message(mqttc, obj, msg):
    print(msg.topic + " " + str(msg.qos) + " " + str(msg.payload))
    today = datetime.now()
    filename = "air-{}.csv".format(today)
    with open(filename, 'w') as myfile:
        myfile.write("Date, Time, Channel(s), DC, P1 - Lux, P1 - Temperature, P2 - Lux, P2 - Temperature, P3 - Lux, P3 - Temperature, P4 - Lux, P4 - Temperature\n")

    while(1):
        #Collect the current time at each loop 
        current_time = datetime.now()
        current_time = current_time.strftime("%m/%d/%y,%H:%M:%S")
        if(msg.topic == "/air/temp"){
            current_temp = str(msg.payload) #May need to be fixed to account for info coming in as bytes
        }
        if(msg.topic == "/air/hum"){
            current_hum = str(msg.payload) 
        }

def on_publish(mqttc, obj, mid):
    print("mid: " + str(mid))

def on_subscribe(mqttc, obj, mid, granted_qos):
    print("Subscribed: " + str(mid) + " " + str(granted_qos))

def on_log(mqttc, obj, level, string):
    print(string)


def mqtt_thread():
    mqttc.on_message = on_message 
    mqttc.on_connect = on_connect #used for debugging purposes in the terminal and can be removed
    mqttc.on_publish = on_publish
    mqttc.on_subscribe = on_subscribe #used for debugging purposes in the terminal and can be removed
    # Uncomment to enable debug messages logging
    # mqttc.on_log = on_log

    # CHANGE THE BELOW IP ADDRESS TO THE PI IP ADDRESS
    # Connect to the IP address of the PI, and port 1883 for websockets (established in the moquitto.conf file)
    mqttc.connect("192.168.68.101", 1883, 60) #mqttc.connect(IP address, port number, timeout)
    # Use the subscribe function to subscribe to the topic that is desired. 
    # QoS determines the quality of service for the messages.
    mqttc.subscribe("/air/temp", 0) 
    mqttc.subscribe("/air/hum", 0) #mqttc.subscribe(topic, Quality of Service (QoS))

    mqttc.loop_forever()