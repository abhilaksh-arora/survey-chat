const mongoose = require("mongoose");

const chatResponseSchema = new mongoose.Schema({
  responses: [
    {
      question: {
        type: String,
        required: true,
      },
      response: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("ChatResponse", chatResponseSchema);
