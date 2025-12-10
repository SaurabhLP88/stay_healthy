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
    <div className="px-6 md:px-12 text-center">

      {/* Title */}

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-blue-600 tracking-wide mb-3">Health Tips</h1>
        <p className="text-gray-600 text-sm md:text-base mb-0">
          Small daily habits can make a big difference in your long-term health.
        </p>
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">

        {tips.map((tip, index) => {
          const imagePath = require(`../../assets/images/${tip.image}`);
          return (
            <div
              key={index}
              data-aos="fade-up"
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2"
            >
              <img
                src={imagePath}
                alt={tip.title}
                className="w-full h-60 object-contain mb-4"
              />

              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {tip.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {tip.description}
              </p>
            </div>
          );
        })}

      </div>

    </div>

  );
};

export default HealthTips;
