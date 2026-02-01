module.exports=(socket,io)=>{
        socket.on("join-room",(roomName)=>{
                socket.join(roomName);
                console.log("room join",roomName);
        });
        socket.on("new-message",({message,roomName}) => {
                  
            //store new db
            io.to(roomName).emit("new-message",{username:socket.user.name,message});
        });

};