import React, { useState } from "react"; // Importing the necessary modules from React library
import { Link, useNavigate } from "react-router-dom";

import instant from "../../assets/images/instant.svg";
import book from "../../assets/images/book.svg";
import self from "../../assets/images/self.svg";
import tips from "../../assets/images/tips.svg";

import "./LandingPage.css"; // Importing the CSS styles for the Landing_Page component


// Defining the Function component Landing_Page
const LandingPage = () => {

  const [showServices, setShowServices] = useState(false);
  const handleGetStarted = () => {
    setShowServices(true);
    const section = document.getElementById("services");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };
  console.log("LandingPage.js Loaded");

  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  console.log("User logged in status:", isLoggedIn);
  const handleNavigate = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  return (
    <>
    {!showServices && (
    <section className="hero-section">
        <div>
          <div data-aos="fade-up" className="flex-hero">
            <h1>
              Your Health<br />
              <span className="text-gradient">Our Responsibility</span>
            </h1>

            <div className="blob-cont">
              <div className="blue blob"></div>
            </div>
            <div className="blob-cont">
              <div className="blue1 blob"></div>
            </div>

            <h4>
              Book appointments, consult doctors, and manage your health — all in one place.
            </h4>

            <button className="button" onClick={handleGetStarted}>
              Get Started
            </button>
          </div>
        </div>
      </section>
    )}

    {showServices && (
        <section id="services" className="services-section">
          <h2 className="section-title">Best Services</h2>
          <p className="section-subtitle">Love yourself enough to live a healthy lifestyle.</p>

          <div className="services-container">
            <div
              className="service-card"
              onClick={() => handleNavigate("/instant-consultation")}
            >
              <img src={instant} alt="Instant Consultation" />
              <h3>Instant Consultation</h3>
            </div>

            <div
              className="service-card"
              onClick={() => handleNavigate("/book-consultation")}
            >
              <img src={book} alt="Book Appointment" />
              <h3>Book an Appointment</h3>
            </div>

            <Link to="/instant-consultation" className="service-card">
              <img src={self} alt="Self Checkup" />
              <h3>Self Checkup</h3>
            </Link>

            <Link to="/health-tips" className="service-card">
              <img src={tips} alt="Health Tips Guidance" />
              <h3>Health Tips and Guidance</h3>
            </Link>

          </div>
        </section>
      )}
      </>

  );
};

export default LandingPage; // Exporting the Landing_Page component to be used in other parts of the application