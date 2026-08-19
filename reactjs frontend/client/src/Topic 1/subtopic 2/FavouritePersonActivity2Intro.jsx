import React, { useEffect, useState } from "react";
import "./FavouritePersonActivity2Intro.css";

function FavouritePersonActivity2Intro({ onFinish }) {

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

            

                <h1>
                    Describe Your Favourite Person
                </h1>

                <p>
                    Describe your favourite person using simple sentences and tell us what makes them special.
                </p>

            </div>

        </div>

    );
}

export default FavouritePersonActivity2Intro;