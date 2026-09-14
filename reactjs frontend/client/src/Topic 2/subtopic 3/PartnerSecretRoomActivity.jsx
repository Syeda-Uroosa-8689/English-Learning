import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

import "./PartnerSecretRoomActivity.css";

import roomImage from "../../assets/secret room.jpeg";
import partnerRoomImage from "../../assets/partnerSecretRoom.jpeg";
import teacherImage from "../../assets/teacher1.png";


/* =====================================================
   CLUES
===================================================== */

const clues = [
    {
        id: 1,
        name: "Books",
        emoji: "📚",

        clueText:
            "First clue! Your partner enjoys discovering stories and reading. Can you find something they may love?",

        wrongText:
            "Hmm, not this one! Listen carefully to my clue and look for something connected to reading.",

        successText:
            "Excellent! You found the books! Your partner may enjoy reading.",

        title: "A Love for Reading!",

        text:
            "The books tell us that your partner may enjoy reading and discovering new stories.",

        x: "58%",
        y: "28%",
        width: "13%",
        height: "28%",
    },

    {
        id: 2,
        name: "Headphones",
        emoji: "🎧",

        clueText:
            "Next clue! Your partner loves listening to songs and sounds. What object can help us discover this?",

        wrongText:
            "Not quite! Think about something your partner uses to listen to music.",

        successText:
            "Great job! You found the headphones! Your partner may enjoy music.",

        title: "Music Lover!",

        text:
            "The headphones are a clue that your partner may enjoy listening to music.",

        x: "78%",
        y: "18%",
        width: "9%",
        height: "18%",
    },

    {
        id: 3,
        name: "Football",
        emoji: "⚽",

        clueText:
            "Look carefully! Your partner may enjoy playing or watching a game with a ball. Can you find it?",

        wrongText:
            "Oops! That is not the clue. Look for something connected to sports.",

        successText:
            "Fantastic! You found the football! Your partner may enjoy sports.",

        title: "Sports Fan!",

        text:
            "The football suggests that your partner may enjoy playing or watching sports.",

        x: "65%",
        y: "55%",
        width: "10%",
        height: "18%",
    },

    {
        id: 4,
        name: "Snacks",
        emoji: "🍪",

        clueText:
            "Yummy clue! Your partner seems to enjoy tasty snacks. Can you spot something delicious?",

        wrongText:
            "Not this time! Look around for something yummy that your partner may enjoy eating.",

        successText:
            "Yay! You found the snacks! Your partner may enjoy tasty foods.",

        title: "Snack Time!",

        text:
            "The snacks on the table suggest that your partner may enjoy these tasty foods.",

        x: "40%",
        y: "62%",
        width: "18%",
        height: "16%",
    },

    {
        id: 5,
        name: "Art Supplies",
        emoji: "🎨",

        clueText:
            "Final clue! Your partner loves being creative with colours. Can you find the art supplies?",

        wrongText:
            "Almost! Look for something your partner can use to draw and create colourful art.",

        successText:
            "Amazing! You found the art supplies! You discovered all the clues!",

        title: "Creative Mind!",

        text:
            "The paints and pencils suggest that your partner may enjoy drawing and art.",

        x: "56%",
        y: "78%",
        width: "18%",
        height: "18%",
    },
];


function PartnerSecretRoomActivity({
    onBack,
    onSkip,
    onFinish
}) {

    const [screen, setScreen] = useState("intro");

    const [currentClueIndex, setCurrentClueIndex] = useState(0);

    const [foundClues, setFoundClues] = useState([]);

    const [teacherMessage, setTeacherMessage] = useState("");

    const [selectedClue, setSelectedClue] = useState(null);

    const [feedbackType, setFeedbackType] = useState("");

    const [isSpeaking, setIsSpeaking] = useState(false);

    const speechTimeout = useRef(null);


    const currentClue = clues[currentClueIndex];


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
       INTRO VOICE
    ===================================================== */

    useEffect(() => {

        if (screen !== "intro") return;

        const message =
            "Welcome to your partner's secret room! Look carefully around the room. Every clue will help you discover what your partner likes.";

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
       ACTIVITY CLUE VOICE
    ===================================================== */

    useEffect(() => {

        if (screen !== "activity") return;

        if (!currentClue) return;

        setFeedbackType("");
        setSelectedClue(null);

        setTeacherMessage(currentClue.clueText);

        const timer = setTimeout(() => {
            speak(currentClue.clueText);
        }, 450);

        return () => {
            clearTimeout(timer);
        };

    }, [screen, currentClueIndex]);


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

    const handleStartExploring = () => {

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
       WRONG CLICK
    ===================================================== */

    const handleWrongClick = () => {

        if (!currentClue) return;

        setFeedbackType("wrong");

        setTeacherMessage(currentClue.wrongText);

        speak(currentClue.wrongText);
    };


    /* =====================================================
       CORRECT CLUE
    ===================================================== */

    const handleCorrectClue = () => {

        if (!currentClue) return;

        if (foundClues.includes(currentClue.id)) return;

        const newFoundClues = [
            ...foundClues,
            currentClue.id
        ];

        setFoundClues(newFoundClues);

        setFeedbackType("success");

        setSelectedClue(currentClue);

        setTeacherMessage(currentClue.successText);

        speak(currentClue.successText);

        confetti({
            particleCount: 110,
            spread: 75,
            origin: {
                y: 0.58
            }
        });
    };


    /* =====================================================
       HOTSPOT CLICK
    ===================================================== */

    const handleHotspotClick = (clue) => {

        if (!currentClue) return;

        if (clue.id === currentClue.id) {
            handleCorrectClue();
        } else {
            handleWrongClick();
        }
    };


    /* =====================================================
       CONTINUE
    ===================================================== */

    const handleContinue = () => {

        if (currentClueIndex === clues.length - 1) {

            window.speechSynthesis.cancel();

            if (typeof onFinish === "function") {
                onFinish();
            }

            return;
        }

        setCurrentClueIndex((previous) => previous + 1);
    };


    /* =====================================================
       REPEAT
    ===================================================== */

    const handleRepeatClue = () => {
        speak(teacherMessage);
    };


    return (

        <div className="partner-secret-room-page">

            <div className="psr-background" />


            <div className="psr-main-container">


                {/* =================================================
                   BACK + SKIP
                   BOTH INTRO AND ACTIVITY PAGE
                ================================================= */}

                <button
                    type="button"
                    className="psr-top-button psr-back-button"
                    onClick={handleBack}
                >
                    <span>←</span>
                    Back
                </button>


                <button
                    type="button"
                    className="psr-top-button psr-skip-button"
                    onClick={handleSkip}
                >
                    Skip
                    <span>→</span>
                </button>


                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="psr-header">

                    <h1>
                        <span className="psr-header-door">
                            🚪
                        </span>

                        Partner's Secret Room
                    </h1>

                    <p>
                        Explore the secret room and discover what your partner likes!
                    </p>

                </div>


                {/* =================================================
                   INTRO SCREEN
                ================================================= */}

                {screen === "intro" && (

                    <div className="psr-intro-layout">

                        <div className="psr-intro-teacher-side">

                            <div className="psr-intro-teacher-row">

                                <div className="psr-teacher-box">

                                    <img
                                        src={teacherImage}
                                        alt="Miss Uroosa"
                                        className="psr-teacher-image"
                                    />

                                    <div className="psr-teacher-name">
                                        Miss Uroosa
                                    </div>

                                </div>


                                <div className="psr-speech-bubble psr-intro-bubble">

                                    <button
                                        type="button"
                                        className="psr-repeat-button"
                                        onClick={handleRepeatClue}
                                    >
                                        🔊
                                    </button>

                                    <p>
                                        Welcome to your partner's secret room!
                                    </p>

                                    <p>
                                        Look carefully around the room and discover what your partner{" "}
                                        <span className="psr-green-text">
                                            likes.
                                        </span>
                                    </p>

                                    <p>
                                        Every clue will help you learn more!
                                    </p>

                                </div>

                            </div>


                            <div className="psr-intro-stats">

                                <div className="psr-stat">

                                    <div className="psr-stat-icon psr-star-icon">
                                        ⭐
                                    </div>

                                    <strong>0</strong>

                                    <span>Stars</span>

                                </div>


                                <div className="psr-stat-divider" />


                                <div className="psr-stat">

                                    <div className="psr-stat-icon psr-clue-icon">
                                        🔎
                                    </div>

                                    <strong>0/5</strong>

                                    <span>Room Clues</span>

                                </div>

                            </div>

                        </div>


                        <div className="psr-intro-room-side">

                            <div className="psr-intro-room-image-wrap">

                                <img
                                    src={roomImage}
                                    alt="Secret room"
                                    className="psr-intro-room-image"
                                />

                            </div>


                            <button
                                type="button"
                                className="psr-start-exploring"
                                onClick={handleStartExploring}
                            >

                                <span className="psr-search-button-icon">
                                    🔎
                                </span>

                                Start Exploring

                            </button>

                        </div>

                    </div>

                )}


                {/* =================================================
                   ACTIVITY SCREEN
                ================================================= */}

                {screen === "activity" && (

                    <div className="psr-activity-layout">

                        <div className="psr-activity-room-card">


                            {/* ROOM IMAGE */}

                            <img
                                src={partnerRoomImage}
                                alt="Partner room"
                                className="psr-activity-room-image"
                            />


                            {/* CLUE COUNTER */}

                            <div className="psr-clue-counter">

                                <div className="psr-clue-counter-circle">

                                    🔎

                                </div>


                                <strong>
                                    {foundClues.length}/5
                                </strong>


                                <span>
                                    Room Clues
                                </span>

                            </div>


                            {/* TEACHER */}

                            <div className="psr-activity-teacher-area">

                                <img
                                    src={teacherImage}
                                    alt="Miss Uroosa"
                                    className="psr-activity-teacher-image"
                                />


                                <div className="psr-speech-bubble psr-activity-bubble">

                                    <button
                                        type="button"
                                        className="psr-repeat-button"
                                        onClick={handleRepeatClue}
                                    >
                                        {isSpeaking ? "🔊" : "🔈"}
                                    </button>


                                    <div className="psr-clue-label">

                                        CLUE {currentClueIndex + 1} OF 5

                                    </div>


                                    <p className="psr-activity-message">

                                        {teacherMessage}

                                    </p>


                                    {feedbackType === "wrong" && (

                                        <div className="psr-wrong-feedback">

                                            Try again! 👀

                                        </div>

                                    )}


                                    {feedbackType === "success" && (

                                        <div className="psr-success-feedback">

                                            Great finding! ⭐

                                        </div>

                                    )}

                                </div>

                            </div>


                            {/* HOTSPOTS */}

                            {clues.map((clue) => {

                                const isCurrent =
                                    clue.id === currentClue.id;

                                const isFound =
                                    foundClues.includes(clue.id);


                                return (

                                    <button
                                        key={clue.id}
                                        type="button"
                                        className={
                                            `psr-hotspot
                                            ${isCurrent ? "psr-hotspot-current" : ""}
                                            ${isFound ? "psr-hotspot-found" : ""}`
                                        }
                                        style={{
                                            left: clue.x,
                                            top: clue.y,
                                            width: clue.width,
                                            height: clue.height,
                                        }}
                                        onClick={() =>
                                            handleHotspotClick(clue)
                                        }
                                        aria-label={clue.name}
                                    />

                                );

                            })}

                        </div>

                    </div>

                )}

            </div>


            {/* =====================================================
               SUCCESS POPUP
            ===================================================== */}

            {selectedClue && (

                <div className="psr-popup-overlay">

                    <div className="psr-success-popup">

                        <div className="psr-popup-clue-icon">

                            {selectedClue.emoji}

                        </div>


                        <div className="psr-popup-found-label">

                            ✦ CLUE FOUND!

                        </div>


                        <h2>

                            {selectedClue.title}

                        </h2>


                        <p>

                            {selectedClue.text}

                        </p>


                        <div className="psr-popup-bottom">

                            <div className="psr-popup-count">

                                ⭐ {foundClues.length}/5

                            </div>


                            <button
                                type="button"
                                className="psr-popup-next"
                                onClick={handleContinue}
                            >

                                {currentClueIndex === clues.length - 1
                                    ? "Finish"
                                    : "Next Clue →"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


export default PartnerSecretRoomActivity;