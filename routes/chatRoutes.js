const express = require("express");
const router = express.Router();
const {sendMessage} = require("../controllers/chatController");
const {authenticate}=require("../middleware/auth");
router.post("/message",authenticate,sendMessage);

module.exports = router;
