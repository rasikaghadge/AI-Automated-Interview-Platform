import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { decode } from "jsonwebtoken";
import { useEffect } from "react";
import styles from "./UpdateProfile.module.css";

let prevUserToken = null;

const UpdateProfile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile"));
  const [userRole, setUserRole] = useState("");

  if (!user) {
    navigate("/login");
  }

  useEffect(() => {
    const checkUserRole = async () => {
      // console.log(user.token)
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

    // Check if the user data has changed before making the request
    if (user && user.token !== prevUserToken) {
      checkUserRole();
    }

    // Update the previous user token for the next comparison
    prevUserToken = user.token;
  }, [user]);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    dob: "",
    technicalSkills: "",
    experience: "",
    nonTechnicalSkills: "",
    strengths: "",
    weaknesses: "",
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let response = null;

    try {
      // Send a request to the server to update the profile

      if (!response.ok) {
        // Handle non-successful response, e.g., show an error message
        console.error("Failed to update profile:", response.statusText);
        return;
      }

      // Profile updated successfully
      console.log("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  return (
    <div className={styles.auth_container}>
      <div className={styles.auth_content}>
        <div className={styles.auth_form_container}>
          <h1 className={styles.heading}>Update Profile</h1>

          <form onSubmit={handleSubmit} className={styles.auth_form}>
            <input
              name="firstName"
              placeholder="First name"
              onChange={handleChange}
              type="test"
              className={styles.input_feild}
            />
            <input
              name="lastName"
              placeholder="Last name"
              onChange={handleChange}
              type="test"
              className={styles.input_feild}
            />
            <input
              type="date"
              id="dob"
              name="dob"
              placeholder="Date of birth"
              value={formData.dob}
              onChange={handleChange}
              className={styles.input_feild}
              required
            />
            <input
              type="text"
              id="technicalSkills"
              name="technicalSkills"
              placeholder="Technical Skills (comma separated)"
              value={formData.technicalSkills}
              onChange={handleChange}
              className={styles.input_feild}
              required
            />
        <input
          type="number"
          id="experience"
          name="experience"
          placeholder="Years of experience"
          value={formData.experience}
          onChange={handleChange}
          className={styles.input_feild}
          required
        />

        <input
          type="text"
          id="nonTechnicalSkills"
          name="nonTechnicalSkills"
          placeholder="non-technical skills (comma separated)"
          value={formData.nonTechnicalSkills}
          onChange={handleChange}
          className={styles.input_feild}
        />

        <textarea
          id="strengths"
          name="strengths"
          value={formData.strengths}
          onChange={handleChange}
          className={styles.input_feild}
          placeholder="Strengths"
        />

        <textarea
          id="weaknesses"
          name="weaknesses"
          value={formData.weaknesses}
          onChange={handleChange}
          className={styles.input_feild}
          placeholder="Weaknesses"
        />
        <button className={styles.submit_button} >Update</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
