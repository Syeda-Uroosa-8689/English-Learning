import React, { useState, useEffect } from "react";

import teacher from "./assets/teacher1.png";

import juice from "./assets/juice.jpg";
import icecream from "./assets/icecream.jpg";
import pasta from "./assets/pasta.jpg";
import fries from "./assets/fries.jpg";

import chatBg from "./assets/chatbg.jpeg";

function MenuMatchingActivity({

    onNext,
    onBack

}) {

    /* ==================================
            FOOD IMAGES
    =================================== */

    const foods = [

        {
            id: 1,
            name: "Juice",
            image: juice
        },

        {
            id: 2,
            name: "Ice Cream",
            image: icecream
        },

        {
            id: 3,
            name: "Pasta",
            image: pasta
        },

        {
            id: 4,
            name: "French Fries",
            image: fries
        }

    ];

    /* ==================================
            DROP BOXES
    =================================== */

    const dropBoxes = [

        "Juice",

        "Ice Cream",

        "Pasta",

        "French Fries"

    ];

    /* ==================================
            STATES
    =================================== */

    const [dragItem, setDragItem] = useState(null);

    const [matchedItems, setMatchedItems] = useState({});

    const [teacherMessage, setTeacherMessage] = useState("");

    const [isSpeaking, setIsSpeaking] = useState(false);

    const [finished, setFinished] = useState(false);

    /* ==================================
            TEACHER VOICE
    =================================== */

    const speak = (text) => {

        window.speechSynthesis.cancel();

        setTeacherMessage(text);

        setIsSpeaking(true);

        const speech = new SpeechSynthesisUtterance(text);

        speech.rate = 0.9;

        speech.pitch = 1;

        speech.volume = 1;

        const voices = window.speechSynthesis.getVoices();

        const femaleVoice =

            voices.find(v => v.name.includes("Google UK English Female")) ||

            voices.find(v => v.name.includes("Samantha")) ||

            voices.find(v => v.name.includes("Zira")) ||

            voices[0];

        speech.voice = femaleVoice;

        speech.onend = () => {

            setIsSpeaking(false);

        };

        window.speechSynthesis.speak(speech);

    };

    /* ==================================
            FIRST INSTRUCTION
    =================================== */

    useEffect(() => {

        speak(

            "Welcome! Drag each food picture and drop it on the correct food name."

        );

        return () => {

            window.speechSynthesis.cancel();

        };

    }, []);

    const instruction =

        teacherMessage ||

        "Drag each food picture to its correct name.";

            /* ==================================
            DRAG START
    =================================== */

    const handleDragStart = (food) => {

        setDragItem(food);

    };

    /* ==================================
            ALLOW DROP
    =================================== */

    const handleDragOver = (e) => {

        e.preventDefault();

    };

    /* ==================================
            DROP
    =================================== */

    const handleDrop = (boxName) => {

        if (!dragItem) return;

        // Already matched
        if (matchedItems[dragItem.id]) return;

        // Correct Match
        if (dragItem.name === boxName) {

            const updated = {

                ...matchedItems,

                [dragItem.id]: boxName

            };

            setMatchedItems(updated);

            speak(

                "Excellent! That's correct."

            );

            // All matched

            if (

                Object.keys(updated).length === foods.length

            ) {

                setTimeout(() => {

                    setFinished(true);

                    speak(

                        "Excellent! You matched all the food pictures correctly. Click Next to continue."

                    );

                }, 800);

            }

        }

        // Wrong Match

        else {

            speak(

                "Oops! That's the wrong answer. Try again."

            );

        }

        setDragItem(null);

    };

    /* ==================================
            CHECK IMAGE MATCHED
    =================================== */

    const isMatched = (foodId) => {

        return matchedItems[foodId];

    };

    /* ==================================
            RETURN
    =================================== */

    return (

        <div

            className="menu-page"

            style={{

                backgroundImage: `url(${chatBg})`

            }}

        >

            <div className="menu-overlay"></div>

            <div className="menu-card">

                {/* HEADER */}

                <div className="menu-header">

                    <button

                        className="menu-back-btn"

                        onClick={onBack}

                    >

                        ← Back

                    </button>

                   

                    <button

                        className="menu-skip-btn"

                        onClick={onNext}

                    >

                        Skip →

                    </button>

                </div>

                                {/* ================= TITLE ================= */}

                <div className="menu-title">

                    <h1>MENU MATCHING</h1>

                    <p>Drag each picture to the correct food name.</p>

                </div>

                {/* ================= BODY ================= */}

                <div className="menu-content">

                    {/* ============ LEFT ============ */}

                    <div className="teacher-panel">

                        <div className="teacher-frame">

                            <img

                                src={teacher}

                                alt="Teacher"

                                className={
                                    isSpeaking
                                        ? "teacher-img speaking"
                                        : "teacher-img"
                                }

                            />

                        </div>

                        <h3>

                             Miss Uroosa

                        </h3>

                        <div className="teacher-message">

                            {instruction}

                        </div>

                    </div>

                    {/* ============ RIGHT ============ */}

                    <div className="matching-panel">

                        {/* FOOD GRID */}

                        <div className="food-grid">

                            {

                                foods.map(food => (

                                    <div

                                        key={food.id}

                                        className={
                                            isMatched(food.id)

                                                ? "food-card matched"

                                                : "food-card"
                                        }

                                        draggable={!isMatched(food.id)}

                                        onDragStart={() =>
                                            handleDragStart(food)
                                        }

                                    >

                                        <img

                                            src={food.image}

                                            alt={food.name}

                                            className="food-image"

                                        />

                                    </div>

                                ))

                            }

                        </div>

                        {/* DROP BOXES */}

                        <div className="drop-list">

                            {

                                dropBoxes.map(box => {

                                    const matchedFood = foods.find(

                                        item =>

                                            matchedItems[item.id] === box

                                    );

                                    return (

                                        <div

                                            key={box}

                                            className="drop-box"

                                            onDragOver={handleDragOver}

                                            onDrop={() =>

                                                handleDrop(box)

                                            }

                                        >

                                            <div className="drop-title">

                                                {box}

                                            </div>

                                            {

                                                matchedFood && (

                                                    <img

                                                        src={matchedFood.image}

                                                        alt={matchedFood.name}

                                                        className="drop-image"

                                                    />

                                                )

                                            }

                                        </div>

                                    );

                                })

                            }

                        </div>

                    </div>

                </div>

                                {/* ================= FINISH CARD ================= */}

                {

                    finished && (

                        <div className="menu-finish-card">

                            <h2>

                                🎉 Excellent!

                            </h2>

                            <p>

                                You matched all the food pictures correctly.

                            </p>

                            <button

                                className="menu-next-btn"

                                onClick={onNext}

                            >

                                Next →

                            </button>

                        </div>

                    )

                }

            </div>

        </div>

    );

}

export default MenuMatchingActivity;