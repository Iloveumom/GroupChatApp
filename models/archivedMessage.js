const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connetion");
const ArchivedMessage = sequelize.define("ArchivedMessages", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    conversationId: DataTypes.UUID,
    senderId: DataTypes.UUID,
    message: DataTypes.TEXT,
    mediaUrl: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    archivedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });

  module.exports=ArchivedMessage;

