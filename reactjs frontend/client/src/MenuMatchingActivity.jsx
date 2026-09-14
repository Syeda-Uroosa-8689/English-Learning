
import React, { useState, useEffect, useRef } from "react";

import teacher from "./assets/teacher1.png";

import juice from "./assets/juice.jpg";
import icecream from "./assets/icecream.jpg";
import pasta from "./assets/pasta.jpg";
import fries from "./assets/fries.jpg";

import chatBg from "./assets/chatbg.jpeg";

import yaySound from "./assets/yay.mp3";

import confetti from "canvas-confetti";


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

    /*
       IMPORTANT

       This locks the whole matching activity
       while yay sound + confetti + teacher voice
       are completing.
    */

    const [matchLocked, setMatchLocked] = useState(false);


    /*
       Ref to prevent accidental multiple drops
    */

    const processingRef = useRef(false);


    /*
       Audio reference
    */

    const yayAudioRef = useRef(null);


    /* ==================================
            TEACHER VOICE
    =================================== */

    const speak = (text, onFinish = null) => {

        window.speechSynthesis.cancel();

        setTeacherMessage(text);

        setIsSpeaking(true);


        const speech =
            new SpeechSynthesisUtterance(text);


        speech.rate = 0.9;

        speech.pitch = 1;

        speech.volume = 1;


        const voices =
            window.speechSynthesis.getVoices();


        const femaleVoice =

            voices.find(v =>
                v.name.includes("Google UK English Female")
            )

            ||

            voices.find(v =>
                v.name.includes("Samantha")
            )

            ||

            voices.find(v =>
                v.name.includes("Zira")
            )

            ||

            voices[0];


        if (femaleVoice) {

            speech.voice = femaleVoice;

        }


        speech.onend = () => {

            setIsSpeaking(false);

            if (onFinish) {

                onFinish();

            }

        };


        speech.onerror = () => {

            setIsSpeaking(false);

            if (onFinish) {

                onFinish();

            }

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


            if (yayAudioRef.current) {

                yayAudioRef.current.pause();

                yayAudioRef.current.currentTime = 0;

            }

        };

    }, []);


    const instruction =

        teacherMessage ||

        "Drag each food picture to its correct name.";


    /* ==================================
            DRAG START
    =================================== */

    const handleDragStart = (food) => {

        /*
           DO NOT allow dragging while
           celebration sequence is running.
        */

        if (matchLocked || finished || processingRef.current) {

            return;

        }


        /*
           Don't allow already matched food.
        */

        if (matchedItems[food.id]) {

            return;

        }


        setDragItem(food);

    };


    /* ==================================
            ALLOW DROP
    =================================== */

    const handleDragOver = (e) => {

        e.preventDefault();

    };


    /* ==================================
       CELEBRATION SEQUENCE
       
       ORDER:

       1. Lock activity
       2. Confetti
       3. Yay sound
       4. Wait for BOTH to finish
       5. Teacher says Excellent
       6. Unlock next match
    =================================== */

    const playCorrectCelebration = (updatedMatches) => {

        /*
           Keep activity locked
        */

        setMatchLocked(true);

        processingRef.current = true;


        /*
           ================================
           CONFETTI
        =================================
        */

        let confettiFinished = false;

        let soundFinished = false;

        let teacherStarted = false;


        /*
           This function runs only when
           BOTH confetti and sound finish.
        */

        const tryFinishCelebration = () => {

            if (
                confettiFinished &&
                soundFinished &&
                !teacherStarted
            ) {

                teacherStarted = true;


                /*
                   ================================
                   TEACHER EXCELLENT VOICE
                =================================
                */

                speak(

                    "Excellent! That's correct.",

                    () => {

                        /*
                           Check whether all foods
                           are matched.
                        */

                        const allMatched =
                            Object.keys(updatedMatches).length === foods.length;


                        if (allMatched) {

                            /*
                               Small delay after Excellent
                               before completion card.
                            */

                            setTimeout(() => {

                                setFinished(true);

                                setMatchLocked(false);

                                processingRef.current = false;

                            }, 300);

                        }

                        else {

                            /*
                               Unlock next match ONLY
                               after Excellent voice ends.
                            */

                            setMatchLocked(false);

                            processingRef.current = false;

                        }

                    }

                );

            }

        };


        /*
           Start confetti
        */

        confetti({

            particleCount: 130,

            spread: 90,

            startVelocity: 35,

            origin: {
                y: 0.6
            }

        });


        /*
           Confetti animation duration.

           We wait until the confetti animation
           has completely finished before allowing
           teacher voice.
        */

        setTimeout(() => {

            confettiFinished = true;

            tryFinishCelebration();

        }, 2500);


        /*
           ================================
           YAY SOUND
        =================================
        */

        const audio = new Audio(yaySound);

        yayAudioRef.current = audio;

        audio.volume = 1;


        /*
           Sound finished
        */

        audio.onended = () => {

            soundFinished = true;

            yayAudioRef.current = null;

            tryFinishCelebration();

        };


        /*
           If audio fails for any reason,
           don't permanently lock activity.
        */

        audio.onerror = () => {

            console.log("Yay sound could not be played.");

            soundFinished = true;

            yayAudioRef.current = null;

            tryFinishCelebration();

        };


        /*
           Start yay sound
        */

        audio.play().catch(error => {

            console.log(
                "Yay audio play error:",
                error
            );

            soundFinished = true;

            yayAudioRef.current = null;

            tryFinishCelebration();

        });

    };


    /* ==================================
            DROP
    =================================== */

    const handleDrop = (boxName) => {

        /*
           IMPORTANT

           If celebration sequence is running,
           completely ignore every drop.
        */

        if (
            matchLocked ||
            finished ||
            processingRef.current
        ) {

            setDragItem(null);

            return;

        }


        if (!dragItem) {

            return;

        }


        /*
           Already matched
        */

        if (matchedItems[dragItem.id]) {

            setDragItem(null);

            return;

        }


        /*
           ================================
           CORRECT MATCH
        =================================
        */

        if (dragItem.name === boxName) {

            const updated = {

                ...matchedItems,

                [dragItem.id]: boxName

            };


            /*
               Update matched item immediately.

               But DO NOT unlock anything yet.
            */

            setMatchedItems(updated);


            /*
               Clear drag item
            */

            setDragItem(null);


            /*
               Start:

               CONFETTI
                    +
               YAY SOUND
                    ↓
               wait for both
                    ↓
               EXCELLENT VOICE
                    ↓
               unlock next
            */

            playCorrectCelebration(updated);


            return;

        }


        /*
           ================================
           WRONG MATCH
        =================================
        */

        setDragItem(null);


        speak(

            "Oops! That's the wrong answer. Try again."

        );

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


                {/* =================================
                        HEADER
                ================================= */}

                <div className="menu-header">


                    <button

                        className="menu-back-btn"

                        onClick={() => {

                            /*
                               Stop everything before going back
                            */

                            window.speechSynthesis.cancel();


                            if (yayAudioRef.current) {

                                yayAudioRef.current.pause();

                                yayAudioRef.current.currentTime = 0;

                                yayAudioRef.current = null;

                            }


                            setMatchLocked(false);

                            processingRef.current = false;


                            onBack();

                        }}

                        disabled={matchLocked}

                    >

                        ← Back

                    </button>


                    <button

                        className="menu-skip-btn"

                        onClick={() => {

                            /*
                               Skip is also disabled while
                               correct-answer celebration
                               is running.
                            */

                            if (
                                matchLocked ||
                                processingRef.current
                            ) {

                                return;

                            }


                            window.speechSynthesis.cancel();


                            if (yayAudioRef.current) {

                                yayAudioRef.current.pause();

                                yayAudioRef.current.currentTime = 0;

                            }


                            onNext();

                        }}

                        disabled={
                            matchLocked ||
                            processingRef.current
                        }

                    >

                        Skip →

                    </button>

                </div>


                {/* =================================
                        TITLE
                ================================= */}

                <div className="menu-title">

                    <h1>

                        MENU MATCHING

                    </h1>


                    <p>

                        Drag each picture to the correct food name.

                    </p>

                </div>


                {/* =================================
                        BODY
                ================================= */}

                <div className="menu-content">


                    {/* =================================
                            LEFT
                    ================================= */}

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


                        {/* =================================
                              LOCK MESSAGE
                        ================================= */}

                        {matchLocked && !finished && (

                            <div className="matching-lock-message">

                                🎉 Great! Wait for the celebration...

                            </div>

                        )}

                    </div>


                    {/* =================================
                            RIGHT
                    ================================= */}

                    <div className="matching-panel">


                        {/* =================================
                                FOOD GRID
                        ================================= */}

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

                                        draggable={

                                            !isMatched(food.id) &&

                                            !matchLocked &&

                                            !finished &&

                                            !processingRef.current

                                        }

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


                        {/* =================================
                                DROP BOXES
                        ================================= */}

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

                                            className={

                                                matchLocked

                                                    ? "drop-box locked"

                                                    : "drop-box"

                                            }

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


                {/* =================================
                        FINISH CARD
                ================================= */}

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

