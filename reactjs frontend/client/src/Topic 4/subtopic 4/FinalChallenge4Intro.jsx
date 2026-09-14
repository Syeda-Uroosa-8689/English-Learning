
import React, { useEffect, useState } from "react";

import "./FinalChallenge4Intro.css";


/* =========================================
   FINAL CHALLENGE 4 INTRO
========================================= */

function FinalChallenge4Intro({
    onFinish
}) {

    const [show, setShow] =
        useState(false);


    /* =========================================
       AUTO SHOW + AUTO FINISH
    ========================================= */

    useEffect(() => {

        const showTimer =
            setTimeout(() => {

                setShow(true);

            }, 100);


        const hideTimer =
            setTimeout(() => {

                setShow(false);


                setTimeout(() => {

                    if (onFinish) {

                        onFinish();

                    }

                }, 300);

            }, 1800);


        return () => {

            clearTimeout(
                showTimer
            );

            clearTimeout(
                hideTimer
            );

        };

    }, [onFinish]);


    return (

        <div className="final-challenge4-intro-container">


            {/* =====================================
                INTRO CARD
            ===================================== */}

            <div
                className={
                    show
                        ? "final-challenge4-intro-card show"
                        : "final-challenge4-intro-card"
                }
            >


                {/* =====================================
                    ICON
                ===================================== */}

                <div className="final-challenge4-intro-icon">

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

                <p className="final-challenge4-intro-subtitle">

                    On My Calendar!

                </p>


                {/* =====================================
                    DESCRIPTION
                ===================================== */}

                <p className="final-challenge4-intro-description">

                    Show everything you have learned about
                    days, months, daily routines, and making
                    plans through five exciting speaking
                    challenges!

                </p>


                {/* =====================================
                    CHALLENGE PREVIEW
                ===================================== */}

                <div className="final-challenge4-preview">


                    {/* =================================
                        CHALLENGE 1
                    ================================= */}

                    <div className="final-challenge4-preview-item">

                        <span>
                            📅
                        </span>

                        <p>
                            Days & Months
                        </p>

                    </div>


                    {/* =================================
                        CHALLENGE 2
                    ================================= */}

                    <div className="final-challenge4-preview-item">

                        <span>
                            ⏰
                        </span>

                        <p>
                            Daily Routine
                        </p>

                    </div>


                    {/* =================================
                        CHALLENGE 3
                    ================================= */}

                    <div className="final-challenge4-preview-item">

                        <span>
                            🗓️
                        </span>

                        <p>
                            Making Plans
                        </p>

                    </div>


                    {/* =================================
                        CHALLENGE 4
                    ================================= */}

                    <div className="final-challenge4-preview-item">

                        <span>
                            🌟
                        </span>

                        <p>
                            A Busy Day
                        </p>

                    </div>


                    {/* =================================
                        CHALLENGE 5
                    ================================= */}

                    <div className="final-challenge4-preview-item">

                        <span>
                            ✨
                        </span>

                        <p>
                            My Perfect Week
                        </p>

                    </div>


                </div>


                {/* =====================================
                    FINAL INFO
                ===================================== */}

                <div className="final-challenge4-total">

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


export default FinalChallenge4Intro;

