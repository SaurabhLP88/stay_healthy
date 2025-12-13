import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

import logo from "../../assets/logo/sh-logo-01.png";

interface NavbarProps {
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
  username?: string;
}

function Navbar({ loggedIn, setLoggedIn, username: parentUsername }: NavbarProps) {
  const [click, setClick] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement | null>(null);
  
  const navigate = useNavigate();
  //console.log("Navbar.js Loaded");
  //const role = sessionStorage.getItem("role")?.toLowerCase();

  const navClasses = "block px-2 md:px-1 lg:px-3 py-2 text-gray-800 hover:text-blue-600";
  const authClasses = "inline-block lg:block mt-3 lg:mt-0 px-4 py-2 rounded-full border border-blue-600 hover:bg-blue-600 hover:text-white transition";
  const dropdownClasses = "block px-4 py-2 hover:bg-gray-100";

  console.log("[Navbar Render]", {
    loggedIn,
    username,
    role,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

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

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("storage", syncNavbar);
      window.removeEventListener("session-update", syncNavbar);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [parentUsername, setLoggedIn]);

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

          {/* Logo
          <Link to="/" onClick={() => setClick(false)} className="text-2xl font-semibold text-blue-600 flex items-center gap-2">
            StayHealthy <FaUserMd className="text-blue-600 text-2xl" />
          </Link> */}
          <Link
            to="/"
            onClick={() => setClick(false)}
            className="flex items-center gap-2"
          >
            <img
              src={logo}
              alt="Stay Healthy"
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Hamburger icon (mobile only) */}
          <button
            onClick={handleClick}
            className="text-2xl lg:hidden text-gray-700 focus:outline-none"
          >
            {click ? <FaTimes /> : <FaBars />}
          </button>

          {/* ONE NAV MENU — works for BOTH mobile & desktop */}
          <ul
            className={`
              flex flex-col lg:flex-row lg:items-center gap-0 md:gap-0 lg:gap-3 xl:gap-6
              absolute lg:static left-0 w-full lg:w-auto bg-white lg:bg-transparent shadow-md lg:shadow-none
              transition-all duration-300 text-center lg:text-left text-md md:text-sm lg:text-md
              ${click ? "top-16 py-4 opacity-100" : "top-[-400px] opacity-0 lg:opacity-100"}
            `}
          >

            <li><Link to="/" className={navClasses} onClick={() => setClick(false)}>
              {role !== "doctor" ? "Home" : "Dashboard"}
            </Link></li>

            {loggedIn && (
              <li><Link to="/appointments" className={navClasses} onClick={() => setClick(false)}>
                Appointments
              </Link></li>
            )}

            <li><Link to="/health-blog" className={navClasses} onClick={() => setClick(false)}>
              Health Blog
            </Link></li>

            <li><Link to="/reviews" className={navClasses} onClick={() => setClick(false)}>
              Reviews
            </Link></li>

            {loggedIn ? (
              <>
                {username && (
                  <li
                    ref={dropdownRef}
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="flex justify-center items-center gap-1 px-4 py-2 cursor-pointer">
                      Welcome, <span className="">{role === "doctor" ? "Dr." : ""} {username}</span>                      
                      <span
                        className="ml-1 transition-transform duration-200 group-hover:rotate-180 text-gray-800 hover:text-blue-600"
                      >
                        ▼
                      </span>
                    </div>
                    <ul
                      className={`
                        static md:absolute right-0 top-full pt-1 mt-0 min-w-[160px] bg-white shadow-none md:shadow-md md:rounded-md group-hover:block
                        ${dropdownOpen ? "!block" : "block lg:!hidden"}                        
                      `}
                    >
                      <li>
                        <Link
                          to="/profile"
                          onClick={() => setClick(false)}
                          className={dropdownClasses}
                        >
                          Your Profile
                        </Link>
                      </li>

                      {role !== "doctor" && (
                        <li>
                          <Link
                            to="/reports"
                            onClick={() => setClick(false)}
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
                    onClick={(e) => { e.preventDefault(); handleLogout(); setClick(false); }}
                    className={authClasses}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/signup"
                    onClick={() => setClick(false)}
                    className={authClasses}>
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link to="/login"
                    onClick={() => setClick(false)}
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
