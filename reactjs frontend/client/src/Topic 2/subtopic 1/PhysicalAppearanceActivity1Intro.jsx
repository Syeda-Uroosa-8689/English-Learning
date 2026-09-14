import React, { useEffect, useState } from "react";
import "./PhysicalAppearanceActivity1Intro.css";

function PhysicalAppearanceActivity1Intro({ onFinish }) {

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

        <div className="physical-appearance-activity1-intro-container">

            <div
                className={
                    show
                        ? "physical-appearance-activity1-popup show"
                        : "physical-appearance-activity1-popup"
                }
            >

                <div className="physical-appearance-activity1-icon">
                    👀
                </div>

                <h1>
                    Spot the
                    <br />
                    Feature!
                </h1>

            </div>

        </div>

    );

}

export default PhysicalAppearanceActivity1Intro;