import React from "react";

const Evaluation = ({ evaluationData, onClose }) => {
    console.log(evaluationData)
  const sections = evaluationData ? evaluationData.split("\n") : [];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '80%', maxWidth: '500px' }}>
        <h2 style={{ margin: 0 }}>Evaluation</h2>
        {sections.length > 0 ? (
          sections.map((section, index) => (
            <p key={index} style={{ marginTop: '20px', marginBottom: '20px' }}>
              {section}
            </p>
          ))
        ) : (
          <p>No evaluation data available.</p>
        )}
        <button onClick={onClose} style={{ display: 'block', width: '100%', padding: '10px', marginTop: '20px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Close</button>
      </div>
    </div>
  );
};

export default Evaluation;