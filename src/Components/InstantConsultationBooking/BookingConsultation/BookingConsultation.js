// src/Components/BookingConsultation/BookingConsultation.js
import React, { useState } from "react";
import FindDoctorSearch from "../FindDoctorSearch/FindDoctorSearch"; // adjust path if needed
import DoctorCard from "../DoctorCard/DoctorCard";
import "./BookingConsultation.css";

const BookingConsultation = () => {
  const [doctors, setDoctors] = useState([]); // list from search
  const [bookings, setBookings] = useState([]); // array of {doctorId, appointmentData, bookedAt}

  // Called by FindDoctorSearch component with search results array
  const handleSearchResults = (results) => {
    setDoctors(results || []);
  };

  // Create booking object and save local + optional API call
  const handleBook = async (doctor, appointmentData) => {
    const booking = {
      id: `${doctor.id || doctor._id || Date.now()}`, // unique id
      doctorId: doctor.id || doctor._id || doctor.name,
      doctorName: doctor.name,
      patientName: appointmentData.name || appointmentData.patientName,
      phoneNumber: appointmentData.phoneNumber,
      appointmentDate: appointmentData.appointmentDate,
      appointmentTime: appointmentData.appointmentTime,
      createdAt: new Date().toISOString(),
    };

    // Optionally call backend API to persist booking:
    // try {
    //   await fetch("http://localhost:8181/api/bookings", { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify(booking) });
    // } catch(err) { console.error("Booking API failed", err); }

    setBookings((prev) => [...prev, booking]);
    alert("Appointment booked for " + booking.patientName + " with " + booking.doctorName);
  };

  const handleCancel = async (doctor) => {
    // remove booking(s) for that doctor (or specific booking id if tracked)
    setBookings((prev) => prev.filter((b) => b.doctorId !== (doctor.id || doctor._id || doctor.name)));

    // Optionally call backend API to cancel
    // await fetch(`http://localhost:8181/api/bookings/${bookingId}`, { method: "DELETE" });

    alert(`Appointment cancelled for ${doctor.name}`);
  };

  // helper to check if a doctor is booked
  const isDoctorBooked = (doctor) => {
    return bookings.some((b) => b.doctorId === (doctor.id || doctor._id || doctor.name));
  };

  return (
    <div className="booking-consultation-page">
      <h2>Book a Consultation</h2>

      {/* FindDoctorSearch: must call props.onResults(results) when it has results */}
      <FindDoctorSearch onResults={handleSearchResults} />

      <div className="search-results">
        {doctors.length === 0 ? (
          <p>No doctors found yet. Try searching specialties like "cardiologist", "dermatologist".</p>
        ) : (
          doctors.map((doc) => (
            <DoctorCard
              key={doc.id || doc._id || doc.name}
              doctor={doc}
              isBooked={isDoctorBooked(doc)}
              onBook={handleBook}
              onCancel={handleCancel}
            />
          ))
        )}
      </div>

      <div className="my-bookings">
        <h3>My Bookings</h3>
        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          bookings.map((b) => (
            <div key={b.id} className="booking-item">
              <strong>{b.doctorName}</strong> — {b.patientName} on {b.appointmentDate} at {b.appointmentTime}
              <button onClick={() => handleCancel({ id: b.doctorId, name: b.doctorName })} className="btn btn-danger">Cancel</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookingConsultation;
