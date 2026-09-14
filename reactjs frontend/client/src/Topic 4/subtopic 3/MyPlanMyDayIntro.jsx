import React, { useEffect, useState } from "react";

import "./MyPlanMyDayIntro.css";


function MyPlanMyDayIntro({ onFinish }) {

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

        <div className="my-plan-my-day-intro-container">

            <div
                className={
                    show
                        ? "my-plan-my-day-intro-popup show"
                        : "my-plan-my-day-intro-popup"
                }
            >

                <div className="my-plan-my-day-intro-icon">
                    📅
                </div>


                <h1>

                    My Plan,
                    <br />
                    My Day!

                </h1>

            </div>

        </div>

    );

}


export default MyPlanMyDayIntro;