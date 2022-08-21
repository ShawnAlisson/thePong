let readyPlayers = 0;

function listen(io) {
  const pongNamespace = io.of("/pong");
  pongNamespace.on("connection", (socket) => {
    let room;
    console.log("New Player Connected as:", socket.id);

    socket.on("ready", () => {
      room = "room" + Math.floor(readyPlayers / 2);
      socket.join(room);
      console.log(`Player [${socket.id}] is ready in ${room}`);
      readyPlayers++;

      if (readyPlayers % 2 === 0) {
        // io.emit("startGame", socket.id); // Boroadcast to all clients
        // pongNamespace.emit("startGame", socket.id);  // Boroadcast to all clients with specific namespace
        pongNamespace.in(room).emit("startGame", socket.id); // Boroadcast to all clients with specific namespace in the same room
      }
    });

    socket.on("paddleMove", (paddleData) => {
      // socket.broadcast.emit("paddleMove", paddleData); // Sending to all clients except sender
      socket.to(room).emit("paddleMove", paddleData); // Sending to all clients except sender in same room
    });

    socket.on("ballMove", (ballData) => {
      socket.to(room).emit("ballMove", ballData);
    });

    socket.on("disconnect", (reason) => {
      console.log(`Player ${socket.id} disconnected: [${reason}]`);
      socket.leave(room);
    });
  });
}

module.exports = {
  listen,
};
