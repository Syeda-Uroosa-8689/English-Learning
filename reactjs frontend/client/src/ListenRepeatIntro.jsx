import React, { useEffect, useState } from "react";


function ListenRepeatIntro({ onNext }) {

    const [show, setShow] = useState(false);

    useEffect(() => {

        // Popup enter animation
        const enterTimer = setTimeout(() => {
            setShow(true);
        }, 100);

        // Popup exit
        const exitTimer = setTimeout(() => {

            setShow(false);

            // Exit animation ke baad next page
            setTimeout(() => {
                onNext();
            }, 300);

        }, 1500);

        return () => {
            clearTimeout(enterTimer);
            clearTimeout(exitTimer);
        };

    }, [onNext]);

    return (

        <div className="listen-intro-container">

            <div
                className={
                    show
                        ? "listen-intro-popup show"
                        : "listen-intro-popup"
                }
            >

                <h1>
                    Listen &amp; Repeat
                </h1>

            </div>

        </div>

    );
}

export default ListenRepeatIntro;