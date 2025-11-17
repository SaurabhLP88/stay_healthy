import React, { useState } from "react";
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

const sampleVideos = [
  {
    id: 1,
    category: "Fitness",
    title: "10 Minute Morning Stretch Routine",
    thumbnail: exercise,
    description:
      "A simple stretching routine to relax your muscles and improve flexibility. Can be done by anyone and boosts overall energy.",
  },
  {
    id: 2,
    category: "Diet",
    title: "Healthy Food Plate Explained",
    thumbnail: meal,
    description:
      "Learn what a healthy balanced meal looks like and how to build healthier eating habits.",
  },
  {
    id: 3,
    category: "Heart",
    title: "Understanding Blood Pressure",
    thumbnail: self,
    description:
      "This video explains the basics of blood pressure, why it rises, and how to manage it daily.",
  },
];

const sampleTips = [
  {
    id: 1,
    title: "Drink 8 Glasses of Water Daily",
    content:
      "Proper hydration boosts metabolism, improves skin health, and helps maintain energy throughout the day.",
  },
  {
    id: 2,
    title: "Do 30 Minutes of Walking",
    content:
      "Walking daily reduces stress, improves heart health, and keeps your weight in control.",
  },
  {
    id: 3,
    title: "Practice Deep Breathing",
    content:
      "Deep breathing reduces anxiety, increases oxygen flow, and improves mental clarity.",
  },
];

const HealthBlog = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [visibleCount, setVisibleCount] = useState(2);
    const [expandedVideo, setExpandedVideo] = useState(null);
    const [expandedTip, setExpandedTip] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    React.useEffect(() => {
        setVisibleCount(2);
    }, [activeCategory, searchQuery]);

    const filteredVideos =
    activeCategory === "All"
        ? sampleVideos
        : sampleVideos.filter((v) => v.category === activeCategory);

    const filteredVideosBySearch = filteredVideos.filter(
        (v) =>
            v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredTips = sampleTips.filter(
        (t) =>
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

            {filteredVideosBySearch.slice(0, visibleCount).map((video) => (
            <div key={video.id} className="hb-video-card">
                <img src={video.thumbnail} alt={video.title} />

                <h3>{video.title}</h3>

                <p>
                {expandedVideo === video.id
                    ? video.description
                    : video.description.slice(0, 80) + "..."}
                </p>

                <button
                className="read-more-btn"
                onClick={() =>
                    setExpandedVideo(
                    expandedVideo === video.id ? null : video.id
                    )
                }
                >
                {expandedVideo === video.id ? "Read Less" : "Read More"}
                </button>

                <button className="watch-btn">Watch Video</button>
            </div>
            ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredVideosBySearch.length && (
            <div className="load-more-container">
            <button
                className="load-more-btn"
                onClick={() => setVisibleCount(visibleCount + 2)}
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

            {filteredTips.length === 0 && (
                <p className="no-results">No daily tips found.</p>
            )}

            {filteredTips.map((tip) => (
            <div key={tip.id} className="hb-tip-card">
                <div
                className="hb-tip-header"
                onClick={() =>
                    setExpandedTip(expandedTip === tip.id ? null : tip.id)
                }
                >
                <h3>{tip.title}</h3>
                <span>{expandedTip === tip.id ? "−" : "+"}</span>
                </div>

                {expandedTip === tip.id && (
                <p className="hb-tip-content">{tip.content}</p>
                )}
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default HealthBlog;
