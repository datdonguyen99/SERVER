// MQTT broker
const mosca = require("mosca");
const settings = { port: 1357 };
const server = new mosca.Server(settings);

server.on("ready", () => {
  console.log("Server broker is ready!");
});
