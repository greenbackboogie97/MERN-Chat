const mongoose = require("mongoose");
const { ContactSchema } = require("./contactModel");
const { ConversationSchema } = require("./conversationModel");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  displayName: { type: String },
  contacts: [ContactSchema],
  conversations: [],
});

module.exports = User = mongoose.model("user", userSchema);
