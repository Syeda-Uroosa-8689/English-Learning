import React from "react";

function FinalChallengeResult({
    score = 0,
    totalMarks = 20,
    mistakes = [],
    feedback = "",
    onNext,
    onRetry
}) {

    const percentage = Math.round(
        (score / totalMarks) * 100
    );

    const getResultMessage = () => {

        if (percentage >= 90) {
            return "Excellent! Your English is very strong.";
        }

        if (percentage >= 75) {
            return "Great job! You are improving very well.";
        }

        if (percentage >= 60) {
            return "Good effort! Keep practicing your English.";
        }

        return "Keep practicing! You can improve with more speaking practice.";
    };

    return (

        <div className="final-result-container">

            <div className="final-result-card">

                {/* ================= HEADER ================= */}

                <div className="final-result-header">

                    <div className="final-result-trophy">
                        🏆
                    </div>

                    <h1>
                        Final Challenge Result
                    </h1>

                    <p>
                        You have completed the Final Challenge!
                    </p>

                </div>


                {/* ================= SCORE ================= */}

                <div className="final-score-section">

                    <div className="score-circle">

                        <span className="score-number">
                            {score}
                        </span>

                        <span className="score-total">
                            / {totalMarks}
                        </span>

                    </div>

                    <div className="score-info">

                        <h2>
                            {percentage}%
                        </h2>

                        <p>
                            {getResultMessage()}
                        </p>

                    </div>

                </div>


                {/* ================= AI FEEDBACK ================= */}

                {feedback && (

                    <div className="final-feedback-card">

                        <h2>
                            💬 Teacher Feedback
                        </h2>

                        <p>
                            {feedback}
                        </p>

                    </div>

                )}


                {/* ================= MISTAKES ================= */}

                <div className="mistakes-section">

                    <div className="mistakes-title">

                        <h2>
                            📝 Grammar & Speaking Review
                        </h2>

                        <span>
                            {mistakes.length} mistake
                            {mistakes.length !== 1 ? "s" : ""}
                        </span>

                    </div>


                    {mistakes.length === 0 ? (

                        <div className="no-mistakes">

                            <div className="perfect-icon">
                                🎉
                            </div>

                            <h3>
                                Excellent!
                            </h3>

                            <p>
                                No major grammar mistakes were found
                                in your answers.
                            </p>

                        </div>

                    ) : (

                        <div className="mistakes-list">

                            {mistakes.map((mistake, index) => (

                                <div
                                    className="mistake-card"
                                    key={index}
                                >

                                    {/* ================= MISTAKE NUMBER ================= */}

                                    <div className="mistake-number">

                                        {index + 1}

                                    </div>


                                    <div className="mistake-content">

                                        {/* WRONG */}

                                        <div className="mistake-row wrong-row">

                                            <div className="mistake-label">

                                                ❌ You said

                                            </div>

                                            <p>
                                                {mistake.original ||
                                                    mistake.userAnswer ||
                                                    mistake.wrong ||
                                                    "No answer available"}
                                            </p>

                                        </div>


                                        {/* CORRECTION */}

                                        <div className="mistake-row correct-row">

                                            <div className="mistake-label">

                                                ✅ Correct English

                                            </div>

                                            <p>
                                                {mistake.correction ||
                                                    mistake.correct ||
                                                    "No correction available"}
                                            </p>

                                        </div>


                                        {/* URDU EXPLANATION */}

                                        <div className="mistake-row urdu-row">

                                            <div className="mistake-label">

                                                🇵🇰 Urdu Explanation

                                            </div>

                                            <p dir="rtl">

                                                {mistake.urduExplanation ||
                                                    mistake.explanation ||
                                                    "Is sentence mein grammar ki ghalti thi."}

                                            </p>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>


                {/* ================= FINAL MESSAGE ================= */}

                <div className="final-result-message">

                    <span>
                        ⭐
                    </span>

                    <p>
                        Keep speaking, keep practicing,
                        and keep improving your English!
                    </p>

                </div>


                {/* ================= BUTTONS ================= */}

                <div className="final-result-buttons">

                    <button
                        className="final-retry-btn"
                        onClick={onRetry}
                    >
                        ↻ Try Again
                    </button>

                    <button
                        className="final-next-btn"
                        onClick={onNext}
                    >
                        Continue →
                    </button>

                </div>

            </div>

        </div>

    );
}

export default FinalChallengeResult;