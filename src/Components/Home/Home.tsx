
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { API_URL } from "../../config";
//import { sendNotification } from "../../utils/notify";
import Navbar from "../Navbar/Navbar";
import Notification from "../Notification/Notification";
import Footer from "../Footer/Footer";
import { AppNotification } from "../../types/Notification";

import "./Home.css";

interface HomeProps {
  children?: React.ReactNode;
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
}

const Home: React.FC<HomeProps> = ({ children, loggedIn, setLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [notification, setNotification] = useState<AppNotification | null>(null);

  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  //console.log("Home.js Loaded"); 

  useEffect(() => {

    const syncUsername = () => {
      const name = sessionStorage.getItem("name") || "";
      setUsername(name);
      console.log("%c[Home.js] Username synced", "color: cyan", name);
    };
    
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<AppNotification>).detail;
      setNotification(detail);
    };

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
  }, [loggedIn, notification]);
  
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
    <div className="min-h-screen flex flex-col">
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} username={username} />
      {/*<div className="main container mx-auto px-3 md:px-4 pt-[90px] pb-[15px] md:pt-[95px] md:pb-[25px] min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-70px)]">{children}</div>*/}
      <div
        className={`main ${
          isLandingPage
            ? "w-full px-0 pt-[90px] pb-[15px] md:pt-[95px] md:pb-[25px]"
            : "container mx-auto px-3 md:px-4 pt-[90px] pb-[15px] md:pt-[95px] md:pb-[25px]"
        } min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-70px)]`}
      >
        {children}
      </div>      
      <Footer />
      {loggedIn && notification && (
        <Notification
          data-testid="notification"
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