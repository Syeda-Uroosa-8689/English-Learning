import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

import "./PreferenceThemeParkActivity.css";

/* =====================================================
   BACKGROUNDS
===================================================== */

import chatBg from "../../assets/chatbg.jpeg";
import mainBg from "../../assets/partner.jpeg";

import teacherImage from "../../assets/teacher1.png";
import themeParkImage from "../../assets/themepark.jpeg";

/* =====================================================
   CHARACTER SELECT IMAGES
===================================================== */

import girlSelect from "../../assets/girlpark.png";
import boySelect from "../../assets/boypark.png";

/* =====================================================
   GIRL DIRECTIONS
===================================================== */

import girlFront from "../../assets/girlpark.png";
import girlBack from "../../assets/girlBack.png";
import girlLeft from "../../assets/girlLeft.png";
import girlRight from "../../assets/girlleft.png";

/* =====================================================
   BOY DIRECTIONS
===================================================== */

import boyFront from "../../assets/boypark.png";
import boyBack from "../../assets/boyBack.png";
import boyLeft from "../../assets/boyLeft.png";
import boyRight from "../../assets/boyleft.png";


/* =====================================================
   GAME ROUNDS
===================================================== */

const rounds = [
    {
        id: 1,
        partner: "Aisha",
        clue:
            "Aisha loves exciting rides and adventures, but she does not like quiet activities.",
        question:
            "Which zone should Aisha visit?",
        correctZone: "adventure",
        explanation:
            "Correct! Aisha loves exciting adventures, so the Adventure Zone is perfect for her.",
        wrong:
            "Oops! Read the clue carefully. Aisha loves exciting adventures.",
        emoji: "🎢",
    },

    {
        id: 2,
        partner: "Aisha",
        clue:
            "Aisha loves drawing and creating colourful art. She does not enjoy sports.",
        question:
            "Which zone should Aisha visit?",
        correctZone: "creative",
        explanation:
            "Great choice! Aisha loves drawing and creating colourful art.",
        wrong:
            "Not quite! Look for the zone connected to drawing and creativity.",
        emoji: "🎨",
    },

    {
        id: 3,
        partner: "Aisha",
        clue:
            "Aisha enjoys playing games with a ball, but she does not like noisy rides.",
        question:
            "Which zone should Aisha visit?",
        correctZone: "sports",
        explanation:
            "Excellent! Aisha enjoys activities connected to sports and balls.",
        wrong:
            "Try again! Think about games that use a ball.",
        emoji: "⚽",
    },

    {
        id: 4,
        partner: "Aisha",
        clue:
            "Aisha loves tasty food and enjoys trying delicious meals. She does not want adventure rides.",
        question:
            "Which zone should Aisha visit?",
        correctZone: "food",
        explanation:
            "Yummy! The Food Zone is the best choice for someone who loves tasty food.",
        wrong:
            "Not this zone! Look for a place connected to delicious food.",
        emoji: "🍕",
    },

    {
        id: 5,
        partner: "Aisha",
        clue:
            "Aisha prefers peaceful places where she can read and relax. She does not like exciting rides.",
        question:
            "Which zone should Aisha visit?",
        correctZone: "quiet",
        explanation:
            "Perfect! Aisha prefers peaceful places where she can read and relax.",
        wrong:
            "Look carefully at the clue. Aisha prefers peaceful and quiet activities.",
        emoji: "📚",
    },
];


/* =====================================================
   THEME PARK ZONES + WALKING ROUTES
===================================================== */

const zones = [
    {
        id: "adventure",
        name: "Adventure Zone",
        emoji: "🎢",

        x: "17%",
        y: "27%",

        route: [
            { x: 50, y: 53 },
            { x: 45, y: 52 },
            { x: 39, y: 49 },
            { x: 34, y: 46 },
            { x: 28, y: 44 },
            { x: 23, y: 40 },
            { x: 19, y: 35 },
            { x: 17, y: 30 },
        ],
    },

    {
        id: "food",
        name: "Food Zone",
        emoji: "🍕",

        x: "82%",
        y: "28%",

        route: [
            { x: 50, y: 53 },
            { x: 57, y: 51 },
            { x: 63, y: 49 },
            { x: 69, y: 47 },
            { x: 74, y: 43 },
            { x: 78, y: 38 },
            { x: 82, y: 32 },
        ],
    },

    {
        id: "creative",
        name: "Creative Zone",
        emoji: "🎨",

        x: "13%",
        y: "67%",

        route: [
            { x: 50, y: 53 },
            { x: 45, y: 55 },
            { x: 39, y: 58 },
            { x: 34, y: 61 },
            { x: 29, y: 63 },
            { x: 23, y: 65 },
            { x: 17, y: 67 },
        ],
    },

    {
        id: "sports",
        name: "Sports Zone",
        emoji: "⚽",

        x: "57%",
        y: "76%",

        route: [
            { x: 50, y: 53 },
            { x: 50, y: 58 },
            { x: 52, y: 63 },
            { x: 54, y: 68 },
            { x: 56, y: 73 },
        ],
    },

    {
        id: "quiet",
        name: "Quiet Zone",
        emoji: "📚",

        x: "88%",
        y: "69%",

        route: [
            { x: 50, y: 53 },
            { x: 57, y: 55 },
            { x: 64, y: 57 },
            { x: 70, y: 60 },
            { x: 76, y: 63 },
            { x: 82, y: 66 },
            { x: 87, y: 69 },
        ],
    },
];


/* =====================================================
   COMPONENT
===================================================== */

function PreferenceThemeParkActivity({
    onBack,
    onSkip,
    onFinish,
}) {

    const [screen, setScreen] = useState("intro");

    const [selectedCharacter, setSelectedCharacter] =
        useState(null);

    const [currentRoundIndex, setCurrentRoundIndex] =
        useState(0);

    const currentRound =
        rounds[currentRoundIndex];

    const [tickets, setTickets] =
        useState(3);

    const [foundRounds, setFoundRounds] =
        useState([]);

    const [teacherMessage, setTeacherMessage] =
        useState("");

    const [feedbackType, setFeedbackType] =
        useState("");

    const [selectedZone, setSelectedZone] =
        useState(null);

    const [isMoving, setIsMoving] =
        useState(false);

    const [showPopup, setShowPopup] =
        useState(false);

    const [gameOver, setGameOver] =
        useState(false);

    const [characterPosition, setCharacterPosition] =
        useState({
            x: 50,
            y: 53,
        });

    const [characterDirection, setCharacterDirection] =
        useState("front");

    const [isSpeaking, setIsSpeaking] =
        useState(false);

    const speechTimeout =
        useRef(null);


    /* =====================================================
       GET CHARACTER IMAGE
    ===================================================== */

    const getCharacterImage = () => {

        if (!selectedCharacter) return null;

        const characterImages = {

            girl: {
                front: girlFront,
                back: girlBack,
                left: girlLeft,
                right: girlRight,
            },

            boy: {
                front: boyFront,
                back: boyBack,
                left: boyLeft,
                right: boyRight,
            },

        };

        return characterImages[selectedCharacter][
            characterDirection
        ];
    };


    /* =====================================================
       SPEAK
    ===================================================== */

    const speak = (text) => {

        if (!("speechSynthesis" in window)) return;

        window.speechSynthesis.cancel();

        clearTimeout(speechTimeout.current);

        const utterance =
            new SpeechSynthesisUtterance(text);

        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        utterance.volume = 1;

        const voices =
            window.speechSynthesis.getVoices();

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
            "Welcome to the Preference Theme Park! Choose your explorer, listen carefully to your partner's preferences, and visit the correct zone. But be careful, you only have three tickets!";

        setTeacherMessage(message);

        const timer =
            setTimeout(() => {
                speak(message);
            }, 500);

        return () => {
            clearTimeout(timer);
            window.speechSynthesis.cancel();
        };

    }, [screen]);


    /* =====================================================
       CHARACTER SELECT
    ===================================================== */

    useEffect(() => {

        if (screen !== "select") return;

        const message =
            "Choose your explorer! This character will travel around the theme park with you.";

        setTeacherMessage(message);

        const timer =
            setTimeout(() => {
                speak(message);
            }, 300);

        return () => {
            clearTimeout(timer);
        };

    }, [screen]);


    /* =====================================================
       GAME ROUND
    ===================================================== */

    useEffect(() => {

        if (screen !== "game") return;

        setFeedbackType("");
        setSelectedZone(null);
        setShowPopup(false);

        const message =
            `${currentRound.clue} ${currentRound.question}`;

        setTeacherMessage(message);

        const timer =
            setTimeout(() => {
                speak(message);
            }, 500);

        return () => {
            clearTimeout(timer);
        };

    }, [
        screen,
        currentRoundIndex,
    ]);


    /* =====================================================
       CLEANUP
    ===================================================== */

    useEffect(() => {

        return () => {

            window.speechSynthesis.cancel();

            clearTimeout(
                speechTimeout.current
            );

        };

    }, []);


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
       START
    ===================================================== */

    const handleStart = () => {

        window.speechSynthesis.cancel();

        setScreen("select");
    };


    /* =====================================================
       CHARACTER SELECT
    ===================================================== */

    const handleCharacterSelect =
        (character) => {

            setSelectedCharacter(character);
        };


    /* =====================================================
       START GAME
    ===================================================== */

    const handleStartGame = () => {

        if (!selectedCharacter) return;

        window.speechSynthesis.cancel();

        setCharacterPosition({
            x: 50,
            y: 53,
        });

        setCharacterDirection("front");

        setScreen("game");
    };


    /* =====================================================
       FIND DIRECTION
    ===================================================== */

    const getDirection = (
        oldX,
        oldY,
        newX,
        newY
    ) => {

        const xDifference =
            newX - oldX;

        const yDifference =
            newY - oldY;

        if (
            Math.abs(xDifference) >
            Math.abs(yDifference)
        ) {

            return xDifference > 0
                ? "right"
                : "left";
        }

        return yDifference > 0
            ? "front"
            : "back";
    };


    /* =====================================================
       WALK CHARACTER ON PATH
    ===================================================== */

    const walkCharacter =
        async (route) => {

            for (
                let index = 1;
                index < route.length;
                index++
            ) {

                const nextPoint =
                    route[index];

                setCharacterPosition((previous) => {

                    const direction =
                        getDirection(
                            previous.x,
                            previous.y,
                            nextPoint.x,
                            nextPoint.y
                        );

                    setCharacterDirection(
                        direction
                    );

                    return {
                        x: nextPoint.x,
                        y: nextPoint.y,
                    };
                });

                await new Promise(
                    (resolve) =>
                        setTimeout(
                            resolve,
                            420
                        )
                );
            }
        };


    /* =====================================================
       ZONE CLICK
    ===================================================== */

    const handleZoneClick =
        async (zone) => {

            if (isMoving) return;
            if (showPopup) return;
            if (gameOver) return;

            setIsMoving(true);

            setSelectedZone(zone);

            await walkCharacter(
                zone.route
            );

            setIsMoving(false);


            /* =================================================
               CORRECT
            ================================================= */

            if (
                zone.id ===
                currentRound.correctZone
            ) {

                const newFoundRounds = [
                    ...foundRounds,
                    currentRound.id,
                ];

                setFoundRounds(
                    newFoundRounds
                );

                setFeedbackType(
                    "success"
                );

                setTeacherMessage(
                    currentRound.explanation
                );

                speak(
                    currentRound.explanation
                );

                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: {
                        y: 0.6,
                    },
                });

                setTimeout(() => {

                    setShowPopup(true);

                }, 700);

                return;
            }


            /* =================================================
               WRONG
            ================================================= */

            const remainingTickets =
                tickets - 1;

            setTickets(
                remainingTickets
            );

            setFeedbackType(
                "wrong"
            );

            setTeacherMessage(
                currentRound.wrong
            );

            speak(
                currentRound.wrong
            );

            if (
                remainingTickets <= 0
            ) {

                setTimeout(() => {

                    setGameOver(true);

                }, 1000);
            }
        };


    /* =====================================================
       NEXT ROUND
    ===================================================== */

    const handleNextRound = () => {

        setShowPopup(false);
        setFeedbackType("");
        setSelectedZone(null);

        if (
            currentRoundIndex ===
            rounds.length - 1
        ) {

            window.speechSynthesis.cancel();

            if (
                typeof onFinish === "function"
            ) {
                onFinish();
            }

            return;
        }

        setCurrentRoundIndex(
            (previous) =>
                previous + 1
        );

        setCharacterPosition({
            x: 50,
            y: 53,
        });

        setCharacterDirection(
            "front"
        );
    };


    /* =====================================================
       RESTART
    ===================================================== */

    const handleRestart = () => {

        setTickets(3);

        setCurrentRoundIndex(0);

        setFoundRounds([]);

        setFeedbackType("");

        setSelectedZone(null);

        setGameOver(false);

        setShowPopup(false);

        setCharacterPosition({
            x: 50,
            y: 53,
        });

        setCharacterDirection(
            "front"
        );
    };


    /* =====================================================
       REPEAT
    ===================================================== */

    const handleRepeat = () => {

        speak(teacherMessage);
    };


    return (

        <div className="preference-theme-park-page">

            <div
                className="ptp-background"
                style={{
                    backgroundImage:
                        `url(${chatBg})`
                }}
            />

            <div
                className="ptp-main-container"
                style={{
                    backgroundImage:
                        `url(${mainBg})`
                }}
            >

                {/* TOP BUTTONS */}

                <button
                    type="button"
                    className="ptp-top-button ptp-back-button"
                    onClick={handleBack}
                >
                    <span>←</span>
                    Back
                </button>

                <button
                    type="button"
                    className="ptp-top-button ptp-skip-button"
                    onClick={handleSkip}
                >
                    Skip
                    <span>→</span>
                </button>


                {/* HEADER */}

                <div className="ptp-header">

                    <h1>
                        🎡 Preference Theme Park
                    </h1>

                    <p>
                        Listen carefully and help your partner
                        choose the perfect zone!
                    </p>

                </div>


                {/* =====================================================
                    INTRO
                ===================================================== */}

                {screen === "intro" && (

                    <div className="ptp-intro-layout">

                        <div className="ptp-intro-teacher-side">

                            <div className="ptp-intro-teacher-row">

                                <div className="ptp-teacher-box">

                                    <img
                                        src={teacherImage}
                                        alt="Miss Uroosa"
                                        className="ptp-teacher-image"
                                    />

                                    <div className="ptp-teacher-name">
                                        Miss Uroosa
                                    </div>

                                </div>

                                <div className="ptp-speech-bubble ptp-intro-bubble">

                                    <button
                                        type="button"
                                        className="ptp-repeat-button"
                                        onClick={handleRepeat}
                                    >
                                        {isSpeaking
                                            ? "🔊"
                                            : "🔈"}
                                    </button>

                                    <p>
                                        Welcome to the{" "}

                                        <span className="ptp-highlight-text">
                                            Preference Theme Park!
                                        </span>
                                    </p>

                                    <p>
                                        Listen carefully to your
                                        partner's likes and dislikes.
                                    </p>

                                    <p>
                                        Choose the correct zone —
                                        but be careful! You only
                                        have limited tickets! 🎟️
                                    </p>

                                </div>

                            </div>

                            <div className="ptp-intro-stats">

                                <div className="ptp-stat">

                                    <div className="ptp-stat-icon">
                                        🎟️
                                    </div>

                                    <strong>
                                        3
                                    </strong>

                                    <span>
                                        Tickets
                                    </span>

                                </div>

                                <div className="ptp-stat-divider" />

                                <div className="ptp-stat">

                                    <div className="ptp-stat-icon">
                                        🎡
                                    </div>

                                    <strong>
                                        5
                                    </strong>

                                    <span>
                                        Zones
                                    </span>

                                </div>

                            </div>

                        </div>


                        <div className="ptp-intro-park-side">

                            <div className="ptp-intro-park-wrap">

                                <img
                                    src={themeParkImage}
                                    alt="Theme Park"
                                    className="ptp-intro-park-image"
                                />

                            </div>

                            <button
                                type="button"
                                className="ptp-start-button"
                                onClick={handleStart}
                            >
                                🎡 Start Exploring
                            </button>

                        </div>

                    </div>

                )}


                {/* =====================================================
                    CHARACTER SELECT
                ===================================================== */}

                {screen === "select" && (

                    <div className="ptp-select-layout">

                        <div className="ptp-select-teacher">

                            <img
                                src={teacherImage}
                                alt="Miss Uroosa"
                                className="ptp-select-teacher-image"
                            />

                            <div className="ptp-teacher-name">
                                Miss Uroosa
                            </div>

                        </div>


                        <div className="ptp-character-select-card">

                            <button
                                type="button"
                                className="ptp-repeat-button ptp-select-repeat"
                                onClick={handleRepeat}
                            >
                                🔊
                            </button>

                            <div className="ptp-select-title">

                                <span>🧭</span>

                                <div>

                                    <h2>
                                        Choose Your Explorer!
                                    </h2>

                                    <p>
                                        Pick the character who
                                        will explore the park.
                                    </p>

                                </div>

                            </div>


                            <div className="ptp-character-options">

                                <button
                                    type="button"
                                    className={`ptp-character-card ${
                                        selectedCharacter === "girl"
                                            ? "ptp-character-selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleCharacterSelect("girl")
                                    }
                                >

                                    <div className="ptp-character-image-wrap">

                                        <img
                                            src={girlSelect}
                                            alt="Girl explorer"
                                        />

                                    </div>

                                    <strong>
                                        Girl Explorer
                                    </strong>

                                    {selectedCharacter === "girl" && (

                                        <div className="ptp-selected-badge">
                                            ✓ Selected
                                        </div>

                                    )}

                                </button>


                                <button
                                    type="button"
                                    className={`ptp-character-card ${
                                        selectedCharacter === "boy"
                                            ? "ptp-character-selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handleCharacterSelect("boy")
                                    }
                                >

                                    <div className="ptp-character-image-wrap">

                                        <img
                                            src={boySelect}
                                            alt="Boy explorer"
                                        />

                                    </div>

                                    <strong>
                                        Boy Explorer
                                    </strong>

                                    {selectedCharacter === "boy" && (

                                        <div className="ptp-selected-badge">
                                            ✓ Selected
                                        </div>

                                    )}

                                </button>

                            </div>


                            <button
                                type="button"
                                className="ptp-begin-button"
                                disabled={!selectedCharacter}
                                onClick={handleStartGame}
                            >
                                Let's Go! 🚀
                            </button>

                        </div>

                    </div>

                )}


                {/* =====================================================
                    GAME
                ===================================================== */}

                {screen === "game" && (

                    <div className="ptp-game-layout">

                        <div className="ptp-park-card">


                            {/* PARK IMAGE */}

                            <div className="ptp-park-image-wrap">

                                <img
                                    src={themeParkImage}
                                    alt="Theme Park"
                                    className="ptp-park-image"
                                />

                            </div>


                            {/* WALKING PATHS */}

                            <svg
                                className="ptp-walking-paths"
                                viewBox="0 0 1000 700"
                                preserveAspectRatio="none"
                            >

                                <path
                                    d="
                                        M500 370
                                        C440 365, 400 340, 350 315
                                        C290 285, 245 250, 170 205
                                    "
                                />

                                <path
                                    d="
                                        M500 370
                                        C580 360, 630 345, 700 320
                                        C760 295, 795 250, 825 220
                                    "
                                />

                                <path
                                    d="
                                        M500 370
                                        C430 390, 380 410, 325 430
                                        C260 450, 210 465, 145 470
                                    "
                                />

                                <path
                                    d="
                                        M500 370
                                        C500 420, 515 470, 535 530
                                    "
                                />

                                <path
                                    d="
                                        M500 370
                                        C575 390, 640 415, 700 445
                                        C770 475, 825 495, 875 505
                                    "
                                />

                            </svg>


                            {/* TOP INFO */}

                            <div className="ptp-game-top-info">

                                <div className="ptp-round-counter">

                                    <span>🎯</span>

                                    <div>

                                        <strong>
                                            Round {currentRoundIndex + 1}/5
                                        </strong>

                                        <small>
                                            Find the perfect zone
                                        </small>

                                    </div>

                                </div>


                                <div className="ptp-ticket-counter">

                                    <span className="ptp-ticket-icon">
                                        🎟️
                                    </span>

                                    <div>

                                        <strong>
                                            {tickets}
                                        </strong>

                                        <small>
                                            Tickets Left
                                        </small>

                                    </div>

                                </div>

                            </div>


                            {/* ZONES */}

                            {zones.map((zone) => (

                                <button
                                    key={zone.id}
                                    type="button"
                                    disabled={isMoving}
                                    className={`ptp-zone-button ${
                                        selectedZone?.id === zone.id
                                            ? "ptp-zone-active"
                                            : ""
                                    }`}
                                    style={{
                                        left: zone.x,
                                        top: zone.y,
                                    }}
                                    onClick={() =>
                                        handleZoneClick(zone)
                                    }
                                >

                                    <span>
                                        {zone.emoji}
                                    </span>

                                    <strong>
                                        {zone.name}
                                    </strong>

                                </button>

                            ))}


                            {/* MOVING CHARACTER */}

                            {selectedCharacter && (

                                <div
                                    className={`ptp-moving-character ${
                                        isMoving
                                            ? "ptp-character-moving"
                                            : ""
                                    }`}
                                    style={{
                                        left:
                                            `${characterPosition.x}%`,

                                        top:
                                            `${characterPosition.y}%`,
                                    }}
                                >

                                    <img
                                        src={getCharacterImage()}
                                        alt="Explorer"
                                    />

                                </div>

                            )}


                            {/* =========================================
                                GAME CLUE BUBBLE ONLY
                                TEACHER REMOVED
                            ========================================= */}

                            <div className="ptp-game-clue-area">

                                <div className="ptp-speech-bubble ptp-game-bubble">

                                    <button
                                        type="button"
                                        className="ptp-repeat-button"
                                        onClick={handleRepeat}
                                    >
                                        {isSpeaking
                                            ? "🔊"
                                            : "🔈"}
                                    </button>

                                    <div className="ptp-clue-label">

                                        {currentRound.emoji}

                                        PARTNER PREFERENCE

                                    </div>

                                    <p className="ptp-game-message">
                                        {teacherMessage}
                                    </p>

                                    {feedbackType === "wrong" && (

                                        <div className="ptp-wrong-feedback">
                                            Wrong zone! One ticket was used. 🎟️
                                        </div>

                                    )}

                                    {feedbackType === "success" && (

                                        <div className="ptp-success-feedback">
                                            Perfect choice! ⭐
                                        </div>

                                    )}

                                </div>

                            </div>


                            {/* GAME OVER */}

                            {gameOver && (

                                <div className="ptp-game-over-overlay">

                                    <div className="ptp-game-over-card">

                                        <div className="ptp-game-over-icon">
                                            🎟️
                                        </div>

                                        <h2>
                                            Oh no! No Tickets Left!
                                        </h2>

                                        <p>
                                            Read the clues carefully
                                            and try choosing the correct
                                            zones again!
                                        </p>

                                        <button
                                            type="button"
                                            onClick={handleRestart}
                                        >
                                            Try Again 🔄
                                        </button>

                                    </div>

                                </div>

                            )}

                        </div>

                    </div>

                )}

            </div>


            {/* SUCCESS POPUP */}

            {showPopup && (

                <div className="ptp-popup-overlay">

                    <div className="ptp-success-popup">

                        <div className="ptp-popup-icon">
                            {currentRound.emoji}
                        </div>

                        <div className="ptp-popup-label">
                            ✦ PERFECT CHOICE!
                        </div>

                        <h2>
                            Great Decision!
                        </h2>

                        <p>
                            {currentRound.explanation}
                        </p>

                        <div className="ptp-popup-bottom">

                            <div className="ptp-popup-progress">
                                ⭐ {foundRounds.length}/5 Zones
                            </div>

                            <button
                                type="button"
                                onClick={handleNextRound}
                            >

                                {currentRoundIndex ===
                                rounds.length - 1
                                    ? "Finish 🎉"
                                    : "Next Preference →"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}


export default PreferenceThemeParkActivity;