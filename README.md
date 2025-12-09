
# 🏥 StayHealthy – Medical Appointment Booking System

StayHealthy is a full-stack **Medical Appointment Booking System** designed to streamline online appointment booking and digital health management. It provides dedicated dashboards for patients and doctors, enabling smooth appointment scheduling, profile management, notifications, and medical record tracking.

---

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

---

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

---

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

---

## ⚙️ Installation & Setup

To run this project locally, follow these steps:


# Clone the repository
`git clone https://github.com/SaurabhLP88/StayHealthy.git`

# Navigate into the project folder
`cd StayHealthy`

# Install backend dependencies
`cd server`
`npm install`

# Install frontend dependencies (if separate)
`cd..`
`npm install`

# Start the backend server
`cd ..`
`npm start`

Then open your browser and visit:

http://localhost:5000

🧠 Learning Objectives

This project demonstrates your ability to:

- Build a full-stack application using React + Node.js + MongoDB
- Implement JWT authentication, user roles (Patient/Doctor), and secure APIs
- Work with RESTful API architecture
- Manage state, notifications, and complex UI flows in React
- Deploy a production-ready healthcare application
- Maintain profile updates, appointment tracking, and role-based dashboards

📁 Project Structure
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

🌐 Live Demo & Repository

Live Demo: [StayHealthy Live](https://saurabhlp88.github.io/stay_healthy/)
Repository: [StayHealthy on GitHub](https://github.com/SaurabhLP88/stay_healthy.git)

👨‍💻 About the Developer

**StayHealthy** is designed and developed by **Saurabh Lakhanpal** – Full Stack & Front-End Developer.
📧 Email: [firsty111@gmail.com]
🔗 GitHub: [GitHub Profile](https://github.com/SaurabhLP88/)

📜 License
This project is licensed under the MIT License

