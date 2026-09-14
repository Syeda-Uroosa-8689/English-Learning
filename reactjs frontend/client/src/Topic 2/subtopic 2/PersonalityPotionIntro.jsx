import React, { useEffect, useState } from "react";
import "./PersonalityPotionIntro.css";


function PersonalityPotionIntro({ onFinish }) {

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

        <div
            className=
                "personality-potion-intro-container"
        >

            <div
                className={
                    show
                        ? "personality-potion-intro-popup show"
                        : "personality-potion-intro-popup"
                }
            >

                <div
                    className=
                        "personality-potion-intro-icon"
                >
                    🧪
                </div>


                <h1>

                    Create Your
                    <br />
                    Personality Potion!

                </h1>

            </div>

        </div>

    );

}


export default PersonalityPotionIntro;