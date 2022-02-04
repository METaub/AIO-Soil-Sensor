# AIO Soil Sensor Readme

## Setting up the Pi
It is recommended from me to use Visual Studio Code to connect to the Pi remotely using SSH (https://www.raspberrypi.com/news/coding-on-raspberry-pi-remotely-with-visual-studio-code/).
If you are having trouble, I have read that this could be due to the installation of RaspianLite onto the Pi Zero and the RaspianOS version might fix this.
If this does not solve your problem then download WinSCP and Notepad++ (Visual Studio Code works as well but does not allow changes to be undone).
Additonally, ThonnyIDE on the Pis interface can be used but it is not the best in my opinion.

Use KiTTy or PuTTy to connect serially into the pi, or use OpenVNC to access the Pi's webpage.
KiTTy (better version of putty): https://www.fosshub.com/KiTTY.html (Windows)
VNC Viewer: https://www.realvnc.com/en/connect/download/viewer/
WinSCP (allows access to the pis file system remotely): https://winscp.net/eng/index.php

pi defaults:
username: pi
password: raspberry

1. Open the terminal on the Pi after installing RaspianOS and type the following
2. sudo su
3. apt-get update
4. apt-get upgrade
5. sudo apt-get install python3-pip
6. pip3 install paho-mqtt
MosquiTTo install: https://randomnerdtutorials.com/how-to-install-mosquitto-broker-on-raspberry-pi/
7. sudo apt install -y mosquitto mosquitto-clients
8. sudo systemctl enable mosquitto.service
9. sudo nano /etc/mosquitto/mosquitto.conf
10. Move to the end of the file and paste:
listener 1883
allow_anonymous true
11. Then, press CTRL-X to exit and save the file. Press Y and Enter
Apache2 (webserver) install: https://pimylifeup.com/raspberry-pi-apache/
12. sudo apt install apache2 -y
13. A basic webserver page is now installed at the pi and can be found at the IP address of the PI
14. Find the address with the terminal: hostname -I
15. type: reboot

After the Pi reloads:
1. sudo apt install git
2. git clone https://github.com/METaub/AIO-Soil-Sensor.git
3. sudo nano /etc/apache2/sites-available/000-default.conf
4. Change document root from:
DocumentRoot /var/www/html to
DocumentRoot /home/pi/AIO/html
5. sudo service apache2 restart

Change the IP address in home.js, airsensor.js, barsensor.js, soilsensor.js, lightsensor.js to the IP address of the raspberry pi.
Use: hostname -I in the terminal in order to determine the ipaddress of the pi

## Checking the servers
### MQTT
sudo systemctl status mosquitto //checks the status of the mosquitto server
sudo systemctl restart mosquitto //restarts the mqtt server
sudo systemctl restart mosquitto

### Apache Webserver
sudo systemctl status apache2 //checks the status of the apache2 
sudo systemctl restart apache2 //restarts the apache2 server
sudo systemctl restart apache2 

## Arduino Setup
Download the Arduino IDE.
Depending on the board, google the way to install the board drivers.
Now, we need to install the libraries needed. Go to Tools > Manage libraries.., and search for ArduinoMqttClient, install this driver.

The MQTT template and sensor file is in the Arduino file.
The js Folder contains the js dependencies and the webpage js: home.js, airsensor.js, barsensor.js, soilsensor.js, lightsensor.js
The pages folder contains the html pages for each sensor.
The python_csv folder contains the code to collect sensor data and write it to a csv to be used by the graphs on the webpages.
