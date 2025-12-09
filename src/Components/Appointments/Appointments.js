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
    s === "completed" || s === "completed" ? "pill pill-green" :
    s === "expired" || s === "expired" ? "pill pill-blue" :
    s === "cancelled" || s === "cancelled" ? "pill pill-red" :
    "pill pill-gray";
  return <span className={className}>{status}</span>;
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
      <div className="appointments-page">
          <div className="appointments-header">
            <h2>Your Appointments</h2>
            <p className="muted">Past, present and future appointments are listed here</p>
          </div>

        <section className="appointments-card">

          {loading ? (
            <div className="appt-loading">Loading appointments…</div>
          ) : error ? (
            <div className="appt-error">{error}</div>
          ) : appointments.length === 0 ? (
            <div className="appt-empty">
              You don’t have any appointments yet. 
              {role.toLowerCase() === "doctor" && (
                <Link to="/book-consultation">Book one now</Link>
              )}
            </div>
          ) : (
              <>
                <div className="table-wrap">
                  <table className="appt-table" role="table" aria-label="Your appointments">
                    <thead>
                      <tr>
                        {role.toLowerCase() === "doctor" ? (
                          <>
                            <th>Patient Name</th>
                            <th>Patient Phone</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </>
                        ) : (
                          <>
                            <th>Patient Name</th>
                            <th>Booking Type</th>
                            <th>Doctor Name</th>
                            <th>Speciality</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {appointments.map((a, index) => {
                        //const doctor = a.doctor || a.doctorDetails || {};
                        const doctorName = a.doctorName || "Doctor";
                        const specialty = a.doctorSpeciality || "-";
                        const apptDate = a.appointmentDate || "";
                        const apptTime = a.appointmentTime || "";
                        return (
                          <tr key={`${a._id || a.id}-${index}`}>

                            {role.toLowerCase() === "doctor" ? (
                              // Doctor view
                              <>

                                <td>{a.patientName}</td>
                                <td>{a.phoneNumber}</td>
                                <td>{formatDate(a.appointmentDate)}</td>
                                <td>{formatTime(a.appointmentTime)}</td>
                                <td><StatusPill status={a.status} /></td>

                                <td className="actions-cell">
                                  {a.status === "booked" ? (
                                    <>
                                      <button
                                        className="btn small danger"
                                        onClick={() => confirmCancel(a._id)}
                                        disabled={busyId === a._id}
                                      >
                                        {busyId === a._id ? "Cancelling" : "Cancel"}
                                      </button>
                                      <button
                                        className="btn btn-primary small"
                                        onClick={() => confirmComplete(a._id)}
                                      >
                                        Complete
                                      </button>
                                    </>
                                  ) : (
                                    <span className="no-actions">—</span> 
                                  )}
                                </td>

                              </>
                            ) : (
                              // Patient view
                              <>                              
                                <td>
                                  <div className="doc-cell">
                                    <div className="doc-name">{a.patientName}</div>
                                    <div className="doc-small">{a.phoneNumber}</div>
                                  </div>
                                </td>
                                <td>
                                  {a.bookingType === "instant" ? "Instant": a.bookingType === "scheduled"? "Scheduled": "-"}
                                </td>
                                <td>{doctorName}</td>
                                <td>{specialty}</td>
                                <td>{formatDate(apptDate)}</td>
                                <td>{formatTime(apptTime)}</td>
                                <td><StatusPill status={a.status || "Pending"} /></td>
                                <td className="actions-cell">

                                  {/* BOOK AGAIN — when expired, completed, or cancelled */}
                                  {["expired", "completed", "cancelled"].includes(a.status?.toLowerCase()) && (
                                    <button
                                      className="btn btn-primary small"
                                      onClick={() => handleBookAgain(a)}
                                    >
                                      Book Again
                                    </button>
                                  )}

                                  {/* DOWNLOAD REPORT — only if report exists */}
                                  {a.reportUrl && (
                                    <a
                                      className="btn small outline"
                                      href={a.reportUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      Download Report
                                    </a>
                                  )}

                                  {/* ADD / VIEW REVIEW — only when completed */}
                                  {a.status?.toLowerCase() === "completed" && (
                                    <>
                                      <button
                                        className="btn small outline"
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
                                    </>
                                  )}

                                  {/* CANCEL — only when booked */}
                                  {a.status?.toLowerCase() === "booked" && (
                                    <button
                                      className="btn small danger"
                                      onClick={() => confirmCancel(a._id)}
                                      disabled={busyId === a._id}
                                    >
                                      {busyId === a._id ? "Cancelling" : "Cancel"}
                                    </button>
                                  )}

                                </td>
                              </>
                            )}


                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
            </>
          )}
        </section>
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
