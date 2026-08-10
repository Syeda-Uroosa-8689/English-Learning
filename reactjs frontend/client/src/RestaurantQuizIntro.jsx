import React, { useEffect, useState } from "react";

function RestaurantQuizIntro({ onFinish }) {

    const [show, setShow] = useState(false);

    useEffect(() => {

        setTimeout(() => {

            setShow(true);

        }, 100);

        const timer = setTimeout(() => {

            setShow(false);

            setTimeout(() => {

                onFinish();

            }, 500);

        }, 4000);

        return () => clearTimeout(timer);

    }, [onFinish]);

    return (

        <div className="quiz-intro-container">

            <div className={show ? "quiz-popup show" : "quiz-popup"}>

                <div className="quiz-intro-icon">

                    🍽️🏆

                </div>

                <h1>

                    Restaurant Quiz

                </h1>

                <p>

                    Great job! Now it's time to test your restaurant skills.
                    Read each question carefully, choose the best answer,
                    and earn your Restaurant Star!

                </p>

            </div>

        </div>

    );

}

export default RestaurantQuizIntro;