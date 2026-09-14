import React, { useEffect, useState } from "react";

import "./GameShowGuessMyPreferenceIntro.css";


function GameShowGuessMyPreferenceIntro({ onFinish }) {

    const [show, setShow] = useState(false);


    useEffect(() => {

        const showTimer = setTimeout(() => {

            setShow(true);

        }, 100);


        const hideTimer = setTimeout(() => {

            setShow(false);

            setTimeout(() => {

                onFinish?.();

            }, 300);

        }, 1500);


        return () => {

            clearTimeout(showTimer);
            clearTimeout(hideTimer);

        };

    }, [onFinish]);


    return (

        <div className="game-show-preference-intro-container">

            <div
                className={
                    show
                        ? "game-show-preference-intro-popup show"
                        : "game-show-preference-intro-popup"
                }
            >

                <div className="game-show-preference-intro-icon">
                    🎤
                </div>

                <h1>
                    Guess My
                    <br />
                    Preference!
                </h1>

            </div>

        </div>

    );

}


export default GameShowGuessMyPreferenceIntro;