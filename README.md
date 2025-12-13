
# 🏥 StayHealthy – Medical Appointment Booking System

![Build Status](https://img.shields.io/github/actions/workflow/status/SaurabhLP88/stay_healthy/deploy.yml?branch=main)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)
![Docker Compose](https://img.shields.io/badge/Docker--Compose-Enabled-blueviolet?logo=docker)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?logo=jsonwebtokens)
![TypeScript](https://img.shields.io/badge/TypeScript-Used-3178C6?logo=typescript)
![SEO](https://img.shields.io/badge/SEO-Optimized-success)
![License](https://img.shields.io/github/license/SaurabhLP88/stay_healthy)
![Repo Size](https://img.shields.io/github/repo-size/SaurabhLP88/stay_healthy)
![Last Commit](https://img.shields.io/github/last-commit/SaurabhLP88/stay_healthy)
![Made with Love](https://img.shields.io/badge/Made%20with-Love-red)
![Open Source](https://img.shields.io/badge/Open%20Source-Yes-brightgreen)

StayHealthy is a **Medical Appointment Booking System** designed to streamline online appointment booking and digital health management. It provides dedicated dashboards for patients and doctors, enabling smooth appointment scheduling, profile management, notifications, and medical record tracking.

## 🚀 Project Overview

StayHealthy allows users to:

👤 For Patients

- Register or log in as a Patient.
- Book appointments with available doctors.
- View doctor details, specializations, timings, and consultation info.
- Manage upcoming appointments and view appointment history.
- Upload, view, and manage medical reports.
- Give reviews and feedback to doctors.
- Edit their profile (name, username, contact info, etc.).
- Get real-time notifications (appointment status, logout notice, etc.).

🩺 For Doctors (in progress)

- Register or log in as a Doctor.
- Manage appointment requests (approve/reject).
- Set and update availability / working hours.
- View patient details for upcoming visits.
- View appointment history.
- Manage profile (name, specialization, consultation fee, etc.).
- View feedback & reviews given by patients.

## 🛠️ Technologies Used

**Frontend:**
- HTML5, CSS3, JavaScript (ES6)
- React.js (for building the dynamic UI)
- Bootstrap / Tailwind CSS for responsive design

**Backend:**
- Node.js with Express.js for REST APIs
- MongoDB for data storage
- JWT for user authentication
- bcrypt for secure password hashing

**Tools & Deployment:**
- Git & GitHub for version control
- Postman for API testing
- Deployed on GitHub Pages

## 🧩 Key Features

🔐 Authentication
- JWT-based login & registration.
- Supports both Patient and Doctor account types.
- Secure password handling with bcrypt.

📅 Appointment Management
- Real-time slot selection.
- Appointment approval system for doctors.
- Patients can cancel or reschedule appointments.
- Doctors can confirm or reject requests.

📄 Digital Health Records
- Patients can upload medical reports.
- Doctors can review past records (planned).
- Visit history stored securely.

🔔 In-App Notifications
- Login/logout notifications.
- Appointment status updates.
- Profile update confirmation.
- Smooth UI notifications (built using your custom notify utility).

🧑‍💼 Profile Management
- Update username, personal details, and profile info.
- Syncs across navigation and state.
- Fixes applied to ensure username refresh after edits.

📱 Responsive UI
- Fully responsive design using React + Bootstrap/Tailwind.
- Optimized for mobile and desktop users.

📈 SEO Integration
- SEO optimized with dynamic meta tags using react-helmet-async

## ⚙️ Installation & Setup

To run this project locally, follow these steps:  

### Clone the repository
`git clone https://github.com/SaurabhLP88/StayHealthy.git`

### Navigate into the project folder
`cd StayHealthy`

### Install backend dependencies
`cd server`  
`npm install`

### Install frontend dependencies (if separate)
`cd..`  
`npm install`

### Start the backend server
`cd ..`  
`npm start`

Then open your browser and visit:  

http://localhost:5000

## 🧠 Learning Objectives

This project demonstrates your ability to:

- Build a full-stack application using React + Node.js + MongoDB
- Implement JWT authentication, user roles (Patient/Doctor), and secure APIs
- Work with RESTful API architecture
- Manage state, notifications, and complex UI flows in React
- Deploy a production-ready healthcare application
- Maintain profile updates, appointment tracking, and role-based dashboards

## 📁 Project Structure

```python
StayHealthy/
│
├── /                     # Frontend (React)
├── server/               # Backend (Node.js / Express)
├── models/               # Database models
├── routes/               # API routes (auth, appointments, doctors, etc.) and business logic
├── public/               # Static assets
├── node_modules/         # Backend dependencies
├── build/                # Production build (only after `npm run build`)
├── dist/                 # Bundles
├── src/                  # React source code
└── README.md             # Project documentation
```


## 🌐 Live Demo & Repository

Live Demo: [StayHealthy Live](https://saurabhlp88.github.io/stay_healthy/)  
Repository: [StayHealthy on GitHub](https://github.com/SaurabhLP88/stay_healthy.git)  
IBM Front-End Developer Capstone Project

## 👨‍💻 About the Developer

**StayHealthy** is designed and developed by **Saurabh Lakhanpal** – Full Stack & Front-End Developer.  
📧 Email: [firsty111@gmail.com]  
🔗 GitHub: [GitHub Profile](https://github.com/SaurabhLP88/)

## 📜 License  
This project is licensed under the MIT License

