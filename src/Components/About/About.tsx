import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-blue-600 mb-4 text-center">
        About StayHealthy
      </h1>

      <p className="text-gray-700 mb-4">
        StayHealthy is a Medical Appointment Booking System designed to streamline online appointment booking and digital health management. 
        It provides dedicated dashboards for patients and doctors, enabling smooth appointment scheduling, profile management, notifications, 
        and medical record tracking.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        What can you do?
      </h2>
      <ul id="what" className="list-disc pl-6 text-gray-700 space-y-1">
        <li>Read health blogs and daily tips</li>
        <li>Watch educational health videos</li>
        <li>Search and book doctor appointments</li>
        <li>Manage appointment history</li>
        <li>Receive notifications and reviews</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        How to use the app
      </h2>
      <ul id="how" className="list-disc pl-6 text-gray-700 space-y-1">
        <li>Register or login as a patient</li>
        <li>Browse health content</li>
        <li>Search doctors and book appointments</li>
        <li>Manage everything from your dashboard</li>
      </ul>
    </div>
  );
};

export default About;
