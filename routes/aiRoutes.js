const express = require("express");
const router = express.Router();

const {predictTyping,smartReply} = require("../controllers/aiController");
const {authenticate}= require("../middleware/auth");

router.post("/predict", authenticate,predictTyping);
router.post("/reply", authenticate,smartReply);

module.exports = router;