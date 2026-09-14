import React, { useEffect, useState } from "react";
import "./FinalChallenge1Intro.css";


/* =========================================
   FINAL CHALLENGE 1 INTRO
========================================= */

function FinalChallenge1Intro({ onFinish }) {

    const [show, setShow] = useState(false);


    /* =========================================
       AUTO SHOW + AUTO FINISH
    ========================================= */

    useEffect(() => {

        const showTimer = setTimeout(() => {

            setShow(true);

        }, 100);


        const hideTimer = setTimeout(() => {

            setShow(false);


            setTimeout(() => {

                if (onFinish) {
                    onFinish();
                }

            }, 300);

        }, 1800);


        return () => {

            clearTimeout(showTimer);
            clearTimeout(hideTimer);

        };

    }, [onFinish]);


    return (

        <div className="final-challenge1-intro-container">


            {/* =====================================
                INTRO CARD
            ===================================== */}

            <div
                className={
                    show
                        ? "final-challenge1-intro-card show"
                        : "final-challenge1-intro-card"
                }
            >


                {/* =====================================
                    ICON
                ===================================== */}

                <div className="final-challenge1-intro-icon">
                    🏆
                </div>


                {/* =====================================
                    TITLE
                ===================================== */}

                <h1>
                    Final Challenge
                </h1>


                {/* =====================================
                    SUBTITLE
                ===================================== */}

                <p className="final-challenge1-intro-subtitle">
                    The Ultimate English Adventure!
                </p>


                {/* =====================================
                    DESCRIPTION
                ===================================== */}

                <p className="final-challenge1-intro-description">
                    Show everything you have learned about your
                    favourite hobbies, favourite places, and
                    favourite people through five exciting challenges!
                </p>


                {/* =====================================
                    CHALLENGE PREVIEW
                ===================================== */}

                <div className="final-challenge1-preview">


                    {/* CHALLENGE 1 */}

                    <div className="final-challenge1-preview-item">

                        <span>
                            🎤
                        </span>

                        <p>
                            Interaction Challenge
                        </p>

                    </div>


                    {/* CHALLENGE 2 */}

                    <div className="final-challenge1-preview-item">

                        <span>
                            🧩
                        </span>

                        <p>
                            Progressive Person Puzzle
                        </p>

                    </div>


                    {/* CHALLENGE 3 */}

                    <div className="final-challenge1-preview-item">

                        <span>
                            🛂
                        </span>

                        <p>
                            Passport Challenge
                        </p>

                    </div>


                    {/* CHALLENGE 4 */}

                    <div className="final-challenge1-preview-item">

                        <span>
                            🔀
                        </span>

                        <p>
                            Mix &amp; Fix
                        </p>

                    </div>


                    {/* CHALLENGE 5 */}

                    <div className="final-challenge1-preview-item">

                        <span>
                            🗺️
                        </span>

                        <p>
                            Mystery Memory Map
                        </p>

                    </div>


                </div>


                {/* =====================================
                    FINAL INFO
                ===================================== */}

                <div className="final-challenge1-total">

                    <span>
                        ⭐
                    </span>

                    <span>
                        5 Challenges • One Final Adventure
                    </span>

                </div>


            </div>

        </div>

    );

}


export default FinalChallenge1Intro;