import React, { useState, ChangeEvent, FormEvent } from "react";
import './ReviewForm.css';

interface ReviewFormProps {
  doctorId: string;
  appointmentId: any; // you can replace with Appointment type later
  userId: string;
  onSubmit: (data: ReviewPayload) => void;
  onClose: () => void;
}

interface ReviewPayload {
  title: string;
  description: string;
  rating: number;
  appointmentId: any;
  doctorId: string;
  userId: string;
}

interface FormState {
  title: string;
  description: string;
  rating: number;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  doctorId,
  appointmentId,
  userId,
  onSubmit,
  onClose
}) => {
  console.log("ReviewForm.tsx Loaded");
  console.log("ReviewForm doctorId:", doctorId);
  console.log("ReviewForm appointmentId:", appointmentId);

  const [showWarning, setShowWarning] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    title: "",
    description: "",
    rating: 0,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log(`[ReviewForm] Field changed → ${e.target.name}:`, e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("%c[ReviewForm] Submit clicked", "color: blue;");

    if (formData.title && formData.description && formData.rating > 0) {
      setShowWarning(false);

      const payload: ReviewPayload = {
        title: formData.title,
        description: formData.description,
        rating: formData.rating,
        appointmentId,
        doctorId,
        userId,
      };

      console.log("[ReviewForm] Final payload:", payload);

      onSubmit(payload);

      setFormData({ title: "", description: "", rating: 0 });
      alert("Review Submitted");
    } else {
      console.warn("[ReviewForm] Warning: Some fields are empty");
      setShowWarning(true);
    }
  };
  
  return (

    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center z-[999] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            className="text-gray-700 text-2xl font-bold hover:text-black transition"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Title */}
        <h3 className="text-center text-xl font-semibold mb-4">
          Give Review for{" "}
          <span className="text-blue-600 font-bold">
            {appointmentId?.doctorName}
          </span>
        </h3>

        <div>
          <form className="space-y-4" onSubmit={handleSubmit}>

            {showWarning && (
              <p className="bg-red-50 text-red-600 p-2 rounded-md text-center font-medium">
                Please fill out all fields before submitting.
              </p>
            )}

            {/* Title */}
            <div className="flex flex-col">
              <label className="font-semibold mb-1">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Enter your title"
                value={formData.title}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label className="font-semibold mb-1">Description:</label>
              <textarea
                id="description"
                name="description"
                placeholder="Write your description"
                value={formData.description}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 h-40 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
            </div>

            {/* Rating */}
            <div>
              <label className="font-semibold">Rating (1–5):</label>
              <div className="flex gap-2 text-3xl mt-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <span
                    key={num}
                    className={`cursor-pointer transition ${
                      formData.rating >= num ? "text-yellow-400" : "text-gray-300"
                    }`}
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

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Submit Feedback
            </button>
          </form>

          {/* Submitted Output
          {submittedMessage && (
            <div className="mt-5 bg-green-50 p-4 rounded-lg text-green-700">
              <h3 className="font-bold mb-2">✅ Submitted Data:</h3>
              <pre className="bg-white p-3 rounded-md text-sm overflow-x-auto">
                {submittedMessage}
              </pre>
            </div>
          )} */}
        </div>
      </div>
    </div>

  );
}

export default ReviewForm;
