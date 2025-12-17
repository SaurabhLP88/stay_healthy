import { useEffect, useState } from "react";
import { API_URL } from "../../config";

import Loader from "../Loader/Loader";
import { HealthTip } from "../../types/HealthTip";

import "./HealthTips.css";

const HealthTips = () => { 
  const [tips, setTips] = useState<HealthTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTips = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${API_URL}/api/healthtips`);
        if (!res.ok) {
          throw new Error("Failed to load health tips");
        }
        const data = await res.json();
        setTips(data);
      } catch (err) {
        console.error("Error loading methods:", err);
        setError("Unable to load health tips. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, []);

  return (
    <div className="px-1 md:px-6 text-center">

      {/* Title */}

      <div className="text-center mb-5 md:mb-10">
        <h1 className="text-3xl font-bold text-blue-600 tracking-wide mb-1 md:mb-3">Health Tips</h1>
        <p className="text-gray-600 text-sm md:text-base mb-0">
          Small daily habits can make a big difference in your long-term health.
        </p>
      </div>

      {/* Tips Grid */}

      {loading ? (
        <Loader text="Loading health tips..." />
      ) : error ? (
        <div className="text-center text-red-600 font-semibold">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center mb-4">
          {tips.map((tip, index) => {
            const imagePath = require(`../../assets/images/${tip.image}`);
            return (
              <div
                key={index}
                data-aos="fade-up"
                className="bg-white border border-gray-200 p-3 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
              >
                <img
                  src={imagePath}
                  alt={tip.title}
                  className="w-full h-60 object-contain mb-2 md:mb-4"
                />

                <h3 className="text-lg font-semibold text-gray-800 mb-0 md:mb-2">
                  {tip.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed m-0">
                  {tip.description}
                </p>
              </div>
            );
          })}
        </div>
      )}      

    </div>

  );
};

export default HealthTips;
