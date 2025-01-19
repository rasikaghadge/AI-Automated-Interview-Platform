import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "react-simple-snackbar";
import {
  getInterviewsCandidate,
  getInterviewsHR,
} from "../../actions/interviews";
import styles from "./SeeScheduledInterviews.module.css";
import { getEvaluationUsingInterviewId, getInterviewDetailsById } from "../../api/index";
import EvaluationPopup from "./EvaluationPopup";
import { checkUserRole } from "../../actions/auth";
import ProfileModel from "./UserProfileDetails";
import { getProfile } from "../../actions/profile";

const SeeScheduledInterviews = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile"));
  const [userRole, setUserRole] = useState("");
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const dispatch = useDispatch();
  const [interviews, setInterviews] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [evaluationData, setEvaluationData] = useState(null);
  const [showEvaluationPopup, setShowEvaluationPopup] = useState(false);
  const [showProfileModel, setShowProfileModel] = useState(false);
  const [selectedInterviewProfile, setselectedInterviewProfile] = useState({});
  const [selectedInterviewDetails, setSelectedInterviewDetails] = useState({});

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

    let id = null;
    let role = null;

    if (user) {
      ({ id, role } = checkUserRole(user));
      setUserRole(role);
    }
    console.log("id", id);
    const fetchData = async (id) => {
      try {
        let response = null;
        if (userRole === "candidate") {
          response = await dispatch(getInterviewsCandidate(id));
        } else if (userRole === "hr") {
          response = await dispatch(getInterviewsHR(id));
        }
        console.log(response);
        if (response && response[0]) {
          // Sort interviews by date and time before setting the state
          const sortedInterviews = response.sort((a, b) => {
            // Compare start dates
            const dateComparison =
              new Date(a.startDate) - new Date(b.startDate);
            if (dateComparison !== 0) {
              return dateComparison;
            }

            // If start dates are equal, compare start times
            return a.startTime.localeCompare(b.startTime);
          });

          setInterviews(sortedInterviews);
          setDataFetched(true);
        } else if (!response[0]) {
          openSnackbar("Loading interviews");
          setDataFetched(true);
        } else {
          openSnackbar("Failed to get interviews");
          setDataFetched(true);
        }
      } catch (error) {
        openSnackbar("Loading Interviews");
      }
    };

    if (id && interviews.length === 0 && !dataFetched) {
      fetchData(id);
    }
  }, [
    user,
    interviews,
    dataFetched,
    userRole,
    navigate,
    dispatch,
    openSnackbar
  ]);

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
    return (startTime, endTime, startDate, interviewStatus, userRole) => {
      const now = new Date();
      const start = parseTimeString(startTime, startDate);
      const end = parseTimeString(endTime, startDate);
      return (
        start <= now &&
        now <= end &&
        userRole === "candidate" &&
        interviewStatus === "Scheduled"
      );
    };
  }, []);

  const canGetEvaluation = useMemo(() => {
    return (startTime, endTime, startDate, interviewStatus, userRole) => {
      const now = new Date();
      const start = parseTimeString(startTime, startDate);
      const end = parseTimeString(endTime, startDate);
      return (
        start < now &&
        end < now &&
        userRole === "hr" &&
        interviewStatus === "Completed"
      );
    };
  }, []);

  const navigateToInstrucPage = (
    participantName,
    startDate,
    endTime,
    id,
    role,
    topics,
    requiredSkills
  ) => {
    navigate("/instructions", {
      state: {
        participantNameFromDB: participantName,
        interviewId: id,
        role: role,
        topics: topics,
        requiredSkills: requiredSkills,
      },
    });
  };

  const showCandidateEvaluation = async (id) => {
    const { data } = await getEvaluationUsingInterviewId(id);
    if (data) {
      setEvaluationData(JSON.stringify(data.score));
      setShowEvaluationPopup(true);
    } else {
      setEvaluationData(
        JSON.stringify({ data: "Cannot get evaluation at this time" })
      );
      setShowEvaluationPopup(true);
    }
    const response = await getInterviewDetailsById(id);
    if (response.statusText === "OK") {
      setSelectedInterviewDetails(response.data);
    }
  };

  const showUserProfileDetails = (id) => {
    const userProfile = dispatch(getProfile(id));
    userProfile
      .then((res) => {
        setselectedInterviewProfile(res);
        setShowProfileModel(true);
      })
      .catch((err) => {
        openSnackbar("Error in fetching profile data");
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
                <th>Job Role</th>
                {userRole === "candidate" ? <th>Company</th> : null}
                <th>Description</th>
                <th>Date and Time</th>
                {/* <th>Time</th> */}
                {userRole === "candidate" ? <th>HR</th> : null}
                {userRole === "hr" ? <th>Candidate</th> : null}
                <th>Status</th>
                {userRole === "candidate" ? (
                  <th>Join</th>
                ) : (
                  <th>Get Evaluation</th>
                )}
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((interview) => (
                <tr key={interview._id}>
                  <td>{interview.title}</td>
                  {userRole === "candidate" ? <td>{interview.hrCompany}</td> : null}
                  <td>{interview.description}</td>
                  <td>{new Date(interview.startDate).toLocaleDateString()} {`${interview.startTime} - ${interview.endTime}`}</td>
                  {/* <td>{`${interview.startTime} - ${interview.endTime}`}</td> */}
                  <td>
                    {userRole === "candidate" ? (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            width: "75px",
                            height: "65px",
                            borderRadius: "50%",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={`data:image/png;base64, ${interview.profilePicture}`}
                            alt="HR Profile"
                            style={{ width: "100%", height: "100%" }}
                            onClick={() => showUserProfileDetails(interview.hr)}
                          />
                        </div>
                        <div style={{ marginLeft: "10px" }}>
                          <p>{interview.hrName}</p>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            width: "75px",
                            height: "65px",
                            borderRadius: "50%",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={`data:image/png;base64, ${interview.profilePicture}`}
                            alt="HR Profile"
                            style={{ width: "100%", height: "100%" }}
                            onClick={() =>
                              showUserProfileDetails(interview.candidate)
                            }
                          />
                        </div>
                        <div style={{ marginLeft: "10px" }}>
                          <p>{interview.candidateName}</p>
                        </div>
                      </div>
                    )}
                  </td>

                  <td>{interview.status}</td>

                  {userRole === "candidate" ? (
                    <button
                      onClick={() =>
                        navigateToInstrucPage(
                          interview.participantName,
                          interview.startDate,
                          interview.endTime,
                          interview._id,
                          interview.title,
                          interview.topic,
                          interview.requiredSkills
                        )
                      }
                      className={`btn btn-success ${
                        !isJoinEnabled(
                          interview.startTime,
                          interview.endTime,
                          interview.startDate,
                          interview.status,
                          userRole
                        )
                          ? "disabled"
                          : ""
                      }`}
                    >
                      Join Interview
                    </button>
                  ) : (
                    <button
                      className={`btn btn-success ${
                        !canGetEvaluation(
                          interview.startTime,
                          interview.endTime,
                          interview.startDate,
                          interview.status,
                          userRole
                        )
                          ? "disabled"
                          : ""
                      }`}
                      onClick={() => showCandidateEvaluation(interview._id)}
                    >
                      Get Evaluation
                    </button>
                  )}
                  <td>
                    {interview.hiringStatus ? interview.hiringStatus : "Decision Pending"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className=".btn_container">
          <Link to={"/homepage"}>
            <button
              className="btn btn-secondary"
              style={{ marginRight: "20px", marginTop: "10px" }}
            >
              Back
            </button>
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
      {showEvaluationPopup && (
        <EvaluationPopup
          evaluationData={evaluationData}
          onClose={() => setShowEvaluationPopup(false)}
          interviewDetails={selectedInterviewDetails}
        />
      )}

      {showProfileModel && (
        <ProfileModel
          profile={selectedInterviewProfile}
          onClose={() => setShowProfileModel(false)}
          role={userRole === "hr" ? "candidate": "hr"}
        />
      )}
    </div>
  );
};

export default SeeScheduledInterviews;
