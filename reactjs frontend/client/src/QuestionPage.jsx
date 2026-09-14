import React, { useState, useEffect, useRef } from "react";

import teacher from "./assets/teacher1.png";
import laddu from "./assets/laddu.jpg";
import panipuri from "./assets/panipuri.jpg";
import yaySound from "./assets/yay.mp3";

import confetti from "canvas-confetti";

function QuestionPage({
    question,
    onNext,
    onSkip,
    onBack,
    currentQuestion,
    totalQuestions
}) {

    const [feedback, setFeedback] = useState("");
    const [builtWord, setBuiltWord] = useState("");
    const [usedLetters, setUsedLetters] = useState([]);
    const [teacherText, setTeacherText] = useState("");

    const yayAudioRef = useRef(null);
    const isMountedRef = useRef(true);
    const nextTimeoutRef = useRef(null);


    /* =========================
       RESET / CLEANUP
    ========================= */

    useEffect(() => {

        isMountedRef.current = true;

        return () => {

            isMountedRef.current = false;

            window.speechSynthesis.cancel();

            if (yayAudioRef.current) {
                yayAudioRef.current.pause();
                yayAudioRef.current.currentTime = 0;
            }

            if (nextTimeoutRef.current) {
                clearTimeout(nextTimeoutRef.current);
            }

        };

    }, []);


    /* =========================
       RESET WHEN QUESTION CHANGES
    ========================= */

    useEffect(() => {

        setFeedback("");
        setBuiltWord("");
        setUsedLetters([]);
        setTeacherText("");

        window.speechSynthesis.cancel();

        if (yayAudioRef.current) {

            yayAudioRef.current.pause();
            yayAudioRef.current.currentTime = 0;

        }

    }, [question]);


    /* =========================
       IMAGES
    ========================= */

    const images = {
        "laddu.jpg": laddu,
        "panipuri.jpg": panipuri
    };


    /* =========================
       TEACHER VOICE
    ========================= */

    const speak = (text, callback) => {

        if (!window.speechSynthesis) {

            if (callback) {
                callback();
            }

            return;

        }

        window.speechSynthesis.cancel();

        const speech =
            new SpeechSynthesisUtterance(text);

        speech.rate = 0.9;
        speech.pitch = 1.15;
        speech.volume = 1;
        speech.lang = "en-US";

        const voices =
            window.speechSynthesis.getVoices();

        const femaleVoice =

            voices.find(v =>
                /Google UK English Female/i.test(
                    v.name
                )
            )

            ||

            voices.find(v =>
                /Google US English/i.test(
                    v.name
                )
            )

            ||

            voices.find(v =>
                /Zira/i.test(
                    v.name
                )
            )

            ||

            voices.find(v =>
                /Samantha/i.test(
                    v.name
                )
            )

            ||

            voices.find(v =>
                /Microsoft.*Jenny/i.test(
                    v.name
                )
            )

            ||

            voices.find(v =>
                /Microsoft.*Aria/i.test(
                    v.name
                )
            )

            ||

            voices.find(v =>
                /female/i.test(
                    v.name
                )
            );


        if (femaleVoice) {

            speech.voice = femaleVoice;

        }


        speech.onstart = () => {

            if (!isMountedRef.current) return;

        };


        speech.onend = () => {

            if (!isMountedRef.current) return;

            if (callback) {
                callback();
            }

        };


        speech.onerror = () => {

            if (!isMountedRef.current) return;

            if (callback) {
                callback();
            }

        };


        window.speechSynthesis.speak(speech);

    };


    /* =========================
       CANVAS CONFETTI
    ========================= */

    const playConfetti = () => {

        if (!isMountedRef.current) return;

        const duration = 1800;
        const end = Date.now() + duration;

        const frame = () => {

            if (!isMountedRef.current) return;

            confetti({
                particleCount: 6,
                spread: 75,
                startVelocity: 35,
                origin: {
                    x: Math.random(),
                    y: Math.random() * 0.55
                }
            });

            if (Date.now() < end) {

                requestAnimationFrame(frame);

            }

        };

        frame();

    };


    /* =========================
       YAY SOUND
    ========================= */

    const playYaySound = (callback) => {

        if (!isMountedRef.current) return;

        if (yayAudioRef.current) {

            yayAudioRef.current.pause();
            yayAudioRef.current.currentTime = 0;

        }


        const audio =
            new Audio(yaySound);

        yayAudioRef.current = audio;

        audio.volume = 1;


        audio.onended = () => {

            if (!isMountedRef.current) return;

            yayAudioRef.current = null;

            if (callback) {
                callback();
            }

        };


        audio.onerror = () => {

            if (!isMountedRef.current) return;

            yayAudioRef.current = null;

            if (callback) {
                callback();
            }

        };


        audio.play().catch(() => {

            if (!isMountedRef.current) return;

            yayAudioRef.current = null;

            if (callback) {
                callback();
            }

        });

    };


    /* =========================
       CORRECT REACTION
    ========================= */

    const correctReaction = () => {

        if (!isMountedRef.current) return;


        const reactions = [
            "Amazing!",
            "Excellent!",
            "Wonderful!"
        ];


        const random =
            reactions[
                Math.floor(
                    Math.random() * reactions.length
                )
            ];


        setTeacherText(random);
        setFeedback("correct");


        /*
            ======================================
            STEP 1
            CONFETTI + YAY SOUND
            ======================================
        */

        playConfetti();


        playYaySound(() => {

            if (!isMountedRef.current) return;


            /*
                ==================================
                STEP 2
                YAY SOUND COMPLETE
                THEN TEACHER SPEAKS
                ==================================
            */

            speak(random, () => {

                if (!isMountedRef.current) return;


                /*
                    ==================================
                    STEP 3
                    TEACHER VOICE COMPLETE
                    THEN NEXT QUESTION
                    ==================================
                */

                nextTimeoutRef.current =
                    setTimeout(() => {

                        if (!isMountedRef.current)
                            return;

                        onNext();

                    }, 300);

            });

        });

    };


    /* =========================
       WRONG
    ========================= */

    const wrongReaction = () => {

        if (!isMountedRef.current) return;

        setTeacherText(
            "No... Try again!"
        );

        setFeedback("wrong");

        speak(
            "No... Try again!"
        );

    };


    /* =========================
       OPTION CLICK
    ========================= */

    const handleOptionClick = (option) => {

        if (
            feedback === "correct"
        ) {

            return;

        }


        if (option.isCorrect) {

            correctReaction();

        }

        else {

            wrongReaction();

        }

    };


    /* =========================
       SPEECH PRACTICE
    ========================= */

    const startPractice = () => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if (!SpeechRecognition) {

            alert(
                "Speech Recognition Not Supported"
            );

            return;

        }


        const recognition =
            new SpeechRecognition();


        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;


        recognition.start();


        recognition.onresult = (event) => {

            const spokenWord =
                event.results[0][0]
                    .transcript
                    .toLowerCase()
                    .trim();


            const correctWord =
                question.practice.expectedAnswer
                    .toLowerCase()
                    .trim();


            if (
                spokenWord.includes(
                    correctWord
                )
            ) {

                correctReaction();

            }

            else {

                wrongReaction();

            }

        };

    };


    /* =========================
       WORD BUILDER
    ========================= */

    const handleLetterClick = (
        letter,
        index
    ) => {

        if (
            usedLetters.includes(index)
        ) {

            return;

        }


        const newWord =
            builtWord + letter;


        setBuiltWord(newWord);


        setUsedLetters([
            ...usedLetters,
            index
        ]);


        if (
            newWord ===
            question.wordBuilder.answer
        ) {

            correctReaction();

        }

    };


    const resetWord = () => {

        setBuiltWord("");
        setUsedLetters([]);

    };


    /* =========================
       PROGRESS
    ========================= */

    const progress =
        (currentQuestion / totalQuestions) * 100;


    /* =========================
       BACK
    ========================= */

    const handleBack = () => {

        window.speechSynthesis.cancel();

        if (yayAudioRef.current) {

            yayAudioRef.current.pause();
            yayAudioRef.current.currentTime = 0;

        }

        if (nextTimeoutRef.current) {

            clearTimeout(
                nextTimeoutRef.current
            );

        }

        onBack();

    };


    /* =========================
       SKIP
    ========================= */

    const handleSkip = () => {

        window.speechSynthesis.cancel();

        if (yayAudioRef.current) {

            yayAudioRef.current.pause();
            yayAudioRef.current.currentTime = 0;

        }

        if (nextTimeoutRef.current) {

            clearTimeout(
                nextTimeoutRef.current
            );

        }

        onSkip();

    };


    return (

        <div className="qv-page">


            {/* DARK OVERLAY */}

            <div className="qv-overlay"></div>


            {/* MAIN CARD */}

            <div className="qv-main-card">


                {/* =========================
                   TOP HEADER
                ========================= */}

                <div className="qv-header">


                    <button
                        className="qv-back-btn"
                        onClick={handleBack}
                    >

                        ← Back

                    </button>


                    <div className="qv-progress-area">

                        <div className="qv-question-count">

                            Question {currentQuestion} of{" "}
                            {totalQuestions}

                        </div>


                        <div className="qv-progress-bar">

                            <div
                                className="qv-progress-fill"
                                style={{
                                    width: `${progress}%`
                                }}
                            ></div>

                        </div>

                    </div>


                    <button
                        className="qv-skip-btn"
                        onClick={handleSkip}
                    >

                        Skip →

                    </button>

                </div>


                {/* =========================
                   MAIN CONTENT
                ========================= */}

                <div className="qv-content">


                    {/* =====================
                       TEACHER SECTION
                    ===================== */}

                    <div className="qv-teacher-section">


                        <div className="qv-teacher-image-wrap">

                            <img
                                src={teacher}
                                alt="Miss Uroosa"
                                className={
                                    feedback === "correct"
                                        ? "qv-teacher-img qv-happy"
                                        : "qv-teacher-img"
                                }
                            />

                        </div>


                        {/* TEACHER SPEECH */}

                        <div className="qv-teacher-bubble">

                            <span>

                                {teacherText ||
                                    question.question}

                            </span>

                        </div>


                        <div className="qv-teacher-name">

                            🌿 Miss Uroosa 🌿

                        </div>

                    </div>


                    {/* =====================
                       ACTIVITY SECTION
                    ===================== */}

                    <div className="qv-activity">


                        {/* =====================
                           QUESTION / PROMPT
                        ===================== */}

                        {question.options && (

                            <>

                                <div className="qv-question-panel">

                                    <div className="qv-panel-decoration">

                                        ❧

                                    </div>


                                    <div className="qv-question-label">

                                        {question.question}

                                    </div>


                                    <div className="qv-prompt">

                                        {question.prompt}

                                    </div>


                                    <div className="qv-panel-line">

                                        ✦

                                    </div>

                                </div>


                                {/* =================
                                   FOOD OPTIONS
                                ================= */}

                                <div className="qv-food-options">

                                    {question.options.map(
                                        (option, index) => (

                                            <div
                                                key={index}
                                                className={
                                                    feedback === "correct" &&
                                                    option.isCorrect
                                                        ? "qv-food-card qv-correct-card"
                                                        : "qv-food-card"
                                                }
                                                onClick={() =>
                                                    handleOptionClick(
                                                        option
                                                    )
                                                }
                                            >

                                                <div className="qv-food-image-wrap">

                                                    <img
                                                        src={
                                                            images[
                                                                option.image
                                                            ]
                                                        }
                                                        alt={
                                                            option.text
                                                        }
                                                        className="qv-food-image"
                                                    />

                                                </div>


                                                <div className="qv-food-name">

                                                    <span>
                                                        🌿
                                                    </span>

                                                    {option.text}

                                                    <span>
                                                        🌿
                                                    </span>

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>


                                {/* BOTTOM TIP */}

                                <div className="qv-tip-box">

                                    <span className="qv-tip-icon">

                                        💡

                                    </span>


                                    <span>

                                        Listen carefully and choose the correct answer.

                                    </span>


                                    <span className="qv-tip-star">

                                    </span>

                                </div>

                            </>

                        )}


                        {/* =====================
                           SPEAKING PRACTICE
                        ===================== */}

                        {question.practice && (

                            <div className="qv-practice-section">

                                <div className="qv-practice-title">

                                    Speak the word

                                </div>


                                <div className="qv-practice-card">

                                    <img
                                        src={panipuri}
                                        alt=""
                                        className="qv-practice-image"
                                    />


                                    <div className="qv-practice-word">

                                        {
                                            question.practice
                                                .expectedAnswer
                                        }

                                    </div>

                                </div>


                                <p className="qv-practice-text">

                                    Tap the microphone and say the word

                                </p>


                                <button
                                    className="qv-mic-btn"
                                    onClick={startPractice}
                                >

                                    🎙️

                                </button>

                            </div>

                        )}


                        {/* =====================
                           WORD BUILDER
                        ===================== */}

                        {question.wordBuilder && (

                            <div className="qv-builder-section">

                                <h2>

                                    Pick & Make the Word

                                </h2>


                                <div className="qv-blank-word">

                                    {question.wordBuilder.answer
                                        .split("")
                                        .map((_, index) => (

                                            <div
                                                key={index}
                                                className="qv-blank-box"
                                            >

                                                {
                                                    builtWord[index] ||
                                                    ""
                                                }

                                            </div>

                                        ))}

                                </div>


                                <div className="qv-letter-container">

                                    {
                                        question.wordBuilder.letters.map(
                                            (letter, index) => (

                                                <button
                                                    key={index}
                                                    className={
                                                        usedLetters.includes(index)
                                                            ? "qv-letter-btn qv-used"
                                                            : "qv-letter-btn"
                                                    }
                                                    disabled={
                                                        usedLetters.includes(index) ||
                                                        feedback === "correct"
                                                    }
                                                    onClick={() =>
                                                        handleLetterClick(
                                                            letter,
                                                            index
                                                        )
                                                    }
                                                >

                                                    {letter}

                                                </button>

                                            )
                                        )
                                    }

                                </div>


                                <button
                                    className="qv-reset-btn"
                                    onClick={resetWord}
                                    disabled={
                                        feedback === "correct"
                                    }
                                >

                                    Reset

                                </button>

                            </div>

                        )}

                    </div>

                </div>


                {/* =========================
                   FEEDBACK
                ========================= */}

                {feedback === "correct" && (

                    <div className="qv-feedback qv-correct">

                        {teacherText}

                    </div>

                )}


                {feedback === "wrong" && (

                    <div className="qv-feedback qv-wrong">

                        {teacherText}

                    </div>

                )}

            </div>

        </div>

    );

}

export default QuestionPage;