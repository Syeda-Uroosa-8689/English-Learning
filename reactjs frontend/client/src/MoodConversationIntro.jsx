import React, { useEffect, useState } from "react";

function MoodConversationIntro({ onFinish }) {

    const [show, setShow] = useState(false);

    useEffect(() => {

        setTimeout(() => {

            setShow(true);

        }, 100);

        const timer = setTimeout(() => {

            setShow(false);

            setTimeout(() => {

                onFinish();

            }, 300);

        }, 1500);

        return () => clearTimeout(timer);

    }, []);

    return (

        <div className="mood-intro-container">

            <div className={show ? "mood-popup show" : "mood-popup"}>

                <div className="mood-intro-icon">

                    😊

                </div>

                <h1>

                    Mood Conversation

                </h1>

                <p>

                    Listen carefully to restaurant conversations and identify different moods like happy, polite, surprised, thankful, and excited.

                </p>

            </div>

        </div>

    );

}

export default MoodConversationIntro;