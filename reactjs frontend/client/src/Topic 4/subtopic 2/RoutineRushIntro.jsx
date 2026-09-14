
import React, { useEffect, useState } from "react";

import "./RoutineRushIntro.css";


function RoutineRushIntro({ onFinish }) {

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

        <div className="routine-rush-intro-container">

            <div
                className={
                    show
                        ? "routine-rush-intro-popup show"
                        : "routine-rush-intro-popup"
                }
            >

                <div className="routine-rush-intro-icon">

                    🏃

                </div>


                <h1>

                    Routine
                    <br />
                    Rush!

                </h1>

            </div>

        </div>

    );

}


export default RoutineRushIntro;