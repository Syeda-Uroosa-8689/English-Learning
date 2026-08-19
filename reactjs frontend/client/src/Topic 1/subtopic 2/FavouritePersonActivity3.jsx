import React, { useState } from "react";

function FavouritePersonActivity3({
    topicId,
    lessonId,
    userName,
    onNext,
    onBack
}) {

    const questions = [
        {
            id: 1,
            question: "Who is your favourite person?",
            placeholder: "Example: My favourite person is my mother."
        },
        {
            id: 2,
            question: "What does your favourite person look like?",
            placeholder: "Example: She has long black hair."
        },
        {
            id: 3,
            question: "Why do you like this person?",
            placeholder: "Example: I like her because she is kind."
        }
    ];

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answer, setAnswer] = useState("");
    const [answers, setAnswers] = useState([]);
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);

    const question = questions[currentQuestion];

    /* =========================================
       CHECK ANSWER WITH BACKEND AI
    ========================================= */

    const handleCheckAnswer = async () => {

        if (!answer.trim()) {
            setFeedback("Please write your answer first.");
            return;
        }

        setLoading(true);
        setFeedback("");

        try {

            const response = await fetch(
                "http://localhost:5000/api/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        message: answer,

                        history: [],

                        topicId: topicId || 1,

                        lessonId: lessonId || 2,

                        userName: userName || "Student",

                        activity: "favourite-person",

                        currentQuestion: question.question

                    })

                }
            );

            const data = await response.json();

            setFeedback(
                data.response ||
                "Good job! Let's continue."
            );

        } catch (error) {

            console.error(
                "Favourite Person AI Error:",
                error
            );

            setFeedback(
                "Good try! Let's continue."
            );

        } finally {

            setLoading(false);

        }

    };


    /* =========================================
       NEXT QUESTION
    ========================================= */

    const handleNext = () => {

        if (!answer.trim()) {
            setFeedback("Please write your answer first.");
            return;
        }

        const newAnswer = {

            questionId: question.id,

            question: question.question,

            userAnswer: answer

        };

        const updatedAnswers = [
            ...answers,
            newAnswer
        ];

        setAnswers(updatedAnswers);

        setFeedback("");

        setAnswer("");

        if (
            currentQuestion <
            questions.length - 1
        ) {

            setCurrentQuestion(
                currentQuestion + 1
            );

        } else {

            if (onNext) {

                onNext({
                    answers: updatedAnswers
                });

            }

        }

    };


    /* =========================================
       BACK
    ========================================= */

    const handleBack = () => {

        if (currentQuestion > 0) {

            setCurrentQuestion(
                currentQuestion - 1
            );

            setFeedback("");

            setAnswer("");

        } else {

            if (onBack) {
                onBack();
            }

        }

    };


    return (

        <div className="favourite-person-activity-container">

            {/* =================================
                HEADER
            ================================= */}

            <div className="favourite-person-activity-header">

                <button
                    className="favourite-person-back-button"
                    onClick={handleBack}
                >
                    ← Back
                </button>

                <div className="favourite-person-progress">

                    Question {currentQuestion + 1} of{" "}
                    {questions.length}

                </div>

            </div>


            {/* =================================
                ACTIVITY CARD
            ================================= */}

            <div className="favourite-person-activity-card">

                <div className="favourite-person-activity-icon">
                    🎤
                </div>

                <h1>
                    Talk About Your Favourite Person
                </h1>

                <p className="favourite-person-question">
                    {question.question}
                </p>


                {/* =================================
                    ANSWER BOX
                ================================= */}

                <textarea
                    value={answer}
                    onChange={(e) =>
                        setAnswer(e.target.value)
                    }
                    placeholder={question.placeholder}
                    rows={5}
                    disabled={loading}
                />


                {/* =================================
                    AI CHECK
                ================================= */}

                <button
                    className="favourite-person-check-button"
                    onClick={handleCheckAnswer}
                    disabled={loading}
                >

                    {loading
                        ? "Checking..."
                        : "Check My Answer"}

                </button>


                {/* =================================
                    FEEDBACK
                ================================= */}

                {feedback && (

                    <div className="favourite-person-feedback">

                        {feedback}

                    </div>

                )}


                {/* =================================
                    NEXT
                ================================= */}

                <button
                    className="favourite-person-next-button"
                    onClick={handleNext}
                    disabled={loading}
                >

                    {currentQuestion ===
                    questions.length - 1
                        ? "Finish Activity"
                        : "Next →"}

                </button>

            </div>

        </div>

    );

}

export default FavouritePersonActivity3;