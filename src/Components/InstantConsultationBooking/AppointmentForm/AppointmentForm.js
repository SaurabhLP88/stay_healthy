import React, { useState } from "react";
import { useLocation } from "react-router-dom";
//import { API_URL } from "../../../config";
import "./AppointmentForm.css";

const AppointmentForm = ({ doctorId, doctorName, doctorSpeciality, onSubmit }) => {
  //console.log("AppointmentForm.js Loaded");

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

  const isWithinInstantHours = () => {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();

    const currentTime = hour * 60 + minutes; // convert to minutes

    const start = 9 * 60;       // 9:00 AM → 540 minutes
    const end = 17 * 60 + 30;   // 5:30 PM → 1050 minutes

    return currentTime >= start && currentTime <= end;
  };

  const getFilteredTimeSlots = () => {
    if (!appointmentDate) return timeSlots;

    const today = new Date().toISOString().split("T")[0];
    if (appointmentDate !== today) return timeSlots;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return timeSlots.filter((slot) => {
      const [start] = slot.split(" - ");
      let [time, modifier] = start.split(" ");

      let [hours, minutes] = time.split(":");
      hours = parseInt(hours);
      minutes = parseInt(minutes);

      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      const slotMinutes = hours * 60 + minutes;

      return slotMinutes >= currentMinutes; // keep only future slots
    });
  };

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

  const handleSubmit =  async (e) => {
    e.preventDefault();

    console.log("Form submitted");

    if (location.pathname === "/instant-consultation") {
      if (!isWithinInstantHours()) {
        alert("You can’t book an instant consultation right now. Doctors are available between 9:00 AM and 5:30 PM only.");
        return;
      }
    }

   const validationFn =
      location.pathname === "/instant-consultation"
        ? validateInstantForm
        : validateBookingForm;

    /*console.log("Using validation function:", 
      location.pathname === "/instant-consultation"
        ? "validateInstantForm"
        : "validateBookingForm"
    );*/

    const newErrors = validationFn();
    console.log("Validation result:", newErrors);

    if (Object.keys(newErrors).length > 0) {
      
      console.log("Errors found, not submitting");
      setErrors(newErrors);
      return;
    }    

    //console.log("Validation passed, preparing form data");

    const formData = {
      doctorId,
      doctorName,
      doctorSpeciality,
      patientName: name,
      phoneNumber,
      appointmentDate:
        location.pathname === "/instant-consultation"
          ? new Date().toLocaleDateString()
          : appointmentDate,
      appointmentTime:
        location.pathname === "/instant-consultation"
          ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : appointmentTime,
    };

    try {
      // If parent provided an onSubmit handler, delegate (prevent duplicate POST)
      if (onSubmit) {
        console.log("Delegating save to parent via onSubmit:", formData);
        onSubmit(formData);
      } else {
        console.log("No onSubmit prop — posting directly from AppointmentForm:", formData);
        console.warn("Appointment saved from AppointmentForm");
      }

      alert("Appointment booked successfully!");

      // Reset form
      setName("");
      setPhoneNumber("");
      setAppointmentDate("");
      setAppointmentTime("");
      setErrors({});
    } catch (err) {
      console.error("Error saving appointment:", err);
      alert("Could not save appointment, please try again.");
    }



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
            <input
              className="form-control"
              type="date"
              id="appointmentDate"
              value={appointmentDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
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
              {getFilteredTimeSlots().length === 0 ? (
                <option value="">No time slots available today</option>
              ) : (
                getFilteredTimeSlots().map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot}
                  </option>
                ))
              )}
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
