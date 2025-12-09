
import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
//import { sendNotification } from "../../utils/notify";
import Navbar from "../Navbar/Navbar";
import Notification from "../Notification/Notification";
import Footer from "../Footer/Footer";

import "./Home.css";

const Home = ({ children, loggedIn, setLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [notification, setNotification] = useState(null);

  //console.log("Home.js Loaded"); 

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

  return (    
    <div>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} username={username} />
      <div className="main">{children}</div>
      <Footer />
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