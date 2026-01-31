const User = require("./user");
const Chat = require("./chat");

// Associations
User.hasMany(Chat);
Chat.belongsTo(User);

module.exports = {
  User,
  Chat,
};
