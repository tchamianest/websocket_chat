const express = require("express");
const path = require("path");
const app = express();

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log("app is running on port 3000...");
});
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

let secketconnected = new Set();
io.on("connection", onConnected);

function onConnected(socket) {
  console.log(socket.id);
  secketconnected.add(socket.id);

  io.emit("clients-total", secketconnected.size);

  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
    secketconnected.delete(socket.id);
    io.emit("clients-total", secketconnected.size);
  });

  socket.on("message", (data) => {
    // console.log(data);
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
}
