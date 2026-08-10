import React, { useState, useEffect } from "react";

import teacher1 from "./assets/teacher1.png";
import teacher2 from "./assets/teacher2.png";
import teacher3 from "./assets/teacher3.png";
import teacher4 from "./assets/teacher4.png";

import likeBasketImg from "./assets/like.png";
import dislikeBasketImg from "./assets/dislike.png";


function SortingActivity({

    question,
    onNext,
    onBack

}) {

    const teacherFrames = [

        teacher1,
        teacher2,
        teacher3,
        teacher4

    ];

    const [frame, setFrame] = useState(0);

    const [isSpeaking, setIsSpeaking] = useState(false);

    const [teacherMessage, setTeacherMessage] = useState(
        "Drag every food into the correct basket. Put the foods you like into the Like basket and the foods you don't like into the Dislike basket."
    );

    const [foods, setFoods] = useState(
        question.sortingGame.foods
    );

    const [likeBasket, setLikeBasket] = useState([]);

    const [dislikeBasket, setDislikeBasket] = useState([]);

    const [dragItem, setDragItem] = useState(null);

    const [showNext, setShowNext] = useState(false);

    const finished = foods.length === 0;

    /* =========================
       Teacher Animation
    ========================= */

    useEffect(() => {

        if (!isSpeaking) {

            setFrame(0);
            return;

        }

        const timer = setInterval(() => {

            setFrame(prev =>
                (prev + 1) % teacherFrames.length
            );

        }, 250);

        return () => clearInterval(timer);

    }, [isSpeaking]);

    /* =========================
       Teacher Voice
    ========================= */

    const speak = (text) => {

        window.speechSynthesis.cancel();

        setTeacherMessage(text);

        setIsSpeaking(true);

        const speech =
            new SpeechSynthesisUtterance(text);

        speech.rate = 0.9;
        speech.pitch = 1.1;
        speech.volume = 1;

        const voices =
            window.speechSynthesis.getVoices();

        speech.voice =
            voices.find(v => v.name.includes("Zira")) ||
            voices.find(v => v.name.includes("Samantha")) ||
            voices[0];

        speech.onend = () => {

            setIsSpeaking(false);

        };

        window.speechSynthesis.speak(speech);

    };

    /* =========================
       Intro Voice
    ========================= */

    useEffect(() => {

        speak(
            "Drag every food into the correct basket. Put the foods you like into the Like basket and the foods you don't like into the Dislike basket."
        );

    }, []);

    /* =========================
       Finished Voice
    ========================= */

    useEffect(() => {

        if (finished) {

            speak(
                "Excellent! Great job! I'm proud of you. Let's move to the next activity."
            );

            setTimeout(() => {

                setShowNext(true);

            }, 5000);

        }

    }, [finished]);


        /* =========================
       Drag & Drop
    ========================= */

    const handleDragStart = (food) => {

        setDragItem(food);

    };

    const removeFood = (food) => {

        setFoods(prev =>
            prev.filter(item => item !== food)
        );

    };

    const handleDropLike = () => {

        if (!dragItem) return;

        setLikeBasket(prev => [

            ...prev,
            dragItem

        ]);

        removeFood(dragItem);

        setDragItem(null);

    };

    const handleDropDislike = () => {

        if (!dragItem) return;

        setDislikeBasket(prev => [

            ...prev,
            dragItem

        ]);

        removeFood(dragItem);

        setDragItem(null);

    };

    const handleDragOver = (e) => {

        e.preventDefault();

    };

    /* =========================
       Cleanup
    ========================= */

    useEffect(() => {

        return () => {

            window.speechSynthesis.cancel();

        };

    }, []);



        return (

        <div className="sorting-container">

            <div className="sorting-card">

                {/* ================= Header ================= */}

                <div className="sorting-header">

                    <button
                        className="sorting-back-btn"
                        onClick={onBack}
                    >
                        ← Back
                    </button>

                    <h1>Sorting Activity</h1>

                    {

                        !finished && (

                            <button
                                className="sorting-skip-btn"
                                onClick={onNext}
                            >
                                Skip →
                            </button>

                        )

                    }

                </div>

                {/* ================= Teacher ================= */}

                <div className="sorting-teacher">

                    <img
                        src={teacherFrames[frame]}
                        alt="Teacher"
                        className={
                            isSpeaking
                                ?
                                "teacher-img speaking"
                                :
                                "teacher-img"
                        }
                    />

                    <div className="sorting-speech">

                        {teacherMessage}

                    </div>

                </div>

                {/* ================= Baskets ================= */}

                <div className="basket-row">

                    <div
                        className="basket-box"
                        onDragOver={handleDragOver}
                        onDrop={handleDropLike}
                    >

                        <h3>👍 Like</h3>

                        <img
                            src={likeBasketImg}
                            alt=""
                            className="basket-image"
                        />

                        <div className="basket-items">

                            {

                                likeBasket.map((food,index)=>(

                                    <div
                                        key={index}
                                        className="basket-food"
                                    >

                                        {
                                            food
                                            .replace(".jpg","")
                                            .replaceAll("_"," ")
                                        }

                                    </div>

                                ))

                            }

                        </div>

                    </div>

                    <div
                        className="basket-box"
                        onDragOver={handleDragOver}
                        onDrop={handleDropDislike}
                    >

                        <h3>👎 Dislike</h3>

                        <img
                            src={dislikeBasketImg}
                            alt=""
                            className="basket-image"
                        />

                        <div className="basket-items">

                            {

                                dislikeBasket.map((food,index)=>(

                                    <div
                                        key={index}
                                        className="basket-food"
                                    >

                                        {
                                            food
                                            .replace(".jpg","")
                                            .replaceAll("_"," ")
                                        }

                                    </div>

                                ))

                            }

                        </div>

                    </div>

                </div>

                {/* ================= Food Cards ================= */}

                <div className="food-grid">

                    {

                        foods.map((food,index)=>(

                            <div

                                key={index}

                                className="food-card"

                                draggable

                                onDragStart={()=>handleDragStart(food)}

                            >

                                {

                                    food
                                    .replace(".jpg","")
                                    .replaceAll("_"," ")

                                }

                            </div>

                        ))

                    }

                </div>

                {/* ================= Next Button ================= */}

                {

                    showNext && (

                        <div
                            style={{
                                display:"flex",
                                justifyContent:"center",
                                marginTop:"15px"
                            }}
                        >

                            <button
                                className="sorting-skip-btn"
                                onClick={onNext}
                            >

                                Next →

                            </button>

                        </div>

                    )

                }

            </div>

        </div>

    );

}

export default SortingActivity;