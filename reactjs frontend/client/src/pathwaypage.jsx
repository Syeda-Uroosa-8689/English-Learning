import React from 'react';


import listenImg from "../listen and repeat.jpeg";
import speakImg from "../speak.jpeg";
import interactImg from "../interact.jpeg";




function PathwayPage({ onBack, onSelectMode }) {
  return (
    <div className="pathway-main-container">
      {/* ⬅ Back Button */}
      <button className="pathway-back-btn" onClick={onBack}>
        ⬅ Back
      </button>

      {/* 👑 Top Headings */}
      <div className="pathway-title-wrapper">
        <h6 className="pathway-main-title">
          Pathway 1: Becoming Real-Life Communicators
        </h6>
        <br />
        <p className="pathway-main-subtitle">
          This pathway focuses on helping students use English confidently in everyday situations.
        </p>
      </div>

      {/* 📑 3 Cards Grid Layout */}
      <div className="pathway-cards-row">
        
        {/* Card 1: LISTEN & REPEAT */}
        <div className="pathway-ui-card" onClick={() => onSelectMode('listen-repeat')}>
          <div className="ui-card-header-banner">LISTEN & REPEAT</div>
          <div className="ui-card-inner-box">
            <div className="ui-card-img-frame">
<img src={listenImg} alt="Listen and Repeat" className="ui-card-source-img" />            </div>
            <p className="ui-card-bottom-desc">
              Learning by Listening and repeating clear examples.
            </p>
          </div>
        </div>

        {/* Dynamic Arrow 1 */}
        <div className="ui-flow-arrow">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#164fa3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Card 2: SPEAK */}
        <div className="pathway-ui-card" onClick={() => onSelectMode('speak')}>
          <div className="ui-card-header-banner">SPEAK</div>
          <div className="ui-card-inner-box">
            <div className="ui-card-img-frame">
              <img src={speakImg} alt="Speak" className="ui-card-source-img" />
            </div>
            <p className="ui-card-bottom-desc">
              Expressing thoughts using learned language.
            </p>
          </div>
        </div>

        {/* Dynamic Arrow 2 */}
        <div className="ui-flow-arrow">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#164fa3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Card 3: INTERACT */}
        <div className="pathway-ui-card" onClick={() => onSelectMode('interact')}>
          <div className="ui-card-header-banner">INTERACT</div>
          <div className="ui-card-inner-box">
            <div className="ui-card-img-frame">
             <img src={interactImg} alt="Interact" className="ui-card-source-img" />
            </div>
            <p className="ui-card-bottom-desc">
              Communicating with others in meaningful exchanges.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PathwayPage;