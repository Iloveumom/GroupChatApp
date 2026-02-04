
const { v4: uuidv4 } = require("uuid");
const {User,Conversation,Message,ConversationUsers} = require("../models");
const checkAndCreateConversation=async(senderId,receiverId)=>{
          // sender ki personal conversations
          const conversations = await Conversation.findAll({
            where: { type: "personal" },
            include: [{
              model: User,
              where: { id: senderId },
              through: { attributes: [] }
            }]
          });
    
          // check receiver bhi same conversation me hai?
          let conversation = null;
    
          for (let c of conversations) {
            const users = await c.getUsers({
              where: { id: receiverId }
            });
            if (users.length) {
              conversation = c;
              break;
            }
          }
    
          // agar conversation nahi mili → create karo
          if (!conversation) {
            conversation = await Conversation.create({
              id: uuidv4(),
              type: "personal"
            });
    
            await ConversationUsers.bulkCreate([
              {
                id: uuidv4(),
                userId: senderId,
                conversationId: conversation.id
              },
              {
                id: uuidv4(),
                userId: receiverId,
                conversationId: conversation.id
              }
            ]);
          }
          return conversation;
};
const getMessage=async (conversation)=>{
         const messages = await Message.findAll({
                where: { conversationId: conversation.id },
                include: [{
                  model: User,
                  attributes: ["id", "name"]
                }],
                order: [["createdAt", "ASC"]]
              });
        return messages;
};
const savePersonalMessage=async(roomId,senderId,message)=>{
   
      const msg = await Message.create({
          id: uuidv4(),
          conversationId: roomId,
          senderId,
          message
      });
      return msg;
}
module.exports={checkAndCreateConversation,getMessage,savePersonalMessage}