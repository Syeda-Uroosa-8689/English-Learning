import React from "react";

import "./FinalChallenge1Result.css";

function FinalChallenge1Result({
    result,
    onNext,
    onRetry,
    onBack
}) {

    /* =========================================
       SAFE RESULT DATA
    ========================================= */

    const score =
        Number(result?.score) || 0;

    const totalMarks =
        Number(result?.totalMarks) || 25;

    const mistakes =
        Array.isArray(result?.mistakes)
            ? result.mistakes
            : [];

    const feedback =
        result?.feedback || "";

    const answers =
        Array.isArray(result?.answers)
            ? result.answers
            : [];


    /* =========================================
       PERCENTAGE
    ========================================= */

    const percentage =
        totalMarks > 0
            ? Math.round(
                (score / totalMarks) * 100
            )
            : 0;


    /* =========================================
       RESULT MESSAGE
    ========================================= */

    const getResultMessage = () => {

        if (percentage >= 90) {

            return "Excellent! You completed the Final Challenge brilliantly.";

        }

        if (percentage >= 75) {

            return "Great job! You showed strong English speaking skills.";

        }

        if (percentage >= 60) {

            return "Good effort! Keep practicing to become even more confident.";

        }

        return "Keep practicing! Every challenge helps you improve your English.";

    };


    /* =========================================
       ANSWER COUNT
    ========================================= */

    const completedChallenges =
        answers.length;


    return (

        <div className="finalchallenge1-result-container">

            <div className="finalchallenge1-result-card">


                {/* =========================================
                   HEADER
                ========================================= */}

                <div className="finalchallenge1-result-header">

                    <div className="finalchallenge1-result-trophy">
                        🏆
                    </div>

                    <h1>
                        Final Challenge Result
                    </h1>

                    <p>
                        You have completed all five challenges!
                    </p>

                </div>


                {/* =========================================
                   SCORE
                ========================================= */}

                <div className="finalchallenge1-score-section">

                    <div className="finalchallenge1-score-circle">

                        <span className="finalchallenge1-score-number">
                            {score}
                        </span>

                        <span className="finalchallenge1-score-total">
                            / {totalMarks}
                        </span>

                    </div>


                    <div className="finalchallenge1-score-info">

                        <h2>
                            {percentage}%
                        </h2>

                        <p>
                            {getResultMessage()}
                        </p>

                    </div>

                </div>


                {/* =========================================
                   CHALLENGE SUMMARY
                ========================================= */}

                <div className="finalchallenge1-summary-card">

                    <div>
                        <span className="finalchallenge1-summary-icon">
                            🎯
                        </span>

                        <strong>
                            Challenges Completed
                        </strong>

                    </div>

                    <span>
                        {completedChallenges} / 5
                    </span>

                </div>


                {/* =========================================
                   TEACHER FEEDBACK
                ========================================= */}

                {feedback && (

                    <div className="finalchallenge1-feedback-card">

                        <h2>
                            💬 Teacher Feedback
                        </h2>

                        <p>
                            {feedback}
                        </p>

                    </div>

                )}


                {/* =========================================
                   MISTAKES SECTION
                ========================================= */}

                <div className="finalchallenge1-mistakes-section">

                    <div className="finalchallenge1-mistakes-title">

                        <h2>
                            📝 Grammar & Speaking Review
                        </h2>

                        <span>
                            {mistakes.length} mistake
                            {mistakes.length !== 1
                                ? "s"
                                : ""}
                        </span>

                    </div>


                    {mistakes.length === 0 ? (

                        <div className="finalchallenge1-no-mistakes">

                            <div className="finalchallenge1-perfect-icon">
                                🎉
                            </div>

                            <h3>
                                Excellent!
                            </h3>

                            <p>
                                No major grammar mistakes were found
                                in your challenge answers.
                            </p>

                        </div>

                    ) : (

                        <div className="finalchallenge1-mistakes-list">

                            {mistakes.map(
                                (mistake, index) => (

                                    <div
                                        className="finalchallenge1-mistake-card"
                                        key={index}
                                    >

                                        {/* NUMBER */}

                                        <div className="finalchallenge1-mistake-number">

                                            {index + 1}

                                        </div>


                                        {/* CONTENT */}

                                        <div className="finalchallenge1-mistake-content">


                                            {/* WRONG ANSWER */}

                                            <div className="finalchallenge1-mistake-row finalchallenge1-wrong-row">

                                                <div className="finalchallenge1-mistake-label">

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

                                            <div className="finalchallenge1-mistake-row finalchallenge1-correct-row">

                                                <div className="finalchallenge1-mistake-label">

                                                    ✅ Correct English

                                                </div>

                                                <p>

                                                    {mistake.correction ||
                                                        mistake.correct ||
                                                        "No correction available"}

                                                </p>

                                            </div>


                                            {/* URDU EXPLANATION */}

                                            <div className="finalchallenge1-mistake-row finalchallenge1-urdu-row">

                                                <div className="finalchallenge1-mistake-label">

                                                    🇵🇰 Urdu Explanation

                                                </div>

                                                <p dir="rtl">

                                                    {mistake.urduExplanation ||
                                                        mistake.explanation ||
                                                        "اس جملے میں گرامر کی غلطی تھی۔"}

                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* =========================================
                   FINAL MESSAGE
                ========================================= */}

                <div className="finalchallenge1-result-message">

                    <span>
                        ⭐
                    </span>

                    <p>
                        Keep speaking, keep practicing,
                        and keep improving your English!
                    </p>

                </div>


                {/* =========================================
                   BUTTONS
                ========================================= */}

                <div className="finalchallenge1-result-buttons">

                    <button
                        className="finalchallenge1-retry-btn"
                        onClick={onRetry}
                    >
                        ↻ Try Again
                    </button>


                    {onBack && (

                        <button
                            className="finalchallenge1-back-btn"
                            onClick={onBack}
                        >
                            ← Back
                        </button>

                    )}


                    <button
                        className="finalchallenge1-next-btn"
                        onClick={onNext}
                    >
                        Continue →
                    </button>

                </div>

            </div>

        </div>

    );

}

export default FinalChallenge1Result;