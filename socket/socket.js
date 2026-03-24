let io;

const initSocket = (server) => {
  io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // USER joins their own room
    socket.on("join-user", (userId) => {
      socket.join(`user-${userId}`);
      console.log(`User ${userId} joined room user-${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};  

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { initSocket, getIO };
