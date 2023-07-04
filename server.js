const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const PORT = 3001 || 5500;

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000" || "http://192.168.1.27:3000",
    methods: ["GET", "POST"],
  },
});

let connectedUsers = 0;

io.on("connection", (socket) => {
  socket.on("send_message", (data) => {
    socket.broadcast.emit("recieve_message", data);
  });
  connectedUsers++;
  io.emit("userCount", connectedUsers);

  socket.on("disconnect", () => {
    connectedUsers--;
    io.emit("userCount", connectedUsers);
  });

  socket.on("user_typing", (data) => {
    socket.broadcast.emit("recieve_userTyping", data);
  });
});

server.listen(PORT, () => {
  console.log(`BACKEND SERVER RUNNING AT ${PORT}`);
});
