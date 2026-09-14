import React, { useEffect, useState } from "react";

function PictureDescriptionIntro({ onFinish }) {

    const [show, setShow] = useState(false);

    useEffect(() => {

        setTimeout(() => {

            setShow(true);

        }, 100);

        const timer = setTimeout(() => {

            onFinish();

        }, 1500);

        return () => clearTimeout(timer);

    }, [onFinish]);

    return (

        <div className="warmup-intro-container">

            <div className={`warmup-popup ${show ? "show" : ""}`}>

                <h1>Picture Description</h1>
            </div>

        </div>

    );

}

export default PictureDescriptionIntro;