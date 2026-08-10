import React, { useEffect } from "react";

function PracticeIntro({ onNext }) {

  useEffect(() => {

    const timer = setTimeout(() => {

      onNext();

    }, 4000);

    return () => clearTimeout(timer);

  }, [onNext]);

  return (

    <div className="listen-screen">

      <div className="listen-card">

        <h1>

          Practice Exercise

        </h1>

      </div>

    </div>

  );

}

export default PracticeIntro;