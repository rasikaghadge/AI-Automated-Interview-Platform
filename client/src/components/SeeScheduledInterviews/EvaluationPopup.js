import React, { useState } from "react";
import "./EvaluationPopup.css";
import { useDispatch } from "react-redux";
import { changeInterviewHiringStatus } from "../../actions/interviews";

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
  const dispatch = useDispatch();
  const [currentHiringStatus, setCurrentHiringStatus] =
    useState("Decision Pending");
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  const sendHiringStatusEmail = (hiringDecision) => {
    const mail_type =
      hiringDecision === "Select" ? "select_candidate" : "reject_candidate";
    interviewDetails.mail_type = mail_type;
    // Disable the buttons immediately
    setButtonsDisabled(true);

    // send email to the candidate
    console.log("mail status");
    fetch("http://localhost:8000/mail/", {
      method: "POST",
      headers: {
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

    updateHiringStatusForInterview(hiringDecision);
  };

  const updateHiringStatusForInterview = (hiringDecision) => {
    if (hiringDecision === "Select") {
      hiringDecision = "Selected";
    } else {
      hiringDecision = "Rejected";
    }
    interviewDetails.hiring_status = hiringDecision;
    const response = dispatch(
      changeInterviewHiringStatus(interviewDetails._id, hiringDecision)
    );

    if (response.status === 200) {
      setCurrentHiringStatus(hiringDecision);
    }
  };

  if (evaluationData) {
    // Replace double backslashes with single backslashes and split by new lines
    evaluationData = evaluationData.replace(/\\n/g, "\n");
    parsedEvaluationData = parseEvaluationText(evaluationData);
    if (interviewDetails.hiringStatus !== currentHiringStatus) {
      setCurrentHiringStatus(interviewDetails.hiringStatus);
    }
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
        {currentHiringStatus === "Decision Pending" ? (
          <>
            <button
              onClick={() => sendHiringStatusEmail("Select")}
              id="select-candidate-button"
              className="btn btn-success"
              disabled={buttonsDisabled}
            >
              Select Candidate
            </button>
            <button
              onClick={() => sendHiringStatusEmail("Reject")}
              id="reject-candidate-button"
              className="btn btn-danger"
              disabled={buttonsDisabled}
            >
              Reject Candidate
            </button>
          </>
        ) : (
          <>
            <button
              disabled
              onClick={() => sendHiringStatusEmail("Select")}
              id="select-candidate-button"
              className="btn btn-success"
            >
              Select Candidate
            </button>
            <button
              disabled
              onClick={() => sendHiringStatusEmail("Reject")}
              id="reject-candidate-button"
              className="btn btn-danger"
            >
              Reject Candidate
            </button>
          </>
        )}

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
