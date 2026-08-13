import React, { useEffect, useState } from "react";

function VocabularyIntro({ onNext }) {

    const [show, setShow] = useState(false);

    useEffect(() => {

        const enterTimer = setTimeout(() => {

            setShow(true);

        }, 100);


        const exitTimer = setTimeout(() => {

            setShow(false);

            setTimeout(() => {

                onNext();

            }, 500);

        }, 4000);


        return () => {

            clearTimeout(enterTimer);
            clearTimeout(exitTimer);

        };

    }, [onNext]);


    return (

        <div className="vocab-intro-container">

            <div
                className={
                    show
                        ? "vocab-intro-popup show"
                        : "vocab-intro-popup"
                }
            >

                <h1>

                    Practice Vocabulary
                    <br />
                    & Pronunciation

                </h1>

            </div>

        </div>

    );

}

export default VocabularyIntro;