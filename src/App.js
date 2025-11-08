import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//import Navbar from './Components/Navbar/Navbar';
import LandingPage from './Components/LandingPage/LandingPage';
import SignUp from "./Components/SignUp/SignUp";
import Login from "./Components/Login/Login";
import Notification from './Components/Notification/Notification';
import InstantConsultation from "./Components/InstantConsultationBooking/InstantConsultation";
import BookingConsultation from "./Components/InstantConsultationBooking/BookingConsultation/BookingConsultation";
import HealthTips from "./Components/HealthTips/HealthTips";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
      <BrowserRouter>
        <Notification loggedIn={loggedIn} setLoggedIn={setLoggedIn}>
          <Routes>
            <Route path="/" element={<LandingPage />}/>
            <Route path="/signup" element={<SignUp setLoggedIn={setLoggedIn} />} />
            <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
            <Route path="/instant-consultation" element={<InstantConsultation />} />
            <Route path="/book-consultation" element={<BookingConsultation />} />
            <Route path="/health-tips" element={<HealthTips />} />
          </Routes>
        </Notification>
      </BrowserRouter>
    </div>
  );
}

export default App;
