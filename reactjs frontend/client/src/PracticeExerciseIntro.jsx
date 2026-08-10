import React, { useEffect, useState } from "react";
import teacher from "./assets/teacher1.png";

function PracticeExerciseIntro({ onNext }) {
  const intros = [
    "Wonderful! You did a great job in the Listen and Repeat activity. Now let's practice using restaurant sentences. You'll see a sentence with a missing word. Simply drag the correct word into the blank. Let's begin!",
    "Excellent work! Now it's time for some practice. Read the waiter's question carefully, then drag the correct word to complete the sentence. Let's get started!",
    "Amazing! Now we'll practice restaurant English. Complete each sentence by dragging the correct word into the blank. Ready? Let's begin!"
  ];

  const [intro] = useState(intros[Math.floor(Math.random() * intros.length)]);

  useEffect(() => {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(intro);
    speech.rate = 0.9;
    speech.pitch = 1.05;
    speech.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    speech.voice =
      voices.find((v) => v.name.includes("Zira")) ||
      voices.find((v) => v.name.includes("Google UK English Female")) ||
      voices.find((v) => v.name.includes("Samantha")) ||
      voices[0];

    speech.onend = () => {
      setTimeout(() => {
        onNext();
      }, 700);
    };

    window.speechSynthesis.speak(speech);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [intro, onNext]);

  return (
    <div className="practice-intro-screen">
      <img src={teacher} alt="Teacher" className="teacher-big" />
      
    </div>
  );
}

export default PracticeExerciseIntro;
