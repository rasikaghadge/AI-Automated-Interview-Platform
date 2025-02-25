/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { decode } from "jsonwebtoken";
import { useEffect } from "react";
import styles from "./UserDetails.module.css";
import { getProfile, updateProfile } from "../../actions/profile";
import { useSnackbar } from "react-simple-snackbar";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const UserDetails = () => {
  const location = useLocation();
  const interviewId = location?.state?.interviewId;
  const participantName = location?.state?.participantNameFromDB;
  const role = location?.state?.role;
  const topics = location?.state?.topics;
  const requiredSkills = location?.state?.requiredSkills;
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile"));
  const [userRole, setUserRole] = useState("");
  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();
  const animatedComponents = makeAnimated();

  const [initialData, setInitialData] = useState({
    firstname: "",
    lastname: "",
    dob: "",
    technicalSkills: [],
    experience: "",
    softSkills: [],
    education: "",
    strengths: "",
    weaknesses: "",
    previousRolesDescription: "",
  });
  const [dataFetched, setDataFetched] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    dob: "",
    technicalSkills: [],
    experience: "",
    softSkills: [],
    education: "",
    strengths: "",
    weaknesses: "",
    previousRolesDescription: "",
  });
  
  // eslint-disable-next-line no-unused-vars
  const [hasChanges, setHasChanges] = useState(false);

  const technicalSkillsOptions = [
    { value: 'AWS', label: 'AWS' },
    { value: 'Azure', label: 'Azure' },
    { value: 'GCP', label: 'GCP' },
    { value: 'Python', label: 'Python' },
    { value: 'Java', label: 'Java' },
    { value: 'C++', label: 'C++' },
    { value: 'JavaScript', label: 'JavaScript' },
    { value: 'SQL', label: 'SQL' },
    { value: 'NoSQL', label: 'NoSQL' },
    { value: 'Docker', label: 'Docker' },
    { value: 'Kubernetes', label: 'Kubernetes' },
    { value: 'Git', label: 'Git' },
    { value: 'HTML', label: 'HTML' },
    { value: 'CSS', label: 'CSS' },
    { value: 'React', label: 'React' },
    { value: 'Angular', label: 'Angular' },
    { value: 'Node.js', label: 'Node.js' },
    { value: 'Flask', label: 'Flask' },
    { value: 'Django', label: 'Django' },
    { value: 'TensorFlow', label: 'TensorFlow' },
    { value: 'PyTorch', label: 'PyTorch' },
    { value: 'Spark', label: 'Spark' },
    { value: 'Hadoop', label: 'Hadoop' },
    { value: 'Machine Learning', label: 'Machine Learning' },
    { value: 'Deep Learning', label: 'Deep Learning' },
    { value: 'Data Analysis', label: 'Data Analysis' },
    { value: 'Data Visualization', label: 'Data Visualization' },
    { value: 'Linux', label: 'Linux' },
    { value: 'Windows Server', label: 'Windows Server' },
    { value: 'Network Security', label: 'Network Security' },
    { value: 'Cybersecurity', label: 'Cybersecurity' },
    { value: 'Agile Methodologies', label: 'Agile Methodologies' },
    { value: 'Scrum', label: 'Scrum' },
    { value: 'Project Management', label: 'Project Management' }
  ];
  
  // eslint-disable-next-line no-unused-vars
  const softSkillsOptions = [
    { value: 'Communication', label: 'Communication' },
    { value: 'Teamwork', label: 'Teamwork' },
    { value: 'Problem-solving', label: 'Problem Solving' },
    { value: 'Leadership', label: 'Leadership' },
    { value: 'Time management', label: 'Time Management' },
    { value: 'Adaptability', label: 'Adaptability' },
    { value: 'Creativity', label: 'Creativity' },
    { value: 'Emotional intelligence', label: 'Emotional Intelligence' },
    { value: 'Critical thinking', label: 'Critical Thinking' },
    { value: 'Interpersonal skills', label: 'Interpersonal Skills' },
    { value: 'Conflict resolution', label: 'Conflict Resolution' },
    { value: 'Stress management', label: 'Stress Management' },
    { value: 'Decision making', label: 'Decision Making' },
    { value: 'Flexibility', label: 'Flexibility' },
    { value: 'Negotiation', label: 'Negotiation' },
    { value: 'Resilience', label: 'Resilience' },
    { value: 'Assertiveness', label: 'Assertiveness' },
    { value: 'Patience', label: 'Patience' },
    { value: 'Active listening', label: 'Active Listening' },
  ];
  

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
      let response = await dispatch(getProfile(id));
  
      if (response) {
        let technicalSkills = response.technicalSkills[0].split(",").map(skill => skill.trim());
        let softSkills = response.softSkills[0].split(",").map(skill => skill.trim());
        setInitialData({
          company: response.company,
          firstName: response.firstName,
          lastName: response.lastName,
          dob: response.dob,
          technicalSkills: technicalSkills,
          experience: response.experience,
          softSkills: softSkills,
          education: response.education,
          strengths: response.strengths,
          weaknesses: response.weaknesses,
          previousRolesDescription: response.previousRolesDescription,
        });
        document.getElementById("name").value = response.user.firstName + " " + response.user.lastName;
        setDataFetched(true);
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

  useEffect(() => {
    if (dataFetched) {
      setFormData(initialData);
    }
  }, [dataFetched, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setHasChanges(true);
  };

  const handleTechnicalSkillsChange = (selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      technicalSkills: selectedOptions.map(option => option.value)
    }));
    setHasChanges(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = {
        ...formData,
        technicalSkills: [formData.technicalSkills.join(",")],
      };
  
      await dispatch(updateProfile(user.id, formDataToSend, openSnackbar));
      setHasChanges(false);
      navigate(`/interview/${interviewId}`, {
        state: {
          participantNameFromDB: participantName,
          interviewId: interviewId,
          topics: topics,
          requiredSkills: requiredSkills,
          role: role,
        },
      });
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  return (
    <div className={styles.auth_container}>
      <div className={styles.auth_content}>
        <div className={styles.auth_form_container}>
          <h1 className={styles.heading}>Update Profile</h1>

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

          <form onSubmit={handleSubmit} className={styles.auth_form}>
            {userRole === "candidate" && (
              <>
                <label htmlFor="technicalSkills" className={styles.label}>
                  Technical Skills:
                </label>
                <Select
                  options={technicalSkillsOptions}
                  isMulti
                  components={animatedComponents}
                  closeMenuOnSelect={false}
                  id="technicalSkills"
                  name="technicalSkills"
                  value={formData.technicalSkills.map(skill => ({ value: skill, label: skill }))}
                  onChange={handleTechnicalSkillsChange}
                  required
                />
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

            <button className={styles.submit_button}>Update</button>
            {/* <Link to={"/homepage"}>
              <button className={styles.back_button}>Back</button>
            </Link> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
