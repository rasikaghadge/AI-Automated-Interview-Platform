/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


import { useEffect } from "react";
import styles from "./Schedule.module.css";
import { scheduleMeeting } from "../../actions/interviews";
import { useDispatch } from "react-redux";
import Select from "react-select";
import makeAnimated from "react-select/animated";

let prevUserToken = null;

const Schedule = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile"));
  const [userRole, setUserRole] = useState("");
  const dispatch = useDispatch();
  const animatedComponents = makeAnimated();

  useEffect(() => {
    if (!user) {
      console.log("navigating");
      navigate("/login");
    }
    const checkUserRole = async () => {
      try {
        const decodedToken = jwtDecode(user.token);
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
    topic: "",
    requiredSkills: ""
  });

  const roleOptions = [
    { value: 'DevOps Engineer', label: 'DevOps Engineer' },
    { value: 'Data Scientist', label: 'Data Scientist' },
    { value: 'Data Engineer', label: 'Data Engineer' },
    { value: 'Software Engineer', label: 'Software Engineer' },
    { value: 'Cloud Engineer', label: 'Cloud Engineer' },
    { value: 'Machine Learning Engineer', label: 'Machine Learning Engineer' },
    { value: 'Artificial Intelligence Engineer', label: 'Artificial Intelligence Engineer' },
    { value: 'Full Stack Developer', label: 'Full Stack Developer' },
    { value: 'Frontend Developer', label: 'Frontend Developer' },
    { value: 'Backend Developer', label: 'Backend Developer' },
    { value: 'Systems Administrator', label: 'Systems Administrator' },
    { value: 'Network Engineer', label: 'Network Engineer' },
    { value: 'Security Engineer', label: 'Security Engineer' },
    { value: 'Database Administrator', label: 'Database Administrator' },
    { value: 'Quality Assurance Engineer', label: 'Quality Assurance Engineer' },
    { value: 'UI/UX Designer', label: 'UI/UX Designer' },
    { value: 'Technical Support Engineer', label: 'Technical Support Engineer' },
    { value: 'Business Intelligence Analyst', label: 'Business Intelligence Analyst' },
    { value: 'Product Manager (Technical)', label: 'Product Manager (Technical)' },
    { value: 'IT Project Manager', label: 'IT Project Manager' }
  ];  

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "startDate" ? new Date(value) : value;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRoleChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      title: selectedOption
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    formData.title = formData.title.value;
    try {
      // Send a request to the server to schedule the interview
      await dispatch(scheduleMeeting(formData));

      // Store the endTime value in local storage
      localStorage.setItem("endTime", formData.endTime);

      navigate("/homepage");
    } catch (error) {
      console.error("Error scheduling interview:", error.message);
    }
  };

  return (
    <div className={styles.auth_container}>
      <div className={styles.auth_content}>
        <div className={styles.auth_form_container}>
          <h1 className={styles.heading}>Schedule Interview</h1>

          <form onSubmit={handleSubmit} className={styles.auth_form}>
            {userRole === "hr" && (
              <>
                <label htmlFor="title" className={styles.label}>
                  Role:
                </label>
                <Select
                  options={roleOptions}
                  components={animatedComponents}
                  closeMenuOnSelect={true}
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleRoleChange}
                  required
                />
              </>
            )}
            {userRole === "hr" && (
              <>
                <label htmlFor="description" className={styles.label}>
                  Description:
                </label>
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
              </>
            )}
            {userRole === "hr" && (
              <>
                <label htmlFor="start-date" className={styles.label}>
                  Start Date:
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={styles.input_field}
                  required
                />
              </>
            )}

            {userRole === "hr" && (
              <>
                <label htmlFor="start-time" className={styles.label}>
                  Start Time:
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={styles.input_field}
                  required
                />
              </>
            )}

            {userRole === "hr" && (
              <>
                <label htmlFor="end-time" className={styles.label}>
                  End Time:
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={styles.input_field}
                />
              </>
            )}
            {/* User field (disabled or hidden based on your UI/UX decision) */}
            {userRole === "hr" && (
              <>
                <label htmlFor="email" className={styles.label}>
                  Registered Email:
                </label>
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
              </>
            )}
            {userRole === "hr" && (
              <>
                <label htmlFor="topic" className={styles.label}>
                  Topics
                </label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  placeholder="Topics (comma separated)"
                  value={formData.topic}
                  onChange={handleChange}
                  className={styles.input_feild}
                />
              </>
            )}
            {userRole === "hr" && (
              <>
                <label htmlFor="requiredSkills" className={styles.label}>
                  Required Skills
                </label>
                <input
                  type="text"
                  id="requiredSkills"
                  name="requiredSkills"
                  placeholder="Required Skills (comma separated)"
                  value={formData.requiredSkills}
                  onChange={handleChange}
                  className={styles.input_feild}
                />
              </>
            )}
            {userRole === "hr" && (
              <>
                <label htmlFor="status" className={styles.label}>
                  Status:
                </label>
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
              </>
            )}
            <div className="btn_container">
              <button className={styles.submit_button}>Schedule</button>
              <Link to={"/homepage"}>
                <button className={styles.back_button}>Back</button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
