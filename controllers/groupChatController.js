const { Conversation, User } = require("../models");

const getMyGroups = async (req, res) => {
  try {
    const userId = req.user.id;
    const groups = await Conversation.findAll({
      where: { type: "group" },
      include: [
        {
          model: User,
          where: { id: userId },   //  sirf member wale
          attributes: [],
          through: { attributes: [] }
        }
      ],
      order: [["createdAt", "DESC"]]
    });
    res.json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load groups" });
  }
};
module.exports={getMyGroups};