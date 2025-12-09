import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";

import "./Reviews.css";
const Reviews = () => {

  //console.log("[Reviews] Reviews.js Loaded");  
  const [patientReviews, setPatientReviews] = useState([]);
  const [doctorReviews, setDoctorReviews] = useState([]);

  const userId = sessionStorage.getItem("userId");
  const doctorId = sessionStorage.getItem("doctorId");
  const role = (sessionStorage.getItem("role") || "").toLowerCase();

  console.log("[Reviews] Session Data ->", { userId, doctorId, role });

  useEffect(() => {
    if (!role) return;
    let url = "";

    if (role === "doctor") {
      if (!doctorId) return; // avoid empty call
      url = `${API_URL}/api/reviews/doctor/${doctorId}`;
    } else {
      if (!userId) return;
      url = `${API_URL}/api/reviews/patient/${userId}`;
    }

    console.log("[Reviews] Fetching Reviews from URL:", url);

    fetch(url)
      .then((res) => {
        console.log("[Reviews] Raw Response Object:", res);
        return res.json();
      })
      .then((data) => {
        console.log("[Reviews] Parsed API Response:", data);

        if (role === "doctor") {
          console.log("[Reviews] Updating Doctor Reviews:", data.reviews);
          setDoctorReviews(data.reviews || []);
        } else {
          console.log("[Reviews] Updating Patient Reviews:", data.reviews);
          setPatientReviews(data.reviews || []);
        }
      })
      .catch((err) => console.error("[Reviews] Error fetching reviews:", err));
  }, [role, userId, doctorId]);

  const list = role === "doctor" ? doctorReviews : patientReviews;
  console.log("[Reviews] Final list rendered on screen:", list);

  return (
    <div className="reviews-container">
      <h2 className="reviews-title">Reviews {role.toLowerCase() === "doctor" ? "by Patients" : "for Doctors"}</h2>

      {list.length === 0 ? (
        <p className="no-reviews">No reviews available</p>
      ) : (

      <table className="reviews-table">
        <thead>
          <tr>

            {role === "doctor" ? (
              // Doctor view
              <>
                <th>Patient Name</th>
                <th>Phone</th>
                <th>Given On</th>
                <th>Review Details</th>
                <th>Rating</th>
              </>
            ) : (
              // Patient view
              <>
                <th>Doctor Name</th>
                <th>Speciality</th>
                <th>Review Details</th>
                <th>Rating</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {list.map((a, index) => (
            <tr key={`${a.id}-${index}`}>

              {role === "doctor" ? (
                // Doctor view
                <>
                  <td align="center">{a.patientName}</td>
                  <td align="center">{a.phone}</td>
                  <td align="center">
                    {new Date(a.createdAt).toLocaleString()}
                  </td>
                  <td align="center">
                    <div className="doc-cell">
                      <div className="doc-name">{a.title || "—"}</div>
                      <div className="doc-small">{a.review || "—"}</div>
                    </div>
                  </td>
                  <td align="center">{a.rating ? "⭐".repeat(a.rating) : "—"}</td>
                </>
              ) : (
                // Patient view
                <>
                  <td align="center">{a.doctorName}</td>
                  <td align="center">{a.speciality}</td>
                  <td align="center">
                    <div className="doc-cell">
                      <div className="doc-name">{a.title || "—"}</div>
                      <div className="doc-small">{a.review || "—"}</div>
                    </div>
                  </td>
                  <td align="center">{a.rating ? "⭐".repeat(a.rating) : "—"}</td>
                </>
              )}
                            
            </tr>
          ))}
        </tbody>
      </table>

      )}
    </div>
  );
};

export default Reviews;
