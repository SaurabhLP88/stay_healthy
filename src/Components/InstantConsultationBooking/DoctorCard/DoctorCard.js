import React, { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { API_URL } from '../../../config';
//import { v4 as uuidv4 } from 'uuid';

import AppointmentForm from '../AppointmentForm/AppointmentForm';

import 'reactjs-popup/dist/index.css';
import './DoctorCard.css';

//import picture from '../../../assets/images/doctor1.png';

const DoctorCard = ({ doctorId, image, name, speciality, experience, ratings, onBook, bookingType }) => {

  //console.log("Doctor Set Loaded");
  //console.log("DoctorCard props:", { image, name, speciality, experience, ratings, onBook });

  const [showModal, setShowModal] = useState(false);
  //const [doctor, setDoctor] = useState(null);
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

        const doctorAppointments = data.filter(
          (a) => a.doctorName === name && a.doctorSpeciality === speciality
        );
        setAppointments(doctorAppointments);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      }
    };

    fetchAppointments();
 }, [name, speciality]);

  useEffect(() => {
    if (appointments.length === 0) {
      //window.dispatchEvent(new Event("notification-deleted"));
    }
  }, [appointments]);

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
    setShowModal(true);
    //console.log("Current appointments state:", appointments);
    
    /*if (appointments.length > 0) {
      setAppointments([]);
      //localStorage.removeItem(storageKey);
      //localStorage.removeItem('appointmentNotification');
      //localStorage.removeItem('doctorData');
      //localStorage.removeItem('name');
      //window.dispatchEvent(new Event("appointmentCancelled"));    
      setShowModal(false);  // Don't open modal, just close
    } else {
      // If no appointment (Book Appointment button), open the modal to book
      setShowModal(true);
    }*/
    //console.log("Book/Cancel button clicked");
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
        setAppointments(prev => prev.filter(a => a._id !== appointmentId));
        window.dispatchEvent(new Event("notification-deleted"));
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
    console.log("Submitting appointment for doctorId:", doctorId);
    const token = sessionStorage.getItem("auth-token");
    if (!token) return alert("Please login first");

    try {

      /*const safeData = {
        doctorName: name,
        doctorSpeciality: speciality,
        patientName: appointmentData.patientName,
        phoneNumber: appointmentData.phoneNumber,
        appointmentDate: appointmentData.appointmentDate,
        appointmentTime: appointmentData.appointmentTime,
      };*/

      const payload = {
        doctorId,
        doctorName: name,
        doctorSpeciality: speciality,
        bookingType: bookingType || "scheduled",
        ...appointmentData
      };

      const res = await fetch(`${API_URL}/api/appointments/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (res.ok) {
        setAppointments([result.appointment]); // update state
        //alert(`Appointment booked successfully with ${name}`);
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

  const activeAppointment = appointments[0] || null;
  const apptStatus = activeAppointment?.status?.toLowerCase();
  const isBooked = apptStatus === "booked";
  const isExpired = apptStatus === "expired";

  return (
    <div className="w-full border border-gray-300 rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.03] transition-all duration-300">

      {/* Doctor Details */}
      <div className="p-3 md:p-5">
        <div className="text-center mb-3">
          <img
            src={image}
            alt="Instant Consultation"
            className="size-32 md:size-48 rounded-full border-2 border-indigo-600 mx-auto object-cover"
          />
        </div>

        <div className="text-center">
          <div className="text-lg font-bold mb-1">{name}</div>
          <div className="text-base text-gray-700 mb-1">{speciality}</div>
          <div className="text-sm font-semibold text-gray-500 mb-1">
            {experience} years experience
          </div>
          <div className="text-sm font-semibold mb-1">
            Ratings: <span className='block md:inline'>{starRating || "0"}</span>
          </div>
        </div>
      </div>

      {/* Book Button */}
      <div className="p-0">
        <Popup
          trigger={
            <button
              className={`w-full px-1 md:px-4 py-3 text-white font-semibold rounded-b-md transition ${
                isBooked
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={handleBookingClick}
            >
              {isBooked && <div>Cancel Appointment</div>}
              {isExpired && <div>Book Again</div>}
              {!isBooked && !isExpired && <div>Book Appointment</div>}
              <div className="text-xs opacity-90">No Booking Fee</div>
            </button>
          }
          className="my-popup"
          contentClass="my-popup-content"
          overlayClass="my-popup-overlay"
          modal
          open={showModal}
          onClose={() => setShowModal(false)}
        >
          {(close) => (
            <div className="max-h-[90vh] overflow-auto p-0">

              <button
                className="md:hidden absolute top-3 right-3 text-gray-700 text-3xl"
                onClick={close}
              >
                ×
              </button>

              {/* Doctor details inside popup */}
              <div className="p-4 flex flex-col items-center border-b border-gray-200 mb-5">
                <img
                  src={image}
                  alt="Instant Consultation"
                  className="size-32 object-contain mb-3"
                />
                <div className="text-center">
                  <div className="text-lg font-bold mb-1">{name}</div>
                  <div className="text-base text-gray-700 mb-1">{speciality}</div>
                  <div className="text-sm font-semibold text-gray-500 mb-1">
                    {experience} years experience
                  </div>
                  <div className="text-sm font-semibold mb-1">
                    Ratings: {starRating || "0"}
                  </div>
                </div>
              </div>

              {/* Booked State */}
              {isBooked ? (
                <div className="max-w-md mx-auto mt-4 p-4 bg-white shadow rounded-md">
                  <h3 className="text-xl font-bold text-blue-600 text-center mb-4">
                    Appointment Booked!
                  </h3>

                  {appointments.map((appointment) => (
                    <div key={appointment._id} className="mb-4 border-b pb-3">
                      <p><strong>Name:</strong> {appointment.patientName}</p>
                      <p><strong>Phone Number:</strong> {appointment.phoneNumber}</p>
                      <p><strong>Date of Appointment:</strong> {appointment.appointmentDate}</p>
                      <p><strong>Time Slot:</strong> {appointment.appointmentTime}</p>

                      <button
                        className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                        onClick={() => handleCancel(appointment._id, close)}
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <AppointmentForm
                  doctorId={doctorId}
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

    </div>

  );
};

export default DoctorCard;
