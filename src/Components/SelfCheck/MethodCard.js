import React, { useState } from "react";
import "./SelfCheck.css";

const MethodCard = ({ title, image, description }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleReadMore = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="bg-blue-50 p-5 rounded-xl shadow-md">

      <img
        src={image}
        alt={title}
        className="w-full h-40 object-contain mb-4"
      />

      <h3 className="text-lg font-bold text-center mb-3">
        {title}
      </h3>

      <p
        className={`text-sm text-gray-700 leading-relaxed mb-3 transition-all ${
          expanded ? "" : "line-clamp-2"
        }`}
      >
        {description}
      </p>

      <button
        className="text-blue-600 font-semibold text-sm hover:underline"
        onClick={toggleReadMore}
      >
        {expanded ? "Read Less" : "Read More"}
      </button>

    </div>

  );
};

export default MethodCard;
