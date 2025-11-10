
import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Notification from "../Notification/Notification";

import "./Home.css";

const Home = ({ children, loggedIn, setLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [notification, setNotification] = useState(null);

  console.log("Home.js Loaded");

  useEffect(() => {
    // Load notification on mount
    const savedNotification = localStorage.getItem('appointmentNotification');
    if (savedNotification) {
      setNotification(JSON.parse(savedNotification));
    }

    // Listen for new appointments
    const handleNewAppointment = () => {
      const latestNotification = localStorage.getItem('appointmentNotification');
      if (latestNotification) {
        setNotification(JSON.parse(latestNotification));
      }
    };

    const handleCancelAppointment = () => {
      setNotification(null);
    };

    window.addEventListener('appointmentBooked', handleNewAppointment);
    window.addEventListener('appointmentCancelled', handleCancelAppointment);

    return () => {
      window.removeEventListener('appointmentBooked', handleNewAppointment);
      window.removeEventListener('appointmentCancelled', handleCancelAppointment);
    };
  }, []);

  const clearNotification = () => {
    localStorage.removeItem('appointmentNotification');
    setNotification(null);
  };

  return (
    <div>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} username={username} />
      {children}
      {notification && (
        <Notification
          title={notification.title}
          message={notification.message}
          onClose={clearNotification}
        />
      )}

    </div>
  );
};

export default Home;