import React, { useEffect } from "react";
import teacher from "./assets/teacher1.png";
import schoolImg from "./assets/jungle_school.png";
import restaurantImg from "./assets/jungle_restaurant.png";
import locationIcon from "./assets/location_icon.png";

function JourneyToRestaurant({ onNext }) {
  useEffect(() => {
    const speech = new SpeechSynthesisUtterance("Good work! Now let's go to the restaurant and order food.");
    speech.rate = 0.9;
    speech.pitch = 1.05;
    speech.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    speech.voice =
      voices.find((v) => v.name.includes("Zira")) ||
      voices.find((v) => v.name.includes("Samantha")) ||
      voices[0];
    window.speechSynthesis.speak(speech);

    const timer = setTimeout(() => {
      onNext();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="journey-page">
      <img src={teacher} alt="Teacher" className="teacher-avatar" />

      <div className="journey-scene">
        <img src={schoolImg} alt="School" className="journey-school" />
        <div className="journey-road">
          <img src={locationIcon} alt="Location" className="journey-location" />
        </div>
        <img src={restaurantImg} alt="Restaurant" className="journey-restaurant" />
      </div>
    </div>
  );
}

export default JourneyToRestaurant;
