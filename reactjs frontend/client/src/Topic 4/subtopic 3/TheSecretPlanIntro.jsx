import React, { useEffect, useState } from "react";

import "./TheSecretPlanIntro.css";


function TheSecretPlanIntro({ onFinish }) {

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

        <div className="the-secret-plan-intro-container">

            <div
                className={
                    show
                        ? "the-secret-plan-intro-popup show"
                        : "the-secret-plan-intro-popup"
                }
            >

                <div className="the-secret-plan-intro-icon">
                    🕵️‍♀️
                </div>


                <h1>

                    The Secret
                    <br />
                    Plan!

                </h1>

            </div>

        </div>

    );

}


export default TheSecretPlanIntro;