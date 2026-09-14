
import React, { useEffect, useState } from "react";

import "./PartnerSecretRoomIntro.css";


function PartnerSecretRoomIntro({ onFinish }) {

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

        <div className="partner-secret-room-intro-container">

            <div
                className={
                    show
                        ? "partner-secret-room-intro-popup show"
                        : "partner-secret-room-intro-popup"
                }
            >

                <div className="partner-secret-room-intro-icon">
                    🚪
                </div>

                <h1>
                    Partner's
                    <br />
                    Secret Room!
                </h1>

            </div>

        </div>

    );

}


export default PartnerSecretRoomIntro;

