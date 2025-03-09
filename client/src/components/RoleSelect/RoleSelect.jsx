/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";
import styles  from "./RoleSelect.module.css";
import { useNavigate } from "react-router-dom";
import myImage from './login_img.jpg';

const RoleSelect = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('profile'))

    if(user) {
        navigate('/homepage')
    }
  //    <Header/>
  return (
    
    <div>
      <div className={styles.header2}>
        <img
          style={{ width: "50px", cursor: "pointer" }}
          onClick={() => navigate("/")}
          src="https://cdn-icons-png.flaticon.com/512/25/25694.png"
          alt="arc-invoice"
        />
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.auth_image}>
            <img src={myImage} alt="Image" />
          </div>
          
          <div className={styles.pageContainer}>
            <section className={styles.hero}>
              <h1>Login as a...</h1>
              <RecruiterButton/>
              <CandidateButton/>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const CandidateButton = () => {
    const navigate = useNavigate();
  
    const handleCandidateLogin = () => {
      // Navigate to the login page with the role as a query parameter
      navigate('/login?role=candidate');
    };
  
    return (
      <button
          onClick={handleCandidateLogin}
          className={styles.login}
        >
          Candidate
        </button>
    );
  };

  const RecruiterButton = () => {
    const navigate = useNavigate();
  
    const handleRecruiterLogin = () => {
      // Navigate to the login page with the role as a query parameter
      navigate('/login?role=hr');
    };
  
    return (
        <button
            onClick={handleRecruiterLogin}
            className={styles.login}
          >
            Recruiter
          </button>
      );
  };

export default RoleSelect;
