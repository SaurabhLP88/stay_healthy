import React, { useState } from "react";
import "./SelfCheck.css";

const MethodCard = ({ title, image, description }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleReadMore = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="method-card">
      <img src={image} alt={title} className="method-image" />

      <h3 className="method-title">{title}</h3>

      <p className={`method-description ${expanded ? "expanded" : "collapsed"}`}>
        {description}
      </p>

      <button className="read-btn" onClick={toggleReadMore}>
        {expanded ? "Read Less" : "Read More"}
      </button>
    </div>
  );
};

export default MethodCard;
