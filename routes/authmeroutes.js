const express=require("express");
const router=express.Router();
const {getMe}=require('../controllers/authMeContoller');
const { authenticate } = require("../middleware/auth");
router.get("/details",authenticate,getMe);
module.exports=router;