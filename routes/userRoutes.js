const express=require("express");
const router=express.Router();
const {checkLogindetail,addSignupdetail,getAllUsers}=require('../controllers/userContoller');
const {authenticate}=require("../middleware/auth");
router.post("/login",checkLogindetail);
router.post("/signup",addSignupdetail);
router.get("/getAllUsers",authenticate,getAllUsers);
module.exports=router;