import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

import "./Login.css";

import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login({ setLoggedIn }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  //console.log("Login.js Loaded");

  useEffect(() => {
    if (sessionStorage.getItem("isLoggedIn") === "true") {
      setLoggedIn(true);
      navigate("/");
    }
  }, [navigate, setLoggedIn]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Enter a valid email";
    if (!formData.password) tempErrors.password = "Password is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const apiCallToLogin = async (data) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.authtoken) {
        // save token here
        sessionStorage.setItem("auth-token", result.authtoken);
        return result;
      } else {
        alert(result.error || result.message || "Login failed");
        return null;
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const result = await apiCallToLogin(formData);
    if (result) {
      alert("Login successful!");
      // persist login status and name (use email as fallback)
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("email", result.email || formData.email);
      sessionStorage.setItem("name", result.name || formData.email.split("@")[0]);
      //sessionStorage.setItem("email", result.user.email);
      //sessionStorage.setItem("name", result.user.name);
      //localStorage.setItem("isLoggedIn", "true");
      //localStorage.setItem("name", formData.email.split("@")[0]);
      //localStorage.setItem("email", formData.email);
      if (typeof setLoggedIn === "function") {
        setLoggedIn(true);
      }
      navigate("/");
    }    
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="container">
      <div className="login-grid">
        <div className="login-text">
          <h2>{!showForgot ? "Login" : "Forgot Password"}</h2>
        </div>        

        {!showForgot ? (
          <>
            <div className="login-text">
              Are you a new member?{" "}
              <Link to="/signup">Sign Up Here</Link>
            </div>
            <div className="login-form">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="form-control"
                  />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>

                <div className="form-group password-field">
                  <label htmlFor="password">Password</label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="form-control"
                    />
                    <span className="eye-icon" onClick={togglePasswordVisibility}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {errors.password && <span className="error">{errors.password}</span>}
                </div>

                <div className="btn-group">
                  <button type="submit" className="btn btn-primary">Login</button>
                  <button
                    type="reset"
                    className="btn btn-danger"
                    onClick={() => setFormData({ email: "", password: "" })}
                  >
                    Reset
                  </button>
                </div>

                <div className="link-text">
                  <button type="button" onClick={(e) => { e.preventDefault(); setShowForgot(true); }}>Forgot Password?</button>
                </div>
              </form>
            </div>

          </>
        ) : (
          <>            
            <div className="link-text">
              <button type="button" onClick={(e) => { e.preventDefault(); setShowForgot(false); }}>Login Again? </button>
            </div>
            <div className="forgot-form">
              <form>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="forgotEmail"
                    placeholder="Enter your email"
                    className="form-control"
                  />
                </div>

                <div className="btn-group">
                  <button type="submit" className="btn btn-primary">Send Reset Link</button>
                 
                </div>
              </form>
            </div>
          </>
        )}


      </div>
    </div>
  );
}

export default Login;
