import React, { useEffect, useRef, useState } from "react";

import teacher from "../../assets/teacher1.png";
import bg from "../../assets/chatbg.jpeg";
import yaySound from "../../assets/yay.mp3";

import backpackClosed from "../../assets/bagclose.png";
import backpackOpen from "../../assets/bagopen.png";

import confetti from "canvas-confetti";

import "./PersonalityBackpackActivity.css";


/* =====================================================
   PERSONALITY TRAITS
===================================================== */

const traits = [
    {
        id: 1,
        name: "Kind",
        icon: "💛",
    },
    {
        id: 2,
        name: "Helpful",
        icon: "🤝",
    },
    {
        id: 3,
        name: "Funny",
        icon: "😄",
    },
    {
        id: 4,
        name: "Brave",
        icon: "🦁",
    },
    {
        id: 5,
        name: "Friendly",
        icon: "😊",
    },
    {
        id: 6,
        name: "Shy",
        icon: "🙈",
    },
    {
        id: 7,
        name: "Caring",
        icon: "💖",
    },
    {
        id: 8,
        name: "Cheerful",
        icon: "🌈",
    },
];


/* =====================================================
   ROUNDS
===================================================== */

const rounds = [
    {
        situation:
            "Sara always helps her friends when they need help.",

        question:
            "Drag the correct personality trait into Sara's backpack!",

        answer: "Helpful",

        correctRemark:
            "Excellent! Helpful belongs in Sara's backpack!",
    },

    {
        situation:
            "Ali makes his friends laugh and tells funny jokes.",

        question:
            "Drag the correct personality trait into Ali's backpack!",

        answer: "Funny",

        correctRemark:
            "Great job! Funny is the perfect trait for Ali!",
    },

    {
        situation:
            "Maya shares her things and always cares about her friends.",

        question:
            "Drag the correct personality trait into Maya's backpack!",

        answer: "Caring",

        correctRemark:
            "Wonderful! Caring is a perfect trait for Maya!",
    },
];


/* =====================================================
   DEFAULT TEACHER TEXT
===================================================== */

const DEFAULT_TEACHER_TEXT =
    "Read the situation, then drag the correct personality trait into the backpack!";


/* =====================================================
   COMPONENT
===================================================== */

function PersonalityBackpackActivity({
    onBack,
    onFinish,
}) {

    /* =================================================
       STATES
    ================================================= */

    const [round, setRound] = useState(0);

    const [score, setScore] = useState(0);

    const [selectedTrait, setSelectedTrait] =
        useState(null);

    const [draggedTrait, setDraggedTrait] =
        useState(null);

    const [isOverBag, setIsOverBag] =
        useState(false);

    const [bagOpen, setBagOpen] =
        useState(false);

    const [traitInsideBag, setTraitInsideBag] =
        useState(null);

    const [isPacking, setIsPacking] =
        useState(false);

    const [answered, setAnswered] =
        useState(false);

    const [isSpeaking, setIsSpeaking] =
        useState(false);

    const [celebrating, setCelebrating] =
        useState(false);

    const [teacherRemark, setTeacherRemark] =
        useState(DEFAULT_TEACHER_TEXT);

    /*
       IMPORTANT:
       Successfully packed traits yahan store honge.
       Ye next rounds me bhi options se hide rahenge.
    */
    const [usedTraits, setUsedTraits] =
        useState([]);


    /* =================================================
       REFS
    ================================================= */

    const yayAudioRef = useRef(null);

    const confettiFrameRef = useRef(null);

    const timeoutRefs = useRef([]);

    const isMountedRef = useRef(true);


    /* =================================================
       CURRENT ROUND
    ================================================= */

    const currentRound =
        rounds[round];


    /* =================================================
       SAFE TIMEOUT
    ================================================= */

    const addTimeout = (callback, time) => {

        const timer = setTimeout(() => {

            timeoutRefs.current =
                timeoutRefs.current.filter(
                    (item) => item !== timer
                );

            callback();

        }, time);

        timeoutRefs.current.push(timer);
    };


    /* =================================================
       CLEAR TIMEOUTS
    ================================================= */

    const clearAllTimeouts = () => {

        timeoutRefs.current.forEach(
            (timer) => clearTimeout(timer)
        );

        timeoutRefs.current = [];
    };


    /* =================================================
       MOUNT / UNMOUNT
    ================================================= */

    useEffect(() => {

        isMountedRef.current = true;

        const audio = new Audio(yaySound);

        audio.preload = "auto";

        yayAudioRef.current = audio;


        return () => {

            isMountedRef.current = false;

            clearAllTimeouts();


            if (window.speechSynthesis) {

                window.speechSynthesis.cancel();

            }


            if (confettiFrameRef.current) {

                cancelAnimationFrame(
                    confettiFrameRef.current
                );

            }


            if (yayAudioRef.current) {

                yayAudioRef.current.pause();

                yayAudioRef.current.currentTime = 0;

            }

        };

    }, []);


    /* =================================================
       LOAD VOICES
    ================================================= */

    useEffect(() => {

        if (!window.speechSynthesis) {
            return;
        }


        const loadVoices = () => {

            window.speechSynthesis.getVoices();

        };


        loadVoices();


        window.speechSynthesis.onvoiceschanged =
            loadVoices;


        return () => {

            window.speechSynthesis.onvoiceschanged =
                null;

        };

    }, []);


    /* =================================================
       GET TEACHER VOICE
    ================================================= */

    const getTeacherVoice = () => {

        if (!window.speechSynthesis) {
            return null;
        }


        const voices =
            window.speechSynthesis.getVoices();


        return (

            voices.find((voice) =>
                /Google UK English Female/i.test(
                    voice.name
                )
            )

            ||

            voices.find((voice) =>
                /Google US English/i.test(
                    voice.name
                )
            )

            ||

            voices.find((voice) =>
                /Microsoft.*Jenny/i.test(
                    voice.name
                )
            )

            ||

            voices.find((voice) =>
                /Microsoft.*Aria/i.test(
                    voice.name
                )
            )

            ||

            voices.find((voice) =>
                /Samantha/i.test(
                    voice.name
                )
            )

            ||

            voices.find((voice) =>
                /Zira/i.test(
                    voice.name
                )
            )

            ||

            null

        );

    };


    /* =================================================
       TEACHER SPEAK
    ================================================= */

    const speakTeacher = (
        text,
        callback
    ) => {

        if (!isMountedRef.current) {
            return;
        }


        setTeacherRemark(text);


        if (!window.speechSynthesis) {

            callback?.();

            return;

        }


        window.speechSynthesis.cancel();


        const speech =
            new SpeechSynthesisUtterance(text);


        speech.lang = "en-US";

        speech.rate = 0.88;

        speech.pitch = 1.08;

        speech.volume = 1;


        const voice =
            getTeacherVoice();


        if (voice) {

            speech.voice = voice;

        }


        speech.onstart = () => {

            if (isMountedRef.current) {

                setIsSpeaking(true);

            }

        };


        speech.onend = () => {

            if (!isMountedRef.current) {
                return;
            }


            setIsSpeaking(false);

            callback?.();

        };


        speech.onerror = () => {

            if (!isMountedRef.current) {
                return;
            }


            setIsSpeaking(false);

            callback?.();

        };


        window.speechSynthesis.speak(
            speech
        );

    };


    /* =================================================
       SPEAK CURRENT ROUND
    ================================================= */

    const speakCurrentRound = (
        roundData
    ) => {

        const situationText =
            roundData.situation;

        const questionText =
            roundData.question;


        speakTeacher(
            situationText,
            () => {

                if (!isMountedRef.current) {
                    return;
                }


                addTimeout(() => {

                    if (!isMountedRef.current) {
                        return;
                    }


                    speakTeacher(
                        questionText
                    );

                }, 300);

            }
        );

    };


    /* =================================================
       START FIRST ROUND
    ================================================= */

    useEffect(() => {

        addTimeout(() => {

            if (!isMountedRef.current) {
                return;
            }


            speakCurrentRound(
                rounds[0]
            );

        }, 500);


        return () => {

            clearAllTimeouts();

        };

    }, []);


    /* =================================================
       CONFETTI
    ================================================= */

    const playConfetti = () => {

        const duration = 1800;

        const end =
            Date.now() + duration;


        const frame = () => {

            if (!isMountedRef.current) {
                return;
            }


            confetti({

                particleCount: 5,

                spread: 70,

                startVelocity: 35,

                origin: {
                    x: Math.random(),
                    y: Math.random() * 0.5,
                },

            });


            if (Date.now() < end) {

                confettiFrameRef.current =
                    requestAnimationFrame(frame);

            }

        };


        frame();

    };


    /* =================================================
       PLAY YAY SOUND
    ================================================= */

    const playYaySound = (
        callback
    ) => {

        const audio =
            yayAudioRef.current;


        if (!audio) {

            callback?.();

            return;

        }


        audio.pause();

        audio.currentTime = 0;


        let completed = false;


        const finishAudio = () => {

            if (completed) {
                return;
            }


            completed = true;

            callback?.();

        };


        audio.onended =
            finishAudio;

        audio.onerror =
            finishAudio;


        audio.play()
            .catch(() => {

                finishAudio();

            });

    };


    /* =================================================
       STOP ALL
    ================================================= */

    const stopAll = () => {

        clearAllTimeouts();


        if (window.speechSynthesis) {

            window.speechSynthesis.cancel();

        }


        if (yayAudioRef.current) {

            yayAudioRef.current.pause();

            yayAudioRef.current.currentTime = 0;

        }


        if (confettiFrameRef.current) {

            cancelAnimationFrame(
                confettiFrameRef.current
            );

            confettiFrameRef.current = null;

        }


        setIsSpeaking(false);

        setCelebrating(false);

        setIsPacking(false);

        setBagOpen(false);

        setIsOverBag(false);

    };


    /* =================================================
       RESET ROUND
    ================================================= */

    const resetRound = () => {

        setSelectedTrait(null);

        setDraggedTrait(null);

        setTraitInsideBag(null);

        setIsOverBag(false);

        setBagOpen(false);

        setIsPacking(false);

        setAnswered(false);

    };


    /* =================================================
       NEXT ROUND
    ================================================= */

    const goToNextRound = () => {

        const isLastRound =
            round === rounds.length - 1;


        if (isLastRound) {

            onFinish?.();

            return;

        }


        const nextRoundIndex =
            round + 1;


        const nextRoundData =
            rounds[nextRoundIndex];


        resetRound();


        setRound(
            nextRoundIndex
        );


        addTimeout(() => {

            if (!isMountedRef.current) {
                return;
            }


            speakCurrentRound(
                nextRoundData
            );

        }, 400);

    };


    /* =================================================
       CORRECT PACKING
    ================================================= */

    const handleCorrectTrait = (
        trait
    ) => {

        setSelectedTrait(trait);

        setTraitInsideBag(trait);

        setAnswered(true);

        setIsPacking(true);

        setCelebrating(true);

        setBagOpen(false);

        setIsOverBag(false);


        setScore(
            (prev) => prev + 1
        );


        /*
           IMPORTANT:
           Correct trait ko permanently usedTraits me add
           kar rahe hain.

           Isliye:
           Round 1 -> Helpful hide
           Round 2 -> Helpful already hidden
           Round 3 -> Helpful + Funny hidden
        */

        setUsedTraits((prev) => {

            if (
                prev.includes(trait.name)
            ) {
                return prev;
            }

            return [
                ...prev,
                trait.name,
            ];

        });


        setTeacherRemark(
            currentRound.correctRemark
        );


        addTimeout(() => {

            if (!isMountedRef.current) {
                return;
            }


            playConfetti();


            playYaySound(() => {

                if (!isMountedRef.current) {
                    return;
                }


                speakTeacher(
                    currentRound.correctRemark,
                    () => {

                        if (!isMountedRef.current) {
                            return;
                        }


                        addTimeout(() => {

                            if (!isMountedRef.current) {
                                return;
                            }


                            setCelebrating(false);

                            setIsPacking(false);

                            setBagOpen(false);

                            goToNextRound();

                        }, 700);

                    }
                );

            });

        }, 600);

    };


    /* =================================================
       WRONG TRAIT
    ================================================= */

    const handleWrongTrait = (
        trait
    ) => {

        const wrongRemark =
            "Good try! Think carefully about what the person does and drag the matching trait.";


        setSelectedTrait(trait);

        setAnswered(true);


        setBagOpen(false);

        setIsOverBag(false);


        setTeacherRemark(
            wrongRemark
        );


        speakTeacher(
            wrongRemark,
            () => {

                if (!isMountedRef.current) {
                    return;
                }


                addTimeout(() => {

                    if (!isMountedRef.current) {
                        return;
                    }


                    setSelectedTrait(null);

                    setDraggedTrait(null);

                    setAnswered(false);

                    setBagOpen(false);

                    setIsOverBag(false);

                }, 500);

            }
        );

    };


    /* =================================================
       DROP TRAIT
    ================================================= */

    const handleDropTrait = (
        trait
    ) => {

        if (
            answered ||
            celebrating ||
            isPacking
        ) {
            return;
        }


        setDraggedTrait(null);

        setIsOverBag(false);

        setBagOpen(false);


        if (
            trait.name ===
            currentRound.answer
        ) {

            handleCorrectTrait(trait);

        }

        else {

            handleWrongTrait(trait);

        }

    };


    /* =================================================
       DRAG START
    ================================================= */

    const handleDragStart = (
        event,
        trait
    ) => {

        if (
            answered ||
            celebrating ||
            isPacking
        ) {

            event.preventDefault();

            return;

        }


        event.dataTransfer.effectAllowed =
            "move";


        event.dataTransfer.setData(
            "text/plain",
            trait.name
        );


        setDraggedTrait(trait);

    };


    /* =================================================
       DRAG END
    ================================================= */

    const handleDragEnd = () => {

        setDraggedTrait(null);

        setIsOverBag(false);

        setBagOpen(false);

    };


    /* =================================================
       BAG DRAG OVER
    ================================================= */

    const handleBagDragOver = (
        event
    ) => {

        event.preventDefault();


        if (
            !answered &&
            !celebrating &&
            !isPacking
        ) {

            event.dataTransfer.dropEffect =
                "move";


            setIsOverBag(true);

            setBagOpen(true);

        }

    };


    /* =================================================
       BAG DRAG LEAVE
    ================================================= */

    const handleBagDragLeave = (
        event
    ) => {

        const bag =
            event.currentTarget;


        if (
            !bag.contains(
                event.relatedTarget
            )
        ) {

            setIsOverBag(false);

            setBagOpen(false);

        }

    };


    /* =================================================
       BAG DROP
    ================================================= */

    const handleBagDrop = (
        event
    ) => {

        event.preventDefault();


        setBagOpen(false);

        setIsOverBag(false);


        if (!draggedTrait) {
            return;
        }


        handleDropTrait(
            draggedTrait
        );

    };


    /* =================================================
       BACK
    ================================================= */

    const handleBack = () => {

        if (
            celebrating ||
            isPacking
        ) {
            return;
        }


        stopAll();


        if (typeof onBack === "function") {

            onBack();

        }

    };


    /* =================================================
       SKIP
    ================================================= */

    const handleSkip = () => {

        if (
            celebrating ||
            isPacking
        ) {
            return;
        }


        stopAll();


        if (typeof onFinish === "function") {

            onFinish();

        }

    };


    /* =================================================
       TRAIT CLASS
    ================================================= */

    const getTraitClass = (
        trait
    ) => {

        let className =
            "personality-backpack-trait-card";


        if (
            selectedTrait?.name ===
            trait.name
        ) {

            if (
                trait.name ===
                currentRound.answer
            ) {

                className +=
                    " correct-selected";

            }

            else {

                className +=
                    " wrong-selected";

            }

        }


        if (
            draggedTrait?.id ===
            trait.id
        ) {

            className +=
                " dragging";

        }


        return className;

    };


    /* =====================================================
       MAIN UI
    ===================================================== */

    return (

        <div
            className="personality-backpack-page"
            style={{
                backgroundImage:
                    `url(${bg})`,
            }}
        >

            <div
                className="personality-backpack-overlay"
            />


            <div
                className="personality-backpack-card"
            >


                {/* =====================================
                    HEADER
                ===================================== */}

                <div
                    className="personality-backpack-header"
                >

                    <div
                        className="personality-backpack-header-left"
                    >

                        <button
                            type="button"
                            className="personality-backpack-back-btn"
                            onClick={handleBack}
                            disabled={
                                celebrating ||
                                isPacking
                            }
                        >
                            ← Back
                        </button>

                    </div>


                    <div
                        className="personality-backpack-header-center"
                    >

                        <h1>
                            🎒 Personality Backpack
                        </h1>

                        <span>
                            Personality Traits • Activity 2
                        </span>

                    </div>


                    <div
                        className="personality-backpack-header-right"
                    >

                        <button
                            type="button"
                            className="personality-backpack-skip-btn"
                            onClick={handleSkip}
                            disabled={
                                celebrating ||
                                isPacking
                            }
                        >
                            Skip →
                        </button>

                    </div>

                </div>


                {/* =====================================
                    ACTIVITY CONTENT
                ===================================== */}

                <div
                    className="personality-backpack-activity-content"
                >


                    {/* =================================
                        TEACHER
                    ================================= */}

                    <div
                        className="personality-backpack-teacher-section"
                    >

                        <div
                            className="personality-backpack-teacher-stage"
                        >

                            <img
                                src={teacher}
                                alt="Teacher"
                                className={
                                    isSpeaking
                                        ? "personality-backpack-teacher-img speaking"
                                        : "personality-backpack-teacher-img"
                                }
                            />

                        </div>


                        <div
                            className="personality-backpack-teacher-bubble"
                        >

                            <div
                                className="personality-backpack-teacher-name"
                            >
                                Miss Uroosa
                            </div>


                            <div
                                className="personality-backpack-teacher-text"
                            >
                                {teacherRemark}
                            </div>

                        </div>


                        <div
                            className="personality-backpack-teacher-stats"
                        >

                            <div
                                className="personality-backpack-round-badge"
                            >
                                Round {round + 1} /{" "}
                                {rounds.length}
                            </div>


                            <div
                                className="personality-backpack-score-badge"
                            >
                                ⭐ {score}
                            </div>

                        </div>

                    </div>


                    {/* =================================
                        MAIN SECTION
                    ================================= */}

                    <div
                        className="personality-backpack-main-section"
                    >


                        {/* SITUATION */}

                        <div
                            className="personality-backpack-situation-card"
                        >

                            <div
                                className="personality-backpack-situation-label"
                            >
                                READ THE SITUATION
                            </div>


                            <h2>
                                {currentRound.situation}
                            </h2>


                            <p>
                                {currentRound.question}
                            </p>

                        </div>


                        {/* DRAG AREA */}

                        <div
                            className="personality-backpack-game-area"
                        >


                            {/* TRAIT CARDS */}

                            <div
                                className="personality-backpack-trait-grid"
                            >

                                {traits
                                    .filter(
                                        (trait) =>
                                            !usedTraits.includes(
                                                trait.name
                                            )
                                    )
                                    .map(
                                        (trait) => (

                                            <div
                                                key={
                                                    trait.id
                                                }
                                                className={
                                                    getTraitClass(
                                                        trait
                                                    )
                                                }
                                                draggable={
                                                    !answered &&
                                                    !celebrating &&
                                                    !isPacking
                                                }
                                                onDragStart={
                                                    (event) =>
                                                        handleDragStart(
                                                            event,
                                                            trait
                                                        )
                                                }
                                                onDragEnd={
                                                    handleDragEnd
                                                }
                                            >

                                                <span
                                                    className="personality-backpack-trait-icon"
                                                >
                                                    {
                                                        trait.icon
                                                    }
                                                </span>


                                                <span
                                                    className="personality-backpack-trait-name"
                                                >
                                                    {
                                                        trait.name
                                                    }
                                                </span>

                                            </div>

                                        )
                                    )}

                            </div>


                            {/* BACKPACK DROP ZONE */}

                            <div
                                className={
                                    isOverBag
                                        ? "personality-backpack-drop-zone active"
                                        : "personality-backpack-drop-zone"
                                }
                                onDragOver={
                                    handleBagDragOver
                                }
                                onDragLeave={
                                    handleBagDragLeave
                                }
                                onDrop={
                                    handleBagDrop
                                }
                            >


                                <div
                                    className="personality-backpack-bag-wrapper"
                                >


                                    {/* OPEN / CLOSED BAG */}

                                    <img
                                        src={
                                            bagOpen
                                                ? backpackOpen
                                                : backpackClosed
                                        }
                                        alt="Personality Backpack"
                                        className={
                                            bagOpen
                                                ? "personality-backpack-bag-img open"
                                                : "personality-backpack-bag-img"
                                        }
                                        style={{
                                            pointerEvents:
                                                "none",
                                        }}
                                    />


                                    {/* TRAIT ENTERING BAG */}

                                    {traitInsideBag && (

                                        <div
                                            className={
                                                isPacking
                                                    ? "personality-backpack-packed-trait packing"
                                                    : "personality-backpack-packed-trait"
                                            }
                                        >

                                            <span>
                                                {
                                                    traitInsideBag.icon
                                                }
                                            </span>

                                            <strong>
                                                {
                                                    traitInsideBag.name
                                                }
                                            </strong>

                                        </div>

                                    )}


                                    {/* DROP MESSAGE */}

                                    {!traitInsideBag && (

                                        <div
                                            className="personality-backpack-drop-text"
                                        >
                                            {bagOpen
                                                ? "Drop it inside!"
                                                : "Drag a trait here"}
                                        </div>

                                    )}

                                </div>


                                {/* SPARKLES */}

                                {bagOpen && (

                                    <>

                                        <span className="bag-sparkle sparkle-1">
                                            ✨
                                        </span>

                                        <span className="bag-sparkle sparkle-2">
                                            ⭐
                                        </span>

                                        <span className="bag-sparkle sparkle-3">
                                            ✨
                                        </span>

                                    </>

                                )}

                            </div>


                            {/* INSTRUCTION */}

                            <div
                                className="personality-backpack-drag-hint"
                            >
                                👆 Drag the trait card into the backpack!
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default PersonalityBackpackActivity;