const Chat = require("../models/chat");

const sendMessage = async (req, res) => {
  const {message } = req.body;
  const UserId=req.user.id;
  if (!UserId || !message) {
    return res.status(400).json({ error: "Data missing" });
  }

  const result = await Chat.create({ UserId, message });

  res.json({
    success: true,
    message_id: result.id
  });
};
module.exports={sendMessage};
