import React, { useState } from "react";
import "./AppointmentForm.css";

const AppointmentForm = ({ doctorName, onSubmit }) => {

  const timeSlots = [
    "09:00 AM - 09:30 AM",
    "10:00 AM - 10:30 AM",
    "11:00 AM - 11:30 AM",
    "12:00 PM - 12:30 PM",
    "02:00 PM - 02:30 PM",
    "03:00 PM - 03:30 PM",
    "04:00 PM - 04:30 PM",
    "05:00 PM - 05:30 PM"
  ];

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

    onSubmit({
      doctorName,
      patientName: name,
      phoneNumber,
      appointmentDate,
      appointmentTime,
    });

    // Clear form
    setName("");
    setPhoneNumber("");
    setAppointmentDate("");
    setAppointmentTime("");
    setError("");
  };

  return (
    
      <form onSubmit={handleSubmit} className="appointment-form">
        <h3>Book Appointment</h3>

        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input className="form-control" type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input className="form-control" type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="appointmentDate">Appointment Date:</label>
          <input className="form-control" type="date" id="appointmentDate" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="appointmentTime">Time Slot:</label>
          <select
            id="appointmentTime"
            className="form-control"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            required
          >
            <option value="">-- Select a Time Slot --</option>
            {timeSlots.map((slot, index) => (
              <option key={index} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn btn-primary">Book Now</button>
      </form>
   
  );
};

export default AppointmentForm;
