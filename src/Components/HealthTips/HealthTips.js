import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import "./HealthTips.css";

import water from "../../assets/images/water.svg";
import meal from "../../assets/images/meal.svg";
import exercise from "../../assets/images/exercise.svg";
import sleep from "../../assets/images/sleep.svg";

const HealthTips = () => {
  //console.log("HealthTips.js Loaded");
  /*const tips = [
    {
      
      title: "Stay Hydrated",
      description:
        "Drink at least 8 glasses of water a day to keep your body hydrated and your mind sharp.",
      image: water,
    },
    {
      
      title: "Eat Balanced Meals",
      description:
        "Include fruits, vegetables, proteins, and whole grains in your daily diet for better immunity.",
      image: meal,
    },
    {
      
      title: "Exercise Regularly",
      description:
        "Engage in at least 30 minutes of physical activity every day to maintain physical and mental well-being.",
      image: exercise,
    },
    {
      
      title: "Sleep Well",
      description:
        "Ensure 7–8 hours of quality sleep to allow your body to rest and recover efficiently.",
      image: sleep,
    },
  ];*/

  const [tips, setTips] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/healthtips`)
      .then(res => res.json())
      .then(data => setTips(data))
      .catch(err => console.error("Error loading health tips:", err));
  }, []);

  return (
    <section className="health-tips-section">
      <h1 className="section-title">Health Tips for a Better You</h1>
      <p className="section-subtitle">
        Small daily habits can make a big difference in your long-term health.
      </p>

      <div className="tips-grid">
        {tips.map((tip, index) => {
          const imagePath = require(`../../assets/images/${tip.image}`);

          return (
            <div key={index} className="tip-card" data-aos="fade-up">
              <img src={imagePath} alt={tip.title} className="tip-image" />
              <h3 className="tip-title">{tip.title}</h3>
              <p className="tip-description">{tip.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HealthTips;
