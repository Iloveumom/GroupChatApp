const Chat=require("../../models/chat");
module.exports=(socket,io)=>{
            console.log("User connected:", socket.id);
        socket.on("chat-message", async (data) => {
            try {
            const saved = await Chat.create({
                message: data.message,
                UserId: data.userId
            });

            io.emit("chat-message", {
                message: saved.message,
                userId: saved.UserId,
                createdAt: saved.createdAt,
                userName: data.userName
            });

            } catch (err) {
            console.error("Socket error:", err);
            }
        });

};