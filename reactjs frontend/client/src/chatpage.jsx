import React, { useState, useEffect } from "react";

import teacher1 from "./assets/teacher1.png";
import teacher2 from "./assets/teacher2.png";
import teacher3 from "./assets/teacher3.png";
import teacher4 from "./assets/teacher4.png";

import chatBg from "./assets/chatbg.jpeg";

function ChatPage({ onBack, userName, setUserName, onStartLesson }) {
  const teacherFrames = [teacher1, teacher2, teacher3, teacher4];

  const [frame, setFrame] = useState(0);
  const [screen, setScreen] = useState("mic");
  const [teacherText, setTeacherText] = useState("");
  const [studentName, setStudentName] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [step, setStep] = useState(0);

  // ✅ Common intro lines
  const INTRO_LINES = [
    "Hello! I'm your English teacher, Miss Uroosa. What's your name?",
    "Hi there! I'm Miss Uroosa, your English teacher. Tell me your name?",
    "Hello! Miss Uroosa here. Let's start — what's your name?"
  ];

  // Stop voice when component unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Teacher animation
  useEffect(() => {
    if (!isSpeaking) {
      setFrame(0);
      return;
    }
    const interval = setInterval(() => {
      setFrame(prev => (prev + 1) % teacherFrames.length);
    }, 350);
    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Calling screen → after 3 sec go to intro
  useEffect(() => {
    if (screen === "calling") {
      const timer = setTimeout(() => {
        setScreen("intro");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  const speak = (text, callback) => {
    window.speechSynthesis.cancel();
    setTeacherText(text);
    setIsSpeaking(true);

    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.9;
    speech.pitch = 1.3;
    speech.volume = 1;

    // ✅ Ensure voices are loaded
    let voices = window.speechSynthesis.getVoices();
    if (!voices.length) {
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
      };
    }

    const femaleVoice =
      voices.find(v => v.name.toLowerCase().includes("female")) ||
      voices.find(v => v.name.includes("Samantha")) ||
      voices.find(v => v.name.includes("Zira")) ||
      voices.find(v => v.name.includes("Google UK English Female")) ||
      voices[0];

    if (femaleVoice) {
      speech.voice = femaleVoice;
    }

    speech.onend = () => {
      setIsSpeaking(false);
      if (callback) callback();
    };

    window.speechSynthesis.speak(speech);
  };

  const extractName = (sentence) => {
    let name = sentence.toLowerCase();
    name = name.replace("my name is", "")
               .replace("i am", "")
               .replace("this is", "")
               .replace("myself", "")
               .replace("call me", "")
               .trim();
    if (name.length > 0) {
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }
    return name;
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition Not Supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();

    recognition.onresult = (event) => {
      const answer = event.results[0][0].transcript.toLowerCase();

      if (step === 0) {
        const cleanName = extractName(answer);
        setStudentName(cleanName);
        setUserName(cleanName);

        speak(`Hi ${cleanName}, how are you today?`, () => setStep(1));
      } else if (step === 1) {
        if (
          answer.includes("good") ||
          answer.includes("fine") ||
          answer.includes("great") ||
          answer.includes("well") ||
          answer.includes("nice") ||
          answer.includes("okay")
        ) {
          speak("Great. Let's start today's lesson.", () => {
            window.speechSynthesis.cancel();
            onStartLesson?.();
          });
        } else {
          speak("Sorry, I don't get it. Let's start today's lesson.", () => {
            window.speechSynthesis.cancel();
            onStartLesson?.();
          });
        }
      }
    };
  };

  const startConversation = () => {
    const randomLine = INTRO_LINES[Math.floor(Math.random() * INTRO_LINES.length)];
    speak(randomLine);
  };

  // ✅ Trigger intro when screen = intro
  useEffect(() => {
    if (screen === "intro" && step === 0) {
      startConversation();
    }
  }, [screen, step]);

  return (
    <div className="chat-page">
      <img src={chatBg} alt="" className="chat-bg-img" />
      <div className="chat-overlay"></div>

      <button
        className="chat-back"
        onClick={() => {
          window.speechSynthesis.cancel();
          onBack();
        }}
      >
        ← Back
      </button>

      {screen === "mic" && (
        <div className="chat-card">
          <h1 className="mic-title">Let's check your Microphone</h1>
          <img src={teacherFrames[frame]} alt="" className="teacher-img-large" />
          <h2 className="hello-text">Say Hello !</h2>
          <p className="speak-text">Speak to test microphone</p>
          <div className="voice-line"></div>
          <button className="call-btn" onClick={() => setScreen("calling")}>
            📞 Call Miss Uroosa
          </button>
        </div>
      )}

      {screen === "calling" && (
        <div className="calling-screen">
          <img src={teacherFrames[frame]} alt="" className="calling-teacher" />
          <h1 className="calling-title">Calling Miss Uroosa...</h1>
        </div>
      )}

      {screen === "intro" && (
        <div className="intro-screen">
          <button
            className="skip-btn"
            onClick={() => {
              window.speechSynthesis.cancel();
              setIsSpeaking(false);
              setTeacherText("");
              onStartLesson?.();
            }}
          >
            Skip →
          </button>

          <img
            src={teacherFrames[frame]}
            alt=""
            className={isSpeaking ? "intro-teacher speaking" : "intro-teacher"}
          />

          {teacherText && !isSpeaking && step < 2 && (
            <div style={{ marginTop: "20px" }}>
              <button className="mic-btn" onClick={startListening}>
                🎤
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatPage;
