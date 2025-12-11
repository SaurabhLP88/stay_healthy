import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";

import "./Reviews.css";
const Reviews = () => {

  //console.log("[Reviews] Reviews.js Loaded");  
  const [patientReviews, setPatientReviews] = useState([]);
  const [doctorReviews, setDoctorReviews] = useState([]);

  const [userId, setUserId] = useState(sessionStorage.getItem("userId") || "");
  const [doctorId, setDoctorId] = useState(sessionStorage.getItem("doctorId") || "");
  const [role, setRole] = useState((sessionStorage.getItem("role") || "").toLowerCase());

  console.log("[Reviews] Session Data ->", { userId, doctorId, role });

  const thClass = "text-left px-3 py-4 whitespace-nowrap";
  const tdClass = "text-left px-3 py-2";

  useEffect(() => {
    const interval = setInterval(() => {
      const uid = sessionStorage.getItem("userId");
      const did = sessionStorage.getItem("doctorId");
      const r = (sessionStorage.getItem("role") || "").toLowerCase();

      if (uid !== userId) setUserId(uid);
      if (did !== doctorId) setDoctorId(did);
      if (r !== role) setRole(r);

    }, 500);

    return () => clearInterval(interval);
  }, [userId, doctorId, role]);

  useEffect(() => {
    
    let url = "";

    if (!role) {
      // Load ALL public reviews after logout
      fetch(`${API_URL}/api/reviews/public`)
        .then(res => res.json())
        .then(data => {
          setPatientReviews(data.reviews || []);
          setDoctorReviews([]);
        });
      return;
    }    

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
  }, [role, doctorId, userId]);

  const list = role === "doctor" ? doctorReviews : patientReviews;
  console.log("[Reviews] Final list rendered on screen:", list);  

  return (
    <div className="px-0 mb-5">

      <div className="text-center mb-5">
          <h1 className="text-3xl font-semibold text-blue-600 tracking-wide">Reviews {role.toLowerCase() === "doctor" ? "by Patients" : "for Doctors"}</h1>
        </div>

      {list.length === 0 ? (
        <p className="text-center text-gray-600 text-lg py-6">No reviews available</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm font-semibold">
                {role === "doctor" ? (
                  <>
                    <th className={thClass}>Patient Name</th>
                    <th className={thClass}>Phone</th>
                    <th className={thClass}>Given On</th>
                    <th className={thClass}>Review Details</th>
                    <th className={thClass}>Rating</th>
                  </>
                ) : (
                  <>
                    <th className={thClass}>Doctor Name</th>
                    <th className={thClass}>Speciality</th>
                    <th className={thClass}>Review Details</th>
                    <th className={thClass}>Rating</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {list.map((a, index) => (
                <tr
                  key={`${a.id}-${index}`}
                  className="text-center text-gray-700 border-b hover:bg-gray-50"
                >
                  {role === "doctor" ? (
                    <>
                      <td className={tdClass}>{a.patientName}</td>
                      <td className={tdClass}>{a.phone}</td>
                      <td className={tdClass}>
                        {new Date(a.createdAt).toLocaleString()}
                      </td>
                      <td className={tdClass}>
                        <div className="text-left">
                          <div className="font-semibold">{a.title || "—"}</div>
                          <div className="text-sm text-gray-500">{a.review || "—"}</div>
                        </div>
                      </td>
                      <td className={tdClass}>
                        {a.rating ? "⭐".repeat(a.rating) : "—"}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className={tdClass}>{a.doctorName}</td>
                      <td className={tdClass}>{a.speciality}</td>
                      <td className={tdClass}>
                        <div className="text-left">
                          <div className="font-semibold">{a.title || "—"}</div>
                          <div className="text-sm text-gray-500">{a.review || "—"}</div>
                        </div>
                      </td>
                      <td className={tdClass}>
                        {a.rating ? "⭐".repeat(a.rating) : "—"}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

  );
};

export default Reviews;
