/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { decode } from "jsonwebtoken";
import { useEffect } from "react";
import styles from "./UserDetails.module.css";
import { getProfile } from "../../actions/profile";
import { useSnackbar } from "react-simple-snackbar";
import { useDispatch } from "react-redux";
import { saveUserDetails } from "../../actions/modelCommunication";
import { useLocation } from "react-router-dom";

const UserDetails = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile"));
  const [userRole, setUserRole] = useState("");
  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();
  const location = useLocation();
  const interviewId = location?.state?.interviewId;
  const participantName = location?.state?.participantNameFromDB;
  const role = location?.state?.role;


  const [initialData, setInitialData] = useState({
    firstname: "",
    lastname: "",
    skills: "",
    experience: "",
  });
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
      response = await dispatch(getProfile(id));

      if (response) {
        setInitialData({
          firstName: response.firstName,
          lastName: response.lastName,
          skills: response.technicalSkills,
          experience: response.experience,
        });
        document.getElementById("name").value = response.user.firstName + " " + response.user.lastName;
        setDataFetched(true);
        setFormData(initialData);
      }
    } catch (error) {
      console.error("Error getting profile data:", error.message);
    }
  };

  useEffect(() => {
    const fetchDataAsync = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      let id = null;

      if (user) {
        try {
          id = await checkUserRole();
        } catch (error) {}
      }

      if (id && !dataFetched) {
        fetchData(id);
      }
    };

    fetchDataAsync();
  }, [user, dataFetched]);

  // check if user has changed some fields
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState({
    technicalSkills: "",
    experience: "",
    topic: ""
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response = null;

    try {
      // Send a request to the server to update the profile
      response = await dispatch(
        saveUserDetails(
          formData.skills,
          formData.experience,
          role,
          interviewId
        )
      );
      console.log("Profile updated successfully!");
      navigate(`/interview/${interviewId}`, {
        state: {
          participantNameFromDB: participantName,
          interviewId: interviewId,
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }

    setHasChanges(false);
  };

  return (
    <div className={styles.auth_container}>
      <div className={styles.auth_content}>
        <div className={styles.auth_form_container}>
          <h1 className={styles.heading}>Update Candidate Details</h1>
          <form onSubmit={handleSubmit} className={styles.auth_form}>
          <label htmlFor="name" className={styles.label}>
                  Candidate Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  disabled
                  className={styles.input_feild}
                  required
                />
                <label htmlFor="technicalSkills" className={styles.label}>
                  Technical Skills (comma separated):
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  placeholder="Technical Skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className={styles.input_feild}
                  required
                />
                <label htmlFor="topic" className={styles.label}>
                  Topic
                </label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  placeholder="Topic"
                  value={formData.topic}
                  onChange={handleChange}
                  className={styles.input_feild}
                  required
                />
                <label htmlFor="experience" className={styles.label}>
                  Experience level
                </label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  placeholder="Fresher, 1-2 years, 3-5 years, 5+ years"
                  value={formData.experience}
                  onChange={handleChange}
                  className={styles.input_feild}
                  required
                />

            <button className={styles.submit_button}>Update</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
