import React, { useEffect, useState } from "react";

import teacher1 from "./assets/teacher1.png";
import teacher2 from "./assets/teacher2.png";
import teacher3 from "./assets/teacher3.png";
import teacher4 from "./assets/teacher4.png";

function FinalChallenge({
    topicId,
    lessonId,
    userName,
    onNext,
    onBack
}) {

    /* =========================================
       TEACHER FRAMES
    ========================================= */

    const teacherFrames = [
        teacher1,
        teacher2,
        teacher3,
        teacher4
    ];


    /* =========================================
       FINAL CHALLENGE QUESTIONS
       TOTAL = 25 MARKS
       5 QUESTIONS × 5 MARKS
    ========================================= */

    const challenges = [

        {
            id: 1,
            category: "Food Preferences",
            marks: 5,

            question:
                "Imagine your friend asks you about your favourite food. Tell them what food you like, what food you do not like, and explain why."
        },

        {
            id: 2,
            category: "Restaurant Conversation",
            marks: 5,

            question:
                "You are at a restaurant. The waiter asks, 'What would you like to order?' Place your order politely and ask for a drink."
        },

        {
            id: 3,
            category: "Food Description & Feedback",
            marks: 5,

            question:
                "You have just eaten a pizza. It is tasty and crispy, but it is a little too salty. Give the waiter your feedback politely."
        },

        {
            id: 4,
            category: "Restaurant Problem",
            marks: 5,

            question:
                "You ordered orange juice, but the waiter brought water instead. Politely explain the problem and ask the waiter to bring the correct drink."
        },

        {
            id: 5,
            category: "Mixed Final Challenge",
            marks: 5,

            question:
                "Imagine you are having dinner with a friend. Talk about the food you ordered, describe how it tastes, give your feedback, and tell your friend whether you would recommend it."
        }

    ];


    /* =========================================
       STATES
    ========================================= */

    const [currentQuestion, setCurrentQuestion] =
        useState(0);

    const [frame, setFrame] =
        useState(0);

    const [teacherMessage, setTeacherMessage] =
        useState("");

    const [isSpeaking, setIsSpeaking] =
        useState(false);

    const [isListening, setIsListening] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [studentAnswer, setStudentAnswer] =
        useState("");

    const [score, setScore] =
        useState(0);

    const [mistakes, setMistakes] =
        useState([]);

    const [answers, setAnswers] =
        useState([]);

    const [testFinished, setTestFinished] =
        useState(false);

    const [feedback, setFeedback] =
        useState("");


    /* =========================================
       CURRENT QUESTION
    ========================================= */

    const question =
        challenges[currentQuestion];


    /* =========================================
       TEACHER ANIMATION
    ========================================= */

    useEffect(() => {

        if (!isSpeaking) {

            setFrame(0);

            return;

        }

        const timer = setInterval(() => {

            setFrame(prev =>
                (prev + 1) % teacherFrames.length
            );

        }, 250);

        return () =>
            clearInterval(timer);

    }, [isSpeaking]);


    /* =========================================
       SPEAK
    ========================================= */

    const speak = (text) => {

        if (!text) return;

        window.speechSynthesis.cancel();

        setTeacherMessage("");

        setIsSpeaking(true);

        let index = 0;

        const typing = setInterval(() => {

            index++;

            setTeacherMessage(
                text.substring(0, index)
            );

            if (index >= text.length) {

                clearInterval(typing);

            }

        }, 25);


        const speech =
            new SpeechSynthesisUtterance(text);

        speech.rate = 0.9;

        speech.pitch = 1.05;

        speech.volume = 1;


        const voices =
            window.speechSynthesis.getVoices();


        speech.voice =
            voices.find(v =>
                v.name.includes("Zira")
            ) ||

            voices.find(v =>
                v.name.includes("Samantha")
            ) ||

            voices[0];


        speech.onend = () => {

            setIsSpeaking(false);

        };


        window.speechSynthesis.speak(speech);

    };


    /* =========================================
       START QUESTION
    ========================================= */

    useEffect(() => {

        if (!testFinished && question) {

            setStudentAnswer("");

            speak(question.question);

        }

    }, [currentQuestion]);


    /* =========================================
       START MICROPHONE
    ========================================= */

    const startListening = () => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if (!SpeechRecognition) {

            alert(
                "Speech Recognition is not supported in this browser."
            );

            return;

        }


        const recognition =
            new SpeechRecognition();


        recognition.lang = "en-US";

        recognition.interimResults = false;

        recognition.maxAlternatives = 1;


        setStudentAnswer("");

        setIsListening(true);


        recognition.start();


        recognition.onresult = async (event) => {

            const spokenText =
                event.results[0][0].transcript;


            setStudentAnswer(spokenText);

            setIsListening(false);

            await checkAnswer(spokenText);

        };


        recognition.onerror = () => {

            setIsListening(false);

        };


        recognition.onend = () => {

            setIsListening(false);

        };

    };


    /* =========================================
       CHECK ANSWER THROUGH BACKEND
    ========================================= */

    const checkAnswer = async (spokenText) => {

        if (!spokenText.trim()) return;


        setLoading(true);


        try {

            const response = await fetch(

               `${import.meta.env.VITE_API_URL}/api/chat`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        message: spokenText,

                        history: answers,

                        topicId,

                        lessonId,

                        userName,

                        activity:
                            "final-challenge",

                        challengeNumber:
                            currentQuestion + 1,

                        category:
                            question.category,

                        maxMarks:
                            question.marks

                    })

                }

            );


            const data =
                await response.json();


            /* =====================================
               SCORE
               MAXIMUM = 5 PER QUESTION
            ===================================== */

            const questionScore =
                Math.max(
                    0,
                    Math.min(
                        question.marks,
                        Number(data.score) || 0
                    )
                );


            setScore(prev =>
                prev + questionScore
            );


            /* =====================================
               SAVE ANSWER
            ===================================== */

            setAnswers(prev => [

                ...prev,

                {

                    question:
                        question.question,

                    category:
                        question.category,

                    answer:
                        spokenText,

                    score:
                        questionScore

                }

            ]);


            /* =====================================
               SAVE GRAMMAR MISTAKE
            ===================================== */

            if (
                data.grammarCorrect === false &&
                data.mistake
            ) {

                setMistakes(prev => [

                    ...prev,

                    {

                        original:
                            data.mistake.original ||
                            spokenText,

                        correction:
                            data.mistake.correction ||
                            "",

                        urduExplanation:
                            data.mistake.urduExplanation ||
                            ""

                    }

                ]);

            }


            /* =====================================
               TEACHER FEEDBACK
            ===================================== */

            if (data.response) {

                speak(data.response);

            }


            /*
             * Give the student time to see/hear
             * the feedback before next question.
             */

            setTimeout(() => {

                moveToNextQuestion();

            }, 2200);

        }

        catch (error) {

            console.error(
                "Final Challenge Error:",
                error
            );

            alert(
                "Backend Error. Please check your server."
            );

        }

        finally {

            setLoading(false);

        }

    };


    /* =========================================
       NEXT QUESTION
    ========================================= */

    const moveToNextQuestion = () => {

        if (
            currentQuestion <
            challenges.length - 1
        ) {

            setCurrentQuestion(
                prev => prev + 1
            );

        }

        else {

            finishChallenge();

        }

    };


    /* =========================================
       FINISH CHALLENGE
    ========================================= */

    const finishChallenge = () => {

        setTestFinished(true);

        setTeacherMessage(
            "Excellent! You have completed the Final Challenge."
        );

        setFeedback(
            "You completed all five speaking challenges. Review your grammar mistakes and keep practicing."
        );

    };


    /* =========================================
       CLEANUP
    ========================================= */

    useEffect(() => {

        return () => {

            window.speechSynthesis.cancel();

        };

    }, []);


    /* =========================================
       RESULT PREVIEW
    ========================================= */

    if (testFinished) {

        return (

            <div className="final-challenge-container">

                <div className="final-challenge-card">

                    <div className="final-complete-section">

                        <img
                            src={teacherFrames[frame]}
                            alt="Teacher"
                            className="final-teacher-img"
                        />

                        <h1>
                            🎉 Challenge Completed!
                        </h1>


                        <div className="final-score-preview">

                            <strong>
                                {score}
                            </strong>

                            <span>
                                / 25
                            </span>

                        </div>


                        <p>
                            Your final result is ready.
                        </p>


                        <button
                            className="final-view-result-btn"
                            onClick={() => {

                                onNext({

                                    score,

                                    totalMarks: 25,

                                    mistakes,

                                    answers,

                                    feedback

                                });

                            }}
                        >

                            View My Result →

                        </button>

                    </div>

                </div>

            </div>

        );

    }


    /* =========================================
       MAIN PAGE
    ========================================= */

    return (

        <div className="final-challenge-container">

            <div className="final-challenge-card">


                {/* ================= HEADER ================= */}

                <div className="final-challenge-header">

                    <button
                        className="final-back-btn"
                        onClick={onBack}
                    >

                        ← Back

                    </button>


                    <div className="final-challenge-title">

                        <h1>
                            Final Challenge
                        </h1>

                        <p>
                            Speaking Assessment
                        </p>

                    </div>


                    <div className="final-progress">

                        {currentQuestion + 1}

                        {" / "}

                        {challenges.length}

                    </div>

                </div>


                {/* ================= CATEGORY ================= */}

                <div className="challenge-category">

                    Challenge {currentQuestion + 1}

                    <span>
                        {question.category}
                    </span>

                </div>


                {/* ================= TEACHER ================= */}

                <div className="final-teacher-section">

                    <img
                        src={teacherFrames[frame]}
                        alt="Teacher"
                        className={
                            isSpeaking
                                ? "final-teacher-img speaking"
                                : "final-teacher-img"
                        }
                    />


                    <div className="final-speech-box">

                        <p>

                            {teacherMessage ||
                                question.question}

                        </p>

                    </div>

                </div>


                {/* ================= ANSWER ================= */}

                <div className="final-answer-section">

                    <div className="answer-label">

                        🎤 Your Answer

                    </div>


                    <div className="final-answer-box">

                        {studentAnswer ? (

                            <p>
                                {studentAnswer}
                            </p>

                        ) : (

                            <span>

                                Tap the microphone and
                                speak your answer.

                            </span>

                        )}

                    </div>

                </div>


                {/* ================= MIC ================= */}

                <div className="final-mic-section">

                    <button

                        className={
                            isListening
                                ? "final-mic-btn listening"
                                : "final-mic-btn"
                        }

                        onClick={startListening}

                        disabled={
                            loading ||
                            isListening
                        }

                    >

                        {loading

                            ? "Checking..."

                            : isListening

                                ? "Listening..."

                                : "🎙️ Speak Answer"

                        }

                    </button>

                </div>


                {/* ================= PROGRESS ================= */}

                <div className="final-bottom-info">

                    <span>

                        Question {currentQuestion + 1}

                        {" of "}

                        {challenges.length}

                    </span>


                    <span>

                        Current Score: {score} / 25

                    </span>

                </div>


            </div>

        </div>

    );

}

export default FinalChallenge;