import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import MethodCard from "./MethodCard";
import "./SelfCheck.css";
import self from "../../assets/images/self.svg";

const SelfCheck = () => {
  /*const methods = [
    {
      title: "Blood Pressure Check",
      image: self,
      description:
        "Place your index and middle finger on your wrist or neck. Count the beats for 30 seconds and multiply by 2. Check patterns for irregularities and compare with normal resting heart rate values."
    },
    {
      title: "Heart Rate Monitoring",
      image: self,
      description:
        "Sit calmly for 5 minutes. Use your fingers to find a pulse point and count the beats. A normal range is 60–100 BPM. Track increase, decrease or unusual rhythms."
    },
    {
      title: "Breathing Rate Check",
      image: self,
      description:
        "Sit straight, relax your shoulders, and breathe normally. Count how many breaths you take in 1 minute. Normal is 12–20 breaths. Look for shortness of breath."
    },
    {
      title: "Temperature Check",
      image: self,
      description:
        "Use a digital thermometer under your tongue or armpit. Normal body temperature is 97°F–99°F. Track changes over 2–3 days for fever patterns."
    }
  ];*/

  const [methods, setMethods] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/selfCheck`)
      .then(res => res.json())
      .then(data => setMethods(data))
      .catch(err => console.error("Error loading methods:", err));
  }, []);

  return (
    <div className="self-checkup">

      {/* HEADER */}
      <div className="checkup-header">
        <div className="checkup-left">
            <img
            src={self}
            alt="Self Checkup"
            className="checkup-header-image"
            />
        </div>

        <div className="checkup-right">
            <h1 className="checkup-title">Self Health Checkup</h1>

            <p className="checkup-description">
            Regular self-checkups help you stay aware of your daily health condition without needing constant clinical visits. By observing your vital signs—such as heart rate, breathing pattern, temperature, and blood pressure—you can spot early changes that may indicate stress, fatigue, or underlying health issues. Practicing these simple techniques at home empowers you to monitor your well-being, detect problems early, and take proactive steps toward a healthier lifestyle.
            </p>
        </div>
    </div>

      {/* METHODS SECTION */}
      <div className="methods-header">
        <h2 className="methods-title">Self Checkup Methods</h2>

        <div className="methods-grid">
            {methods.map((method, index) => {
              const imagePath = require(`../../assets/images/${method.image}`);

              return (
                <MethodCard
                    key={index}
                    title={method.title}
                    //image={`${API_URL}/assets/images/${method.image}`}
                    image={imagePath}
                    description={method.description}
                />
              )
            })}
        </div>
      </div>
    </div>
  );
};

export default SelfCheck;
