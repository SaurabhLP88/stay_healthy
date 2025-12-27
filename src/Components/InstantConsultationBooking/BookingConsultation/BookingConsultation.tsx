import React, { useEffect, useState } from 'react';
import { API_URL } from "../../../config";
import { useSearchParams } from 'react-router-dom';
import { sendNotification } from "../../../utils/notify";

import Loader from "../../Loader/Loader";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  //const [bookings, setBookings] = useState([]);
  //const [notification, setNotification] = useState(null);

  //const navigate = useNavigate();

  //console.log("BookingConsultation.js Loaded");

  useEffect(() => {
    setError("");
    setLoading(true);

    const getDoctorsDetails = async () => {
      try {
        const res = await fetch(`${API_URL}/api/doctors`);
        const data: Doctor[] = await res.json();

        setDoctors(data);

        const specialityParam = searchParams.get("speciality");
        if (specialityParam) {
          const filtered = data.filter(
            doctor =>
              doctor.speciality.toLowerCase() === specialityParam.toLowerCase()
          );
          setFilteredDoctors(filtered);
          setIsSearched(true);
          setSelectedSpeciality(specialityParam);
        } else {
          setFilteredDoctors([]);
          setIsSearched(false);
          setSelectedSpeciality("");
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getDoctorsDetails();
  }, [searchParams]);

  
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
    const token = sessionStorage.getItem("auth-token"); // your auth-token
    if (!token) {
      console.warn("Auth token missing. User may not be logged in.");
      return;
    }
    await sendNotification(token, doctor, appointmentData, "Appointment Booked");
  };

  const list = isSearched ? filteredDoctors : doctors;

  return (

    <div className="text-gray-700">

      <FindDoctorSearch onSearch={handleSearch} />

      <div className="mt-6">
        <div className="max-w-5xl mx-auto">

          <h2 className="text-2xl font-bold text-center mb-2">
              <span className="text-blue-500">{(isSearched ? filteredDoctors : doctors).length}</span> {selectedSpeciality} doctors are available
          </h2>

          <h3 className="text-center text-gray-600 mb-6 text-sm">
            Book appointments with minimum wait-time & verified doctor details
          </h3>

          {loading ? (
            <div className="col-span-full flex justify-center py-10">
              <Loader text="Loading Doctors..." />
            </div>
          ) : error ? (
            <div className="col-span-full text-center text-red-600 font-semibold p-3">
              {error}
            </div>
          ) : list.length === 0 ? (
            <p className="col-span-full text-center text-gray-600 text-sm mt-4">
                No doctors found for {searchParams.get("speciality")}.
            </p>
          ) : (

            <div className="grid gap-3 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-8xl mx-auto">
              {list.map((doctor) => {
                const imagePath = require(
                  `../../../assets/images/${doctor.image}`
                ) as string;

                return (
                  <DoctorCard
                    key={doctor._id}
                    doctorId={doctor._id}
                    name={doctor.name}
                    speciality={doctor.speciality}
                    experience={doctor.experience}
                    ratings={doctor.ratings}
                    image={imagePath}
                    bookingType="scheduled"
                    onBook={(appointmentData) =>
                      handleBook(doctor, appointmentData)
                    }
                  />
                );
              })}              
            </div>
          )}
          </div>        
      </div>
    </div>
  );
};

export default BookingConsultation;
