import React, { useEffect, useState } from "react";
import "./LessonComplete.css";
function LessonComplete({ onFinish }) {

    const [show, setShow] = useState(false);

    useEffect(() => {

        // Popup enter animation
        const enterTimer = setTimeout(() => {

            setShow(true);

        }, 100);


        // Popup exit
        const exitTimer = setTimeout(() => {

            setShow(false);

            // Wait for exit animation
            setTimeout(() => {

                onFinish();

            }, 500);

        }, 4500);


        return () => {

            clearTimeout(enterTimer);

            clearTimeout(exitTimer);

        };

    }, [onFinish]);


    return (

        <div className="lesson-complete-container">

            <div
                className={
                    show
                        ? "lesson-complete-popup show"
                        : "lesson-complete-popup"
                }
            >

                {/* ==================================
                            ICON
                ================================== */}

                <div className="lesson-complete-icon">

                    🎉🏆

                </div>


                {/* ==================================
                            TITLE
                ================================== */}

                <h1>

                    Lesson Completed!

                </h1>


                {/* ==================================
                            CONGRATULATIONS
                ================================== */}

                <h2>

                    Congratulations! 🌟

                </h2>


                {/* ==================================
                            MESSAGE
                ================================== */}

                <p>

                    Amazing work!
                    You have successfully completed
                    the Restaurant Conversation lesson.

                </p>


                {/* ==================================
                            SMALL MESSAGE
                ================================== */}

                <div className="lesson-complete-message">

                    🍽️ Great job!
                    You are now ready to use
                    restaurant conversations in English.

                </div>

            </div>

        </div>

    );

}

export default LessonComplete;