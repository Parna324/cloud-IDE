const { Server } = require("socket.io");

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("join", (jobId) => {
      if (jobId) {
        socket.join(jobId);
      }
    });
  });

  return io;
}

module.exports = initSocket;
