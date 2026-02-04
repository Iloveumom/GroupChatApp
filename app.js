require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./utils/db-connetion");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketIo=require("./socket.io");
const userRoute=require("./routes/userRoutes")
const authmeRoute=require("./routes/authmeroutes")
const groupRotute= require("./routes/groupRotutes")
const mediaRoutes = require("./routes/mediaRoutes");
const aiRoutes = require("./routes/aiRoutes");
require("./cron/ArchivedMessage");
require("./models");

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "./Frontend")));

app.use("/user",userRoute);
app.use("/me",authmeRoute );
app.use("/group",groupRotute);
app.use("/media", mediaRoutes);
app.use("/ai", aiRoutes);

const server = http.createServer(app);

socketIo(server);

const PORT = process.env.PORT || 4000;
db.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});
