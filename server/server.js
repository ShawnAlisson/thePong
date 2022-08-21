// const https = require('https');
const http = require("http");
const io = require("socket.io");
const dotenv = require("dotenv").config();

const api = require("./api");
const httpServer = http.createServer(api);
const socketServer = io(httpServer);

const sockets = require("./sockets");

const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});

sockets.listen(socketServer);
