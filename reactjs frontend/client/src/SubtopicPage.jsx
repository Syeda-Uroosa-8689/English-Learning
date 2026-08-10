import React from "react";
import background from "./assets/subtopicpage.jpeg";
import teacher from "./assets/teacher1.png";
import hut from "./assets/hut.png";
import start from "./assets/startboard.png";
import topicsData from "./topics.json";

function SubtopicPage({ onBack, onSelectTopic, selectedTopic }) {

  const topic = topicsData.topics.find(
    (t) => t.id === selectedTopic?.id
  );

  const lessons = topic?.subtopics || [];

  return (
    <div
      className="subtopic-page"
      style={{
        backgroundImage: `url(${background})`
      }}
    >
      <div className="overlay"></div>

      <button
        className="sb-back-btn"
        onClick={onBack}
      >
        ← Back
      </button>

      <h1 className="page-title">
        {topic?.title}
      </h1>

      <img
        src={teacher}
        alt=""
        className="teacher"
      />

      <img
        src={start}
        alt=""
        className="start-img"
      />

      <svg
        className="road"
        viewBox="0 0 1400 800"
        preserveAspectRatio="none"
      >
        <path d="M360 620 C430 560, 500 430, 600 390 C700 350, 800 420, 930 390 C1040 360, 1140 270, 1210 210" />
      </svg>

      {lessons.map((lesson, idx) => (

        <div
          key={lesson.id}
          className={`hut hut${idx + 1}`}
          onClick={() => onSelectTopic(lesson)}
        >

          <span className="level">
            {idx + 1}
          </span>

          <img
            src={hut}
            alt=""
          />

          <div className="card">
            {lesson.title}
          </div>

        </div>

      ))}

    </div>
  );
}

export default SubtopicPage;