const {User,Conversation,Message,ConversationUsers} = require("../../models");
const {checkAndCreateConversation,getMessage,savePersonalMessage}=require("../../controllers/personalChatContoller");
const {findUserById}=require("../../controllers/userContoller");
module.exports = (socket, io) => {
  
  //  Join persnol chat room +history
  socket.on("join-personal", async ({ receiverId }) => {
    try {
       const senderId = socket.user.id;
       const conversation= await checkAndCreateConversation(senderId,receiverId);
      // socket room join
      socket.join(conversation.id);
      // OLD MESSAGES FETCH
     const messages=await getMessage(conversation);
      // frontend ko history bhejo
      socket.emit("personal-chat-history", {
        conversationId: conversation.id,
        messages: messages.map(m => ({
          senderId: m.senderId,
          userName: m.User.name,
          message: m.message,
          mediaUrl:m.mediaUrl,      
          fileType:m.fileType, 
          createdAt: m.createdAt
        }))
      });

    } catch (err) {
      console.error("Personal chat join error:", err);
    }
  });

 //    SEND PERSONAL MESSAGE live +db save
  socket.on("personal-message", async ({ roomId, message }) => {
    try {
      const senderId = socket.user.id;

      const msg=await savePersonalMessage(roomId,senderId,message);
      const user=await findUserById(senderId);
      
      io.to(roomId).emit("new-personal-message", {
        senderId,
        userName: user.name,
        conversationId: roomId,
        message,
        createdAt: msg.createdAt
      });

    } catch (err) {
      console.error(" Personal message error:", err);
    }
  });

};
