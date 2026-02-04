const User = require("./User");
const Conversation = require("./Conversation");
const Message = require("./Message");
const ConversationUsers = require("./ConversationUserss");
User.belongsToMany(Conversation, {
  through: ConversationUsers,
  foreignKey: "userId",
  otherKey: "conversationId",
});

Conversation.belongsToMany(User, {
  through: ConversationUsers,
  foreignKey: "conversationId",
  otherKey: "userId",
});

Conversation.hasMany(Message, { foreignKey: "conversationId" });
Message.belongsTo(Conversation, { foreignKey: "conversationId" });

User.hasMany(Message, { foreignKey: "senderId" });
Message.belongsTo(User, { foreignKey: "senderId" });


module.exports = {
  User,
  Conversation,
  Message,
  ConversationUsers,
};
