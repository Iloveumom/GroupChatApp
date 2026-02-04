const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connetion");

const ConversationUsers = sequelize.define("ConversationUsers", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  conversationId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

module.exports = ConversationUsers;
