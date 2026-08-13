import React, { useState, useEffect } from "react";

import teacher1 from "./assets/teacher1.png";
import teacher2 from "./assets/teacher2.png";
import teacher3 from "./assets/teacher3.png";
import teacher4 from "./assets/teacher4.png";

import likeBasketImg from "./assets/like.png";
import dislikeBasketImg from "./assets/dislike.png";

/* =========================================
   FOOD IMAGES
========================================= */

import pizzaImg from "./assets/pizza.jpg";
import burgerImg from "./assets/burger.jpg";
import saladImg from "./assets/salad.jpg";
import chocolateImg from "./assets/chocolate.jpg";
import icecreamImg from "./assets/icecream.jpg";
import curryImg from "./assets/curry.jpg";
import bittergourdImg from "./assets/bitter gourd.jpg";
import mushroomImg from "./assets/mushrooms.jpg";


/* =========================================
   FOOD IMAGE MAP
========================================= */

const foodImages = {

    "pizza.jpg": pizzaImg,

    "burger.jpg": burgerImg,

    "salad.jpg": saladImg,

    "chocolate.jpg": chocolateImg,

    "icecream.jpg": icecreamImg,

    "curry.jpg": curryImg,

    "bittergourd.jpg": bittergourdImg,

    "mushroom.jpg": mushroomImg

};


/* =========================================
   COMPONENT
========================================= */

function SortingActivity({

    question,
    onNext,
    onBack

}) {


    /* =====================================
       TEACHER FRAMES
    ===================================== */

    const teacherFrames = [

        teacher1,
        teacher2,
        teacher3,
        teacher4

    ];


    /* =====================================
       STATES
    ===================================== */

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


    /* =====================================
       TEACHER ANIMATION
    ===================================== */

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


    /* =====================================
       TEACHER VOICE
    ===================================== */

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

            voices.find(v =>

                v.name.includes("Zira")

            )

            ||

            voices.find(v =>

                v.name.includes("Samantha")

            )

            ||

            voices[0];


        speech.onend = () => {

            setIsSpeaking(false);

        };


        window.speechSynthesis.speak(speech);

    };


    /* =====================================
       INTRO VOICE
    ===================================== */

    useEffect(() => {

        speak(

            "Drag every food into the correct basket. Put the foods you like into the Like basket and the foods you don't like into the Dislike basket."

        );

    }, []);


    /* =====================================
       FINISHED VOICE
    ===================================== */

    useEffect(() => {

        if (finished) {

            speak(

                "Excellent! Great job! I'm proud of you. Let's move to the next activity."

            );


            const timer = setTimeout(() => {

                setShowNext(true);

            }, 5000);


            return () => clearTimeout(timer);

        }

    }, [finished]);


    /* =====================================
       DRAG START
    ===================================== */

    const handleDragStart = (food) => {

        setDragItem(food);

    };


    /* =====================================
       REMOVE FOOD
    ===================================== */

    const removeFood = (food) => {

        setFoods(prev =>

            prev.filter(item => item !== food)

        );

    };


    /* =====================================
       LIKE DROP
    ===================================== */

    const handleDropLike = () => {

        if (!dragItem) return;


        setLikeBasket(prev => [

            ...prev,

            dragItem

        ]);


        removeFood(dragItem);

        setDragItem(null);

    };


    /* =====================================
       DISLIKE DROP
    ===================================== */

    const handleDropDislike = () => {

        if (!dragItem) return;


        setDislikeBasket(prev => [

            ...prev,

            dragItem

        ]);


        removeFood(dragItem);

        setDragItem(null);

    };


    /* =====================================
       DRAG OVER
    ===================================== */

    const handleDragOver = (e) => {

        e.preventDefault();

    };


    /* =====================================
       GET FOOD IMAGE
    ===================================== */

    const getFoodImage = (food) => {

        return foodImages[food];

    };


    /* =====================================
       GET FOOD NAME
    ===================================== */

    const getFoodName = (food) => {

        return food

            .replace(/\.(jpg|jpeg|png|webp)$/i, "")

            .replaceAll("_", " ");

    };


    /* =====================================
       CLEANUP
    ===================================== */

    useEffect(() => {

        return () => {

            window.speechSynthesis.cancel();

        };

    }, []);


    /* =====================================
       UI
    ===================================== */

    return (

        <div className="sorting-container">


            <div className="sorting-card">


                {/* =====================================
                    HEADER
                ===================================== */}

                <div className="sorting-header">


                    <button

                        className="sorting-back-btn"

                        onClick={onBack}

                    >

                        ← Back

                    </button>


                    <h1>

                        Sorting Activity

                    </h1>


                    {!finished && (

                        <button

                            className="sorting-skip-btn"

                            onClick={onNext}

                        >

                            Skip →

                        </button>

                    )}


                </div>


                {/* =====================================
                    TEACHER
                ===================================== */}

                <div className="sorting-teacher">


                    <img

                        src={teacherFrames[frame]}

                        alt="Teacher"

                        className={

                            isSpeaking

                                ? "teacher-img speaking"

                                : "teacher-img"

                        }

                    />


                    <div className="sorting-speech">

                        {teacherMessage}

                    </div>


                </div>


                {/* =====================================
                    BASKETS
                ===================================== */}

                <div className="basket-row">


                    {/* ================= LIKE ================= */}

                    <div

                        className="basket-box"

                        onDragOver={handleDragOver}

                        onDrop={handleDropLike}

                    >


                        <h3>

                            👍 Like

                        </h3>


                        <img

                            src={likeBasketImg}

                            alt="Like basket"

                            className="basket-image"

                        />


                        <div className="basket-items">


                            {likeBasket.map(

                                (food, index) => (

                                    <div

                                        key={index}

                                        className="basket-food"

                                    >

                                        <img

                                            src={getFoodImage(food)}

                                            alt={getFoodName(food)}

                                            className="basket-food-image"

                                        />


                                        <span>

                                            {getFoodName(food)}

                                        </span>


                                    </div>

                                )

                            )}


                        </div>


                    </div>


                    {/* ================= DISLIKE ================= */}

                    <div

                        className="basket-box"

                        onDragOver={handleDragOver}

                        onDrop={handleDropDislike}

                    >


                        <h3>

                            👎 Dislike

                        </h3>


                        <img

                            src={dislikeBasketImg}

                            alt="Dislike basket"

                            className="basket-image"

                        />


                        <div className="basket-items">


                            {dislikeBasket.map(

                                (food, index) => (

                                    <div

                                        key={index}

                                        className="basket-food"

                                    >

                                        <img

                                            src={getFoodImage(food)}

                                            alt={getFoodName(food)}

                                            className="basket-food-image"

                                        />


                                        <span>

                                            {getFoodName(food)}

                                        </span>


                                    </div>

                                )

                            )}


                        </div>


                    </div>


                </div>


                {/* =====================================
                    FOOD OPTIONS
                ===================================== */}

                <div className="food-grid">


                    {foods.map((food, index) => (

                        <div

                            key={index}

                            className="food-card"

                            draggable

                            onDragStart={() =>

                                handleDragStart(food)

                            }

                        >


                            {/* FOOD IMAGE */}

                            <img

                                src={getFoodImage(food)}

                                alt={getFoodName(food)}

                                className="food-option-image"

                            />


                            {/* FOOD NAME */}

                            <div className="food-name">

                                {getFoodName(food)}

                            </div>


                        </div>

                    ))}


                </div>


                {/* =====================================
                    NEXT BUTTON
                ===================================== */}

              {showNext && (
    <div className="sorting-next-wrapper">
        <button
            className="sorting-next-btn"
            onClick={onNext}
        >
            Next →
        </button>
    </div>
)}

            </div>

        </div>

    );

}


export default SortingActivity;