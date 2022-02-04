/*!
	file: airsensor.js
	
	This is the javascript file for the air sensor page. It handles event handling such as button pushes and MQTT updates
	and updates the air.html page values.
	For MQTT, the correct host IP address is the ip address of the pi.
	- MQTT subscriptions are subscribed to below
	Chart.js is used for the charting function.
	- each chart used needs to be defined in this file
	author(s): Maxwell Taubert, 
	date: 2/2/22
*/

(function(window, document, undefined) {

    var clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)

//    var host = 'ws://localhost:8083' //use to set the MQTT on the pi locally only
    var host = 'ws://192.168.68.101:8083'  //ws://pi ip:private websockets port (check the pi ip address with 'ipconfig' in the terminal. 
											//This number will be the same for each pages .js file

	// These configuration options don't need to be changed but can be further investigated by looking into "MOSQUITTO options"
    var options = {
        keepalive: 30,
        clientId: clientId,
        protocolId: 'MQTT',
        protocolVersion: 4,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
        rejectUnauthorized: false
    }
    

    console.log('Connecting MQTT Client')
    var client = mqtt.connect(host, options)

    client.on('error', function(err) {
        console.log(err)
        client.end()
    })
	
	//Fills the MQTT icon on the status bar with green if connected to.
    client.on('connect', function() {
        mqttIcon.style.color = 'lime';
        mqttIcon.className = "bi bi-hdd-rack-fill statusicon";
        console.log('Client Connected:' + clientId)
    })

	//Logging function can be found with web browser, right click on the page and click "inspect element"
	// Then click console and you can read what the JS has received or any other errors for debugging.
    client.on('message', function(topic, message, packet) {
        console.log('Received Message:= ' + message.toString() + '\nOn topic:= ' + topic)
    })

	//Fills the MQTT icon on the status bar with red if server not connected to.
    client.on('close', function() {
        mqttIcon.style.color = 'red';
        mqttIcon.className = "bi bi-hdd-rack statusicon";
        console.log(clientId + ' Disconnected')
    })

    window.onload = init;
    function init() {

		//Subscribe to the MQTT topics that are published here.
		//The qos is quality of service and shouldn't need to be changed from 0. Determines a message priority
		//client.subscribe('topic', { qos: 0 })
        client.subscribe('/air/temp', { qos: 0 })
        client.subscribe('/air/hum', { qos: 0 })
		
        client.on('message', function(topic, message, packet) {
            if (topic == '/air/temp') {
                /*if ((Number(message) >= 0) && (Number(message) <= 100)) { //conditional statements can be used to update icons and such
                    luxValue.innerHTML = message;
                } */
                airTemp.innerHTML = message;
            }
			if (topic == '/air/hum') {
                /*if ((Number(message) >= 0) && (Number(message) <= 100)) { //conditional statements can be used to update icons and such
                    luxValue.innerHTML = message;
                } */
                airHum.innerHTML = message;
            }
			else {}
        })

    }
	
	/*!
		Creates a chart that writes to the "line-chart" id created in the corresponding html file.
		Chart.js has many different options to choose from, find them on their website here: https://www.chartjs.org/docs/latest/samples/line/line.html
		Check out the samples and applications. Can be further debugged in the "inspect element" section in your browser.
	*/
    new Chart(document.getElementById("line-chart"), {
        type: 'line',
        data: {
          datasets: [{ 
              //yAxisID: 'Lux Reading (%)',
              backgroundColor: 'transparent',
              borderColor: "#000000",
              fill: false
            }
          ]
        },
        plugins: [ChartDataSource],
        options: {
          title: {
            display: false,
            text: 'Light Intensity Measured Over Time'
          },
          /*scales:{ //options to set scales and such
            yAxes: [{
                id: 'lux',
                gridLines: {
                        drawOnChartArea: false
                    }
                }]
            },*/
            plugins: {
                datasource: {
                    url: 'light_bogus.csv' //load the csv file that you wish to display here. The csv file is written by light_logging.py
                }
            }
        }
      });


})(window, document, undefined);
