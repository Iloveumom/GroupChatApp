const Chat = require("../models/chat");
const User = require("../models/user");
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
const getMessages = async (req, res) => {
  try {
    const messages = await Chat.findAll({
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: User,       // assuming Chat.belongsTo(User)
          attributes: ["name"] // sirf name chahiye
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports={sendMessage,getMessages};
