import React, { useEffect, useState } from "react";

function ConversationIntro({ onFinish }) {

    const [show, setShow] = useState(false);

    useEffect(() => {

        setTimeout(() => {

            setShow(true);

        }, 100);

        const timer = setTimeout(() => {

            onFinish();

        }, 4500);

        return () => clearTimeout(timer);

    }, []);

    return (

        <div className="warmup-intro-container">

            <div className={`warmup-popup ${show ? "show" : ""}`}>

                <h1>Conversation Activity</h1>

            </div>

        </div>

    );

}

export default ConversationIntro;