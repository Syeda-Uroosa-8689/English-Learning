import React, { useEffect, useState } from "react";

import "./PlanItTogetherIntro.css";


function PlanItTogetherIntro({ onFinish }) {

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

        <div className="plan-it-together-intro-container">

            <div
                className={
                    show
                        ? "plan-it-together-intro-popup show"
                        : "plan-it-together-intro-popup"
                }
            >

                <div className="plan-it-together-intro-icon">
                    🤝
                </div>


                <h1>

                    Plan It
                    <br />
                    Together!

                </h1>

            </div>

        </div>

    );

}


export default PlanItTogetherIntro;