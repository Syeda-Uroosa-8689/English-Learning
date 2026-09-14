import React, { useEffect, useState } from "react";

import "./SpacePreferenceIntro.css";


function SpacePreferenceIntro({ onFinish }) {

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

        <div className="space-preference-intro-container">

            <div
                className={
                    show
                        ? "space-preference-intro-popup show"
                        : "space-preference-intro-popup"
                }
            >

                <div className="space-preference-intro-icon">
                    🚀
                </div>

                <h1>
                    Space
                    <br />
                    Preference!
                </h1>

            </div>

        </div>

    );

}


export default SpacePreferenceIntro;