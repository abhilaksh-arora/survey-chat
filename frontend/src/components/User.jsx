import React, { useEffect, useState } from "react";
import base from "../utils/base";
import axios from "axios";

const User = () => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${base}/api/v1/admin/get-ques`);
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleChange = (questionId, option) => {
    setResponses({ ...responses, [questionId]: option });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(responses),
      });
      const data = await response.json();
      console.log(data);
      setResponses({}); // Clear responses after successful submission
      setError(""); // Clear error message
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div className="card">
        <h1>Chatbot Satisfaction Survey</h1>
        <div className="input">
          <form onSubmit={handleSubmit}>
            {questions.map((question) => (
              <div key={question._id}>
                <label>{question.question}</label>
                <select
                  value={responses[question._id] || ""}
                  onChange={(e) => handleChange(question._id, e.target.value)}
                >
                  <option value="">Select</option>
                  {question.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <button type="submit">Submit</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default User;
