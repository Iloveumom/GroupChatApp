module.exports=(socket,io)=>{
        socket.on("join-room",(roomName)=>{
                socket.join(roomName);
                console.log("room join",roomName);
        });
        socket.on("new-message",({message,roomName}) => {
                  
            //store new db
            console.log(message,roomName,socket.user.name);
            io.to(roomName).emit("new-message",{username:socket.user.name,message});
        });

};