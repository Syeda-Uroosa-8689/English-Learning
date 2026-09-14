import React, { useEffect, useState } from "react";
import "./HobbyRoleplayIntro.css";

function HobbyRoleplayIntro({ onFinish }) {

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

        <div className="hobby-roleplay-intro-container">

            <div
                className={
                    show
                        ? "hobby-roleplay-popup show"
                        : "hobby-roleplay-popup"
                }
            >

                <h1>
                    Hobby
                    <br />
                    Roleplay
                </h1>

            </div>

        </div>

    );
}

export default HobbyRoleplayIntro;