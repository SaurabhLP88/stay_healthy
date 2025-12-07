import React, { useState, useEffect } from "react"; // Importing the necessary modules from React library
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

import instant from "../../assets/images/instant.svg";
import book from "../../assets/images/book.svg";
import self from "../../assets/images/self.svg";
import tips from "../../assets/images/tips.svg";

import "./LandingPage.css"; // Importing the CSS styles for the Landing_Page component

// Defining the Function component Landing_Page
const LandingPage = () => {

  const [showServices, setShowServices] = useState(false);

  // Dashboard
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [pendingAppointments, setPendingAppointments] = useState(0);
  const [completedAppointments, setCompletedAppointments] = useState(0);

  const [nextAppointmentTime, setNextAppointmentTime] = useState("No upcoming");
  const [nextAppointmentName, setNextAppointmentName] = useState("");  
  
  const navigate = useNavigate();
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  const role = sessionStorage.getItem("role")?.toLowerCase();
  const doctorId = sessionStorage.getItem("doctorId");

  useEffect(() => {
    if (role === "doctor") {
      fetchDoctorStats();
    }
  }, [role]);  

  //const doctorId = doctor?._id;
  
  //console.log("User logged in status:", isLoggedIn);
  const handleNavigate = (path) => {
    if (isLoggedIn) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  const handleGetStarted = () => {
    setShowServices(true);
    const section = document.getElementById("services");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  async function fetchDoctorStats() {
    try {
      const res = await fetch(`${API_URL}/api/doctors/stats?doctorId=${doctorId}`);
      console.log("Raw response:", res);
      const data = await res.json();

      setTodayAppointments(data.today);
      setPendingAppointments(data.pending);
      setCompletedAppointments(data.completed);

      if (data.next) {
        setNextAppointmentTime(data.next.time);
        setNextAppointmentName(data.next.patient);
      }

    } catch (err) {
      console.error("Dashboard Error:", err);
    }
  }

  return (
    <>
      {!showServices && role !== "doctor" && (
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

      {showServices && role !== "doctor" && (
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

            <Link to="/self-check" className="service-card">
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

       {role === "doctor" && (
          <div className="doctor-dashboard">

            <h1 className="dash-title">Doctor Dashboard</h1>

            <div className="stats-grid">

              <div className="stat-card">
                <h3>Today's Appointments</h3>
                <p className="stat-number">{todayAppointments}</p>
              </div>

              <div className="stat-card">
                <h3>Pending Appointments</h3>
                <p className="stat-number">{pendingAppointments}</p>
              </div>

              <div className="stat-card">
                <h3>Completed Appointments</h3>
                <p className="stat-number">{completedAppointments}</p>
              </div>

              <div className="stat-card upcoming">
                <h3>Next Appointment</h3>
                <p className="next-time">{nextAppointmentTime}</p>
                <p className="next-name">{nextAppointmentName}</p>
              </div>

            </div>
          </div>
        )}


    </>
  );
};

export default LandingPage; // Exporting the Landing_Page component to be used in other parts of the application