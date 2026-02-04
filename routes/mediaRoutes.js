const express = require("express");
const router = express.Router();
const multer = require("../utils/multer");
const {authenticate} = require("../middleware/auth");
const { uploadMedia } = require("../controllers/mediaController");

router.post("/upload",authenticate,multer.single("file"),uploadMedia);
module.exports = router;
