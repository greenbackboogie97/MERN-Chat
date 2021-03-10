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

// io.on("connection", (socket) => {
//   const id = socket.handshake.query.id;
//   socket.join(id);
//   //Welcome current user
//   socket.emit("log", "Welcome to PIXEL Chat!");

//   //Broadcast when a user connects
//   socket.broadcast.emit("log", "A user has joined the chat");

//   //Runs when client disconnects
//   socket.on("disconnect", () => {
//     io.emit("log", "A user has left the chat");
//   });

//   //Listen for chat message
//   socket.on("message", (msg) => {
//     io.emit("message", msg);
//   });
// });

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

app.use("/users", require("./routes/userRouter"));

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`server is up and running on: ${PORT}`);
});
