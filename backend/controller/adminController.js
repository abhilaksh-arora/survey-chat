// controllers/adminController.js
const AdminQuestion = require('../model/adminQuestions');

// Controller to get all questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await AdminQuestion.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller to create a new question
exports.createQuestion = async (req, res) => {
  console.log(req.body)
  const { question, options } = req.body;
  try {
    const newQuestion = new AdminQuestion({ question, options });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller to update a question
exports.updateQuestion = async (req, res) => {
  const { question, options } = req.body;
  try {
    const updatedQuestion = await AdminQuestion.findByIdAndUpdate(
      req.params.id,
      { question, options },
      { new: true }
    );
    res.json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller to delete a question
exports.deleteQuestion = async (req, res) => {
  try {
    await AdminQuestion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
