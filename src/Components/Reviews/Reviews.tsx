import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";

import "./Reviews.css";

interface PatientReview {
  id?: string;
  doctorName: string;
  speciality: string;
  title?: string;
  review?: string;
  rating?: number;
  createdAt?: string;
}

interface DoctorReview {
  id?: string;
  patientName: string;
  phone: string;
  title?: string;
  review?: string;
  rating?: number;
  createdAt?: string;
}

type ReviewType = PatientReview | DoctorReview;

const Reviews: React.FC = () => {

  const [patientReviews, setPatientReviews] = useState<PatientReview[]>([]);
  const [doctorReviews, setDoctorReviews] = useState<DoctorReview[]>([]);

  const [userId, setUserId] = useState<string>(sessionStorage.getItem("userId") || "");
  const [doctorId, setDoctorId] = useState<string>(sessionStorage.getItem("doctorId") || "");
  const [role, setRole] = useState<string>((sessionStorage.getItem("role") || "").toLowerCase());

  console.log("[Reviews] Session Data ->", { userId, doctorId, role });

  const thClass = "text-left px-3 py-4 whitespace-nowrap";
  const tdClass = "text-left px-3 py-2";

  useEffect(() => {
    const interval = setInterval(() => {
      const uid = sessionStorage.getItem("userId") || "";
      const did = sessionStorage.getItem("doctorId") || "";
      const r = (sessionStorage.getItem("role") || "").toLowerCase();

      if (uid !== userId) setUserId(uid);
      if (did !== doctorId) setDoctorId(did);
      if (r !== role) setRole(r);

    }, 500);

    return () => clearInterval(interval);
  }, [userId, doctorId, role]);

  useEffect(() => {
    let url = "";

    // Case 1: Logged out → show public reviews
    if (!role) {
      fetch(`${API_URL}/api/reviews/public`)
        .then(res => res.json())
        .then(data => {
          setPatientReviews(data.reviews || []);
          setDoctorReviews([]);
        });
      return;
    }

    // Case 2: Doctor logged in → fetch reviews doctor has received
    if (role === "doctor") {
      if (!doctorId) return;
      url = `${API_URL}/api/reviews/doctor/${doctorId}`;
    } 
    // Case 3: Patient logged in → fetch reviews patient has submitted
    else {
      if (!userId) return;
      url = `${API_URL}/api/reviews/patient/${userId}`;
    }

    console.log("[Reviews] Fetching from:", url);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log("[Reviews] Parsed API Response:", data);

        if (role === "doctor") {
          setDoctorReviews(data.reviews || []);
        } else {
          setPatientReviews(data.reviews || []);
        }
      })
      .catch((err) => console.error("[Reviews] Fetch error:", err));
  }, [role, doctorId, userId]);

  const list: ReviewType[] = role === "doctor" ? doctorReviews : patientReviews;
  console.log("[Reviews] Render list:", list);

  return (
    <div className="px-0 mb-5">

      <div className="text-center mb-5">
        <h1 className="text-3xl font-semibold text-blue-600 tracking-wide">Reviews {role.toLowerCase() === "doctor" ? "by Patients" : "for Doctors"}</h1>
      </div>

      <div className="bg-white border border-gray-200 shadow-xl rounded-xl mb-5">
        {list.length === 0 ? (
          <div className="text-center text-gray-700 font-semibold p-3">No reviews available</div>
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
                        <td className={tdClass}>{(a as DoctorReview).patientName}</td>
                        <td className={tdClass}>{(a as DoctorReview).phone}</td>
                        <td className={tdClass}>
                          {a.createdAt ? new Date(a.createdAt).toLocaleString() : "—"}
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
                        <td className={tdClass}>{(a as PatientReview).doctorName}</td>
                        <td className={tdClass}>{(a as PatientReview).speciality}</td>
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

    </div>

  );
};

export default Reviews;
