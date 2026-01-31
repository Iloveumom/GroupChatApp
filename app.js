require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./utils/db-connetion");
const cors = require("cors");
const path = require("path");
const http = require("http");
const WebSocket = require("ws");

const userroutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const authmeRoutes = require("./routes/authmeroutes");

require("./models"); // Sequelize models

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "./Frontend")));

// Routes
app.use("/user", userroutes);
app.use("/chat", chatRoutes);
app.use("/me", authmeRoutes);

// Create HTTP server (needed for WebSocket)
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocket.Server({ server });
let sockets = [];

wss.on("connection", ws => {
  sockets.push(ws);
  console.log("New client connected");
  ws.on("message", async (raw) => {
    try {
      const data = JSON.parse(raw);

      // Save message to DB
      const { Chat } = require("./models");
      const saved = await Chat.create({
        message: data.message,
        userId: data.userId
      });

      // Prepare message for all clients
      const msgToSend = JSON.stringify({
        message: saved.message,
        userId: saved.userId,
        createdAt: saved.createdAt,
        userName: data.userName
      });

      // Broadcast to all connected clients
      sockets.forEach(s => {
        if (s.readyState === WebSocket.OPEN) {
          s.send(msgToSend);
        }
      });
    } catch (err) {
      console.error("WS message error:", err);
    }
  });

  ws.on("close", () => {
    sockets = sockets.filter(s => s !== ws);
    console.log("Client disconnected");
  });
});

// DB sync and start server
db.sync()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB connection error:", err);
  });
