import React, { useEffect, useState } from "react";

function PracticeExerciseIntro({ onNext }) {

    const [show, setShow] = useState(false);

    useEffect(() => {

        // Popup enter animation
        const enterTimer = setTimeout(() => {
            setShow(true);
        }, 100);

        // Popup exit
        const exitTimer = setTimeout(() => {

            setShow(false);

            // Exit animation ke baad Teacher Intro
            setTimeout(() => {
                onNext();
            }, 500);

        }, 4000);

        return () => {
            clearTimeout(enterTimer);
            clearTimeout(exitTimer);
        };

    }, [onNext]);

    return (

        <div className="practice-intro-container">

            <div
                className={
                    show
                        ? "practice-intro-popup show"
                        : "practice-intro-popup"
                }
            >

                <h1>
                    Practice Exercise
                </h1>

            </div>

        </div>

    );
}

export default PracticeExerciseIntro;