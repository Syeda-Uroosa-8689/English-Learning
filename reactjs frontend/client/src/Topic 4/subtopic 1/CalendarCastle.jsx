import React, { useEffect, useState } from "react";

import teacher from "../../assets/teacher1.png";
import bg from "../../assets/chatbg.jpeg";

import castleBg from "../../assets/calendarCastleBg.png";
import castle from "../../assets/calendarCastle.png";
import room from "../../assets/calendarRoom.png";

import yaySound from "../../assets/yay.mp3";

import confetti from "canvas-confetti";

import "./CalendarCastle.css";


/* =====================================================
   CALENDAR CASTLE
===================================================== */

const CalendarCastle = ({
    onBack,
    onSkip,
    onFinish
}) => {

    /* =====================================================
       PAGE
    ===================================================== */

    const [showActivity, setShowActivity] = useState(false);


    /* =====================================================
       DAYS
    ===================================================== */

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];


    /* =====================================================
       MONTHS
    ===================================================== */

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];


    /* =====================================================
       CHALLENGES
    ===================================================== */

    const challenges = [
        {
            type: "day",
            question: "The Friday room is locked! Can you find it?",
            answer: "Friday"
        },

        {
            type: "day",
            question: "The Monday room is locked! Can you find it?",
            answer: "Monday"
        },

        {
            type: "month",
            question: "The July room is locked! Can you find it?",
            answer: "July"
        },

        {
            type: "month",
            question: "The December room is locked! Can you find it?",
            answer: "December"
        },

        {
            type: "day",
            question: "The Sunday room is locked! Can you find it?",
            answer: "Sunday"
        }
    ];


    /* =====================================================
       STATES
    ===================================================== */

    const [round, setRound] = useState(1);

    const [challenge, setChallenge] = useState(
        challenges[0]
    );

    const [selectedAnswer, setSelectedAnswer] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [isCorrect, setIsCorrect] =
        useState(false);

    const [showResult, setShowResult] =
        useState(false);

    const [isSpeaking, setIsSpeaking] =
        useState(false);

    const [unlocked, setUnlocked] =
        useState([]);


    const totalRounds = challenges.length;

    const score = unlocked.length * 20;


    /* =====================================================
       FEMALE VOICE
    ===================================================== */

    const getFemaleVoice = () => {

        if (!window.speechSynthesis) {
            return null;
        }

        const voices =
            window.speechSynthesis.getVoices();

        if (!voices || voices.length === 0) {
            return null;
        }


        const femaleVoiceNames = [
            "Google UK English Female",
            "Google US English Female",
            "Microsoft Zira",
            "Microsoft Jenny",
            "Microsoft Aria",
            "Microsoft Sonia",
            "Samantha",
            "Victoria",
            "Karen",
            "Moira",
            "Susan",
            "Hazel",
            "Tessa",
            "Ava",
            "Siri Female"
        ];


        /* Known female voices */

        const knownFemaleVoice =
            voices.find((voice) => {

                const name =
                    voice.name.toLowerCase();

                const language =
                    voice.lang.toLowerCase();

                return (
                    language.startsWith("en") &&
                    femaleVoiceNames.some(
                        (femaleName) =>
                            name.includes(
                                femaleName.toLowerCase()
                            )
                    )
                );

            });


        if (knownFemaleVoice) {
            return knownFemaleVoice;
        }


        /* Female detection */

        const detectedFemaleVoice =
            voices.find((voice) => {

                const name =
                    voice.name.toLowerCase();

                const language =
                    voice.lang.toLowerCase();

                return (
                    language.startsWith("en") &&
                    (
                        name.includes("female") ||
                        name.includes("woman") ||
                        name.includes("girl")
                    )
                );

            });


        if (detectedFemaleVoice) {
            return detectedFemaleVoice;
        }


        /* English US */

        const englishUSVoice =
            voices.find(
                (voice) =>
                    voice.lang.toLowerCase() === "en-us"
            );


        if (englishUSVoice) {
            return englishUSVoice;
        }


        /* Any English */

        const englishVoice =
            voices.find(
                (voice) =>
                    voice.lang.toLowerCase().startsWith("en")
            );


        return englishVoice || null;
    };


    /* =====================================================
       SPEAK
    ===================================================== */

    const speak = (text, callback) => {

        if (!window.speechSynthesis) {

            if (callback) {
                callback();
            }

            return;
        }


        window.speechSynthesis.cancel();


        const utterance =
            new SpeechSynthesisUtterance(text);


        const femaleVoice =
            getFemaleVoice();


        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }


        utterance.lang = "en-US";

        utterance.rate = 0.88;

        utterance.pitch = 1.18;

        utterance.volume = 1;


        utterance.onstart = () => {
            setIsSpeaking(true);
        };


        utterance.onend = () => {

            setIsSpeaking(false);

            if (callback) {
                callback();
            }

        };


        utterance.onerror = () => {

            setIsSpeaking(false);

            if (callback) {
                callback();
            }

        };


        window.speechSynthesis.speak(
            utterance
        );

    };


    /* =====================================================
       LOAD VOICES
    ===================================================== */

    useEffect(() => {

        if (!window.speechSynthesis) {
            return;
        }


        const loadVoices = () => {

            window.speechSynthesis.getVoices();

        };


        loadVoices();


        window.speechSynthesis.addEventListener(
            "voiceschanged",
            loadVoices
        );


        return () => {

            window.speechSynthesis.removeEventListener(
                "voiceschanged",
                loadVoices
            );

        };

    }, []);


    /* =====================================================
       INTRO PAGE SPEECH
       TEACHER SPEAKS AUTOMATICALLY WHEN INTRO OPENS
    ===================================================== */

    useEffect(() => {

        if (showActivity) {
            return;
        }


        const timer =
            setTimeout(() => {

                speak(
                    "Welcome to Calendar Castle! Find the correct days and months to unlock every room."
                );

            }, 500);


        return () => {

            clearTimeout(timer);

        };

    }, [showActivity]);


    /* =====================================================
       FIRST QUESTION SPEECH
    ===================================================== */

    useEffect(() => {

        if (!showActivity) {
            return;
        }


        const timer =
            setTimeout(() => {

                speak(
                    challenge.question
                );

            }, 500);


        return () => {
            clearTimeout(timer);
        };

    }, [showActivity]);


    /* =====================================================
       NEXT QUESTION SPEECH
    ===================================================== */

    useEffect(() => {

        if (!showActivity) {
            return;
        }


        if (round === 1) {
            return;
        }


        const timer =
            setTimeout(() => {

                speak(
                    challenge.question
                );

            }, 500);


        return () => {
            clearTimeout(timer);
        };

    }, [
        round,
        challenge,
        showActivity
    ]);


    /* =====================================================
       START
    ===================================================== */

    const startActivity = () => {

        setShowActivity(true);

    };


    /* =====================================================
       BACK
    ===================================================== */

    const handleBack = () => {

        window.speechSynthesis?.cancel();

        setIsSpeaking(false);


        if (showActivity) {

            setShowActivity(false);

            setRound(1);

            setChallenge(
                challenges[0]
            );

            setSelectedAnswer("");

            setMessage("");

            setShowResult(false);

            setIsCorrect(false);

            setUnlocked([]);

            return;
        }


        if (onBack) {
            onBack();
        }

    };


    /* =====================================================
       SKIP
    ===================================================== */

    const handleSkip = () => {

        window.speechSynthesis?.cancel();

        setIsSpeaking(false);


        if (onSkip) {

            onSkip();

        } else if (onFinish) {

            onFinish();

        }

    };


    /* =====================================================
       SELECT ANSWER
    ===================================================== */

    const selectAnswer = (value) => {

        if (
            isSpeaking ||
            showResult
        ) {
            return;
        }


        setSelectedAnswer(value);

        checkAnswer(value);

    };


    /* =====================================================
       CHECK ANSWER
    ===================================================== */

    const checkAnswer = (value) => {

        if (
            value === challenge.answer
        ) {

            handleCorrect();

        } else {

            handleWrong();

        }

    };


    /* =====================================================
       CORRECT
       AUTO NEXT
===================================================== */

    const handleCorrect = () => {

        setIsCorrect(true);
        setShowResult(true);

        const correctAnswer = challenge.answer;

        setMessage(
            `Great job! ${correctAnswer} is correct!`
        );


        /* =================================================
           UNLOCK ANSWER
        ================================================= */

        setUnlocked((previous) => {

            if (previous.includes(correctAnswer)) {
                return previous;
            }

            return [
                ...previous,
                correctAnswer
            ];

        });


        /* =================================================
           CONFETTI
        ================================================= */

        confetti({
            particleCount: 90,
            spread: 70,
            origin: {
                y: 0.65
            }
        });


        /* =================================================
           YAY SOUND
           WAIT UNTIL SOUND COMPLETELY FINISHES
        ================================================= */

        const moveToNextQuestion = () => {

            /* =============================================
               LAST QUESTION
            ============================================= */

            if (round >= totalRounds) {

                speak(
                    "Amazing! You unlocked the whole Calendar Castle!",
                    () => {

                        if (onFinish) {
                            onFinish();
                        }

                    }
                );

                return;
            }


            /* =============================================
               NEXT QUESTION
            ============================================= */

            const next =
                challenges[round];


            setRound(
                previous =>
                    previous + 1
            );

            setChallenge(next);

            setSelectedAnswer("");

            setMessage("");

            setShowResult(false);

            setIsCorrect(false);

        };


        /* =================================================
           PLAY YAY SOUND
        ================================================= */

        try {

            const audio =
                new Audio(yaySound);

            audio.volume = 0.6;


            /* =============================================
               SOUND COMPLETELY FINISHED
            ============================================= */

            audio.onended = () => {

                speak(
                    `Wonderful! ${correctAnswer} is correct!`,
                    () => {

                        moveToNextQuestion();

                    }
                );

            };


            /* =============================================
               AUDIO ERROR
            ============================================= */

            audio.onerror = () => {

                speak(
                    `Wonderful! ${correctAnswer} is correct!`,
                    () => {

                        moveToNextQuestion();

                    }
                );

            };


            /* =============================================
               PLAY AUDIO
            ============================================= */

            audio.play().catch(() => {

                speak(
                    `Wonderful! ${correctAnswer} is correct!`,
                    () => {

                        moveToNextQuestion();

                    }
                );

            });

        } catch (error) {

            speak(
                `Wonderful! ${correctAnswer} is correct!`,
                () => {

                    moveToNextQuestion();

                }
            );

        }

    };


    /* =====================================================
       WRONG
    ===================================================== */

    const handleWrong = () => {

        setIsCorrect(false);

        setShowResult(true);

        setMessage(
            `Good try! Look carefully. The answer is ${challenge.answer}.`
        );


        setTimeout(() => {

            speak(
                `Good try! Look carefully. The answer is ${challenge.answer}.`
            );

        }, 200);

    };


    /* =====================================================
       RETRY
    ===================================================== */

    const retry = () => {

        window.speechSynthesis?.cancel();

        setIsSpeaking(false);

        setSelectedAnswer("");

        setMessage("");

        setShowResult(false);

        setIsCorrect(false);

    };


    /* =====================================================
       DAY ROOMS
    ===================================================== */

    const renderDayRooms = () => {

        return (

            <div className="calendar-castle-day-rooms">

                {days.map((day) => {

                    const isUnlocked =
                        unlocked.includes(day);

                    const isSelected =
                        selectedAnswer === day;

                    const isTarget =
                        challenge.answer === day;


                    return (

                        <button
                            key={day}

                            className={`
                                calendar-castle-room
                                ${isSelected ? "selected" : ""}
                                ${isUnlocked ? "unlocked" : ""}
                                ${
                                    showResult &&
                                    isTarget &&
                                    isCorrect
                                        ? "correct-target"
                                        : ""
                                }
                            `}

                            disabled={
                                isSpeaking ||
                                showResult
                            }

                            onClick={() =>
                                selectAnswer(day)
                            }
                        >

                            <div className="calendar-room-image-wrap">

                                <img
                                    src={room}
                                    alt={day}
                                    className="calendar-room-image"
                                />


                                <span className="calendar-room-lock">

                                    {isUnlocked
                                        ? "🔓"
                                        : "🔒"}

                                </span>


                                {isUnlocked && (

                                    <span className="room-star">
                                        ⭐
                                    </span>

                                )}

                            </div>


                            <span className="room-name">
                                {day}
                            </span>

                        </button>

                    );

                })}

            </div>

        );

    };


    /* =====================================================
       MONTH ROOMS
       SAME ROOM IMAGE
    ===================================================== */

    const renderMonthRooms = () => {

        return (

            <div className="calendar-castle-day-rooms">

                {months.map((month) => {

                    const isUnlocked =
                        unlocked.includes(month);

                    const isSelected =
                        selectedAnswer === month;

                    const isTarget =
                        challenge.answer === month;


                    return (

                        <button
                            key={month}

                            className={`
                                calendar-castle-room
                                ${isSelected ? "selected" : ""}
                                ${isUnlocked ? "unlocked" : ""}
                                ${
                                    showResult &&
                                    isTarget &&
                                    isCorrect
                                        ? "correct-target"
                                        : ""
                                }
                            `}

                            disabled={
                                isSpeaking ||
                                showResult
                            }

                            onClick={() =>
                                selectAnswer(month)
                            }
                        >

                            {/* SAME ROOM IMAGE */}

                            <div className="calendar-room-image-wrap">

                                <img
                                    src={room}
                                    alt={month}
                                    className="calendar-room-image"
                                />


                                <span className="calendar-room-lock">

                                    {isUnlocked
                                        ? "🔓"
                                        : "🔒"}

                                </span>


                                {isUnlocked && (

                                    <span className="room-star">
                                        ⭐
                                    </span>

                                )}

                            </div>


                            {/* MONTH NAME */}

                            <span className="room-name">
                                {month}
                            </span>

                        </button>

                    );

                })}

            </div>

        );

    };


    /* =====================================================
       INTRO PAGE
    ===================================================== */

    if (!showActivity) {

        return (

            <div className="calendar-castle-page">

                <div
                    className="calendar-castle-background"
                    style={{
                        backgroundImage:
                            `url(${bg})`
                    }}
                />


                <div className="calendar-castle-overlay" />


                <div className="calendar-castle-main-container">


                    {/* BACK */}

                    <button
                        className="
                            calendar-top-button
                            calendar-back-button
                        "
                        onClick={handleBack}
                    >
                        ← Back
                    </button>


                    {/* SKIP */}

                    <button
                        className="
                            calendar-top-button
                            calendar-skip-button
                        "
                        onClick={handleSkip}
                    >
                        Skip →
                    </button>


                    {/* HEADER */}

                    <header className="calendar-castle-header">

                        <h1>
                            🏰 Calendar Castle
                        </h1>

                        <p>
                            Explore days and months
                            to unlock the castle!
                        </p>

                    </header>


                    {/* INTRO LAYOUT */}

                    <div className="calendar-intro-layout">


                        {/* TEACHER */}

                        <div className="calendar-intro-teacher-side">

                            <div className="calendar-intro-teacher-row">


                                <div className="calendar-teacher-box">

                                    <img
                                        src={teacher}
                                        alt="Teacher"
                                        className="calendar-teacher-image"
                                    />


                                    <div className="calendar-teacher-name">
                                        Miss Uroosa
                                    </div>

                                </div>


                                <div
                                    className="
                                        calendar-speech-bubble
                                        calendar-intro-bubble
                                    "
                                >

                                    {/* REPEAT INTRO SPEECH */}

                                    <button
                                        className="calendar-repeat-button"
                                        onClick={() =>
                                            speak(
                                                "Welcome to Calendar Castle! Find the correct days and months to unlock every room."
                                            )
                                        }
                                    >
                                        🔊
                                    </button>


                                    <p>

                                        Welcome to
                                        <span className="calendar-highlight">
                                            {" "}Calendar Castle!
                                        </span>

                                    </p>


                                    <p>

                                        Find the correct
                                        days and months
                                        to unlock every room.

                                    </p>

                                </div>

                            </div>


                            {/* STATS */}

                            <div className="calendar-intro-stats">


                                <div className="calendar-stat">

                                    <div
                                        className="
                                            calendar-stat-icon
                                            calendar-star-icon
                                        "
                                    >
                                        ⭐
                                    </div>


                                    <strong>
                                        0
                                    </strong>


                                    <span>
                                        Stars
                                    </span>

                                </div>


                                <div className="calendar-stat-divider" />


                                <div className="calendar-stat">

                                    <div
                                        className="
                                            calendar-stat-icon
                                            calendar-clue-icon
                                        "
                                    >
                                        📅
                                    </div>


                                    <strong>
                                        0/5
                                    </strong>


                                    <span>
                                        Challenges
                                    </span>

                                </div>


                            </div>

                        </div>


                        {/* CASTLE */}

                        <div className="calendar-intro-castle-side">

                            <div className="calendar-intro-castle-card">


                                <div className="calendar-castle-art">

                                    <img
                                        src={castleBg}
                                        alt=""
                                        className="
                                            calendar-intro-castle-bg
                                        "
                                    />


                                    <img
                                        src={castle}
                                        alt="Calendar Castle"
                                        className="
                                            calendar-intro-castle-image
                                        "
                                    />

                                </div>


                                <div className="calendar-intro-description">

                                    <h2>
                                        The Calendar Castle
                                    </h2>


                                    <p>
                                       
                                    </p>

                                </div>


                                <button
                                    className="calendar-start-button"
                                    onClick={startActivity}
                                >
                                    🗝️ Lets Go
                                </button>


                            </div>

                        </div>

                    </div>

                </div>

            </div>

        );

    }


    /* =====================================================
       ACTIVITY PAGE
    ===================================================== */

    return (

        <div className="calendar-castle-page">

            <div
                className="calendar-castle-background"
                style={{
                    backgroundImage:
                        `url(${bg})`
                }}
            />


            <div className="calendar-castle-overlay" />


            <div className="calendar-castle-main-container">


                {/* BACK */}

                <button
                    className="
                        calendar-top-button
                        calendar-back-button
                    "
                    onClick={handleBack}
                >
                    ← Back
                </button>


                {/* SKIP */}

                <button
                    className="
                        calendar-top-button
                        calendar-skip-button
                    "
                    onClick={handleSkip}
                >
                    Skip →
                </button>


                {/* HEADER */}

                <header className="calendar-castle-header">

                    <h1>
                        🏰 Calendar Castle
                    </h1>


                    <p>
                        Find the correct day or month
                        to unlock each room!
                    </p>

                </header>


                {/* ACTIVITY */}

                <div className="calendar-activity-layout">


                    {/* TEACHER */}

                    <div className="calendar-activity-teacher-area">


                        <img
                            src={teacher}
                            alt="Teacher"
                            className="calendar-activity-teacher-image"
                        />


                        <div className="calendar-activity-bubble">


                            <span className="calendar-clue-label">

                                CHALLENGE {round}/{totalRounds}

                            </span>


                            <p className="calendar-activity-message">

                                {challenge.question}

                            </p>


                            <button
                                className="calendar-repeat-button"
                                onClick={() =>
                                    speak(
                                        challenge.question
                                    )
                                }
                            >
                                🔊
                            </button>


                            {showResult && (

                                <div
                                    className={
                                        isCorrect
                                            ? "calendar-success-feedback"
                                            : "calendar-wrong-feedback"
                                    }
                                >
                                    {message}
                                </div>

                            )}

                        </div>

                    </div>


                    {/* GAME CARD */}

                    <div className="calendar-activity-castle-card">


                        {/* CASTLE */}

                        <div className="calendar-activity-castle-image-wrap">

                            <img
                                src={castleBg}
                                alt=""
                                className="
                                    calendar-activity-castle-bg
                                "
                            />


                            <img
                                src={castle}
                                alt="Calendar Castle"
                                className="
                                    calendar-activity-castle-image
                                "
                            />

                        </div>


                        {/* CHALLENGE BOX */}

                        <div className="calendar-challenge-box">


                            <div className="calendar-challenge-icon">

                                {challenge.type === "day"
                                    ? "📅"
                                    : "🗓️"}

                            </div>


                            <div>

                                <span>

                                    FIND THE CORRECT
                                    {challenge.type === "day"
                                        ? " DAY"
                                        : " MONTH"}

                                </span>


                                <strong>

                                    {challenge.question}

                                </strong>

                            </div>

                        </div>


                        {/* SECTION TITLE */}

                        <h2 className="calendar-section-title">

                            {challenge.type === "day"
                                ? "Which room should you unlock?"
                                : "Which room should you unlock?"}

                        </h2>


                        {/* OPTIONS */}

                        <div className="calendar-options-area">


                            {challenge.type === "day"
                                ? renderDayRooms()
                                : renderMonthRooms()}


                        </div>


                        {/* RESULT */}

                        {showResult && (

                            <div
                                className={
                                    isCorrect
                                        ? `
                                            calendar-result
                                            calendar-correct-feedback
                                        `
                                        : `
                                            calendar-result
                                            calendar-wrong-feedback
                                        `
                                }
                            >


                                <div className="calendar-result-left">


                                    <div className="calendar-result-icon">

                                        {isCorrect
                                            ? "🎉"
                                            : "💡"}

                                    </div>


                                    <div>

                                        <strong>

                                            {isCorrect
                                                ? "Correct!"
                                                : "Keep trying!"}

                                        </strong>


                                        <span>

                                            {message}

                                        </span>

                                    </div>

                                </div>


                                {/* ONLY WRONG ANSWER */}

                                {!isCorrect && (

                                    <button
                                        className="calendar-retry-button"
                                        onClick={retry}
                                    >
                                        Try Again
                                    </button>

                                )}


                            </div>

                        )}


                        {/* FOOTER */}

                        <div className="calendar-game-footer">


                            <div className="calendar-unlocked-info">

                                ⭐

                                <strong>
                                    {score}
                                </strong>

                                points

                            </div>


                            <div className="calendar-progress">

                                <div
                                    className="calendar-progress-fill"
                                    style={{
                                        width:
                                            `${(
                                                unlocked.length /
                                                totalRounds
                                            ) * 100}%`
                                    }}
                                />

                            </div>


                            <div className="calendar-unlocked-info">

                                📅

                                <strong>
                                    {unlocked.length}
                                </strong>

                                /{totalRounds}

                            </div>


                        </div>


                    </div>

                </div>

            </div>

        </div>

    );

};


export default CalendarCastle;