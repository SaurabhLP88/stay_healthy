import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../../config";

import "./SignUp.css";

import { FaEye, FaEyeSlash } from "react-icons/fa";

function SignUp({ setLoggedIn }) {
  //console.log("SignUp.js Loaded");
  const navigate = useNavigate();
  const initialFormState = {
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.name) tempErrors.name = "Name is required";
    if (!formData.phone) tempErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone))
      tempErrors.phone = "Enter valid 10-digit phone";
    if (!formData.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      tempErrors.email = "Enter a valid email";
    if (!formData.password) tempErrors.password = "Password is required";
    else if (formData.password.length < 6)
      tempErrors.password = "Password must be at least 6 characters";
    if (!formData.role) tempErrors.role = "Please select your role";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Mock API call
  const apiCallToRegister = async (data) => {
    try {
      console.log("Sending to backend:", data);
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Raw response:", response);
      console.log("Result JSON:", result);

      if (response.ok && result.authtoken) {
        sessionStorage.setItem("auth-token", result.authtoken);
        return result;
      } else {
        alert(result.error || result.message || "Registration failed");
        return null;
      }
      
    } catch (error) {
      console.error("Signup error:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const result = await apiCallToRegister(formData);
      if (result) {
        alert("Registration successful! Please login from the Login page.");
        //sessionStorage.setItem("auth-token", result.authtoken);
        sessionStorage.setItem("email", result.email); // persist login
        //sessionStorage.setItem("role", result.role); // store role
        sessionStorage.setItem("phone", result.phone); 
        sessionStorage.setItem("name", result.name);
        //setLoggedIn(true); // update App state       
        setFormData(initialFormState); // Clear form        
        navigate("/login"); // Redirect user to login page
      }
    }
    console.log("Submitting formData:", formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="signup-container">
      <div className="signup-grid">
        <div className="signup-text">
          <h1>Sign Up</h1>
        </div>
        <div className="signup-text1">
          Already a member? <Link to="/login" style={{ color: "#2190FF" }}>Login</Link>
        </div>
        <div className="signup-form">
          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select your role</option>
                <option value="Doctor">Doctor</option>
                <option value="Patient">Patient</option>
              </select>
              {errors.role && <span className="error">{errors.role}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="form-control"
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="form-control"
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
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
              <button type="submit" className="btn btn-primary">Submit</button>
              <button type="reset" className="btn btn-danger" onClick={handleReset}>Reset</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
