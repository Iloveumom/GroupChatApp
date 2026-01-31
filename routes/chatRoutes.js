const express = require("express");
const router = express.Router();
const {sendMessage,getMessages} = require("../controllers/chatController");
const {authenticate}=require("../middleware/auth");

router.post("/message",authenticate,sendMessage);
router.get("/messages", authenticate,getMessages);

module.exports = router;
