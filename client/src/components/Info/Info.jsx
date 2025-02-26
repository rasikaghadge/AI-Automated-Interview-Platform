import React from "react";
import InformationCard from "./InformationCard/InformationCard";
import { faMicrophone, faVideoCamera, faDesktop } from "@fortawesome/free-solid-svg-icons";
import "./Info.css";

function Info() {
  return (
    <div className="info-section" id="services">
      <div className="info-title-content">
        <h3 className="info-title">
          <span>What We Do</span>
        </h3>
        <p className="info-description">
        Our online smart video interview software streamlines your hiring journey, giving you the freedom to focus on what truly matters – nurturing your company's growth. 
        </p>
      </div>

      <div className="info-cards-content">
        <InformationCard
          title="Point one"
          description="Allow Permission to use microphone"
          icon={faMicrophone}
        />

        <InformationCard
          title="Point two"
          description="Allow Permission to turn on camera"
          icon={faVideoCamera}
        />

        <InformationCard
          title="Point three"
          description="Allow Permission to share screen"
          icon={faDesktop}
        />
      </div>
    </div>
  );
}

export default Info;
