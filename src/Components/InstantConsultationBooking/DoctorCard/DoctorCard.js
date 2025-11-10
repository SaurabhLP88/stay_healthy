import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { v4 as uuidv4 } from 'uuid';

import AppointmentForm from '../AppointmentForm/AppointmentForm';

import 'reactjs-popup/dist/index.css';
import './DoctorCard.css';

import picture from '../../../assets/images/doctor1.png';

const DoctorCard = ({ name, speciality, experience, ratings, onBook }) => {
  const [showModal, setShowModal] = useState(false);
  const storageKey = `appointment_${name}_${speciality}`;
  const [appointments, setAppointments] = useState(() => {
      // Debug: Check what's in localStorage
      const savedAppointment = localStorage.getItem(storageKey);
      //console.log(`Initializing appointments for ${name}:`, savedAppointment);
      try {
          return savedAppointment ? [JSON.parse(savedAppointment)] : [];
      } catch (error) {
          console.error('Error parsing saved appointment:', error);
          return [];
      }
  });

  console.log("Doctor Set Loaded");

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
    
    if (appointments && appointments.length > 0) {
      setAppointments([]);
      localStorage.removeItem(storageKey);
      localStorage.removeItem('appointmentNotification');
      localStorage.removeItem('doctorData');
      localStorage.removeItem('name');
      window.dispatchEvent(new Event("appointmentCancelled"));
      setShowModal(false);  // Don't open modal, just close
    } else {
      // If no appointment (Book Appointment button), open the modal to book
      setShowModal(true);
    }    
  };

  const handleCancel = () => {
    /*const updatedAppointments = appointments.filter((appointment) => appointment.id !== appointmentId);
    setAppointments(updatedAppointments);*/

    setAppointments([]);
    // Remove from localStorage
    localStorage.removeItem(storageKey);
    localStorage.removeItem('appointmentNotification');
    localStorage.removeItem('doctorData');
    localStorage.removeItem('name');
    // You might want to trigger some parent callback here
    window.dispatchEvent(new Event("appointmentCancelled"));

  };

  const handleFormSubmit = (appointmentData) => {
    const newAppointment = {
      id: uuidv4(),
      doctorName: name,
      doctorSpeciality: speciality,
      ...appointmentData,
    };

    // Call parent onBook function to save booking globally & trigger notification
    if (onBook) {
      onBook(newAppointment);
    }
    //console.log('Saving new appointment:', newAppointment);

    localStorage.setItem(storageKey, JSON.stringify(newAppointment));
    setAppointments([newAppointment]);

    //console.log(`Verification - appointment in localStorage:`, localStorage.getItem(storageKey));

    setShowModal(false);
    //alert(`Appointment booked successfully with Dr. ${name}`);

    /*setNotification({
      title: "Appointment Details",
      message: `
        Doctor: ${name}
        Speciality: ${speciality}
        Patient: ${appointmentData.patientName}
        Phone: ${appointmentData.phoneNumber}
        Date: ${appointmentData.appointmentDate}
        Time: ${appointmentData.appointmentTime}
      `,
    });*/

    
  };

  return (
    <div className="doctor-card-container">
      <div className="doctor-card-details-container">
        <div className="doctor-card-profile-image-container">
          <img src={picture} alt="Instant Consultation" />
        </div>
        <div className="doctor-card-details">
          <div className="doctor-card-detail-name">{name}</div>
          <div className="doctor-card-detail-speciality">{speciality}</div>
          <div className="doctor-card-detail-experience">{experience} years experience</div>
          <div className="doctor-card-detail-consultationfees">Ratings: {ratings}</div>
        </div>
      </div>

      <div className="doctor-card-options-container">
        <Popup
          trigger={            

            <button className={`btn btn-primary book-appointment-btn ${ appointments && appointments.length > 0 ? 'cancel-appointment' : ''}`}  onClick={handleBookingClick}>
              {appointments && appointments.length > 0 ? (
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
                  <img src={picture} alt="Instant Consultation" />
                </div>
                <div className="doctor-card-details">
                  <div className="doctor-card-detail-name">{name}</div>
                  <div className="doctor-card-detail-speciality">{speciality}</div>
                  <div className="doctor-card-detail-experience">{experience} years experience</div>
                  <div className="doctor-card-detail-consultationfees">Ratings: {ratings}</div>
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
                        <button className='btn btn-primary' onClick={() => handleCancel(appointment.id)}>Cancel Appointment</button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <AppointmentForm
                  doctorName={name}
                  doctorSpeciality={speciality}
                  onSubmit={(data) => {
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
