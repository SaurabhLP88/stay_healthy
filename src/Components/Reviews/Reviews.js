import React, { useState, useEffect } from "react";
import "./Reviews.css";
import ReviewForm from "../ReviewForm/ReviewForm";

const Reviews = () => {

  //console.log("Reviews.js Loaded");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [tempReview, setTempReview] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/appointments/closed")  // update URL according to backend
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error("Error fetching reviews:", err));
  }, []);

  const handleOpenReview = (doctor) => {
    setSelectedDoctor(doctor);
    setTempReview(doctor.review);
    setRating(0);
  };

  const handleSubmitReview = (doctorId, data) => {
    setReviews(prev =>
        prev.map(r =>
        r.id === doctorId
            ? { ...r, review: data.review, rating: data.rating, reviewed: true }
            : r
        )
    );
    setSelectedDoctor(null);
  };

  return (
    <div className="reviews-container">
      <h2 className="reviews-title">Reviews</h2>

      {reviews.length === 0 ? (
        <p className="no-reviews">No reviews available</p>
      ) : (

      <table className="reviews-table">
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Doctor Name</th>
            <th>Speciality</th>
            <th>Provide Review</th>
            <th>Review Given</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((doctor, index) => (
            <tr key={doctor.id}>
              <td>{index + 1}</td>
              <td>{doctor.doctorName}</td>
              <td>{doctor.speciality}</td>              
              <td>{doctor.review || "—"}</td>
              <td>{doctor.rating ? `(${ "⭐".repeat(doctor.rating) })` : "—"}</td>
              <td>
                <button
                    className={`review-btn ${doctor.review ? "disabled-btn" : ""}`}
                    onClick={() => handleOpenReview(doctor)}
                    disabled={!!doctor.review}
                    >
                    {doctor.review ? "Reviewed" : "Give Review"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      )}

      {selectedDoctor && (
        <div className="review-modal" onClick={() => setSelectedDoctor(null)}>
          <div className="review-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="review-title">Give Review for {selectedDoctor.doctorName}</h3>
            <ReviewForm onSubmit={(data) => handleSubmitReview(selectedDoctor.id, data)} />
            <button
              className="cancel-btn"
              onClick={() => setSelectedDoctor(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
