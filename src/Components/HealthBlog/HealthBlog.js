import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import "./HealthBlog.css";

//import meal from "../../assets/images/meal.svg";
//import exercise from "../../assets/images/exercise.svg";
//import self from "../../assets/images/self.svg";

const categories = [
  "All",
  "Fitness",
  "Diabetes",
  "Heart",
  "Yoga",
  "Diet",
  "Nutrition",
  "Mental Health",
];

/*
const sampleVideos = [
  {    
    category: "Fitness",
    title: "10 Minute Morning Stretch Routine",
    thumbnail: exercise,
    description:
      "A simple stretching routine to relax your muscles and improve flexibility. Can be done by anyone and boosts overall energy.",
  },
  {    
    category: "Diet",
    title: "Healthy Food Plate Explained",
    thumbnail: meal,
    description:
      "Learn what a healthy balanced meal looks like and how to build healthier eating habits.",
  },
  {    
    category: "Heart",
    title: "Understanding Blood Pressure",
    thumbnail: self,
    description:
      "This video explains the basics of blood pressure, why it rises, and how to manage it daily.",
  },
];

const sampleTips = [
  {
    title: "Drink 8 Glasses of Water Daily",
    content:
      "Proper hydration boosts metabolism, improves skin health, and helps maintain energy throughout the day.",
  },
  {    
    title: "Do 30 Minutes of Walking",
    content:
      "Walking daily reduces stress, improves heart health, and keeps your weight in control.",
  },
  {    
    title: "Practice Deep Breathing",
    content:
      "Deep breathing reduces anxiety, increases oxygen flow, and improves mental clarity.",
  },
];
*/

const HealthBlog = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [visibleCount, setVisibleCount] = useState(2);
    const [expandedVideo, setExpandedVideo] = useState(null);
    const [expandedTip, setExpandedTip] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [tips, setTips] = useState([]);

    useEffect(() => {
        setVisibleCount(3);
    }, [activeCategory, searchQuery]);

    useEffect(() => {
      fetch(`${API_URL}/api/healthblog`)
        .then(res => res.json())
        .then(data => {
          console.log("HealthBlog API response:", data);
          setVideos(data);
        })
        .catch(err => console.error("Error loading health videos:", err));

      fetch(`${API_URL}/api/healthtips`)
        .then(res => res.json())
        .then(data => setTips(data))
        .catch(err => console.error("Error loading health tips:", err));
    }, []);    

    const filteredVideos =
      activeCategory === "All"
        ? videos
        : videos.filter((v) => v.category === activeCategory);

    const filteredVideosBySearch = filteredVideos.filter(
        (v) =>
            v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    console.log("All Videos:", videos);
    console.log("Filtered Videos:", filteredVideos);
    console.log("Search Filter Result:", filteredVideosBySearch);

  return (
    <div className="max-w-5xl mx-auto px-0">

      {/* Title */}
      <div className="text-center mb-5 md:mb-10">
        <h1 className="text-3xl font-bold text-blue-600 tracking-wide mb-1 md:mb-3">Health Blog</h1>
        <p className="text-gray-600 text-sm md:text-base mb-0">
          Stay informed with medical news, training videos, and daily health tips.
        </p>
      </div>

      {/* Search */}
      <div className="text-center mb-6">
        <input
          type="text"
          placeholder="Search videos and tips..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex md:justify-center gap-3 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition 
              ${activeCategory === cat ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* VIDEOS SECTION */}
      <div className="mb-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

          {filteredVideosBySearch.length === 0 && (
            <p className="text-center text-gray-500 col-span-full">No videos found.</p>
          )}

          {filteredVideosBySearch.slice(0, visibleCount).map((video, index) => {
            const thumb = require(`../../assets/images/${video.thumbnail}`);
            return (
              <div key={index} className="bg-white border border-gray-300 rounded-xl shadow-md p-4">

                <img
                  src={thumb}
                  alt={video.title}
                  className="w-full h-48 object-contain rounded-md mb-3"
                />

                <h3 className="text-lg font-semibold mb-2">{video.title}</h3>

                <p className="text-sm text-gray-600">
                  {expandedVideo === index
                    ? video.description
                    : video.description.slice(0, 80) + "..."}
                </p>

                <div className="flex gap-3 mt-3">
                  <button
                    className="flex-1 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                    onClick={() =>
                      setExpandedVideo(expandedVideo === index ? null : index)
                    }
                  >
                    {expandedVideo === index ? "Read Less" : "Read More"}
                  </button>

                  <button
                    className="flex-1 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    onClick={() => setSelectedVideo(video.videofile)}
                  >
                    Watch Video
                  </button>
                </div>


              </div>
            );
          })}

        </div>

        {/* Load More */}
        {visibleCount < filteredVideosBySearch.length && (
          <div className="text-center mt-6">
            <button
              className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
              onClick={() => setVisibleCount(visibleCount + 3)}
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {/* DAILY TIPS SECTION */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Daily Health Tips</h2>

        <div>

          {tips.length === 0 && (
            <p className="text-center text-gray-500">No daily tips found.</p>
          )}

          {tips.map((tip, index) => (
            <div key={index} className="bg-white border border-gray-300 px-4 py-2 md:py-4 rounded-lg shadow mb-3">

              <div
                className="flex justify-between cursor-pointer"
                onClick={() => setExpandedTip(expandedTip === index ? null : index)}
              >
                <h3 className="font-semibold mt-1">{tip.title}</h3>
                <span className="text-xl font-bold select-none">
                  {expandedTip === index ? "−" : "+"}
                </span>
              </div>

              {expandedTip === index && (
                <p className="mt-2 text-gray-700 text-sm">{tip.description}</p>
              )}

            </div>
          ))}

        </div>
      </div>

      {/* VIDEO MODAL */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative bg-white rounded-xl w-[90%] max-w-3xl p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-3 right-3 bg-blue-600 text-white rounded-full w-8 h-8 flex justify-center items-center hover:bg-blue-700 transition cursor-pointer z-10"
            >
              ×
            </button>

            {/* Video Player */}
            <video controls autoPlay className="w-full rounded-lg">
              <source
                src={require(`../../assets/videos/${selectedVideo}`)}
                type="video/mp4"
              />
            </video>

          </div>
        </div>
      )}


    </div>

  );
};

export default HealthBlog;
