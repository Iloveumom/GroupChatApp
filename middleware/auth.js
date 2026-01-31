const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authenticate = async (req, res, next) => {
  try {
   
    // Token directly header me aa raha hai
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing"
      });
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
    // User fetch
    const user = await User.findByPk(decoded.signupId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }
    req.user = user;
    next();

  } catch (err) {
  
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};
module.exports = { authenticate };
