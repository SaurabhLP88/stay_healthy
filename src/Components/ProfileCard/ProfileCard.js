import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import "./ProfileCard.css";

const ProfileForm = () => {
  const [userDetails, setUserDetails] = useState({});
  const [updatedDetails, setUpdatedDetails] = useState({ password: "" });
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const authtoken = sessionStorage.getItem("auth-token");
    if (!authtoken) {
      navigate("/login");
    } else {
      fetchUserProfile();
    }
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const authtoken = sessionStorage.getItem("auth-token");
      const email = sessionStorage.getItem("email"); // Get the email from session storage

      if (!authtoken) {
        navigate("/login");
      } else {
        const response = await fetch(`${API_URL}/api/auth/user`, {
          headers: {
            "Authorization": `Bearer ${authtoken}`,
            "email": email, // Add the email to the headers
          },
        });
        if (response.ok) {
          const user = await response.json();
          setUserDetails(user);
          setUpdatedDetails({ ...user, password: "" });
        } else {
          // Handle error case
          throw new Error("Failed to fetch user profile");
        }
      }
    } catch (error) {
      //console.error(error);
      // Handle error case
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    setUpdatedDetails({
      ...updatedDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      updatedDetails.name === userDetails.name &&
      updatedDetails.phone === userDetails.phone &&
      !updatedDetails.password
    ) {
      alert("No changes done");
      setEditMode(false);
      return;
    }

    if (!/^[0-9]{10}$/.test(updatedDetails.phone)) {
      alert("Phone must be 10 digits!");
      return;
    }

    if (updatedDetails.password && updatedDetails.password.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }

    try {
      const authtoken = sessionStorage.getItem("auth-token");
      const email = sessionStorage.getItem("email"); // Get the email from session storage

      if (!authtoken || !email) {
        navigate("/login");
        return;
      }

      const payload = { ...updatedDetails };
      if (!payload.password) delete payload.password;
      const response = await fetch(`${API_URL}/api/auth/user`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${authtoken}`,
          "Content-Type": "application/json",
          "email": email,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Update the user details in session storage
        sessionStorage.setItem("name", updatedDetails.name);
        sessionStorage.setItem("phone", updatedDetails.phone);

        setUserDetails({
          ...userDetails,
          name: updatedDetails.name,
          phone: updatedDetails.phone,
        });
        setEditMode(false);
        
        if (updatedDetails.password) {
          setPasswordChanged(true);
          //alert("Password updated successfully! Please login again.");
          sessionStorage.clear();
          navigate("/login");
          return;
        }

        alert("Profile Updated Successfully!");
        navigate("/");
      } else {
        // Handle error case
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      //console.error(error);
      // Handle error case
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className="profile-container">
      {editMode ? (
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="email"> Email </label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={userDetails.email}
              disabled // Disable the email field
            />
          </div>

          <div className="form-group">
            <label htmlFor="name"> Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={updatedDetails.name || ""}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone"> Phone</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              value={updatedDetails.phone || ""}
              onChange={handleInputChange}
            />
          </div>

           <div className="form-group password-field">
            <label htmlFor="password"> New Password (leave empty if not changing)</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control"
                value={updatedDetails.password || ""}
                onChange={handleInputChange}
              />
              <span className="eye-icon" onClick={togglePasswordVisibility}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>          

          <button type="submit">Save</button>
        </form>
      ) : (
        <div className="profile-details">
          <h1>Welcome, {userDetails.name}</h1>
          <p> <b>Email:</b> {userDetails.email}</p>
          <p><b>Phone:</b> {userDetails.phone}</p>
          <button onClick={handleEdit}>Edit</button>
        </div>
      )}
    </div>
)};

export default ProfileForm;
