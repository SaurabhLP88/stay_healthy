import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { API_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import initSpeciality from "../../utils/specialities";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./ProfileCard.css";

interface UserDetails {
  name?: string;
  email?: string;
  phone?: string;
  speciality?: string;
  experience?: number;
  password?: string;
}

const ProfileForm: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDetails>({});
  const [updatedDetails, setUpdatedDetails] = useState<UserDetails>({ password: "" });
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const authtoken = sessionStorage.getItem("auth-token");
    const email = sessionStorage.getItem("email");

    if (!authtoken || !email) {
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const endpoint =
          role === "Doctor"
            ? `${API_URL}/api/doctors/profile`
            : `${API_URL}/api/auth/user`;

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${authtoken}`,
            email,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch profile");

        const user = await response.json();
        setUserDetails(user);
        setUpdatedDetails({ ...user, password: "" });
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchUserProfile();
  }, [navigate, role]);

  const handleEdit = () => setEditMode(true);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUpdatedDetails({
      ...updatedDetails,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: FormEvent) => {
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

    if (updatedDetails.phone && !/^[0-9]{10}$/.test(updatedDetails.phone)) {
      alert("Phone must be 10 digits!");
      return;
    }

    if (updatedDetails.password && updatedDetails.password.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }

    try {
      const authtoken = sessionStorage.getItem("auth-token");
      const email = sessionStorage.getItem("email");

      if (!authtoken || !email) {
        navigate("/login");
        return;
      }

      const payload = { ...updatedDetails };
      if (!payload.password) delete payload.password;

      const endpoint =
        role === "Doctor"
          ? `${API_URL}/api/doctors/update`
          : `${API_URL}/api/auth/user`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authtoken}`,
          "Content-Type": "application/json",
          email,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      // Update sessionStorage
      sessionStorage.setItem("name", updatedDetails.name || "");
      sessionStorage.setItem("phone", updatedDetails.phone || "");
      window.dispatchEvent(new Event("session-update"));

      if (role === "Doctor") {
        if (updatedDetails.speciality)
          sessionStorage.setItem("speciality", updatedDetails.speciality);
        if (updatedDetails.experience)
          sessionStorage.setItem("experience", String(updatedDetails.experience));
      }

      setUserDetails({
        ...userDetails,
        name: updatedDetails.name,
        phone: updatedDetails.phone,
      });

      setEditMode(false);

      if (updatedDetails.password) {
        sessionStorage.clear();
        window.dispatchEvent(new Event("session-update"));
        alert("Password Updated Successfully!");
        navigate("/login");
        return;
      }

      alert("Profile Updated Successfully!");
      navigate("/");
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-3 md:p-6 bg-gray-100 shadow-lg rounded-lg">

      <div className="text-center mb-3 md:mb-5">
          <h1 className="text-3xl font-bold text-blue-600 tracking-wide">Your Profile</h1>
        </div>

      {/* EDIT MODE */}
      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200 cursor-not-allowed"
              value={userDetails.email}
              disabled
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={updatedDetails.name || ""}
              onChange={handleInputChange}
            />
          </div>

          {role === "Doctor" && (
            <>
              <div>
                <label className="block mb-1 font-semibold">Speciality</label>
                <select
                  name="speciality"
                  value={updatedDetails.speciality || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="">Select speciality</option>
                  {initSpeciality.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold">Experience (years)</label>
                <input
                  type="number"
                  min="0"
                  name="experience"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  value={updatedDetails.experience || ""}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          <div>
            <label className="block mb-1 font-semibold">Phone</label>
            <input
              type="text"
              name="phone"
              className="w-full px-3 py-2 border border-gray-300 rounded"
              value={updatedDetails.phone || ""}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">New Password (optional)</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={updatedDetails.password || ""}
                onChange={handleInputChange}
              />
              <span
                className="eye-icon absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded transition"
            >
              Cancel Edit
            </button>

            <button
              type="submit"
              className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
            >
              Save
            </button>
          </div>

        </form>
      ) : (
        /* VIEW MODE */
        <div className="bg-white rounded-lg p-5 shadow-sm">

          <h3 className="text-xl font-semibold mb-3">
            Welcome, {role === "Doctor" ? "Dr." : ""} {userDetails.name}
          </h3>

          {role === "Doctor" && (
            <>
              <p className="mb-2"><b>Speciality:</b> {userDetails.speciality}</p>
              <p className="mb-2"><b>Experience:</b> {userDetails.experience} years</p>
            </>
          )}

          <p className="mb-2"><b>Email:</b> {userDetails.email}</p>
          <p className="mb-4"><b>Phone:</b> {userDetails.phone}</p>

          <button
            onClick={handleEdit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
          >
            Edit
          </button>
        </div>
      )}
    </div>

)};

export default ProfileForm;
