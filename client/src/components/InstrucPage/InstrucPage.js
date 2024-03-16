// src/InstructionPage.js
import styles from "./InstrucPage.module.css";
import React, { useState, useMemo  } from "react";
import { useNavigate, Link } from "react-router-dom";
import { decode } from "jsonwebtoken";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getInterviewsCandidate,
  getInterviewsHR,
} from "../../actions/interviews";

const InstructionPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile"));
  const [userRole, setUserRole] = useState("");
  // const [openSnackbar, closeSnackbar] = useSnackbar();
  const dispatch = useDispatch();
  const [interviews, setInterviews] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  const checkUserRole = () => {
    try {
      const decodedToken = decode(user.token);
      if (decodedToken) {
        const userRole = decodedToken.role;
        setUserRole(userRole);
      } else {
        setUserRole("");
      }
      return decodedToken.id;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserRole("");
    }
  };

  const fetchData = async (id) => {
    try {
      let response = null;

      if (userRole === "candidate") {
        response = await dispatch(getInterviewsCandidate(id));
      } else if (userRole === "hr") {
        response = await dispatch(getInterviewsHR(id));
      }

      if (response && response[0]) {
        // Sort interviews by date and time before setting the state
        const sortedInterviews = response.sort((a, b) => {
          // Compare start dates
          const dateComparison = new Date(a.startDate) - new Date(b.startDate);
          if (dateComparison !== 0) {
            return dateComparison;
          }

          // If start dates are equal, compare start times
          return a.startTime.localeCompare(b.startTime);
        });

        setInterviews(sortedInterviews);
        setDataFetched(true);
      } else if (!response[0]) {
        console.error("No interviews found");
      } else {
        console.error("Failed to get interviews:", response.statusText);
      }
    } catch (error) {
      console.error("Error getting interviews:", error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

    let id = null;

    if (user) {
      id = checkUserRole();
    }

    if (id && interviews.length === 0 && !dataFetched) {
      fetchData(id);
    }
  }, [user, interviews, dataFetched]);




  return (
    <div className={styles.instruction_page}>
      <h1 className={styles.instruc_heading}>Instructions</h1>
      
      <p>Welcome to the Instruction Page! Follow the steps below:</p>
      
      <ol className={styles.instruc_lists}>
        <li className={styles.instruc_listItems}>First you need to fill the details about your skills and experience level</li>
        <li className={styles.instruc_listItems}>You need to allow Mic and Camera permission to continue Interview</li>
        <li className={styles.instruc_listItems}>Once the interview is started make sure that there is no other sound disturbance</li>
        <li className={styles.instruc_listItems}>You can move from camera 1-2 times else the interview will be directly ended with the required number of warning</li>
        <li className={styles.instruc_listItems}>To answer the question you will be given 1 min if you need extra you can request for extra time but marks will be deducted accordingly</li>
        <li className={styles.instruc_listItems}>If you finish answering before time you can just wait complete the remaining time else you can click on next question button to start the next question</li>
        <li className={styles.instruc_listItems}>Once the interview is started full screen mode will be enabled if you exit full screen you will be debarred from the interview process with 2 time warning alert</li>
        <li className={styles.instruc_listItems}>Once you are finished with the interview you can click on end interview button to end the interview before time and in the scheduled interview page you will see the interview status as completed</li>
        <li className={styles.instruc_listItems}>If the interview time ends it will show a pop up to exit from the interview page</li>
      </ol>
      
      <p>Feel free to contact us if you have any questions.</p>
      
      <button onClick={() => navigate("/user")}>
        Start
      </button>
    </div>
  );
};

export default InstructionPage;
