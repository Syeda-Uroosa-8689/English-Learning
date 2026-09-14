import React, { useEffect, useRef, useState } from "react";

import teacher from "../../assets/teacher1.png";
import bg from "../../assets/chatbg.jpeg";
import yaySound from "../../assets/yay.mp3";

import testTube from "../../assets/testTube.png";
import potionStream from "../../assets/potionStream.png";

import confetti from "canvas-confetti";

import "./PersonalityPotionActivity.css";


/* =====================================================
   PERSONALITY TRAITS
===================================================== */

const traits = [
    {
        id: 1,
        name: "Kind",
        emoji: "💗",
        description: "Helps others and cares about people.",
    },
    {
        id: 2,
        name: "Brave",
        emoji: "🦁",
        description: "Tries new things and is not easily scared.",
    },
    {
        id: 3,
        name: "Helpful",
        emoji: "🤝",
        description: "Likes helping friends and family.",
    },
    {
        id: 4,
        name: "Funny",
        emoji: "😄",
        description: "Makes people laugh and smile.",
    },
    {
        id: 5,
        name: "Friendly",
        emoji: "😊",
        description: "Likes meeting and talking to others.",
    },
    {
        id: 6,
        name: "Creative",
        emoji: "🎨",
        description: "Enjoys making and imagining new things.",
    },
];


/* =====================================================
   ROUNDS
===================================================== */

const rounds = [
    {
        situation:
            "Your friend is feeling sad. You sit with them and try to make them feel better.",

        question:
            "Which personality trait belongs in your potion?",

        answer: "Kind",

        correctRemark:
            "Excellent! Being kind means caring about how others feel.",
    },

    {
        situation:
            "You are nervous about trying something new, but you decide to give it a try.",

        question:
            "Which personality trait belongs in your potion?",

        answer: "Brave",

        correctRemark:
            "Great job! Being brave means trying even when something feels scary.",
    },

    {
        situation:
            "You see your friend carrying lots of books, so you offer to carry some.",

        question:
            "Which personality trait belongs in your potion?",

        answer: "Helpful",

        correctRemark:
            "Wonderful! A helpful person likes making things easier for others.",
    },
];


/* =====================================================
   DEFAULT TEACHER TEXT
===================================================== */

const DEFAULT_TEACHER_TEXT =
    "Read the situation carefully and choose the personality trait. Every correct answer will fill your magical potion.";


/* =====================================================
   COMPONENT
===================================================== */

function PersonalityPotionActivity({
    onBack,
    onFinish,
}) {

    /* =================================================
       STATES
    ================================================= */

    const [round, setRound] = useState(0);

    const [selected, setSelected] = useState(null);

    const [score, setScore] = useState(0);

    const [answered, setAnswered] = useState(false);

    const [teacherRemark, setTeacherRemark] =
        useState(DEFAULT_TEACHER_TEXT);

    const [isSpeaking, setIsSpeaking] =
        useState(false);

    const [celebrating, setCelebrating] =
        useState(false);

    const [isPouring, setIsPouring] =
        useState(false);

    const [potionLevel, setPotionLevel] =
        useState(0);


    /* =================================================
       REFS
    ================================================= */

    const yayAudioRef = useRef(null);

    const confettiFrameRef = useRef(null);

    const speechTimeoutRef = useRef(null);

    const isMountedRef = useRef(true);


    /* =================================================
       CURRENT ROUND
    ================================================= */

    const currentRound = rounds[round];


    /* =================================================
       POTION PERCENTAGE
    ================================================= */

    const potionPercentage =
        (potionLevel / rounds.length) * 100;


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


            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }


            if (speechTimeoutRef.current) {

                clearTimeout(
                    speechTimeoutRef.current
                );

                speechTimeoutRef.current = null;
            }


            if (confettiFrameRef.current) {

                cancelAnimationFrame(
                    confettiFrameRef.current
                );

                confettiFrameRef.current = null;
            }


            if (yayAudioRef.current) {

                yayAudioRef.current.pause();

                yayAudioRef.current.currentTime = 0;

                yayAudioRef.current.onended = null;

                yayAudioRef.current.onerror = null;
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


        if (!window.speechSynthesis) {

            if (callback) {
                callback();
            }

            return;
        }


        window.speechSynthesis.cancel();


        const speech =
            new SpeechSynthesisUtterance(text);


        speech.lang = "en-US";


        const voice =
            getTeacherVoice();


        if (voice) {
            speech.voice = voice;
        }


        speech.rate = 0.88;

        speech.pitch = 1.08;

        speech.volume = 1;


        speech.onstart = () => {

            if (!isMountedRef.current) {
                return;
            }

            setIsSpeaking(true);

        };


        speech.onend = () => {

            if (!isMountedRef.current) {
                return;
            }

            setIsSpeaking(false);


            if (callback) {
                callback();
            }

        };


        speech.onerror = () => {

            if (!isMountedRef.current) {
                return;
            }

            setIsSpeaking(false);


            if (callback) {
                callback();
            }

        };


        window.speechSynthesis.speak(
            speech
        );

    };


    /* =================================================
       CONFETTI
    ================================================= */

    const playConfetti = () => {

        if (!isMountedRef.current) {
            return;
        }


        if (confettiFrameRef.current) {

            cancelAnimationFrame(
                confettiFrameRef.current
            );

            confettiFrameRef.current = null;
        }


        const duration = 1400;

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

            } else {

                confettiFrameRef.current = null;

            }

        };


        frame();

    };


    /* =================================================
       YAY SOUND
    ================================================= */

    const playYaySound = (callback) => {

        if (!isMountedRef.current) {
            return;
        }


        const audio =
            yayAudioRef.current;


        if (!audio) {

            if (callback) {
                callback();
            }

            return;
        }


        audio.pause();

        audio.currentTime = 0;


        let finished = false;


        const finishSound = () => {

            if (finished) {
                return;
            }


            finished = true;


            audio.onended = null;

            audio.onerror = null;


            if (
                isMountedRef.current &&
                callback
            ) {

                callback();

            }

        };


        audio.onended =
            finishSound;


        audio.onerror =
            finishSound;


        const playPromise =
            audio.play();


        if (playPromise !== undefined) {

            playPromise.catch(() => {

                finishSound();

            });

        }

    };


    /* =================================================
       STOP EVERYTHING
    ================================================= */

    const stopAll = () => {

        if (window.speechSynthesis) {

            window.speechSynthesis.cancel();

        }


        if (speechTimeoutRef.current) {

            clearTimeout(
                speechTimeoutRef.current
            );

            speechTimeoutRef.current = null;

        }


        if (yayAudioRef.current) {

            yayAudioRef.current.pause();

            yayAudioRef.current.currentTime = 0;

            yayAudioRef.current.onended = null;

            yayAudioRef.current.onerror = null;

        }


        if (confettiFrameRef.current) {

            cancelAnimationFrame(
                confettiFrameRef.current
            );

            confettiFrameRef.current = null;

        }


        setIsSpeaking(false);

        setCelebrating(false);

        setIsPouring(false);

    };


    /* =================================================
       CORRECT ANSWER
       
       IMPORTANT FLOW:

       CLICK
          ↓
       POTION IMMEDIATELY FILLS
          ↓
       PERCENTAGE IMMEDIATELY CHANGES
          ↓
       STREAM ONLY 0.45 SEC
          ↓
       STREAM DISAPPEARS
          ↓
       TEACHER REMARK
          ↓
       NEXT ROUND
    ================================================= */

    const celebrateCorrectAnswer = () => {

        if (!isMountedRef.current) {
            return;
        }


        const isLast =
            round === rounds.length - 1;


        setCelebrating(true);

        setAnswered(true);


        /* ---------------------------------------------
           POTION IMMEDIATELY FILL
        --------------------------------------------- */

        setPotionLevel((prev) =>
            Math.min(
                prev + 1,
                rounds.length
            )
        );


        /* ---------------------------------------------
           SHOW STREAM
        --------------------------------------------- */

        setIsPouring(true);


        /* ---------------------------------------------
           CONFETTI
        --------------------------------------------- */

        playConfetti();


        /* ---------------------------------------------
           YAY SOUND
        --------------------------------------------- */

        playYaySound(() => {

            if (!isMountedRef.current) {
                return;
            }


            /* -----------------------------------------
               STREAM QUICKLY DISAPPEARS
            ----------------------------------------- */

            speechTimeoutRef.current =
                setTimeout(() => {

                    if (!isMountedRef.current) {
                        return;
                    }


                    setIsPouring(false);


                    /* ---------------------------------
                       NOW TEACHER SPEAKS
                    --------------------------------- */

                    speakTeacher(
                        currentRound.correctRemark,
                        () => {

                            if (!isMountedRef.current) {
                                return;
                            }


                            speechTimeoutRef.current =
                                setTimeout(() => {

                                    if (!isMountedRef.current) {
                                        return;
                                    }


                                    setCelebrating(false);


                                    /* -----------------
                                       LAST ROUND
                                    ----------------- */

                                    if (isLast) {

                                        if (
                                            typeof onFinish ===
                                            "function"
                                        ) {

                                            onFinish();

                                        }

                                        return;
                                    }


                                    /* -----------------
                                       NEXT ROUND
                                    ----------------- */

                                    setRound(
                                        (prev) =>
                                            prev + 1
                                    );


                                    /*
                                       VERY IMPORTANT:
                                       PREVIOUS TRAIT
                                       RESET
                                    */

                                    setSelected(null);

                                    setAnswered(false);


                                    setTeacherRemark(
                                        DEFAULT_TEACHER_TEXT
                                    );


                                    speechTimeoutRef.current =
                                        null;


                                }, 400);

                        }
                    );


                }, 450);

        });

    };


    /* =================================================
       WRONG ANSWER
    ================================================= */

    const handleWrongAnswer = () => {

        if (!isMountedRef.current) {
            return;
        }


        const wrongRemark =
            "Not quite! Think about what the person is doing and try again.";


        setTeacherRemark(
            wrongRemark
        );


        speakTeacher(
            wrongRemark,
            () => {

                if (!isMountedRef.current) {
                    return;
                }


                speechTimeoutRef.current =
                    setTimeout(() => {

                        if (!isMountedRef.current) {
                            return;
                        }


                        setSelected(null);

                        setAnswered(false);

                        setTeacherRemark(
                            DEFAULT_TEACHER_TEXT
                        );


                        speechTimeoutRef.current =
                            null;


                    }, 300);

            }
        );

    };


    /* =================================================
       SELECT TRAIT
    ================================================= */

    const handleSelect = (trait) => {

        if (
            answered ||
            celebrating ||
            isPouring
        ) {

            return;

        }


        setSelected(
            trait.name
        );


        if (
            trait.name ===
            currentRound.answer
        ) {

            setScore(
                (prev) =>
                    prev + 1
            );


            celebrateCorrectAnswer();

        } else {

            setAnswered(true);

            handleWrongAnswer();

        }

    };


    /* =================================================
       BACK BUTTON
    ================================================= */

    const handleBack = () => {

        if (celebrating) {
            return;
        }


        stopAll();


        if (
            typeof onBack ===
            "function"
        ) {

            onBack();

        }

    };


    /* =================================================
       SKIP BUTTON
    ================================================= */

    const handleSkip = () => {

        if (celebrating) {
            return;
        }


        stopAll();


        if (
            typeof onFinish ===
            "function"
        ) {

            onFinish();

        }

    };


    /* =================================================
       TRAIT CARD CLASS
    ================================================= */

    const getTraitClass = (trait) => {

        let className =
            "personality-potion-trait-card";


        /*
           BEFORE ANSWER:
           NOTHING SELECTED
        */

        if (!answered) {
            return className;
        }


        const isCorrect =
            trait.name ===
            currentRound.answer;


        const isSelected =
            trait.name ===
            selected;


        /*
           CORRECT ANSWER
        */

        if (isCorrect) {

            className +=
                " correct";

        }


        /*
           WRONG SELECTED ANSWER
        */

        if (
            isSelected &&
            !isCorrect
        ) {

            className +=
                " wrong";

        }


        return className;

    };


    /* =================================================
       MAIN UI
    ================================================= */

    return (

        <div
            className=
                "personality-potion-activity-page"

            style={{
                backgroundImage:
                    `url(${bg})`,
            }}
        >

            <div
                className=
                    "personality-potion-activity-overlay"
            />


            <div
                className=
                    "personality-potion-activity-card"
            >


                {/* =================================
                    HEADER
                ================================= */}

                <div
                    className=
                        "personality-potion-activity-header"
                >

                    <div
                        className=
                            "personality-potion-header-left"
                    >

                        <button
                            type="button"

                            className=
                                "personality-potion-back-btn"

                            onClick={
                                handleBack
                            }

                            disabled={
                                celebrating
                            }
                        >
                            ← Back
                        </button>

                    </div>


                    <div
                        className=
                            "personality-potion-header-center"
                    >

                        <h1>
                            🧪 Personality Potion
                        </h1>

                        <span>
                            Personality Traits • Activity 3
                        </span>

                    </div>


                    <div
                        className=
                            "personality-potion-header-right"
                    >

                        <button
                            type="button"

                            className=
                                "personality-potion-skip-btn"

                            onClick={
                                handleSkip
                            }

                            disabled={
                                celebrating
                            }
                        >
                            Skip →
                        </button>

                    </div>

                </div>


                {/* MOBILE TITLE */}

                <div
                    className=
                        "personality-potion-mobile-lab-title"
                >
                    ✨ Fill Your Magic Potion! ✨
                </div>


                {/* =================================
                    MAIN CONTENT
                ================================= */}

                <div
                    className=
                        "personality-potion-activity-content"
                >


                    {/* =============================
                        TEACHER
                    ============================= */}

                    <div
                        className=
                            "personality-potion-teacher-section"
                    >

                        <div
                            className=
                                "personality-potion-teacher-stage"
                        >

                            <img
                                src={teacher}

                                alt="Teacher"

                                className={
                                    isSpeaking
                                        ? "personality-potion-teacher-img speaking"
                                        : "personality-potion-teacher-img"
                                }
                            />

                        </div>


                        <div
                            className=
                                "personality-potion-teacher-bubble"
                        >

                            <div
                                className=
                                    "personality-potion-teacher-name"
                            >
                                Miss Uroosa
                            </div>


                            <div
                                className=
                                    "personality-potion-teacher-text"
                            >
                                {teacherRemark}
                            </div>

                        </div>


                        <div
                            className=
                                "personality-potion-teacher-stats"
                        >

                            <div
                                className=
                                    "personality-potion-round-badge"
                            >
                                Round {round + 1} / {rounds.length}
                            </div>


                            <div
                                className=
                                    "personality-potion-score-badge"
                            >
                                ⭐ {score}
                            </div>

                        </div>

                    </div>


                    {/* =============================
                        CENTER
                    ============================= */}

                    <div
                        className=
                            "personality-potion-main-section"
                    >


                        {/* SITUATION */}

                        <div
                            className=
                                "personality-potion-situation-card"
                        >

                            <div
                                className=
                                    "personality-potion-question-label"
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


                        {/* TRAITS */}

                        <div
                            className=
                                "personality-potion-trait-grid"
                        >

                            {traits.map(
                                (trait) => (

                                    <button
                                        key={
                                            trait.id
                                        }

                                        type="button"

                                        className={
                                            getTraitClass(
                                                trait
                                            )
                                        }

                                        onClick={() =>
                                            handleSelect(
                                                trait
                                            )
                                        }

                                        disabled={
                                            answered ||
                                            celebrating ||
                                            isPouring
                                        }
                                    >

                                        <div
                                            className=
                                                "personality-potion-trait-icon"
                                        >
                                            {trait.emoji}
                                        </div>


                                        <div
                                            className=
                                                "personality-potion-trait-name"
                                        >
                                            {trait.name}
                                        </div>


                                        <div
                                            className=
                                                "personality-potion-trait-description"
                                        >
                                            {
                                                trait.description
                                            }
                                        </div>

                                    </button>

                                )
                            )}

                        </div>


                        {/* FEEDBACK */}

                        {answered && (

                            <div
                                className={
                                    selected ===
                                    currentRound.answer
                                        ? "personality-potion-feedback correct-feedback"
                                        : "personality-potion-feedback wrong-feedback"
                                }
                            >

                                {selected ===
                                currentRound.answer ? (

                                    <>

                                        <span
                                            className=
                                                "feedback-icon"
                                        >
                                            ✨
                                        </span>


                                        <div>

                                            <strong>
                                                Perfect Potion!
                                            </strong>

                                            <p>
                                                Correct answer!
                                                Your magical potion
                                                is filling up.
                                            </p>

                                        </div>

                                    </>

                                ) : (

                                    <>

                                        <span
                                            className=
                                                "feedback-icon"
                                        >
                                            💡
                                        </span>


                                        <div>

                                            <strong>
                                                Good Try!
                                            </strong>

                                            <p>
                                                Think about the
                                                person's actions
                                                and try again.
                                            </p>

                                        </div>

                                    </>
                                )}

                            </div>

                        )}

                    </div>


                    {/* =============================
                        POTION LAB
                    ============================= */}

                    <div
                        className=
                            "personality-potion-lab-section"
                    >

                        <div
                            className=
                                "personality-potion-lab-title"
                        >
                            ✨ Fill Your Magic Potion! ✨
                        </div>


                        <div
                            className=
                                "personality-potion-tube-stage"
                        >


                            {/* =================================
                                FALLING POTION
                                MUST BE BEFORE TEST TUBE
                                ================================= */}

                            {isPouring && (

                                <img
                                    src={potionStream}

                                    alt=""

                                    className=
                                        "personality-potion-stream"
                                />

                            )}


                            {/* =================================
                                LIQUID MASK
                            ================================= */}

                            <div
                                className=
                                    "personality-potion-tube-inner-mask"
                            >

                                <div
                                    className=
                                        "personality-potion-liquid"

                                    style={{
                                        height:
                                            `${potionPercentage}%`,
                                    }}
                                >

                                    <div
                                        className=
                                            "personality-potion-liquid-shine"
                                    />


                                    <div
                                        className=
                                            "personality-potion-liquid-bubbles"
                                    >
                                        ✦ ✧ ✦
                                    </div>

                                </div>

                            </div>


                            {/* =================================
                                TEST TUBE
                                ================================= */}

                            <img
                                src={testTube}

                                alt="Magic test tube"

                                className=
                                    "personality-potion-test-tube"
                            />

                        </div>


                        {/* LEVEL */}

                        <div
                            className=
                                "personality-potion-level-text"
                        >

                            Potion:{" "}

                            {Math.round(
                                potionPercentage
                            )}%

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default PersonalityPotionActivity;