import React, { useState } from "react";
import FindDoctorSearch from "../FindDoctorSearch/FindDoctorSearch"; // adjust path if needed
import DoctorCard from "../DoctorCard/DoctorCard";
import "./BookingConsultation.css";

const BookingConsultation = () => {

  console.log("BookingConsultation.js Loaded");

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

    // Save booking in state
    setBookings((prev) => [...prev, booking]);

    // Save doctor info & appointment in localStorage for Notification
    localStorage.setItem("doctorData", JSON.stringify({ name: doctor.name }));
    localStorage.setItem(doctor.name, JSON.stringify({
      date: booking.appointmentDate,
      time: booking.appointmentTime,
      patientName: booking.patientName
    }));

    // Dispatch custom event to notify Notification component
    window.dispatchEvent(new Event("appointmentBooked"));

    alert("Appointment booked for " + booking.patientName + " with " + booking.doctorName);
  };

  const handleCancel = async (doctor) => {
    setBookings((prev) => prev.filter((b) => b.doctorId !== (doctor.id || doctor._id || doctor.name)));

    // Optionally remove from localStorage
    localStorage.removeItem(doctor.name);

    // Optionally dispatch event if you want Notification to hide
    window.dispatchEvent(new Event("appointmentCancelled"));

    alert(`Appointment cancelled for ${doctor.name}`);
  };

  // helper to check if a doctor is booked
  const isDoctorBooked = (doctor) => {
    return bookings.some((b) => b.doctorId === (doctor.id || doctor._id || doctor.name));
  };

  return (
    <div className="booking-consultation-page">

      <FindDoctorSearch onResults={handleSearchResults} />

      {/* Display search results 
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
      </div>*/}

    </div>
  );
};

export default BookingConsultation;
