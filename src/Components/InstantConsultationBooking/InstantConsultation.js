import React, { useEffect, useState } from 'react';
import { API_URL } from "../../config";
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { sendNotification } from "../../utils/notify";
import FindDoctorSearch from './FindDoctorSearch/FindDoctorSearch';
import DoctorCard from './DoctorCard/DoctorCard';
//import Notification from "../Notification/Notification";

import './InstantConsultation.css';

const InstantConsultation = () => {
    const [searchParams] = useSearchParams();
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [isSearched, setIsSearched] = useState(false);
    const [selectedSpeciality, setSelectedSpeciality] = useState("");
    //const [bookings, setBookings] = useState([]);
    //const [notification, setNotification] = useState(null);

    //const navigate = useNavigate();
    //const location = useLocation();

    //console.log("InstantConsultation.js Loaded");

    useEffect(() => {
        getDoctorsDetails();
    }, [searchParams]);

    /*const formatDate = (d) => {
        if (!d) return "";

        // If backend sends YYYY-MM-DD
        if (d.includes("-")) {
            const [year, month, day] = d.split("-");
            return `${day}/${month}/${year}`;
        }

        // If frontend sends DD/MM/YYYY or M/D/YYYY
        if (d.includes("/")) {
            const parts = d.split("/");
            if (parts.length === 3) {
                // Indian format DD/MM/YYYY
                if (Number(parts[0]) > 12) {
                    const [day, month, year] = parts;
                    return `${day}/${month}/${year}`;
                }

                // US format M/D/YYYY  → convert
                const [month, day, year] = parts;
                return `${day}/${month}/${year}`;
            }
        }

        return d;
    };*/

    const getDoctorsDetails = () => {
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
        .catch(err => console.log(err));
    }

    const handleSearch = (searchText) => {
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
        console.log("📌 Instant booking...");

        /*const payload = {
            doctorId: doctor._id,
            doctorName: doctor.name,
            doctorSpeciality: doctor.speciality,
            ...appointmentData
        };*/

        const token = sessionStorage.getItem("auth-token");

        /*try {
            const notifRes = await fetch(`${API_URL}/api/notifications`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
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

            const notifJson = await notifRes.json();
            const created = notifJson.notify ?? notifJson.notification ?? notifJson;

            // Fire global event
            window.dispatchEvent(
            new CustomEvent("new-notification", { detail: created })
            );

            alert(`Instant Appointment booked for ${appointmentData.patientName} with ${doctor.name}`);

        } catch (err) {
            console.error("❌ Instant Booking Error:", err);
        }*/

        await sendNotification(token, doctor, appointmentData, "Appointment Booked");

    };

    /*const handleBook = (newAppointment) => {
        const doctor = {
            name: newAppointment.doctorName,
            speciality: newAppointment.doctorSpeciality
        };
        const appointmentData =
            location.pathname === "/instant-consultation"
                ? {
                    name: newAppointment.patientName,
                    phoneNumber: newAppointment.phoneNumber,
                    appointmentDate: new Date().toLocaleDateString(),
                    appointmentTime: new Date().toLocaleTimeString()
                }
                : {
                    name: newAppointment.patientName,
                    phoneNumber: newAppointment.phoneNumber,
                    appointmentDate: newAppointment.appointmentDate,
                    appointmentTime: newAppointment.appointmentTime
                };

        const notificationData = {
            title: "Appointment Details",
            message: `
                <p><b>Doctor:</b> ${doctor.name}</p>
                <p><b>Speciality:</b> ${doctor.speciality}</p>
                <p><b>Patient:</b> ${appointmentData.name}</p>
                <p><b>Phone:</b> ${appointmentData.phoneNumber}</p>
                ${
                location.pathname !== "/instant-consultation"
                    ? `
                    <p><b>Date:</b> ${appointmentData.appointmentDate}</p>
                    <p><b>Time:</b> ${appointmentData.appointmentTime}</p>
                    `
                    : ""
                }
            `.trim()
        };

        // Store notification in localStorage
        localStorage.setItem('appointmentNotification', JSON.stringify(notificationData));
        setNotification(notificationData);

        // Debug: verify all fields
        //console.log("📋 appointmentData:", appointmentData);

        // Save in state
        setBookings(prev => [...prev, { doctor, appointmentData }]);
        //console.log("✅ Booking saved:", { doctor, appointmentData });

        // Save in localStorage
        localStorage.setItem("doctorData", JSON.stringify({ name: doctor.name }));
        localStorage.setItem(doctor.name, JSON.stringify(appointmentData));
        //console.log("💾 Saved to localStorage:", doctor.name, appointmentData);

        // Trigger Notification
        window.dispatchEvent(new Event("appointmentBooked"));
        alert(`Instant Appointment booked for ${appointmentData.name} with ${doctor.name}`);        
    };*/

    /*const handleCancel = (doctor) => {
        setBookings(prev => prev.filter(b => b.doctor.name !== doctor.name));
        localStorage.removeItem(doctor.name);
        window.dispatchEvent(new Event("appointmentCancelled"));
        alert(`Appointment cancelled for ${doctor.name}`);
    };

    const isDoctorBooked = (doctor) => {
        return bookings.some(b => b.doctor.name === doctor.name);
    };*/

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
                                        const imagePath = require(`../../assets/images/${doctor.image}`);
                                        return (
                                            <DoctorCard
                                                key={index}
                                                doctorId={doctor._id}
                                                name={doctor.name}
                                                speciality={doctor.speciality}
                                                experience={doctor.experience}
                                                ratings={doctor.ratings}
                                                image={imagePath}
                                                bookingType="instant"
                                                onBook={(appointmentData) => handleBook(doctor, appointmentData)}
                                                //setNotification={setNotification}
                                            />
                                        )
                                    })}
                                </div>
                            </>
                        ) : (
                            <p className='text-center'>No doctors found for  {searchParams.get('speciality')}.</p>
                        )}
                       
                    </div>
                {/* }) : ''} */}
            </div>
        

        {/*{notification && (
            <Notification
            title={notification.title}
            message={notification.message}
            onClose={() => setNotification(null)}
            />
        )}*/}
        </div>
    )
}

export default InstantConsultation;
