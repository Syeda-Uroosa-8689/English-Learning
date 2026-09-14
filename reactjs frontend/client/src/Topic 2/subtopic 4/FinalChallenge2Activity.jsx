import React, { useEffect, useRef, useState } from "react";

import teacher1 from "../../assets/teacher1.png";
import teacher2 from "../../assets/teacher2.png";
import teacher3 from "../../assets/teacher3.png";
import teacher4 from "../../assets/teacher4.png";

import "./FinalChallenge2Activity.css";

function FinalChallenge2Activity({
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
       FINAL CHALLENGE 2
       5 ROUNDS × 5 MARKS = 25
    ========================================= */

    const challenges = [

        {
            id: 1,

            category: "Partner Profile",

            marks: 5,

            questionType: "speaking",

            context:
                "Final assessment of physical appearance, personality traits, and likes or dislikes.",

            expectedAnswer:
                "The student should introduce a partner by describing at least one physical feature, one personality trait, and one like or dislike.",

            question:
                "Imagine you are introducing your partner to a new friend. Describe what your partner looks like, what kind of person they are, and one thing they like or dislike."
        },

        {
            id: 2,

            category: "Who Am I Talking About?",

            marks: 5,

            questionType: "speaking",

            context:
                "Assessment of identifying and describing a person using appearance and personality clues.",

            expectedAnswer:
                "The student should give clear clues about a person's appearance and personality and include something the person likes or dislikes.",

            question:
                "Give three clues about your partner so that I can imagine the person. Tell me about their appearance, personality, and something they like or dislike."
        },

        {
            id: 3,

            category: "Perfect Match",

            marks: 5,

            questionType: "speaking",

            context:
                "Assessment of connecting physical appearance, personality, and preferences in connected speech.",

            expectedAnswer:
                "The student should describe the partner's appearance, personality, and preferences in connected sentences.",

            question:
                "Why is your partner special to you? Tell me what they look like, what their personality is like, and one thing you both like or enjoy."
        },

        {
            id: 4,

            category: "Partner's Day",

            marks: 5,

            questionType: "speaking",

            context:
                "Assessment of describing a partner through appearance, personality, and likes or dislikes in a situation.",

            expectedAnswer:
                "The student should imagine their partner's day and describe what the partner is like, what they enjoy, and something they do not like.",

            question:
                "Imagine it is your partner's favourite day. Describe what your partner is like, what they enjoy doing, and one thing they do not like."
        },

        {
            id: 5,

            category: "Partner Spotlight",

            marks: 5,

            questionType: "speaking",

            context:
                "Final integrated speaking assessment covering all three partner subtopics.",

            expectedAnswer:
                "The student should give a short connected description covering physical appearance, personality traits, likes, and dislikes.",

            question:
                "Your partner is in the spotlight! Give a short description of them. Tell me what they look like, what they are like, what they like, and what they do not like."
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
                (prev + 1) %
                teacherFrames.length
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

            clearInterval(
                typingTimerRef.current
            );
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


        window.speechSynthesis.speak(
            speech
        );
    };


    /* =========================================
       START CURRENT QUESTION
    ========================================= */

    useEffect(() => {

        if (!testFinished && question) {

            setStudentAnswer("");

            setTeacherMessage(
                question.question
            );

            const startTimer =
                setTimeout(() => {

                    speak(
                        question.question
                    );

                }, 300);

            return () =>
                clearTimeout(startTimer);
        }

    }, [currentQuestion]);


    /* =========================================
       START MICROPHONE
    ========================================= */

    const startListening = () => {

        if (
            loading ||
            isListening
        ) {
            return;
        }


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


        recognition.lang =
            "en-US";

        recognition.interimResults =
            false;

        recognition.maxAlternatives =
            1;

        recognition.continuous =
            false;


        setStudentAnswer("");

        setIsListening(true);


        recognition.onstart = () => {

            setIsListening(true);
        };


        recognition.onresult =
            async (event) => {

                const spokenText =
                    event.results?.[0]?.[0]
                        ?.transcript || "";


                const cleanAnswer =
                    spokenText.trim();


                setStudentAnswer(
                    cleanAnswer
                );


                setIsListening(false);


                if (cleanAnswer) {

                    await checkAnswer(
                        cleanAnswer
                    );
                }
            };


        recognition.onerror =
            (event) => {

                console.log(
                    "Speech Recognition Error:",
                    event.error
                );


                setIsListening(false);


                if (
                    event.error !==
                        "no-speech" &&
                    event.error !==
                        "aborted"
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
       BACKEND
    ========================================= */

    const checkAnswer =
        async (spokenText) => {

            if (!spokenText?.trim()) {
                return;
            }


            setLoading(true);


            try {

                const response =
                    await fetch(
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
                                    userName ||
                                    "Student"
                            })
                        }
                    );


                const data =
                    await response.json();


                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Unable to evaluate answer."
                    );
                }


                /* =========================
                   SAFE MARKS
                ========================= */

                const questionScore =
                    Math.max(
                        0,
                        Math.min(
                            question.marks,
                            Number(data.marks) || 0
                        )
                    );


                /* =========================
                   ANSWER RESULT
                ========================= */

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
                        data.grammarCorrect !==
                        false,

                    answer_correct:
                        data.answerCorrect ===
                        true,

                    correction:
                        data.correction || "",

                    feedback:
                        data.feedback || "",

                    mistakes:
                        Array.isArray(
                            data.mistakes
                        )
                            ? data.mistakes
                            : []
                };


                /* =========================
                   UPDATED SCORE
                ========================= */

                const updatedScore =
                    score +
                    questionScore;


                setScore(
                    updatedScore
                );


                /* =========================
                   ANSWERS
                ========================= */

                const updatedAnswers = [

                    ...answers,

                    answerResult

                ];


                setAnswers(
                    updatedAnswers
                );


                /* =========================
                   TEACHER FEEDBACK
                ========================= */

                const feedbackText =
                    data.feedback ||

                    `You scored ${questionScore} out of ${question.marks} marks.`;


                speak(
                    feedbackText
                );


                /* =========================
                   LAST QUESTION
                ========================= */

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


                /* =========================
                   NEXT QUESTION
                ========================= */

                moveTimerRef.current =
                    setTimeout(() => {

                        setCurrentQuestion(
                            prev =>
                                prev + 1
                        );

                    }, 2200);

            }

            catch (error) {

                console.error(
                    "Final Challenge 2 Check Error:",
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
       FINISH CHALLENGE
       SAVE TO MONGODB
    ========================================= */

    const finishChallenge =
        async (
            completedAnswers,
            finalScore
        ) => {

            setTestFinished(true);


            const completedMessage =
                "Amazing! You completed the Final Partner Challenge!";


            setTeacherMessage(
                completedMessage
            );


            speak(
                completedMessage
            );


            try {

                const response =
                    await fetch(
                        `${import.meta.env.VITE_API_URL}/api/final-challenge/save-result`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                userName:
                                    userName ||
                                    "Student",

                                topicId:
                                    Number(
                                        topicId
                                    ) || 2,

                                lessonId:
                                    Number(
                                        lessonId
                                    ) || 4,

                                totalMarks:
                                    25,

                                answers:
                                    completedAnswers
                            })
                        }
                    );


                const data =
                    await response.json();


                if (
                    !response.ok ||
                    !data.success
                ) {

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
                        data.totalMarks ??
                        25,

                    obtainedMarks:
                        data.obtainedMarks ??
                        finalScore,

                    percentage:
                        data.percentage ??
                        0,

                    grade:
                        data.grade || "",

                    answers:
                        completedAnswers,

                    mistakes:
                        data.grammarMistakes ||
                        [],

                    grammarMistakes:
                        data.grammarMistakes ||
                        [],

                    feedback:
                        "You completed the Final Partner Challenge.",

                    resultId:
                        data.resultId ||
                        null
                };


                setTimeout(() => {

                    if (onNext) {

                        onNext(
                            resultData
                        );
                    }

                }, 1800);

            }

            catch (error) {

                console.error(
                    "Save Final Challenge 2 Error:",
                    error
                );


                /* =========================
                   FALLBACK RESULT
                ========================= */

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
                                (
                                    finalScore /
                                    25
                                ) * 100
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
                                                mistake.mistake ||
                                                "",

                                            correction:
                                                mistake.correction ||
                                                "",

                                            urdu_explanation:
                                                mistake.urduExplanation ||
                                                ""
                                        })
                                    )
                                    : []
                        ),

                    grammarMistakes:
                        [],

                    feedback:
                        "You completed the Final Partner Challenge.",

                    resultId:
                        null
                };


                setTimeout(() => {

                    if (onNext) {

                        onNext(
                            fallbackResult
                        );
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


            if (
                typingTimerRef.current
            ) {

                clearInterval(
                    typingTimerRef.current
                );
            }


            if (
                moveTimerRef.current
            ) {

                clearTimeout(
                    moveTimerRef.current
                );
            }


            if (
                recognitionRef.current
            ) {

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

            <div className="finalchallenge2-activity-container">

                <div className="finalchallenge2-activity-card">

                    <div className="finalchallenge2-complete-section">

                        <img
                            src={
                                teacherFrames[
                                    frame
                                ]
                            }
                            alt="Teacher"
                            className="finalchallenge2-teacher-img"
                        />


                        <h1>
                            🎉 Final Challenge Completed!
                        </h1>


                        <div className="finalchallenge2-score-preview">

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
       MAIN ACTIVITY
    ========================================= */

    return (

        <div className="finalchallenge2-activity-container">

            <div className="finalchallenge2-activity-card">


                {/* ================= HEADER ================= */}

                <div className="finalchallenge2-activity-header">

                    <button
                        className="finalchallenge2-back-btn"
                        onClick={onBack}
                        disabled={
                            loading ||
                            isListening
                        }
                    >
                        ← Back
                    </button>


                    <div className="finalchallenge2-activity-title">

                        <h1>
                            Final Challenge
                        </h1>

                        <p>
                            Partner Speaking Assessment
                        </p>

                    </div>


                    <div className="finalchallenge2-progress">

                        {currentQuestion + 1}

                        {" / "}

                        {challenges.length}

                    </div>

                </div>


                {/* ================= CATEGORY ================= */}

                <div className="finalchallenge2-category">

                    Challenge{" "}
                    {currentQuestion + 1}

                    <span>
                        {question.category}
                    </span>

                </div>


                {/* ================= TEACHER ================= */}

                <div className="finalchallenge2-teacher-section">

                    <img
                        src={
                            teacherFrames[
                                frame
                            ]
                        }
                        alt="Teacher"
                        className={
                            isSpeaking
                                ? "finalchallenge2-teacher-img speaking"
                                : "finalchallenge2-teacher-img"
                        }
                    />


                    <div className="finalchallenge2-speech-box">

                        <p>
                            {teacherMessage ||
                                question.question}
                        </p>

                    </div>

                </div>


                {/* ================= ANSWER ================= */}

                <div className="finalchallenge2-answer-section">

                    <div className="finalchallenge2-answer-label">

                        🎤 Your Answer

                    </div>


                    <div className="finalchallenge2-answer-box">

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


                {/* ================= MICROPHONE ================= */}

                <div className="finalchallenge2-mic-section">

                    <button
                        className={
                            isListening
                                ? "finalchallenge2-mic-btn listening"
                                : "finalchallenge2-mic-btn"
                        }
                        onClick={
                            startListening
                        }
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

                <div className="finalchallenge2-bottom-info">

                    <span>

                        Challenge{" "}
                        {currentQuestion + 1}

                        {" of "}

                        {challenges.length}

                    </span>


                    <span>

                        Current Score:{" "}
                        {score}
                        {" / 25"}

                    </span>

                </div>

            </div>

        </div>
    );
}

export default FinalChallenge2Activity;