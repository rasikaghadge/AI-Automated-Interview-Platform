import React from "react";
import Image from "../../Assets/Man-working-on-laptop-icon-illustration-on-transparent-background-PNG.png";
import SolutionStep from "./SolutionStep/SolutionStep";
import "./About.css";

function About() {
  return (
    <div className="about-section" id="about">
      <div className="about-image-content">
        <img src={Image} alt="Doctor Group" className="about-image1" />
      </div>

      <div className="about-text-content">
        <h3 className="about-title">
          <span>About Us</span>
        </h3>
        <p className="about-description">
        We are your partner in revolutionizing recruitment with cutting-edge AI technology and a passion for helping you find the perfect talent.
        </p>

        <h4 className="about-text-title">Our Solutions</h4>

        <SolutionStep
          title="Candidate Screening"
          description="We employ cutting-edge Explainable AI to meticulously analyze candidate profiles, sifting through vast pools of applicants to identify the most promising individuals for your organization."
        />

        <SolutionStep
          title="Smart Video Interviews"
          description="We facilitate smart video interviews that enable you to gain valuable insights into candidates' personalities and communication skills, saving you time on initial screening while providing a more in-depth understanding of each candidate."
        />

        <SolutionStep
          title="Customized Solutions"
          description="We offer tailor-made solutions to meet your specific recruitment needs, whether you're hiring for entry-level positions or seeking C-suite executives."
        />
      </div>
    </div>
  );
}

export default About;
