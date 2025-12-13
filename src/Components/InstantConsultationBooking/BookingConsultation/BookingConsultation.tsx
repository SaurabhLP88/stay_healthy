import React, { useEffect, useState } from 'react';
import { API_URL } from "../../../config";
import { useSearchParams } from 'react-router-dom';
import { sendNotification } from "../../../utils/notify";
import FindDoctorSearch from "../FindDoctorSearch/FindDoctorSearch"; // adjust path if needed
import DoctorCard from "../DoctorCard/DoctorCard";
import "./BookingConsultation.css";

interface Doctor {
  _id: string;
  name: string;
  speciality: string;
  experience: number;
  ratings: number;
  image: string;
}

interface AppointmentData {
  patientName: string;
  phoneNumber: string;
  appointmentDate: string;
  appointmentTime: string;
}

const BookingConsultation = () => {

  //const [username, setUsername] = useState("");
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  //const [bookings, setBookings] = useState([]);
  //const [notification, setNotification] = useState(null);

  //const navigate = useNavigate();

  //console.log("BookingConsultation.js Loaded");

  const speciality = searchParams.get("speciality");

  useEffect(() => {

    const getDoctorsDetails = () => {
      //console.log("BookingConsultation.js getDoctorsDetails");
      //fetch('https://api.npoint.io/9a5543d36f1460da2f63')
      fetch(`${API_URL}/api/doctors`)
      .then(res => res.json())
      .then((data: Doctor[]) => {
          setDoctors(data);
          const specialityParam = searchParams.get("speciality");
          if (specialityParam) {
            const filtered = data.filter(
              doctor =>
                doctor.speciality.toLowerCase() === specialityParam.toLowerCase()
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
  }, []);

  const formatDate = (d) => {
    if (!d) return "";
    const [year, month, day] = d.split("-");
    return `${day}/${month}/${year}`;
  };*/  
  
  const handleSearch = (searchText: string) => {
    //console.log("BookingConsultation.js handleSearch");
      if (!searchText) {
          setFilteredDoctors([]);
          setIsSearched(false);
      } else {
          const lower = searchText.toLowerCase();
          const filtered = doctors.filter((doctor) =>
            doctor.name.toLowerCase().includes(lower) ||
            doctor.speciality.toLowerCase().includes(lower)
          );
          setFilteredDoctors(filtered);
          setIsSearched(true);
      }
  };  
  
  const handleBook = async (
    doctor: Doctor,
    appointmentData: AppointmentData
  ) => {
    console.log("Booking appointment...");

    /*const payload = {
      doctorId: doctor._id,
      doctorName: doctor.name,
      doctorSpeciality: doctor.speciality,
      ...appointmentData
    };*/

    //console.log("📤 Sending booking payload:", payload);
    const token = sessionStorage.getItem("auth-token"); // your auth-token
    if (!token) {
      console.warn("Auth token missing. User may not be logged in.");
      return;
    }

    //console.log("auth-token:", token);
    /*if (!token || token.split('.').length !== 3) {
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

        // dispatch a clear, well-named event and include the created notification as detail
        window.dispatchEvent(new CustomEvent("new-notification", { detail: created }));

        console.log("📣 Dispatched new-notification event with detail");
      }

      alert(`Appointment booked for ${appointmentData.patientName} with ${doctor.name}`);

    } catch (err) {
      console.error("❌ Booking Error:", err);
    }*/

    await sendNotification(token, doctor, appointmentData, "Appointment Booked");

  };

  return (

    <div className="text-gray-700">

      <FindDoctorSearch onSearch={handleSearch} />

      <div className="mt-6">
        <div className="max-w-5xl mx-auto">

          <h2 className="text-2xl font-bold text-center mb-2">
            <span className="text-blue-600">
              {(isSearched ? filteredDoctors : doctors).length}
            </span>
            {" "}
            {selectedSpeciality} doctors are available
          </h2>

          {(isSearched ? filteredDoctors : doctors).length > 0 ? (
            <>
              <h3 className="text-center text-gray-600 mb-6 text-sm">
                Book appointments with minimum wait-time & verified doctor details
              </h3>

              <div className="grid gap-3 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-8xl mx-auto">
                {(isSearched ? filteredDoctors : doctors).map((doctor, index) => {
                  const imagePath = require(`../../../assets/images/${doctor.image}`) as string;
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
                      onBook={(appointmentData) => handleBook(doctor, appointmentData)}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600 text-sm mt-4">
              No doctors found for {searchParams.get("speciality")}.
            </p>
          )}

        </div>
      </div>

    </div>


  );
};

export default BookingConsultation;
