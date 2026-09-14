import React, { useEffect, useState } from "react";

import "./CalendarEscapeRoomIntro.css";


function CalendarEscapeRoomIntro({ onFinish }) {

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

        <div className="calendar-escape-room-intro-container">

            <div
                className={
                    show
                        ? "calendar-escape-room-intro-popup show"
                        : "calendar-escape-room-intro-popup"
                }
            >

                <div className="calendar-escape-room-intro-icon">

                    🔐

                </div>


                <h1>

                    Calendar
                    <br />
                    Escape Room!

                </h1>

            </div>

        </div>

    );

}


export default CalendarEscapeRoomIntro;