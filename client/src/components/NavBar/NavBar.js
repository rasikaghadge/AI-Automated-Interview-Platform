import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faBars,
  faXmark,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const [nav, setNav] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));

  const navigate = useNavigate();

  const openNav = () => {
    setNav(!nav);
  };

  const handleChatBtnClick = () => {
    if (!isButtonDisabled) {
      toast.info("Experiencing high traffic, Please wait a moment.", {
        position: toast.POSITION.TOP_CENTER,
        onOpen: () => setIsButtonDisabled(true),
        onClose: () => setIsButtonDisabled(false),
      });
    }
  };

  const handleLogoutBtn = () => {
    navigate("/");
    setUser(null);
    localStorage.clear();
  };

  return (
    <div className="navbar-section">
      <h1 className="navbar-title">
        <Link to="/homepage">
          AI <span className="navbar-sign">Interviewer</span>
        </Link>
      </h1>
      {/* Desktop */}
      <ul className="navbar-items">
        <li>
          <Link to="/homepage" className="navbar-links">
            Home
          </Link>
        </li>
        <li>
          <a href="#services" className="navbar-links">
            Services
          </a>
        </li>
        <li>
          <a href="#about" className="navbar-links">
            About
          </a>
        </li>
        <li>
          <a href="#reviews" className="navbar-links">
            Reviews
          </a>
        </li>
        <button
          onClick={() => navigate("/meetings")}
        >
          Meetings
        </button>
      </ul>
      <button
        className="navbar-btn"
        type="button"
        disabled={isButtonDisabled}
        onClick={handleChatBtnClick}
      >
        <FontAwesomeIcon icon={faCalendarDays} /> See scheduled interviews
      </button>
      <button
        className="navbar-btn"
        type="button"
        disabled={isButtonDisabled}
        onClick={handleLogoutBtn}
      >
        <FontAwesomeIcon icon={faSignOut} />
      </button>
      {/* Mobile */}
      <div className={`mobile-navbar ${nav ? "open-nav" : ""}`}>
        <div onClick={openNav} className="mobile-navbar-close">
          <FontAwesomeIcon icon={faXmark} className="hamb-icon" />
        </div>

        <ul className="mobile-navbar-links">
          <li>
            <Link onClick={openNav} to="/">
              Home
            </Link>
          </li>
          <li>
            <a onClick={openNav} href="#services">
              Services
            </a>
          </li>
          <li>
            <a onClick={openNav} href="#about">
              About
            </a>
          </li>
          <li>
            <a onClick={openNav} href="#reviews">
              Reviews
            </a>
          </li>
          {/* <li>
            <a onClick={openNav} href="#contact">
              Contact
            </a>
          </li> */}
        </ul>
      </div>
      {/* Hamburger Icon */}
      <div className="mobile-nav">
        <FontAwesomeIcon
          icon={faBars}
          onClick={openNav}
          className="hamb-icon"
        />
      </div>
    </div>
  );
}

export default NavBar;
