import React, { useState, useEffect } from "react"; // Importing the necessary modules from React library
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import { DoctorStats } from "../../types/DoctorStats";

import instant from "../../assets/images/instant.svg";
import book from "../../assets/images/book.svg";
import self from "../../assets/images/self.svg";
import tips from "../../assets/images/tips.svg";

import "./LandingPage.css"; // Importing the CSS styles for the Landing_Page component

// Defining the Function component Landing_Page
const LandingPage: React.FC = () => {
  const [showServices, setShowServices] = useState(false);

  // Dashboard Stats
  const [todayAppointments, setTodayAppointments] = useState<number>(0);
  const [pendingAppointments, setPendingAppointments] = useState<number>(0);
  const [completedAppointments, setCompletedAppointments] = useState<number>(0);
  const [cancelledAppointments, setCancelledAppointments] = useState(0);
  const [totalInstantAppointments, setTotalInstantAppointments] = useState(0);
  const [totalScheduledAppointments, setTotalScheduledAppointments] = useState(0);
  const [doctorDetails, setDoctorDetails] = useState<DoctorStats["doctor"] | null>(null);

  const [nextAppointmentName, setNextAppointmentName] = useState<string>("No upcoming");
  const [nextAppointmentTime, setNextAppointmentTime] = useState<string>("");
  const [nextAppointmentDate, setNextAppointmentDate] = useState<string>("");
  const [nextAppointmentPhone, setNextAppointmentPhone] = useState<string>("");
  
  const navigate = useNavigate();
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  const role = sessionStorage.getItem("role")?.toLowerCase();
  const doctorId = sessionStorage.getItem("doctorId");

  const serviceClasses = "service-card bg-white border border-gray-200 rounded-xl p-3 md:p-6 shadow-lg hover:shadow-xl transition cursor-pointer";
  const imageClasses = "w-auto h-80 mx-auto mb-2 md:mb-4";

  const dashCardClasses = "bg-white border border-gray-200 rounded-xl p-3 md:p-6 shadow-md text-center hover:-translate-y-1 transition";
  const dashLabelClasses = "text-lg font-semibold mb-2";
  const dashValueClasses = "text-4xl font-bold text-blue-500";

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {

    async function fetchDoctorStats() {
      try {
        
        const res = await fetch(`${API_URL}/api/doctors/stats?doctorId=${doctorId}`);
        const data: DoctorStats = await res.json();

        console.log("📌 Fetching doctor stats for doctorId:", doctorId);        
        console.log("Raw response:", res);        
        console.log("📌 Parsed Stats Data:", data);

        // Log each individual value
        console.log("👉 Today Appointments Count:", data.today);
        console.log("👉 Pending Appointments Count:", data.pending);
        console.log("👉 Completed Appointments Count:", data.completed);
        console.log("👉 Next Appointment Data:", data.next);

        setTodayAppointments(data.today ?? 0);
        setPendingAppointments(data.pending ?? 0);
        setCompletedAppointments(data.completed ?? 0);
        setCancelledAppointments(data.cancelled ?? 0);
        setTotalInstantAppointments(data.totalInstantAppointments ?? 0);
        setTotalScheduledAppointments(data.totalScheduledAppointments ?? 0);
        setDoctorDetails(data.doctor ?? null);

        if (data.next) {
          console.log("⏭ Setting Next Appointment:", data.next);

          setNextAppointmentTime(data.next.time || "");
          setNextAppointmentName(data.next.patient || "No upcoming");
          setNextAppointmentDate(data.next.date || "");
          setNextAppointmentPhone(data.next.phone || "");
        } else {
          console.log("⏭ No upcoming appointment found");

          setNextAppointmentTime("");
          setNextAppointmentName("No upcoming");
          setNextAppointmentDate("");
          setNextAppointmentPhone("");
        }

      } catch (err) {
        console.error("Dashboard Error:", err);
      }
    }

    if (role === "doctor") {
      fetchDoctorStats();
    }
  }, [role, doctorId]);  

  //const doctorId = doctor?._id;
  
  //console.log("User logged in status:", isLoggedIn);
  const handleNavigate = (path: string) => {
    if (isLoggedIn) navigate(path);
    else navigate("/login");
  };

  const handleGetStarted = () => {
    setShowServices(true);
    const section = document.getElementById("services");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };  

  return (
    <>
      {/* HERO SECTION */}
      {!showServices && role !== "doctor" && (
        <section className="flex flex-col align-middle justify-center relative min-h-[calc(100vh-190px)] text-center overflow-hidden -mx-2 px-4 md:-mx-0 md:px-0">

          {/* Blobs */}
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <div className="blob bg-blue-800/40 blur-3xl"></div>
          </div>
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <div className="blob2 bg-blue-700/40 blur-3xl"></div>
          </div>

          <div className="flex flex-col items-center gap-6" data-aos="fade-up">

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Your Health <br />
              <span className="gradient-text">Our Responsibility</span>
            </h1>

            <h4 className="text-gray-500 text-lg md:text-xl max-w-3xl px-4 md:px-20">
              Book appointments, consult doctors, and manage your health — all in one place.
            </h4>

            <button
              className="mt-4 px-8 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition w-40 md:w-52"
              onClick={handleGetStarted}
            >
              Get Started
            </button>
          </div>
        </section>
      )}

      {/* SERVICES SECTION */}
      {showServices && role !== "doctor" && (
        <section id="services" className="px-2 md:px-5 pb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-3">
            Best Services
          </h2>
          <p className="text-lg text-gray-600 mb-5 md:mb-10">
            Love yourself enough to live a healthy lifestyle.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-8 justify-items-center">

            <div
              className={serviceClasses}
              onClick={() => handleNavigate("/instant-consultation")}
            >
              <img src={instant} alt="Instant Consultation" className={imageClasses} />
              <h3 className="text-lg font-medium text-gray-700">Instant Consultation</h3>
            </div>

            <div
              className={serviceClasses}
              onClick={() => handleNavigate("/book-consultation")}
            >
              <img src={book} alt="Book Appointment" className={imageClasses} />
              <h3 className="text-lg font-medium text-gray-700">Book an Appointment</h3>
            </div>

            <Link to="/self-check" className={serviceClasses}>
              <img src={self} alt="Self Checkup" className={imageClasses} />
              <h3 className="text-lg font-medium text-gray-700">Self Checkup</h3>
            </Link>

            <Link to="/health-tips" className={serviceClasses}>
              <img src={tips} alt="Health Tips Guidance" className={imageClasses} />
              <h3 className="text-lg font-medium text-gray-700">Health Tips & Guidance</h3>
            </Link>

          </div>
        </section>
      )}

      {/* DOCTOR DASHBOARD */}
      {role === "doctor" && (
        <div className="p-0">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Doctor Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            {doctorDetails && (
              <div className="flex items-center gap-6 bg-white border border-gray-200 rounded-xl p-3 md:p-6 shadow-md hover:-translate-y-1 transition">
                <img
                  src={require(`../../assets/images/${doctorDetails.image}`)}
                  alt={doctorDetails.name}
                  className="size-32 rounded-full object-cover border-2 border-blue-500"
                />
                <div>
                  <h2 className="text-2xl font-bold">Welcome, Dr. {doctorDetails.name}</h2>
                  <p className="text-gray-600"><span className="text-blue-700">Speciality -</span> {doctorDetails.speciality}</p>
                  <p className="text-gray-600"><span className="text-blue-700">Experience -</span> {doctorDetails.experience} yrs</p>
                  <p className="text-gray-600"><span className="text-blue-700">Phone -</span> {doctorDetails.phone}</p>
                  <p className="text-gray-600"><span className="text-blue-700">Email -</span> {doctorDetails.email}</p>
                </div>
              </div>
            )}

            <div className={dashCardClasses}>
              <h3 className={dashLabelClasses}>Next Appointment</h3>
              <p className="text-xl font-bold text-green-600">{nextAppointmentName}</p>              
              <p className="text-gray-700">{nextAppointmentPhone}</p>
              <p className="text-gray-600">{nextAppointmentDate}</p>
              <p className="text-gray-600">{nextAppointmentTime}</p>
            </div>

          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-6">

            <div className={dashCardClasses}>
              <h3 className={dashLabelClasses}>Today's Appointments</h3>
              <p className={dashValueClasses}>{todayAppointments}</p>
            </div>

            <div className={dashCardClasses}>
              <h3 className={dashLabelClasses}>Pending Appointments</h3>
              <p className={dashValueClasses}>{pendingAppointments}</p>
            </div>

            <div className={dashCardClasses}>
              <h3 className={dashLabelClasses}>Completed Appointments</h3>
              <p className={dashValueClasses}>{completedAppointments}</p>
            </div>

            <div className={dashCardClasses}>
              <h3 className={dashLabelClasses}>Cancelled Appointments</h3>
              <p className={dashValueClasses}>{cancelledAppointments}</p>
            </div>

            <div className={dashCardClasses}>
              <h3 className={dashLabelClasses}>Total Instant Appointments</h3>
              <p className={dashValueClasses}>{totalInstantAppointments}</p>
            </div>

            <div className={dashCardClasses}>
              <h3 className={dashLabelClasses}>Total Scheduled Appointments</h3>
              <p className={dashValueClasses}>{totalScheduledAppointments}</p>
            </div>

            

          </div>
        </div>
      )}
      
    </>
  );
};

export default LandingPage; // Exporting the Landing_Page component to be used in other parts of the application