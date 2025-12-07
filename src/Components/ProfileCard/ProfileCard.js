import React, { useEffect, useState } from "react";
import { API_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import initSpeciality from "../../utils/specialities";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./ProfileCard.css";

const ProfileForm = () => {
  const [userDetails, setUserDetails] = useState({});
  const [updatedDetails, setUpdatedDetails] = useState({ password: "" });
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const role = sessionStorage.getItem("role");

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
      console.log("🔵 Fetching Profile — Email:", email);
      if (!authtoken) {
        navigate("/login");
      } else {
        const endpoint = role === "Doctor" 
          ? `${API_URL}/api/doctors/profile`
          : `${API_URL}/api/auth/user`;

        console.log("🔵 API Endpoint:", endpoint);
        const response = await fetch(endpoint, {
          headers: {
            "Authorization": `Bearer ${authtoken}`,
            "email": email
          }
        });
        console.log("🔵 Profile Fetch Status:", response.status);
        if (response.ok) {
          const user = await response.json();
          console.log("✅ Profile Data Received:", user);
          setUserDetails(user);
          setUpdatedDetails({ ...user, password: "" });
        } else {
          console.log("❌ Failed to fetch profile:", response.status);
          throw new Error("Failed to fetch user profile");
        }
      }
    } catch (error) {
      console.log("❌ Error inside fetchUserProfile:", error);
      // Handle error case
    }
  };

  const handleEdit = () => {
    console.log("🟡 Edit Mode Enabled");
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    console.log(`🟡 Input Changed — ${e.target.name}:`, e.target.value);
    setUpdatedDetails({
      ...updatedDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔵 Submit Triggered — Updated Details:", updatedDetails);
    if (
      updatedDetails.name === userDetails.name &&
      updatedDetails.phone === userDetails.phone &&
      !updatedDetails.password
    ) {
      alert("No changes done");
      console.log("⚠ No changes detected, cancelling update.");
      setEditMode(false);
      return;
    }

    if (!/^[0-9]{10}$/.test(updatedDetails.phone)) {
      console.log("❌ Invalid Phone:", updatedDetails.phone);
      alert("Phone must be 10 digits!");
      return;
    }

    if (updatedDetails.password && updatedDetails.password.length < 6) {
      console.log("❌ Invalid Password Length");
      alert("Password must be at least 6 characters!");
      return;
    }

    try {
      const authtoken = sessionStorage.getItem("auth-token");
      const email = sessionStorage.getItem("email"); // Get the email from session storage
      console.log("🔵 Sending Update — Email:", email);
      if (!authtoken || !email) {
        navigate("/login");
        return;
      }

      const payload = { ...updatedDetails };
      if (!payload.password) delete payload.password;
      console.log("🟡 Final Payload Sent:", payload);

      const endpoint = role === "Doctor"
        ? `${API_URL}/api/doctors/update`
        : `${API_URL}/api/auth/user`;
      console.log("🔵 Update API Endpoint:", endpoint);
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${authtoken}`,
          "Content-Type": "application/json",
          "email": email,
        },
        body: JSON.stringify(payload),
      });
      console.log("🔵 Update Response Status:", response.status);

      if (response.ok) {
        // Update the user details in session storage
        sessionStorage.setItem("name", updatedDetails.name);
        sessionStorage.setItem("phone", updatedDetails.phone);
        window.dispatchEvent(new Event("session-update"));

        if (role === "Doctor") {
          sessionStorage.setItem("speciality", updatedDetails.speciality);
          sessionStorage.setItem("experience", updatedDetails.experience);
        }

        setUserDetails({
          ...userDetails,
          name: updatedDetails.name,
          phone: updatedDetails.phone,
        });
        setEditMode(false);
        
        if (updatedDetails.password) {
          setPasswordChanged(true);
          sessionStorage.clear();
          window.dispatchEvent(new Event("session-update"));
          alert("Password Updated Successfully!");
          navigate("/login");
          return;
        }

        alert("Profile Updated Successfully!");
        navigate("/");
      } else {
        console.log("❌ Failed to update profile:", response.status);
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.log("❌ Error in handleSubmit:", error);
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

          {role === "Doctor" && (
            <>
              <div className="form-group">
                <label htmlFor="speciality">Speciality</label>
                <select
                    name="speciality"
                    value={updatedDetails.speciality || ""}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="">Select speciality</option>
                    {initSpeciality.map((item, index) => (
                      <option key={index} value={item}>{item}</option>
                    ))}

                  </select>
              </div>

              <div className="form-group">
                <label htmlFor="experience">Experience (years)</label>
                <input
                  type="number"
                  name="experience"
                  className="form-control"
                  min="0"
                  value={updatedDetails.experience || ""}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}
          
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
          {role === "Doctor" && (
            <>
              <p><b>Speciality:</b> {userDetails.speciality}</p>
              <p><b>Experience:</b> {userDetails.experience} years</p>
            </>
          )}
          <p> <b>Email:</b> {userDetails.email}</p>
          <p><b>Phone:</b> {userDetails.phone}</p>
          <button onClick={handleEdit}>Edit</button>
        </div>
      )}
    </div>
)};

export default ProfileForm;
