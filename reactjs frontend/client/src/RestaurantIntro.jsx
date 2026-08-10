import React, { useEffect, useState } from "react";

function RestaurantIntro({ onFinish }) {

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

        }, 4500);

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

                    Restaurant Conversation

                </h1>

                <p>

                    Welcome to the Restaurant Conversation lesson.
                    Practice speaking with an AI waiter,
                    order your favourite food,
                    and improve your English communication skills.

                </p>

            </div>

        </div>

    );

}

export default RestaurantIntro;