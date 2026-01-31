const {DataTypes}=require('sequelize');
const sequelize=require("../utils/db-connetion");

const Chat = sequelize.define("ChatMessages", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  }
});
module.exports = Chat;
