const { v4: uuidv4 } = require("uuid");
const { Message, User, Conversation } = require("../../models");
module.exports = (socket, io) => {

  socket.on("media-message", async ({ conversationId, mediaUrl, fileType }) => {
    try {
       
      const conversation = await Conversation.findByPk(conversationId);
      if (!conversation) return;
      console.log("media url",mediaUrl,"con type",conversation.type);
      const senderId = socket.user.id;

      const msg = await Message.create({
        id: uuidv4(),
        conversationId,
        senderId,
        mediaUrl,
        fileType,
      });

      const user = await User.findByPk(senderId);

      io.to(conversationId).emit(
        conversation.type === "group"
          ? "new-group-message"
          : "new-personal-message",
        {
          senderId,
          userName: user.name,
          conversationId,
          mediaUrl,
          fileType,
          createdAt: msg.createdAt,
        }
      );

    } catch (err) {
      console.error("Media socket error:", err);
    }
  });

};
