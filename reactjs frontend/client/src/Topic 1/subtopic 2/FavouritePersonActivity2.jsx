import React, { useEffect, useRef, useState } from "react";

import teacher1 from "../../assets/teacher1.png";
import teacher2 from "../../assets/teacher2.png";
import teacher3 from "../../assets/teacher3.png";
import teacher4 from "../../assets/teacher4.png";

import chatBg from "../../assets/chatbg.jpeg";

import "./FavouritePersonActivity2.css";


function FavouritePersonActivity2({
    content,
    topicId,
    lessonId,
    userName,
    onNext,
    onBack
}) {

    /* =====================================================
            QUESTIONS
    ===================================================== */

    const questions =
        content?.activities?.[0]?.questions || [
            {
                id: 1,
                question: "Who is your favourite person?",
                hint: "You can say: My favourite person is my mother.",
                keywords: [
                    "my",
                    "favourite",
                    "favorite",
                    "person"
                ]
            },
            {
                id: 2,
                question: "Why do you like this person?",
                hint: "Try to use the word because.",
                keywords: [
                    "because"
                ]
            },
            {
                id: 3,
                question:
                    "What does your favourite person do for you?",
                hint:
                    "You can talk about how they help or care for you.",
                keywords: [
                    "help",
                    "care",
                    "love"
                ]
            }
        ];


    /* =====================================================
            TEACHER IMAGES
    ===================================================== */

    const teacherImages = [
        teacher1,
        teacher2,
        teacher3,
        teacher4
    ];


    /* =====================================================
            STATES
    ===================================================== */

    const [currentQuestion, setCurrentQuestion] =
        useState(0);

    const [isListening, setIsListening] =
        useState(false);

    const [spokenAnswer, setSpokenAnswer] =
        useState("");

    const [feedback, setFeedback] =
        useState("");

    const [isCorrect, setIsCorrect] =
        useState(false);

    const [showFeedback, setShowFeedback] =
        useState(false);


    const recognitionRef =
        useRef(null);


    const question =
        questions[currentQuestion];


    const currentTeacher =
        teacherImages[
            currentQuestion %
            teacherImages.length
        ];


    /* =====================================================
            TEACHER SPEECH
    ===================================================== */

    const speakTeacher = (text) => {

        if (!window.speechSynthesis) {
            return;
        }

        window.speechSynthesis.cancel();

        const speech =
            new SpeechSynthesisUtterance(text);

        speech.lang = "en-US";

        speech.rate = 0.88;

        speech.pitch = 1.08;

        window.speechSynthesis.speak(speech);

    };


    /* =====================================================
            ASK QUESTION
    ===================================================== */

    useEffect(() => {

        if (!question) {
            return;
        }

        const timer =
            setTimeout(() => {

                speakTeacher(
                    question.question
                );

            }, 600);


        return () => {

            clearTimeout(timer);

            window.speechSynthesis?.cancel();

        };

    }, [currentQuestion]);


    /* =====================================================
            START SPEAKING
    ===================================================== */

    const startListening = () => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if (!SpeechRecognition) {

            setFeedback(
                "Speech recognition is not supported in this browser. Please use Google Chrome."
            );

            setShowFeedback(true);

            return;

        }


        if (isListening) {
            return;
        }


        const recognition =
            new SpeechRecognition();


        recognition.lang = "en-US";

        recognition.continuous = false;

        recognition.interimResults = false;


        recognition.onstart = () => {

            setIsListening(true);

            setSpokenAnswer("");

            setFeedback("");

            setShowFeedback(false);

        };


        recognition.onresult = (event) => {

            const text =
                event.results[0][0].transcript;


            setSpokenAnswer(text);

            checkSpokenAnswer(text);

        };


        recognition.onerror = () => {

            setIsListening(false);

            setFeedback(
                "I couldn't hear you clearly. Please try again. 🎤"
            );

            setShowFeedback(true);

        };


        recognition.onend = () => {

            setIsListening(false);

        };


        recognitionRef.current =
            recognition;


        recognition.start();

    };


    /* =====================================================
            CHECK SPOKEN ANSWER
    ===================================================== */

    const checkSpokenAnswer = (answer) => {

        const cleanAnswer =
            answer
                .trim()
                .toLowerCase();


        if (!cleanAnswer) {

            setFeedback(
                "Please say your answer again."
            );

            setIsCorrect(false);

            setShowFeedback(true);

            return;

        }


        let correct = false;


        /* -----------------------------------------------
                QUESTION 1
        ------------------------------------------------ */

        if (currentQuestion === 0) {

            correct =
                (
                    cleanAnswer.includes("favourite") ||
                    cleanAnswer.includes("favorite")
                );

        }


        /* -----------------------------------------------
                QUESTION 2
        ------------------------------------------------ */

        if (currentQuestion === 1) {

            correct =
                cleanAnswer.includes("because") &&
                cleanAnswer.length > 15;

        }


        /* -----------------------------------------------
                QUESTION 3
        ------------------------------------------------ */

        if (currentQuestion === 2) {

            correct =
                (
                    cleanAnswer.includes("help") ||
                    cleanAnswer.includes("care") ||
                    cleanAnswer.includes("love")
                ) &&
                cleanAnswer.length > 15;

        }


        setIsCorrect(correct);

        setShowFeedback(true);


        if (correct) {

            const message =
                "Excellent! 🌟 That's a wonderful answer.";

            setFeedback(message);

            speakTeacher(message);

        }

        else {

            const message =
                "Good try! 💛 Try answering in a complete sentence.";

            setFeedback(message);

            speakTeacher(message);

        }

    };


    /* =====================================================
            NEXT QUESTION
    ===================================================== */

    const handleNext = () => {

        window.speechSynthesis?.cancel();


        if (
            currentQuestion <
            questions.length - 1
        ) {

            setCurrentQuestion(
                previous =>
                    previous + 1
            );

            setSpokenAnswer("");

            setFeedback("");

            setIsCorrect(false);

            setShowFeedback(false);

        }

        else {

            if (onNext) {
                onNext();
            }

        }

    };


    /* =====================================================
            BACK
    ===================================================== */

    const handleBack = () => {

        window.speechSynthesis?.cancel();


        if (
            recognitionRef.current
        ) {

            recognitionRef.current.stop();

        }


        if (onBack) {
            onBack();
        }

    };


    /* =====================================================
            EMPTY CONTENT
    ===================================================== */

    if (!questions.length) {

        return (

            <div className="favourite-person-activity">

                <div className="favourite-person-question-card">

                    <h2>
                        Activity content not found
                    </h2>

                    <button
                        type="button"
                        className="activity-back-button"
                        onClick={handleBack}
                    >
                        ← Back
                    </button>

                </div>

            </div>

        );

    }


    /* =====================================================
            MAIN UI
    ===================================================== */

    return (

        <div
            className="favourite-person-activity"
            style={{
                backgroundImage:
                    `url(${chatBg})`
            }}
        >

            {/* =================================================
                    MAIN CARD
            ================================================= */}

            <div className="favourite-person-question-card">


                {/* =================================================
                        TOP BAR
                ================================================= */}

                <div className="activity-top-bar">

                    <button
                        type="button"
                        className="activity-back-button"
                        onClick={handleBack}
                    >
                        ← Back
                    </button>


                    <div className="activity-progress">

                        Question{" "}
                        {currentQuestion + 1}
                        {" / "}
                        {questions.length}

                    </div>

                </div>


                {/* =================================================
                        QUESTION NUMBER
                ================================================= */}

                <div className="question-number">

                    Question {question.id}

                </div>


                {/* =================================================
                        TITLE
                ================================================= */}

                <h2>

                    Let's Talk About
                    <br />

                    Your Favourite Person

                </h2>


                {/* =================================================
                        TEACHER
                ================================================= */}

                <div className="activity2-teacher-section">


                    <div className="activity2-teacher-image-wrapper">

                        <img
                            src={currentTeacher}
                            alt="Miss Uroosa"
                            className={
                                isListening
                                    ? "activity2-teacher-image speaking"
                                    : "activity2-teacher-image"
                            }
                        />

                    </div>


                    {/* =================================================
                            TEACHER BUBBLE
                    ================================================= */}

                    <div
                        className={
                            `activity2-teacher-bubble ${
                                showFeedback
                                    ? isCorrect
                                        ? "success"
                                        : "try-again"
                                    : ""
                            }`
                        }
                    >

                        <strong>

                            {showFeedback
                                ? isCorrect
                                    ? "Excellent! 🎉"
                                    : "Try again! 💛"
                                : "Miss Uroosa 👩‍🏫"
                            }

                        </strong>


                        <p>

                            {showFeedback
                                ? feedback
                                : question.question
                            }

                        </p>

                    </div>

                </div>


                {/* =================================================
                        QUESTION
                ================================================= */}

                {!showFeedback && (

                    <div className="question-text">

                        🎤

                        <span>
                            {question.question}
                        </span>

                    </div>

                )}


                {/* =================================================
                        SPEAK AREA
                ================================================= */}

                {!showFeedback && (

                    <div className="activity2-speak-area">


                        <p className="activity2-speak-title">

                            {isListening
                                ? "I'm listening..."
                                : "Tap the microphone and answer!"
                            }

                        </p>


                        {/* MICROPHONE */}

                        <button
                            type="button"
                            className={
                                isListening
                                    ? "activity2-mic-button listening"
                                    : "activity2-mic-button"
                            }
                            onClick={startListening}
                            disabled={isListening}
                        >

                            {isListening
                                ? "🎙️"
                                : "🎤"
                            }

                        </button>


                        <p className="activity2-mic-text">

                            {isListening
                                ? "Speak clearly..."
                                : "Tap to speak"
                            }

                        </p>

                    </div>

                )}


                {/* =================================================
                        SPOKEN ANSWER
                ================================================= */}

                {spokenAnswer && (

                    <div className="activity2-spoken-answer">

                        <span>
                            You said:
                        </span>

                        <strong>
                            "{spokenAnswer}"
                        </strong>

                    </div>

                )}


                {/* =================================================
                        HINT
                ================================================= */}

                {!showFeedback && (

                    <div className="answer-hint">

                        💡

                        <strong>
                            Hint:
                        </strong>

                        {" "}

                        {question.hint}

                    </div>

                )}


                {/* =================================================
                        FEEDBACK
                ================================================= */}

                {showFeedback && (

                    <div className="answer-feedback">

                        <p>
                            {feedback}
                        </p>

                    </div>

                )}


                {/* =================================================
                        NEXT BUTTON
                ================================================= */}

                {showFeedback && (

                    <button
                        type="button"
                        className="activity-next-button"
                        onClick={handleNext}
                    >

                        {currentQuestion ===
                        questions.length - 1

                            ? "Finish Activity →"

                            : "Next Question →"

                        }

                    </button>

                )}

            </div>

        </div>

    );

}


export default FavouritePersonActivity2;