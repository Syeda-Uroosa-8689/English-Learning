import React, { useState } from "react";

function FavouritePersonActivity4({
    topicId,
    lessonId,
    userName,
    onNext,
    onBack
}) {

    const questions = [
        {
            id: 1,
            question: "What is your favourite person's name?",
            placeholder: "Example: Her name is Sara."
        },
        {
            id: 2,
            question: "What is one good quality of this person?",
            placeholder: "Example: She is kind and helpful."
        },
        {
            id: 3,
            question: "What do you like to do with this person?",
            placeholder: "Example: I like to talk and play with her."
        }
    ];

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answer, setAnswer] = useState("");
    const [answers, setAnswers] = useState([]);
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);

    const question = questions[currentQuestion];


    /* =========================================
       CHECK ANSWER
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

                        activity: "favourite-person-description",

                        currentQuestion: question.question

                    })
                }
            );

            const data = await response.json();

            setFeedback(
                data.response ||
                "Good job! Your answer is clear."
            );

        } catch (error) {

            console.error(
                "Favourite Person Activity 4 Error:",
                error
            );

            setFeedback(
                "Good try! Keep describing your favourite person."
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

            setFeedback(
                "Please write your answer first."
            );

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
       BACK BUTTON
    ========================================= */

    const handleBack = () => {

        if (currentQuestion > 0) {

            setCurrentQuestion(
                currentQuestion - 1
            );

            setAnswer("");

            setFeedback("");

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
                MAIN CARD
            ================================= */}

            <div className="favourite-person-activity-card">

                <div className="favourite-person-activity-icon">
                    👤
                </div>

                <h1>
                    Describe Your Favourite Person
                </h1>

                <p className="favourite-person-question">
                    {question.question}
                </p>


                {/* =================================
                    ANSWER
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
                    CHECK BUTTON
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
                    NEXT BUTTON
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

export default FavouritePersonActivity4;