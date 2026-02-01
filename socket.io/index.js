const { Server } = require("socket.io");
const  socketAuth=require("./middleware");
const chatHandler=require("./handlers/chat");
const personalChatHandler=require("./handlers/personal_chat");
//todo: set cors
module.exports=(server)=>{
    const io = new Server(server, {
      cors: {
        origin:
          process.env.NODE_ENV === "production"
            ? false :"http://localhost:4000/" 
      }
    });
    socketAuth(io);
    io.on("connection", (socket) => {
        //chatHandler(socket,io);
        personalChatHandler(socket,io);
    });
    return io;
};
