import React, { useEffect, useRef, useState } from "react";

import teacher from "../../assets/teacher1.png";
import bg from "../../assets/chatbg.jpeg";
import yaySound from "../../assets/yay.mp3";

import confetti from "canvas-confetti";
import "./TraitDetectiveActivity.css";


/* =====================================================
   PERSONALITY TRAITS
   TRAIT DETECTIVE - CHARACTERS
===================================================== */

const characters = [
    {
        id: 1,
        name: "Aisha",
        emoji: "🌸",
        trait: "Kind",
        meaning: "Helps others",
    },
    {
        id: 2,
        name: "Rohan",
        emoji: "🦁",
        trait: "Brave",
        meaning: "Tries new things",
    },
    {
        id: 3,
        name: "Maya",
        emoji: "📚",
        trait: "Quiet",
        meaning: "Enjoys calm activities",
    },
    {
        id: 4,
        name: "Arjun",
        emoji: "🎨",
        trait: "Creative",
        meaning: "Loves making new things",
    },
];


/* =====================================================
   TRAIT GUIDE
===================================================== */

const traitGuide = [
    {
        id: 1,
        emoji: "🌸",
        trait: "Kind",
        meaning: "Helps others",
    },
    {
        id: 2,
        emoji: "🦁",
        trait: "Brave",
        meaning: "Tries new things",
    },
    {
        id: 3,
        emoji: "📚",
        trait: "Quiet",
        meaning: "Enjoys calm activities",
    },
    {
        id: 4,
        emoji: "🎨",
        trait: "Creative",
        meaning: "Loves making new things",
    },
];


/* =====================================================
   ROUNDS
===================================================== */

const rounds = [
    {
        question: "Who is kind and helps friends?",
        answer: "Aisha",
        correctRemark:
            "Excellent! Aisha is kind and loves helping her friends.",
    },

    {
        question: "Who is brave and tries new things?",
        answer: "Rohan",
        correctRemark:
            "Excellent! Rohan is brave and loves trying new things.",
    },

    {
        question: "Who is quiet and enjoys calm activities?",
        answer: "Maya",
        correctRemark:
            "Excellent! Maya is quiet and enjoys calm activities.",
    },

    {
        question: "Who is creative and loves making new things?",
        answer: "Arjun",
        correctRemark:
            "Excellent! Arjun is creative and loves making new things.",
    },
];


/* =====================================================
   DEFAULT TEACHER TEXT
===================================================== */

const DEFAULT_TEACHER_TEXT =
    "Read the clue carefully and find the character whose personality matches it!";


/* =====================================================
   COMPONENT
===================================================== */

function TraitDetectiveActivity({
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
       MOUNT / UNMOUNT
    ================================================= */

    useEffect(() => {

        isMountedRef.current = true;

        const audio = new Audio(yaySound);

        audio.preload = "auto";

        yayAudioRef.current = audio;


        return () => {

            isMountedRef.current = false;


            /* Stop speech */

            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }


            /* Stop timeout */

            if (speechTimeoutRef.current) {

                clearTimeout(
                    speechTimeoutRef.current
                );

                speechTimeoutRef.current = null;

            }


            /* Stop confetti */

            if (confettiFrameRef.current) {

                cancelAnimationFrame(
                    confettiFrameRef.current
                );

                confettiFrameRef.current = null;

            }


            /* Stop yay */

            if (yayAudioRef.current) {

                yayAudioRef.current.pause();

                yayAudioRef.current.currentTime = 0;

                yayAudioRef.current.onended = null;

                yayAudioRef.current.onerror = null;

            }

        };

    }, []);


    /* =================================================
       LOAD BROWSER VOICES
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
       GET FEMALE TEACHER VOICE
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

            } else {

                confettiFrameRef.current = null;

            }

        };


        frame();

    };


    /* =================================================
       YAY AUDIO
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


        if (
            playPromise !== undefined
        ) {

            playPromise.catch(() => {
                finishSound();
            });

        }

    };


    /* =================================================
       STOP ALL
    ================================================= */

    const stopAll = () => {

        /* Speech */

        if (window.speechSynthesis) {

            window.speechSynthesis.cancel();

        }


        /* Timeout */

        if (speechTimeoutRef.current) {

            clearTimeout(
                speechTimeoutRef.current
            );

            speechTimeoutRef.current = null;

        }


        /* Yay */

        if (yayAudioRef.current) {

            yayAudioRef.current.pause();

            yayAudioRef.current.currentTime = 0;

            yayAudioRef.current.onended = null;

            yayAudioRef.current.onerror = null;

        }


        /* Confetti */

        if (confettiFrameRef.current) {

            cancelAnimationFrame(
                confettiFrameRef.current
            );

            confettiFrameRef.current = null;

        }


        setIsSpeaking(false);

        setCelebrating(false);

    };


    /* =================================================
       CORRECT ANSWER CELEBRATION

       CORRECT
          ↓
       CONFETTI + YAY
          ↓
       TEACHER REMARK
          ↓
       NEXT ROUND
===================================================== */

    const celebrateCorrectAnswer = () => {

        if (!isMountedRef.current) {
            return;
        }


        const isLast =
            round === rounds.length - 1;


        setCelebrating(true);

        setAnswered(true);


        /* Show correct remark */

        setTeacherRemark(
            currentRound.correctRemark
        );


        /* Confetti */

        playConfetti();


        /* Yay */

        playYaySound(() => {

            if (!isMountedRef.current) {
                return;
            }


            speakTeacher(
                currentRound.correctRemark,
                () => {

                    if (
                        !isMountedRef.current
                    ) {
                        return;
                    }


                    speechTimeoutRef.current =
                        setTimeout(() => {

                            if (
                                !isMountedRef.current
                            ) {
                                return;
                            }


                            setCelebrating(false);


                            /* LAST ROUND */

                            if (isLast) {

                                if (
                                    typeof onFinish ===
                                    "function"
                                ) {

                                    onFinish();

                                }

                                return;

                            }


                            /* NEXT ROUND */

                            setRound(
                                (prev) =>
                                    prev + 1
                            );

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
            "Not quite! Think about the personality clue and try again.";


        setTeacherRemark(
            wrongRemark
        );


        speakTeacher(
            wrongRemark,
            () => {

                if (
                    !isMountedRef.current
                ) {
                    return;
                }


                speechTimeoutRef.current =
                    setTimeout(() => {

                        if (
                            !isMountedRef.current
                        ) {
                            return;
                        }


                        setSelected(null);

                        setAnswered(false);

                        setTeacherRemark(
                            DEFAULT_TEACHER_TEXT
                        );

                        speechTimeoutRef.current =
                            null;

                    }, 200);

            }
        );

    };


    /* =================================================
       SELECT CHARACTER
    ================================================= */

    const handleSelect = (
        character
    ) => {

        if (
            answered ||
            celebrating
        ) {
            return;
        }


        setSelected(
            character.name
        );


        /* =============================================
           CORRECT
        ============================================= */

        if (
            character.name ===
            currentRound.answer
        ) {

            setScore(
                (prev) =>
                    prev + 1
            );


            celebrateCorrectAnswer();

        }


        /* =============================================
           WRONG
        ============================================= */

        else {

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
       CHARACTER CLASS
    ================================================= */

    const getCharacterClass = (
        character
    ) => {

        let className =
            "trait-detective-character-card";


        if (!answered) {
            return className;
        }


        const isCorrect =
            character.name ===
            currentRound.answer;


        const isSelected =
            character.name ===
            selected;


        /* Correct character */

        if (isCorrect) {

            className +=
                " correct";

        }


        /* Wrong selected character */

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
                "trait-detective-activity1-page"
            style={{
                backgroundImage:
                    `url(${bg})`,
            }}
        >

            {/* =========================================
                        BACKGROUND OVERLAY
            ========================================= */}

            <div
                className=
                    "trait-detective-activity1-overlay"
            />


            {/* =========================================
                        MAIN CARD
            ========================================= */}

            <div
                className=
                    "trait-detective-activity1-card"
            >


                {/* =====================================
                            HEADER
                ===================================== */}

                <div
                    className=
                        "trait-detective-activity1-header"
                >

                    {/* BACK */}

                    <div
                        className=
                            "trait-detective-header-left"
                    >

                        <button
                            type="button"
                            className=
                                "trait-detective-back-btn"
                            onClick={handleBack}
                            disabled={celebrating}
                        >
                            ← Back
                        </button>

                    </div>


                    {/* CENTER */}

                    <div
                        className=
                            "trait-detective-header-center"
                    >

                        <h1>
                            🔎 Trait Detective
                        </h1>

                        <span>
                            Personality Traits • Activity 1
                        </span>

                    </div>


                    {/* RIGHT */}

                    <div
                        className=
                            "trait-detective-header-right"
                    >

                        <button
                            type="button"
                            className=
                                "trait-detective-skip-btn"
                            onClick={handleSkip}
                            disabled={celebrating}
                        >
                            Skip →
                        </button>

                    </div>

                </div>


                {/* =====================================
                        ACTIVITY CONTENT
                ===================================== */}

                <div
                    className=
                        "trait-detective-activity-content"
                >


                    {/* =================================
                            TEACHER SECTION
                    ================================= */}

                    <div
                        className=
                            "trait-detective-teacher-section"
                    >

                        <div
                            className=
                                "trait-detective-teacher-stage"
                        >

                            <img
                                src={teacher}
                                alt="Miss Uroosa"
                                className={
                                    isSpeaking
                                        ? "trait-detective-teacher-img speaking"
                                        : "trait-detective-teacher-img"
                                }
                            />

                        </div>


                        {/* TEACHER BUBBLE */}

                        <div
                            className=
                                "trait-detective-teacher-bubble"
                        >

                            <div
                                className=
                                    "trait-detective-teacher-name"
                            >
                                Miss Uroosa
                            </div>


                            <div
                                className=
                                    "trait-detective-teacher-text"
                            >
                                {teacherRemark}
                            </div>

                        </div>


                        {/* ROUND + SCORE */}

                        <div
                            className=
                                "trait-detective-teacher-stats"
                        >

                            <div
                                className=
                                    "trait-detective-round-badge"
                            >
                                Round {round + 1} /{" "}
                                {rounds.length}
                            </div>


                            <div
                                className=
                                    "trait-detective-score-badge"
                            >
                                ⭐ {score}
                            </div>

                        </div>

                    </div>


                    {/* =================================
                            MAIN ACTIVITY
                    ================================= */}

                    <div
                        className=
                            "trait-detective-main-section"
                    >


                        {/* =================================
                                CLUE CARD
                        ================================= */}

                        <div
                            className=
                                "trait-detective-question-card"
                        >

                            <div
                                className=
                                    "trait-detective-question-label"
                            >
                                🔎 CLUE
                            </div>


                            <h2>
                                {currentRound.question}
                            </h2>

                        </div>


                        {/* =================================
                            CHARACTER TITLE
                        ================================= */}

                        <div
                            className=
                                "trait-detective-character-heading"
                        >
                            CHARACTER CARDS
                        </div>


                        {/* =================================
                            CHARACTER GRID
                        ================================= */}

                        <div
                            className=
                                "trait-detective-character-grid"
                        >

                            {characters.map(
                                (character) => (

                                    <button
                                        key={
                                            character.id
                                        }
                                        type="button"
                                        className={
                                            getCharacterClass(
                                                character
                                            )
                                        }
                                        onClick={() =>
                                            handleSelect(
                                                character
                                            )
                                        }
                                        disabled={
                                            answered ||
                                            celebrating
                                        }
                                    >

                                        {/* CHARACTER VISUAL */}

                                        <div
                                            className=
                                                "trait-detective-character-icon"
                                        >
                                            {
                                                character.emoji
                                            }
                                        </div>


                                        {/* NAME */}

                                        <div
                                            className=
                                                "trait-detective-character-name"
                                        >
                                            {
                                                character.name
                                            }
                                        </div>


                                        {/* TRAIT */}

                                        <div
                                            className=
                                                "trait-detective-character-trait"
                                        >
                                            {
                                                character.trait
                                            }
                                        </div>

                                    </button>

                                )
                            )}

                        </div>


                        {/* =================================
                                TRAIT GUIDE
                        ================================= */}

                        <div
                            className=
                                "trait-detective-guide-card"
                        >

                            <div
                                className=
                                    "trait-detective-guide-title"
                            >
                                TRAIT GUIDE
                            </div>


                            <div
                                className=
                                    "trait-detective-guide-list"
                            >

                                {traitGuide.map(
                                    (trait) => (

                                        <div
                                            key={
                                                trait.id
                                            }
                                            className=
                                                "trait-detective-guide-item"
                                        >

                                            <span
                                                className=
                                                    "trait-detective-guide-emoji"
                                            >
                                                {
                                                    trait.emoji
                                                }
                                            </span>


                                            <span
                                                className=
                                                    "trait-detective-guide-trait"
                                            >
                                                {
                                                    trait.trait
                                                }
                                            </span>


                                            <span
                                                className=
                                                    "trait-detective-guide-arrow"
                                            >
                                                →
                                            </span>


                                            <span
                                                className=
                                                    "trait-detective-guide-meaning"
                                            >
                                                {
                                                    trait.meaning
                                                }
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>


                        {/* =================================
                                FEEDBACK
                        ================================= */}

                        {answered && (

                            <div
                                className={
                                    selected ===
                                    currentRound.answer
                                        ? "trait-detective-feedback correct-feedback"
                                        : "trait-detective-feedback wrong-feedback"
                                }
                            >

                                {selected ===
                                currentRound.answer ? (

                                    <>

                                        <span
                                            className=
                                                "feedback-icon"
                                        >
                                            🎉
                                        </span>


                                        <div>

                                            <strong>
                                                Excellent!
                                            </strong>

                                            <p>
                                                Great job! You
                                                found the right
                                                personality trait.
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
                                                clue and try again.
                                            </p>

                                        </div>

                                    </>

                                )}

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>

    );

}


export default TraitDetectiveActivity;