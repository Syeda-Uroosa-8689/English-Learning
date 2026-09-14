import React, { useEffect, useState } from "react";
import "./PhysicalAppearanceActivity3Intro.css";

function PhysicalAppearanceActivity3Intro({ onFinish }) {

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

        <div className="physical-appearance-activity3-intro-container">

            <div
                className={
                    show
                        ? "physical-appearance-activity3-popup show"
                        : "physical-appearance-activity3-popup"
                }
            >

                <div className="physical-appearance-activity3-icon">
                    🗣️
                </div>

                <h1>
                    Describe Your
                    <br />
                    Partner!
                </h1>

            </div>

        </div>

    );

}

export default PhysicalAppearanceActivity3Intro;