import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import MethodCard from "./MethodCard";
import "./SelfCheck.css";
import selfImg from "../../assets/images/self.svg";

interface SelfCheckMethod {
  title: string;
  image: string;
  description: string;
}

const SelfCheck: React.FC = () => {
  const [methods, setMethods] = useState<SelfCheckMethod[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/selfCheck`)
      .then((res) => res.json())
      .then((data) => setMethods(data))
      .catch((err) => console.error("Error loading methods:", err));
  }, []);

  return (
    <div className="px-1">

      {/* HEADER */}
      <div className="bg-blue-50 p-6 rounded-xl flex flex-col md:flex-row items-center gap-6 mb-8">

        {/* Left Image */}
        <div className="flex-1">
          <img
            src={selfImg}
            alt="Self Checkup"
            className="w-full h-auto object-cover rounded-md"
          />
        </div>

        {/* Right Text */}
        <div className="flex-1 md:flex-[4] text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-3">
            Self Health Checkup
          </h1>

          <p className="text-gray-800 text-sm md:text-base leading-relaxed">
            Regular self-checkups help you stay aware of your daily health condition without
            needing constant clinical visits. By observing your vital signs—such as heart rate,
            breathing pattern, temperature, and blood pressure—you can spot early changes that
            may indicate stress, fatigue, or underlying health issues. Practicing these simple
            techniques at home empowers you to monitor your well-being, detect problems early,
            and take proactive steps toward a healthier lifestyle.
          </p>
        </div>
      </div>

      {/* METHODS SECTION */}
      <div className="text-center mb-5">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Self Checkup Methods</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mt-4">

          {methods.map((method, index) => {
            const imagePath = require(`../../assets/images/${method.image}`);
            return (
              <MethodCard
                key={index}
                title={method.title}
                image={imagePath}
                description={method.description}
              />
            );
          })}

        </div>
      </div>

    </div>

  );
};

export default SelfCheck;
