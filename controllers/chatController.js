const Chat = require("../models/chat");

const sendMessage = async (req, res) => {
  const { user_id, message } = req.body;

  if (!user_id || !message) {
    return res.status(400).json({ error: "Data missing" });
  }

  const result = await Chat.create({ UserId:user_id, message });

  res.json({
    success: true,
    message_id: result.id
  });
};
module.exports={sendMessage};
