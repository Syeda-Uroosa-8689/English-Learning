import React, { useEffect } from "react";

function VocabularyIntro({ onNext, lesson }) {

  useEffect(() => {

    const timer = setTimeout(() => {
      onNext();
    }, 4000);

    return () => clearTimeout(timer);

  }, [onNext]);

  return (

    <div className="vocab-screen">

      <div className="blue-card">

        <h1>
          Practice Vocabulary &
          <br />
          Pronunciation
        </h1>

        <h2>
          Describing Food &
          Giving Feedback
        </h2>

        <h3>
          with Miss Uroosa
        </h3>

      </div>

    </div>

  );

}

export default VocabularyIntro;