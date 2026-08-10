import React, { useEffect, useState } from "react";
import teacher from "./assets/teacher1.png";
import waiterImg from "./assets/waiter.jpeg"; 

function PracticeExercisePage({ data, current, total, onNext, onSkip }) {
  const [teacherText, setTeacherText] = useState("");
  const [words, setWords] = useState([]);
  const [filledSentence, setFilledSentence] = useState([...data.sentenceStructure]);

  // Male waiter voice
  const speakWaiter = (text) => {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.9;
    speech.pitch = 1.0;
    speech.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    speech.voice =
      voices.find((v) => v.name.includes("Google UK English Male")) ||
      voices.find((v) => v.name.includes("Daniel")) ||
      voices[0];

    window.speechSynthesis.speak(speech);
  };

  // Teacher feedback voice
  const speakTeacher = (text) => {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.95;
    speech.pitch = 1.05;
    speech.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    speech.voice =
      voices.find((v) => v.name.includes("Zira")) ||
      voices.find((v) => v.name.includes("Samantha")) ||
      voices[0];
    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    setTeacherText("");
    setWords([...data.options]);
    setFilledSentence([...data.sentenceStructure]);
    speakWaiter(data.waiter);
  }, [data]);

  const handleDrop = (word, index) => {
    const newSentence = [...filledSentence];
    newSentence[index] = word;
    setFilledSentence(newSentence);

    const remaining = words.filter((w) => w !== word);
    setWords(remaining);

    // Check if all blanks filled
    if (!newSentence.includes("____")) {
      const userSentence = newSentence.join(" ");
      const correctSentence = data.sentenceStructure.map((part, i) =>
        part === "____" ? data.correctWords[i] : part
      ).join(" ");

      const isCorrect = data.correctWords.every((w) =>
        userSentence.toLowerCase().includes(w.toLowerCase())
      );

      if (isCorrect) {
        setTeacherText("✅ Excellent! Correct sentence.");
        speakTeacher("Excellent! Correct sentence.");
        setTimeout(() => onNext(), 1200);
      } else {
        setTeacherText(`❌ Oops! Try again. The correct sentence is: ${correctSentence}`);
        speakTeacher(`Oops! Try again. The correct sentence is: ${correctSentence}`);
        // Reset for retry
        setWords([...data.options]);
        setFilledSentence([...data.sentenceStructure]);
      }
    }
  };

  return (
    <div className="practice-page">
      {/* Header bar */}
      <div className="practice-header">
        <h2>Practice Exercise</h2>
        <div className="practice-progress">{current}/{total}</div>
        <button className="skip-btn" onClick={onSkip}>Skip ➡</button>
      </div>

      {/* Characters row */}
      <div className="characters-row">
        {/* Waiter left */}
        <div className="waiter-side">
          <img src={waiterImg} alt="Waiter" className="waiter-avatar" />
          <div className="waiter-bubble">{data.waiter}</div>
        </div>

        {/* Teacher right */}
        <div className="teacher-side">
          <img src={teacher} alt="Teacher" className="teacher-avatar" />
          <div className="teacher-bubble">{teacherText}</div>
        </div>
      </div>

      {/* Sentence */}
      <div className="sentence-drop-box">
        {filledSentence.map((part, index) =>
          part === "____" ? (
            <span
              key={index}
              className="blank"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e.dataTransfer.getData("word"), index)}
            >
              ___
            </span>
          ) : (
            <span key={index}>{part} </span>
          )
        )}
      </div>

      {/* Words */}
      <div className="word-container">
        {words.map((word, index) => (
          <div
            key={index}
            className="drag-word"
            draggable
            onDragStart={(e) => e.dataTransfer.setData("word", word)}
          >
            {word}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PracticeExercisePage;
