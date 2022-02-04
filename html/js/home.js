/*!
	file: home.js
	
	This is the javascript file for the home page. It handles event handling such as button pushes and MQTT updates
	and updates the index.html page values.
	For MQTT, the correct host IP address is the ip address of the pi.
	- MQTT subscriptions are subscribed to below
	
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

        client.subscribe('/bar/press', { qos: 0 })
        client.subscribe('/bar/alt', { qos: 0 })

        client.subscribe('/soil/temp', { qos: 0 })
        client.subscribe('/soil/moist', { qos: 0 })

        client.subscribe('/lux/value', { qos: 0 })

		// When the client receives a message at the topic that it is subscribed to it reads that information and populates the
		// html values or makes other decisions for the webpage.
        client.on('message', function(topic, message, packet) {

            if (topic == '/air/temp') {
                airTemp.innerHTML = message; //the value of the airTemp value on the webpage is given by the message in the air temp topic

            }
            else if(topic == '/air/hum'){
                humVal.innerHTML = message;

            }
            else if(topic == '/bar/press'){
                pressVal.innerHTML = message;

            }
            else if(topic == '/bar/alt'){
                altVal.innerHTML = message;

            }
            else if(topic == '/soil/temp'){
                soilTemp.innerHTML = message;

            }
            else if(topic == '/soil/moist'){
                soilMoist.innerHTML = message;

            }
             else if (topic == '/lux/value') {
                /*if ((Number(message) >= 0) && (Number(message) <= 100)) { //conditional statements can be used to update icons and such
                    luxValue.innerHTML = message;
                } */				
                luxValue.innerHTML = message; 
            } 
        })

    }

})(window, document, undefined);
