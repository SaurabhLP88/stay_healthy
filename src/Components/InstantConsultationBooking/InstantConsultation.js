import React, { useEffect, useState } from 'react';
import './InstantConsultation.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FindDoctorSearch from './FindDoctorSearch/FindDoctorSearch';
import DoctorCard from './DoctorCard/DoctorCard';

const InstantConsultation = () => {
    const [searchParams] = useSearchParams();
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [isSearched, setIsSearched] = useState(false);
    const [bookings, setBookings] = useState([]);

    const navigate = useNavigate();

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

    const handleBook = (doctor) => {
        const patientName = sessionStorage.getItem("email") || "Anonymous";

        const appointmentData = {
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            patientName
        };

        // Save in state
        setBookings(prev => [...prev, { doctor, appointmentData }]);

        // Save in localStorage
        localStorage.setItem("doctorData", JSON.stringify({ name: doctor.name }));
        localStorage.setItem(doctor.name, JSON.stringify(appointmentData));

        // Trigger Notification component
        window.dispatchEvent(new Event("appointmentBooked"));

        alert(`Appointment booked for ${patientName} with Dr. ${doctor.name}`);
    };

    const handleCancel = (doctor) => {
        setBookings(prev => prev.filter(b => b.doctor.name !== doctor.name));
        localStorage.removeItem(doctor.name);
        window.dispatchEvent(new Event("appointmentCancelled"));
        alert(`Appointment cancelled for Dr. ${doctor.name}`);
    };

    const isDoctorBooked = (doctor) => {
        return bookings.some(b => b.doctor.name === doctor.name);
    };

    return (
        <center>
            <div className="searchpage-container">
                <FindDoctorSearch onSearch={handleSearch} />
                <div className="search-results-container">
                    {isSearched ? (
                        <div className="search-results-cover">
                            <h2 className="search-results-title">{filteredDoctors.length} doctors are available {searchParams.get('location')}</h2>
                            <h3 className="search-results-subtitle">Book appointments with minimum wait-time & verified doctor details</h3>
                            {filteredDoctors.length > 0 ? (
                                filteredDoctors.map(doctor => (
                                    <DoctorCard
                                        key={doctor.name}
                                        name={doctor.name}
                                        speciality={doctor.speciality}
                                        experience={doctor.experience}
                                        ratings={doctor.ratings}
                                        image={doctor.image}
                                        onBook={() => handleBook(doctor)}
                                    />
                                ))
                            ) : (
                                <p>No doctors found.</p>
                            )}
                        </div>
                    ) : ''}
                </div>
            </div>
        </center>
    )
}

export default InstantConsultation;
