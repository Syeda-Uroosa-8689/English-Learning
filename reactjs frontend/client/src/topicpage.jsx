import React from "react";
import topicBg from "../topicpage.jpeg";
import topicsData from "./topics.json"; 

function TopicPage({ onSelectTopic, onBack }) {

  const handleTopicClick = (topic) => {
    onSelectTopic(topic);
  };

  return (
    <div className="tp-page">
      <button
        className="tp-back-btn"
        onClick={onBack}
      >
        ← Back
      </button>

      <div className="tp-image-wrapper">
        <img src={topicBg} className="tp-bg-image" alt="" />

        <div className="tp-topic-container">
          {topicsData.topics.map((topic) => (
            <div
              key={topic.id}
              className="tp-topic-row"
              onClick={() => handleTopicClick(topic)}
            >
              <div
                className="tp-topic-number"
                style={{
                  background: "#9b8a57"
                }}
              >
                {topic.id}
              </div>

              <div className="tp-topic-title">
                {topic.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopicPage;
