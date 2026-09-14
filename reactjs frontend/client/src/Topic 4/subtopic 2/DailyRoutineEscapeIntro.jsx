import React, { useEffect, useState } from "react";

import "./DailyRoutineEscapeIntro.css";


function DailyRoutineEscapeIntro({ onFinish }) {

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

        <div className="daily-routine-escape-intro-container">

            <div
                className={
                    show
                        ? "daily-routine-escape-intro-popup show"
                        : "daily-routine-escape-intro-popup"
                }
            >

                <div className="daily-routine-escape-intro-icon">

                    🔐

                </div>


                <h1>

                    Daily Routine
                    <br />
                    Escape!

                </h1>

            </div>

        </div>

    );

}


export default DailyRoutineEscapeIntro;