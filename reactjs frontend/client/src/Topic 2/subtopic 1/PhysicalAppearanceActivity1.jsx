import React, { useEffect, useRef, useState } from "react";

import teacher from "../../assets/teacher1.png";
import bg from "../../assets/chatbg.jpeg";
import yaySound from "../../assets/yay.mp3";

import confetti from "canvas-confetti";

import "./PhysicalAppearanceActivity1.css";

import aysha from "../../assets/aysha.jpeg";
import rohan from "../../assets/rohan.jpeg";
import maya from "../../assets/maya.jpeg";
import arjun from "../../assets/arjun.jpeg";

/* =====================================================
   CHARACTERS
===================================================== */

const characters = [
    {
        id: 1,
        name: "Aisha",
        image: aysha,
    },
    {
        id: 2,
        name: "Rohan",
        image: rohan,
    },
    {
        id: 3,
        name: "Maya",
        image: maya,
    },
    {
        id: 4,
        name: "Arjun",
        image: arjun,
    },
];

/* =====================================================
   ROUNDS
===================================================== */

const rounds = [
    {
        question: "Who has long hair?",
        answer: "Aisha",
        correctRemark:
            "Excellent! Aisha has long hair.",
    },
    {
        question: "Who has curly hair?",
        answer: "Rohan",
        correctRemark:
            "Excellent! Rohan has curly hair.",
    },
    {
    question: "Who has long hair and wears glasses?",
    answer: "Maya",
    correctRemark:
        "Excellent! Maya has long hair and wears glasses.",
},
    {
        question: "Who wears glasses?",
        answer: "Arjun",
        correctRemark:
            "Excellent! Arjun wears glasses.",
    },
    {  
        question: "Who has short hair?",
        answer: "Rohan",
        correctRemark:
            "Excellent! Rohan has short hair.",
    },
];


/* =====================================================
   DEFAULT TEACHER TEXT
===================================================== */

const DEFAULT_TEACHER_TEXT =
    "Look carefully and find the character with the feature in the question!";


/* =====================================================
   COMPONENT
===================================================== */

function PhysicalAppearanceActivity1({
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
===================================================== */

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
===================================================== */

    const playConfetti = () => {

        if (!isMountedRef.current) {
            return;
        }


        /* Stop old animation */

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
       CALLBACK ONLY AFTER AUDIO FINISHES
===================================================== */

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


        /* Reset */

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
       STOP ALL AUDIO / ANIMATION
===================================================== */

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
       YAY COMPLETE
          ↓
       TEACHER REMARK
          ↓
       REMARK COMPLETE
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


        /* Show remark immediately in bubble */

        setTeacherRemark(
            currentRound.correctRemark
        );


        /* =========================================
           CONFETTI
        ========================================= */

        playConfetti();


        /* =========================================
           YAY AUDIO
        ========================================= */

        playYaySound(() => {

            if (!isMountedRef.current) {
                return;
            }


            /* =====================================
               IMPORTANT:
               YAY FINISH HONE KE BAAD
               TEACHER BOLEGI
            ===================================== */

            speakTeacher(
                currentRound.correctRemark,
                () => {

                    if (
                        !isMountedRef.current
                    ) {
                        return;
                    }


                    /* =================================
                       TEACHER REMARK COMPLETE
                    ================================= */

                    speechTimeoutRef.current =
                        setTimeout(() => {

                            if (
                                !isMountedRef.current
                            ) {
                                return;
                            }


                            setCelebrating(false);


                            /* =============================
                               LAST ROUND
                            ============================= */

                            if (isLast) {

                                if (
                                    onFinish
                                ) {

                                    onFinish();

                                }

                                return;

                            }


                            /* =============================
                               NEXT ROUND
                            ============================= */

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
===================================================== */

    const handleWrongAnswer = () => {

        if (!isMountedRef.current) {
            return;
        }


        const wrongRemark =
            "Not quite! Look carefully and try again.";


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
===================================================== */

    const handleSelect = (
        character
    ) => {

        /* Lock during celebration */

        if (
            answered ||
            celebrating
        ) {

            return;

        }


        setSelected(
            character.name
        );


        /* =========================================
           CORRECT
        ========================================= */

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


        /* =========================================
           WRONG
        ========================================= */

        else {

            setAnswered(true);

            handleWrongAnswer();

        }

    };


    /* =================================================
       BACK BUTTON
===================================================== */

    const handleBack = () => {

        /* Don't allow during celebration */

        if (celebrating) {
            return;
        }


        /* Stop everything */

        stopAll();


        /* IMPORTANT:
           Go back to CALLING PAGE */

        if (
            typeof onBack ===
            "function"
        ) {

            onBack();

        }

    };


    /* =================================================
       SKIP BUTTON
===================================================== */

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
===================================================== */

    const getCharacterClass = (
        character
    ) => {

        let className =
            "physical-appearance-character-card";


        if (!answered) {
            return className;
        }


        const isCorrect =
            character.name ===
            currentRound.answer;


        const isSelected =
            character.name ===
            selected;


        /* Correct */

        if (isCorrect) {

            className +=
                " correct";

        }


        /* Wrong selected */

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
===================================================== */

    return (

        <div
            className=
                "physical-appearance-activity1-page"
            style={{
                backgroundImage:
                    `url(${bg})`,
            }}
        >

            {/* =========================================
                        OVERLAY
            ========================================= */}

            <div
                className=
                    "physical-appearance-activity1-overlay"
            />


            {/* =========================================
                        MAIN CARD
            ========================================= */}

            <div
                className=
                    "physical-appearance-activity1-card"
            >


                {/* =====================================
                            HEADER
                ===================================== */}

                <div
                    className=
                        "physical-appearance-activity1-header"
                >


                    {/* BACK */}

                    <div
                        className=
                            "physical-appearance-header-left"
                    >

                        <button
                            type="button"
                            className=
                                "physical-appearance-back-btn"
                            onClick={handleBack}
                            disabled={celebrating}
                        >
                            ← Back
                        </button>

                    </div>


                    {/* CENTER */}

                    <div
                        className=
                            "physical-appearance-header-center"
                    >

                        <h1>
                            🔎 Spot the Feature
                        </h1>

                        <span>
                            Physical Appearance • Activity 1
                        </span>

                    </div>


                    {/* RIGHT */}

                    <div
                        className=
                            "physical-appearance-header-right"
                    >

                        <button
                            type="button"
                            className=
                                "physical-appearance-skip-btn"
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
                        "physical-appearance-activity-content"
                >


                    {/* =================================
                                TEACHER
                    ================================= */}

                    <div
                        className=
                            "physical-appearance-teacher-section"
                    >

                        <div
                            className=
                                "physical-appearance-teacher-stage"
                        >

                            <img
                                src={teacher}
                                alt="Teacher"
                                className={
                                    isSpeaking
                                        ? "physical-appearance-teacher-img speaking"
                                        : "physical-appearance-teacher-img"
                                }
                            />

                        </div>


                        {/* TEACHER BUBBLE */}

                        <div
                            className=
                                "physical-appearance-teacher-bubble"
                        >

                            <div
                                className=
                                    "physical-appearance-teacher-name"
                            >
                                Miss Uroosa
                            </div>


                            <div
                                className=
                                    "physical-appearance-teacher-text"
                            >
                                {teacherRemark}
                            </div>

                        </div>


                        {/* ROUND + SCORE */}

                        <div
                            className=
                                "physical-appearance-teacher-stats"
                        >

                            <div
                                className=
                                    "physical-appearance-round-badge"
                            >
                                Round {round + 1} /{" "}
                                {rounds.length}
                            </div>


                            <div
                                className=
                                    "physical-appearance-score-badge"
                            >
                                ⭐ {score}
                            </div>

                        </div>

                    </div>


                    {/* =================================
                                RIGHT CONTENT
                    ================================= */}

                    <div
                        className=
                            "physical-appearance-main-section"
                    >


                        {/* QUESTION */}

                        <div
                            className=
                                "physical-appearance-question-card"
                        >

                            <div
                                className=
                                    "physical-appearance-question-label"
                            >
                                LOOK CAREFULLY!
                            </div>


                            <h2>
                                {currentRound.question}
                            </h2>


                            <p>
                                Choose the correct character.
                            </p>

                        </div>


                        {/* CHARACTER GRID */}

                        <div
                            className=
                                "physical-appearance-character-grid"
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

                                        <div
                                            className=
                                                "physical-appearance-character-picture"
                                        >

                                            <img
                                                src={
                                                    character.image
                                                }
                                                alt={
                                                    character.name
                                                }
                                            />

                                        </div>


                                        <div
                                            className=
                                                "physical-appearance-character-name"
                                        >
                                            {
                                                character.name
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
                                        ? "physical-appearance-feedback correct-feedback"
                                        : "physical-appearance-feedback wrong-feedback"
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
                                                Great job! You spotted
                                                the correct feature.
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
                                                Look carefully and try
                                                again.
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


export default PhysicalAppearanceActivity1;