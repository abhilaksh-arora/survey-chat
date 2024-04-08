// models/AdminQuestion.js
const mongoose = require("mongoose");

const AdminQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("AdminQuestion", AdminQuestionSchema);
