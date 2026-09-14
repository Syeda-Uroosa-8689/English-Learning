import React, { useEffect, useState } from "react";

function ArrangeConversationIntro({ onFinish }) {

    const [show, setShow] = useState(false);

    useEffect(() => {

        const showTimer = setTimeout(() => {

            setShow(true);

        }, 100);

        const hideTimer = setTimeout(() => {

            setShow(false);

            setTimeout(() => {

                onFinish();

            }, 300);

        }, 1500);

        return () => {

            clearTimeout(showTimer);
            clearTimeout(hideTimer);

        };

    }, [onFinish]);

    return (

        <div className="arrange-intro-container">

            <div className={show ? "arrange-intro-popup show" : "arrange-intro-popup"}>

                <div className="arrange-intro-icon">

                    💬

                </div>

                <h1>

                    Arrange Conversation

                </h1>

                <p>

                    Arrange the restaurant conversation in the correct order and improve your speaking skills.

                </p>

            </div>

        </div>

    );

}

export default ArrangeConversationIntro;