import React from "react";
import "./EvaluationPopup.css"; // Import the CSS file for styling

// Function to parse the evaluation text
const parseEvaluationText = (text) => {
  const sections = text.split("\n\n");
  const parsedData = {};

  sections.forEach((section) => {
    const [title, ...content] = section.split("\n");
    parsedData[title] = content.join(" ");
  });

  return parsedData;
};

const EvaluationPopup = ({ evaluationData, onClose, interviewDetails }) => {
  let parsedEvaluationData = {};

  const sendHiringStatusEmail = (hiringDecision) => {
    const mail_type =
      hiringDecision === "Select" ? "select_candidate" : "reject_candidate";
    interviewDetails.mail_type = mail_type;
    // send email to the candidate
    console.log("mail status");
    fetch("http://localhost:8000/mail/", {
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(interviewDetails),
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (evaluationData) {
    // Replace double backslashes with single backslashes and split by new lines
    evaluationData = evaluationData.replace(/\\n/g, "\n");
    parsedEvaluationData = parseEvaluationText(evaluationData);
  }

  // Extract the final evaluation score and details to display at the top
  const finalEvaluationKey = Object.keys(parsedEvaluationData).find((key) =>
    key.startsWith("Final Evaluation Score")
  );
  const finalEvaluationValue = finalEvaluationKey
    ? parsedEvaluationData[finalEvaluationKey]
    : "";
  const [finalTitle, finalScore] = finalEvaluationKey
    ? finalEvaluationKey.split(":")
    : ["", ""];

  return (
    <div className="evaluation-popup-overlay">
      <div className="evaluation-popup-content">
        <h2>Evaluation</h2>
        {evaluationData ? (
          <div className="evaluation-container">
            {finalEvaluationKey && (
              <div className="final-evaluation">
                <h3 className="final-evaluation-title">{finalTitle.trim()}</h3>
                <p className="final-evaluation-score">{finalScore.trim()}</p>
                <p className="final-evaluation-details">
                  {finalEvaluationValue}
                </p>
              </div>
            )}
            {Object.entries(parsedEvaluationData).map(([key, value], index) => {
              if (key === finalEvaluationKey) return null; // Skip final evaluation since it's displayed at the top
              if (key === "Strengths:" || key === "Weaknesses:") {
                const items = value.split("-").filter((item) => item.trim());
                return (
                  <div key={index}>
                    <h3 className="section-title">{key}</h3>
                    <ul>
                      {items.map((item, idx) => (
                        <li key={idx} className="list-item">
                          {item.trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              } else if (key.includes("Score:")) {
                const [title, score] = key.split(":");
                return (
                  <div key={index}>
                    <h3 className="section-title">{title.trim()}</h3>
                    <p className="section-content">
                      <strong>Score: {score.trim()}</strong>
                      <br />
                      {value}
                    </p>
                  </div>
                );
              } else {
                return (
                  <div key={index}>
                    <h3 className="section-title">{key.trim()}</h3>
                    <p className="section-content">{value}</p>
                  </div>
                );
              }
            })}
          </div>
        ) : (
          <p>No evaluation data available.</p>
        )}
        <button
          onClick={() => sendHiringStatusEmail("Select")}
          className="btn btn-success"
        >
          Select Candidate
        </button>{" "}
        &nbsp;{" "}
        <button
          onClick={() => sendHiringStatusEmail("Reject")}
          className="btn btn-danger"
        >
          Reject Candidate
        </button>
        <button
          onClick={onClose}
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            marginTop: "20px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EvaluationPopup;
