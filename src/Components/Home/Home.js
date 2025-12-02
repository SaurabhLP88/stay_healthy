
import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import Navbar from "../Navbar/Navbar";
import Notification from "../Notification/Notification";

import "./Home.css";

const Home = ({ children, loggedIn, setLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [notification, setNotification] = useState(null);

  //console.log("Home.js Loaded");  

  /*const loadUnreadNotification = async () => {
    try {
      const userId = sessionStorage.getItem("userId"); // use same auth-token
      if (!userId) {
        console.warn("No auth-token found in sessionStorage!");
        return;
      }

      const res = await fetch(`${API_URL}/api/notifications/unread`, {
        headers: { "Authorization": `Bearer ${userId}` }
      });
      const data = await res.json();

      console.log("[Home] unread notification:", data);

      if (data.length > 0) {
        setNotification(data[0]); 
      } else {
        setNotification(null);
      }
    } catch (err) {
      console.error("[Home] Error fetching unread:", err);
    }
  };*/

  const formatDate = (d) => {
    if (!d) return "";

    // If input is YYYY-MM-DD
    if (d.includes("-")) {
      const [year, month, day] = d.split("-");
      return `${day}/${month}/${year}`;
    }

    // If input is MM/DD/YYYY
    if (d.includes("/")) {
      const [month, day, year] = d.split("/");
      return `${day}/${month}/${year}`;
    }

    return d;
  };
  
  const loadExistingAppointment = async () => {
    const token = sessionStorage.getItem("auth-token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/appointments/my`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.length > 0) {
        const appt = data[0];
        const detail = {
          title: "Appointment Confirmed",
          message: `
            <p><b>Doctor:</b> ${appt.doctorName}</p>
            <p><b>Speciality:</b> ${appt.doctorSpeciality}</p>
            <p><b>Patient:</b> ${appt.patientName}</p>
            <p><b>Phone:</b> ${appt.phoneNumber}</p>
            <p><b>Date:</b> ${formatDate(appt.appointmentDate)}</p>
            <p><b>Time:</b> ${appt.appointmentTime}</p>
          `.trim()
        };

        setNotification(detail);
        //console.log("detailss", detail);
      }
    } catch (err) {
      console.error("Failed to load appointment", err);
    }
  };

  useEffect(() => {
    
    const handler = (e) => { 
      setNotification(e.detail); 
      //console.log("handler Fired");
    }
    window.addEventListener("new-notification", handler);

    const handleDelete = () => {
      setNotification(null);
      //console.log("handleDelete Fired");
    }
    window.addEventListener("notification-deleted", handleDelete);

    //console.log("useEffect Fired");
    if (!notification) {
      loadExistingAppointment();
    }

    return () => {
      window.removeEventListener("new-notification", handler);
      window.removeEventListener("notification-deleted", handleDelete);
    };
  }, []);

  /*const markAsRead = async () => {
    if (!notification?._id) return setNotification(null);

    try {
      await fetch(`${API_URL}/api/notifications/read/${notification._id}`, {
        method: "PATCH"
      });

      setNotification(null);
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };*/


  return (    
    <div>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} username={username} />
      {children}
      {notification && (
        <Notification
          title={notification.title}
          message={notification.message}
          //onClose={markAsRead}
          onClose={() => setNotification(null)}
        />
      )}

    </div>
  );
};

export default Home;