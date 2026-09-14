import React, { useEffect, useState, useRef } from "react";

import teacher from "./assets/teacher1.png";
import bg from "./assets/chatbg.jpeg";
import yaySound from "./assets/yay.mp3";

import confetti from "canvas-confetti";


function RestaurantQuizActivity({
    onBack,
    onNext,
    onSkip
}) {

    /* ==========================================
                    QUIZ QUESTIONS
    ========================================== */

    const quizQuestions = [

        {
            question:
                "A waiter asks, 'Are you ready to order?' What is the most appropriate reply?",

            options: [
                "Yes, I'd like the grilled sandwich and orange juice, please.",
                "I like football.",
                "My name is Alex.",
                "See you tomorrow."
            ],

            answer:
                "Yes, I'd like the grilled sandwich and orange juice, please."
        },

        {
            question:
                "Which sentence is the most polite when asking for the bill?",

            options: [
                "Bill!",
                "Bring the bill.",
                "Could we have the bill, please?",
                "Give me the bill now."
            ],

            answer:
                "Could we have the bill, please?"
        },

        {
            question:
                "The waiter says, 'Would you like anything to drink?' Which reply is best?",

            options: [
                "Yes, I'd like a glass of lemonade, please.",
                "I am twelve years old.",
                "My favorite color is blue.",
                "I play cricket."
            ],

            answer:
                "Yes, I'd like a glass of lemonade, please."
        },

        {
            question:
                "What should you say if the waiter serves your food?",

            options: [
                "Thank you very much.",
                "Go away.",
                "You're wrong.",
                "Nothing."
            ],

            answer:
                "Thank you very much."
        },

        {
            question:
                "Your order is incorrect. Which response is polite?",

            options: [
                "Excuse me, I ordered pasta instead of pizza.",
                "This is terrible!",
                "Take it away!",
                "You don't know anything."
            ],

            answer:
                "Excuse me, I ordered pasta instead of pizza."
        }

    ];


    /* ==========================================
                    STATES
    ========================================== */

    const [current, setCurrent] = useState(0);

    const [selected, setSelected] = useState("");

    const [feedback, setFeedback] = useState("");

    const [completed, setCompleted] = useState(false);

    const [isSpeaking, setIsSpeaking] = useState(false);

    /*
        CELEBRATING = correct answer ke baad
        poora celebration sequence chal raha hai.
    */
    const [celebrating, setCelebrating] = useState(false);


    /* ==========================================
                    REFS
    ========================================== */

    const speechTimerRef = useRef(null);

    const confettiFrameRef = useRef(null);

    const isMountedRef = useRef(true);


    /* ==========================================
                    MOUNT / UNMOUNT
    ========================================== */

    useEffect(() => {

        isMountedRef.current = true;

        return () => {

            isMountedRef.current = false;

            window.speechSynthesis.cancel();

            if (speechTimerRef.current) {

                clearTimeout(
                    speechTimerRef.current
                );

            }

            if (confettiFrameRef.current) {

                cancelAnimationFrame(
                    confettiFrameRef.current
                );

            }

        };

    }, []);


    /* ==========================================
                BROWSER VOICES LOAD
    ========================================== */

    useEffect(() => {

        if (!window.speechSynthesis) return;

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


    /* ==========================================
                    FEMALE VOICE
    ========================================== */

    const getFemaleVoice = () => {

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

            null

        );

    };


    /* ==========================================
                    TEACHER SPEAK
    ========================================== */

    const speakTeacher = (
        text,
        callback
    ) => {

        if (!window.speechSynthesis) {

            if (callback) callback();

            return;

        }


        window.speechSynthesis.cancel();


        const speech =
            new SpeechSynthesisUtterance(text);


        speech.lang = "en-US";

        speech.rate = 0.88;

        speech.pitch = 1.05;

        speech.volume = 1;


        const femaleVoice =
            getFemaleVoice();


        if (femaleVoice) {

            speech.voice = femaleVoice;

        }


        speech.onstart = () => {

            if (!isMountedRef.current) return;

            setIsSpeaking(true);

        };


        speech.onend = () => {

            if (!isMountedRef.current) return;

            setIsSpeaking(false);

            if (callback) {

                callback();

            }

        };


        speech.onerror = () => {

            if (!isMountedRef.current) return;

            setIsSpeaking(false);

            if (callback) {

                callback();

            }

        };


        window.speechSynthesis.speak(speech);

    };


    /* ==========================================
                    QUESTION SPEAK
    ========================================== */

    const speakQuestion = (text) => {

        if (!window.speechSynthesis) return;


        window.speechSynthesis.cancel();


        const speech =
            new SpeechSynthesisUtterance(text);


        speech.lang = "en-US";

        speech.rate = 0.88;

        speech.pitch = 1.05;

        speech.volume = 1;


        const femaleVoice =
            getFemaleVoice();


        if (femaleVoice) {

            speech.voice = femaleVoice;

        }


        speech.onstart = () => {

            if (!isMountedRef.current) return;

            setIsSpeaking(true);

        };


        speech.onend = () => {

            if (!isMountedRef.current) return;

            setIsSpeaking(false);

        };


        speech.onerror = () => {

            if (!isMountedRef.current) return;

            setIsSpeaking(false);

        };


        window.speechSynthesis.speak(speech);

    };


    /* ==========================================
                    CONFETTI
    ========================================== */

    const playConfetti = (onComplete) => {

        if (!isMountedRef.current) return;


        const duration = 1800;

        const end = Date.now() + duration;


        const frame = () => {

            if (!isMountedRef.current) return;


            confetti({

                particleCount: 5,

                spread: 70,

                startVelocity: 35,

                origin: {

                    x: Math.random(),

                    y: Math.random() * 0.5

                }

            });


            if (Date.now() < end) {

                confettiFrameRef.current =
                    requestAnimationFrame(frame);

            }

            else {

                confettiFrameRef.current =
                    null;


                if (
                    isMountedRef.current &&
                    onComplete
                ) {

                    onComplete();

                }

            }

        };


        frame();

    };


    /* ==========================================
                PLAY YAY SOUND
                SOUND COMPLETE HONE KA WAIT
    ========================================== */

    const playYaySound = (callback) => {

        if (!isMountedRef.current) return;


        const audio =
            new Audio(yaySound);


        audio.volume = 1;


        let finished = false;


        const finishSound = () => {

            if (finished) return;

            finished = true;


            audio.onended = null;

            audio.onerror = null;

            audio.onpause = null;


            if (
                isMountedRef.current &&
                callback
            ) {

                callback();

            }

        };


        /*
            IMPORTANT:
            Sirf onended par teacher voice
            start hogi.

            Matlab yay.mp3 completely finish
            hone ke baad hi teacher bolegi.
        */

        audio.onended = finishSound;

        audio.onerror = finishSound;


        audio.play().catch(() => {

            finishSound();

        });

    };


    /* ==========================================
            CORRECT ANSWER CELEBRATION
    ========================================== */

    const celebrateCorrectAnswer = () => {

        if (!isMountedRef.current) return;


        const isLast =
            current === quizQuestions.length - 1;


        setCelebrating(true);


        /*
            =====================================
            STEP 1
            CONFETTI START
            =====================================
        */

        playConfetti();


        /*
            =====================================
            STEP 2
            YAY SOUND START
            =====================================

            Teacher voice abhi START nahi hogi.

            Yay sound completely finish hone ke
            baad hi teacher feedback chalega.
        */

        playYaySound(() => {

            if (!isMountedRef.current) return;


            /*
                =================================
                STEP 3
                TEACHER EXCELLENT VOICE
                =================================
            */

            speakTeacher(

                "Excellent! That's correct.",

                () => {

                    if (!isMountedRef.current)
                        return;


                    /*
                        =================================
                        STEP 4
                        TEACHER VOICE COMPLETE
                        =================================
                    */

                    speechTimerRef.current =
                        setTimeout(() => {

                            if (
                                !isMountedRef.current
                            ) return;


                            setCelebrating(false);


                            /*
                                =================================
                                LAST QUESTION
                                =================================
                            */

                            if (isLast) {

                                setCompleted(true);

                                return;

                            }


                            /*
                                =================================
                                NEXT QUESTION
                                =================================
                            */

                            setCurrent(
                                prev => prev + 1
                            );

                            setSelected("");

                            setFeedback("");

                        }, 200);

                }

            );

        });

    };


    /* ==========================================
                FIRST QUESTION / NEXT QUESTION
    ========================================== */

    useEffect(() => {

        if (completed) return;


        setSelected("");

        setFeedback("");

        setCelebrating(false);


        speakQuestion(
            quizQuestions[current].question
        );


        return () => {

            window.speechSynthesis.cancel();


            if (speechTimerRef.current) {

                clearTimeout(
                    speechTimerRef.current
                );

            }

        };

    }, [current, completed]);


    /* ==========================================
                    LISTEN AGAIN
    ========================================== */

    const handleListenAgain = () => {

        /*
            Celebration ke waqt
            Listen Again allowed nahi.
        */

        if (celebrating) return;


        speakQuestion(
            quizQuestions[current].question
        );

    };


    /* ==========================================
                    HANDLE ANSWER
    ========================================== */

    const handleAnswer = (option) => {

        /*
            Important:

            Agar:
            - already selected hai
            - celebration chal rahi hai

            to kuch bhi nahi hoga.
        */

        if (
            selected !== "" ||
            celebrating
        ) {

            return;

        }


        setSelected(option);


        /* ==========================================
                    CORRECT ANSWER
        ========================================== */

        if (
            option ===
            quizQuestions[current].answer
        ) {

            setFeedback("correct");


            /*
                Ab complete sequence:

                Correct
                  ↓
                Confetti + YAY
                  ↓
                YAY COMPLETE
                  ↓
                Teacher: Excellent
                  ↓
                Teacher voice COMPLETE
                  ↓
                Next Question
            */

            celebrateCorrectAnswer();

        }


        /* ==========================================
                    WRONG ANSWER
        ========================================== */

        else {

            setFeedback("wrong");


            /*
                Wrong answer par
                sirf teacher bolegi.
            */

            speakTeacher(

                "Not quite! Try again.",

                () => {

                    if (
                        !isMountedRef.current
                    ) return;


                    speechTimerRef.current =
                        setTimeout(() => {

                            if (
                                !isMountedRef.current
                            ) return;


                            setSelected("");

                            setFeedback("");

                        }, 200);

                }

            );

        }

    };


    /* ==========================================
                STOP EVERYTHING
    ========================================== */

    const stopEverything = () => {

        window.speechSynthesis.cancel();


        if (speechTimerRef.current) {

            clearTimeout(
                speechTimerRef.current
            );

            speechTimerRef.current = null;

        }


        if (confettiFrameRef.current) {

            cancelAnimationFrame(
                confettiFrameRef.current
            );

            confettiFrameRef.current = null;

        }


        setCelebrating(false);

        setIsSpeaking(false);

    };


    /* ==========================================
                    OPTION CLASS
    ========================================== */

    const getOptionClass = (option) => {

        let className =
            "quiz-option";


        if (selected === "") {

            return className;

        }


        if (
            option ===
            quizQuestions[current].answer
        ) {

            className += " correct";

        }

        else if (option === selected) {

            className += " wrong";

        }


        return className;

    };


    /* ==========================================
                    BACK
    ========================================== */

    const handleBack = () => {

        stopEverything();

        onBack();

    };


    /* ==========================================
                    SKIP
    ========================================== */

    const handleSkip = () => {

        /*
            Celebration ke beech Skip nahi chalega.
        */

        if (celebrating) return;


        stopEverything();

        onSkip();

    };


    /* ==========================================
                COMPLETION SCREEN
    ========================================== */

    if (completed) {

        return (

            <div
                className="quiz-page"
                style={{
                    backgroundImage:
                        `url(${bg})`
                }}
            >

                <div className="quiz-overlay"></div>


                <div className="quiz-card">


                    <div className="quiz-complete">


                        <div className="quiz-complete-icon">

                            🎉

                        </div>


                        <h2>

                            Restaurant Quiz Completed!

                        </h2>


                        <p>

                            Amazing work!
                            You completed all the
                            restaurant quiz questions.
                            Keep practicing your English
                            conversation skills!

                        </p>


                        <button
                            className="quiz-next-btn"
                            onClick={() => {

                                stopEverything();

                                onNext();

                            }}
                        >

                            Next Activity →

                        </button>


                    </div>

                </div>

            </div>

        );

    }


    /* ==========================================
                MAIN QUIZ PAGE
    ========================================== */

    return (

        <div
            className="quiz-page"
            style={{
                backgroundImage:
                    `url(${bg})`
            }}
        >

            <div className="quiz-overlay"></div>


            <div className="quiz-card">


                {/* ======================================
                            HEADER
                ====================================== */}

                <div className="quiz-header">


                    <button
                        className="quiz-back-btn"
                        onClick={handleBack}
                        disabled={celebrating}
                    >

                        ← Back

                    </button>


                    <h1>

                        Restaurant Quiz

                    </h1>


                    <button
                        className="quiz-skip-btn"
                        onClick={handleSkip}
                        disabled={celebrating}
                    >

                        Skip →

                    </button>


                </div>


                {/* ======================================
                            PROGRESS
                ====================================== */}

                <div className="quiz-progress">

                    Question {current + 1} /{" "}
                    {quizQuestions.length}

                </div>


                {/* ======================================
                            CONTENT
                ====================================== */}

                <div className="quiz-content">


                    {/* ==================================
                                TEACHER
                    ================================== */}

                    <div className="quiz-left">

                        <img
                            src={teacher}
                            alt="Teacher"
                            className={
                                isSpeaking
                                    ? "quiz-teacher speaking"
                                    : "quiz-teacher"
                            }
                        />

                    </div>


                    {/* ==================================
                                RIGHT SIDE
                    ================================== */}

                    <div className="quiz-right">


                        {/* ==================================
                                QUESTION BOX
                        ================================== */}

                        <div className="quiz-question-box">


                            <h3>

                                Listen Carefully

                            </h3>


                            <h2>

                                {
                                    quizQuestions[current]
                                        .question
                                }

                            </h2>


                            {/* ==================================
                                    LISTEN AGAIN
                            ================================== */}

                            <button
                                className="quiz-listen-btn"
                                onClick={handleListenAgain}
                                disabled={
                                    isSpeaking ||
                                    celebrating
                                }
                            >

                                🔊 Listen Again

                            </button>


                        </div>


                        {/* ==================================
                                OPTIONS
                        ================================== */}

                        <div className="quiz-options">


                            {
                                quizQuestions[
                                    current
                                ].options.map(

                                    (option, index) => (

                                        <button
                                            key={index}
                                            className={
                                                getOptionClass(
                                                    option
                                                )
                                            }
                                            onClick={() =>
                                                handleAnswer(
                                                    option
                                                )
                                            }
                                            disabled={
                                                selected !== "" ||
                                                celebrating
                                            }
                                        >

                                            {option}

                                        </button>

                                    )

                                )}


                        </div>


                        {/* ==================================
                                CORRECT FEEDBACK
                        ================================== */}

                        {feedback === "correct" && (

                            <div className="quiz-feedback success">

                                ✅ Excellent! That's correct!

                            </div>

                        )}


                        {/* ==================================
                                WRONG FEEDBACK
                        ================================== */}

                        {feedback === "wrong" && (

                            <div className="quiz-feedback error">

                                ❌ Not quite! Try again.

                            </div>

                        )}


                    </div>

                </div>


            </div>

        </div>

    );

}


export default RestaurantQuizActivity;