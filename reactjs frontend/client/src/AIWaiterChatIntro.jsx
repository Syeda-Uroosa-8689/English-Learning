import React, { useEffect, useState } from "react";
import "./AIWaiterIntro.css";

function AIWaiterIntro({ onFinish }) {

    const [show, setShow] = useState(false);

    useEffect(() => {

        const showTimer = setTimeout(() => {
            setShow(true);
        }, 100);

        const hideTimer = setTimeout(() => {

            setShow(false);

            setTimeout(() => {
                onFinish?.();
            }, 500);

        }, 1500);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };

    }, [onFinish]);

    return (

        <div className="waiter-intro-container">

            <div
                className={
                    show
                        ? "waiter-intro-popup show"
                        : "waiter-intro-popup"
                }
            >

                <div className="waiter-icon">
                    🍽️
                </div>

                <h1>
                    AI Waiter
                </h1>

            </div>

        </div>

    );
}

export default AIWaiterIntro;