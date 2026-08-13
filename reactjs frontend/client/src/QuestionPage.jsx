import React, { useState, useEffect } from "react";

import teacher from "./assets/teacher1.png";
import laddu from "./assets/laddu.jpg";
import panipuri from "./assets/panipuri.jpg";

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
    const [showRibbon, setShowRibbon] = useState(false);

    useEffect(() => {

        setFeedback("");
        setBuiltWord("");
        setUsedLetters([]);
        setTeacherText("");
        setShowRibbon(false);

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

    const speak = (text) => {

        window.speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(text);

        speech.rate = 0.9;
        speech.pitch = 1.15;
        speech.volume = 1;

        const voices = window.speechSynthesis.getVoices();

        speech.voice =
            voices.find(v =>
                v.name.includes("Zira")
            ) ||
            voices.find(v =>
                v.name.includes("Google UK English Female")
            ) ||
            voices.find(v =>
                v.name.includes("Samantha")
            ) ||
            voices.find(v =>
                v.name.toLowerCase().includes("female")
            ) ||
            voices[0];

        window.speechSynthesis.speak(speech);
    };

    /* =========================
       CORRECT
    ========================= */

    const correctReaction = () => {

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
        setShowRibbon(true);

        speak(random);

        setTimeout(() => {

            setShowRibbon(false);

            onNext();

        }, 2200);
    };

    /* =========================
       WRONG
    ========================= */

    const wrongReaction = () => {

        setTeacherText("No... Try again!");
        setFeedback("wrong");

        speak("No... Try again!");

    };

    /* =========================
       OPTION CLICK
    ========================= */

    const handleOptionClick = (option) => {

        if (feedback === "correct") return;

        if (option.isCorrect) {

            correctReaction();

        } else {

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
                spokenWord.includes(correctWord)
            ) {

                correctReaction();

            } else {

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
    onClick={() => {
        console.log("QuestionPage → BACK");
        onBack();
    }}
>
    ← Back
</button>

                    <div className="qv-progress-area">

                        <div className="qv-question-count">

                            Question {currentQuestion} of {totalQuestions}

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
                        onClick={onSkip}
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

                                                    <span>🌿</span>

                                                    {option.text}

                                                    <span>🌿</span>

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

                                        {question.practice.expectedAnswer}

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

                                                {builtWord[index] || ""}

                                            </div>

                                        ))}

                                </div>


                                <div className="qv-letter-container">

                                    {question.wordBuilder.letters.map(
                                        (letter, index) => (

                                            <button
                                                key={index}
                                                className={
                                                    usedLetters.includes(index)
                                                        ? "qv-letter-btn qv-used"
                                                        : "qv-letter-btn"
                                                }
                                                disabled={
                                                    usedLetters.includes(index)
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
                                    )}

                                </div>


                                <button
                                    className="qv-reset-btn"
                                    onClick={resetWord}
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


            {/* =========================
               RIBBON
            ========================= */}

            {showRibbon && (

                <div className="qv-ribbon-container">

                    <div className="qv-ribbon qv-red"></div>
                    <div className="qv-ribbon qv-blue"></div>
                    <div className="qv-ribbon qv-yellow"></div>
                    <div className="qv-ribbon qv-green"></div>
                    <div className="qv-ribbon qv-pink"></div>
                    <div className="qv-ribbon qv-purple"></div>

                </div>

            )}

        </div>

    );

}

export default QuestionPage;