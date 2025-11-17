import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../../config";
import "./Appointments.css";

function formatDate(isoOrDate) {
  const d = new Date(isoOrDate);
  if (isNaN(d)) return isoOrDate;
  return d.toLocaleDateString();
}
function formatTime(isoOrTime) {
  const d = new Date(isoOrTime);
  if (!isNaN(d)) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return isoOrTime;
}

const StatusPill = ({ status }) => {
  const s = (status || "").toLowerCase();
  const className =
    s === "completed" || s === "done" ? "pill pill-green" :
    s === "upcoming" || s === "confirmed" ? "pill pill-blue" :
    s === "cancelled" || s === "canceled" ? "pill pill-red" :
    "pill pill-gray";
  return <span className={className}>{status}</span>;
};

const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null); // for per-row button disabling

  const authtoken = sessionStorage.getItem("auth-token");
  const email = sessionStorage.getItem("email");

  useEffect(() => {
    if (!authtoken || !email) {
      navigate("/login");
      return;
    }
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/appointments/user?email=${encodeURIComponent(email)}`, {
        headers: {
          "Authorization": `Bearer ${authtoken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch (${res.status})`);
      }
      const data = await res.json();
      // Expect data to be array of appointments
      // Normalize sort: upcoming first (status or date)
      const sorted = (data || []).slice().sort((a, b) => {
        // upcoming vs completed/cancelled
        const priority = (item) => {
          const s = (item.status || "").toLowerCase();
          if (s === "upcoming" || s === "confirmed") return 0;
          if (s === "pending") return 1;
          if (s === "completed" || s === "done") return 2;
          return 3; // cancelled etc
        };
        const p = priority(a) - priority(b);
        if (p !== 0) return p;
        // fallback by date ascending
        const da = new Date(a.date || a.datetime || a.createdAt || null);
        const db = new Date(b.date || b.datetime || b.createdAt || null);
        return da - db;
      });
      setAppointments(sorted);
    } catch (err) {
      console.error(err);
      setError("Unable to load appointments. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookAgain = (doctorId) => {
    if (!doctorId) {
      navigate("/book-consultation");
      return;
    }
    // Send doctor id as query param so booking page can prefill
    navigate(`/book-consultation?doctor=${encodeURIComponent(doctorId)}`);
  };

  const handleCancel = async (appointmentId) => {
    if (!appointmentId) return;
    const ok = window.confirm("Are you sure you want to cancel this appointment?");
    if (!ok) return;
    setBusyId(appointmentId);
    try {
      const res = await fetch(`${API_URL}/api/appointments/${appointmentId}/cancel`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authtoken}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Cancel failed");
      }
      // optimistic update: mark as cancelled
      setAppointments(prev => prev.map(a => a._id === appointmentId ? { ...a, status: "Cancelled" } : a));
    } catch (err) {
      console.error(err);
      alert("Cancellation failed. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const handleOpenReports = () => {
    navigate("/reports");
  };

  const handleOpenReviews = () => {
    navigate("/reviews");
  };

  const handleGotoCancelCenter = () => {
    // Could be a dedicated cancellation page or modal
    navigate("/appointments/cancel");
  };

  return (
    <div className="appointments-page">
        <div className="appointments-header">
          <h2>Your Appointments</h2>
          <p className="muted">Current and previous appointments for your account</p>
        </div>

      <section className="appointments-card">
        

        {loading ? (
          <div className="appt-loading">Loading appointments…</div>
        ) : error ? (
          <div className="appt-error">{error}</div>
        ) : appointments.length === 0 ? (
          <div className="appt-empty">
            You don’t have any appointments yet. <Link to="/search/doctors">Book one now</Link>.
          </div>
        ) : (
            <>
            <div className="top-actions">
                <button className="action-btn" onClick={handleOpenReviews}>Your Reviews</button>
                <button className="action-btn" onClick={handleOpenReports}>Your Reports</button>
                <button className="action-btn muted" onClick={handleGotoCancelCenter}>Cancel Appointment</button>
            </div>
          <div className="table-wrap">
            <table className="appt-table" role="table" aria-label="Your appointments">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialty</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((a) => {
                  const doctor = a.doctor || a.doctorDetails || {};
                  const doctorName = doctor.name || a.doctorName || "Doctor";
                  const specialty = doctor.speciality || doctor.specialty || a.specialty || "-";
                  const apptDate = a.date || a.datetime || a.scheduledAt || "";
                  const apptTime = a.time || a.slotTime || a.datetime || "";
                  return (
                    <tr key={a._id || a.id}>
                      <td>
                        <div className="doc-cell">
                          <div className="doc-name">{doctorName}</div>
                          <div className="doc-small">{doctor.hospital || doctor.clinic || ""}</div>
                        </div>
                      </td>

                      <td>{specialty}</td>

                      <td>{formatDate(apptDate)}</td>

                      <td>{formatTime(apptTime)}</td>

                      <td><StatusPill status={a.status || "Pending"} /></td>

                      <td className="actions-cell">
                        <button
                          className="btn small"
                          onClick={() => handleBookAgain(doctor.id || doctor._id || a.doctorId)}
                        >
                          Book Again
                        </button>

                        {a.reportUrl ? (
                          <a className="btn small outline" href={a.reportUrl} target="_blank" rel="noreferrer">Download Report</a>
                        ) : null}

                        { (a.status || "").toLowerCase() !== "cancelled" && (a.status || "").toLowerCase() !== "completed" ? (
                          <button
                            className="btn small danger"
                            onClick={() => handleCancel(a._id || a.id)}
                            disabled={busyId === (a._id || a.id)}
                          >
                            {busyId === (a._id || a.id) ? "Cancelling…" : "Cancel"}
                          </button>
                        ) : null}
                      </td>
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
  );
};

export default Appointments;
