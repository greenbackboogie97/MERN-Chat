const mongoose = require("mongoose");
const { MessageSchema } = require("./messageModel");

const conversationSchema = new mongoose.Schema({
  recipients: [],
  messages: [MessageSchema],
});

module.exports.Conversation = conversation = mongoose.model(
  "conversation",
  conversationSchema,
  "conversations"
);
module.exports.ConversationSchema = conversationSchema;
