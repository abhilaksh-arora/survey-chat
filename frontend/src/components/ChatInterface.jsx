import React, { useState, useEffect } from "react";
import base from "../utils/base";

const ChatInterface = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typedMessage, setTypedMessage] = useState("");

  const defaultQuestion = "Are we done?";
  const defaultOptions = ["Yes", "No"];

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

  const handleOptionClick = (option) => {
    const response = {
      question: questions[currentQuestionIndex].question,
      response: option,
    };
    if (response) {
      setResponses((prevResponses) => [...prevResponses, response]);
    }
    console.log(responses);
    moveToNextQuestion(option);
  };

  const moveToNextQuestion = (option) => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      if (option !== "") {
        setResponses([
          ...responses,
          {
            question: questions[currentQuestionIndex].question,
            response: option,
          },
        ]);
      } else {
        // If no typed message, add a default response
        setResponses([
          ...responses,
          {
            question: questions[currentQuestionIndex].question,
            response: "No response",
          },
        ]);
      }
      submitResponsesToDatabase();
    }
  };

  const submitResponsesToDatabase = async () => {
    try {
      const response = await fetch(`${base}/api/v1/user/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(responses),
      });
      if (!response.ok) {
        throw new Error("Failed to submit responses");
      }
      // Do not reset responses
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const allQuestionsAnswered = responses.length === questions.length;

  return (
    <div className="card">
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-800 lg:p-10">
        <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gray-800 h-20 flex flex-row">
            <div>
              <ProfilePicture />
            </div>
            <div className="text-white py-7 px-4 text-xl">
              Satisfaction Chatbot
            </div>
          </div>
          <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
            {responses.map((response, index) => (
              <div key={index} className="mb-4">
                <div className="flex w-full mt-2 space-x-3 max-w-xs">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                  <div>
                    <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                      <p className="text-sm">{response.question}</p>
                    </div>
                  </div>
                </div>
                <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                  <div>
                    <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                      <p className="text-sm">{response.response}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                </div>
              </div>
            ))}
            {!allQuestionsAnswered && (
              <div
                key={currentQuestionIndex}
                className="flex w-full mt-2 space-x-3 max-w-xs"
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                <div>
                  <div className="bg-gray-300 p-3 srounded-r-lg rounded-bl-lg">
                    <p className="text-sm">
                      {questions[currentQuestionIndex].question}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 leading-none">
                    {questions[currentQuestionIndex].options.map(
                      (option, optionIndex) => (
                        <div className="filter-button p-4" key={optionIndex}>
                          <label className="cursor-pointer">
                            <div className="flex flex-row justify-center align-middle">
                              <input
                                type="radio"
                                className=""
                                value={option}
                                onClick={() => handleOptionClick(option)}
                              />
                              <span className="px-2">
                                <label>{option}</label>
                              </span>
                            </div>
                          </label>
                        </div>
                      )
                    )}
                  </span>
                </div>
              </div>
            )}
            {allQuestionsAnswered && (
              <div>
                <div className="flex w-full mt-2 space-x-3 max-w-xs">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
                  <div>
                    <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                      <p className="text-sm">
                        Thank you for filling out the feedback!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 flex flex-row align-center text-center">
            <input
              className="border border-gray-300 rounded px-2 py-1 mt-2 w-full"
              type="text"
              placeholder="Type your message…"
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
            />
            <div className="pt-3">
              <SendButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function SendButton(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  );
}

function ProfilePicture(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="80"
      height="80"
      viewBox="0 0 100 100"
      {...props}
    >
      <circle cx="50" cy="50" r="40" fill="#ccc" />
      <rect x="30" y="70" width="40" height="10" fill="#999" />
    </svg>
  );
}

export default ChatInterface;
