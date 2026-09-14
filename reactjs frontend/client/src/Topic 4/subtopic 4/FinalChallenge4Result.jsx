
import React from "react";

import "./FinalChallenge4Result.css";


/* =========================================
   FINAL CHALLENGE 4 RESULT PAGE
========================================= */

function FinalChallenge4Result({
    result,
    onNext,
    onRetry,
    onBack
}) {

    /* =========================================
       SAFE RESULT DATA
    ========================================= */

    const score =
        Number(
            result?.score ??
            result?.obtainedMarks
        ) || 0;


    const totalMarks =
        Number(
            result?.totalMarks
        ) || 25;


    const mistakes =
        Array.isArray(
            result?.mistakes
        )
            ? result.mistakes
            : [];


    const grammarMistakes =
        Array.isArray(
            result?.grammarMistakes
        )
            ? result.grammarMistakes
            : [];


    const allMistakes =
        grammarMistakes.length > 0
            ? grammarMistakes
            : mistakes;


    const feedback =
        result?.feedback || "";


    const answers =
        Array.isArray(
            result?.answers
        )
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

            return "Excellent! You completed the Final Calendar Challenge brilliantly.";

        }


        if (percentage >= 75) {

            return "Great job! You showed strong English skills across days, routines, and plans.";

        }


        if (percentage >= 60) {

            return "Good effort! Keep practicing your calendar, routine, and planning English.";

        }


        return "Keep practicing! Every challenge helps you become a more confident English speaker.";

    };


    /* =========================================
       ANSWER COUNT
    ========================================= */

    const completedChallenges =
        answers.length;


    /* =========================================
       SAFE MISTAKE TEXT
    ========================================= */

    const getWrongText = (mistake) => {

        return (
            mistake?.original ||
            mistake?.userAnswer ||
            mistake?.wrong ||
            mistake?.mistake ||
            "No answer available"
        );

    };


    const getCorrectionText = (mistake) => {

        return (
            mistake?.correction ||
            mistake?.correct ||
            "No correction available"
        );

    };


    const getExplanationText = (mistake) => {

        return (
            mistake?.urduExplanation ||
            mistake?.urdu_explanation ||
            mistake?.explanation ||
            "This sentence had a grammar mistake."
        );

    };


    return (

        <div className="finalchallenge4-result-container">

            <div className="finalchallenge4-result-card">


                {/* =========================================
                   HEADER
                ========================================= */}

                <div className="finalchallenge4-result-header">

                    <div className="finalchallenge4-result-trophy">
                        🏆
                    </div>


                    <h1>
                        Final Challenge Result
                    </h1>


                    <p>
                        You have completed all five calendar challenges!
                    </p>

                </div>


                {/* =========================================
                   SCORE SECTION
                ========================================= */}

                <div className="finalchallenge4-score-section">


                    <div className="finalchallenge4-score-circle">

                        <span className="finalchallenge4-score-number">

                            {score}

                        </span>


                        <span className="finalchallenge4-score-total">

                            / {totalMarks}

                        </span>

                    </div>


                    <div className="finalchallenge4-score-info">

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

                <div className="finalchallenge4-summary-card">

                    <div>

                        <span className="finalchallenge4-summary-icon">
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
                   TOPIC SKILLS
                ========================================= */}

                <div className="finalchallenge4-skills-card">


                    <div className="finalchallenge4-skill-item">

                        <span>
                            📅
                        </span>

                        <strong>
                            Days & Months
                        </strong>

                    </div>


                    <div className="finalchallenge4-skill-item">

                        <span>
                            ⏰
                        </span>

                        <strong>
                            Daily Routine
                        </strong>

                    </div>


                    <div className="finalchallenge4-skill-item">

                        <span>
                            🗓️
                        </span>

                        <strong>
                            Making Plans
                        </strong>

                    </div>

                </div>


                {/* =========================================
                   TEACHER FEEDBACK
                ========================================= */}

                {feedback && (

                    <div className="finalchallenge4-feedback-card">

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

                <div className="finalchallenge4-mistakes-section">


                    <div className="finalchallenge4-mistakes-title">

                        <h2>
                            📝 Grammar & Speaking Review
                        </h2>


                        <span>

                            {allMistakes.length} mistake
                            {allMistakes.length !== 1
                                ? "s"
                                : ""}

                        </span>

                    </div>


                    {allMistakes.length === 0 ? (

                        <div className="finalchallenge4-no-mistakes">


                            <div className="finalchallenge4-perfect-icon">
                                🎉
                            </div>


                            <h3>
                                Excellent!
                            </h3>


                            <p>
                                No major grammar mistakes were found
                                in your calendar challenge answers.
                            </p>

                        </div>

                    ) : (

                        <div className="finalchallenge4-mistakes-list">

                            {allMistakes.map(
                                (mistake, index) => (

                                    <div
                                        className="finalchallenge4-mistake-card"
                                        key={index}
                                    >


                                        {/* NUMBER */}

                                        <div className="finalchallenge4-mistake-number">

                                            {index + 1}

                                        </div>


                                        {/* CONTENT */}

                                        <div className="finalchallenge4-mistake-content">


                                            {/* WRONG ANSWER */}

                                            <div className="finalchallenge4-mistake-row finalchallenge4-wrong-row">

                                                <div className="finalchallenge4-mistake-label">

                                                    ❌ You said

                                                </div>


                                                <p>

                                                    {getWrongText(
                                                        mistake
                                                    )}

                                                </p>

                                            </div>


                                            {/* CORRECTION */}

                                            <div className="finalchallenge4-mistake-row finalchallenge4-correct-row">

                                                <div className="finalchallenge4-mistake-label">

                                                    ✅ Correct English

                                                </div>


                                                <p>

                                                    {getCorrectionText(
                                                        mistake
                                                    )}

                                                </p>

                                            </div>


                                            {/* ROMAN ENGLISH EXPLANATION */}

                                            <div className="finalchallenge4-mistake-row finalchallenge4-urdu-row">

                                                <div className="finalchallenge4-mistake-label">

                                                    💡 Explanation

                                                </div>


                                                <p>

                                                    {getExplanationText(
                                                        mistake
                                                    )}

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

                <div className="finalchallenge4-result-message">

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

                <div className="finalchallenge4-result-buttons">


                    <button
                        className="finalchallenge4-retry-btn"
                        onClick={onRetry}
                    >
                        ↻ Try Again
                    </button>


                    {onBack && (

                        <button
                            className="finalchallenge4-back-btn"
                            onClick={onBack}
                        >
                            ← Back
                        </button>

                    )}


                    <button
                        className="finalchallenge4-next-btn"
                        onClick={onNext}
                    >
                        Continue →
                    </button>

                </div>


            </div>

        </div>

    );

}


export default FinalChallenge4Result;

