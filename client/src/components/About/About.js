import React from "react";
import Doctor from "../Assets/Man-working-on-laptop-icon-illustration-on-transparent-background-PNG.png";
import SolutionStep from "./SolutionStep/SolutionStep";
import "./About.css";

function About() {
  return (
    <div className="about-section" id="about">
      <div className="about-image-content">
        <img src={Doctor} alt="Doctor Group" className="about-image1" />
      </div>

      <div className="about-text-content">
        <h3 className="about-title">
          <span>About Us</span>
        </h3>
        <p className="about-description">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat
        </p>

        <h4 className="about-text-title">Our Solutions</h4>

        <SolutionStep
          title="Choose a job description"
          description="lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat"
        />

        <SolutionStep
          title="Make a Schedule"
          description="lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat"
        />

        <SolutionStep
          title="Get results"
          description="lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat"
        />
      </div>
    </div>
  );
}

export default About;
