require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./utils/db-connetion");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

require("./models");
const { Chat } = require("./models");

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "./Frontend")));

app.use("/user", require("./routes/userRoutes"));
app.use("/chat", require("./routes/chatRoutes"));
app.use("/me", require("./routes/authmeroutes"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
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
