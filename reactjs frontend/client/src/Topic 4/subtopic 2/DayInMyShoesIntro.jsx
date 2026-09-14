import React, { useEffect, useState } from "react";

import "./DayInMyShoesIntro.css";


function DayInMyShoesIntro({ onFinish }) {

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

        <div className="day-in-my-shoes-intro-container">

            <div
                className={
                    show
                        ? "day-in-my-shoes-intro-popup show"
                        : "day-in-my-shoes-intro-popup"
                }
            >

                <div className="day-in-my-shoes-intro-icon">

                    👟

                </div>


                <h1>

                    A Day
                    <br />
                    in My Shoes!

                </h1>

            </div>

        </div>

    );

}


export default DayInMyShoesIntro;