const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connetion");

const Message = sequelize.define("Messages", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  conversationId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  mediaUrl: {
  type: DataTypes.STRING,
  allowNull: true,
},
fileType: {
  type: DataTypes.STRING,
  allowNull: true,
}
});

module.exports = Message;
