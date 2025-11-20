
import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import Navbar from "../Navbar/Navbar";
import Notification from "../Notification/Notification";

import "./Home.css";

const Home = ({ children, loggedIn, setLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [notification, setNotification] = useState(null);

  //console.log("Home.js Loaded");  

  const loadUnreadNotification = async () => {
    try {
      const userId = sessionStorage.getItem("auth-token"); // use same auth-token
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
  };

  useEffect(() => {
    loadUnreadNotification();
    const handler = (e) => setNotification(e.detail);
    window.addEventListener("new-notification", handler);

    return () => window.removeEventListener("new-notification", handler);
  }, []);

  const markAsRead = async () => {
    if (!notification?._id) return setNotification(null);

    try {
      await fetch(`${API_URL}/api/notifications/read/${notification._id}`, {
        method: "PATCH"
      });

      setNotification(null);
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };


  return (    
    <div>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} username={username} />
      {children}
      {notification && (
        <Notification
          title={notification.title}
          message={notification.message}
          onClose={markAsRead}         
        />
      )}

    </div>
  );
};

export default Home;