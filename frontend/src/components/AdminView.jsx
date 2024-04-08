import React, { useEffect, useState } from "react";
import base from "../utils/base";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminView = () => {
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await fetch(`${base}/api/v1/user/responses`);
        if (!response.ok) {
          throw new Error("Failed to fetch responses");
        }
        const data = await response.json();
        setResponses(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchResponses();
  }, []);

  return (
    <div>
      <div className="card result">
        <h2>Chatbot Satisfaction Survey Responses</h2>
        <div className="text-center pb-2">

        <Link id="result" to="/admin">
          View Questions
        </Link>
        </div>
        <div>
          {responses.length === 0 ? (
            <p>No responses found.</p>
          ) : (
            <ul>
              {responses.map((response, index) => (
                <div className="input" key={index}>
                  {response.responses.map((res, innerIndex) => (
                    <div key={innerIndex}>
                      <label>{res.question}</label>
                      <p>{res.response}</p>
                    </div>
                  ))}
                </div>
              ))}
            </ul>
          )}
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default AdminView;
