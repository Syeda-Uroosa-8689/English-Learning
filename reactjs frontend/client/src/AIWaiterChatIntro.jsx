import React, { useEffect, useState } from "react";

function AIWaiterIntro({ onFinish }) {

    const [show, setShow] = useState(false);

    useEffect(() => {

        const showTimer = setTimeout(() => {

            setShow(true);

        }, 100);

        const hideTimer = setTimeout(() => {

            setShow(false);

            setTimeout(() => {

                onFinish();

            }, 500);

        }, 4000);

        return () => {

            clearTimeout(showTimer);
            clearTimeout(hideTimer);

        };

    }, [onFinish]);

    return (

        <div className="waiter-intro-container">

            <div className={show ? "waiter-intro-popup show" : "waiter-intro-popup"}>

                <div className="waiter-icon">

                    🍽️

                </div>

                <h1>

                    AI Waiter

                </h1>

                <p>

                    Practice ordering food politely in English.

                </p>

            </div>

        </div>

    );

}

export default AIWaiterIntro;