import React, { useEffect, useState } from "react";
import "./PhysicalAppearanceActivity2Intro.css";

function PhysicalAppearanceActivity2Intro({ onFinish }) {

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

        <div className="physical-appearance-activity2-intro-container">

            <div
                className={
                    show
                        ? "physical-appearance-activity2-popup show"
                        : "physical-appearance-activity2-popup"
                }
            >

                <div className="physical-appearance-activity2-icon">
                    🧩
                </div>

                <h1>
                    Build Your
                    <br />
                    Partner!
                </h1>

            </div>

        </div>

    );

}

export default PhysicalAppearanceActivity2Intro;