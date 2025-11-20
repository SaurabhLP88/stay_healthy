import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { API_URL } from '../../../config';
//import { v4 as uuidv4 } from 'uuid';

import AppointmentForm from '../AppointmentForm/AppointmentForm';

import 'reactjs-popup/dist/index.css';
import './DoctorCard.css';

//import picture from '../../../assets/images/doctor1.png';

const DoctorCard = ({ image, name, speciality, experience, ratings, onBook }) => {

  //console.log("Doctor Set Loaded");
  //console.log("DoctorCard props:", { image, name, speciality, experience, ratings, onBook });

  const [showModal, setShowModal] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const starRating = "⭐".repeat(ratings);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = sessionStorage.getItem("auth-token");
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/api/appointments/my`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
          console.error("Failed to fetch appointments:", res.status, res.statusText);
          return;
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          console.error("Expected JSON, got:", contentType);
          return;
        }

        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      }
    };

    fetchAppointments();
  }, []);

  /*useEffect(() => {
    // Check localStorage on mount and when appointments change
    const savedAppointment = localStorage.getItem(storageKey);
    console.log('Current localStorage state:', {
      key: storageKey,
      value: savedAppointment,
      parsedValue: savedAppointment ? JSON.parse(savedAppointment) : null,
      appointmentsState: appointments
    });
  }, [name, speciality, appointments]);*/

  const handleBookingClick = () => {
    
    if (appointments.length > 0) {
      setAppointments([]);
      /*localStorage.removeItem(storageKey);
      localStorage.removeItem('appointmentNotification');
      localStorage.removeItem('doctorData');
      localStorage.removeItem('name');
      window.dispatchEvent(new Event("appointmentCancelled"));*/      
      setShowModal(false);  // Don't open modal, just close
    } else {
      // If no appointment (Book Appointment button), open the modal to book
      setShowModal(true);
    }
    //console.log("Book/Cancel button clicked");
    console.log("Current appointments state:", appointments);
    //console.log("Local storage:", localStorage.getItem(storageKey));
  };

  const handleCancel = async (appointmentId, close) => {
    const token = sessionStorage.getItem("auth-token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/appointments/cancel/${appointmentId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await res.json();
      if (res.ok) {
        setAppointments([]); // update state after cancel
        window.dispatchEvent(new Event("appointmentCancelled"));
        if (close) close();
      } else {
        console.error(result.error);
        alert("Failed to cancel appointment");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const handleFormSubmit = async (appointmentData) => {
    const token = sessionStorage.getItem("auth-token");
    if (!token) return alert("Please login first");

    try {
      const res = await fetch(`${API_URL}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          //id: uuidv4(),
          doctorName: name,
          doctorSpeciality: speciality,
          ...appointmentData,
        })
      });

      const result = await res.json();
      if (res.ok) {
        setAppointments([result.appointment]); // update state
        alert(`Appointment booked successfully with Dr. ${name}`);
        if (onBook) onBook(result.appointment); // trigger parent callback
      } else {
        console.error(result.error);
        alert("Failed to book appointment");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="doctor-card-container">
      <div className="doctor-card-details-container">
        <div className="doctor-card-profile-image-container">
          <img src={image} alt="Instant Consultation" />
        </div>
        <div className="doctor-card-details">
          <div className="doctor-card-detail-name">{name}</div>
          <div className="doctor-card-detail-speciality">{speciality}</div>
          <div className="doctor-card-detail-experience">{experience} years experience</div>
          <div className="doctor-card-detail-consultationfees">Ratings: {starRating}</div>
        </div>
      </div>

      <div className="doctor-card-options-container">
        <Popup
          trigger={            

            <button className={`btn btn-primary book-appointment-btn ${ appointments.length > 0 ? 'cancel-appointment' : ''}`}  onClick={handleBookingClick}>
              {appointments.length > 0 ? (
                <div>Cancel Appointment</div>
              ) : (
                <div>Book Appointment</div>
              )}
              <div>No Booking Fee</div>
            </button>

          }
          modal
          open={showModal}
          onClose={() => setShowModal(false)}
        >
          {(close) => (
            <div className="appointment-main">
              <div className="doctor-card-details-container">
                <div className="doctor-card-profile-image-container">
                  <img src={image} alt="Instant Consultation" />
                </div>
                <div className="doctor-card-details">
                  <div className="doctor-card-detail-name">{name}</div>
                  <div className="doctor-card-detail-speciality">{speciality}</div>
                  <div className="doctor-card-detail-experience">{experience} years experience</div>
                  <div className="doctor-card-detail-consultationfees">Ratings: {starRating}</div>
                </div>
              </div>             

              {appointments.length > 0 ? (
                <>
                  <div className='appointment-confirmation'>
                    <h3>Appointment Booked!</h3>
                    {appointments.map((appointment) => (
                      <div className="bookedInfo" key={appointment.id}>
                        <p><strong>Name:</strong> {appointment.patientName}</p>
                        <p><strong>Phone Number:</strong> {appointment.phoneNumber}</p>
                        <p><strong>Date of Appointment:</strong> {appointment.appointmentDate}</p>
                        <p><strong>Time Slot:</strong> {appointment.appointmentTime}</p>
                        <button className='btn btn-primary' onClick={() => handleCancel(appointment.id, close)}>Cancel Appointment</button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <AppointmentForm
                  doctorName={name}
                  doctorSpeciality={speciality}
                  onSubmit={(data) => { 
                    console.log("handleFormSubmit:", data);
                    handleFormSubmit(data);
                    close();
                  }}
                />
              )}
            </div>            
          )}
        </Popup>
      </div>


      {/*
      {notification && (
        <Notification
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      */}

    </div>
  );
};

export default DoctorCard;
