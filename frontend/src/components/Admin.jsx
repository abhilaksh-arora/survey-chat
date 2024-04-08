import React, { useEffect, useState } from "react";
import base from "../utils/base";
import axios from "axios";
import { Link } from "react-router-dom";

const Admin = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState([]);
  const [error, setError] = useState(null);
  const [addQues, setAddQues] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

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
      }
    };

    fetchQuestions();
  }, []);

  const handleOptionChange = (e, index) => {
    const options = [...newOptions];
    options[index] = e.target.value;
    setNewOptions(options);
  };

  const addQuestion = () => {
    setAddQues(true);

    setNewQuestion("");
    setNewOptions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${base}/api/v1/admin/create-ques`,
        {
          question: newQuestion,
          options: newOptions,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      if (response) {
        setQuestions((prevQuestions) => [
          ...prevQuestions,
          { question: newQuestion, options: newOptions },
        ]);
      }
      setNewQuestion("");
      setNewOptions([]);
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteQuestion = async (questionId) => {
    try {
      await axios.delete(`${base}/api/v1/admin/delete-ques/${questionId}`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
      setQuestions(questions.filter((question) => question._id !== questionId));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (questionId) => {
    setEditingQuestionId(questionId);
  };

  const handleQuestionEdit = async (e, questionId) => {
    const newQuestionValue = e.target.value;
    try {
      await axios.put(
        `${base}/api/v1/admin/update-ques/${questionId}`,
        {
          question: newQuestionValue,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      setQuestions((prevQuestions) => {
        return prevQuestions.map((question) =>
          question._id === questionId
            ? { ...question, question: newQuestionValue }
            : question
        );
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleOptionEdit = async (e, questionId, optionIndex) => {
    try {
      const updatedOptions = [
        ...questions.find((q) => q._id === questionId).options,
      ];
      updatedOptions[optionIndex] = e.target.value;

      await axios.put(
        `${base}/api/v1/admin/update-ques/${questionId}`,
        {
          options: updatedOptions,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      const updatedQuestions = questions.map((question) => {
        if (question._id === questionId) {
          return { ...question, options: updatedOptions };
        }
        return question;
      });
      setQuestions(updatedQuestions);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDone = () => {
    setEditingQuestionId(null);
  };
  return (
    <div>
      <div className="card">
        <h2>Chatbot Satisfaction Survey</h2>
        <Link to="/view-responses">View Responses</Link>
        <div>
          <form onSubmit={handleSubmit}>
            {questions.map((question, index) => (
              <div className="input" key={index}>
                <div className="flex flex-row justify-between cursor-pointer w-full">
                  <EditSign onClick={() => handleEdit(question._id)} />
                  <XSign onClick={() => deleteQuestion(question._id)} />
                </div>
                {editingQuestionId === question._id ? (
                  <div className="w-full">
                    <input
                      type="text"
                      className="ques1 p-1"
                      value={question.question}
                      onChange={(e) => handleQuestionEdit(e, question._id)}
                      onFocus={(e) => e.target.removeAttribute("value")}
                      onBlur={(e) =>
                        e.target.setAttribute("value", question.question)
                      }
                    />
                    <ul>
                      {question.options.map((option, optionIndex) => (
                        <li key={optionIndex}>
                          <input
                            type="text"
                            className="opt1 my-1 p-1"
                            value={option}
                            onChange={(e) =>
                              handleOptionEdit(e, question._id, optionIndex)
                            }
                          />
                        </li>
                      ))}
                    </ul>
                    <button onClick={handleDone}>Done</button>
                  </div>
                ) : (
                  <>
                    <label>{question.question}</label>
                    <ul>
                      {question.options.map((option, optionIndex) => (
                        <li key={optionIndex} value={option}>
                          {option}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ))}
            {addQues ? (
              <>
                <div className="input">
                  <input
                    type="text"
                    className="ques"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Enter new question"
                  />
                  <div className="my-2">
                    {newOptions.map((option, index) => (
                      <div key={index}>
                        <input
                          type="text"
                          className="opt mt-3"
                          value={option}
                          onChange={(e) => handleOptionChange(e, index)}
                          placeholder="Enter option"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      className="bg-gray-800 text-white p-2 rounded-md mt-3"
                      onClick={() => setNewOptions([...newOptions, ""])}
                    >
                      Add Option
                    </button>
                  </div>
                  <button className="btn" type="submit">
                    Add
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center pb-4">
                  <button
                    className="bg-gray-800 text-white p-2 rounded-md text-center"
                    type="button"
                    onClick={addQuestion}
                  >
                    Add Question
                  </button>
                </div>
              </>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

function XSign(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 100 100"
      {...props}
    >
      <line x1="10" y1="10" x2="90" y2="90" stroke="black" strokeWidth="10" />
      <line x1="90" y1="10" x2="10" y2="90" stroke="black" strokeWidth="10" />
    </svg>
  );
}

function EditSign(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );
}

export default Admin;
