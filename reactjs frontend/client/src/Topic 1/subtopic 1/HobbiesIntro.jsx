import React, { useEffect, useState } from "react";
import "./HobbiesIntro.css";

function HobbiesIntro({ onFinish }) {

    const [show, setShow] = useState(false);

    useEffect(() => {

        const showTimer = setTimeout(() => {
            setShow(true);
        }, 100);

        const timer = setTimeout(() => {

            setShow(false);

            setTimeout(() => {
                onFinish();
            }, 500);

        }, 4000);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(timer);
        };

    }, [onFinish]);

    return (

        <div className="hobbies-intro-container">

            <div
                className={
                    show
                        ? "hobbies-popup show"
                        : "hobbies-popup"
                }
            >

                <h1>
                    Which Sentence Sounds Better?
                </h1>

            </div>

        </div>

    );
}

export default HobbiesIntro;