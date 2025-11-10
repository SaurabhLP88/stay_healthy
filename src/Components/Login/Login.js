import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login({ setLoggedIn }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  console.log("Login.js Loaded");

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
    console.log("Login attempt:", data);
    return new Promise((resolve) => setTimeout(resolve, 1000)); // simulate network delay
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      await apiCallToLogin(formData);

      // persist login status and name (use email as fallback)
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("name", formData.email.split("@")[0]);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("name", formData.email.split("@")[0]);
      localStorage.setItem("email", formData.email);

      setLoggedIn(true);
      navigate("/");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(true);
    setTimeout(() => setShowPassword(false), 3000); // revert after 3 seconds
  };

  return (
    <div className="container">
      <div className="login-grid">
        <div className="login-text">
          <h2>Login</h2>
        </div>
        <div className="login-text">
          Are you a new member?{" "}
          <Link to="/signup" style={{ color: "#2190FF" }}>Sign Up Here</Link>
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

            <div className="login-text" style={{ marginTop: "10px" }}>
              Forgot Password?
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
