import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../../config";

import ReviewForm from "../ReviewForm/ReviewForm";

import "./Appointments.css";

function formatDate(dateStr) {
  if (!dateStr) return "";

  // If backend sends YYYY-MM-DD
  if (dateStr.includes("-")) {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  }

  // If it's ISO string or Date object fallback
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}
function formatTime(isoOrTime) {
  const d = new Date(isoOrTime);
  if (!isNaN(d)) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return isoOrTime;
}

const StatusPill = ({ status }) => {
  const s = (status || "").toLowerCase();
  const className =
    s === "completed" ? "text-green-600 font-bold" :
    s === "expired" ? "text-red-600 font-bold" :
    s === "cancelled" ? "text-blue-600 font-bold" :
    s === "pending" ? "text-orange-600 font-bold" :
    "text-gray-500 font-bold";
  const formatted = s.charAt(0).toUpperCase() + s.slice(1);
  return <span className={className}>{formatted}</span>;
};

const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);  

  const authtoken = sessionStorage.getItem("auth-token");
  const email = sessionStorage.getItem("email");
  const role = sessionStorage.getItem("role");

  const thClass = "text-left px-3 py-3 whitespace-nowrap";
  const tdClass = "text-left px-3 py-2";

  useEffect(() => {
    if (!authtoken || !email) {
      navigate("/login");
      return;
    }
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddReview = (appointment) => {
    console.log("Selected Appointment Row:", appointment);
    console.log("DoctorId from appointment:", appointment?.doctorId || appointment?.doctor?._id);
    if (appointment.hasReview) {
      navigate("/reviews");
      return;
    }
    setSelectedAppointment(appointment);
    setShowReviewForm(true);
  };

  const fetchAppointments = async () => {

    const doctorId = sessionStorage.getItem("doctorId");
    console.log("➡️ doctorId from sessionStorage:", doctorId);

    setLoading(true);
    setError("");
    try {
      const endpoint =
        role.toLowerCase() === "doctor"
          ? `${API_URL}/api/appointments/doctor/${doctorId}`
          : `${API_URL}/api/appointments/my`;
      console.log("➡️ Fetching from endpoint:", endpoint);

      const res = await fetch(endpoint, {
        headers: {
          "Authorization": `Bearer ${authtoken}`,
          "Content-Type": "application/json",
        },
      });
      console.log("➡️ Raw fetch response object:", res);

      if (!res.ok) {
        console.error("❌ Response NOT OK. Status:", res.status);
        throw new Error(`Failed to fetch (${res.status})`);
      }
      const data = await res.json();

      console.log("Appointments response:", data);
      setAppointments(data);
      
    } catch (err) {
      console.error("🔥 Error in fetchAppointments:", err);
      setError("Unable to load appointments. Try again later.");
    } finally {
      console.log("➡️ fetchAppointments FINISHED");
      setLoading(false);
    }
  };

  const handleBookAgain = (appointment) => {
    if (!appointment) {
      navigate("/book-consultation");
      return;
    }
    const speciality = appointment.doctorSpeciality;
    const type = appointment.bookingType; // "instant" or "scheduled"

    if (type === "instant") {
      navigate(`/instant-consultation?speciality=${encodeURIComponent(speciality)}`);
    } else {
      navigate(`/book-consultation?speciality=${encodeURIComponent(speciality)}`);
    }
  };

  const handleCancel = async (appointmentId) => {
    if (!appointmentId) return;
    const ok = window.confirm("Are you sure you want to cancel this appointment?");
    if (!ok) return;
    setBusyId(appointmentId);
    try {
      const res = await fetch(`${API_URL}/api/appointments/cancel/${appointmentId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${authtoken}`,
          "Content-Type": "application/json",
        },
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Cancel failed");
      }

      if (data.success) {
        fetchAppointments();
      } else {
        alert("Cancel failed.");
      }
      
      setAppointments(prev =>
        prev.map(a =>
          a._id === appointmentId ? { ...a, status: "cancelled" } : a
        )
      );

    } catch (err) {
      console.error(err);
      alert("Cancellation failed. Please try again.");
    } finally {
      setBusyId(null);
    }
  };
  const confirmCancel = (id) => {
    const ok = window.confirm("Are you sure you want to cancel this appointment?");
    if (!ok) return;
    handleCancel(id);
  };

  const handleComplete = async (appointmentId) => {
    if (!appointmentId) return;

    const ok = window.confirm("Mark this appointment as completed?");
    if (!ok) return;

    setBusyId(appointmentId);

    try {
      const res = await fetch(`${API_URL}/api/appointments/complete/${appointmentId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${authtoken}`,
          "Content-Type": "application/json",
        }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Complete failed");
      }

      if (data.success) {
        fetchAppointments();
      } else {
        alert("Complete failed.");
      }

      setAppointments(prev =>
        prev.map(a =>
          a._id === appointmentId ? { ...a, status: "completed" } : a
        )
      );

    } catch (err) {
      console.error(err);
      alert("Failed to mark as complete. Try again.");
    } finally {
      setBusyId(null);
    }
  };
  const confirmComplete = (id) => {
    const ok = window.confirm("Mark this appointment as completed?");
    if (!ok) return;
    handleComplete(id);
  };

  const submitReview = async (formData) => {
    try {
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authtoken}`
        },
        body: JSON.stringify({
          doctorId: selectedAppointment?.doctorId || selectedAppointment?.doctor?._id,
          appointmentId: selectedAppointment?._id,
          userId: selectedAppointment?.userId?._id || selectedAppointment?.userId,
          rating: formData.rating,
          title: formData.title,
          description: formData.description
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Error saving review:", data);
        alert("Error saving review.");
        return;
      }

      console.log("Review saved:", data);
      alert("Review submitted successfully!");

      setShowReviewForm(false);
      fetchAppointments(); // refresh list
    } catch (err) {
      console.error("Review submit error:", err);
      alert("Error submitting review.");
    }
  };


  return (
    <>
      <div className="m-0">

        {/* HEADER */}
        <div className="text-center mb-5 md:mb-10">
          <h2 className="text-3xl font-bold text-blue-600 tracking-wide mb-2 md:mb-4">Your Appointments</h2>
          <p className="text-gray-500">Past, present and future appointments are listed here</p>
        </div>

        {/* CARD WRAPPER */}
        <div className="bg-white shadow-xl rounded-xl mb-5">

          {/* LOADING / ERROR / EMPTY */}
          {loading ? (
            <div className="text-center font-semibold text-gray-700">Loading appointments…</div>
          ) : error ? (
            <div className="text-center text-red-600 font-semibold">{error}</div>
          ) : appointments.length === 0 ? (
            <div className="text-center text-gray-700 font-semibold">
              You don’t have any appointments yet.
              {role.toLowerCase() === "doctor" && (
                <Link to="/book-consultation" className="text-blue-600 underline ml-1">Book one now</Link>
              )}
            </div>
          ) : (
            <>
              {/* TABLE SCROLL WRAPPER */}
              <div className="overflow-x-auto">
                <table className="min-w-[900px] w-full border-collapse" role="table">

                  {/* TABLE HEADER */}
                  <thead>
                    <tr className="border-b bg-gray-50">

                      {role.toLowerCase() === "doctor" ? (
                        <>
                          <th className={thClass}>Patient Name</th>
                          <th className={thClass}>Patient Phone</th>
                          <th className={thClass}>Date</th>
                          <th className={thClass}>Time</th>
                          <th className={thClass}>Status</th>
                          <th className={thClass}>Actions</th>
                        </>
                      ) : (
                        <>
                          <th className={thClass}>Patient Name</th>
                          <th className={thClass}>Booking Type</th>
                          <th className={thClass}>Doctor Name</th>
                          <th className={thClass}>Speciality</th>
                          <th className={thClass}>Date</th>
                          <th className={thClass}>Time</th>
                          <th className={thClass}>Status</th>
                          <th className={thClass}>Actions</th>
                        </>
                      )}

                    </tr>
                  </thead>

                  {/* TABLE BODY */}
                  <tbody>
                    {appointments.map((a, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">

                        {/* =============================== DOCTOR VIEW =============================== */}
                        {role.toLowerCase() === "doctor" ? (
                          <>
                            <td className={tdClass}>{a.patientName}</td>
                            <td className={tdClass}>{a.phoneNumber}</td>
                            <td className={tdClass}>{formatDate(a.appointmentDate)}</td>
                            <td className={tdClass}>{formatTime(a.appointmentTime)}</td>
                            <td className={tdClass}>
                              <StatusPill status={a.status} />
                            </td>

                            <td className="px-3 py-2 space-x-2 whitespace-nowrap">
                              {a.status === "booked" ? (
                                <>
                                  <button className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600 text-sm">
                                    {busyId === a._id ? "Cancelling" : "Cancel"}
                                  </button>

                                  <button className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700 text-sm">
                                    Complete
                                  </button>
                                </>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                          </>
                        ) : (
                          /* =============================== PATIENT VIEW =============================== */
                          <>
                            <td className={tdClass}>
                              <div>
                                <div className="font-semibold">{a.patientName}</div>
                                <div className="text-gray-500 text-sm">{a.phoneNumber}</div>
                              </div>
                            </td>

                            <td className={tdClass}>
                              {a.bookingType === "instant"
                                ? "Instant"
                                : a.bookingType === "scheduled"
                                ? "Scheduled"
                                : "-"}
                            </td>

                            <td className={tdClass}>{a.doctorName}</td>
                            <td className={tdClass}>{a.doctorSpeciality}</td>
                            <td className={tdClass}>{formatDate(a.appointmentDate)}</td>
                            <td className={tdClass + ' whitespace-nowrap'}>{formatTime(a.appointmentTime)}</td>

                            <td className={tdClass}>
                              <StatusPill status={a.status} />
                            </td>

                            <td className="px-3 py-2 space-x-2 whitespace-nowrap">

                              {/* BOOK AGAIN */}
                              {["expired", "completed", "cancelled"].includes(a.status?.toLowerCase()) && (
                                <button 
                                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 whitespace-nowrap"
                                  onClick={() => handleBookAgain(a)}>
                                  Book Again
                                </button>
                              )}

                              {/* REPORT */}
                              {a.reportUrl && (
                                <a
                                  href={a.reportUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-3 py-1 border border-gray-600 rounded text-sm hover:bg-gray-800 hover:text-white whitespace-nowrap"
                                >
                                  Download Report
                                </a>
                              )}

                              {/* REVIEW */}
                              {a.status?.toLowerCase() === "completed" && (
                                <button 
                                  className="px-3 py-1 border border-blue-600 text-blue-600 rounded text-sm hover:bg-blue-600 hover:text-white whitespace-nowrap"
                                  onClick={() => {
                                    if (a.hasReview) {
                                      navigate("/reviews");
                                    } else {
                                      handleAddReview(a);
                                    }
                                  }}
                                  >
                                  {a.hasReview ? "View Review" : "Add Review"}
                                </button>
                              )}

                              {/* CANCEL */}
                              {a.status?.toLowerCase() === "booked" && (
                                <button 
                                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 whitespace-nowrap" 
                                  onClick={() => confirmCancel(a._id)} 
                                  disabled={busyId === a._id}>
                                  {busyId === a._id ? "Cancelling" : "Cancel"}
                                </button>
                              )}
                            </td>
                          </>
                        )}

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </>
          )}

        </div>

      </div>

      
      {role.toLowerCase() === "patient" && (
        <>
          {showReviewForm && (
            <ReviewForm
              appointmentId={selectedAppointment}
              doctorId={selectedAppointment?.doctorId || selectedAppointment?.doctor?._id}
              userId={selectedAppointment?.userId?._id || selectedAppointment?.userId}
              onSubmit={(formData) => {
                console.log("Review Submitted:", formData, "For:", selectedAppointment);
                submitReview(formData);
              }}
              onClose={() => setShowReviewForm(false)}
            />
          )}
        </>
      )}

    </>

  );
};

export default Appointments;
