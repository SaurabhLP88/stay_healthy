import React, { useEffect, useState } from 'react';
import { API_URL } from "../../../config";
import { useNavigate, useSearchParams } from 'react-router-dom';

import FindDoctorSearch from "../FindDoctorSearch/FindDoctorSearch"; // adjust path if needed
import DoctorCard from "../DoctorCard/DoctorCard";
import "./BookingConsultation.css";

const BookingConsultation = () => {

  //const [username, setUsername] = useState("");
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isSearched, setIsSearched] = useState(false);
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  //const [bookings, setBookings] = useState([]);
  //const [notification, setNotification] = useState(null);

  //const navigate = useNavigate();

  //console.log("BookingConsultation.js Loaded");

  const speciality = searchParams.get("speciality");

  useEffect(() => {
    //console.log("BookingConsultation.js useEffect");
    getDoctorsDetails();

    if (speciality) {
      setSelectedSpeciality(speciality);
    }

  }, [searchParams, speciality]);

  /*useEffect(() => {
    fetch(`${API_URL}/api/appointments`)
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        console.log("Bookings from DB:", data);
      });
  }, []);*/

  const formatDate = (d) => {
    if (!d) return "";
    const [year, month, day] = d.split("-");
    return `${day}/${month}/${year}`;
  };

  const getDoctorsDetails = () => {
    //console.log("BookingConsultation.js getDoctorsDetails");
      //fetch('https://api.npoint.io/9a5543d36f1460da2f63')
      fetch(`${API_URL}/api/doctors`)
      .then(res => res.json())
      .then(data => {
          setDoctors(data);

          if (searchParams.get('speciality')) {
              const filtered = data.filter(
                  doctor => doctor.speciality.toLowerCase() === searchParams.get('speciality').toLowerCase()
              );
              setFilteredDoctors(filtered);
              setIsSearched(true);
          } else {
              setFilteredDoctors([]);
              setIsSearched(false);
          }
      })
      .catch(err => console.error(err));
  }
  
  const handleSearch = (searchText) => {
    //console.log("BookingConsultation.js handleSearch");
      if (!searchText) {
          setFilteredDoctors([]);
          setIsSearched(false);
      } else {
          const filtered = doctors.filter(
              doctor => doctor.speciality.toLowerCase().includes(searchText.toLowerCase())
          );
          setFilteredDoctors(filtered);
          setIsSearched(true);
      }
  };  
  
  const handleBook = async (doctor, appointmentData) => {
    console.log("Booking appointment...");

    /*const payload = {
      doctorId: doctor._id,
      doctorName: doctor.name,
      doctorSpeciality: doctor.speciality,
      ...appointmentData
    };*/

    //console.log("📤 Sending booking payload:", payload);
    const token = sessionStorage.getItem("auth-token"); // your auth-token

    //console.log("auth-token:", token);
    if (!token || token.split('.').length !== 3) {
      console.warn("auth-token is missing or not a JWT");
      // handle: force login or show message
    }

    try {      
      const notifRes = await fetch(`${API_URL}/api/notifications`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // send token in header
        },
        body: JSON.stringify({
          title: "Appointment Booked",
          message: `
              <p><b>Doctor:</b> ${doctor.name}</p>
              <p><b>Speciality:</b> ${doctor.speciality}</p>
              <p><b>Patient:</b> ${appointmentData.patientName}</p>
              <p><b>Phone:</b> ${appointmentData.phoneNumber}</p>
              <p><b>Date:</b> ${formatDate(appointmentData.appointmentDate)}</p>
              <p><b>Time:</b> ${appointmentData.appointmentTime}</p>
          `.trim()
        })
      });

      if (!notifRes.ok) {
        const t = await notifRes.text();
        console.error("❌ Notification create failed:", t);
      } else {
        const notifResJson = await notifRes.json();
        // backend returns { success: true, notify } per your route — normalize
        const created = notifResJson.notify ?? notifResJson.notification ?? notifResJson;

        //console.log("🔔 Notification created (server response normalized):", created);

        // store as fallback (so Home can read it if it missed the event)
        /*try {
          localStorage.setItem("latest_notification", JSON.stringify(created));
        } catch (err) { console.warn("localStorage set failed:", err); }*/

        // dispatch a clear, well-named event and include the created notification as detail
        window.dispatchEvent(new CustomEvent("new-notification", { detail: created }));

        console.log("📣 Dispatched new-notification event with detail");
      }


      alert(`Appointment booked for ${appointmentData.patientName} with ${doctor.name}`);

    } catch (err) {
      console.error("❌ Booking Error:", err);
    }
  };

  return (

    <div className="searchpage-container">
      <FindDoctorSearch onSearch={handleSearch} />
      <div className="search-results-container">
          {/* {isSearched ? ( */}
              <div className="search-results-cover">
                  <h2 className="search-results-title"><span style={{ color: "#2190FF" }}>{(isSearched ? filteredDoctors : doctors).length}</span> {selectedSpeciality} doctors are available</h2>                              
                    {(isSearched ? filteredDoctors : doctors).length > 0 ? (
                      <>
                        <h3 className="search-results-subtitle">Book appointments with minimum wait-time & verified doctor details</h3>      
                        <div className="doctor-results-container">
                          {(isSearched ? filteredDoctors : doctors).map((doctor, index) => {
                            const imagePath = require(`../../../assets/images/${doctor.image}`);
                            //console.log('doctor appointment:', doctor);
                            return (
                              <DoctorCard
                                  key={index}
                                  doctorId={doctor._id}
                                  name={doctor.name}
                                  speciality={doctor.speciality}
                                  experience={doctor.experience}
                                  ratings={doctor.ratings}
                                  image={imagePath}
                                  bookingType="scheduled"
                                  //onBook={(appointmentData) => handleBook(appointmentData)}
                                  onBook={(appointmentData) => handleBook(doctor, appointmentData)}
                                  //onBook={null}
                                  //setNotification={setNotification}
                              />

                              /*<DoctorCard
                                key={doctor._id || index}
                                doctor={doctor}
                                image={imagePath}
                                onBook={handleBook}
                              />*/
                            )
                          })}
                        </div>
                      </>                      
                    ) : (
                        <p className='text-center'>No doctors found for {searchParams.get('speciality')}.</p>
                    )}                  
              </div>
          {/*) : null} */}
      </div>
    


    {/* <div className="booking-consultation-page">

      <FindDoctorSearch onResults={handleSearchResults} />

      Display search results 
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

    </div>*/}
    
    </div>

  );
};

export default BookingConsultation;
