import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";


function Navbar({ loggedIn, setLoggedIn }) {
  const [click, setClick] = useState(false);
  const [username, setUsername] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  const handleClick = () => setClick(!click);

  const handleLogout = () => {
    setLoggedIn(false);
    sessionStorage.clear();
    localStorage.clear();
    navigate("/login");
  };


  const handleDropdown = () => setShowDropdown(!showDropdown);

  useEffect(() => {
    const name = sessionStorage.getItem("name") || localStorage.getItem("name");
    const isLoggedIn =
      sessionStorage.getItem("isLoggedIn") === "true" ||
      localStorage.getItem("isLoggedIn") === "true";

    if (isLoggedIn) {
      setLoggedIn(true);
      setUsername(name || "");
      console.log("Signed-in User Details:", { name, isLoggedIn });
    } else {
      setLoggedIn(false);
      setUsername("");
    }
  }, [loggedIn]);


  console.log("User details:", {
    email: localStorage.    getItem("email"),
    isLoggedIn: localStorage.getItem("isLoggedIn"),
  });

  return (
    <nav className="navbar">
      <div className="nav__logo">
        <Link to="/">
          StayHealthy <i style={{ color: "#2190FF" }} className="fa fa-user-md"></i>
        </Link>
        <span>.</span>
      </div>

      <div className="nav__icon" onClick={handleClick}>
        <i className={click ? "fa fa-times" : "fa fa-bars"}></i>
      </div>

      <ul className={click ? "nav__links active" : "nav__links"}>
        <li className="link"><Link to="/">Home</Link></li>
        <li className="link"><Link to="/search/doctors">Appointments</Link></li>
        <li className="link"><Link to="/healthblog">Health Blog</Link></li>
        <li className="link"><Link to="/reviews">Reviews</Link></li>

        {loggedIn ? (
          <>
            {username && <li className="link">Hello, {username}</li>}
            <li className="link">
              <button className="btn2" onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li className="link">
              <Link to="/signup"><button className="btn1">Sign Up</button></Link>
            </li>
            <li className="link">
              <Link to="/login"><button className="btn1">Login</button></Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
