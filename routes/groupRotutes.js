const express = require("express");
const router = express.Router();
const {authenticate}= require("../middleware/auth");
const {getMyGroups} = require("../controllers/groupChatController");

router.get("/getMyGroups", authenticate, getMyGroups);

module.exports = router;
