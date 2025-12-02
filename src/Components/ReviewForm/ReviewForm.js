import React, { useState } from 'react';
import './ReviewForm.css';

const ReviewForm = ({ doctorId, appointmentId, userId, onSubmit, onClose }) => {

  console.log("ReviewForm.js Loaded");
  console.log("ReviewForm doctorId (prop):", doctorId);
  console.log("ReviewForm appointmentId:", appointmentId);

  //const [selectedDoctor, setSelectedDoctor] = useState(null);
  //const [showForm, setShowForm] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rating: 0
  });

  /*const handleButtonClick = () => {
    setShowForm(true);
  };*/

  const handleChange = (e) => {
    console.log(`[ReviewForm] Field changed → ${e.target.name}:`, e.target.value);
    setFormData({ ...formData, [e.target.name] : e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("%c[ReviewForm] Submit clicked", "color: blue;");

    if (formData.title && formData.description && formData.rating > 0) {
      setShowWarning(false);

      const payload = {
        //...formData,
        title: formData.title,
        description: formData.description,
        rating: formData.rating,
        appointmentId,
        doctorId,
        userId
      };

      console.log("[ReviewForm] Final payload to submit:", payload);

      onSubmit(payload);

      setFormData({ title: '', description: '', rating: 0 });
      alert("Review Submitted");
    } else {
      console.warn("[ReviewForm] Warning: Some fields are empty");
      setShowWarning(true);
    }
  };
  
  return (

    <div className="review-modal" onClick={onClose}>
      <div className="review-modal-content" onClick={(e) => e.stopPropagation()}>

        <div className="review-header">
          <button className="cancel-btn" onClick={onClose}>x</button>
        </div>

        <h3 className="review-title">Give Review for <span style={{ color: "#1e88e5" }}>{appointmentId?.doctorName}</span></h3>
        
        <div className="review-container">

          {/*{!showForm ? (
            <button className="open-btn" onClick={handleButtonClick}>
              Open Feedback Form
            </button>
          ) : (*/}
            <form className="review-form" onSubmit={handleSubmit}>

              {showWarning && (
                <p className="warning">Please fill out all fields before submitting.</p>
              )}

              <div className="form-group">
                <label htmlFor="name">Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter your title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="review">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Write your description"
                  value={formData.description}
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
                      onClick={() => {
                        console.log("[ReviewForm] Rating selected:", num);
                        setFormData({ ...formData, rating: num });
                      }}
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
      </div>
    </div>    
  );
}

export default ReviewForm;
