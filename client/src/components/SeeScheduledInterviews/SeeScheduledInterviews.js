import React, { useState, useMemo  } from "react";
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
import NavBar from "../NavBar/NavBar";

const SeeScheduledInterviews = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile"));
  const [userRole, setUserRole] = useState("");
  const [openSnackbar, closeSnackbar] = useSnackbar();
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

  // Function to parse time string (HH:MM) and create a Date object
  const parseTimeString = (timeString, startDate) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date(startDate);
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(0);

    return date;
  };

  const isJoinEnabled = useMemo(() => {
    return (startTime, endTime, startDate, userRole) => {
      const now = new Date();
      const start = parseTimeString(startTime, startDate);
      const end = parseTimeString(endTime, startDate);
      return start <= now && now <= end && userRole === "candidate";
    };
  }, []);

  const navigateToVideosdkMeeting = (roomId, participantName) => {
    navigate('/interview', {
      state: {
        roomIDFromDB: roomId,
        participantNameFromDB: participantName,
      },
    });
  };

  return (
    <div className={styles.navbar_container}>
    
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
          {console.log(interviews)}
            {interviews.map((interview) => (
              <tr key={interview._id}>
                <td>{interview.title}</td>
                <td>{interview.description}</td>
                <td>{new Date(interview.startDate).toLocaleDateString()}</td>
                <td>{`${interview.startTime} - ${interview.endTime}`}</td>
                <td>{userRole === "candidate" ? <img
                    src={`data:image/png;base64, ${interview.profilePicture}`}
                    alt="HR Profile"
                    style={{ width: '85px', height: '50px', borderRadius: '50%' }}
                  />: <img
                    src={`data:image/png;base64, ${interview.profilePicture}`} 
                    alt="HR Profile"
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                  />}</td>  
                <td>{interview.status}</td>
                  <button
                    onClick={() => navigateToVideosdkMeeting(interview.room.roomId, interview.candidateName)}
                    className={`btn btn-success btn-sm ${
                      !isJoinEnabled(
                        interview.startTime,
                        interview.endTime,
                        interview.startDate,
                        userRole
                      )
                        ? "disabled"
                        : ""
                    }`}
                    style={{ margin: "5px", marginTop: "10px" }}
                  >
                    Join Interview
                  </button>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className=".btn_container">
      <Link to={"/homepage"}>
        <button className="btn btn-secondary" style={{ marginRight: "20px", marginTop: "10px" }}>Back</button>
      </Link>
      {userRole === "hr" && (
        <Link to={"/schedule"}>
          <button className="btn btn-primary" style={{ marginTop: "10px" }}>
            Schedule Interview
          </button>
        </Link>
      )}
      </div>
    </div>
    </div>
  );
};

export default SeeScheduledInterviews;
