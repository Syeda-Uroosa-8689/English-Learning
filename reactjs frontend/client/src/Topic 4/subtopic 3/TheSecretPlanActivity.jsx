import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

import "./TheSecretPlanActivity.css";

import secretPlanBg from "../../assets/secretPlanBg.png";
import secretEnvelope from "../../assets/secretEnvelope.png";
import secretMissionBoard from "../../assets/secretMissionBoard.png";

import parkImage from "../../assets/park2.png";
import libraryImage from "../../assets/library2.png";
import schoolImage from "../../assets/school.png";
import cafeImage from "../../assets/cafe.png";

import clockImage from "../../assets/clock3.png";

import footballImage from "../../assets/football3.png";
import picnicImage from "../../assets/picnic.png";
import readBookImage from "../../assets/readBook.png";
import movieImage from "../../assets/movie.png";

import lockImage from "../../assets/lock.png";
import secretDoorImage from "../../assets/secretDoor.png";
import treasureChestImage from "../../assets/treasureChest.png";

import teacherImage from "../../assets/teacher1.png";
import chatBackground from "../../assets/chatbg.jpeg";

/* =========================================================
   MISSION DATA
========================================================= */

const locationOptions = [
    {
        id: "park",
        name: "Park",
        image: parkImage,
    },
    {
        id: "library",
        name: "Library",
        image: libraryImage,
    },
    {
        id: "school",
        name: "School",
        image: schoolImage,
    },
    {
        id: "cafe",
        name: "Cafe",
        image: cafeImage,
    },
];

const timeOptions = [
    {
        id: "8am",
        name: "8:00 AM",
        image: clockImage,
        clockTime: "8:00 AM",
    },
    {
        id: "12pm",
        name: "12:00 PM",
        image: clockImage,
        clockTime: "12:00 PM",
    },
    {
        id: "7pm",
        name: "7:00 PM",
        image: clockImage,
        clockTime: "7:00 PM",
    },
    {
        id: "10pm",
        name: "10:00 PM",
        image: clockImage,
        clockTime: "10:00 PM",
    },
];

const activityOptions = [
    {
        id: "football",
        name: "Play football",
        image: footballImage,
    },
    {
        id: "picnic",
        name: "Have a picnic",
        image: picnicImage,
    },
    {
        id: "book",
        name: "Read a book",
        image: readBookImage,
    },
    {
        id: "movie",
        name: "Watch a movie",
        image: movieImage,
    },
];

/* =========================================================
   COMPONENT
========================================================= */

function TheSecretPlanActivity({ onBack, onSkip, onFinish }) {
    const [screen, setScreen] = useState("intro");

    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);

    const [feedbackType, setFeedbackType] = useState("");
    const [teacherMessage, setTeacherMessage] = useState("");

    const [isSpeaking, setIsSpeaking] = useState(false);

    const [speechText, setSpeechText] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);

    const speechTimeout = useRef(null);
    const recognitionRef = useRef(null);

    /* =====================================================
       CORRECT ANSWERS
    ===================================================== */

    const correctLocation = "park";
    const correctTime = "8am";
    const correctActivity = "football";

    /* =====================================================
       SPEECH SYNTHESIS
    ===================================================== */

    const speak = (text) => {
        if (!("speechSynthesis" in window)) return;

        window.speechSynthesis.cancel();
        clearTimeout(speechTimeout.current);

        const utterance = new SpeechSynthesisUtterance(text);

        utterance.rate = 0.92;
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
                voice.name.toLowerCase().includes("jenny")
            ) ||
            voices.find((voice) =>
                voice.name.toLowerCase().includes("aria")
            ) ||
            voices.find((voice) =>
                voice.lang.toLowerCase().startsWith("en")
            );

        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);

        utterance.onend = () => setIsSpeaking(false);

        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    /* =====================================================
       SPEECH RECOGNITION SETUP
    ===================================================== */

    useEffect(() => {
        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setSpeechSupported(false);
            return;
        }

        setSpeechSupported(true);

        const recognition = new SpeechRecognition();

        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.continuous = false;

        recognition.onstart = () => {
            setIsListening(true);
            setTeacherMessage(
                "I'm listening, Explorer! Tell me your secret plan."
            );
        };

        recognition.onresult = (event) => {
            const transcript =
                event.results[0][0].transcript;

            setSpeechText(transcript);

            setTeacherMessage(
                `I heard you say: "${transcript}"`
            );

            speak(
                `Great job! You told me your secret plan.`
            );
        };

        recognition.onerror = () => {
            setIsListening(false);

            setTeacherMessage(
                "I couldn't hear that. Try speaking again!"
            );
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
        };
    }, []);

    /* =====================================================
       INTRO VOICE
    ===================================================== */

    useEffect(() => {
        if (screen !== "intro") return;

        const message =
            "Hello, Explorer! Are you ready for a secret mission? Let's make a plan for a special day!";

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
       SCREEN VOICE
    ===================================================== */

    useEffect(() => {
        let message = "";

        if (screen === "missionBoard") {
            message =
                "Welcome to your Top Secret Plan! Complete all four missions to unlock your secret plan.";
        }

        if (screen === "mission1") {
            message =
                "Mission one! Where should we meet? We want to play outside. Which place is the best?";
        }

        if (screen === "mission2") {
            message =
                "Mission two! When should we meet? We want to have breakfast together. Choose the best time!";
        }

        if (screen === "mission3") {
            message =
                "Mission three! What will we do? We want to have fun and stay active. What should we do?";
        }

        if (screen === "build") {
            message =
                "Build your secret plan! Put all your clues together.";
        }

        if (screen === "yourPlan") {
            message =
                "Your secret plan is ready! Look at all your clues.";
        }

        if (screen === "tellPlan") {
            message =
                "Go ahead, Explorer! Tell me your secret plan.";
        }

        if (!message) return;

        setTeacherMessage(message);

        const timer = setTimeout(() => {
            speak(message);
        }, 450);

        return () => {
            clearTimeout(timer);
            window.speechSynthesis.cancel();
        };
    }, [screen]);

    /* =====================================================
       CLEANUP
    ===================================================== */

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
            clearTimeout(speechTimeout.current);

            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    /* =====================================================
       NAVIGATION
    ===================================================== */

    const handleBack = () => {
        window.speechSynthesis.cancel();

        if (typeof onBack === "function") {
            onBack();
        }
    };

    const handleSkip = () => {
        window.speechSynthesis.cancel();

        if (typeof onSkip === "function") {
            onSkip();
        }
    };

    const handleStart = () => {
        window.speechSynthesis.cancel();

        setScreen("missionBoard");
    };

    const handleBoardStart = () => {
        setScreen("mission1");
    };

    /* =====================================================
       MISSION 1
    ===================================================== */

    const handleLocationClick = (option) => {
        if (feedbackType === "success") return;

        if (option.id === correctLocation) {
            setSelectedLocation(option);
            setFeedbackType("success");

            const message =
                "Great! The place is Park!";

            setTeacherMessage(message);

            speak(message);

            confetti({
                particleCount: 130,
                spread: 80,
                origin: {
                    y: 0.55,
                },
            });
        } else {
            setFeedbackType("wrong");

            const message =
                "Not quite! Think about a place where we can play outside. Try again!";

            setTeacherMessage(message);

            speak(message);
        }
    };

    /* =====================================================
       MISSION 2
    ===================================================== */

    const handleTimeClick = (option) => {
        if (feedbackType === "success") return;

        if (option.id === correctTime) {
            setSelectedTime(option);
            setFeedbackType("success");

            const message =
                "Great! The time is 8:00 AM!";

            setTeacherMessage(message);

            speak(message);

            confetti({
                particleCount: 130,
                spread: 80,
                origin: {
                    y: 0.55,
                },
            });
        } else {
            setFeedbackType("wrong");

            const message =
                "Try again! Look carefully at the time we need for our secret plan.";

            setTeacherMessage(message);

            speak(message);
        }
    };

    /* =====================================================
       MISSION 3
    ===================================================== */

    const handleActivityClick = (option) => {
        if (feedbackType === "success") return;

        if (option.id === correctActivity) {
            setSelectedActivity(option);
            setFeedbackType("success");

            const message =
                "Great! The activity is Play football!";

            setTeacherMessage(message);

            speak(message);

            confetti({
                particleCount: 130,
                spread: 80,
                origin: {
                    y: 0.55,
                },
            });
        } else {
            setFeedbackType("wrong");

            const message =
                "Not quite! We want an activity that keeps us active. Try again!";

            setTeacherMessage(message);

            speak(message);
        }
    };

    /* =====================================================
       NEXT BUTTON
    ===================================================== */

    const handleNextMission = () => {
        window.speechSynthesis.cancel();

        setFeedbackType("");

        if (screen === "mission1") {
            setScreen("mission2");
            return;
        }

        if (screen === "mission2") {
            setScreen("mission3");
            return;
        }

        if (screen === "mission3") {
            setScreen("build");
            return;
        }

        if (screen === "yourPlan") {
            setScreen("tellPlan");
            return;
        }

        if (screen === "tellPlan") {
            setScreen("complete");
        }
    };

    /* =====================================================
       BUILD PLAN
    ===================================================== */

    const handleBuildPlan = () => {
        setScreen("yourPlan");

        confetti({
            particleCount: 160,
            spread: 100,
            origin: {
                y: 0.5,
            },
        });
    };

    /* =====================================================
       MICROPHONE
    ===================================================== */

    const handleStartListening = () => {
        if (!speechSupported) {
            setTeacherMessage(
                "Your browser does not support voice input. You can still continue!"
            );
            return;
        }

        if (isListening) return;

        try {
            setSpeechText("");
            recognitionRef.current.start();
        } catch (error) {
            console.log(error);
        }
    };

    /* =====================================================
       REPEAT
    ===================================================== */

    const handleRepeat = () => {
        if (teacherMessage) {
            speak(teacherMessage);
        }
    };

    /* =====================================================
       COMPLETE
    ===================================================== */

    const handleFinish = () => {
        window.speechSynthesis.cancel();

        if (typeof onFinish === "function") {
            onFinish();
        }
    };

    /* =====================================================
       SCORE
    ===================================================== */

    const score =
        screen === "complete"
            ? 20
            : screen === "mission3" && feedbackType === "success"
            ? 15
            : screen === "mission2" && feedbackType === "success"
            ? 10
            : screen === "mission1" && feedbackType === "success"
            ? 5
            : 0;

    return (
        <div
            className="tsp-page"
            style={{
                "--secret-bg": `url(${secretPlanBg})`,
                "--chat-bg": `url(${chatBackground})`,
            }}
        >
            {/* =================================================
                BACKGROUND
            ================================================= */}

            <div className="tsp-background" />

            {/* =================================================
                MAIN CONTAINER
            ================================================= */}

            <div className="tsp-main-container">

                {/* TOP BUTTONS */}

                {screen !== "complete" && (
                    <>
                        <button
                            type="button"
                            className="tsp-top-button tsp-back-button"
                            onClick={handleBack}
                        >
                            Back
                        </button>

                        <button
                            type="button"
                            className="tsp-top-button tsp-skip-button"
                            onClick={handleSkip}
                        >
                            Skip
                        </button>
                    </>
                )}

                {/* =================================================
                    INTRO
                ================================================= */}

                {screen === "intro" && (
                    <div className="tsp-intro-screen">

                        <div className="tsp-intro-teacher">
                            <img
                                src={teacherImage}
                                alt="Miss Uroosa"
                                className="tsp-intro-teacher-image"
                            />

                            <div className="tsp-intro-teacher-bubble">
                                <button
                                    type="button"
                                    className="tsp-repeat-button"
                                    onClick={handleRepeat}
                                >
                                    🔊
                                </button>

                                <p>
                                    Hello, Explorer!
                                </p>

                                <p>
                                    Are you ready for a
                                    <strong> secret mission?</strong>
                                </p>
                            </div>
                        </div>

                        <div className="tsp-intro-parchment">

                            <img
                                src={secretEnvelope}
                                alt="Secret envelope"
                                className="tsp-intro-envelope"
                            />

                            <h1>
                                The Secret Plan
                            </h1>

                            <p>
                                Let's make a plan for a special day!
                            </p>

                            <button
                                type="button"
                                className="tsp-start-button"
                                onClick={handleStart}
                            >
                                Start
                            </button>
                        </div>
                    </div>
                )}

                {/* =================================================
                    MISSION BOARD
                ================================================= */}

                {screen === "missionBoard" && (
                    <div className="tsp-board-screen">

                        <div className="tsp-board-image-wrapper">
                            <img
                                src={secretMissionBoard}
                                alt="Secret mission board"
                                className="tsp-board-image"
                            />

                            <div className="tsp-board-content">

                                <div className="tsp-board-title">
                                    TOP SECRET PLAN
                                </div>

                                <div className="tsp-board-subtitle">
                                    Complete all missions to unlock your secret plan!
                                </div>

                                <div className="tsp-mission-lock-grid">

                                    <div className="tsp-lock-card">
                                        <img
                                            src={lockImage}
                                            alt=""
                                        />
                                        <strong>
                                            Mission 1
                                        </strong>
                                        <span>
                                            Where?
                                        </span>
                                    </div>

                                    <div className="tsp-lock-card">
                                        <img
                                            src={lockImage}
                                            alt=""
                                        />
                                        <strong>
                                            Mission 2
                                        </strong>
                                        <span>
                                            When?
                                        </span>
                                    </div>

                                    <div className="tsp-lock-card">
                                        <img
                                            src={lockImage}
                                            alt=""
                                        />
                                        <strong>
                                            Mission 3
                                        </strong>
                                        <span>
                                            What?
                                        </span>
                                    </div>

                                    <div className="tsp-lock-card">
                                        <img
                                            src={lockImage}
                                            alt=""
                                        />
                                        <strong>
                                            Mission 4
                                        </strong>
                                        <span>
                                            Build Plan
                                        </span>
                                    </div>

                                </div>

                                <button
                                    type="button"
                                    className="tsp-board-start"
                                    onClick={handleBoardStart}
                                >
                                    Open Mission 1
                                </button>

                            </div>
                        </div>
                    </div>
                )}

                {/* =================================================
                    MISSION 1
                ================================================= */}

                {screen === "mission1" && (
                    <div className="tsp-mission-screen">

                        <div className="tsp-score-badge">
                            ⭐ {score}/20
                        </div>

                        <div className="tsp-mission-header">
                            <h1>
                                Mission 1: Where?
                            </h1>

                            <p>
                                Where should we meet?
                            </p>
                        </div>

                        <div className="tsp-mission-content">

                            <div className="tsp-mission-teacher-side">

                                <div className="tsp-mission-bubble">
                                    <button
                                        type="button"
                                        className="tsp-repeat-button"
                                        onClick={handleRepeat}
                                    >
                                        🔊
                                    </button>

                                    <p>
                                        We want to play
                                        <strong> outside.</strong>
                                        Which place is the best?
                                    </p>
                                </div>

                                <img
                                    src={teacherImage}
                                    alt="Miss Uroosa"
                                    className="tsp-mission-teacher"
                                />
                            </div>

                            <div className="tsp-options-panel">

                                <div className="tsp-options-grid">

                                    {locationOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            type="button"
                                            className={`
                                                tsp-image-option
                                                ${
                                                    selectedLocation?.id ===
                                                    option.id
                                                        ? "tsp-selected"
                                                        : ""
                                                }
                                                ${
                                                    feedbackType === "success" &&
                                                    option.id !==
                                                        correctLocation
                                                        ? "tsp-dim"
                                                        : ""
                                                }
                                            `}
                                            onClick={() =>
                                                handleLocationClick(option)
                                            }
                                        >
                                            <img
                                                src={option.image}
                                                alt={option.name}
                                            />

                                            <span>
                                                {option.name}
                                            </span>
                                        </button>
                                    ))}

                                </div>

                            </div>
                        </div>

                        {feedbackType === "success" && (
                            <div className="tsp-great-overlay">

                                <div className="tsp-great-card">

                                    <div className="tsp-great-ribbon">
                                        Great!
                                    </div>

                                    <h2>
                                        The place is Park!
                                    </h2>

                                    <img
                                        src={parkImage}
                                        alt="Park"
                                    />

                                    <button
                                        type="button"
                                        className="tsp-next-button"
                                        onClick={handleNextMission}
                                    >
                                        Next
                                    </button>

                                </div>

                            </div>
                        )}

                    </div>
                )}

                {/* =================================================
                    MISSION 2
                ================================================= */}

                {screen === "mission2" && (
                    <div className="tsp-mission-screen">

                        <div className="tsp-score-badge">
                            ⭐ {score}/20
                        </div>

                        <div className="tsp-mission-header">
                            <h1>
                                Mission 2: When?
                            </h1>

                            <p>
                                What time should we meet?
                            </p>
                        </div>

                        <div className="tsp-mission-content">

                            <div className="tsp-mission-teacher-side">

                                <div className="tsp-mission-bubble">
                                    <button
                                        type="button"
                                        className="tsp-repeat-button"
                                        onClick={handleRepeat}
                                    >
                                        🔊
                                    </button>

                                    <p>
                                        We want to have
                                        <strong> breakfast together.</strong>
                                        Choose the best time!
                                    </p>
                                </div>

                                <img
                                    src={teacherImage}
                                    alt="Miss Uroosa"
                                    className="tsp-mission-teacher"
                                />

                            </div>

                            <div className="tsp-time-panel">

                                <div className="tsp-time-grid">

                                    {timeOptions.map((option, index) => (
                                        <button
                                            key={option.id}
                                            type="button"
                                            className={`
                                                tsp-time-card
                                                tsp-time-${index + 1}
                                                ${
                                                    selectedTime?.id ===
                                                    option.id
                                                        ? "tsp-time-selected"
                                                        : ""
                                                }
                                            `}
                                            onClick={() =>
                                                handleTimeClick(option)
                                            }
                                        >
                                            <div className="tsp-time-icon">
                                                {index === 0 && "🌅"}
                                                {index === 1 && "☀️"}
                                                {index === 2 && "🌇"}
                                                {index === 3 && "🌙"}
                                            </div>

                                            <span>
                                                {option.name}
                                            </span>
                                        </button>
                                    ))}

                                </div>

                            </div>
                        </div>

                        {feedbackType === "success" && (
                            <div className="tsp-great-overlay">

                                <div className="tsp-great-card tsp-clock-result">

                                    <div className="tsp-great-ribbon">
                                        Great!
                                    </div>

                                    <h2>
                                        The time is 8:00 AM!
                                    </h2>

                                    <img
                                        src={clockImage}
                                        alt="8 AM clock"
                                    />

                                    <button
                                        type="button"
                                        className="tsp-next-button"
                                        onClick={handleNextMission}
                                    >
                                        Next
                                    </button>

                                </div>

                            </div>
                        )}

                    </div>
                )}

                {/* =================================================
                    MISSION 3
                ================================================= */}

                {screen === "mission3" && (
                    <div className="tsp-mission-screen">

                        <div className="tsp-score-badge">
                            ⭐ {score}/20
                        </div>

                        <div className="tsp-mission-header">
                            <h1>
                                Mission 3: What?
                            </h1>

                            <p>
                                What will we do?
                            </p>
                        </div>

                        <div className="tsp-mission-content">

                            <div className="tsp-mission-teacher-side">

                                <div className="tsp-mission-bubble">
                                    <button
                                        type="button"
                                        className="tsp-repeat-button"
                                        onClick={handleRepeat}
                                    >
                                        🔊
                                    </button>

                                    <p>
                                        We want to have
                                        <strong> fun and stay active.</strong>
                                        What should we do?
                                    </p>
                                </div>

                                <img
                                    src={teacherImage}
                                    alt="Miss Uroosa"
                                    className="tsp-mission-teacher"
                                />

                            </div>

                            <div className="tsp-options-panel">

                                <div className="tsp-options-grid">

                                    {activityOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            type="button"
                                            className={`
                                                tsp-image-option
                                                tsp-activity-option
                                                ${
                                                    selectedActivity?.id ===
                                                    option.id
                                                        ? "tsp-selected"
                                                        : ""
                                                }
                                            `}
                                            onClick={() =>
                                                handleActivityClick(option)
                                            }
                                        >
                                            <img
                                                src={option.image}
                                                alt={option.name}
                                            />

                                            <span>
                                                {option.name}
                                            </span>
                                        </button>
                                    ))}

                                </div>

                            </div>
                        </div>

                        {feedbackType === "success" && (
                            <div className="tsp-great-overlay">

                                <div className="tsp-great-card">

                                    <div className="tsp-great-ribbon">
                                        Great!
                                    </div>

                                    <h2>
                                        The activity is Play football!
                                    </h2>

                                    <img
                                        src={footballImage}
                                        alt="Play football"
                                    />

                                    <button
                                        type="button"
                                        className="tsp-next-button"
                                        onClick={handleNextMission}
                                    >
                                        Next
                                    </button>

                                </div>

                            </div>
                        )}

                    </div>
                )}

                {/* =================================================
                    BUILD SECRET PLAN
                ================================================= */}

                {screen === "build" && (
                    <div className="tsp-build-screen">

                        <div className="tsp-build-header">
                            <h1>
                                Build Your Secret Plan
                            </h1>

                            <p>
                                Put the clues together to complete your plan!
                            </p>
                        </div>

                        <div className="tsp-build-card">

                            <div className="tsp-build-columns">

                                <div className="tsp-build-column">
                                    <div className="tsp-build-column-title">
                                        Day
                                    </div>

                                    <div className="tsp-build-placeholder">
                                        📅
                                    </div>

                                    <div className="tsp-build-answer">
                                        Saturday
                                    </div>
                                </div>

                                <div className="tsp-build-column">
                                    <div className="tsp-build-column-title">
                                        Time
                                    </div>

                                    <div className="tsp-build-placeholder">
                                        🕐
                                    </div>

                                    <div className="tsp-build-answer">
                                        8:00 AM
                                    </div>
                                </div>

                                <div className="tsp-build-column">
                                    <div className="tsp-build-column-title">
                                        Place
                                    </div>

                                    <div className="tsp-build-placeholder">
                                        📍
                                    </div>

                                    <div className="tsp-build-answer">
                                        Park
                                    </div>
                                </div>

                                <div className="tsp-build-column">
                                    <div className="tsp-build-column-title">
                                        Activity
                                    </div>

                                    <div className="tsp-build-placeholder">
                                        ⭐
                                    </div>

                                    <div className="tsp-build-answer">
                                        Play football
                                    </div>
                                </div>

                            </div>

                            <button
                                type="button"
                                className="tsp-build-button"
                                onClick={handleBuildPlan}
                            >
                                ✨ Complete My Plan
                            </button>

                        </div>

                    </div>
                )}

                {/* =================================================
                    YOUR SECRET PLAN
                ================================================= */}

                {screen === "yourPlan" && (
                    <div className="tsp-your-plan-screen">

                        <div className="tsp-your-plan-paper">

                            <h1>
                                Your Secret Plan
                            </h1>

                            <div className="tsp-plan-items">

                                <div className="tsp-plan-item">
                                    <div className="tsp-plan-icon">
                                        📅
                                    </div>

                                    <strong>
                                        Saturday
                                    </strong>

                                    <span>
                                        Day
                                    </span>
                                </div>

                                <div className="tsp-plan-item">
                                    <div className="tsp-plan-icon">
                                        🕐
                                    </div>

                                    <strong>
                                        8:00 AM
                                    </strong>

                                    <span>
                                        Time
                                    </span>
                                </div>

                                <div className="tsp-plan-item">
                                    <div className="tsp-plan-icon">
                                        📍
                                    </div>

                                    <strong>
                                        Park
                                    </strong>

                                    <span>
                                        Place
                                    </span>
                                </div>

                                <div className="tsp-plan-item">
                                    <div className="tsp-plan-icon">
                                        ⚽
                                    </div>

                                    <strong>
                                        Play football
                                    </strong>

                                    <span>
                                        Activity
                                    </span>
                                </div>

                            </div>

                            <div className="tsp-plan-message">
                                Looks like a perfect plan!
                            </div>

                            <button
                                type="button"
                                className="tsp-next-button tsp-plan-next"
                                onClick={handleNextMission}
                            >
                                Next
                            </button>

                        </div>

                    </div>
                )}

                {/* =================================================
                    TELL ME YOUR PLAN
                ================================================= */}

                {screen === "tellPlan" && (
                    <div className="tsp-tell-screen">

                        <div className="tsp-tell-header">
                            <h1>
                                Tell Me Your Secret Plan
                            </h1>

                            <p>
                                Use the words: day, time, place and activity.
                            </p>
                        </div>

                        <div className="tsp-tell-content">

                            <div className="tsp-tell-teacher">

                                <div className="tsp-tell-bubble">
                                    <button
                                        type="button"
                                        className="tsp-repeat-button"
                                        onClick={handleRepeat}
                                    >
                                        🔊
                                    </button>

                                    <p>
                                        Go ahead, Explorer!
                                    </p>

                                    <p>
                                        Tell me your plan!
                                    </p>
                                </div>

                                <img
                                    src={teacherImage}
                                    alt="Miss Uroosa"
                                    className="tsp-tell-teacher-image"
                                />

                            </div>

                            <div className="tsp-mic-area">

                                <button
                                    type="button"
                                    className={`
                                        tsp-mic-button
                                        ${
                                            isListening
                                                ? "tsp-mic-listening"
                                                : ""
                                        }
                                    `}
                                    onClick={handleStartListening}
                                >
                                    🎙️
                                </button>

                                <div className="tsp-mic-text">
                                    {isListening
                                        ? "Listening..."
                                        : "Tap the mic to start speaking"}
                                </div>

                                {speechText && (
                                    <div className="tsp-speech-result">
                                        "{speechText}"
                                    </div>
                                )}

                                <button
                                    type="button"
                                    className="tsp-tell-next"
                                    onClick={handleNextMission}
                                >
                                    Continue
                                </button>

                            </div>

                        </div>

                    </div>
                )}

                {/* =================================================
                    COMPLETE
                ================================================= */}

                {screen === "complete" && (
                    <div className="tsp-complete-screen">

                        <div className="tsp-complete-ribbon">
                            Secret Plan Complete!
                        </div>

                        <h1>
                            You made a plan!
                        </h1>

                        <div className="tsp-complete-content">

                            <div className="tsp-treasure-area">
                                <img
                                    src={treasureChestImage}
                                    alt="Treasure chest"
                                    className="tsp-treasure"
                                />
                            </div>

                            <div className="tsp-final-score-card">

                                <div className="tsp-final-score">
                                    ⭐ 20/20
                                </div>

                                <div className="tsp-score-line">
                                    <span>✓</span>
                                    <strong>Day</strong>
                                    <b>5</b>
                                </div>

                                <div className="tsp-score-line">
                                    <span>✓</span>
                                    <strong>Time</strong>
                                    <b>5</b>
                                </div>

                                <div className="tsp-score-line">
                                    <span>✓</span>
                                    <strong>Place</strong>
                                    <b>5</b>
                                </div>

                                <div className="tsp-score-line">
                                    <span>✓</span>
                                    <strong>Activity</strong>
                                    <b>5</b>
                                </div>

                            </div>

                        </div>

                        <button
                            type="button"
                            className="tsp-finish-button"
                            onClick={handleFinish}
                        >
                            Great Job!
                        </button>

                    </div>
                )}

            </div>
        </div>
    );
}

export default TheSecretPlanActivity;