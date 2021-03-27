const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  const username = socket.handshake.query.username;
  socket.join(username);

  socket.on("send-message", ({ recipients, message }) => {
    const recipientsUsers = recipients.map((r) => r.username);
    recipientsUsers.forEach((recipient) => {
      const newRecipients = recipientsUsers.filter((r) => r !== recipient);
      newRecipients.push(username);
      socket.broadcast.to(recipient).emit("receive-message", message);
    });
  });
});

mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) throw err;
    console.log("MongoDB connection established.");
  }
);
app.get("/", (req, res) => {
  res.send("server is live.");
});

app.use("/users", require("./routes/userRouter"));

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`server is up and running on: ${PORT}`);
});
