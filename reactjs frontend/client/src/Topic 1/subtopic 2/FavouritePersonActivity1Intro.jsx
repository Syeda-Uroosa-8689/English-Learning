import React, { useEffect, useState } from "react";
import "./FavouritePersonIntro.css";

function FavouritePersonActivity1Intro({ onFinish }) {

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

        <div className="favourite-person-activity1-intro-container">

            <div
                className={
                    show
                        ? "favourite-person-activity1-intro-popup show"
                        : "favourite-person-activity1-intro-popup"
                }
            >

              

                <h1>
                    Guess the Favourite
                    <br />
                    Person
                </h1>

            </div>

        </div>

    );
}

export default FavouritePersonActivity1Intro;