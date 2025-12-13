import { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaUserMd } from 'react-icons/fa';
import initSpeciality from "../../../utils/specialities";

import './FindDoctorSearch.css';

import instant from '../../../assets/images/instant.svg';
import book from "../../../assets/images/book.svg";
import doctor from "../../../assets/images/self.svg";

interface FindDoctorSearchProps {
  onSearch?: (searchText: string) => void;
}

const FindDoctorSearch = ({ onSearch }: FindDoctorSearchProps) => {

    //console.log("FindDoctorSearch.js Loaded");
    const [doctorResultHidden, setDoctorResultHidden] = useState<boolean>(true);
    const [searchDoctor, setSearchDoctor] = useState<string>('');
    const [specialities] = useState<string[]>([...initSpeciality]);

    const navigate = useNavigate();
    const location = useLocation();

    const imageDimensions = "w-2/3 md:w-auto max-h-auto md:max-h-96 mx-auto";

    const handleDoctorSelect = (speciality: string) => {
        setSearchDoctor(speciality);
        setDoctorResultHidden(true);

        if (location.pathname === "/instant-consultation") {
            navigate(`/instant-consultation?speciality=${speciality}`);
        } else if (location.pathname === "/book-consultation") {
            navigate(`/book-consultation?speciality=${speciality}`);
        } else {  }

        //window.location.reload();
    }
    return (
        <div className="text-center py-0">

            {/* TITLE */}
            <h1 className="text-2xl font-semibold text-blue-500 mb-5">
                {location.pathname === "/instant-consultation"
                ? "Instant Consultation — Connect with a Doctor Now"
                : location.pathname === "/book-consultation"
                ? "Book an Appointment with Your Preferred Doctor"
                : "Find a Doctor at Your Own Ease"}
            </h1>

            {/* DOCTOR IMAGE */}
            <div className="mb-5">
                {location.pathname === "/instant-consultation" ? (
                <img src={instant} alt="Instant Consultation" className={imageDimensions} />
                ) : location.pathname === "/book-consultation" ? (
                <img src={book} alt="Book Appointment" className={imageDimensions} />
                ) : (
                <img src={doctor} alt="Find Doctor" className={imageDimensions} />
                )}
            </div>

            {/* SEARCH SECTION */}
            <div className="flex justify-center items-center relative py-0">

                <div className="flex items-center w-[430px] relative rounded-md bg-white shadow-inner">

                    {/* INPUT BOX */}
                    <input
                        type="text"
                        className="h-10 w-full px-3 border border-gray-700 rounded-l-md text-sm outline-none"
                        placeholder="Search doctors by name or speciality"
                        onFocus={() => setDoctorResultHidden(false)}
                        onBlur={() => setDoctorResultHidden(true)}
                        value={searchDoctor}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = e.target.value;
                            setSearchDoctor(value);
                            onSearch?.(value.trim());
                        }}
                    />

                    {/* SEARCH ICON */}
                    <div className="w-10 h-10 bg-gray-200 border border-gray-700 border-l-0 rounded-r-md flex justify-center items-center cursor-pointer">
                        <FaSearch className="text-gray-700 text-lg" />
                    </div>

                    {/* DROPDOWN */}
                    <div
                        className="absolute top-11 left-0 w-full bg-white border border-gray-500 border-t-0 max-h-[400px] overflow-y-auto z-10"
                        hidden={doctorResultHidden}
                    >
                        {specialities.map((speciality) => (
                        <div
                            key={speciality}
                            className="h-14 flex items-center bg-white border-b border-gray-200 px-3 gap-3 cursor-pointer hover:bg-gray-100 transition"
                            onMouseDown={() => handleDoctorSelect(speciality)}
                        >
                            <span className="p-2 bg-gray-100 rounded-full border border-gray-100 flex items-center justify-center">
                            <FaUserMd className="text-gray-700" />
                            </span>
                            <span className="text-sm text-gray-700">{speciality}</span>
                            <span className="ml-auto text-[11px] text-gray-500 uppercase">
                            Speciality
                            </span>
                        </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>

    )
}

export default FindDoctorSearch