const User=require('../models/user');
const jwt=require("jsonwebtoken");
module.exports=(io)=>{
//todo: scoket middlewate auth
    io.use(async (socket, next) => {
      try {
    
        const token = socket.handshake.auth.token;
    
        if (!token) return next(new Error("No token provided"));
         // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
           
            if (!decoded) {
              return  next(new Error("Invalid token"));
            }
            // User fetch
            const user = await User.findByPk(decoded.signupId);
            if (!user) {
    
             return next(new Error("User not Found"));
            }
            socket.user = user;
            next();
        
      } catch (err) {
        console.log(err);
        next(new Error("Invalid token"));
      }
    });
}