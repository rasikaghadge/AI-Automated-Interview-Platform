import React, { useEffect } from "react";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('profile'))
  
  useEffect(() => {
    if(user) {
      console.log('navigate to homepage')
        navigate('/homepage')
    }
  }, [user, navigate])

  return (
    <div>
      <div className={styles.header2}>
        <img
          style={{ width: "50px", cursor: "pointer" }}
          onClick={() => navigate("/")}
          src="https://i.postimg.cc/hGZKzdkS/logo.png"
          alt="arc-invoice"
        />
        <button
          onClick={() => navigate("/select")}
          className={styles.login}
        >
          Get started
        </button>
      </div>
      <div className={styles.pageContainer}>
        <section className={styles.hero}>
          <h1>Best tool to interview candidates for your next hiring drive</h1>
          <div className={styles.paragraph}>
            <p>
              Free and Open Source AI interview application made with MongoDB,
              Express, React & Nodejs
            </p>
          </div>
          <div className={styles.imgContainer}>
            <img
              src="https://res.cloudinary.com/almpo/image/upload/v1637241441/special/banner_izy4xm.png"
              alt="invoicing-app"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
