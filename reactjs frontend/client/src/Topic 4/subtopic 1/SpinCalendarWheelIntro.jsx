import React, { useEffect, useState } from "react";

import "./SpinCalendarWheelIntro.css";


function SpinCalendarWheelIntro({ onFinish }) {

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

        <div className="spin-calendar-wheel-intro-container">

            <div
                className={
                    show
                        ? "spin-calendar-wheel-intro-popup show"
                        : "spin-calendar-wheel-intro-popup"
                }
            >

                <div className="spin-calendar-wheel-intro-icon">

                    🎡

                </div>


                <h1>

                    Spin the
                    <br />
                    Calendar Wheel!

                </h1>

            </div>

        </div>

    );

}


export default SpinCalendarWheelIntro;