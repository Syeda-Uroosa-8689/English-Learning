import React, { useEffect, useState } from "react";
import "./MenuMatchingIntro.css";

function MenuMatchingIntro({ onFinish }) {

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

        <div className="menu-intro-container">

            <div
                className={
                    show
                        ? "menu-intro-popup show"
                        : "menu-intro-popup"
                }
            >

                <div className="menu-intro-icon">
                    🍽️
                </div>

                <h1>
                    Menu
                    <br />
                    Matching
                </h1>

            </div>

        </div>

    );
}

export default MenuMatchingIntro;