import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bannerImage from "../../Assets/banner2.png";

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('profile'));
  
  useEffect(() => {
    if(user) {
      navigate('/homepage');
    }
  }, [user, navigate]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: "#f0f0f0",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
        }}
      >
        <img
          style={{ width: "50px", cursor: "pointer" }}
          onClick={() => navigate("/")}
          src="https://cdn-icons-png.flaticon.com/512/25/25694.png"
          alt="arc-invoice"
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => navigate("/details")}
            style={{
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Try Demo
          </button>
          <button
            onClick={() => navigate("/select")}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Get started
          </button>
        </div>
      </div>
      <div
        style={{
          maxWidth: "1200px", // Example max-width
          margin: "0 auto",
          padding: "20px",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
          overflow: "hidden",
        }}
      >
        <section style={{ textAlign: "center" }}>
          <h1>Best tool to interview candidates for your next hiring drive</h1>
          <div style={{ marginBottom: "20px" }}>
            <p>
              Free and Open Source AI interview application made with MongoDB,
              Express, React & Nodejs
            </p>
          </div>
          <div style={{ marginTop: "20px", borderRadius: "10px", overflow: "hidden" }}>
            <img
              style={{ width: "100%", cursor: "pointer", borderRadius: "10px" }}
              src={bannerImage}
              alt="invoicing-app"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;