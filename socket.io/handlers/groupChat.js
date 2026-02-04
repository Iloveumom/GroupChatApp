const { v4: uuidv4 } = require("uuid");
const { User, Conversation, ConversationUsers, Message } = require("../../models");

module.exports = (socket, io) => {

  /* ---------------- JOIN GROUP ---------------- */
  socket.on("join-group", async ({ groupId }) => {
    try {
      // safety: ensure this is a group
      const conversation = await Conversation.findByPk(groupId);
      if (!conversation || conversation.type !== "group") return;

      const userId = socket.user.id;
      const isMember = await ConversationUsers.findOne({
               where: { conversationId: groupId, userId }
         });

        if (!isMember) return;  //non member blocking            


      socket.join(groupId);

      const messages = await Message.findAll({
        where: { conversationId: groupId },
        include: [{ model: User, attributes: ["id", "name"] }],
        order: [["createdAt", "ASC"]],
      });

      socket.emit("group-chat-history", {
        conversationId: groupId,
        messages: messages.map(m => ({
          senderId: m.senderId,
          userName: m.User.name,
          message: m.message,
          mediaUrl:m.mediaUrl,
          fileType:m.fileType,
          createdAt: m.createdAt,
        }))
      });

      console.log(`${socket.user.name} joined group ${groupId}`);
    } catch (err) {
      console.error(err);
    }
  });

  /* ---------------- GROUP MESSAGE ---------------- */
  socket.on("group-message", async ({ conversationId, message }) => {
    try {
      const conversation = await Conversation.findByPk(conversationId);
      if (!conversation || conversation.type !== "group") return;

      const senderId = socket.user.id;

      const msg = await Message.create({
        id: uuidv4(),
        conversationId,
        senderId,
        message,
      });

      const user = await User.findByPk(senderId);
      //live
      io.to(conversationId).emit("new-group-message", {
        senderId,
        userName: user.name,
        conversationId,
        message,
        createdAt: msg.createdAt,
      });
    } catch (err) {
      console.error("Sending group message failed:", err);
    }
  });

  /* ---------------- CREATE GROUP ---------------- */
  socket.on("create-group", async ({ name, members }) => {
    try {
      const adminId = socket.user.id;

      const conversation = await Conversation.create({
        id: uuidv4(),
        type: "group",       
        name,
        adminId,
      });

      const rows = [
        ...members.map(userId => ({
          id: uuidv4(),
          userId,
          conversationId: conversation.id,
        })),
        {
          id: uuidv4(),
          userId: adminId,
          conversationId: conversation.id,
        }
      ];

      await ConversationUsers.bulkCreate(rows);

      io.emit("group-created", {
        id: conversation.id,
        name,
        adminId,
      });

    } catch (err) {
      console.error("Group creation failed:", err);
    }
  });

};
