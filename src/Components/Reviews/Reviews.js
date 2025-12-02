import React, { useState, useEffect } from "react";
import { API_URL } from "../../config";

//import ReviewForm from "../ReviewForm/ReviewForm";
import "./Reviews.css";
const Reviews = () => {

  //console.log("Reviews.js Loaded");
  //const [selectedDoctor, setSelectedDoctor] = useState(null);
  //const [tempReview, setTempReview] = useState("");
  //const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  //const token = sessionStorage.getItem("auth-token");

  useEffect(() => {
    fetch(`${API_URL}/api/reviews/public`)
      .then(res => res.json())
      .then(data => setReviews(data.reviews || []))
      .catch(err => console.error("Error fetching reviews:", err));
  }, []);

  return (
    <div className="reviews-container">
      <h2 className="reviews-title">Reviews</h2>

      {reviews.length === 0 ? (
        <p className="no-reviews">No reviews available</p>
      ) : (

      <table className="reviews-table">
        <thead>
          <tr>
            <th>Doctor Name</th>
            <th>Speciality</th>            
            <th>Review Details</th>
            <th>Rating</th>
            {/*<th>Give Review</th>*/}
          </tr>
        </thead>
        <tbody>
          {reviews.map((doctor, index) => (
            <tr key={doctor.id}>
              <td align="center">{doctor.doctorName}</td>
              <td align="center">{doctor.speciality}</td>
              <td align="center">
                <div className="doc-cell">
                  <div className="doc-name">{doctor.title || "—"}</div>
                  <div className="doc-small">{doctor.review || "—"}</div>
                </div>
              </td>
              <td align="center">{doctor.rating ? `${ "⭐".repeat(doctor.rating) }` : "—"}</td>
              {/*<td align="center">
                <button
                    className={`review-btn ${doctor.review ? "disabled-btn" : ""}`}
                    onClick={() => handleOpenReview(doctor)}
                    disabled={!!doctor.review}
                    >
                    {doctor.review ? "Reviewed" : "Give Review"}
                </button>
              </td>*/}
            </tr>
          ))}
        </tbody>
      </table>

      )}

      {/*{selectedDoctor && (
        <>          
          <ReviewForm
            onSubmit={(data) => {
              //console.log("Review Submitted:", formData, "For:", selectedAppointment);
              //handleSubmitReview(selectedDoctor._id || selectedDoctor.id, data)
              handleSubmitReview(selectedDoctor.doctorId, data)
            }}
          />
        </>
      )}*/}
    </div>
  );
};

export default Reviews;
