import React, { useEffect, useState } from "react";

import "./MysteryGiftMissionIntro.css";


function MysteryGiftMissionIntro({ onFinish }) {

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

        <div className="mystery-gift-mission-intro-container">

            <div
                className={
                    show
                        ? "mystery-gift-mission-intro-popup show"
                        : "mystery-gift-mission-intro-popup"
                }
            >

                <div className="mystery-gift-mission-intro-icon">
                    🎁
                </div>

                <h1>
                    Mystery Gift
                    <br />
                    Mission!
                </h1>

            </div>

        </div>

    );

}


export default MysteryGiftMissionIntro;