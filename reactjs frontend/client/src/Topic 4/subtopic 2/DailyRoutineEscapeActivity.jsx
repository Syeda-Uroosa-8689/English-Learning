import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import "./DailyRoutineEscapeActivity.css";

/* =====================================================
   IMAGES
===================================================== */

import introImage from "../../assets/dailyEscapeIntro.png";
import mapImage from "../../assets/dailyEscapeMap.png";

import morningImage from "../../assets/morningRoom.png";
import afternoonImage from "../../assets/afternoonRoom.png";
import eveningImage from "../../assets/eveningRoom.png";
import nightImage from "../../assets/nightRoom.png";

import finalDoorImage from "../../assets/finalDoor.png";

import teacherImage from "../../assets/teacher1.png";

import morningKey from "../../assets/morningKey.png";
import afternoonKey from "../../assets/afternoonKey.png";
import eveningKey from "../../assets/eveningKey.png";
import nightKey from "../../assets/nightKey.png";

import wakeUp from "../../assets/wakeUp.png";
import haveBreakfast from "../../assets/haveBreakfast.png";
import goToSchool from "../../assets/goToSchool2.png";
import haveLunch from "../../assets/haveLunch.png";
import study from "../../assets/study.png";
import doHomework from "../../assets/doHomework.png";
import haveDinner from "../../assets/haveDinner.png";
import brushTeeth from "../../assets/brushTeeth2.png";
import goToBed from "../../assets/goToBed.png";


/* =====================================================
   TASK DATA
===================================================== */

const tasks = [
    {
        id: 1,
        type: "morning",
        title: "Morning Room",
        subtitle: "Start your day!",
        image: morningImage,
        key: morningKey,

        question: "What should you do first in the morning?",

        /* MIXED OPTIONS */
        options: [
            "Do homework",
            "Wake up",
            "Have dinner",
            "Go to bed",
        ],

        answer: "Wake up",

        successText:
            "Excellent! You woke up and started your morning routine!",

        wrongText:
            "Not quite! Think about what you do when your day begins.",
    },

    {
        id: 2,
        type: "afternoon",
        title: "Afternoon Room",
        subtitle: "Keep your day going!",
        image: afternoonImage,
        key: afternoonKey,

        question: "What is a good thing to do around lunchtime?",

        /* MIXED OPTIONS */
        options: [
            "Brush your teeth",
            "Wake up",
            "Have lunch",
            "Go to bed",
        ],

        answer: "Have lunch",

        successText:
            "Great job! Lunch helps you keep your day moving!",

        wrongText:
            "Try again! Think about what people usually do around lunchtime.",
    },

    {
        id: 3,
        type: "evening",
        title: "Evening Room",
        subtitle: "Finish your school day!",
        image: eveningImage,
        key: eveningKey,

        question: "What can you do after school to learn and practise?",

        /* MIXED OPTIONS */
        options: [
            "Have breakfast",
            "Go to bed",
            "Do homework",
            "Wake up",
        ],

        answer: "Do homework",

        successText:
            "Wonderful! You completed your homework!",

        wrongText:
            "Almost! Think about an activity you do after school.",
    },

    {
        id: 4,
        type: "night",
        title: "Night Room",
        subtitle: "Get ready for tomorrow!",
        image: nightImage,
        key: nightKey,

        question: "What should you do before going to bed?",

        /* MIXED OPTIONS */
        options: [
            "Go to school",
            "Wake up",
            "Have breakfast",
            "Brush your teeth",
        ],

        answer: "Brush your teeth",

        successText:
            "Fantastic! You finished your night routine!",

        wrongText:
            "Try again! Think about something you do before bedtime.",
    },
];


/* =====================================================
   ROUTINE CARDS
===================================================== */

const routineCards = [
    {
        id: "wake",
        name: "Wake Up",
        image: wakeUp,
    },

    {
        id: "breakfast",
        name: "Breakfast",
        image: haveBreakfast,
    },

    {
        id: "school",
        name: "Go to School",
        image: goToSchool,
    },

    {
        id: "lunch",
        name: "Have Lunch",
        image: haveLunch,
    },

    {
        id: "study",
        name: "Study",
        image: study,
    },

    {
        id: "homework",
        name: "Do Homework",
        image: doHomework,
    },

    {
        id: "dinner",
        name: "Have Dinner",
        image: haveDinner,
    },

    {
        id: "brush",
        name: "Brush Teeth",
        image: brushTeeth,
    },

    {
        id: "bed",
        name: "Go to Bed",
        image: goToBed,
    },
];


/* =====================================================
   CORRECT DAILY ROUTINE
===================================================== */

const correctRoutine = [
    "wake",
    "breakfast",
    "school",
    "lunch",
    "study",
    "homework",
    "dinner",
    "brush",
    "bed",
];


/* =====================================================
   SHUFFLE FUNCTION
===================================================== */

const shuffleCards = (cards) => {
    const shuffled = [...cards];

    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {
        const randomIndex =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            shuffled[i],
            shuffled[randomIndex],
        ] = [
            shuffled[randomIndex],
            shuffled[i],
        ];
    }

    /*
       Prevent the cards from accidentally
       appearing in the exact original order.
    */

    const sameOrder =
        shuffled.every(
            (card, index) =>
                card.id === cards[index].id
        );

    if (sameOrder) {
        [
            shuffled[0],
            shuffled[1],
        ] = [
            shuffled[1],
            shuffled[0],
        ];
    }

    return shuffled;
};


/* =====================================================
   COMPONENT
===================================================== */

function DailyRoutineEscapeActivity({
    onBack,
    onSkip,
    onFinish,
}) {

    /* =================================================
       BASIC STATE
    ================================================= */

    const [screen, setScreen] =
        useState("intro");

    const [currentTaskIndex, setCurrentTaskIndex] =
        useState(0);

    const [selectedAnswer, setSelectedAnswer] =
        useState(null);

    const [foundKeys, setFoundKeys] =
        useState([]);

    const [teacherMessage, setTeacherMessage] =
        useState(
            "Welcome to Daily Routine Escape!"
        );

    const [feedbackType, setFeedbackType] =
        useState(null);

    const [isSpeaking, setIsSpeaking] =
        useState(false);


    /* =================================================
       FINAL CHALLENGE STATE
    ================================================= */

    const [routineOrder, setRoutineOrder] =
        useState([]);

    const [shuffledRoutineCards, setShuffledRoutineCards] =
        useState([]);

    const [draggedCardId, setDraggedCardId] =
        useState(null);

    const [dragOverRoutine, setDragOverRoutine] =
        useState(false);

    const [finalDoorOpen, setFinalDoorOpen] =
        useState(false);

    const [isCelebration, setIsCelebration] =
        useState(false);

    const [routineFeedback, setRoutineFeedback] =
        useState(null);

    const [isCheckingRoutine, setIsCheckingRoutine] =
        useState(false);


    /* =================================================
       REFS
    ================================================= */

    const speechRef =
        useRef(null);

    const timersRef =
        useRef([]);


    /* =================================================
       CURRENT TASK
    ================================================= */

    const currentTask =
        tasks[currentTaskIndex];


    /* =================================================
       CLEANUP
    ================================================= */

    useEffect(() => {

        return () => {

            timersRef.current.forEach(
                (timer) => {
                    clearTimeout(timer);
                }
            );

            if (
                window.speechSynthesis
            ) {
                window.speechSynthesis.cancel();
            }
        };

    }, []);


    /* =================================================
       TIMER HELPER
    ================================================= */

    const addTimer = (
        callback,
        delay
    ) => {

        const timer =
            setTimeout(
                callback,
                delay
            );

        timersRef.current.push(
            timer
        );

        return timer;
    };


    /* =================================================
       SPEECH
    ================================================= */

    const speak = (text) => {

        if (
            !window.speechSynthesis ||
            !text
        ) {
            return;
        }

        window.speechSynthesis.cancel();

        const utterance =
            new SpeechSynthesisUtterance(
                text
            );

        const voices =
            window.speechSynthesis.getVoices();

        const preferredVoice =
            voices.find(
                (voice) =>
                    /zira|female|samantha|jenny|aria/i.test(
                        voice.name
                    )
            ) ||
            voices.find(
                (voice) =>
                    /english/i.test(
                        voice.lang
                    )
            ) ||
            voices[0];

        if (
            preferredVoice
        ) {
            utterance.voice =
                preferredVoice;
        }

        utterance.rate =
            0.88;

        utterance.pitch =
            1.08;

        utterance.volume =
            1;

        utterance.onstart = () => {
            setIsSpeaking(
                true
            );
        };

        utterance.onend = () => {
            setIsSpeaking(
                false
            );
        };

        utterance.onerror = () => {
            setIsSpeaking(
                false
            );
        };

        speechRef.current =
            utterance;

        window.speechSynthesis.speak(
            utterance
        );
    };


    /* =================================================
       START
    ================================================= */

    const handleStart = () => {

        setScreen(
            "map"
        );

        setTeacherMessage(
            "Choose a room and complete each routine task to collect all four keys!"
        );

        addTimer(
            () => {

                speak(
                    "Choose a room and complete each routine task to collect all four keys!"
                );

            },
            200
        );
    };


    /* =================================================
       OPEN TASK
    ================================================= */

    const handleOpenTask = (
        index
    ) => {

        /*
           Only the next unlocked room
           can be opened.
        */

        if (
            index >
            foundKeys.length
        ) {
            return;
        }

        if (
            index >=
            tasks.length
        ) {
            return;
        }

        setCurrentTaskIndex(
            index
        );

        setSelectedAnswer(
            null
        );

        setFeedbackType(
            null
        );

        const message =
            tasks[index].type ===
            "morning"
                ? "Let's start your morning!"
                : tasks[index].type ===
                  "afternoon"
                ? "Keep going with your day!"
                : tasks[index].type ===
                  "evening"
                ? "Time for your after-school routine!"
                : "Finish your day with a good night routine!";

        setTeacherMessage(
            message
        );

        setScreen(
            "task"
        );

        addTimer(
            () => {
                speak(
                    message
                );
            },
            250
        );
    };


    /* =================================================
       ANSWER SELECT
       INSTANT CHECK
    ================================================= */

    const handleAnswerSelect = (
        option
    ) => {

        /*
           Stop user from selecting another
           option after correct answer.
        */

        if (
            feedbackType ===
            "success"
        ) {
            return;
        }

        const task =
            tasks[currentTaskIndex];

        setSelectedAnswer(
            option
        );


        /* =============================================
           CORRECT
        ============================================= */

        if (
            option ===
            task.answer
        ) {

            setFeedbackType(
                "success"
            );

            setTeacherMessage(
                task.successText
            );

            setFoundKeys(
                (previousKeys) => {

                    if (
                        previousKeys.includes(
                            task.key
                        )
                    ) {
                        return previousKeys;
                    }

                    return [
                        ...previousKeys,
                        task.key,
                    ];
                }
            );

            speak(
                task.successText
            );

            confetti({
                particleCount: 110,
                spread: 75,
                origin: {
                    y: 0.6,
                },
            });


            /*
               Automatically go back to map.
               No Next button.
            */

            addTimer(
                () => {

                    setFeedbackType(
                        null
                    );

                    setSelectedAnswer(
                        null
                    );

                    setScreen(
                        "map"
                    );

                },
                1200
            );

            return;
        }


        /* =============================================
           WRONG
        ============================================= */

        setFeedbackType(
            "wrong"
        );

        setTeacherMessage(
            task.wrongText
        );

        speak(
            task.wrongText
        );

        addTimer(
            () => {

                setFeedbackType(
                    null
                );

            },
            1400
        );
    };


    /* =================================================
       OPEN FINAL CHALLENGE
    ================================================= */

    const handleOpenFinal = () => {

        if (
            foundKeys.length <
            4
        ) {
            return;
        }


        /*
           SHUFFLE ALL 9 CARDS
           every time final opens.
        */

        const mixedCards =
            shuffleCards(
                routineCards
            );

        setShuffledRoutineCards(
            mixedCards
        );

        setRoutineOrder(
            []
        );

        setDraggedCardId(
            null
        );

        setDragOverRoutine(
            false
        );

        setRoutineFeedback(
            null
        );

        setIsCheckingRoutine(
            false
        );

        setFinalDoorOpen(
            false
        );

        setIsCelebration(
            false
        );

        setTeacherMessage(
            "You found all four keys! Now drag each activity into the correct order."
        );

        setScreen(
            "final"
        );

        addTimer(
            () => {

                speak(
                    "You found all four keys! Now drag each activity into the correct order."
                );

            },
            250
        );
    };


    /* =================================================
       ADD ROUTINE CARD
    ================================================= */

    const addRoutineCard = (
        cardId
    ) => {

        if (
            !cardId
        ) {
            return;
        }

        /*
           Do not add same card twice.
        */

        if (
            routineOrder.includes(
                cardId
            )
        ) {
            return;
        }

        /*
           Maximum 9 cards.
        */

        if (
            routineOrder.length >=
            correctRoutine.length
        ) {
            return;
        }

        setRoutineOrder(
            (previousOrder) => [
                ...previousOrder,
                cardId,
            ]
        );

        setRoutineFeedback(
            null
        );

        setDraggedCardId(
            null
        );

        setDragOverRoutine(
            false
        );
    };


    /* =================================================
       DRAG START
    ================================================= */

    const handleDragStart = (
        event,
        card
    ) => {

        if (
            routineOrder.includes(
                card.id
            )
        ) {
            event.preventDefault();
            return;
        }

        setDraggedCardId(
            card.id
        );

        if (
            event.dataTransfer
        ) {

            event.dataTransfer.effectAllowed =
                "move";

            event.dataTransfer.setData(
                "text/plain",
                card.id
            );
        }
    };


    /* =================================================
       DRAG END
    ================================================= */

    const handleDragEnd = () => {

        setDraggedCardId(
            null
        );

        setDragOverRoutine(
            false
        );
    };


    /* =================================================
       DRAG OVER DROP ZONE
    ================================================= */

    const handleRoutineDragOver = (
        event
    ) => {

        event.preventDefault();

        if (
            routineOrder.length >=
            correctRoutine.length
        ) {
            return;
        }

        if (
            event.dataTransfer
        ) {
            event.dataTransfer.dropEffect =
                "move";
        }

        setDragOverRoutine(
            true
        );
    };


    /* =================================================
       DRAG LEAVE DROP ZONE
    ================================================= */

    const handleRoutineDragLeave = (
        event
    ) => {

        if (
            event.currentTarget.contains(
                event.relatedTarget
            )
        ) {
            return;
        }

        setDragOverRoutine(
            false
        );
    };


    /* =================================================
       DROP CARD
    ================================================= */

    const handleRoutineDrop = (
        event
    ) => {

        event.preventDefault();

        let cardId =
            draggedCardId;

        if (
            event.dataTransfer
        ) {

            const transferId =
                event.dataTransfer.getData(
                    "text/plain"
                );

            if (
                transferId
            ) {
                cardId =
                    transferId;
            }
        }

        addRoutineCard(
            cardId
        );

        setDraggedCardId(
            null
        );

        setDragOverRoutine(
            false
        );
    };


    /* =================================================
       CARD CLICK FALLBACK
    ================================================= */

    const handleRoutineCardClick = (
        card
    ) => {

        if (
            routineOrder.includes(
                card.id
            )
        ) {
            return;
        }

        /*
           Clicking also adds the card.
           This keeps the activity usable if
           drag is unavailable.
        */

        addRoutineCard(
            card.id
        );
    };


    /* =================================================
       REMOVE ROUTINE CARD
    ================================================= */

    const handleRemoveRoutineCard = (
        index
    ) => {

        setRoutineOrder(
            (previousOrder) =>
                previousOrder.filter(
                    (_, cardIndex) =>
                        cardIndex !==
                        index
                )
        );

        setRoutineFeedback(
            null
        );
    };


    /* =================================================
       CHECK FINAL ROUTINE
    ================================================= */

    const handleCheckRoutine = () => {

        if (
            routineOrder.length !==
                correctRoutine.length ||
            isCheckingRoutine
        ) {
            return;
        }

        setIsCheckingRoutine(
            true
        );


        const isCorrect =
            routineOrder.every(
                (
                    item,
                    index
                ) =>
                    item ===
                    correctRoutine[index]
            );


        /* =============================================
           CORRECT ROUTINE
        ============================================= */

        if (
            isCorrect
        ) {

            setRoutineFeedback(
                "success"
            );

            setTeacherMessage(
                "Amazing! You put the whole day in the correct order!"
            );

            speak(
                "Amazing! You put the whole day in the correct order!"
            );

            confetti({
                particleCount: 160,
                spread: 100,
                origin: {
                    y: 0.55,
                },
            });


            addTimer(
                () => {

                    setFinalDoorOpen(
                        true
                    );

                    setScreen(
                        "door"
                    );

                    setIsCheckingRoutine(
                        false
                    );

                },
                1200
            );

            return;
        }


        /* =============================================
           WRONG ROUTINE
        ============================================= */

        setRoutineFeedback(
            "wrong"
        );

        setTeacherMessage(
            "Almost! Check the order of your daily routine and try again."
        );

        speak(
            "Almost! Check the order of your daily routine and try again."
        );

        setIsCheckingRoutine(
            false
        );
    };


    /* =================================================
       UNLOCK FINAL DOOR
    ================================================= */

    const handleUnlockDoor = () => {

        if (
            foundKeys.length <
            4
        ) {
            return;
        }

        setFinalDoorOpen(
            true
        );

        setIsCelebration(
            true
        );

        setScreen(
            "celebration"
        );

        setTeacherMessage(
            "You escaped the day! Fantastic work!"
        );

        speak(
            "You escaped the day! Fantastic work!"
        );

        confetti({
            particleCount: 220,
            spread: 120,
            startVelocity: 35,
            origin: {
                y: 0.5,
            },
        });


        /*
           Automatically finish.
        */

        addTimer(
            () => {

                if (
                    onFinish
                ) {
                    onFinish();
                }

            },
            2800
        );
    };


    /* =================================================
       SKIP
    ================================================= */

    const handleSkip = () => {

        if (
            window.speechSynthesis
        ) {
            window.speechSynthesis.cancel();
        }

        if (
            onSkip
        ) {
            onSkip();
        }
    };


    /* =================================================
       BACK
    ================================================= */

    const handleBack = () => {

        if (
            window.speechSynthesis
        ) {
            window.speechSynthesis.cancel();
        }


        if (
            screen ===
            "intro"
        ) {

            if (
                onBack
            ) {
                onBack();
            }

            return;
        }


        if (
            screen ===
            "map"
        ) {

            setScreen(
                "intro"
            );

            return;
        }


        if (
            screen ===
            "task"
        ) {

            setScreen(
                "map"
            );

            setFeedbackType(
                null
            );

            setSelectedAnswer(
                null
            );

            return;
        }


        if (
            screen ===
            "final"
        ) {

            setScreen(
                "map"
            );

            setDraggedCardId(
                null
            );

            setDragOverRoutine(
                false
            );

            return;
        }


        if (
            screen ===
            "door"
        ) {

            setScreen(
                "final"
            );

            return;
        }


        if (
            screen ===
            "celebration"
        ) {
            return;
        }
    };


    /* =================================================
       HEADER
    ================================================= */

    const renderHeader = () => {

        return (
            <>

                <div className="dre-header">

                    <h1>

                        <span className="dre-header-icon">
                            🔐
                        </span>

                        Daily Routine Escape

                    </h1>

                    <p>
                        Complete your day, collect the keys and escape!
                    </p>

                </div>


                <button
                    className="dre-top-button dre-back-button"
                    onClick={
                        handleBack
                    }
                >
                    ← Back
                </button>


                <button
                    className="dre-top-button dre-skip-button"
                    onClick={
                        handleSkip
                    }
                >
                    Skip →
                </button>

            </>
        );
    };


    /* =================================================
       INTRO
    ================================================= */

    const renderIntro = () => {

        return (
            <div className="dre-intro-layout">


                {/* LEFT */}

                <div className="dre-intro-teacher-side">

                    <div className="dre-intro-teacher-row">

                        <div className="dre-teacher-box">

                            <img
                                src={
                                    teacherImage
                                }
                                alt="Miss Uroosa"
                                className="dre-teacher-image"
                            />

                            <div className="dre-teacher-name">
                                Miss Uroosa
                            </div>

                        </div>


                        <div className="dre-speech-bubble dre-intro-bubble">

                            <button
                                className="dre-repeat-button"
                                onClick={() =>
                                    speak(
                                        "Welcome to Daily Routine Escape! Complete your daily routine tasks, collect all four keys and unlock the final door! Let's escape the day!"
                                    )
                                }
                            >
                                🔊
                            </button>


                            <p>
                                Welcome to Daily Routine Escape!
                            </p>


                            <p>
                                Complete your daily routine tasks,
                                collect all four keys and unlock
                                the final door!
                            </p>


                            <p>
                                Let's escape the day!
                            </p>

                        </div>

                    </div>


                    {/* STATS */}

                    <div className="dre-intro-stats">

                        <div className="dre-stat">

                            <div className="dre-stat-icon dre-key-stat">
                                🔑
                            </div>

                            <strong>
                                {foundKeys.length}/4
                            </strong>

                            <span>
                                Keys
                            </span>

                        </div>


                        <div className="dre-stat-divider"></div>


                        <div className="dre-stat">

                            <div className="dre-stat-icon dre-lock-stat">
                                🔐
                            </div>

                            <strong>
                                {foundKeys.length ===
                                4
                                    ? "Ready"
                                    : "Locked"}
                            </strong>

                            <span>
                                Final Door
                            </span>

                        </div>

                    </div>

                </div>


                {/* RIGHT */}

                <div className="dre-intro-room-side">

                    <div className="dre-intro-room-image-wrap">

                        <img
                            src={
                                introImage
                            }
                            alt="Daily Routine Escape"
                            className="dre-intro-room-image"
                        />

                    </div>


                    <button
                        className="dre-start-button"
                        onClick={
                            handleStart
                        }
                    >
                        🔑 Start Escape
                    </button>

                </div>

            </div>
        );
    };


    /* =================================================
       MAP
    ================================================= */

    const renderMap = () => {

        return (
            <div className="dre-map-layout">

                <div className="dre-map-card">

                    <img
                        src={
                            mapImage
                        }
                        alt="Daily Routine Escape Map"
                        className="dre-map-image"
                    />


                    <div className="dre-map-title">
                        🗺️ Daily Routine Map
                    </div>


                    <div className="dre-map-instruction">
                        Complete each room to collect all four keys!
                    </div>


                    {/* KEYS */}

                    <div className="dre-map-keys">

                        {tasks.map(
                            (
                                task,
                                index
                            ) => {

                                const isFound =
                                    foundKeys.includes(
                                        task.key
                                    );

                                return (
                                    <div
                                        key={
                                            task.id
                                        }
                                        className={`dre-map-key ${
                                            isFound
                                                ? "dre-map-key-found"
                                                : ""
                                        }`}
                                    >

                                        <img
                                            src={
                                                task.key
                                            }
                                            alt={`${task.type} key`}
                                        />


                                        <span>
                                            {isFound
                                                ? "Found"
                                                : `Key ${index + 1}`}
                                        </span>

                                    </div>
                                );
                            }
                        )}

                    </div>


                    {/* ROOMS */}

                    <div className="dre-map-rooms">

                        {tasks.map(
                            (
                                task,
                                index
                            ) => {

                                const isCompleted =
                                    foundKeys.includes(
                                        task.key
                                    );

                                const isLocked =
                                    index >
                                    foundKeys.length;

                                return (
                                    <button
                                        key={
                                            task.id
                                        }
                                        className={`dre-map-room-button ${
                                            isCompleted
                                                ? "dre-map-room-completed"
                                                : ""
                                        } ${
                                            isLocked
                                                ? "dre-map-room-locked"
                                                : ""
                                        }`}
                                        disabled={
                                            isLocked
                                        }
                                        onClick={() =>
                                            handleOpenTask(
                                                index
                                            )
                                        }
                                    >

                                        <span className="dre-map-room-icon">

                                            {index ===
                                            0
                                                ? "🌅"
                                                : index ===
                                                  1
                                                ? "☀️"
                                                : index ===
                                                  2
                                                ? "🌇"
                                                : "🌙"}

                                        </span>


                                        <span className="dre-map-room-name">
                                            {
                                                task.title
                                            }
                                        </span>


                                        <span className="dre-map-room-status">

                                            {isCompleted
                                                ? "✓ Completed"
                                                : isLocked
                                                ? "🔒 Locked"
                                                : "▶ Start"}

                                        </span>

                                    </button>
                                );
                            }
                        )}


                        {/* FINAL */}

                        <button
                            className={`dre-map-final-button ${
                                foundKeys.length ===
                                4
                                    ? "dre-map-final-ready"
                                    : ""
                            }`}
                            disabled={
                                foundKeys.length <
                                4
                            }
                            onClick={
                                handleOpenFinal
                            }
                        >

                            <span className="dre-map-room-icon">
                                🚪
                            </span>


                            <span className="dre-map-room-name">
                                Final Challenge
                            </span>


                            <span className="dre-map-room-status">

                                {foundKeys.length ===
                                4
                                    ? "🔓 Ready!"
                                    : "🔒 Collect 4 Keys"}

                            </span>

                        </button>

                    </div>

                </div>

            </div>
        );
    };


    /* =================================================
       TASK
    ================================================= */

    const renderTask = () => {

        if (
            !currentTask
        ) {
            return null;
        }

        const isCorrect =
            feedbackType ===
            "success";

        const isWrong =
            feedbackType ===
            "wrong";

        return (
            <div className="dre-task-layout">

                <div className="dre-task-room-card">


                    {/* ROOM IMAGE */}

                    <img
                        src={
                            currentTask.image
                        }
                        alt={
                            currentTask.title
                        }
                        className="dre-task-room-image"
                    />


                    {/* KEY COUNTER */}

                    <div className="dre-task-key-counter">

                        <div className="dre-key-counter-icon">
                            🔑
                        </div>

                        <strong>
                            {foundKeys.length}/4
                        </strong>

                        <span>
                            Keys Found
                        </span>

                    </div>


                    {/* TEACHER */}

                    <div className="dre-task-teacher-area">

                        <img
                            src={
                                teacherImage
                            }
                            alt="Miss Uroosa"
                            className="dre-task-teacher-image"
                        />


                        <div className="dre-speech-bubble dre-task-bubble">

                            <button
                                className="dre-repeat-button"
                                onClick={() =>
                                    speak(
                                        teacherMessage
                                    )
                                }
                            >
                                🔊
                            </button>


                            <div className="dre-task-label">
                                MISS UROOSA
                            </div>


                            <p className="dre-task-message">
                                {
                                    teacherMessage
                                }
                            </p>

                        </div>

                    </div>


                    {/* QUESTION */}

                    <div className="dre-task-question-panel">

                        <div className="dre-task-question">
                            {
                                currentTask.question
                            }
                        </div>


                        {/* OPTIONS */}

                        <div className="dre-task-options">

                            {currentTask.options.map(
                                (
                                    option
                                ) => {

                                    const isSelected =
                                        selectedAnswer ===
                                        option;

                                    const optionIsCorrect =
                                        isCorrect &&
                                        isSelected;

                                    const optionIsWrong =
                                        isWrong &&
                                        isSelected;

                                    return (
                                        <button
                                            key={
                                                option
                                            }
                                            className={`dre-task-option ${
                                                isSelected
                                                    ? "dre-task-option-selected"
                                                    : ""
                                            } ${
                                                optionIsCorrect
                                                    ? "dre-option-correct"
                                                    : ""
                                            } ${
                                                optionIsWrong
                                                    ? "dre-option-wrong"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleAnswerSelect(
                                                    option
                                                )
                                            }
                                            disabled={
                                                isCorrect
                                            }
                                        >

                                            {
                                                option
                                            }


                                            {optionIsCorrect && (
                                                <span className="dre-option-result">
                                                    ✓ Correct!
                                                </span>
                                            )}


                                            {optionIsWrong && (
                                                <span className="dre-option-result">
                                                    ✗ Try Again!
                                                </span>
                                            )}

                                        </button>
                                    );
                                }
                            )}

                        </div>


                        {/* FEEDBACK */}

                        {isCorrect && (
                            <div className="dre-success-feedback">
                                ✓ Correct! Key collected! 🔑
                            </div>
                        )}


                        {isWrong && (
                            <div className="dre-wrong-feedback">
                                ✗ Not quite! Try again.
                            </div>
                        )}

                    </div>

                </div>

            </div>
        );
    };


    /* =================================================
       FINAL ROUTINE
    ================================================= */

    const renderFinalRoutine = () => {

        return (
            <div className="dre-final-layout">

                <div className="dre-final-card">


                    {/* DOOR IMAGE */}

                    <img
                        src={
                            finalDoorImage
                        }
                        alt="Final Door"
                        className="dre-final-door-image"
                    />


                    {/* TEACHER */}

                    <div className="dre-final-teacher-area">

                        <img
                            src={
                                teacherImage
                            }
                            alt="Miss Uroosa"
                            className="dre-final-teacher-image"
                        />


                        <div className="dre-speech-bubble dre-final-bubble">

                            <button
                                className="dre-repeat-button"
                                onClick={() =>
                                    speak(
                                        teacherMessage
                                    )
                                }
                            >
                                🔊
                            </button>


                            <p>
                                {
                                    teacherMessage
                                }
                            </p>

                        </div>

                    </div>


                    {/* FINAL CONTENT */}

                    <div className="dre-final-content">


                        <div className="dre-final-heading">
                            🧩 Final Routine Challenge
                        </div>


                        <div className="dre-final-subheading">
                            Drag each activity into the correct order!
                        </div>


                        {/* =================================
                            DROP ZONE
                        ================================= */}

                        <div
                            className={`dre-selected-routine ${
                                dragOverRoutine
                                    ? "dre-routine-drag-over"
                                    : ""
                            } ${
                                routineOrder.length ===
                                correctRoutine.length
                                    ? "dre-routine-complete"
                                    : ""
                            }`}

                            onDragOver={
                                handleRoutineDragOver
                            }

                            onDragLeave={
                                handleRoutineDragLeave
                            }

                            onDrop={
                                handleRoutineDrop
                            }
                        >


                            {routineOrder.length ===
                            0 ? (

                                <div className="dre-empty-routine">

                                    <div className="dre-empty-routine-icon">
                                        ↕️
                                    </div>


                                    <strong>
                                        Drag your first activity here
                                    </strong>


                                    <span>
                                        Build your daily routine one step at a time.
                                    </span>

                                </div>

                            ) : (

                                routineOrder.map(
                                    (
                                        cardId,
                                        index
                                    ) => {

                                        const card =
                                            routineCards.find(
                                                (
                                                    item
                                                ) =>
                                                    item.id ===
                                                    cardId
                                            );

                                        if (
                                            !card
                                        ) {
                                            return null;
                                        }

                                        return (
                                            <button
                                                key={`${card.id}-${index}`}
                                                type="button"
                                                className="dre-selected-card"
                                                onClick={() =>
                                                    handleRemoveRoutineCard(
                                                        index
                                                    )
                                                }
                                                title="Click to remove"
                                            >

                                                <span className="dre-selected-number">
                                                    {
                                                        index +
                                                        1
                                                    }
                                                </span>


                                                <img
                                                    src={
                                                        card.image
                                                    }
                                                    alt={
                                                        card.name
                                                    }
                                                />


                                                <span>
                                                    {
                                                        card.name
                                                    }
                                                </span>


                                                <small>
                                                    Remove
                                                </small>

                                            </button>
                                        );
                                    }
                                )

                            )}

                        </div>


                        {/* =================================
                            DRAG INSTRUCTION
                        ================================= */}

                        <div className="dre-drag-instruction">

                            <span>
                                👆
                            </span>

                            Drag a card and drop it into
                            the routine above.

                        </div>


                        {/* =================================
                            SHUFFLED CARDS
                        ================================= */}

                        <div className="dre-routine-card-list">

                            {shuffledRoutineCards.map(
                                (
                                    card
                                ) => {

                                    const alreadySelected =
                                        routineOrder.includes(
                                            card.id
                                        );

                                    const isBeingDragged =
                                        draggedCardId ===
                                        card.id;

                                    return (
                                        <button
                                            key={
                                                card.id
                                            }

                                            type="button"

                                            draggable={
                                                !alreadySelected
                                            }

                                            className={`dre-routine-card ${
                                                alreadySelected
                                                    ? "dre-routine-card-selected"
                                                    : ""
                                            } ${
                                                isBeingDragged
                                                    ? "dre-routine-card-dragging"
                                                    : ""
                                            }`}

                                            disabled={
                                                alreadySelected
                                            }

                                            onClick={() =>
                                                handleRoutineCardClick(
                                                    card
                                                )
                                            }

                                            onDragStart={(
                                                event
                                            ) =>
                                                handleDragStart(
                                                    event,
                                                    card
                                                )
                                            }

                                            onDragEnd={
                                                handleDragEnd
                                            }
                                        >

                                            <img
                                                src={
                                                    card.image
                                                }
                                                alt={
                                                    card.name
                                                }
                                            />


                                            <span>
                                                {
                                                    card.name
                                                }
                                            </span>


                                            {alreadySelected && (
                                                <b>
                                                    ✓
                                                </b>
                                            )}

                                        </button>
                                    );
                                }
                            )}

                        </div>


                        {/* =================================
                            FEEDBACK
                        ================================= */}

                        {routineFeedback ===
                            "wrong" && (

                            <div className="dre-final-wrong">
                                ✗ Almost! Check the order and try again.
                            </div>
                        )}


                        {routineFeedback ===
                            "success" && (

                            <div className="dre-final-success">
                                ✓ Perfect! Your routine is correct!
                            </div>
                        )}


                        {/* =================================
                            CHECK BUTTON
                        ================================= */}

                        <button
                            className="dre-check-routine-button"

                            disabled={
                                routineOrder.length !==
                                    correctRoutine.length ||
                                isCheckingRoutine
                            }

                            onClick={
                                handleCheckRoutine
                            }
                        >

                            {isCheckingRoutine
                                ? "Checking..."
                                : "Check My Routine ✓"}

                        </button>

                    </div>

                </div>

            </div>
        );
    };


    /* =================================================
       DOOR
    ================================================= */

    const renderDoor = () => {

        return (
            <div className="dre-door-layout">

                <div className="dre-door-card">

                    <img
                        src={
                            finalDoorImage
                        }
                        alt="Final Door"
                        className="dre-door-image"
                    />


                    <div className="dre-door-content">

                        <div className="dre-door-icon">

                            {finalDoorOpen
                                ? "🔓"
                                : "🔐"}

                        </div>


                        <h2>
                            All Keys Collected!
                        </h2>


                        <p>
                            Your routine is complete.
                            The final door is waiting!
                        </p>


                        {/* KEYS */}

                        <div className="dre-door-keys">

                            {tasks.map(
                                (
                                    task
                                ) => (

                                    <img
                                        key={
                                            task.id
                                        }
                                        src={
                                            task.key
                                        }
                                        alt="Collected key"
                                    />

                                )
                            )}

                        </div>


                        <button
                            className="dre-unlock-button"
                            onClick={
                                handleUnlockDoor
                            }
                        >
                            🔓 Unlock Final Door
                        </button>

                    </div>

                </div>

            </div>
        );
    };


    /* =================================================
       CELEBRATION
    ================================================= */

    const renderCelebration = () => {

        return (
            <div className="dre-celebration-layout">

                <div className="dre-celebration-card">

                    <div className="dre-celebration-stars">
                        ⭐ ✨ ⭐ ✨ ⭐
                    </div>


                    <img
                        src={
                            teacherImage
                        }
                        alt="Miss Uroosa celebrating"
                        className="dre-celebration-teacher"
                    />


                    <div className="dre-celebration-message">

                        <div className="dre-celebration-label">
                            ESCAPE COMPLETE!
                        </div>


                        <h2>

                            Great Job,

                            <span>
                                Explorer! ⭐
                            </span>

                        </h2>


                        <p>
                            You completed your daily routine,
                            collected all four keys and escaped
                            the Daily Routine!
                        </p>


                        {/* ALL KEYS */}

                        <div className="dre-celebration-key-row">

                            {tasks.map(
                                (
                                    task
                                ) => (

                                    <img
                                        key={
                                            task.id
                                        }
                                        src={
                                            task.key
                                        }
                                        alt="Collected key"
                                    />

                                )
                            )}

                        </div>

                    </div>

                </div>

            </div>
        );
    };


    /* =================================================
       MAIN RENDER
    ================================================= */

    return (

        <div className="daily-routine-escape-page">


            {/* BACKGROUND */}

            <div className="dre-background"></div>


            {/* MAIN CONTAINER */}

            <div className="dre-main-container">

                {renderHeader()}


                {screen ===
                    "intro" &&
                    renderIntro()}


                {screen ===
                    "map" &&
                    renderMap()}


                {screen ===
                    "task" &&
                    renderTask()}


                {screen ===
                    "final" &&
                    renderFinalRoutine()}


                {screen ===
                    "door" &&
                    renderDoor()}


                {screen ===
                    "celebration" &&
                    renderCelebration()}

            </div>

        </div>
    );
}


/* =====================================================
   EXPORT
===================================================== */

export default DailyRoutineEscapeActivity;