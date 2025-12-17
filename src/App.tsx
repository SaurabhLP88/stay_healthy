/**
 * StayHealthy — Medical Appointment Booking System
 * Developed by: Saurabh Lakhanpal
 * GitHub: https://github.com/SaurabhLP88
 */

import React, { useState, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import Setauthtoken from "./Setauthtoken";
import Home from "./Components/Home/Home";
import About from "./Components/About/About";
import LandingPage from "./Components/LandingPage/LandingPage";
import SignUp from "./Components/SignUp/SignUp";
import Login from "./Components/Login/Login";
import InstantConsultation from "./Components/InstantConsultationBooking/InstantConsultation/InstantConsultation";
import BookingConsultation from "./Components/InstantConsultationBooking/BookingConsultation/BookingConsultation";
import HealthTips from "./Components/HealthTips/HealthTips";
import Reviews from "./Components/Reviews/Reviews";
import Reports from "./Components/Reports/Reports";
import ProfileForm from "./Components/ProfileCard/ProfileCard";
import SelfCheck from "./Components/SelfCheck/SelfCheck";
import Appointments from "./Components/Appointments/Appointments";
import HealthBlog from "./Components/HealthBlog/HealthBlog";
import ReviewForm from "./Components/ReviewForm/ReviewForm";
import Notification from "./Components/Notification/Notification";

import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary";
import CrashTest from "./CrashTest";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(sessionStorage.getItem("auth-token"))
  );

  useEffect(() => {
    const syncLogin = () => {
      setLoggedIn(Boolean(sessionStorage.getItem("auth-token")));
    };

    window.addEventListener("session-update", syncLogin);
    return () => window.removeEventListener("session-update", syncLogin);
  }, []);

  //console.log("App.js Loaded");
  //basename={process.env.PUBLIC_URL}

  return (
    <div className="App">
      <HashRouter basename="/">
        <Home loggedIn={loggedIn} setLoggedIn={setLoggedIn}>
          <Routes>
            <Route path="/setauthtoken/:authtoken" element={<Setauthtoken />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp setLoggedIn={setLoggedIn} />} />
            <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
            <Route path="/about" element={<About />} />
            <Route path="/instant-consultation" element={<InstantConsultation />} />
            <Route path="/book-consultation" element={<BookingConsultation />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/health-tips" element={<HealthTips />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<ProfileForm />} />
            <Route path="/self-check" element={<SelfCheck />} />
            <Route path="/health-blog" element={<HealthBlog />} />
            
            <Route 
              path="/error-test"
              element={
                <ErrorBoundary>
                  <CrashTest />
                </ErrorBoundary>
              }
            />            
            <Route
              path="/review-form-test"
              element={
                <ReviewForm
                  doctorId="doc1"
                  appointmentId={{ doctorName: "Dr. Sharma" }}
                  userId="user1"
                  onSubmit={() => {}}
                  onClose={() => {}}
                />
              }
            />
            <Route
              path="/notification-test"
              element={
                <Notification
                  title="Appointment Booked"
                  message="<p><b>Name: </b> Dr. Sharma</p>"
                  onClose={() => {}}
                />
              }
            />

            
          </Routes>
        </Home>
      </HashRouter>
    </div>
  );
}

export default App;
