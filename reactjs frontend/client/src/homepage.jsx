import React from "react";

function HomePage({ onStart }) {
  return (
    <div className="home-container">

      <div className="home-content">

        <div className="star">
          ⭐
        </div>

        <h1>
          <span className="blue">Syeda</span>
          <br />
          <span className="orange">Career Guide</span>
        </h1>

        <p>
          Discover your true potential and
          <br />
          shape your <span>future.</span>
        </p>

        <button onClick={onStart}>
          Start Journey 
        </button>

      </div>

    </div>
  );
}

export default HomePage;