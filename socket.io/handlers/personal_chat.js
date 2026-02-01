module.exports=(socket,io)=>{
        socket.on("join-room",(roomName)=>{
                socket.join(roomName);
        });
        socket.on("new-message",({message,roomName}) => {

            //store new db
            io.emit("new-message",{username:socket.user.name,message});
        });

};