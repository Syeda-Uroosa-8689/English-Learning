import React, { useEffect, useState } from "react";
import "./PersonalityBackpackIntro.css";

function PersonalityBackpackIntro({ onFinish }) {

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

        <div className="personality-backpack-intro-container">

            <div
                className={
                    show
                        ? "personality-backpack-popup show"
                        : "personality-backpack-popup"
                }
            >

                <div className="personality-backpack-icon">
                    🎒
                </div>

                <h1>
                    Personality
                    <br />
                    Backpack!
                </h1>

            </div>

        </div>

    );

}


export default PersonalityBackpackIntro;