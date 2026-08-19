import React, { useState } from "react";

function FavouritePersonActivity5({
    topicId,
    lessonId,
    userName,
    onNext,
    onBack
}) {

    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);

    const prompts = [
        "Who is your favourite person?",
        "What is this person like?",
        "Why do you like this person?"
    ];


    /* =========================================
       CHECK ESSAY
    ========================================= */

    const handleCheckAnswer = async () => {

        if (!answer.trim()) {

            setFeedback(
                "Please write your paragraph first."
            );

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

                        activity: "favourite-person-essay",

                        currentQuestion:
                            "Write a short paragraph about your favourite person. Include who the person is, what the person is like, and why you like the person."

                    })
                }
            );

            const data = await response.json();

            setFeedback(
                data.response ||
                "Good job! Your paragraph is clear."
            );

        } catch (error) {

            console.error(
                "Favourite Person Essay Error:",
                error
            );

            setFeedback(
                "Good try! Check your sentences and try again."
            );

        } finally {

            setLoading(false);

        }

    };


    /* =========================================
       FINISH ACTIVITY
    ========================================= */

    const handleFinish = () => {

        if (!answer.trim()) {

            setFeedback(
                "Please write your paragraph first."
            );

            return;
        }

        if (onNext) {

            onNext({

                answer: answer,

                activity: "favourite-person-essay"

            });

        }

    };


    /* =========================================
       BACK BUTTON
    ========================================= */

    const handleBack = () => {

        if (onBack) {
            onBack();
        }

    };


    return (

        <div className="favourite-person-essay-container">

            {/* =================================
                HEADER
            ================================= */}

            <div className="favourite-person-essay-header">

                <button
                    className="favourite-person-back-button"
                    onClick={handleBack}
                >
                    ← Back
                </button>

                <div className="favourite-person-essay-title">
                    Activity 5
                </div>

            </div>


            {/* =================================
                MAIN CARD
            ================================= */}

            <div className="favourite-person-essay-card">

                <div className="favourite-person-essay-icon">
                    📝
                </div>

                <h1>
                    Write About Your Favourite Person
                </h1>

                <p className="favourite-person-essay-description">
                    Write a short paragraph of 4–6 sentences about your favourite person.
                </p>


                {/* =================================
                    HELPFUL PROMPTS
                ================================= */}

                <div className="favourite-person-prompts">

                    <h3>
                        Use these ideas:
                    </h3>

                    {prompts.map((prompt, index) => (

                        <div
                            className="favourite-person-prompt"
                            key={index}
                        >

                            <span>
                                {index + 1}.
                            </span>

                            <p>
                                {prompt}
                            </p>

                        </div>

                    ))}

                </div>


                {/* =================================
                    TEXT AREA
                ================================= */}

                <textarea
                    value={answer}
                    onChange={(e) =>
                        setAnswer(e.target.value)
                    }
                    placeholder="Example: My favourite person is my mother. She is kind and helpful. She always helps me. I like spending time with her because she makes me happy."
                    rows={9}
                    disabled={loading}
                />


                {/* =================================
                    WORD / SENTENCE HELP
                ================================= */}

                <div className="favourite-person-writing-tip">

                    💡 Try to write complete sentences.

                </div>


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
                        : "Check My Paragraph"}

                </button>


                {/* =================================
                    AI FEEDBACK
                ================================= */}

                {feedback && (

                    <div className="favourite-person-feedback">

                        {feedback}

                    </div>

                )}


                {/* =================================
                    FINISH
                ================================= */}

                <button
                    className="favourite-person-next-button"
                    onClick={handleFinish}
                    disabled={loading}
                >
                    Finish Activity →
                </button>

            </div>

        </div>

    );

}

export default FavouritePersonActivity5;