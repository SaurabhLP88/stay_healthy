import { useState } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import "./Notification.css";

interface NotificationProps {
  title: string;
  message: string;
  onClose?: () => void;
}

const Notification = ({ title, message, onClose }: NotificationProps) => {
  const [open, setOpen] = useState(false);
  console.log("Notification set Loaded:", {
      title: title,
      message: message,
  });

  return (
    <div className="fixed bottom-[80px] right-5 z-[9999]">
      {!open && (
        <button
          className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg animate-bell"
          onClick={() => setOpen(true)}
        >
          <FaBell size={22} />
        </button>
      )}
      {open && (
        <div
          className="
            bg-blue-600 text-white px-5 py-4 rounded-xl shadow-lg 
            min-w-[260px] relative animate-slide-notify
          "
        >
          <button
            className="absolute top-2 right-2 text-white hover:text-gray-200"
            onClick={() => {
              setOpen(false);
              onClose?.();
            }}
          >
            <FaTimes size={18} />
          </button>

          <h5 className="text-lg font-semibold mb-2">{title}</h5>

          <div
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: message }}
          ></div>
        </div>
      )}

    </div>

  );
};

export default Notification;


/*import React, { useEffect, useState } from "react";
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

export default Notification;*/
