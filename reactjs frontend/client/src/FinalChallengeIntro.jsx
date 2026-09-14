import React, { useEffect, useState } from "react";

function FinalChallengeIntro({ onFinish }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const showTimer = setTimeout(() => {
            setShow(true);
        }, 100);

        const hideTimer = setTimeout(() => {
            setShow(false);

            setTimeout(() => {
                onFinish();
            }, 300);

        }, 1500);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [onFinish]);

    return (
        <div className="final-intro-container">

            <div
                className={
                    show
                        ? "final-intro-card show"
                        : "final-intro-card"
                }
            >

                <div className="final-intro-icon">
                    🏆
                </div>

                <h1>
                    Final Challenge
                </h1>

                <p className="final-intro-subtitle">
                    Show what you have learned!
                </p>

                <p className="final-intro-description">
                    This is your final English speaking challenge.
                    You will answer questions about food preferences,
                    restaurant conversations, food descriptions,
                    and giving feedback.
                </p>

                <div className="final-rules">

                    <div className="final-rule">
                        🎤
                        <span>
                            Most questions will be answered by speaking.
                        </span>
                    </div>

                    <div className="final-rule">
                        🧠
                        <span>
                            Your grammar, vocabulary and answers will be checked.
                        </span>
                    </div>

                    <div className="final-rule">
                        ⭐
                        <span>
                            Your final score will be shown at the end.
                        </span>
                    </div>

                </div>

                <div className="final-total">
                    Total Marks: <strong>25</strong>
                </div>

            </div>

        </div>
    );
}

export default FinalChallengeIntro;