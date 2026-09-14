import React, { useEffect, useState } from "react";

import "./SentenceRepairLabIntro.css";


function SentenceRepairLabIntro({ onStart }) {

    const [show, setShow] = useState(false);


    useEffect(() => {

        const showTimer = setTimeout(() => {

            setShow(true);

        }, 100);


        const timer = setTimeout(() => {

            setShow(false);


            setTimeout(() => {

                onStart();

            }, 300);

        }, 1500);


        return () => {

            clearTimeout(showTimer);

            clearTimeout(timer);

        };

    }, [onStart]);


    return (

        <div className="sentence-repair-intro-container">


            <div
                className={
                    show
                        ? "sentence-repair-popup show"
                        : "sentence-repair-popup"
                }
            >

                <h1>
                    Sentence Repair Lab!
                </h1>

            </div>


        </div>

    );

}


export default SentenceRepairLabIntro;