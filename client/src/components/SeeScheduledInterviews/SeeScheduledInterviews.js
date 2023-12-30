import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { decode } from "jsonwebtoken";
import { useEffect } from "react";
import styles from "./SeeScheduledInterviews.module.css";
import { useSnackbar } from "react-simple-snackbar";
import { useDispatch } from "react-redux";
import {
  getInterviewsCandidate,
  getInterviewsHR,
} from "../../actions/interviews";

const SeeScheduledInterviews = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile"));
  const [userRole, setUserRole] = useState("");
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const dispatch = useDispatch();
  const [interviews, setInterviews] = useState([]);

  const fetchData = async () => {
    if (user && user.token) {
      const decodedToken = decode(user.token);
      try {
        let response;

        if (decodedToken) {
          const role = decodedToken.role;
          setUserRole(role);

          if (role === "candidate") {
            response = await dispatch(getInterviewsCandidate(decodedToken.id));
          } else if (role === "hr") {
            response = await dispatch(getInterviewsHR(decodedToken.id));
          }

          if (response && response[0]) {
            setInterviews(response);
          } else if (!response[0]) {
            console.error("No interviews found");
          } else {
            console.error("Failed to get interviews:", response.statusText);
          }
        } else {
          setUserRole("");
        }
      } catch (error) {
        console.error("Error getting interviews:", error.message);
      }
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

    fetchData();
  }, [user]);

  return (
    <div className={styles.scheduled_interviews_container}>
      <h2>Scheduled Interviews</h2>

      {interviews.length === 0 ? (
        <p>No interviews scheduled.</p>
      ) : (
        <table className={styles["interview-table"]}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Time</th>
              {userRole === "candidate" ? <th>HR</th> : null}
              {userRole === "hr" ? <th>Candidate</th> : null}
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((interview) => (
              <tr key={interview._id}>
                <td>{interview.title}</td>
                <td>{interview.description}</td>
                <td>{interview.startTime}</td>
                <td>{`${interview.startTime} - ${interview.endTime}`}</td>
                {userRole === "candidate" ? <td>{interview.hr}</td> : null}
                {userRole === "hr" ? <td>{interview.candidate}</td> : null}
                <td>{interview.status}</td>
                {userRole === "candidate" ? (
                  <button className={styles.join_button}>Join Interview</button>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Link to={"/homepage"}><button className={styles.back_button}>Back</button></Link>
    </div>
  );
};

export default SeeScheduledInterviews;
