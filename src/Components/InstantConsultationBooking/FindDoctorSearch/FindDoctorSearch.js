import React, { useState } from 'react';
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { FaSearch, FaUserMd } from 'react-icons/fa';

import './FindDoctorSearch.css';

import instant from '../../../assets/images/instant.svg';
import book from "../../../assets/images/book.svg";
import doctor from "../../../assets/images/self.svg";

const initSpeciality = [
    'Dentist', 'Gynecologist/obstetrician', 'General Physician', 'Dermatologist', 'Ear-nose-throat (ent) Specialist', 'Homeopath', 'Ayurveda'
]

const FindDoctorSearch = () => {

    console.log("FindDoctorSearch.js Loaded");

    const [doctorResultHidden, setDoctorResultHidden] = useState(true);
    const [searchDoctor, setSearchDoctor] = useState('');
    const [specialities, setSpecialities] = useState(initSpeciality);
    const navigate = useNavigate();
    const location = useLocation();

    const handleDoctorSelect = (speciality) => {
        setSearchDoctor(speciality);
        setDoctorResultHidden(true);

        if (location.pathname === "/instant-consultation") {
            navigate(`/instant-consultation?speciality=${speciality}`);
        } else if (location.pathname === "/book-consultation") {
            navigate(`/book-consultation?speciality=${speciality}`);
        } else {  }

        window.location.reload();
    }
    return (
        <div className="finddoctor">
            <h1 className="finddoctor-title">
                {location.pathname === "/instant-consultation"
                    ? "Instant Consultation — Connect with a Doctor Now"
                    : location.pathname === "/book-consultation"
                    ? "Book an Appointment with Your Preferred Doctor"
                    : "Find a Doctor at Your Own Ease"}
            </h1>            
            
            <div className="doctor-image">
                {location.pathname === "/instant-consultation" ? (
                <img src={instant} alt="Instant Consultation" />
                ) : location.pathname === "/book-consultation" ? (
                <img src={book} alt="Book an Appointment" />
                ) : (
                <img src={doctor} alt="Instant Consultation" />
                )}
            </div>

            <div className="home-search-container">
                <div className="doctor-search-box">
                <input
                    type="text"
                    className="search-doctor-input-box"
                    placeholder="Search doctors by speciality"
                    onFocus={() => setDoctorResultHidden(false)}
                    onBlur={() => setDoctorResultHidden(true)}
                    value={searchDoctor}
                    onChange={(e) => setSearchDoctor(e.target.value)}
                />

                <div className="findiconimg">
                    <FaSearch className="findicon" />
                </div>

                <div className="search-doctor-input-results" hidden={doctorResultHidden}>
                    {specialities.map((speciality) => (
                    <div
                        className="search-doctor-result-item"
                        key={speciality}
                        onMouseDown={() => handleDoctorSelect(speciality)}
                    >
                        <span className="result-icon"><FaUserMd /></span>
                        <span className="result-name">{speciality}</span>
                        <span className="result-type">Speciality</span>
                    </div>
                    ))}
                </div>

                </div>
            </div>
        </div>
    )
}

export default FindDoctorSearch