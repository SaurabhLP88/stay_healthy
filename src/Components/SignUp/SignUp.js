import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./SignUp.css";

import { FaEye, FaEyeSlash } from "react-icons/fa";

function SignUp({ setLoggedIn }) {
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
    console.log("Form submitted:", data);
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      await apiCallToRegister(formData); // replace with actual API
      sessionStorage.setItem("email", formData.email); // persist login
      sessionStorage.setItem("role", formData.role); // store role
      sessionStorage.setItem("name", formData.name);
      setLoggedIn(true); // update App state
      navigate("/"); // redirect to home
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(true);
    setTimeout(() => setShowPassword(false), 3000); // revert after 3 seconds
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
                <option value="doctor">Doctor</option>
                <option value="patient">Patient</option>
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
