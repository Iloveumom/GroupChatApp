const { Server } = require("socket.io");
const socketAuth = require("./middleware");
const groupChatHandler = require("./handlers/groupChat"); // group chat
const personalChatHandler = require("./handlers/personalChat"); // personal chat
const media = require("./handlers/media");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? false
          : "http://localhost:3000", // frontend origin
    },
  });

  socketAuth(io); // authentication middleware

  io.on("connection", (socket) => {
    personalChatHandler(socket, io); // personal chat events
    media(socket,io);  //media
    groupChatHandler(socket, io); // group chat events
  });

  return io;
};
