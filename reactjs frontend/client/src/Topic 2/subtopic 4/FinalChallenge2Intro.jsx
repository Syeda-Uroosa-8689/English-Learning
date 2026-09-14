import React, { useEffect, useState } from "react";
import "./FinalChallenge2Intro.css";


/* =========================================
   FINAL CHALLENGE 2 INTRO
========================================= */

function FinalChallenge2Intro({ onFinish }) {

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

        <div className="final-challenge2-intro-container">


            {/* =====================================
                INTRO CARD
            ===================================== */}

            <div
                className={
                    show
                        ? "final-challenge2-intro-card show"
                        : "final-challenge2-intro-card"
                }
            >


                {/* =====================================
                    ICON
                ===================================== */}

                <div className="final-challenge2-intro-icon">
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

                <p className="final-challenge2-intro-subtitle">
                    All About My Partner!
                </p>


                {/* =====================================
                    DESCRIPTION
                ===================================== */}

                <p className="final-challenge2-intro-description">

                    Show everything you have learned about your
                    partner's appearance, personality, likes,
                    and dislikes through five exciting challenges!

                </p>


                {/* =====================================
                    CHALLENGE PREVIEW
                ===================================== */}

                <div className="final-challenge2-preview">


                    {/* CHALLENGE 1 */}

                    <div className="final-challenge2-preview-item">

                        <span>
                            👤
                        </span>

                        <p>
                            Partner Profile
                        </p>

                    </div>


                    {/* CHALLENGE 2 */}

                    <div className="final-challenge2-preview-item">

                        <span>
                            🔍
                        </span>

                        <p>
                            Feature Detective
                        </p>

                    </div>


                    {/* CHALLENGE 3 */}

                    <div className="final-challenge2-preview-item">

                        <span>
                            🧠
                        </span>

                        <p>
                            Personality Match
                        </p>

                    </div>


                    {/* CHALLENGE 4 */}

                    <div className="final-challenge2-preview-item">

                        <span>
                            ❤️
                        </span>

                        <p>
                            Like or Dislike
                        </p>

                    </div>


                    {/* CHALLENGE 5 */}

                    <div className="final-challenge2-preview-item">

                        <span>
                            🧩
                        </span>

                        <p>
                            Mystery Partner
                        </p>

                    </div>


                </div>


                {/* =====================================
                    FINAL INFO
                ===================================== */}

                <div className="final-challenge2-total">

                    <span>
                        ⭐
                    </span>

                    <span>
                        5 Challenges • 25 Marks • One Final Mission
                    </span>

                </div>


            </div>

        </div>

    );

}


export default FinalChallenge2Intro;