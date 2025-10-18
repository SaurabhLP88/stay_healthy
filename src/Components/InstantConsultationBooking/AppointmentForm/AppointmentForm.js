import React, { useState } from "react";
import "./AppointmentForm.css";

const AppointmentForm = ({ doctorName, onSubmit }) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !phoneNumber || !appointmentDate || !appointmentTime) {
      setError("Please fill all fields before booking.");
      return;
    }

    // Optional: you can add API call here to save appointment
    onSubmit({
      doctorName,
      name,
      phoneNumber,
      appointmentDate,
      appointmentTime,
    });

    // clear form after submit
    setName("");
    setPhoneNumber("");
    setAppointmentDate("");
    setAppointmentTime("");
    setError("");
    alert("Appointment booked successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="appointment-form">
      <h3>Book Appointment with {doctorName}</h3>

      <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

      <div className="form-group">
        <label htmlFor="appointmentDate">Appointment Date:</label>
        <input
          type="date"
          id="appointmentDate"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="appointmentTime">Time Slot:</label>
        <input
          type="time"
          id="appointmentTime"
          value={appointmentTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
          required
        />
      </div>

      {error && <p className="error-text">{error}</p>}

      <button type="submit" className="btn btn-primary">
        Book Appointment
      </button>
    </form>
  );
};

export default AppointmentForm;
