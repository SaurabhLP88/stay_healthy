import{ useEffect, useState } from 'react';
import { API_URL } from "../../../config";
import { useSearchParams } from 'react-router-dom';
import { sendNotification } from "../../../utils/notify";
import FindDoctorSearch from '../FindDoctorSearch/FindDoctorSearch';
import DoctorCard from '../DoctorCard/DoctorCard';
//import Notification from "../Notification/Notification";

import './InstantConsultation.css';

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

const InstantConsultation = () => {
    const [searchParams] = useSearchParams();

    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
    const [isSearched, setIsSearched] = useState<boolean>(false);
    const [selectedSpeciality] = useState<string>("");
    //const [bookings, setBookings] = useState([]);
    //const [notification, setNotification] = useState(null);

    //const navigate = useNavigate();
    //const location = useLocation();

    //console.log("InstantConsultation.js Loaded");

    useEffect(() => {
        const getDoctorsDetails = async () => {
            try {
            const res = await fetch(`${API_URL}/api/doctors`);
            const data: Doctor[] = await res.json();

            setDoctors(data);

            const speciality = searchParams.get("speciality");
            if (speciality) {
                const filtered = data.filter(
                (doctor) =>
                    doctor.speciality.toLowerCase() === speciality.toLowerCase()
                );
                setFilteredDoctors(filtered);
                setIsSearched(true);
            } else {
                setFilteredDoctors([]);
                setIsSearched(false);
            }
            } catch (err) {
            console.error("Error fetching doctors:", err);
            }
        };

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

    const handleSearch = (searchText: string) => {
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
        console.log("📌 Instant booking...");

        const token = sessionStorage.getItem("auth-token");
        if (!token) return;

        await sendNotification(
        token,
        doctor,
        appointmentData,
        "Appointment Booked"
        );
    };

    const list = isSearched ? filteredDoctors : doctors;

    return (
        <div className="text-gray-700">
            <FindDoctorSearch onSearch={handleSearch} />
            <div className="mt-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-center mb-2"><span className="text-blue-500">{(isSearched ? filteredDoctors : doctors).length}</span> {selectedSpeciality} doctors are available</h2>
                                            
                    {(isSearched ? filteredDoctors : doctors).length > 0 ? (
                        <>
                            <h3 className="text-center text-gray-600 mb-6 text-sm">
                                Book appointments with minimum wait-time & verified doctor
                                details
                            </h3>

                            <div className="grid gap-3 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-8xl mx-auto">
                                {list.map((doctor) => {
                                const imagePath = require(
                                    `../../../assets/images/${doctor.image}`
                                );

                                return (
                                    <DoctorCard
                                    key={doctor._id}
                                    doctorId={doctor._id}
                                    name={doctor.name}
                                    speciality={doctor.speciality}
                                    experience={doctor.experience}
                                    ratings={doctor.ratings}
                                    image={imagePath}
                                    bookingType="instant"
                                    onBook={(appointmentData: AppointmentData) =>
                                        handleBook(doctor, appointmentData)
                                    }
                                    />
                                );
                                })}
                            </div>
                            </>
                    ) : (
                        <p className="text-center text-gray-600 text-sm mt-4">No doctors found for  {searchParams.get('speciality')}.</p>
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
