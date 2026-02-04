const geminiService = require("../services/aiService");

const predictTyping = async (req, res) => {
  try {
    const { text, tone } = req.body;
    const suggestions = await geminiService.predictiveTyping(
      text,
      tone || "casual"
    );
    res.json({ suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI prediction failed" });
  }
};

const smartReply = async (req, res) => {
  try {
    const { message, tone } = req.body;
    const replies = await geminiService.smartReplies(
      message,
      tone || "casual"
    );
    res.json({ replies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI reply failed" });
  }
};
module.exports={predictTyping,smartReply};