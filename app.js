require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./utils/db-connetion");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketIo=require("./socket.io");
require("./routes/userRoutes")
require("./routes/chatRoutes")
require("./routes/authmeroutes")
require("./models");

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "./Frontend")));

app.use("/user", require("./routes/userRoutes"));
app.use("/chat", require("./routes/chatRoutes"));
app.use("/me", require("./routes/authmeroutes"));
app.use("/users",)

const server = http.createServer(app);

socketIo(server);

const PORT = process.env.PORT || 4000;
db.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});
