const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: String,
  message: String,
  time: String,
});

module.exports.Message = message = mongoose.model("message", messageSchema);
module.exports.MessageSchema = messageSchema;
