import React, { useEffect, useState } from "react";

import "./PreferenceThemeParkIntro.css";


function PreferenceThemeParkIntro({ onFinish }) {

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

        <div className="preference-theme-park-intro-container">

            <div
                className={
                    show
                        ? "preference-theme-park-intro-popup show"
                        : "preference-theme-park-intro-popup"
                }
            >

                <div className="preference-theme-park-intro-icon">
                    🎢
                </div>

                <h1>
                    Preference
                    <br />
                    Theme Park!
                </h1>

            </div>

        </div>

    );

}


export default PreferenceThemeParkIntro;