import React, { useEffect, useState } from "react";

function MenuMatchingIntro({ onFinish }) {

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

        <div className="menu-intro-container">

            <div className={show ? "menu-intro-popup show" : "menu-intro-popup"}>

                <div className="menu-intro-icon">

                    🍽️

                </div>

                <h1>

                    Menu Matching

                </h1>

                <p>

                    Match each food item with its correct picture and build your restaurant vocabulary.

                </p>

            </div>

        </div>

    );

}

export default MenuMatchingIntro;