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
  let prevUserToken = null;
  const [dataFetched, setDataFetched] = useState(false);

  const checkUserRole = async () => {
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

    if (user && user.token !== prevUserToken) {
      id = checkUserRole();
    }

    prevUserToken = user.token;

    if (id && interviews.length === 0 && !dataFetched) {
      fetchData(id);
    }
  }, [user, interviews, dataFetched]);

  // Function to parse time string (HH:MM) and create a Date object
const parseTimeString = (timeString, startDate) => {
  const [hours, minutes] = timeString.split(':');
  const date = new Date(startDate);
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  date.setSeconds(0);

  return date;
};

  // Function to check if the current time is between start and end time
  const isTimeBetween = (startTime, endTime, startDate) => {
    const now = new Date();
    const start = parseTimeString(startTime, startDate);
    const end = parseTimeString(endTime, startDate);
    return start <= now && now <= end;
  };

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
              <th>Join</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((interview) => (
              <tr key={interview._id}>
                <td>{interview.title}</td>
                <td>{interview.description}</td>
                <td>{new Date(interview.startDate).toLocaleDateString()}</td>
                <td>{`${interview.startTime} - ${interview.endTime}`}</td>
                {userRole === "candidate" ? <td>{interview.hrName}</td> : null}
                {userRole === "hr" ? <td>{interview.candidateName}</td> : null}   
                <td>{interview.status}</td>
                {userRole === "candidate" && isTimeBetween(interview.startTime, interview.endTime, interview.startDate) ? (
                <button className="btn btn-success btn-sm" style={{margin: "5px", marginTop: "10px"}}>Join Interview</button>
              ) : <button className="btn btn-success btn-sm disabled" style={{margin: "5px", marginTop: "10px"}}>Join Interview</button>}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Link to={"/homepage"}>
        <button className="btn btn-secondary" style={{marginRight: "20px", marginTop: "10px"}} >Back</button>
      </Link>
      {/* TODO change the route to schedule page */}
      {userRole==="hr" && <Link to={"/homepage"}>
        <button className="btn btn-primary"style={{marginTop: "10px"}}>Schedule Interview</button>
      </Link>}

    </div>
  );
};

export default SeeScheduledInterviews;
