
import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import { sendNotification } from "../../utils/notify";
import Navbar from "../Navbar/Navbar";
import Notification from "../Notification/Notification";

import "./Home.css";

const Home = ({ children, loggedIn, setLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [notification, setNotification] = useState(null);

  //console.log("Home.js Loaded");  

  /*const formatDate = (d) => {
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
  };*/

  useEffect(() => {

    const syncUsername = () => {
      const name = sessionStorage.getItem("name") || "";
      setUsername(name);
      console.log("%c[Home.js] Username synced", "color: cyan", name);
    };
    
    const handler = (e) => { 
      setNotification(e.detail); 
      //console.log("handler Fired");
    }    

    const handleDelete = () => {
      setNotification(null);
      //console.log("handleDelete Fired");
    }   

    //console.log("useEffect Fired");
    if (loggedIn && !notification) { 
      loadExistingAppointment();
    }

    syncUsername();

    window.addEventListener("new-notification", handler);
    window.addEventListener("notification-deleted", handleDelete);
    window.addEventListener("session-update", syncUsername);

    return () => {
      window.removeEventListener("new-notification", handler);
      window.removeEventListener("notification-deleted", handleDelete);
      window.removeEventListener("session-update", syncUsername);
    };
  }, [loggedIn]);
  
  const loadExistingAppointment = async () => {
    const token = sessionStorage.getItem("auth-token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/notifications/latest`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const latest = await res.json();

      if (latest && latest.title && latest.message) {
        setNotification(latest);
      } else {
        setNotification(null);
      }
    } catch (err) {
      console.error("Failed to load notification:", err);
    }
  };

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
      {loggedIn && notification && (
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