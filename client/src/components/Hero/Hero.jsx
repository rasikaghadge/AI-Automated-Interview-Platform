import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroImage from "../../Assets/—Pngtree—work from home with computer_5426686.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import "./Hero.css";

function Hero({ userRole }) {
  const navigate = useNavigate();
  const [goUp, setGoUp] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScheduleClick = () => {
    navigate("/schedule");
  };

  useEffect(() => {
    const onPageScroll = () => {
      if (window.scrollY > 600) {
        setGoUp(true);
      } else {
        setGoUp(false);
      }
    };
    window.addEventListener("scroll", onPageScroll);

    return () => {
      window.removeEventListener("scroll", onPageScroll);
    };
  }, []);

  return (
    <div className="section-container">
      <div className="hero-section">
        <div className="text-section">
          {userRole === "hr" && (
            <h2 className="text-title">
              Schedule an interview in just 4 easy steps
            </h2>
          )}
          {userRole === "candidate" && (
            <h2 className="text-title">Get interviewed by AI</h2>
          )}
          <p className="text-descritpion">
            Our cutting-edge video recruiting software harnesses the power of
            Explainable AI to revolutionize your hiring process. We understand
            that your time is valuable, which is why our platform is designed to
            pre-screen and shortlist candidates swiftly and accurately, ensuring
            you access the best talent available for your specific role.
          </p>
          {
            userRole === "hr" && (
              <button
                className="text-schedule-btn"
                type="button"
                onClick={handleScheduleClick}
              >
                <FontAwesomeIcon icon={faCalendarCheck} /> Schedule
              </button>
            )
          }
          <div className="text-stats">
            <div className="text-stats-container">
              <p>145+</p>
              <p>Active users</p>
            </div>

            <div className="text-stats-container">
              <p>50+</p>
              <p>Companies</p>
            </div>

            <div className="text-stats-container">
              <p>4+</p>
              <p>Avg. Rating</p>
            </div>
          </div>
        </div>

        <div className="hero-image-section">
          <img
            className="hero-image1"
            src={HeroImage}
            alt="A man giving interview"
          />
        </div>
      </div>

      <div
        onClick={scrollToTop}
        className={`scroll-up ${goUp ? "show-scroll" : ""}`}
      >
        <FontAwesomeIcon icon={faAngleUp} />
      </div>
    </div>
  );
}

export default Hero;
