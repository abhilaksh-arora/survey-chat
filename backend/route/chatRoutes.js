// routes/routes.js
const express = require("express");
const {
  submitResponse,
  getAllResponses,
  countResponses,
} = require("../controller/chatController");
const router = express.Router();

router.post("/submit", submitResponse);
router.get("/responses", getAllResponses);
router.get("/reports", countResponses);

module.exports = router;
