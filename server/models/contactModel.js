const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

module.exports.Contact = Contact = mongoose.model("contact", contactSchema);
module.exports.ContactSchema = contactSchema;
