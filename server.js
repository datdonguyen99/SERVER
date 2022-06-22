// MQTT Broker
const aedes = require("aedes")();
// const server = require("net").createServer(aedes.handle);
const httpServer = require("http").createServer();
const ws = require("websocket-stream");
require("dotenv").config();
const port = process.env.PORT || 80;
// const port = process.env.PORT || 2468;
const mongoose = require("mongoose");
const UserMQTT = require("./model");

// server.listen(port, function () {
//   console.log("server started and listening on port ", port);
// });

ws.createServer({ server: httpServer }, aedes.handle);

httpServer.listen(port, () => {
  console.log("websocket server listening on port ", port);
});

const connectDB = async (msg) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // console.log("Connected to mongodb successfully!");
    const UserObject = new UserMQTT({
      name: "DATDO",
      topic: "TEMPERATURE",
      temperature: msg,
    });
    UserObject.save();
  } catch (err) {
    console.log("Cannot connect to mongoDB", err);
  }
};

aedes.subscribe("TEMPERATURE", (packet, callback) => {
  const msg = packet.payload.toString();
  // console.log(msg);
  connectDB(msg);
});
