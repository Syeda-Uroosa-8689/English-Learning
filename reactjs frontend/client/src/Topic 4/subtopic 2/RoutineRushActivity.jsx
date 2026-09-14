import React, { useEffect, useRef, useState } from "react";
import "./RoutineRushActivity.css";

import confetti from "canvas-confetti";

/* =====================================================
   IMAGES
===================================================== */

import bedroomBg from "../../assets/routineRushBedroom.jpeg";
import teacherImg from "../../assets/teacher1.png";

import wakeUpBoy from "../../assets/wakeUpBoy.png";
import brushTeeth from "../../assets/brushTeeth.png";
import breakfast from "../../assets/breakfast.png";
import getDressed from "../../assets/getDressed.png";
import packBag from "../../assets/packBag.png";
import shoes from "../../assets/shoes.jpeg";
import goToSchool from "../../assets/goToSchool.png";

import alarmClock from "../../assets/alarmClock.png";
import trophy from "../../assets/trophy.png";
import dayProgressIcons from "../../assets/dayProgressIcons.png";
import chatBg from "../../assets/chatbg.jpeg";

import yaySound from "../../assets/yay.mp3";

/* =====================================================
   ROUNDS
===================================================== */

const rounds = [
  {
    question: "What should you do first?",
    teacher: "Good morning, Explorer! It's time to start your day!",
    correct: "wake",
    options: [
      {
        id: "brush",
        text: "Brush my teeth",
        image: brushTeeth,
      },
      {
        id: "wake",
        text: "Wake up",
        image: wakeUpBoy,
      },
      {
        id: "breakfast",
        text: "Have breakfast",
        image: breakfast,
      },
    ],
  },
  {
    question: "What should you do next?",
    teacher: "Great start! Now let's get ready for the day.",
    correct: "brush",
    options: [
      {
        id: "wake",
        text: "Wake up",
        image: wakeUpBoy,
      },
      {
        id: "brush",
        text: "Brush my teeth",
        image: brushTeeth,
      },
      {
        id: "school",
        text: "Go to school",
        image: goToSchool,
      },
    ],
  },
  {
    question: "What should you do after brushing?",
    teacher: "You're doing wonderfully! What comes next?",
    correct: "breakfast",
    options: [
      {
        id: "dress",
        text: "Get dressed",
        image: getDressed,
      },
      {
        id: "bag",
        text: "Pack my bag",
        image: packBag,
      },
      {
        id: "breakfast",
        text: "Have breakfast",
        image: breakfast,
      },
    ],
  },
  {
    question: "What should you do after breakfast?",
    teacher: "You're doing great! What comes next?",
    correct: "dress",
    options: [
      {
        id: "shoes",
        text: "Put on my shoes",
        image: shoes,
      },
      {
        id: "dress",
        text: "Get dressed",
        image: getDressed,
      },
      {
        id: "wake",
        text: "Wake up",
        image: wakeUpBoy,
      },
    ],
  },
  {
    question: "What should you do before leaving?",
    teacher: "Your morning is going great! What comes next?",
    correct: "bag",
    options: [
      {
        id: "brush",
        text: "Brush my teeth",
        image: brushTeeth,
      },
      {
        id: "bag",
        text: "Pack my bag",
        image: packBag,
      },
      {
        id: "dress",
        text: "Get dressed",
        image: getDressed,
      },
    ],
  },
  {
    question: "What should you do next?",
    teacher: "You're nearly ready! Choose the next action.",
    correct: "shoes",
    options: [
      {
        id: "school",
        text: "Go to school",
        image: goToSchool,
      },
      {
        id: "shoes",
        text: "Put on my shoes",
        image: shoes,
      },
      {
        id: "breakfast",
        text: "Have breakfast",
        image: breakfast,
      },
    ],
  },
  {
    question: "What should you do last?",
    teacher: "Fantastic! One last step before your school day!",
    correct: "school",
    options: [
      {
        id: "bag",
        text: "Pack my bag",
        image: packBag,
      },
      {
        id: "dress",
        text: "Get dressed",
        image: getDressed,
      },
      {
        id: "school",
        text: "Go to school",
        image: goToSchool,
      },
    ],
  },
];

/* =====================================================
   COMPONENT
===================================================== */

function RoutineRushActivity({ onBack, onSkip, onFinish }) {
  const [screen, setScreen] = useState("intro");

  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const yayAudioRef = useRef(null);
  const speechTimeoutRef = useRef(null);
  const nextRoundTimeoutRef = useRef(null);
  const wrongAnswerTimeoutRef = useRef(null);

  // Ye ref purane answer ke callbacks ko next question par
  // galti se execute hone se rokega.
  const answerSequenceRef = useRef(0);

  const currentRound = rounds[roundIndex];

  const progress = finished
    ? 100
    : ((roundIndex + (selected ? 1 : 0)) / rounds.length) * 100;

  /* =====================================================
     CLEAR TIMERS
  ===================================================== */

  const clearAllTimers = () => {
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }

    if (nextRoundTimeoutRef.current) {
      clearTimeout(nextRoundTimeoutRef.current);
      nextRoundTimeoutRef.current = null;
    }

    if (wrongAnswerTimeoutRef.current) {
      clearTimeout(wrongAnswerTimeoutRef.current);
      wrongAnswerTimeoutRef.current = null;
    }
  };

  /* =====================================================
     LOAD YAY SOUND
  ===================================================== */

  useEffect(() => {
    yayAudioRef.current = new Audio(yaySound);
    yayAudioRef.current.preload = "auto";

    return () => {
      clearAllTimers();

      if (yayAudioRef.current) {
        yayAudioRef.current.pause();
        yayAudioRef.current.currentTime = 0;
      }

      if (
        typeof window !== "undefined" &&
        window.speechSynthesis
      ) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /* =====================================================
     FEMALE TEACHER VOICE
  ===================================================== */

  const speakTeacher = (text, onEnd) => {
    if (
      typeof window === "undefined" ||
      !window.speechSynthesis
    ) {
      if (typeof onEnd === "function") {
        onEnd();
      }

      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 0.88;
    utterance.pitch = 1.12;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();

    const femaleVoice =
      voices.find(
        (voice) =>
          voice.lang.toLowerCase().startsWith("en") &&
          /female|zira|samantha|karen|google us english/i.test(
            voice.name
          )
      ) ||
      voices.find((voice) =>
        voice.lang.toLowerCase().startsWith("en")
      );

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onend = () => {
      if (typeof onEnd === "function") {
        onEnd();
      }
    };

    utterance.onerror = () => {
      if (typeof onEnd === "function") {
        onEnd();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  /* =====================================================
     START CHALLENGE
  ===================================================== */

  const handleStartChallenge = () => {
    clearAllTimers();

    answerSequenceRef.current += 1;

    if (
      typeof window !== "undefined" &&
      window.speechSynthesis
    ) {
      window.speechSynthesis.cancel();
    }

    setScreen("activity");
    setRoundIndex(0);
    setScore(0);
    setSelected(null);
    setFeedback("");
    setFinished(false);
    setTimeLeft(60);
  };

  /* =====================================================
     TIMER
  ===================================================== */

  useEffect(() => {
    if (
      screen !== "activity" ||
      finished ||
      selected
    ) {
      return;
    }

    setTimeLeft(60);

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, roundIndex, finished, selected]);

  /* =====================================================
     SPEAK QUESTION ON EVERY ROUND
  ===================================================== */

  useEffect(() => {
    if (
      screen !== "activity" ||
      finished ||
      !currentRound
    ) {
      return;
    }

    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }

    speechTimeoutRef.current = setTimeout(() => {
      speakTeacher(
        `${currentRound.teacher} ${currentRound.question}`
      );
    }, 350);

    return () => {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
        speechTimeoutRef.current = null;
      }

      if (
        typeof window !== "undefined" &&
        window.speechSynthesis
      ) {
        window.speechSynthesis.cancel();
      }
    };
  }, [screen, roundIndex, finished]);

  /* =====================================================
     AUTOMATICALLY MOVE TO NEXT ROUND
  ===================================================== */

  const moveToNextRound = () => {
    if (nextRoundTimeoutRef.current) {
      clearTimeout(nextRoundTimeoutRef.current);
      nextRoundTimeoutRef.current = null;
    }

    if (roundIndex === rounds.length - 1) {
      setFinished(true);

      if (typeof onFinish === "function") {
        onFinish(score + 10);
      }

      return;
    }

    setRoundIndex((previousRound) => previousRound + 1);
    setSelected(null);
    setFeedback("");
    setTimeLeft(60);
  };

 /* =====================================================
   ANSWER
===================================================== */

const handleAnswer = (option) => {
  if (selected || finished) {
    return;
  }

  const currentAnswerSequence = answerSequenceRef.current + 1;
  answerSequenceRef.current = currentAnswerSequence;

  setSelected(option.id);

  /* =================================================
     CORRECT ANSWER
  ================================================= */

  if (option.id === currentRound.correct) {
    setScore((previousScore) => previousScore + 10);
    setFeedback("correct");

    const praiseText =
      roundIndex === rounds.length - 1
        ? "Excellent! You got the last answer correct!"
        : "Excellent! That's correct!";

    const teacherRemark =
      roundIndex === rounds.length - 1
        ? "Fantastic work, Explorer! You completed your morning routine!"
        : "You are doing a wonderful job. Let's continue!";

    /* ================= CONFETTI ================= */

    confetti({
      particleCount: 130,
      spread: 75,
      startVelocity: 35,
      origin: {
        x: 0.5,
        y: 0.55,
      },
    });

    /* =================================================
       TEACHER REMARK START FUNCTION
       Ye yay sound complete hone ke baad hi chalega.
    ================================================= */

    const startTeacherVoiceAfterYay = () => {
      if (
        answerSequenceRef.current !== currentAnswerSequence
      ) {
        return;
      }

      speakTeacher(praiseText, () => {
        if (
          answerSequenceRef.current !== currentAnswerSequence
        ) {
          return;
        }

        speakTeacher(teacherRemark, () => {
          if (
            answerSequenceRef.current !==
            currentAnswerSequence
          ) {
            return;
          }

          nextRoundTimeoutRef.current = setTimeout(() => {
            if (
              answerSequenceRef.current !==
              currentAnswerSequence
            ) {
              return;
            }

            moveToNextRound();
          }, 300);
        });
      });
    };

    /* =================================================
       YAY AUDIO
       Teacher voice onended ke baad hi start hogi.
    ================================================= */

    if (yayAudioRef.current) {
      const audio = yayAudioRef.current;

      audio.pause();
      audio.currentTime = 0;

      // Purana event remove karke naya event lagana
      audio.onended = null;

      audio.onended = () => {
        audio.onended = null;
        startTeacherVoiceAfterYay();
      };

      audio.onerror = () => {
        audio.onerror = null;
        startTeacherVoiceAfterYay();
      };

      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          console.log("Yay sound could not play");

          // Agar browser audio play nahi karta,
          // tab teacher voice rukegi nahi.
          audio.onended = null;
          startTeacherVoiceAfterYay();
        });
      }
    } else {
      // Audio reference available na ho to teacher voice start
      startTeacherVoiceAfterYay();
    }
  }

  /* =================================================
     WRONG ANSWER
  ================================================= */

  else {
    setFeedback("wrong");

    speakTeacher(
      "Good try, Explorer! Look carefully and choose the correct action."
    );

    /*
      Wrong answer ke baad same question rahega.
      1.8 seconds ke baad option reset hoga.
      Uske baad options dobara clickable ho jayenge.
    */

    wrongAnswerTimeoutRef.current = setTimeout(() => {
      if (
        answerSequenceRef.current !== currentAnswerSequence
      ) {
        return;
      }

      setSelected(null);
      setFeedback("");
    }, 1800);
  }
};

  /* =====================================================
     RESTART
  ===================================================== */

  const handleRestart = () => {
    clearAllTimers();

    answerSequenceRef.current += 1;

    if (
      typeof window !== "undefined" &&
      window.speechSynthesis
    ) {
      window.speechSynthesis.cancel();
    }

    if (yayAudioRef.current) {
      yayAudioRef.current.pause();
      yayAudioRef.current.currentTime = 0;
    }

    setScreen("activity");
    setRoundIndex(0);
    setScore(0);
    setSelected(null);
    setFeedback("");
    setFinished(false);
    setTimeLeft(60);
  };

  /* =====================================================
     BACK
  ===================================================== */

  const handleBack = () => {
    clearAllTimers();

    answerSequenceRef.current += 1;

    if (
      typeof window !== "undefined" &&
      window.speechSynthesis
    ) {
      window.speechSynthesis.cancel();
    }

    if (yayAudioRef.current) {
      yayAudioRef.current.pause();
      yayAudioRef.current.currentTime = 0;
    }

    if (typeof onBack === "function") {
      onBack();
    }
  };

  /* =====================================================
     SKIP
  ===================================================== */

  const handleSkip = () => {
    clearAllTimers();

    answerSequenceRef.current += 1;

    if (
      typeof window !== "undefined" &&
      window.speechSynthesis
    ) {
      window.speechSynthesis.cancel();
    }

    if (yayAudioRef.current) {
      yayAudioRef.current.pause();
      yayAudioRef.current.currentTime = 0;
    }

    if (typeof onSkip === "function") {
      onSkip();
    }
  };

  /* =====================================================
     FINISH SCREEN VOICE
  ===================================================== */

  useEffect(() => {
    if (!finished) {
      return;
    }

    const finishTimer = setTimeout(() => {
      speakTeacher(
        `Great job, Explorer! You completed your morning routine! Your final score is ${score} out of 70.`
      );
    }, 500);

    return () => {
      clearTimeout(finishTimer);

      if (
        typeof window !== "undefined" &&
        window.speechSynthesis
      ) {
        window.speechSynthesis.cancel();
      }
    };
  }, [finished, score]);

  /* =====================================================
     FINISH SCREEN
  ===================================================== */

  if (finished) {
    return (
      <div
        className="routine-rush-page"
        style={{ backgroundImage: `url(${bedroomBg})` }}
      >
        <div className="routine-rush-overlay" />

        <div className="routine-rush-card routine-rush-complete">
          <div className="routine-rush-complete-content">
            <img
              src={trophy}
              alt="Golden trophy"
              className="complete-trophy"
            />

            <h1>Great Job, Explorer! ⭐</h1>

            <p>You completed your morning routine!</p>

            <div className="final-score">
              <span>Final Score</span>
              <strong>{score} / 70</strong>
            </div>

            <button
              type="button"
              className="routine-btn primary"
              onClick={handleRestart}
            >
              Play Again ↻
            </button>

            <button
              type="button"
              className="routine-btn secondary"
              onClick={handleBack}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`routine-rush-page ${
        screen === "activity" ? "routine-activity-mode" : ""
      }`}
      style={{ backgroundImage: `url(${chatBg})` }}
    >
      <div className="routine-rush-overlay" />

      {/* =================================================
         MAIN CONTAINER
      ================================================= */}

      <div
        className={`routine-rush-card ${
          screen === "activity"
            ? "routine-rush-card-activity"
            : ""
        }`}
      >
        {/* ================= HEADER ================= */}

        <header className="routine-header">
          <button
            type="button"
            className="routine-btn back-btn"
            onClick={handleBack}
          >
            ← <span>Back</span>
          </button>

          <div className="routine-title">
            <span className="title-sun">☀️</span>
            <h1>ROUTINE RUSH</h1>
          </div>

          <button
            type="button"
            className="routine-btn skip-btn"
            onClick={handleSkip}
          >
            <span>Skip</span> →
          </button>
        </header>

        {/* ================= TITLE SUBTITLE ================= */}

        <div className="routine-subtitle">
          {screen === "intro"
            ? "Start your day the right way and beat the clock!"
            : "Put your day in the right order and beat the clock!"}
        </div>

        {/* =================================================
           INTRO SCREEN
        ================================================= */}

        {screen === "intro" && (
          <div className="routine-intro-layout">
            <div className="routine-intro-teacher-side">
              <div className="routine-intro-teacher-row">
                <div className="routine-teacher-box">
                  <img
                    src={teacherImg}
                    alt="Miss Uroosa"
                    className="routine-intro-teacher-image"
                  />

                  <div className="routine-intro-teacher-name">
                    Miss Uroosa
                  </div>
                </div>

                <div className="routine-speech-bubble routine-intro-bubble">
                  <button
                    type="button"
                    className="routine-repeat-button"
                    onClick={() =>
                      speakTeacher(
                        "Good morning, Explorer! It's time to start your day! Let's see if you can put your day in the right order and beat the clock! Are you ready?"
                      )
                    }
                    aria-label="Repeat instruction"
                  >
                    🔊
                  </button>

                  <p>Good morning, Explorer! ⭐</p>
                  <p>It's time to start your day!</p>

                  <p>
                    Let's see if you can put your day in the right
                    order and beat the clock!
                  </p>

                  <p>Are you ready?</p>
                </div>
              </div>

              <div className="routine-intro-stats">
                <div className="routine-stat">
                  <div className="routine-stat-icon routine-star-icon">
                    ⭐
                  </div>

                  <strong>0</strong>
                  <span>Stars</span>
                </div>

                <div className="routine-stat-divider" />

                <div className="routine-stat">
                  <div className="routine-stat-icon routine-round-icon">
                    ⏰
                  </div>

                  <strong>0/7</strong>
                  <span>Rounds</span>
                </div>
              </div>
            </div>

            <div className="routine-intro-room-side">
              <div className="routine-intro-room-image-wrap">
                <img
                  src={bedroomBg}
                  alt="Morning bedroom"
                  className="routine-intro-room-image"
                />
              </div>

              <button
                type="button"
                className="routine-start-challenge"
                onClick={handleStartChallenge}
              >
                <span className="routine-play-icon">▶</span>
                Start the Challenge
              </button>
            </div>
          </div>
        )}

        {/* =================================================
           ACTIVITY SCREEN
        ================================================= */}

        {screen === "activity" && currentRound && (
          <div className="routine-activity-layout">
            <div className="round-badge">
              Round {roundIndex + 1} / {rounds.length}
            </div>

            <img
              src={bedroomBg}
              alt="Morning bedroom"
              className="routine-activity-room-image"
            />

            <section className="routine-teacher">
              <div className="teacher-speech">
                <button
                  type="button"
                  className="routine-repeat-button"
                  onClick={() =>
                    speakTeacher(
                      `${currentRound.teacher} ${currentRound.question}`
                    )
                  }
                  aria-label="Repeat question"
                >
                  🔊
                </button>

                <p>{currentRound.teacher}</p>

                <strong>{currentRound.question}</strong>

                <div className="speech-tail" />
              </div>

              <img
                src={teacherImg}
                alt="Miss Uroosa"
                className="teacher-image"
              />

              <div className="teacher-name">Miss Uroosa</div>
            </section>

            <section className="routine-timer">
              <img src={alarmClock} alt="Alarm clock" />

              <div className="timer-value">
                {timeLeft}
                <span>s</span>
              </div>

              <div className="timer-label">Time Left</div>

              <div className="timer-bar">
                <div
                  className="timer-fill"
                  style={{
                    width: `${(timeLeft / 60) * 100}%`,
                  }}
                />
              </div>
            </section>

            <section className="routine-progress">
              <div className="progress-title">Day Progress</div>

              <div className="progress-line">
                <div
                  className="progress-line-fill"
                  style={{ width: `${progress}%` }}
                />

                {rounds.map((round, index) => (
                  <div
                    key={`${round.question}-${index}`}
                    className={`progress-dot ${
                      index <= roundIndex ? "active" : ""
                    }`}
                  >
                    {index < roundIndex ? "✓" : ""}
                  </div>
                ))}
              </div>

              <div className="progress-icons">
                <img
                  src={dayProgressIcons}
                  alt="Day progress icons"
                />
              </div>
            </section>

            <section className="routine-score">
              <img src={trophy} alt="Trophy" />

              <div className="score-label">Score</div>

              <div className="score-value">{score}</div>
            </section>

            <main className="routine-game-area">
              <div className="question-title">
                Choose the correct action
              </div>

              <div className="routine-options">
                {currentRound.options.map((option, index) => {
                  const isSelected = selected === option.id;
                  const isCorrect =
                    option.id === currentRound.correct;

                  return (
                    <button
                      type="button"
                      key={option.id}
                      className={`routine-option ${
                        isSelected ? "selected" : ""
                      } ${
                        feedback === "correct" && isCorrect
                          ? "correct"
                          : ""
                      } ${
                        feedback === "wrong" &&
                        isSelected &&
                        !isCorrect
                          ? "wrong"
                          : ""
                      }`}
                      onClick={() => handleAnswer(option)}
                      disabled={!!selected}
                    >
                      <div
                        className={`option-number option-${index + 1}`}
                      >
                        {index + 1}
                      </div>

                      <img src={option.image} alt={option.text} />

                      <span>{option.text}</span>
                    </button>
                  );
                })}
              </div>

              {feedback && (
                <div
                  className={`routine-feedback ${
                    feedback === "correct"
                      ? "feedback-correct"
                      : "feedback-wrong"
                  }`}
                >
                  <span>
                    {feedback === "correct"
                      ? "🎉 Excellent! That's correct!"
                      : "💡 Good try! Choose the correct action."}
                  </span>
                </div>
              )}
            </main>

            <div className="routine-instruction">
              ⭐ Put your day in the right order and beat the clock! ⭐
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoutineRushActivity;