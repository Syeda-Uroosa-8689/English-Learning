import React, { useEffect, useState } from "react";
import "./HobbyRankingIntro.css";

function HobbyRankingIntro({ onStart }) {

    const [show, setShow] = useState(false);

    useEffect(() => {

        const showTimer = setTimeout(() => {
            setShow(true);
        }, 100);

        const hideTimer = setTimeout(() => {

            setShow(false);

            setTimeout(() => {
                onStart?.();
            }, 300);

        }, 1500);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };

    }, [onStart]);

    return (

        <div className="hobby-ranking-intro-page">

            <div
                className={
                    show
                        ? "hobby-ranking-popup show"
                        : "hobby-ranking-popup"
                }
            >

            

                <h1>
                    Hobby Ranking
                    <br />
                    Challenge
                </h1>

            </div>

        </div>

    );
}

export default HobbyRankingIntro;