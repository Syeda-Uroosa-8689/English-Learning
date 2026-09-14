import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

import "./MyPlanMyDayActivity.css";

import calendarImage from "../../assets/calendar.png";
import teacherImage from "../../assets/teacher1.png";

/* =====================================================
   ROUND DATA
===================================================== */

const rounds = [
    {
        id: 1,
        day: "Monday",
        emoji: "🏫",
        activity: "Study",
        correctId: "study",

        sentence: "I am going to study on Monday.",

        question: "What are you going to do on Monday?",

        clue: "It is Monday! Choose the activity you are planning for your day.",

        options: [
            {
                id: "movie",
                name: "Watch a Movie",
                emoji: "🎬",
            },
            {
                id: "picnic",
                name: "Have a Picnic",
                emoji: "🧺",
            },
            {
                id: "study",
                name: "Study",
                emoji: "🏫",
            },
            {
                id: "football",
                name: "Play Football",
                emoji: "⚽",
            },
        ],
    },

    {
        id: 2,
        day: "Wednesday",
        emoji: "⚽",
        activity: "Play Football",
        correctId: "football",

        sentence: "I am going to play football on Wednesday.",

        question: "What are you going to do on Wednesday?",

        clue: "It is Wednesday! Choose the activity you are planning for your day.",

        options: [
            {
                id: "birthday",
                name: "Go to a Birthday Party",
                emoji: "🎂",
            },
            {
                id: "swimming",
                name: "Go Swimming",
                emoji: "🏊",
            },
            {
                id: "reading",
                name: "Read a Book",
                emoji: "📚",
            },
            {
                id: "football",
                name: "Play Football",
                emoji: "⚽",
            },
        ],
    },

    {
        id: 3,
        day: "Saturday",
        emoji: "🧺",
        activity: "Have a Picnic",
        correctId: "picnic",

        sentence: "I am going to have a picnic on Saturday.",

        question: "What are you going to do on Saturday?",

        clue: "It is Saturday! Choose the activity you are planning for your day.",

        options: [
            {
                id: "movie",
                name: "Watch a Movie",
                emoji: "🎬",
            },
            {
                id: "swimming",
                name: "Go Swimming",
                emoji: "🏊",
            },
            {
                id: "school",
                name: "Go to School",
                emoji: "🏫",
            },
            {
                id: "picnic",
                name: "Have a Picnic",
                emoji: "🧺",
            },
        ],
    },
];

/* =====================================================
   COMPONENT
===================================================== */

function MyPlanMyDayActivity({
    onBack,
    onSkip,
    onFinish,
}) {
    const [screen, setScreen] = useState("intro");

    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);

    const [completedRounds, setCompletedRounds] = useState([]);

    const [selectedOption, setSelectedOption] = useState(null);

    const [placedPlan, setPlacedPlan] = useState([]);

    const [teacherMessage, setTeacherMessage] = useState("");

    const [feedbackType, setFeedbackType] = useState("");

    const [isSpeaking, setIsSpeaking] = useState(false);

    const speechTimeout = useRef(null);

    const currentRound = rounds[currentRoundIndex];

    /* =====================================================
       SPEAK
    ===================================================== */

    const speak = (text) => {
        if (!("speechSynthesis" in window)) {
            return;
        }

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
                voice.name.toLowerCase().includes("jenny")
            ) ||
            voices.find((voice) =>
                voice.name.toLowerCase().includes("aria")
            ) ||
            voices.find((voice) =>
                voice.name.toLowerCase().includes("samantha")
            ) ||
            voices.find((voice) =>
                voice.name.toLowerCase().includes("female")
            ) ||
            voices.find((voice) =>
                voice.lang.toLowerCase().startsWith("en")
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
       INTRO VOICE
    ===================================================== */

    useEffect(() => {
        if (screen !== "intro") {
            return;
        }

        const message =
            "Welcome to My Plan, My Day! Let's make some plans on our calendar. Choose an activity and tell me what you are going to do.";

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
       ROUND VOICE
    ===================================================== */

    useEffect(() => {
        if (screen !== "activity") {
            return;
        }

        if (!currentRound) {
            return;
        }

        setFeedbackType("");
        setSelectedOption(null);

        const message =
            `${currentRound.clue} ${currentRound.question}`;

        setTeacherMessage(message);

        const timer = setTimeout(() => {
            speak(message);
        }, 450);

        return () => {
            clearTimeout(timer);

            window.speechSynthesis.cancel();
        };
    }, [screen, currentRoundIndex]);

    /* =====================================================
       CLEANUP
    ===================================================== */

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();

            clearTimeout(speechTimeout.current);
        };
    }, []);

    /* =====================================================
       START
    ===================================================== */

    const handleStartPlanning = () => {
        window.speechSynthesis.cancel();

        setScreen("activity");
    };

    /* =====================================================
       BACK
    ===================================================== */

    const handleBack = () => {
        window.speechSynthesis.cancel();

        if (typeof onBack === "function") {
            onBack();
        }
    };

    /* =====================================================
       SKIP
    ===================================================== */

    const handleSkip = () => {
        window.speechSynthesis.cancel();

        if (typeof onSkip === "function") {
            onSkip();
        }
    };

    /* =====================================================
       WRONG
    ===================================================== */

    const handleWrongOption = () => {
        const message =
            `Not quite! Think about the plan for ${currentRound.day}. Try again!`;

        setFeedbackType("wrong");

        setTeacherMessage(message);

        speak(message);
    };

    /* =====================================================
       CORRECT
    ===================================================== */

    const handleCorrectOption = (option) => {
        if (selectedOption) {
            return;
        }

        setSelectedOption(option);

        setFeedbackType("success");

        const message =
            `Excellent! You are going to ${currentRound.activity.toLowerCase()} on ${currentRound.day}.`;

        setTeacherMessage(message);

        speak(message);

        /* ADD PLAN TO SIDE PANEL */

        setPlacedPlan((previous) => [
            ...previous,
            {
                day: currentRound.day,
                emoji: option.emoji,
                activity: option.name,
            },
        ]);

        /* COMPLETED ROUND */

        setCompletedRounds((previous) => [
            ...previous,
            currentRound.id,
        ]);

        /* CONFETTI */

        confetti({
            particleCount: 110,
            spread: 75,
            origin: {
                y: 0.58,
            },
        });
    };

    /* =====================================================
       OPTION CLICK
    ===================================================== */

    const handleOptionClick = (option) => {
        if (selectedOption) {
            return;
        }

        if (option.id === currentRound.correctId) {
            handleCorrectOption(option);
        } else {
            handleWrongOption();
        }
    };

    /* =====================================================
       CONTINUE
    ===================================================== */

    const handleContinue = () => {
        if (currentRoundIndex === rounds.length - 1) {
            window.speechSynthesis.cancel();

            if (typeof onFinish === "function") {
                onFinish();
            }

            return;
        }

        setCurrentRoundIndex(
            (previous) => previous + 1
        );
    };

    /* =====================================================
       REPEAT
    ===================================================== */

    const handleRepeat = () => {
        speak(teacherMessage);
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="my-plan-my-day-page">

            {/* BACKGROUND */}

            <div className="mpmd-background" />

            {/* MAIN CONTAINER */}

            <div className="mpmd-main-container">

                {/* BACK */}

                <button
                    type="button"
                    className="mpmd-top-button mpmd-back-button"
                    onClick={handleBack}
                >
                    <span>←</span>
                    Back
                </button>

                {/* SKIP */}

                <button
                    type="button"
                    className="mpmd-top-button mpmd-skip-button"
                    onClick={handleSkip}
                >
                    Skip
                    <span>→</span>
                </button>

                {/* HEADER */}

                <div className="mpmd-header">

                    <h1>
                        <span className="mpmd-header-icon">
                            📅
                        </span>

                        My Plan, My Day
                    </h1>

                    <p>
                        Make your plans and tell us what you are going to do!
                    </p>

                </div>

                {/* =================================================
                   INTRO
                ================================================= */}

                {screen === "intro" && (
                    <div className="mpmd-intro-layout">

                        {/* TEACHER SIDE */}

                        <div className="mpmd-intro-teacher-side">

                            <div className="mpmd-intro-teacher-row">

                                <div className="mpmd-teacher-box">

                                    <img
                                        src={teacherImage}
                                        alt="Miss Uroosa"
                                        className="mpmd-teacher-image"
                                    />

                                    <div className="mpmd-teacher-name">
                                        Miss Uroosa
                                    </div>

                                </div>

                                <div className="mpmd-speech-bubble mpmd-intro-bubble">

                                    <button
                                        type="button"
                                        className="mpmd-repeat-button"
                                        onClick={handleRepeat}
                                    >
                                        🔊
                                    </button>

                                    <p>
                                        Welcome to
                                        <span className="mpmd-green-text">
                                            {" "}My Plan, My Day!
                                        </span>
                                    </p>

                                    <p>
                                        Let's make some plans on our calendar.
                                    </p>

                                    <p>
                                        Choose an activity and tell me what you are going to do!
                                    </p>

                                </div>

                            </div>

                            {/* STATS */}

                            <div className="mpmd-intro-stats">

                                <div className="mpmd-stat">

                                    <div className="mpmd-stat-icon mpmd-star-icon">
                                        ⭐
                                    </div>

                                    <strong>0</strong>

                                    <span>Stars</span>

                                </div>

                                <div className="mpmd-stat-divider" />

                                <div className="mpmd-stat">

                                    <div className="mpmd-stat-icon mpmd-calendar-icon">
                                        📅
                                    </div>

                                    <strong>0/3</strong>

                                    <span>Plans Made</span>

                                </div>

                            </div>

                        </div>

                        {/* CALENDAR */}

                        <div className="mpmd-intro-calendar-side">

                            <div className="mpmd-intro-calendar-image-wrap">

                                <img
                                    src={calendarImage}
                                    alt="Weekly calendar"
                                    className="mpmd-intro-calendar-image"
                                />

                            </div>

                            <button
                                type="button"
                                className="mpmd-start-planning"
                                onClick={handleStartPlanning}
                            >

                                <span className="mpmd-calendar-button-icon">
                                    📅
                                </span>

                                Start Planning

                            </button>

                        </div>

                    </div>
                )}

                {/* =================================================
                   ACTIVITY
                ================================================= */}

                {screen === "activity" && (
                    <div className="mpmd-activity-layout">

                        <div className="mpmd-calendar-card">

                            {/* CARD HEADER */}

                            <div className="mpmd-calendar-card-header">

                                <div className="mpmd-calendar-title">
                                    <span>📅</span>
                                    My Weekly Plans
                                </div>

                                <div className="mpmd-round-counter">
                                    Round {currentRoundIndex + 1} of {rounds.length}
                                </div>

                            </div>

                            {/* CALENDAR BOARD */}

                            <div className="mpmd-calendar-board">

                                <div className="mpmd-calendar-board-title">

                                    Choose a plan for

                                    <span>
                                        {currentRound.day}
                                    </span>

                                </div>

                                {/* IMPORTANT:
                                    CALENDAR AND PLANS ARE NOW SIDE BY SIDE
                                */}

                                <div className="mpmd-calendar-content-row">

                                    {/* CALENDAR */}

                                    <div className="mpmd-calendar-image-wrap">

                                        <img
                                            src={calendarImage}
                                            alt="Calendar"
                                            className="mpmd-calendar-image"
                                        />

                                    </div>

                                    {/* SIDE PLANS */}

                                    <div className="mpmd-calendar-plan-area">

                                        <div className="mpmd-plan-column-title">
                                            Your Plans
                                        </div>

                                        {placedPlan.length === 0 && (
                                            <div className="mpmd-empty-plan">
                                                Your plans will appear here ✨
                                            </div>
                                        )}

                                        {placedPlan.map(
                                            (plan, index) => (
                                                <div
                                                    key={`${plan.day}-${index}`}
                                                    className="mpmd-placed-plan"
                                                >

                                                    <span className="mpmd-placed-plan-emoji">
                                                        {plan.emoji}
                                                    </span>

                                                    <div className="mpmd-placed-plan-text">

                                                        <strong>
                                                            {plan.day}
                                                        </strong>

                                                        <span>
                                                            {plan.activity}
                                                        </span>

                                                    </div>

                                                </div>
                                            )
                                        )}

                                    </div>

                                </div>

                            </div>

                            {/* OPTIONS */}

                            <div className="mpmd-options-section">

                                <div className="mpmd-options-title">
                                    Choose your plan
                                </div>

                                <div className="mpmd-options-grid">

                                    {currentRound.options.map(
                                        (option) => {

                                            const isSelected =
                                                selectedOption?.id === option.id;

                                            const isCorrect =
                                                option.id === currentRound.correctId;

                                            return (
                                                <button
                                                    key={option.id}
                                                    type="button"
                                                    className={`
                                                        mpmd-option-card
                                                        ${isSelected ? "mpmd-option-selected" : ""}
                                                        ${selectedOption && isCorrect ? "mpmd-option-correct" : ""}
                                                        ${selectedOption && !isCorrect ? "mpmd-option-disabled" : ""}
                                                    `}
                                                    onClick={() =>
                                                        handleOptionClick(option)
                                                    }
                                                    disabled={!!selectedOption}
                                                >

                                                    <span className="mpmd-option-emoji">
                                                        {option.emoji}
                                                    </span>

                                                    <span className="mpmd-option-name">
                                                        {option.name}
                                                    </span>

                                                </button>
                                            );
                                        }
                                    )}

                                </div>

                            </div>

                            {/* TEACHER */}

                            <div className="mpmd-activity-teacher-area">

                                <img
                                    src={teacherImage}
                                    alt="Miss Uroosa"
                                    className="mpmd-activity-teacher-image"
                                />

                                <div className="mpmd-speech-bubble mpmd-activity-bubble">

                                    <button
                                        type="button"
                                        className="mpmd-repeat-button"
                                        onClick={handleRepeat}
                                    >
                                        {isSpeaking ? "🔊" : "🔈"}
                                    </button>

                                    <div className="mpmd-round-label">
                                        ROUND {currentRoundIndex + 1} OF 3
                                    </div>

                                    <p className="mpmd-activity-message">
                                        {teacherMessage}
                                    </p>

                                </div>

                            </div>

                            {/* FEEDBACK */}

                            {feedbackType === "wrong" && (
                                <div className="mpmd-side-feedback mpmd-side-feedback-wrong">

                                    <div className="mpmd-side-feedback-icon">
                                        👀
                                    </div>

                                    <div className="mpmd-side-feedback-content">

                                        <strong>
                                            Try Again!
                                        </strong>

                                        <p>
                                            Think about the plan and try once more.
                                        </p>

                                    </div>

                                </div>
                            )}

                            {feedbackType === "success" && (
                                <div className="mpmd-side-feedback mpmd-side-feedback-success">

                                    <div className="mpmd-side-feedback-icon">
                                        ⭐
                                    </div>

                                    <div className="mpmd-side-feedback-content">

                                        <strong>
                                            Great Planning!
                                        </strong>

                                        <p>
                                            Your plan has been added to the side panel!
                                        </p>

                                    </div>

                                </div>
                            )}

                            {/* SCORE */}

                            <div className="mpmd-score-counter">

                                <div className="mpmd-score-icon">
                                    ⭐
                                </div>

                                <strong>
                                    {completedRounds.length}
                                </strong>

                                <span>
                                    Stars
                                </span>

                            </div>

                        </div>

                    </div>
                )}

            </div>

            {/* =====================================================
               SUCCESS POPUP
            ===================================================== */}

            {selectedOption && (
                <div className="mpmd-popup-overlay">

                    <div className="mpmd-success-popup">

                        <div className="mpmd-popup-plan-icon">
                            {selectedOption.emoji}
                        </div>

                        <div className="mpmd-popup-found-label">
                            ✦ PLAN ADDED!
                        </div>

                        <h2>
                            {currentRound.day} Plan!
                        </h2>

                        <p>
                            You are going to{" "}
                            <strong>
                                {currentRound.activity.toLowerCase()}
                            </strong>
                            {" "}on{" "}
                            {currentRound.day}.
                        </p>

                        <div className="mpmd-popup-sentence">
                            "{currentRound.sentence}"
                        </div>

                        <div className="mpmd-popup-bottom">

                            <div className="mpmd-popup-count">
                                ⭐ {completedRounds.length}/3
                            </div>

                            <button
                                type="button"
                                className="mpmd-popup-next"
                                onClick={handleContinue}
                            >
                                {currentRoundIndex === rounds.length - 1
                                    ? "Finish"
                                    : "Next Round →"}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default MyPlanMyDayActivity;