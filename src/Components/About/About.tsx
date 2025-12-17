import React from "react";
import { FaUserPlus, FaUserMd, FaClipboardList } from "react-icons/fa";

import "./About.css";

import healthcare from "../../assets/images/healthcare.svg";
import features from "../../assets/images/features.svg";

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Title */}
      <h1 className="text-4xl font-bold text-blue-600 mb-6 text-center">
        About StayHealthy
      </h1>

      {/* Intro */}
      <p className="text-gray-700 text-lg text-center max-w-3xl mx-auto mb-10">
        StayHealthy is a digital healthcare platform created to simplify the way people 
        discover doctors, book appointments, and manage their health journey — all in one place.
        It bridges the gap between patients and healthcare professionals by making access to care
        easy, transparent, and organized.
      </p>

      {/* Section: Purpose */}
      <div className="grid md:grid-cols-2 gap-10 items-center mb-14">
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">
            Why StayHealthy?
          </h2>
          <p className="text-gray-700 mb-4">
            Finding the right doctor, remembering appointments, and keeping track of medical records
            can be overwhelming. StayHealthy was built to remove this complexity and give users
            a simple, reliable way to manage their healthcare digitally.
          </p>
          <p className="text-gray-700">
            The platform focuses on clarity, ease of use, and trust — so users can focus on their
            health instead of administrative tasks.
          </p>
        </div>

        {/* SVG Placeholder */}
        <div className="flex justify-center">
          <img
            src={healthcare}
            alt="Healthcare illustration"
            className="w-full max-w-md"
          />
        </div>
      </div>

      {/* Section: How It Works */}
      <div className="mb-14">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          How StayHealthy Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-lg shadow-sm bg-white">
            <FaUserPlus className="text-8xl text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Create an Account</h3>
            <p className="text-gray-600 text-sm">
              Sign up as a patient to access personalized healthcare features and your own dashboard.
            </p>
          </div>

          <div className="p-6 rounded-lg shadow-sm bg-white">
            <FaUserMd className="text-8xl text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Find & Book Doctors</h3>
            <p className="text-gray-600 text-sm">
              Explore doctors by specialization, view details, and book instant or scheduled appointments.
            </p>
          </div>

          <div className="p-6 rounded-lg shadow-sm bg-white">
            <FaClipboardList className="text-8xl text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Manage Everything</h3>
            <p className="text-gray-600 text-sm">
              Track appointments, view reports, receive notifications, and manage your profile easily.
            </p>
          </div>
        </div>
      </div>

      {/* Section: What You Can Do */}
      <div className="grid md:grid-cols-2 gap-10 items-center mb-14">
        {/* SVG Placeholder */}
        <div className="flex justify-center order-2 md:order-1">
          <img
            src={features}
            alt="Features illustration"
            className="w-full max-w-md"
          />
        </div>

        <div className="order-1 md:order-2">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            What You Can Do on StayHealthy
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li>✔ Discover doctors and healthcare services</li>
            <li>✔ Book and manage appointments seamlessly</li>
            <li>✔ View appointment history and medical reports</li>
            <li>✔ Share feedback and reviews after consultations</li>
            <li>✔ Receive timely updates and notifications</li>
          </ul>
        </div>
      </div>

      {/* Section: Vision */}
      <div className="bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-3 text-blue-700">
          Our Vision
        </h2>
        <p className="text-gray-700 max-w-3xl mx-auto">
          StayHealthy aims to make healthcare more accessible and organized by bringing patients
          and doctors together on a single, easy-to-use platform. The goal is to create a smoother,
          more transparent healthcare experience that supports better health decisions.
        </p>
      </div>
    </div>

  );
};

export default About;
