import React, { useEffect, useState } from "react";

function FavouritePersonActivity5Intro({ onFinish }) {

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

        <div className="favourite-person-intro-container">

            <div
                className={
                    show
                        ? "favourite-person-intro-popup show"
                        : "favourite-person-intro-popup"
                }
            >

                <div className="favourite-person-intro-icon">
                    📝
                </div>

                <h1>
                    Write About Your Favourite Person
                </h1>

                <p>
                    Write a short paragraph about your favourite person using complete sentences.
                </p>

            </div>

        </div>

    );
}

export default FavouritePersonActivity5Intro;