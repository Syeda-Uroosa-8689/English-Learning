import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

import "./MysteryGiftMissionActivity.css";

/* =====================================================
   BACKGROUNDS
===================================================== */

import chatBg from "../../assets/chatbg.jpeg";
import mainBg from "../../assets/partner.jpeg";

/* =====================================================
   TEACHER
===================================================== */

import teacherImage from "../../assets/teacher1.png";

/* =====================================================
   GIFT IMAGES
===================================================== */

import artGift from "../../assets/artGift.png";
import footballGift from "../../assets/footballGift.png";
import headphonesGift from "../../assets/headphonesGift.png";
import cookingGift from "../../assets/cookingGift.png";
import bookGift from "../../assets/bookGift.png";
import guitarGift from "../../assets/guitarGift.png";

/* =====================================================
   WRAPPING IMAGES
   CHANGE ONLY THESE 2 FILENAMES IF YOUR FILE NAMES
   ARE DIFFERENT.
===================================================== */

import giftWrapOpen from "../../assets/opengift.png";
import giftWrapClosed from "../../assets/closedgift.png";


/* =====================================================
   GIFTS
===================================================== */

const gifts = {
    art: {
        id: "art",
        name: "Art Set",
        emoji: "🎨",
        image: artGift,
    },

    football: {
        id: "football",
        name: "Football",
        emoji: "⚽",
        image: footballGift,
    },

    headphones: {
        id: "headphones",
        name: "Headphones",
        emoji: "🎧",
        image: headphonesGift,
    },

    cooking: {
        id: "cooking",
        name: "Cooking Set",
        emoji: "🍳",
        image: cookingGift,
    },

    book: {
        id: "book",
        name: "Story Book",
        emoji: "📚",
        image: bookGift,
    },

    guitar: {
        id: "guitar",
        name: "Guitar",
        emoji: "🎸",
        image: guitarGift,
    },
};


/* =====================================================
   GAME ROUNDS
===================================================== */

const rounds = [

    {
        id: 1,

        partner: "Aisha",

        clue:
            "My partner spends hours drawing colourful pictures. She loves painting and creating art.",

        question:
            "Which gift would be perfect for her?",

        correctGift: "art",

        explanation:
            "This Art Set is perfect because Aisha loves drawing and creating art.",

        wrong:
            "Think about Aisha's favourite activity. What does she love creating?",

        options: [
            "art",
            "football",
            "headphones",
            "cooking",
        ],

        emoji: "🎨",
    },


    {
        id: 2,

        partner: "Rohan",

        clue:
            "My partner loves playing games with a ball. He enjoys running around and playing football with his friends.",

        question:
            "Which gift is perfect for him?",

        correctGift: "football",

        explanation:
            "Football is a great gift because Rohan loves playing football with his friends.",

        wrong:
            "Look carefully at the clue. Which gift matches Rohan's favourite activity?",

        options: [
            "football",
            "book",
            "guitar",
            "art",
        ],

        emoji: "⚽",
    },


    {
        id: 3,

        partner: "Maya",

        clue:
            "My partner loves listening to songs and enjoys music every day. She likes using headphones when she listens to her favourite songs.",

        question:
            "Which gift would she enjoy?",

        correctGift: "headphones",

        explanation:
            "Headphones are perfect because Maya loves listening to music.",

        wrong:
            "Think about Maya's favourite thing to do. What does she use when she listens to music?",

        options: [
            "headphones",
            "cooking",
            "football",
            "book",
        ],

        emoji: "🎧",
    },


    {
        id: 4,

        partner: "Arjun",

        clue:
            "My partner loves helping in the kitchen. He enjoys baking cakes and making tasty food with his family.",

        question:
            "Which gift is best for him?",

        correctGift: "cooking",

        explanation:
            "The Cooking Set is perfect because Arjun loves baking and helping in the kitchen.",

        wrong:
            "Think about what Arjun enjoys doing in the kitchen.",

        options: [
            "cooking",
            "guitar",
            "football",
            "headphones",
        ],

        emoji: "🍳",
    },


    {
        id: 5,

        partner: "Sara",

        clue:
            "My partner loves reading and painting. She already has many storybooks, so choose something that matches another hobby she enjoys.",

        question:
            "What is the best gift for her?",

        correctGift: "art",

        explanation:
            "The Art Set is the best choice because Sara loves painting and already has many books.",

        wrong:
            "Read all the clues carefully. Sara already has many books. What other hobby does she enjoy?",

        options: [
            "book",
            "art",
            "football",
            "guitar",
        ],

        emoji: "🎁",
    },

];


/* =====================================================
   COMPONENT
===================================================== */

function MysteryGiftMissionActivity({
    onBack,
    onSkip,
    onFinish,
}) {

    const [currentRoundIndex, setCurrentRoundIndex] =
        useState(0);

    const [score, setScore] =
        useState(0);

    const [selectedGift, setSelectedGift] =
        useState(null);

    /*
       idle
       wrong
       wrapping
       wrapped
       complete
    */

    const [gameState, setGameState] =
        useState("idle");

    const [teacherMessage, setTeacherMessage] =
        useState("");

    const [isSpeaking, setIsSpeaking] =
        useState(false);

    const speechTimeout =
        useRef(null);

    const wrappingTimeout =
        useRef(null);

    const currentRound =
        rounds[currentRoundIndex];

    const selectedGiftData =
        selectedGift
            ? gifts[selectedGift]
            : null;


    /* =====================================================
       SPEAK
    ===================================================== */

    const speak = (text) => {

        if (!("speechSynthesis" in window)) {
            return;
        }

        window.speechSynthesis.cancel();

        clearTimeout(
            speechTimeout.current
        );

        const utterance =
            new SpeechSynthesisUtterance(text);

        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        utterance.volume = 1;

        const voices =
            window.speechSynthesis.getVoices();

        const femaleVoice =
            voices.find((voice) =>
                voice.name
                    .toLowerCase()
                    .includes("zira")
            ) ||
            voices.find((voice) =>
                voice.name
                    .toLowerCase()
                    .includes("female")
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

        window.speechSynthesis.speak(
            utterance
        );
    };


    /* =====================================================
       NEW ROUND
    ===================================================== */

    useEffect(() => {

        const message =
            `${currentRound.clue} ${currentRound.question}`;

        setTeacherMessage(message);

        setSelectedGift(null);

        setGameState("idle");

        clearTimeout(
            wrappingTimeout.current
        );

        const timer =
            setTimeout(() => {
                speak(message);
            }, 500);

        return () => {
            clearTimeout(timer);
            clearTimeout(wrappingTimeout.current);
        };

    }, [currentRoundIndex]);


    /* =====================================================
       CLEANUP
    ===================================================== */

    useEffect(() => {

        return () => {

            window.speechSynthesis.cancel();

            clearTimeout(
                speechTimeout.current
            );

            clearTimeout(
                wrappingTimeout.current
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
       REPEAT
    ===================================================== */

    const handleRepeat = () => {

        if (teacherMessage) {
            speak(teacherMessage);
        }
    };


    /* =====================================================
       GIFT SELECT
    ===================================================== */

    const handleGiftSelect = (giftId) => {

        if (
            gameState === "wrapping" ||
            gameState === "wrapped" ||
            gameState === "complete"
        ) {
            return;
        }


        setSelectedGift(giftId);


        /* =================================================
           WRONG
        ================================================= */

        if (
            giftId !== currentRound.correctGift
        ) {

            setGameState("wrong");

            setTeacherMessage(
                currentRound.wrong
            );

            speak(
                currentRound.wrong
            );

            return;
        }


        /* =================================================
           CORRECT
        ================================================= */

        const newScore =
            score + 1;

        setScore(newScore);

        setGameState("wrapping");


        const wrappingMessage =
            `Great choice! ${currentRound.explanation} Let's wrap this special gift!`;

        setTeacherMessage(
            wrappingMessage
        );

        speak(
            wrappingMessage
        );


        /* =================================================
           FIRST CELEBRATION
        ================================================= */

        confetti({
            particleCount: 80,
            spread: 70,
            origin: {
                y: 0.62,
            },
        });


        /* =================================================
           WRAPPING → WRAPPED
        ================================================= */

        clearTimeout(
            wrappingTimeout.current
        );

        wrappingTimeout.current =
            setTimeout(() => {

                setGameState("wrapped");

                const wrappedMessage =
                    `All wrapped beautifully! ${currentRound.partner} will be very happy with this gift!`;

                setTeacherMessage(
                    wrappedMessage
                );

                speak(
                    wrappedMessage
                );


                confetti({
                    particleCount: 150,
                    spread: 90,
                    origin: {
                        y: 0.55,
                    },
                });

            }, 3000);
    };


    /* =====================================================
       NEXT ROUND
    ===================================================== */

    const handleNextRound = () => {

        window.speechSynthesis.cancel();

        if (
            currentRoundIndex ===
            rounds.length - 1
        ) {

            setGameState("complete");

            const finalMessage =
                "Amazing work! You found all five perfect gifts. You are a wonderful gift detective!";

            setTeacherMessage(
                finalMessage
            );

            speak(
                finalMessage
            );

            confetti({
                particleCount: 250,
                spread: 100,
                origin: {
                    y: 0.55,
                },
            });

            return;
        }


        setCurrentRoundIndex(
            (previous) =>
                previous + 1
        );
    };


    /* =====================================================
       FINISH
    ===================================================== */

    const handleFinish = () => {

        window.speechSynthesis.cancel();

        if (typeof onFinish === "function") {
            onFinish();
        }
    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="mystery-gift-page">


            {/* =================================================
                BLURRED BACKGROUND
            ================================================= */}

            <div
                className="mystery-gift-background"
                style={{
                    backgroundImage:
                        `url(${chatBg})`,
                }}
            />


            {/* =================================================
                MAIN CONTAINER
            ================================================= */}

            <div
                className="mystery-gift-main-container"
                style={{
                    backgroundImage:
                        `url(${mainBg})`,
                }}
            >


                {/* BACK */}

                <button
                    type="button"
                    className="mystery-gift-top-button mystery-gift-back"
                    onClick={handleBack}
                >
                    <span>←</span>
                    Back
                </button>


                {/* SKIP */}

                <button
                    type="button"
                    className="mystery-gift-top-button mystery-gift-skip"
                    onClick={handleSkip}
                >
                    Skip
                    <span>→</span>
                </button>


                {/* HEADER */}

                <div className="mystery-gift-header">

                    <h1>
                        🎁 Mystery Gift Mission
                    </h1>

                    <p>
                        Choose the perfect gift for your partner!
                    </p>

                </div>


                {/* =================================================
                    GAME LAYOUT
                ================================================= */}

                <div className="mystery-gift-game-layout">


                    {/* =================================================
                        TEACHER
                    ================================================= */}

                    <div className="mystery-gift-teacher-area">

                        <div className="mystery-gift-teacher-wrap">

                            <img
                                src={teacherImage}
                                alt="Miss Uroosa"
                                className="mystery-gift-teacher-image"
                            />

                            <div className="mystery-gift-teacher-name">
                                Miss Uroosa
                            </div>

                        </div>


                        <div className="mystery-gift-speech">

                            <button
                                type="button"
                                className="mystery-gift-repeat"
                                onClick={handleRepeat}
                            >
                                {isSpeaking
                                    ? "🔊"
                                    : "🔈"}
                            </button>


                            <div className="mystery-gift-clue-label">

                                {currentRound.emoji}

                                PARTNER CLUE

                            </div>


                            <p>
                                {teacherMessage}
                            </p>


                            {/* WRONG */}

                            {gameState === "wrong" && (

                                <div className="mystery-gift-wrong">

                                    💭 Try again!
                                    Think carefully about
                                    the clue.

                                </div>

                            )}


                            {/* WRAPPING */}

                            {gameState === "wrapping" && (

                                <div className="mystery-gift-correct">

                                    ✨ Perfect choice!
                                    Let's wrap it!

                                </div>

                            )}


                            {/* WRAPPED */}

                            {gameState === "wrapped" && (

                                <div className="mystery-gift-correct">

                                    🎁 Gift wrapped!
                                    Mission complete!

                                </div>

                            )}

                        </div>

                    </div>


                    {/* =================================================
                        GAME CARD
                    ================================================= */}

                    <div className="mystery-gift-game-card">


                        {/* =================================================
                            SELECTION SCREEN
                        ================================================= */}

                        {gameState !== "wrapping" &&
                         gameState !== "wrapped" &&
                         gameState !== "complete" && (

                            <>

                                <div className="mystery-gift-game-top">

                                    <div className="mystery-gift-round">

                                        <span>🎯</span>

                                        <div>

                                            <strong>
                                                Mission{" "}
                                                {currentRoundIndex + 1} / 5
                                            </strong>

                                            <small>
                                                Find the perfect gift
                                            </small>

                                        </div>

                                    </div>


                                    <div className="mystery-gift-score">

                                        <span>⭐</span>

                                        <div>

                                            <strong>
                                                {score} / 5
                                            </strong>

                                            <small>
                                                Your Score
                                            </small>

                                        </div>

                                    </div>

                                </div>


                                {/* QUESTION */}

                                <div className="mystery-gift-question">

                                    <span>
                                        🎁
                                    </span>

                                    <div>

                                        <strong>
                                            Mystery Gift Shop
                                        </strong>

                                        <p>
                                            {currentRound.question}
                                        </p>

                                    </div>

                                </div>


                                {/* OPTIONS */}

                                <div className="mystery-gift-options">

                                    {currentRound.options.map(
                                        (giftId) => {

                                            const gift =
                                                gifts[giftId];

                                            const isSelected =
                                                selectedGift === giftId;

                                            const isWrong =
                                                gameState === "wrong" &&
                                                isSelected;

                                            return (

                                                <button
                                                    key={gift.id}
                                                    type="button"
                                                    className={`
                                                        mystery-gift-card
                                                        ${isSelected
                                                            ? "mystery-gift-selected"
                                                            : ""}
                                                        ${isWrong
                                                            ? "mystery-gift-wrong-card"
                                                            : ""}
                                                    `}
                                                    onClick={() =>
                                                        handleGiftSelect(
                                                            gift.id
                                                        )
                                                    }
                                                >

                                                    <div className="mystery-gift-ribbon">
                                                        🎁
                                                    </div>


                                                    <div className="mystery-gift-image-wrap">

                                                        <img
                                                            src={gift.image}
                                                            alt={gift.name}
                                                        />

                                                    </div>


                                                    <div className="mystery-gift-name">

                                                        {gift.emoji}{" "}
                                                        {gift.name}

                                                    </div>


                                                    {isSelected && (

                                                        <div
                                                            className={
                                                                isWrong
                                                                    ? "mystery-gift-selected-badge mystery-gift-try-badge"
                                                                    : "mystery-gift-selected-badge"
                                                            }
                                                        >

                                                            {isWrong
                                                                ? "Try Again"
                                                                : "Selected"}

                                                        </div>

                                                    )}

                                                </button>

                                            );

                                        }
                                    )}

                                </div>


                                {/* PROGRESS */}

                                <div className="mystery-gift-progress-area">

                                    <div className="mystery-gift-progress-text">

                                        <span>
                                            Mission Progress
                                        </span>

                                        <strong>
                                            {currentRoundIndex + 1} / 5
                                        </strong>

                                    </div>


                                    <div className="mystery-gift-progress-track">

                                        <div
                                            className="mystery-gift-progress-fill"
                                            style={{
                                                width:
                                                    `${((currentRoundIndex + 1) / rounds.length) * 100}%`,
                                            }}
                                        />

                                    </div>

                                </div>

                            </>

                        )}


                        {/* =================================================
                            WRAPPING SCREEN
                        ================================================= */}

                        {gameState === "wrapping" && (

                            <div className="mystery-gift-wrapping-screen">

                                <div className="mystery-gift-wrapping-title">
                                    Wrapping your gift...
                                </div>


                                <div className="mystery-gift-wrapping-subtitle">

                                    🎀 Making it extra special for{" "}
                                    {currentRound.partner}!

                                </div>


                                {/* =================================================
                                    REAL WRAPPING STAGE
                                ================================================= */}

                                <div className="mystery-gift-real-wrap-stage">


                                    {/* SPARKLES */}

                                    <div className="mystery-gift-sparkle sparkle-one">
                                        ✨
                                    </div>

                                    <div className="mystery-gift-sparkle sparkle-two">
                                        ⭐
                                    </div>

                                    <div className="mystery-gift-sparkle sparkle-three">
                                        ✨
                                    </div>


                                    {/* OPEN BOX IMAGE */}

                                    <img
                                        src={giftWrapOpen}
                                        alt="Open gift box"
                                        className="mystery-gift-open-box"
                                    />


                                    {/* SELECTED GIFT GOING INSIDE */}

                                    <div className="mystery-gift-going-inside">

                                        <img
                                            src={
                                                selectedGiftData?.image
                                            }
                                            alt={
                                                selectedGiftData?.name
                                            }
                                        />

                                    </div>


                                    {/* DOWN ARROW */}

                                    <div className="mystery-gift-drop-arrow">
                                        ↓
                                    </div>

                                </div>


                                {/* LOADER */}

                                <div className="mystery-gift-wrapping-loader">

                                    <span></span>
                                    <span></span>
                                    <span></span>

                                </div>


                                <div className="mystery-gift-wrapping-text">

                                    🎁 Placing your gift inside...

                                </div>

                            </div>

                        )}


                        {/* =================================================
                            CLOSED WRAPPED GIFT
                        ================================================= */}

                        {gameState === "wrapped" && (

                            <div className="mystery-gift-wrapped-screen">


                                <div className="mystery-gift-wrapped-title">

                                    🎁 Gift Wrapped!

                                </div>


                                <div className="mystery-gift-real-wrapped-stage">


                                    <div className="mystery-gift-glow"></div>


                                    <div className="mystery-gift-success-sparkle sparkle-one">
                                        ✨
                                    </div>

                                    <div className="mystery-gift-success-sparkle sparkle-two">
                                        ⭐
                                    </div>

                                    <div className="mystery-gift-success-sparkle sparkle-three">
                                        ✨
                                    </div>


                                    {/* REAL CLOSED BOX */}

                                    <img
                                        src={giftWrapClosed}
                                        alt="Wrapped gift"
                                        className="mystery-gift-closed-box"
                                    />

                                </div>


                                <div className="mystery-gift-wrapped-message">

                                    <strong>

                                        {selectedGiftData?.emoji}{" "}
                                        {selectedGiftData?.name}

                                    </strong>

                                    <span>
                                        is ready for your partner!
                                    </span>

                                </div>


                                <button
                                    type="button"
                                    className="mystery-gift-next-button"
                                    onClick={
                                        handleNextRound
                                    }
                                >

                                    {currentRoundIndex === rounds.length - 1
                                        ? "Finish Mission →"
                                        : "Next Mission →"}

                                </button>

                            </div>

                        )}


                        {/* =================================================
                            COMPLETE
                        ================================================= */}

                        {gameState === "complete" && (

                            <div className="mystery-gift-complete-screen">


                                <div className="mystery-gift-complete-icon">
                                    🎁✨
                                </div>


                                <div className="mystery-gift-complete-badge">
                                    ALL MISSIONS COMPLETE!
                                </div>


                                <h2>
                                    Amazing Gift Detective!
                                </h2>


                                <p>
                                    You found all the perfect
                                    gifts for your partners.
                                </p>


                                <div className="mystery-gift-final-score">

                                    ⭐ {score} / 5

                                </div>


                                <button
                                    type="button"
                                    className="mystery-gift-finish-button"
                                    onClick={
                                        handleFinish
                                    }
                                >

                                    Finish Mission 🎉

                                </button>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}


export default MysteryGiftMissionActivity;