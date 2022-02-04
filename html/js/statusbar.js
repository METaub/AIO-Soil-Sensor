(function(window, document, undefined) {

    var clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)

//    var host = 'ws://localhost:8083'
    var host = 'ws://192.168.68.119:8083'

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

    client.on('connect', function() {
        mqttIcon.style.color = 'lime';
        mqttIcon.className = "bi bi-hdd-rack-fill statusicon";
        console.log('Client Connected:' + clientId)
    })

    client.on('message', function(topic, message, packet) {
        console.log('Received Message:= ' + message.toString() + '\nOn topic:= ' + topic)
    })

    client.on('close', function() {
        mqttIcon.style.color = 'red';
        mqttIcon.className = "bi bi-hdd-rack statusicon";
        console.log(clientId + ' Disconnected')
    })


    var powerStatus = 0;
    var lightsPower = 0;
    var lightingMode = 0;

    var lidarPower = 0;
    var lidarResolution = 0;

    window.onload = init;

    function init() {

        client.subscribe('/lidar/power', { qos: 0 })
        client.subscribe('/lidar/resolution', { qos: 0 })

        client.subscribe('/camera/mode', { qos: 0 })

        client.subscribe('/lights/power', { qos: 0 })
        client.subscribe('/lights/mode', { qos: 0 })
            // client.subscribe('/lights/brightness', { qos: 0 })

        // var lidarPowerStatus = document.getElementById("lidarPowerStatus");
        // var lidarResolutionStatus = document.getElementById("lidarResolutionStatus");
        // var lightingModeStatus = document.getElementById("lightingModeStatus");
        // var lightsPowerStatus = document.getElementById("lightsPowerStatus");
        // var lightsIcon = document.getElementById("lightsIcon");

    }

})(window, document, undefined);
