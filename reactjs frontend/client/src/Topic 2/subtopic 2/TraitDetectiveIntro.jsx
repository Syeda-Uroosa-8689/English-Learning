import React, { useEffect, useState } from "react";

import "./TraitDetectiveIntro.css";


function TraitDetectiveIntro({ onFinish }) {

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

        <div className="trait-detective-intro-container">

            <div
                className={
                    show
                        ? "trait-detective-intro-popup show"
                        : "trait-detective-intro-popup"
                }
            >

                <div className="trait-detective-intro-icon">
                    🕵️
                </div>

                <h1>
                    Trait
                    <br />
                    Detective!
                </h1>

            </div>

        </div>

    );

}


export default TraitDetectiveIntro;