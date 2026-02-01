require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./utils/db-connetion");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

require("./models");
const { Chat, User } = require("./models");

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "./Frontend")));

app.use("/user", require("./routes/userRoutes"));
app.use("/chat", require("./routes/chatRoutes"));
app.use("/me", require("./routes/authmeroutes"));

const server = http.createServer(app);

//todo: set cors
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? false :"http://localhost:4000/" 
  }
});


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

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("chat-message", async (data) => {
    try {
      const saved = await Chat.create({
        message: data.message,
        UserId: data.userId
      });

      io.emit("chat-message", {
        message: saved.message,
        userId: saved.UserId,
        createdAt: saved.createdAt,
        userName: data.userName
      });

    } catch (err) {
      console.error("Socket error:", err);
    }
  });
});

const PORT = process.env.PORT || 4000;
db.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});
