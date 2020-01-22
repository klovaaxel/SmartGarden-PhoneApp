 var mqtt;
 var reconnectTimeout = 2000;
 var host="mqtt.dioty.co"; //change this
 var port=8080;

 function onConnect() {  //on sucsefull connect to MQTT Broker
   console.log("connected to "+ host +" "+ port);   //logs the Successful connection


 }



 function MQTTconnect() {

   console.log("connecting to "+ host +" "+ port);
   mqtt = new Paho.MQTT.Client(host,port,"clientjs");//cerates new intance to connect to the mqtt broker


   var options = { // options used to connect to the mqtt broker
     timeout: 3,
     onSuccess: onConnect, //what function to call when succsefully connected
     userName : "klovakarlsson@gmail.com",
     password : "ee07432c"

    };

    mqtt.onMessageArrived = function (message) {
     console.log("Message Arrived: " + message.payloadString + " - " + "Topic: " + message.destinationName); //logs the incoming message

     var msgTopic =  message.destinationName;//stores the entire topic path as msgTopuc
     var msgSubTopic = message.destinationName.split("/").pop(); // splits the subtopic from the topic and stores as msgSubTopic

     if (msgSubTopic == "com") { // checks if the message is a update to sensors or a com message between sensors
       //sends a response that the channel is in-use
       message = new Paho.MQTT.Message("inUse");
       message.destinationName = msgTopic;
;
       mqtt.send(message);
       console.log("Responded to Com :" + "'" + message + "'" ) //logs the response

     }else { // if the message is senor information
       document.getElementById(msgSubTopic).innerHTML = (message.payloadString + "°C"); //updates html (with the same id as ) with new information
     }


    }

 mqtt.connect(options); //connects to the broker
}

//    ---HTML manipulation---

  function add(){ //function (div with inputs in the main-container) to add a setup for sensor
    document.getElementById('main-container').innerHTML += '<span id="t" class="sensor t"> <input type="text" name="name" id="uniqueID" value="" placeholder="Name of new sensor" /> <select id="tselect"name="type of widget"> <option value="moist">Soil Moisture</option> <option value="temp">Temperature</option> <option value="moist">Air Moisture</option> </select> <button onclick="nameSensor()">submit</button> </span>';

  }

  function nameSensor(){ //function to connect sensor to html sensor  --NOT DONE--

    var nameValue = document.getElementById("uniqueID").value;

    message = new Paho.MQTT.Message(nameValue);
    message.destinationName = "/klovakarlsson@gmail.com/com/newname";
    mqtt.send(message);
    console.log(nameValue + " sent");

    mqtt.subscribe("/klovakarlsson@gmail.com/" + nameValue);

    document.getElementById("t").className = "sensor " + document.getElementById('tselect').value;
    document.getElementById('t').innerHTML = '<p id="' + nameValue + '" style="display: inline;">' + nameValue + '</p>';
    document.getElementById("t").id = nameValue;



  }
