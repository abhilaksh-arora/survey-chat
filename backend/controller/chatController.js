// controllers/responseController.js
const Response = require("../model/chatResponse");
const { all } = require("../route/chatRoutes");

// Controller function to handle the submission of responses
exports.submitResponse = async (req, res) => {
  try {
    const responses = req.body;
    const responseDocument = new Response({ responses });
    const savedResponse = await responseDocument.save();
    res
      .status(201)
      .json({ message: "Responses submitted successfully", savedResponse });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllResponses = async (req, res) => {
  try {
    // Fetch all responses from the database
    const responses = await Response.find();
    if (!responses) {
      res.status(400).json({ error: "No responses found" });
    }
    // Return the responses as a JSON response
    res.json(responses);
  } catch (error) {
    // Handle any errors and send an error response
    res.status(500).json({ message: error.message });
  }
};

exports.countResponses = async (req, res) => {
  try {
    // Retrieve all responses from the database
    const allResponses = await Response.find();

    // Initialize an object to store counts for each option
    const optionCounts = {};

    // Iterate through each response
    allResponses.forEach((response) => {
      // Iterate through each question's response
      response.responses.forEach((questionResponse) => {
        // Get the question and response option
        const { question, response } = questionResponse;

        // Initialize counts for the question if not present
        if (!optionCounts[question]) {
          optionCounts[question] = {};
        }

        // Increment the count for the response option
        if (optionCounts[question][response]) {
          optionCounts[question][response]++;
        } else {
          optionCounts[question][response] = 1;
        }
      });
    });

    // Add default counts for all options for every question
    allResponses.forEach((response) => {
      response.responses.forEach((questionResponse) => {
        const { question } = questionResponse;
        if (!optionCounts[question]) {
          optionCounts[question] = {};
        }
      });
    });

    // Return the counts as a response
    res.status(200).json(optionCounts);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Internal server error" });
  }
};
