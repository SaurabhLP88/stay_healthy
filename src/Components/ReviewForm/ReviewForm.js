import React, { useState } from 'react';


function GiveReviews() {
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
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedMessage(JSON.stringify(formData, null, 2)); // JSON formatında göstermek için
    if (formData.name && formData.review && formData.rating > 0) {
      setShowWarning(false);
    } else {
      setShowWarning(true);
    }
  };
  
  return (
    <div className="review-container">
      <h2 className="review-title">Share Your Feedback</h2>

      {!showForm ? (
        <button className="open-btn" onClick={handleButtonClick}>
          Open Feedback Form
        </button>
      ) : (
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
            <input
              type="number"
              id="rating"
              name="rating"
              min="1"
              max="5"
              value={formData.rating}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-btn">
            Submit Feedback
          </button>
        </form>
      )}

      {submittedMessage && (
        <div className="submitted-box">
          <h3>✅ Submitted Data:</h3>
          <pre>{submittedMessage}</pre>
        </div>
      )}
    </div>
  );
}

export default GiveReviews;
