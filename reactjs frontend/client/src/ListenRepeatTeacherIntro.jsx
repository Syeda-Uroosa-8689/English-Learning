import React, { useEffect, useState } from "react";
import teacher from "./assets/teacher1.png";

function ListenRepeatTeacherIntro({ onNext }) {

  const intros = [

    "Hello! I'm your English teacher, Miss Uroosa. Today we'll practice Listen and Repeat together. We'll learn useful restaurant English sentences. Listen carefully and repeat after me. Are you ready to begin?",

    "Hi! I'm Miss Uroosa. Today we'll practice some useful restaurant conversations. Listen carefully, repeat after me and improve your pronunciation. Let's get started!",

    "Hello! Welcome back. I'm Miss Uroosa. Today we're going to learn common restaurant sentences that you'll use in real conversations. Listen first and then repeat after me."

  ];

  const [randomIntro] = useState(

    intros[Math.floor(Math.random() * intros.length)]

  );

  useEffect(() => {

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(randomIntro);

    speech.rate = 0.9;
    speech.pitch = 1.05;
    speech.volume = 1;

    const voices = window.speechSynthesis.getVoices();

    speech.voice =
      voices.find(v => v.name.includes("Zira")) ||
      voices.find(v => v.name.includes("Google UK English Female")) ||
      voices.find(v => v.name.includes("Samantha")) ||
      voices[0];

    speech.onend = () => {

      setTimeout(() => {

        onNext();

      }, 800);

    };

    window.speechSynthesis.speak(speech);

    return () => {

      window.speechSynthesis.cancel();

    };

  }, [randomIntro, onNext]);

  return (

    <div className="teacher-intro-screen">

      <img
        src={teacher}
        alt="Teacher"
        className="teacher-big"
      />

    </div>

  );

}

export default ListenRepeatTeacherIntro;