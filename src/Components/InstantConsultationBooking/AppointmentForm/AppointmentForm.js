import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./AppointmentForm.css";

const AppointmentForm = ({ doctorName, onSubmit }) => {
  console.log("AppointmentForm.js Loaded");

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
  const [errors, setErrors] = useState({});
  const location = useLocation();

  // 🟩 Validation for Instant Consultation
  const validateInstantForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Full name is required.";
    else if (!/^[A-Za-z\s]+$/.test(name))
      newErrors.name = "Name should contain only letters.";

    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required.";
    else if (!/^\d{10}$/.test(phoneNumber))
      newErrors.phoneNumber = "Enter a valid 10-digit phone number.";

    return newErrors;
  };

  // 🟦 Validation for Book Consultation
  const validateBookingForm = () => {
    const newErrors = validateInstantForm();

    if (!appointmentDate)
      newErrors.appointmentDate = "Select an appointment date.";
    if (!appointmentTime)
      newErrors.appointmentTime = "Select a time slot.";

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //console.log("Form submitted");

   const validationFn =
      location.pathname === "/instant-consultation"
        ? validateInstantForm
        : validateBookingForm;
    //console.log("Validation errors:", newErrors);

    const newErrors = validationFn();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      //console.log("Errors found, not submitting");
      return;
    }

    //console.log("No errors, submitting data");
    onSubmit({
      doctorName,
      patientName: name,
      phoneNumber,
      appointmentDate:
        location.pathname === "/instant-consultation"
          ? new Date().toLocaleDateString() // auto-fill today for instant
          : appointmentDate,
      appointmentTime:
        location.pathname === "/instant-consultation"
          ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : appointmentTime,
    });

    // Clear form
    setName("");
    setPhoneNumber("");
    setAppointmentDate("");
    setAppointmentTime("");
    setErrors({});
  };

  return (
    
      <form onSubmit={handleSubmit} className="appointment-form">
        <h3>Book Appointment</h3>

        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input className="form-control" type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input className="form-control" type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Enter 10-digit mobile number" />
          {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
        </div>
        
        {location.pathname !== "/instant-consultation" && (
        <>
          <div className="form-group">
            <label htmlFor="appointmentDate">Appointment Date:</label>
            <input className="form-control" type="date" id="appointmentDate" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
            {errors.appointmentDate && (
              <span className="error-text">{errors.appointmentDate}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="appointmentTime">Time Slot:</label>
            <select
              id="appointmentTime"
              className="form-control"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}            
            >
              <option value="">-- Select a Time Slot --</option>
              {timeSlots.map((slot, index) => (
                <option key={index} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {errors.appointmentTime && (
              <span className="error-text">{errors.appointmentTime}</span>
            )}
          </div>
            </>
        )}

        <button type="submit" className="btn btn-primary">Book Now</button>
      </form>
   
  );
};

export default AppointmentForm;
