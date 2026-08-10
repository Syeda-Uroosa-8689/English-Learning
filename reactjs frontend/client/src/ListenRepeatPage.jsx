import React, { useState, useEffect } from "react";
import teacher from "./assets/teacher1.png";

function ListenRepeatPage({ data, current, total, onNext, onSkip }) {
  const [stage, setStage] = useState(0);
  const [teacherText, setTeacherText] = useState("");
  const [userSentence, setUserSentence] = useState("");
  const [listening, setListening] = useState(false);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  // Speak function
  const speak = (text, callback) => {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
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
      if (callback) callback();
    };

    window.speechSynthesis.speak(speech);
  };

  // Load new sentence
  useEffect(() => {
    setStage(0);
    setTeacherText(data.sentence);
    setUserSentence("");
    setListening(false);
    speak(data.sentence);
  }, [data]);

  // Stage 0: User repeats
  const startRepeatRecognition = () => {
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }
    setListening(true);
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();

    recognition.onresult = () => {
      setListening(false);
      setStage(1);
      teacherCompleteSentence();
    };
  };

  // Teacher instruction
  const teacherCompleteSentence = () => {
    const msg =
      "Now let's complete the sentence. Please repeat the complete sentence with your choice.";
    setTeacherText(msg);
    speak(msg);
  };

  // Stage 1: User speaks full sentence
  const startFinalRecognition = () => {
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }
    setListening(true);
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();

    recognition.onresult = (event) => {
      setListening(false);
      let text = event.results[0][0].transcript;
      setUserSentence(text);

      // Check if user used any valid option word
      const isCorrect = data.options.some((opt) =>
        text.toLowerCase().includes(opt.toLowerCase())
      );

      // If user used any option → next page
      if (isCorrect) {
        correctAnswer();
      } else {
        // Even if wrong, still move on
        correctAnswer();
      }
    };

    recognition.onerror = () => {
      setListening(false);
      correctAnswer();
    };
  };

  // Correct answer (always moves on)
  const correctAnswer = () => {
    setTeacherText("Great! Let's move on to the next sentence.");
    speak("Great! Let's move on to the next sentence.", () => {
      setTimeout(() => {
        onNext();
      }, 1000);
    });
  };

  // UI
  return (
    <div className="listen-repeat-page">
      <div className="listen-header">
        <h2>Listen & Repeat</h2>
        <div className="listen-progress">
          {current}/{total}
        </div>
        {/* Skip Button */}
        <button className="skip-btn" onClick={onSkip}>
          Skip ➡
        </button>
      </div>

      <img src={teacher} alt="" className="teacher-avatar" />

      {teacherText !== "" && (
        <div className="teacher-bubble">{teacherText}</div>
      )}

      {stage === 0 && (
        <div className="sentence-card">
          <h1>{data.sentence}</h1>
          <button
            className={`listen-mic-btn ${listening ? "active" : ""}`}
            onClick={startRepeatRecognition}
          >
            🎤
          </button>
        </div>
      )}

      {stage === 1 && (
        <div className="sentence-card">
          <h1>{data.blank}</h1>
          <div className="option-row">
            {data.options.map((option, index) => (
              <div key={index} className="option-box">
                {option}
              </div>
            ))}
          </div>
          <button
            className={`listen-mic-btn ${listening ? "active" : ""}`}
            onClick={startFinalRecognition}
          >
            🎤
          </button>
        </div>
      )}
    </div>
  );
}

export default ListenRepeatPage;
