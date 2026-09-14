import React, { useEffect, useState } from "react";
import "./RestaurantIntro.css";

function RestaurantIntro({ onFinish }) {

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

        <div className="restaurant-intro-container">

            <div
                className={
                    show
                        ? "restaurant-intro-card show"
                        : "restaurant-intro-card"
                }
            >

                <div className="restaurant-icon">
                    🍽️
                </div>

                <h1>
                    Restaurant
                    <br />
                    Conversation
                </h1>

            </div>

        </div>

    );
}

export default RestaurantIntro;