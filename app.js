const express = require("express");
const cors = require("cors");
const socketIo = require("socket.io");
const http = require("http");
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

const server = http.createServer(app);
var userCount = 0;

let io = socketIo(server);
io.on("connection", (socket) => {
  console.log(socket.client.conn.server.clientsCount + " users connected");
  userCount++;

  socket.emit("connected", {
    message: "Welcome to the walkie talkie app",
    id: socket.id,
  });

  socket.on("greet", (data, callback) => {
    console.log(data);
    callback({
      status: "ok",
    });
  });

  socket.on("audioMessage", (audio) => {
    console.log("ASDFGDS");
    socket.broadcast.emit("audioMessage", audio.audioBlob);
  });

  socket.on("disconnecting", (reason) => {
    userCount--;
    console.log("client disconnect");
    console.log(userCount + " user left");
  });
});

//routers
app.get("/", (req, res) => {
  res.send("welcome to the walkie talkie server");
});

module.exports = server;
