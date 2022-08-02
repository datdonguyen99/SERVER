const mqtt = require("mqtt");
const mongoose = require("mongoose");
const UserMQTT = require("./model");
require("dotenv").config();

const options = {
  host: "927d7667af91429ba0c6def0efd349db.s1.eu.hivemq.cloud",
  port: process.env.PORT,
  protocol: "mqtts",
  username: "donguyendat",
  password: "donguyendat",
};

// initialize the MQTT client
const client = mqtt.connect(options);
const topic = "testTopic";

// setup the callbacks
client.on("connect", () => {
  console.log("Connected");
});

client.on("error", (error) => {
  console.log(error);
});

client.on("message", (topic, message) => {
  // called each time a message is received
  console.log("Received message:", topic, message.toString());
  connectDB(topic, message);
});

// subscribe to topic 'topic'
client.subscribe(topic);

// publish message 'Hello' to topic 'topic'
// client.publish("topic", "Hello");

const connectDB = async (topic, message) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to mongodb successfully!");
    const arrMessage = message.toString().split(/\s/);
    const UserObject = new UserMQTT({
      name: "DATDO",
      topic: topic,
      day: arrMessage[0],
      time: arrMessage[1],
      temperature:
        arrMessage[2] === "nan" ? Number(-9999) : Number(arrMessage[2]),
    });
    UserObject.save();
  } catch (err) {
    console.log("Cannot connect to mongoDB", err);
  }
};
