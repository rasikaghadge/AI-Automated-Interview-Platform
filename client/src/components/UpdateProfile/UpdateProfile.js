/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { decode } from "jsonwebtoken";
import { useEffect } from "react";
import styles from "./UpdateProfile.module.css";
import { updateProfile, getProfile } from "../../actions/profile";
import { useSnackbar } from "react-simple-snackbar";
import { useDispatch } from "react-redux";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile"));
  const [userRole, setUserRole] = useState("");
  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();

  const [initialData, setInitialData] = useState({
    firstname: "",
    lastname: "",
    dob: "",
    technicalSkills: "",
    experience: "",
    softSkills: "",
    education: "",
    strengths: "",
    weaknesses: "",
    previousRolesDescription: "",
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
          company: response.company,
          firstName: response.firstName,
          lastName: response.lastName,
          dob: response.dob,
          technicalSkills: response.technicalSkills,
          experience: response.experience,
          softSkills: response.softSkills,
          education: response.education,
          strengths: response.strengths,
          weaknesses: response.weaknesses,
          previousRolesDescription: response.previousRolesDescription,
        });
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
    firstname: "",
    lastname: "",
    dob: "",
    technicalSkills: "",
    experience: "",
    softSkills: "",
    education: "",
    strengths: "",
    weaknesses: "",
    previousRolesDescription: "",
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setHasChanges(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let response = null;

    try {
      // Send a request to the server to update the profile
      dispatch(updateProfile(user.id, formData, openSnackbar));

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

    setHasChanges(false);
  };

  return (
    <div className={styles.auth_container}>
      <div className={styles.auth_content}>
        <div className={styles.auth_form_container}>
          <h1 className={styles.heading}>Update Profile</h1>

          <form onSubmit={handleSubmit} className={styles.auth_form}>
            {userRole === "hr" && (
              <>
                <label htmlFor="company" className={styles.label}>
                  Company:
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  placeholder="Company"
                  value={formData.company}
                  onChange={handleChange}
                  className={styles.input_feild}
                  required
                />
              </>
            )}

            {userRole === "candidate" && (
              <>
                <label htmlFor="technicalSkills" className={styles.label}>
                  Technical Skills (comma separated):
                </label>
                <input
                  type="text"
                  id="technicalSkills"
                  name="technicalSkills"
                  placeholder="Technical Skills"
                  value={formData.technicalSkills}
                  onChange={handleChange}
                  className={styles.input_feild}
                  required
                />
              </>
            )}

            {userRole === "candidate" && (
              <>
                <label htmlFor="softSkills" className={styles.label}>
                  Soft Skills (comma separated):
                </label>
                <input
                  type="text"
                  id="softSkills"
                  name="softSkills"
                  placeholder="Soft Skills"
                  value={formData.softSkills}
                  onChange={handleChange}
                  className={styles.input_feild}
                  required
                />
              </>
            )}

            {userRole === "candidate" && (
              <>
                <label htmlFor="education" className={styles.label}>
                  Education:
                </label>
                <select
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className={styles.select_box} /* Include both classes */
                  required
                >
                  <option value="">Select Education</option>
                  <option value="High School">High School</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Post Graduate">Post Graduate</option>
                </select>
              </>
            )}

            {userRole === "candidate" && (
              <>
                <label htmlFor="experience" className={styles.label}>
                  Years of experience:
                </label>
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
              </>
            )}

            {userRole === "candidate" && initialData.experience > 0 && (
              <>
                <label
                  htmlFor="previousRolesDescription"
                  className={styles.label}
                >
                  Description of previous roles:
                </label>
                <input
                  type="text"
                  id="previousRolesDescription"
                  name="previousRolesDescription"
                  placeholder="Description of previous roles"
                  value={formData.previousRolesDescription}
                  onChange={handleChange}
                  className={styles.input_feild}
                />
              </>
            )}

            {userRole === "candidate" && (
              <>
                <label htmlFor="strengths" className={styles.label}>
                  Strengths:
                </label>
                <textarea
                  id="strengths"
                  name="strengths"
                  value={formData.strengths}
                  onChange={handleChange}
                  className={styles.input_feild}
                  placeholder="Strengths"
                />
              </>
            )}

            {userRole === "candidate" && (
              <>
                <label htmlFor="weaknesses" className={styles.label}>
                  Weaknesses:
                </label>
                <textarea
                  id="weaknesses"
                  name="weaknesses"
                  value={formData.weaknesses}
                  onChange={handleChange}
                  className={styles.input_feild}
                  placeholder="Weaknesses"
                />
              </>
            )}

            {hasChanges ? (
              <button className={styles.submit_button}>Update</button>
            ) : (
              <button className={styles.submit_button_disabled}>Update</button>
            )}
            <Link to={"/homepage"}>
              <button className={styles.back_button}>Back</button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
