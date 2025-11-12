import React, { useState } from 'react';
import './ReviewForm.css';

const ReviewForm = ({ onSubmit }) => {

  console.log("ReviewForm.js Loaded");

  const [showForm, setShowForm] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [formData, setFormData] = useState({
        name: '',
        review: '',
        rating: 0
      });

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name] : e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.review && formData.rating > 0) {
      setShowWarning(false);
      onSubmit(formData);
      setFormData({ name: '', review: '', rating: 0 });
    } else {
      setShowWarning(true);
    }
  };
  
  return (
    <div className="review-container">

      {/*{!showForm ? (
        <button className="open-btn" onClick={handleButtonClick}>
          Open Feedback Form
        </button>
      ) : (*/}
        <form className="review-form" onSubmit={handleSubmit}>
          <h3>Give Your Review</h3>

          {showWarning && (
            <p className="warning">⚠️ Please fill out all fields before submitting.</p>
          )}

          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="review">Review:</label>
            <textarea
              id="review"
              name="review"
              placeholder="Write your review"
              value={formData.review}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating (1–5):</label>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  className={`star ${formData.rating >= num ? "active" : ""}`}
                  onClick={() => setFormData({ ...formData, rating: num })}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Submit Feedback
          </button>
        </form>
      {/* })} */}

      {submittedMessage && (
        <div className="submitted-box">
          <h3>✅ Submitted Data:</h3>
          <pre>{submittedMessage}</pre>
        </div>
      )}
        
    </div>
  );
}

export default ReviewForm;
