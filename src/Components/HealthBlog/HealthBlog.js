import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import "./HealthBlog.css";

import meal from "../../assets/images/meal.svg";
import exercise from "../../assets/images/exercise.svg";
import self from "../../assets/images/self.svg";

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
    <div className="healthblog-container">
      {/* Page Title */}
      <h1 className="hb-title">Health Blog</h1>
      <p className="hb-subtitle">
        Stay informed with medical news, training videos, and daily health tips.
      </p>

      {/* Search Bar */}
      <div className="hb-searchbar">
        <input
            type="text"
            placeholder="Search videos and tips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
        </div>

      {/* Category Tabs */}
      <div className="hb-categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`hb-category-btn ${
              activeCategory === cat ? "active" : ""
            }`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Videos Section */}
      <div className="hb-videos-section">
        <div className="hb-videos-grid">

            {filteredVideosBySearch.length === 0 && (
                <p className="no-results">No videos found.</p>
            )}

            {filteredVideosBySearch.slice(0, visibleCount).map((video, index) => {
              console.log("Rendering video card:", video);
              const thumb = require(`../../assets/images/${video.thumbnail}`);
              console.log("Thumbnail path:", thumb);

              return (
                <div key={index} className="hb-video-card">
                    <img src={thumb} alt={video.title} />

                    <h3>{video.title}</h3>

                    <p>
                    {expandedVideo === index
                        ? video.description
                        : video.description.slice(0, 80) + "..."}
                    </p>

                    <button className="read-more-btn" onClick={() =>
                        setExpandedVideo(
                        expandedVideo === index ? null : index
                        )
                    }>{expandedVideo === index ? "Read Less" : "Read More"}</button>

                    <button className="watch-btn" onClick={() => setSelectedVideo(video.videofile)}>Watch Video</button>
                </div>
              )
            })}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredVideosBySearch.length && (
            <div className="load-more-container">
              <button
                  className="load-more-btn"
                  onClick={() => setVisibleCount(visibleCount + 3)}
              >
                  Load More
              </button>
            </div>
        )}
      </div>      

      {/* Daily Tips Section */}
      <div className="hb-tips-section">
        <h2 className="tips-title">Daily Health Tips</h2>
        <div className="hb-tips-list">

            {tips.length === 0 && (
                <p className="no-results">No daily tips found.</p>
            )}

            {tips.map((tip, index) => (
            <div key={index} className="hb-tip-card">
                <div
                className="hb-tip-header"
                onClick={() =>
                    setExpandedTip(expandedTip === index ? null : index)
                }
                >
                <h3>{tip.title}</h3>
                <span>{expandedTip === index ? "−" : "+"}</span>
                </div>

                {expandedTip === index && (
                <p className="hb-tip-content">{tip.description}</p>
                )}
            </div>
            ))}
        </div>
      </div>    

      {selectedVideo && (
        <div className="video-modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>            
            <button className="video-close-btn" onClick={() => setSelectedVideo(null)}>x</button>
            <video width="100%" controls autoPlay>
              <source src={require(`../../assets/videos/${selectedVideo}`)} type="video/mp4" />
            </video>
          </div>
        </div>
      )}

    </div>
  );
};

export default HealthBlog;
