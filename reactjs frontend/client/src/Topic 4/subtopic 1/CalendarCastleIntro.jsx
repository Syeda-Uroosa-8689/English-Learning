
import React, { useEffect, useState } from "react";

import "./CalendarCastleIntro.css";


function CalendarCastleIntro({ onFinish }) {

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

        <div className="calendar-castle-intro-container">

            <div
                className={
                    show
                        ? "calendar-castle-intro-popup show"
                        : "calendar-castle-intro-popup"
                }
            >

                <div className="calendar-castle-intro-icon">

                    🏰

                </div>


                <h1>

                    Calendar
                    <br />
                    Castle!

                </h1>

            </div>

        </div>

    );

}


export default CalendarCastleIntro;