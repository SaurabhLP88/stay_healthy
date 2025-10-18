import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./Notification.css";

const Notification = ({ children, loggedIn, setLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [doctorData, setDoctorData] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  // Load user, doctor, and appointment info from session/local storage
  useEffect(() => {
    const storedUsername = sessionStorage.getItem("email");
    const storedDoctorData = JSON.parse(localStorage.getItem("doctorData"));
    const storedAppointmentData = storedDoctorData
      ? JSON.parse(localStorage.getItem(storedDoctorData.name))
      : null;

    if (storedUsername) setUsername(storedUsername);
    if (storedDoctorData) setDoctorData(storedDoctorData);
    if (storedAppointmentData) {
      setAppointmentData(storedAppointmentData);
      setShowNotification(true); // Show notification when a booking exists
    }
  }, []);

  // Effect to hide notification if appointment is canceled
  useEffect(() => {
    if (!appointmentData) setShowNotification(false);
  }, [appointmentData]);

  // Function to manually close notification
  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  return (
    <div>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} username={username} />
      {children}

      {showNotification && appointmentData && (
        <div className="notification-container">
          <div className="appointment-card">
            <div className="appointment-card__content">
              <h3 className="appointment-card__title">Appointment Booked!</h3>
              <p><strong>Patient:</strong> {username}</p>
              <p><strong>Doctor:</strong> {doctorData?.name}</p>
              <p><strong>Date:</strong> {appointmentData.appointmentDate}</p>
              <p><strong>Time:</strong> {appointmentData.appointmentTime}</p>
              <button onClick={handleCloseNotification} className="btn-close">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
