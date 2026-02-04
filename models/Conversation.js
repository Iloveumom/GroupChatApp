const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connetion");

const Conversation = sequelize.define("Conversations", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM("personal", "group"),
    defaultValue: "personal",
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  adminId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
});

module.exports = Conversation;
