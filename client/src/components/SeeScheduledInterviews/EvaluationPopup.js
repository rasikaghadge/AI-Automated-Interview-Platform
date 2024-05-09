import React from "react";

const EvaluationPopup = ({ evaluationData, onClose, interviewDetails }) => {
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
  let result = "";
  try {
    result = evaluationData.replace(/\\n/g, "\n");
  } catch (error) {
    result = evaluationData;
  }
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          width: "80%",
          maxWidth: "500px",
        }}
      >
        <h2 style={{ margin: 0 }}>Evaluation</h2>
        {evaluationData ? (
          <div style={{ marginTop: "20px", marginBottom: "20px" }}>
            {/* Display evaluation data here */}
            <p>{result}</p>
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
