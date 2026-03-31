/**
 * StayHealthy — Medical Appointment Booking System
 * Developed by: Saurabh Lakhanpal
 * GitHub: https://github.com/SaurabhLP88
 */

require("dotenv").config();
const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');
const app = express();
//const path = require('path');
const PORT = process.env.PORT || 5000;

/*app.use(
  cors({
    /*origin: [
      "http://localhost:3000",
      "https://saurabhlp88.github.io"
    ],
    origin: true,
    credentials: true,
  })
);*/

const allowedOrigins = [
  "http://localhost:3000",
  "https://saurabhlp88.github.io"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔥 VERY IMPORTANT (fixes your error)
app.options("*", cors());

// Middleware
app.use(express.json());
//app.use(cors());

// Connect to MongoDB
connectToMongo();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/selfcheck", require("./routes/selfcheck"));
app.use("/api/healthtips", require("./routes/healthtips"));
app.use("/api/healthblog", require("./routes/healthblog"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

/*app.use(express.static(path.join(__dirname, "..", "build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});
*/

app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "StayHealthy API is running"
  });
}); 

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});