const cron = require("node-cron");
const { Message, ArchivedMessage} = require("../models");
const sequelize = require("../utils/db-connetion");
const { Op } = require("sequelize");

cron.schedule(process.env.ARCHIVE_CRON, async () => {    
  console.log("Archiving old messages...");

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const transaction = await sequelize.transaction();
  try {
    const oldMessages = await Message.findAll({
      where: {
        createdAt: { [Op.lt]: yesterday }
      },
      transaction
    });
    console.log("find",oldMessages.length,yesterday);
    if (!oldMessages.length) return;

    const archiveRows = oldMessages.map(m => ({
      id: m.id,
      conversationId: m.conversationId,
      senderId: m.senderId,
      message: m.message,
      mediaUrl: m.mediaUrl,
      createdAt: m.createdAt
    }));

    await ArchivedMessage.bulkCreate(archiveRows, { transaction });

    await Message.destroy({
      where: {
        createdAt: { [Op.lt]: yesterday }
      },
      transaction
    });

    await transaction.commit();
    console.log("Archiving completed");

  } catch (err) {
    await transaction.rollback();
    console.error("Archiving failed", err);
  }
});
