/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { decode } from "jsonwebtoken";
import { useEffect } from "react";
import styles from "./Schedule.module.css";
import { scheduleMeeting } from "../../actions/interviews";
import { useSnackbar } from 'react-simple-snackbar'
import { useDispatch } from 'react-redux'

let prevUserToken = null;

const Schedule = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile"));
  const [userRole, setUserRole] = useState("");
  const [openSnackbar, closeSnackbar] = useSnackbar()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!user) {
      console.log('navigating')
      navigate("/login");
    }
    const checkUserRole = async () => {
      try {
        const decodedToken = decode(user.token);
        if (decodedToken) {
          const userRole = decodedToken.role;
          setUserRole(userRole);
        } else {
          setUserRole("");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserRole("");
      }
    };

    if (user && user.token !== prevUserToken) {
      checkUserRole();
    }

    prevUserToken = user.token;
  }, [user]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endTime: "",
    email: "",
    status: "",
    room: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'startDate' ? new Date(value) : value;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Send a request to the server to schedule the interview
      await dispatch(scheduleMeeting(formData));
  
      // Interview scheduled successfully
      openSnackbar("Interview scheduled successfully!");
      navigate("/homepage");
    } catch (error) {
      console.error("Error scheduling interview:", error.message);
      openSnackbar("Could not schedule interview");
    }
  };

  return (
    <div className={styles.auth_container}>
      <div className={styles.auth_content}>
        <div className={styles.auth_form_container}>
          <h1 className={styles.heading}>Schedule Interview</h1>

          <form onSubmit={handleSubmit} className={styles.auth_form}>
  {userRole === "hr" && (
    <input
      type="text"
      id="title"
      name="title"
      placeholder="Title"
      value={formData.title}
      onChange={handleChange}
      className={styles.input_feild}
      required
    />
  )}
  {userRole === "hr" && (
    <input
      type="text"
      id="description"
      name="description"
      placeholder="Description"
      value={formData.description}
      onChange={handleChange}
      className={styles.input_feild}
      required
    />
  )}
  {userRole === "hr" && (
    <input
      type="date"
      id="startDate"
      name="startDate"
      value={formData.startDate}
      onChange={handleChange}
      className={styles.input_field}
      required
    />
  )}

  {userRole === "hr" && (
    <input
      type="time"
      id="startTime"
      name="startTime"
      value={formData.startTime}
      onChange={handleChange}
      className={styles.input_field}
      required
    />
  )}

  {userRole === "hr" && (
    <input
      type="time"
      id="endTime"
      name="endTime"
      value={formData.endTime}
      onChange={handleChange}
      className={styles.input_field}
    />
  )}
  {/* User field (disabled or hidden based on your UI/UX decision) */}
  {userRole === "hr" && (
    <input
      type="text"
      id="email"
      name="email"
      placeholder="Candidate email"
      value={formData.email}
      onChange={handleChange}
      className={styles.input_feild}
      // required
      // disabled
    />
  )}
  {userRole === "hr" && (
    <select
      id="status"
      name="status"
      value={formData.status}
      onChange={handleChange}
      className={styles.input_field}
      required
    >
      <option value="Scheduled">Scheduled</option>
      <option value="Cancelled">Cancelled</option>
      <option value="Completed">Completed</option>
      <option value="Live">Live</option>
      <option value="Postponed">Postponed</option>
      <option value="Rescheduled">Rescheduled</option>
    </select>
  )}
  <button className={styles.submit_button}>Schedule</button>
  <Link to={"/homepage"}><button className={styles.back_button}>Back</button></Link>
</form>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
