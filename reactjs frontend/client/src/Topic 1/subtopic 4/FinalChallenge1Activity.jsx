import React, { useEffect, useRef, useState } from "react";

import teacher1 from "../../assets/teacher1.png";
import teacher2 from "../../assets/teacher2.png";
import teacher3 from "../../assets/teacher3.png";
import teacher4 from "../../assets/teacher4.png";

import "./FinalChallenge1Activity.css";

function FinalChallenge1Activity({
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
       ALL 5 FINAL CHALLENGES
    ========================================= */

    const challenges = [
        {
            id: 1,
            category: "Interaction Challenge",
            marks: 5,
            questionType: "speaking",
            expectedAnswer:
                "The student should talk about a favourite person, favourite place, and favourite hobby and explain why each is special.",
            context:
                "Topic 1 final assessment covering favourite person, favourite place, and hobbies.",
            question:
                "Tell me about a person you really like, a place you enjoy visiting, and a hobby you love doing. Explain why each one is special to you."
        },

        {
            id: 2,
            category: "Progressive Person Puzzle",
            marks: 5,
            questionType: "speaking",
            expectedAnswer:
                "The student should describe a person, explain what they like about that person, and mention an activity they enjoy doing together.",
            context:
                "Assessment of describing a favourite person and shared activities.",
            question:
                "Imagine you are describing a person to a new friend. Give clues about who the person is, what you like about them, and something you enjoy doing together."
        },

        {
            id: 3,
            category: "Passport Challenge",
            marks: 5,
            questionType: "speaking",
            expectedAnswer:
                "The student should describe a favourite person, favourite place, and favourite hobby and explain why they would recommend them.",
            context:
                "Assessment of connected speaking about favourite things.",
            question:
                "Your passport has three stops: a favourite person, a favourite place, and a favourite hobby. Describe all three stops and explain why you would recommend them."
        },

        {
            id: 4,
            category: "Mix & Fix",
            marks: 5,
            questionType: "speaking",
            expectedAnswer:
                "The student should create a clear and connected description including a favourite person, favourite place, and hobby.",
            context:
                "Assessment of sentence structure and connected ideas.",
            question:
                "Create a short description using all three ideas: your favourite person, your favourite place, and your hobby. Make your answer clear and well connected."
        },

        {
            id: 5,
            category: "Mystery Memory Map",
            marks: 5,
            questionType: "speaking",
            expectedAnswer:
                "The student should describe a special memory including where they were, who was with them, what activity they were doing, and why they remember it.",
            context:
                "Assessment of describing a past experience with people, places, and activities.",
            question:
                "Think of a special memory. Describe where you were, who was with you, and what hobby or activity you were doing. Explain why you still remember it."
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

    const [answers, setAnswers] =
        useState([]);

    const [testFinished, setTestFinished] =
        useState(false);

    const recognitionRef =
        useRef(null);

    const typingTimerRef =
        useRef(null);

    const moveTimerRef =
        useRef(null);

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
       SPEAK FUNCTION
    ========================================= */

    const speak = (text) => {
        if (!text) return;

        if (typingTimerRef.current) {
            clearInterval(typingTimerRef.current);
        }

        window.speechSynthesis.cancel();

        setTeacherMessage("");
        setIsSpeaking(true);

        let index = 0;

        typingTimerRef.current =
            setInterval(() => {
                index++;

                setTeacherMessage(
                    text.substring(0, index)
                );

                if (index >= text.length) {
                    clearInterval(
                        typingTimerRef.current
                    );

                    typingTimerRef.current = null;
                }
            }, 20);

        const speech =
            new SpeechSynthesisUtterance(text);

        speech.rate = 0.9;
        speech.pitch = 1.05;
        speech.volume = 1;

        const setVoice = () => {
            const voices =
                window.speechSynthesis.getVoices();

            speech.voice =
                voices.find(v =>
                    v.name.includes("Zira")
                ) ||
                voices.find(v =>
                    v.name.includes("Samantha")
                ) ||
                voices.find(v =>
                    v.lang?.startsWith("en")
                ) ||
                voices[0];
        };

        setVoice();

        speech.onend = () => {
            setIsSpeaking(false);
        };

        speech.onerror = () => {
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(speech);
    };

    /* =========================================
       START CURRENT QUESTION
    ========================================= */

    useEffect(() => {
        if (!testFinished && question) {
            setStudentAnswer("");
            setTeacherMessage(question.question);

            const startTimer = setTimeout(() => {
                speak(question.question);
            }, 300);

            return () =>
                clearTimeout(startTimer);
        }
    }, [currentQuestion]);

    /* =========================================
       START MICROPHONE
    ========================================= */

    const startListening = () => {
        if (loading || isListening) return;

        window.speechSynthesis.cancel();
        setIsSpeaking(false);

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert(
                "Speech Recognition is not supported in this browser. Please use Google Chrome."
            );
            return;
        }

        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (error) {
                console.log(error);
            }
        }

        const recognition =
            new SpeechRecognition();

        recognitionRef.current =
            recognition;

        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        setStudentAnswer("");
        setIsListening(true);

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = async (event) => {
            const spokenText =
                event.results?.[0]?.[0]?.transcript ||
                "";

            const cleanAnswer =
                spokenText.trim();

            setStudentAnswer(cleanAnswer);
            setIsListening(false);

            if (cleanAnswer) {
                await checkAnswer(cleanAnswer);
            }
        };

        recognition.onerror = (event) => {
            console.log(
                "Speech Recognition Error:",
                event.error
            );

            setIsListening(false);

            if (
                event.error !== "no-speech" &&
                event.error !== "aborted"
            ) {
                alert(
                    "We could not hear your answer. Please try again."
                );
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        try {
            recognition.start();
        } catch (error) {
            console.log(
                "Recognition Start Error:",
                error
            );

            setIsListening(false);
        }
    };

    /* =========================================
       CHECK ANSWER
       FINAL CHALLENGE BACKEND
    ========================================= */

    const checkAnswer = async (spokenText) => {
        if (!spokenText?.trim()) return;

        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/final-challenge/check`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        questionId:
                            question.id,

                        question:
                            question.question,

                        message:
                            spokenText,

                        maxMarks:
                            question.marks,

                        questionType:
                            question.questionType,

                        expectedAnswer:
                            question.expectedAnswer,

                        context:
                            question.context,

                        userName:
                            userName || "Student"
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Unable to evaluate answer."
                );
            }

            /* =====================================
               SAFE QUESTION MARKS
            ===================================== */

            const questionScore =
                Math.max(
                    0,
                    Math.min(
                        question.marks,
                        Number(data.marks) || 0
                    )
                );

            /* =====================================
               SAVE COMPLETE ANSWER
            ===================================== */

            const answerResult = {
                question_id:
                    question.id,

                question:
                    question.question,

                category:
                    question.category,

                user_answer:
                    spokenText,

                marks:
                    questionScore,

                max_marks:
                    question.marks,

                grammar_correct:
                    data.grammarCorrect !== false,

                answer_correct:
                    data.answerCorrect === true,

                correction:
                    data.correction || "",

                feedback:
                    data.feedback || "",

                mistakes:
                    Array.isArray(data.mistakes)
                        ? data.mistakes
                        : []
            };

            /* =====================================
               CALCULATE NEXT SCORE
            ===================================== */

            const updatedScore =
                score + questionScore;

            setScore(updatedScore);

            /* =====================================
               SAVE ANSWER STATE
            ===================================== */

            const updatedAnswers = [
                ...answers,
                answerResult
            ];

            setAnswers(updatedAnswers);

            /* =====================================
               TEACHER FEEDBACK
            ===================================== */

            const feedbackText =
                data.feedback ||
                `You scored ${questionScore} out of ${question.marks} marks.`;

            speak(feedbackText);

            /* =====================================
               LAST QUESTION
            ===================================== */

            if (
                currentQuestion ===
                challenges.length - 1
            ) {
                moveTimerRef.current =
                    setTimeout(() => {
                        finishChallenge(
                            updatedAnswers,
                            updatedScore
                        );
                    }, 2200);

                return;
            }

            /* =====================================
               NEXT QUESTION
            ===================================== */

            moveTimerRef.current =
                setTimeout(() => {
                    setCurrentQuestion(prev =>
                        prev + 1
                    );
                }, 2200);
        }

        catch (error) {
            console.error(
                "Final Challenge Check Error:",
                error
            );

            alert(
                error.message ||
                "Unable to check your answer. Please try again."
            );
        }

        finally {
            setLoading(false);
        }
    };

    /* =========================================
       FINISH ALL 5 CHALLENGES
       SAVE RESULT TO BACKEND
    ========================================= */

    const finishChallenge = async (
        completedAnswers,
        finalScore
    ) => {
        setTestFinished(true);

        const completedMessage =
            "Excellent! You have completed all five challenges.";

        setTeacherMessage(
            completedMessage
        );

        speak(completedMessage);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/final-challenge/save-result`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        userName:
                            userName || "Student",

                        topicId:
                            Number(topicId) || 1,

                        lessonId:
                            Number(lessonId) || 4,

                        totalMarks:
                            25,

                        answers:
                            completedAnswers
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Unable to save result."
                );
            }

            const resultData = {
                score:
                    data.obtainedMarks ??
                    finalScore,

                totalMarks:
                    data.totalMarks ?? 25,

                obtainedMarks:
                    data.obtainedMarks ??
                    finalScore,

                percentage:
                    data.percentage ?? 0,

                grade:
                    data.grade || "",

                answers:
                    completedAnswers,

                mistakes:
                    data.grammarMistakes || [],

                grammarMistakes:
                    data.grammarMistakes || [],

                feedback:
                    "You completed all five final challenges.",

                resultId:
                    data.resultId || null
            };

            setTimeout(() => {
                if (onNext) {
                    onNext(resultData);
                }
            }, 1800);
        }

        catch (error) {
            console.error(
                "Save Final Challenge Error:",
                error
            );

            /* =====================================
               FALLBACK RESULT
               RESULT PAGE STILL OPENS
            ===================================== */

            const fallbackResult = {
                score:
                    finalScore,

                totalMarks:
                    25,

                obtainedMarks:
                    finalScore,

                percentage:
                    Number(
                        (
                            (finalScore / 25) *
                            100
                        ).toFixed(2)
                    ),

                grade:
                    "",

                answers:
                    completedAnswers,

                mistakes:
                    completedAnswers.flatMap(
                        answer =>
                            Array.isArray(
                                answer.mistakes
                            )
                                ? answer.mistakes.map(
                                    mistake => ({
                                        question_id:
                                            answer.question_id,

                                        mistake:
                                            mistake.mistake || "",

                                        correction:
                                            mistake.correction || "",

                                        urdu_explanation:
                                            mistake.urduExplanation || ""
                                    })
                                )
                                : []
                    ),

                grammarMistakes:
                    [],

                feedback:
                    "You completed all five final challenges.",

                resultId:
                    null
            };

            setTimeout(() => {
                if (onNext) {
                    onNext(fallbackResult);
                }
            }, 1800);
        }
    };

    /* =========================================
       CLEANUP
    ========================================= */

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();

            if (typingTimerRef.current) {
                clearInterval(
                    typingTimerRef.current
                );
            }

            if (moveTimerRef.current) {
                clearTimeout(
                    moveTimerRef.current
                );
            }

            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (error) {
                    console.log(error);
                }
            }
        };
    }, []);

    /* =========================================
       COMPLETION SCREEN
    ========================================= */

    if (testFinished) {
        return (
            <div className="finalchallenge1-activity-container">
                <div className="finalchallenge1-activity-card">
                    <div className="finalchallenge1-complete-section">

                        <img
                            src={teacherFrames[frame]}
                            alt="Teacher"
                            className="finalchallenge1-teacher-img"
                        />

                        <h1>
                            🎉 Challenge Completed!
                        </h1>

                        <div className="finalchallenge1-score-preview">
                            <strong>
                                {score}
                            </strong>

                            <span>
                                / 25
                            </span>
                        </div>

                        <p>
                            Preparing your final result...
                        </p>

                    </div>
                </div>
            </div>
        );
    }

    /* =========================================
       MAIN ACTIVITY PAGE
    ========================================= */

    return (
        <div className="finalchallenge1-activity-container">
            <div className="finalchallenge1-activity-card">

                {/* ================= HEADER ================= */}

                <div className="finalchallenge1-activity-header">

                    <button
                        className="finalchallenge1-back-btn"
                        onClick={onBack}
                        disabled={loading || isListening}
                    >
                        ← Back
                    </button>

                    <div className="finalchallenge1-activity-title">
                        <h1>
                            Final Challenge
                        </h1>

                        <p>
                            Speaking Assessment
                        </p>
                    </div>

                    <div className="finalchallenge1-progress">
                        {currentQuestion + 1}
                        {" / "}
                        {challenges.length}
                    </div>

                </div>

                {/* ================= CATEGORY ================= */}

                <div className="finalchallenge1-category">

                    Challenge {currentQuestion + 1}

                    <span>
                        {question.category}
                    </span>

                </div>

                {/* ================= TEACHER ================= */}

                <div className="finalchallenge1-teacher-section">

                    <img
                        src={teacherFrames[frame]}
                        alt="Teacher"
                        className={
                            isSpeaking
                                ? "finalchallenge1-teacher-img speaking"
                                : "finalchallenge1-teacher-img"
                        }
                    />

                    <div className="finalchallenge1-speech-box">
                        <p>
                            {teacherMessage ||
                                question.question}
                        </p>
                    </div>

                </div>

                {/* ================= ANSWER ================= */}

                <div className="finalchallenge1-answer-section">

                    <div className="finalchallenge1-answer-label">
                        🎤 Your Answer
                    </div>

                    <div className="finalchallenge1-answer-box">

                        {studentAnswer ? (
                            <p>
                                {studentAnswer}
                            </p>
                        ) : (
                            <span>
                                Tap the microphone and speak your answer.
                            </span>
                        )}

                    </div>

                </div>

                {/* ================= MIC ================= */}

                <div className="finalchallenge1-mic-section">

                    <button
                        className={
                            isListening
                                ? "finalchallenge1-mic-btn listening"
                                : "finalchallenge1-mic-btn"
                        }
                        onClick={startListening}
                        disabled={
                            loading ||
                            isListening ||
                            isSpeaking
                        }
                    >
                        {loading
                            ? "Checking..."
                            : isListening
                                ? "Listening..."
                                : isSpeaking
                                    ? "Please Listen..."
                                    : "🎙️ Speak Answer"
                        }
                    </button>

                </div>

                {/* ================= BOTTOM INFO ================= */}

                <div className="finalchallenge1-bottom-info">

                    <span>
                        Challenge {currentQuestion + 1}
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

export default FinalChallenge1Activity;