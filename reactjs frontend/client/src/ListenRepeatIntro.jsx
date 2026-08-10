import React, { useEffect } from "react";


function ListenRepeatIntro({ onNext }) {

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
          Listen & Repeat
        </h1>

        

      </div>

    </div>

  );

}

export default ListenRepeatIntro;