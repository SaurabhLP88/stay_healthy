import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ loggedIn, setLoggedIn, username: parentUsername }) {
  const [click, setClick] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  //const [showDropdown, setShowDropdown] = useState(false);
  
  const navigate = useNavigate();
  //console.log("Navbar.js Loaded");

  //const role = sessionStorage.getItem("role")?.toLowerCase();

  console.log("[Navbar Render]", {
    loggedIn,
    username,
    role,
  });

  const syncNavbar = () => {
    const name = sessionStorage.getItem("name") || "";
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const userRole = sessionStorage.getItem("role")?.toLowerCase() || "";
    console.log("[Navbar] sessionStorage values", {
      name,
      isLoggedIn,
      userRole,
    });

    //setUsername(name);
    if (parentUsername) {
      setUsername(parentUsername);
    }
    setLoggedIn(isLoggedIn);
    setRole(userRole);

    console.log("[Navbar] State updated", {
      username: name,
      loggedIn: isLoggedIn,
      role: userRole,
    });
  };

  useEffect(() => {
    //console.log("[Navbar] useEffect Mounted");
    syncNavbar();
    window.addEventListener("storage", syncNavbar);
    window.addEventListener("session-update", syncNavbar);
    return () => {
      //console.log("[Navbar] useEffect Cleanup");
      window.removeEventListener("storage", syncNavbar);
      window.removeEventListener("session-update", syncNavbar);
    };
  }, [parentUsername]);

  const handleClick = () => {
    console.log("[Navbar] Menu Toggle", "color: violet", { click: !click });
    setClick(!click);
  };

  const handleLogout = () => {    
    sessionStorage.clear();
    setLoggedIn(false);
    setUsername("");
    setRole("");
    //console.log("[Navbar] After Logout - Dispatching session-update");
    window.dispatchEvent(new Event("session-update"));
    window.dispatchEvent(new Event("notification-deleted"));
    navigate("/login");
  };
  //const handleDropdown = () => setShowDropdown(!showDropdown);


  /*console.log("User details:", {
    email: localStorage.    getItem("email"),
    isLoggedIn: localStorage.getItem("isLoggedIn"),
  });*/

  return (
    <nav className="navbar">
      <div className="nav__logo">
        <Link to="/">
          StayHealthy <i className="fa fa-user-md"></i>
        </Link>
      </div>

      <div className="nav__icon" onClick={handleClick}>
        <i className={click ? "fa fa-times" : "fa fa-bars"}></i>
      </div>

      <ul className={click ? "nav__links active" : "nav__links"}>
        
        <li className="link"><Link to="/">{role !== "doctor" ? "Home" : "Dashboard"}</Link></li>

        {loggedIn && (
          <li className="link"><Link to="/appointments">Appointments</Link></li>
        )}

        <li className="link"><Link to="/health-blog">Health Blog</Link></li>        
        <li className="link"><Link to="/reviews">Reviews</Link></li>

        {loggedIn ? (
          <>
            {username && 
              <li className="welcome-user"><span>Welcome, {role === "doctor" ? "Dr." : ""} {username}</span>
                <ul className="dropdown-menu">
                  <li><Link to="/profile">Your Profile</Link></li>
                  {role !== "doctor" && (
                    <li><Link to="/reports">Your Reports</Link></li>
                  )}
                </ul>
              </li>
            }
            <li>
              <a className="btn2" href="#" onClick={(e) => {e.preventDefault(); handleLogout();}}>Logout</a>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/signup" className="btn2">Sign Up</Link>
            </li>
            <li>
              <Link to="/login" className="btn2">Login</Link>
            </li>
          </>
        )}

      </ul>
    </nav>
  );
}

export default Navbar;
