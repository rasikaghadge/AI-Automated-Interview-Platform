import React from 'react';
import './Footer.css';
import SubscribeNewsletter from './SubscribeNewsletter/SubscribeNewsletter';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className="footer-section">
      <div className="footer-container">
        <div className="ft-info">
          <div className="ft-info-p1">
            <p className="ft-title">
              Hire. <span className="ft-sign"> AI</span>
            </p>
            <p className="ft-description">
              Catalyzing seamless interviews and talent assessment with
              cutting-edge AI technology for candidates and administrators
            </p>
          </div>

          <SubscribeNewsletter />
        </div>

        <div className="ft-list">
          <p className="ft-list-title">Services</p>
          <ul className="ft-list-items">
            <li>
              <a href="#services">Video Interviews:</a>
            </li>
            <li>
              <a href="#services">AI-Generated Questions:</a>
            </li>
            <li>
              <a href="#services">Proctoring and Monitoring:</a>
            </li>
            <li>
              <a href="#services">Interview Analytics:</a>
            </li>
          </ul>
        </div>

        <div className="ft-list" id="contact">
          <p className="ft-list-title">Talk To Us</p>
          <ul className="ft-list-items">
            <li>
              <a href="mailto:support@healthplus.com">
                surajpisal113@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+022 5454 5252">+919370296739</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="ft-copyright">
        <p>© 2025 AI Interviewer. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Footer;
