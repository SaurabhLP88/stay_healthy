/**
 * StayHealthy — Medical Appointment Booking System
 * Developed by: Saurabh Lakhanpal
 * GitHub: https://github.com/SaurabhLP88
 */

import React, { useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import Setauthtoken from "./Setauthtoken";
import Home from "./Components/Home/Home";
import LandingPage from "./Components/LandingPage/LandingPage";
import SignUp from "./Components/SignUp/SignUp";
import Login from "./Components/Login/Login";
import InstantConsultation from "./Components/InstantConsultationBooking/InstantConsultation";
import BookingConsultation from "./Components/InstantConsultationBooking/BookingConsultation/BookingConsultation";
import HealthTips from "./Components/HealthTips/HealthTips";
import Reviews from "./Components/Reviews/Reviews";
import Reports from "./Components/Reports/Reports";
import ProfileForm from "./Components/ProfileCard/ProfileCard";
import SelfCheck from "./Components/SelfCheck/SelfCheck";
import Appointments from "./Components/Appointments/Appointments"
import HealthBlog from "./Components/HealthBlog/HealthBlog"

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

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
            <Route path="/instant-consultation" element={<InstantConsultation />} />
            <Route path="/book-consultation" element={<BookingConsultation />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/health-tips" element={<HealthTips />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<ProfileForm />} />
            <Route path="/self-check" element={<SelfCheck />} />
            <Route path="/health-blog" element={<HealthBlog />} />
          </Routes>
        </Home>
      </HashRouter>
    </div>
  );
}

export default App;
