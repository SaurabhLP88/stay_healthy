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

  const navClasses = "block px-3 py-2 text-gray-800 hover:text-blue-600";
  const authClasses = "block px-4 py-2 rounded-full border border-blue-600 hover:bg-blue-600 hover:text-white transition";
  const dropdownClasses = "block px-4 py-2 hover:bg-gray-100";

  console.log("[Navbar Render]", {
    loggedIn,
    username,
    role,
  });

  useEffect(() => {
    const syncNavbar = () => {
      const name = sessionStorage.getItem("name") || "";
      const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
      const userRole = sessionStorage.getItem("role")?.toLowerCase() || "";

      console.log("[Navbar] sessionStorage values", {
        name,
        isLoggedIn,
        userRole,
      });

      // Prefer parent username if passed
      if (parentUsername) {
        setUsername(parentUsername);
      } else {
        setUsername(name);
      }

      setLoggedIn(isLoggedIn);
      setRole(userRole);

      console.log("[Navbar] State updated", {
        username: parentUsername || name,
        loggedIn: isLoggedIn,
        role: userRole,
      });
    };

    // Run once on mount
    syncNavbar();

    // Listen for cross-tab or manual session updates
    window.addEventListener("storage", syncNavbar);
    window.addEventListener("session-update", syncNavbar);

    return () => {
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
    <>

      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="text-2xl font-semibold text-blue-600 flex items-center gap-2">
            StayHealthy <i className="fa fa-user-md"></i>
          </Link>

          {/* Hamburger icon (mobile only) */}
          <button
            onClick={handleClick}
            className="text-2xl md:hidden text-gray-700 focus:outline-none"
          >
            <i className={click ? "fa fa-times" : "fa fa-bars"}></i>
          </button>

          {/* ONE NAV MENU — works for BOTH mobile & desktop */}
          <ul
            className={`
              flex flex-col md:flex-row md:items-center md:gap-6
              absolute md:static left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none
              transition-all duration-300
              ${click ? "top-16 py-4 opacity-100" : "top-[-300px] opacity-0 md:opacity-100"}
            `}
          >

            <li><Link to="/" className={navClasses}>
              {role !== "doctor" ? "Home" : "Dashboard"}
            </Link></li>

            {loggedIn && (
              <li><Link to="/appointments" className={navClasses}>
                Appointments
              </Link></li>
            )}

            <li><Link to="/health-blog" className={navClasses}>
              Health Blog
            </Link></li>

            <li><Link to="/reviews" className={navClasses}>
              Reviews
            </Link></li>

            {loggedIn ? (
              <>
                {username && (
                  <li className="relative group">
                    <div className="flex items-center gap-1 px-4 py-2 cursor-pointer">
                      Welcome, <span className="">{role === "doctor" ? "Dr." : ""} {username}</span>                      
                      <span className="ml-1 transition-transform duration-200 group-hover:rotate-180 text-gray-800 hover:text-blue-600">
                        ▼
                      </span>
                    </div>
                    <ul
                      className="
                        absolute right-0 top-full pt-1 mt-0 min-w-[160px] bg-white shadow-md rounded-md hidden group-hover:block
                      "
                    >
                      <li>
                        <Link
                          to="/profile"
                          className={dropdownClasses}
                        >
                          Your Profile
                        </Link>
                      </li>

                      {role !== "doctor" && (
                        <li>
                          <Link
                            to="/reports"
                            className={dropdownClasses}
                          >
                            Your Reports
                          </Link>
                        </li>
                      )}
                    </ul>
                  </li>
                )}


                <li>
                  <button
                    onClick={(e) => { e.preventDefault(); handleLogout(); }}
                    className={authClasses}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/signup"
                    className={authClasses}>
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link to="/login"
                    className={authClasses}>
                    Login
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </nav>


      {/*<nav className="navbar">
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
      </nav>*/}

    </>

  );
}

export default Navbar;
