import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { FaSearch, FaUserMd } from 'react-icons/fa';

import './FindDoctorSearch.css';

import instant from '../../../assets/images/instant.svg';

const initSpeciality = [
    'Dentist', 'Gynecologist/obstetrician', 'General Physician', 'Dermatologist', 'Ear-nose-throat (ent) Specialist', 'Homeopath', 'Ayurveda'
]

const FindDoctorSearch = () => {

    console.log("FindDoctorSearch.js Loaded");

    const [doctorResultHidden, setDoctorResultHidden] = useState(true);
    const [searchDoctor, setSearchDoctor] = useState('');
    const [specialities, setSpecialities] = useState(initSpeciality);
    const navigate = useNavigate();
    const handleDoctorSelect = (speciality) => {
        setSearchDoctor(speciality);
        setDoctorResultHidden(true);
        navigate(`/instant-consultation?speciality=${speciality}`);
        window.location.reload();
    }
    return (
        <div className="finddoctor">
            <h1 className="finddoctor-title">Find a doctor at your own ease</h1>
            
            {window.location.pathname !== "/instant-consultation" && (
                <div className="doctor-image">
                    <img src={instant} alt="Instant Consultation" />
                </div>
            )}        

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