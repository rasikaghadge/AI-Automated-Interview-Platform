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
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat
          voluptate, voluptatibus quia, quibusdam, dolorum quas voluptatum quos
          quod delectus quidem consequuntur. Quia, quibusdam, dolorum quas
          voluptatum quos quod delectus quidem consequuntur.
        </p>
      </div>

      <div className="info-cards-content">
        <InformationCard
          title="Point one"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat"
          icon={faMicrophone}
        />

        <InformationCard
          title="Point two"
          description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat"
          icon={faVideoCamera}
        />

        <InformationCard
          title="Point three"
          description="lore ipsum dolor sit amet consectetur adipisicing elit. Repellat"
          icon={faDesktop}
        />
      </div>
    </div>
  );
}

export default Info;
