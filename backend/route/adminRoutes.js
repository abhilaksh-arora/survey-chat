const express = require("express");
const {
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controller/adminController");
const router = express.Router();

router.get("/get-ques", getAllQuestions);
router.post("/create-ques", createQuestion);
router.put("/update-ques/:id", updateQuestion);
router.delete("/delete-ques/:id", deleteQuestion);

module.exports = router;
