import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import FindDoctorSearch from './FindDoctorSearch/FindDoctorSearch';
import DoctorCard from './DoctorCard/DoctorCard';
//import Notification from "../Notification/Notification";

import './InstantConsultation.css';

const InstantConsultation = () => {
    const [searchParams] = useSearchParams();
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [isSearched, setIsSearched] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [notification, setNotification] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    console.log("InstantConsultation.js Loaded");

    useEffect(() => {
        getDoctorsDetails();
    }, [searchParams]);

    const getDoctorsDetails = () => {
        fetch('https://api.npoint.io/9a5543d36f1460da2f63')
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


    const handleBook = (newAppointment) => {
        //console.log("handleBook called with:", doctor);
        //const patientName = sessionStorage.getItem("email");
        //console.log("patientName:", patientName);

        const doctor = {
            name: newAppointment.doctorName,
            speciality: newAppointment.doctorSpeciality
        };

        /*const {
            patientName = sessionStorage.getItem("name"),
            phoneNumber = sessionStorage.getItem("phoneNumber"),
            appointmentDate = new Date().toLocaleDateString(),
            appointmentTime = new Date().toLocaleTimeString()
        } = newAppointment || {}; // safeguard if undefined

        const patientName = sessionStorage.getItem("email") || "Anonymous";
        const appointmentData = {
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            patientName
        };*/     
        
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

        /*setNotification({
            title: "Appointment Details",
            message: `
                <p><b>Doctor:</b> ${doctor.name}</p>
                <p><b>Speciality:</b> ${doctor.speciality}</p>
                <p><b>Patient:</b> ${appointmentData.name}</p>
                <p><b>Phone:</b> ${appointmentData.phoneNumber}</p>
                <p><b>Date:</b> ${appointmentData.appointmentDate}</p>
                <p><b>Time:</b> ${appointmentData.appointmentTime}</p>
            `.trim()
        });*/

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

        /*console.log("🔔 Notification set:", {
            title: "Appointment Details",
            ...appointmentData
        });*/

        alert(`Appointment booked for ${appointmentData.name} with ${doctor.name}`);
    };

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
                {isSearched ? (
                    <div className="search-results-cover">
                        <h2 className="search-results-title">{filteredDoctors.length} doctors are available {searchParams.get('location')}</h2>
                        <h3 className="search-results-subtitle">Book appointments with minimum wait-time & verified doctor details</h3>
                        <div className="doctor-results-container">
                            {filteredDoctors.length > 0 ? (
                                filteredDoctors.map(doctor => (
                                    <DoctorCard
                                        key={doctor.name}
                                        name={doctor.name}
                                        speciality={doctor.speciality}
                                        experience={doctor.experience}
                                        ratings={doctor.ratings}
                                        image={doctor.image}
                                        onBook={(appointmentData) => handleBook(appointmentData)}
                                        setNotification={setNotification}
                                    />
                                ))
                            ) : (
                                <p>No doctors found.</p>
                            )}
                        </div>
                    </div>
                ) : ''}
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
