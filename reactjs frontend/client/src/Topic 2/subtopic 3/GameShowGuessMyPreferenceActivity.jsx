import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

import "./GameShowGuessMyPreferenceActivity.css";

import stageImage from "../../assets/gameShowStage.jpeg";
import teacherImage from "../../assets/teacher1.png";
import buzzerImage from "../../assets/buzzer.png";

import contestant1 from "../../assets/guessAisha.png";
import contestant2 from "../../assets/guessRohan.png";
import contestant3 from "../../assets/guessMaya.png";


/* =====================================================
   CONTESTANTS
===================================================== */

const contestants = [
    {
        id: "Aisha",
        name: "Aisha",
        image: contestant1,
        preferences: [
            { icon: "📚", text: "Reading", type: "like" },
            { icon: "🎨", text: "Drawing", type: "like" },
            { icon: "🎵", text: "Music", type: "like" },
            { icon: "🍳", text: "Cooking", type: "like" },
            { icon: "⚽", text: "Football", type: "dislike" },
        ],
    },

    {
        id: "Rohan",
        name: "Rohan",
        image: contestant2,
        preferences: [
            { icon: "📚", text: "Reading", type: "like" },
            { icon: "⚽", text: "Football", type: "like" },
            { icon: "🍳", text: "Cooking", type: "like" },
            { icon: "🎨", text: "Drawing", type: "dislike" },
        ],
    },

    {
        id: "Maya",
        name: "Maya",
        image: contestant3,
        preferences: [
            { icon: "🎵", text: "Music", type: "like" },
            { icon: "🎨", text: "Drawing", type: "like" },
            { icon: "📚", text: "Reading", type: "like" },
            { icon: "⚽", text: "Football", type: "dislike" },
        ],
    },
];


/* =====================================================
   GAME ROUNDS
===================================================== */

const rounds = [
    {
        id: 1,
        difficulty: "EASY",
        clue: "This person loves reading.",
        answer: "Aisha",
        explanation:
            "Aisha loves reading, so she is the correct person!",
    },

    {
        id: 2,
        difficulty: "MEDIUM",
        clue: "This person loves reading but dislikes football.",
        answer: "Rohan",
        explanation:
            "Rohan loves reading but does not like football!",
    },

    {
        id: 3,
        difficulty: "HARD",
        clue:
            "This person enjoys music and drawing, but doesn't like football.",
        answer: "Maya",
        explanation:
            "Maya enjoys music and drawing, but dislikes football!",
    },

    {
        id: 4,
        difficulty: "CHALLENGE",
        clue:
            "This person loves cooking, enjoys reading, and dislikes football.",
        answer: "Aisha",
        explanation:
            "Aisha loves cooking and reading, and she dislikes football!",
    },

    {
        id: 5,
        difficulty: "FINAL",
        clue:
            "This person enjoys music, loves drawing, likes reading, and does not enjoy football.",
        answer: "Maya",
        explanation:
            "Maya enjoys music, drawing and reading, but does not enjoy football!",
    },
];


/* =====================================================
   COMPONENT
===================================================== */

function GameShowGuessMyPreferenceActivity({
    onBack,
    onSkip,
    onFinish,
}) {

    const [screen, setScreen] = useState("intro");
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [hasBuzzed, setHasBuzzed] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [spokenAnswer, setSpokenAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [feedbackType, setFeedbackType] = useState("");
    const [showResult, setShowResult] = useState(false);
    const [teacherMessage, setTeacherMessage] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);

    const recognitionRef = useRef(null);
    const speechTimeout = useRef(null);
    const timerRef = useRef(null);

    const currentRound = rounds[currentRoundIndex];


    /* =====================================================
       SPEAK
    ===================================================== */

    const speak = (text) => {

        if (!("speechSynthesis" in window)) return;

        window.speechSynthesis.cancel();

        clearTimeout(speechTimeout.current);

        const utterance = new SpeechSynthesisUtterance(text);

        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        utterance.volume = 1;

        const voices = window.speechSynthesis.getVoices();

        const femaleVoice =
            voices.find((voice) =>
                voice.name.toLowerCase().includes("zira")
            ) ||
            voices.find((voice) =>
                voice.name.toLowerCase().includes("female")
            ) ||
            voices.find((voice) =>
                voice.lang.startsWith("en")
            );

        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }

        utterance.onstart = () => {
            setIsSpeaking(true);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
        };

        utterance.onerror = () => {
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    };


    /* =====================================================
       INTRO
    ===================================================== */

    useEffect(() => {

        if (screen !== "intro") return;

        const message =
            "Welcome to Guess My Preference! Listen carefully to each clue, buzz in, and tell me which person matches the clue.";

        setTeacherMessage(message);

        const timer = setTimeout(() => {
            speak(message);
        }, 500);

        return () => {
            clearTimeout(timer);
            window.speechSynthesis.cancel();
        };

    }, [screen]);


    /* =====================================================
       ROUND SETUP
    ===================================================== */

    useEffect(() => {

        if (screen !== "game") return;

        const message = currentRound.clue;

        setTeacherMessage(message);
        setTimeLeft(20);
        setIsTimerRunning(true);
        setHasBuzzed(false);
        setIsListening(false);
        setSpokenAnswer("");
        setFeedback("");
        setFeedbackType("");
        setShowResult(false);

        const timer = setTimeout(() => {
            speak(message);
        }, 400);

        return () => {
            clearTimeout(timer);
            window.speechSynthesis.cancel();
        };

    }, [screen, currentRoundIndex]);


    /* =====================================================
       TIMER
    ===================================================== */

    useEffect(() => {

        if (
            screen !== "game" ||
            !isTimerRunning ||
            hasBuzzed ||
            showResult
        ) {
            return;
        }

        timerRef.current = setInterval(() => {

            setTimeLeft((previous) => {

                if (previous <= 1) {

                    clearInterval(timerRef.current);

                    setIsTimerRunning(false);

                    setFeedback(
                        "Time's up! Listen to the clue and try again."
                    );

                    setFeedbackType("timeout");

                    speak(
                        "Time's up! Listen to the clue and try again."
                    );

                    return 0;
                }

                return previous - 1;
            });

        }, 1000);

        return () => {
            clearInterval(timerRef.current);
        };

    }, [
        screen,
        isTimerRunning,
        hasBuzzed,
        showResult,
    ]);


    /* =====================================================
       CLEANUP
    ===================================================== */

    useEffect(() => {

        return () => {

            window.speechSynthesis.cancel();

            clearTimeout(speechTimeout.current);

            clearInterval(timerRef.current);

            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };

    }, []);


    /* =====================================================
       START GAME
    ===================================================== */

    const handleStartGame = () => {

        window.speechSynthesis.cancel();

        setCurrentRoundIndex(0);
        setScore(0);
        setStreak(0);

        setScreen("game");
    };


    /* =====================================================
       BACK
    ===================================================== */

    const handleBack = () => {

        window.speechSynthesis.cancel();

        clearInterval(timerRef.current);

        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        if (typeof onBack === "function") {
            onBack();
        }
    };


    /* =====================================================
       SKIP
    ===================================================== */

    const handleSkip = () => {

        window.speechSynthesis.cancel();

        clearInterval(timerRef.current);

        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        if (typeof onSkip === "function") {
            onSkip();
        }
    };


    /* =====================================================
       BUZZER
    ===================================================== */

    const handleBuzz = () => {

        if (hasBuzzed || showResult) return;

        setHasBuzzed(true);
        setIsTimerRunning(false);

        clearInterval(timerRef.current);

        speak("Buzz! Now tell me who it is.");

        setTeacherMessage(
            "Buzz! 🎉 Now press the microphone and tell me who it is."
        );
    };


    /* =====================================================
       CHECK ANSWER
    ===================================================== */

    const checkAnswer = (answer) => {

        if (!answer) return;

        const normalizedAnswer =
            answer.trim().toLowerCase();

        const correctAnswer =
            currentRound.answer.toLowerCase();

        const isCorrect =
            normalizedAnswer === correctAnswer ||
            normalizedAnswer.includes(correctAnswer);

        setIsListening(false);
        setSpokenAnswer(answer);

        if (isCorrect) {

            const newScore = score + 1;
            const newStreak = streak + 1;

            setScore(newScore);
            setStreak(newStreak);

            setFeedbackType("correct");

            setFeedback(
                `Amazing! ${currentRound.answer} is correct! ⭐`
            );

            setTeacherMessage(
                currentRound.explanation
            );

            setShowResult(true);

            speak(
                `Amazing! ${currentRound.answer} is correct!`
            );

            confetti({
                particleCount: 150,
                spread: 80,
                origin: {
                    y: 0.55,
                },
            });

        } else {

            setStreak(0);

            setFeedbackType("wrong");

            setFeedback(
                "Good try! Listen to the clue again and try once more."
            );

            setTeacherMessage(
                "Good try! Listen carefully and speak the correct person's name."
            );

            speak(
                "Good try! Listen carefully and try once more."
            );
        }
    };


    /* =====================================================
       MICROPHONE
    ===================================================== */

    const handleMic = () => {

        if (!hasBuzzed || showResult) return;

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {

            setFeedbackType("wrong");

            setFeedback(
                "Microphone speech recognition is not supported in this browser."
            );

            return;
        }

        if (isListening) {

            recognitionRef.current?.stop();

            setIsListening(false);

            return;
        }

        const recognition = new SpeechRecognition();

        recognitionRef.current = recognition;

        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {

            setIsListening(true);

            setFeedback("");
            setFeedbackType("");

            setTeacherMessage(
                "I'm listening... Tell me the person's name."
            );
        };

        recognition.onresult = (event) => {

            const transcript =
                event.results[0][0].transcript;

            checkAnswer(transcript);
        };

        recognition.onerror = () => {

            setIsListening(false);

            setFeedbackType("wrong");

            setFeedback(
                "I couldn't hear that. Please press the microphone and try again."
            );

            setTeacherMessage(
                "I couldn't hear you. Try speaking the person's name clearly."
            );
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };


    /* =====================================================
       REPEAT CLUE
    ===================================================== */

    const handleRepeatClue = () => {

        speak(
            hasBuzzed
                ? "Buzz! Now tell me who it is."
                : currentRound.clue
        );
    };


    /* =====================================================
       NEXT ROUND
    ===================================================== */

    const handleNextRound = () => {

        if (
            currentRoundIndex >=
            rounds.length - 1
        ) {

            window.speechSynthesis.cancel();

            if (typeof onFinish === "function") {

                onFinish({
                    score,
                    total: rounds.length,
                });
            }

            return;
        }

        setCurrentRoundIndex(
            (previous) => previous + 1
        );
    };


    /* =====================================================
       CONTESTANTS
    ===================================================== */

    const renderContestants = () => {

        return contestants.map(
            (contestant, index) => (

                <div
                    key={contestant.id}
                    className={
                        `gmp-contestant gmp-contestant-${index + 1}`
                    }
                >

                    <div className="gmp-contestant-image-wrap">

                        <img
                            src={contestant.image}
                            alt={contestant.name}
                            className="gmp-contestant-image"
                        />

                    </div>


                    <div className="gmp-contestant-name">
                        {contestant.name}
                    </div>


                    <div className="gmp-preferences">

                        {contestant.preferences.map(
                            (preference, preferenceIndex) => (

                                <div
                                    key={`${contestant.id}-${preferenceIndex}`}
                                    className={
                                        `gmp-preference-chip ${
                                            preference.type === "dislike"
                                                ? "gmp-preference-dislike"
                                                : "gmp-preference-like"
                                        }`
                                    }
                                >

                                    <span className="gmp-preference-icon">
                                        {preference.icon}
                                    </span>

                                    <span>
                                        {preference.text}
                                    </span>

                                </div>

                            )
                        )}

                    </div>

                </div>
            )
        );
    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="gmp-page">

            <div className="gmp-background" />

            <div className="gmp-main-container">


                {/* TOP BUTTONS */}

                <button
                    type="button"
                    className="gmp-top-button gmp-back-button"
                    onClick={handleBack}
                >
                    <span>←</span>
                    Back
                </button>


                <button
                    type="button"
                    className="gmp-top-button gmp-skip-button"
                    onClick={handleSkip}
                >
                    Skip
                    <span>→</span>
                </button>


                {/* HEADER */}

                <div className="gmp-header">

                    <h1>
                        <span>🎤</span>
                        Guess My Preference!
                    </h1>

                    <p>
                        Listen carefully, buzz in, and guess the right person!
                    </p>

                </div>


                {/* =================================================
                   INTRO PAGE
                ================================================= */}

                {screen === "intro" && (

                    <div className="gmp-intro-layout">

                        <div className="gmp-intro-teacher-side">

                            <div className="gmp-intro-teacher-row">

                                <div className="gmp-teacher-box">

                                    <img
                                        src={teacherImage}
                                        alt="Miss Uroosa"
                                        className="gmp-teacher-image"
                                    />

                                    <div className="gmp-teacher-name">
                                        Miss Uroosa
                                    </div>

                                </div>


                                <div className="gmp-speech-bubble gmp-intro-bubble">

                                    <button
                                        type="button"
                                        className="gmp-repeat-button"
                                        onClick={handleRepeatClue}
                                    >
                                        🔊
                                    </button>

                                    <p>
                                        Welcome to{" "}
                                        <span className="gmp-highlight">
                                            Guess My Preference!
                                        </span>
                                    </p>

                                    <p>
                                        Listen to my clue, buzz in, and tell me which person matches it.
                                    </p>

                                    <p>
                                        Can you become the{" "}
                                        <span className="gmp-highlight">
                                            Preference Champion?
                                        </span>
                                    </p>

                                </div>

                            </div>


                            <div className="gmp-intro-stats">

                                <div className="gmp-stat">

                                    <div className="gmp-stat-icon">
                                        ⭐
                                    </div>

                                    <strong>0</strong>

                                    <span>
                                        Score
                                    </span>

                                </div>


                                <div className="gmp-stat-divider" />


                                <div className="gmp-stat">

                                    <div className="gmp-stat-icon">
                                        🎯
                                    </div>

                                    <strong>5</strong>

                                    <span>
                                        Rounds
                                    </span>

                                </div>

                            </div>

                        </div>


                        <div className="gmp-intro-stage-side">

                            <div className="gmp-stage-image-wrap">

                                <img
                                    src={stageImage}
                                    alt="Game show stage"
                                    className="gmp-stage-image"
                                />

                            </div>


                            <button
                                type="button"
                                className="gmp-start-button"
                                onClick={handleStartGame}
                            >

                                <span>🎤</span>

                                Start Game

                            </button>

                        </div>

                    </div>

                )}


                {/* =================================================
                   GAME PAGE
                ================================================= */}

                {screen === "game" && (

                    <div className="gmp-game-layout">

                        <div className="gmp-game-stage">

                            <img
                                src={stageImage}
                                alt="Game show stage"
                                className="gmp-game-stage-image"
                            />


                            <div className="gmp-contestants">
                                {renderContestants()}
                            </div>


                            <div className="gmp-round-badge">

                                <span>
                                    ROUND
                                </span>

                                <strong>
                                    {currentRoundIndex + 1}
                                </strong>

                                <small>
                                    / {rounds.length}
                                </small>

                            </div>


                            <div className="gmp-score-panel">

                                <div className="gmp-score-item">

                                    <span>⭐</span>

                                    <strong>
                                        {score}
                                    </strong>

                                    <small>
                                        Score
                                    </small>

                                </div>


                                <div className="gmp-score-divider" />


                                <div className="gmp-score-item">

                                    <span>🔥</span>

                                    <strong>
                                        {streak}
                                    </strong>

                                    <small>
                                        Streak
                                    </small>

                                </div>

                            </div>


                            <div
                                className={
                                    `gmp-timer ${
                                        timeLeft <= 5 && !hasBuzzed
                                            ? "gmp-timer-danger"
                                            : ""
                                    }`
                                }
                            >

                                <span>⏱️</span>

                                <strong>
                                    {timeLeft}
                                </strong>

                                <small>
                                    sec
                                </small>

                            </div>


                            {/* =================================================
                               TEACHER + SMALL BUBBLE
                            ================================================= */}

                            <div className="gmp-game-teacher">

                                <img
                                    src={teacherImage}
                                    alt="Miss Uroosa"
                                    className="gmp-game-teacher-image"
                                />


                                <div className="gmp-game-bubble">

                                    <button
                                        type="button"
                                        className="gmp-repeat-button"
                                        onClick={handleRepeatClue}
                                    >
                                        {isSpeaking
                                            ? "🔊"
                                            : "🔈"
                                        }
                                    </button>


                                    <div className="gmp-difficulty">
                                        {currentRound.difficulty}
                                    </div>


                                    <p>
                                        {teacherMessage}
                                    </p>

                                </div>

                            </div>


                            {/* =================================================
                               ANSWER AREA
                            ================================================= */}

                            <div className="gmp-answer-area">


                                {!hasBuzzed && !showResult && (

                                    <button
                                        type="button"
                                        className="gmp-buzzer"
                                        onClick={handleBuzz}
                                    >

                                        {/* ACTUAL BUZZER IMAGE */}

                                        <img
                                            src={buzzerImage}
                                            alt="Buzzer"
                                            className="gmp-buzzer-image"
                                        />

                                 
                                    </button>

                                )}


                                {hasBuzzed && !showResult && (

                                    <div className="gmp-mic-section">

                                        <div className="gmp-buzzed-label">
                                            🔔 BUZZED IN!
                                        </div>

                                        <p>
                                            Who is it?
                                        </p>


                                        <button
                                            type="button"
                                            className={
                                                `gmp-mic-button ${
                                                    isListening
                                                        ? "gmp-mic-listening"
                                                        : ""
                                                }`
                                            }
                                            onClick={handleMic}
                                        >

                                            <span>
                                                {isListening
                                                    ? "⏹️"
                                                    : "🎤"
                                                }
                                            </span>

                                            <strong>
                                                {isListening
                                                    ? "Listening..."
                                                    : "Speak Answer"
                                                }
                                            </strong>

                                        </button>


                                        {spokenAnswer && (

                                            <div className="gmp-spoken-answer">

                                                You said:{" "}
                                                <strong>
                                                    {spokenAnswer}
                                                </strong>

                                            </div>

                                        )}

                                    </div>

                                )}


                                {feedback && (

                                    <div
                                        className={
                                            `gmp-feedback gmp-feedback-${feedbackType}`
                                        }
                                    >
                                        {feedback}
                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                )}

            </div>


            {/* =====================================================
               RESULT POPUP
            ===================================================== */}

            {showResult && (

                <div className="gmp-popup-overlay">

                    <div className="gmp-result-popup">

                        <div className="gmp-result-icon">
                            🎉
                        </div>

                        <div className="gmp-result-label">
                            ✦ CORRECT ANSWER!
                        </div>

                        <h2>
                            Amazing Job!
                        </h2>

                        <p>
                            {currentRound.explanation}
                        </p>

                        <div className="gmp-result-stats">

                            <div>
                                <span>⭐</span>

                                <strong>
                                    {score}
                                </strong>

                                <small>
                                    Score
                                </small>
                            </div>


                            <div>
                                <span>🔥</span>

                                <strong>
                                    {streak}
                                </strong>

                                <small>
                                    Streak
                                </small>
                            </div>

                        </div>


                        <button
                            type="button"
                            className="gmp-next-button"
                            onClick={handleNextRound}
                        >

                            {currentRoundIndex === rounds.length - 1
                                ? "Finish Game 🎉"
                                : "Next Round →"
                            }

                        </button>

                    </div>

                </div>

            )}

        </div>

    );
}


export default GameShowGuessMyPreferenceActivity;