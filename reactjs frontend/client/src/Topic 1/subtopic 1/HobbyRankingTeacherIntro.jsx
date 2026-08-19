import React, { useEffect, useState } from "react";
import teacher from "../../assets/teacher1.png";
import "./HobbyRankingTeacherIntro.css";

function HobbyRankingTeacherIntro({ onNext }) {

    const intros = [

        "Hello! I'm your English teacher, Miss Uroosa. Today we're going to talk about your favourite hobbies. You will rank different hobbies from your favourite to your least favourite and explain why you like them. Let's get started!",

        "Hi! I'm Miss Uroosa. Today we'll have a fun hobby ranking challenge. Think about the activities you enjoy most, put them in order, and tell me why they are special to you. Are you ready? Let's begin!",

        "Hello! Welcome to our Hobby Ranking Challenge. I'm Miss Uroosa, and today we'll practice talking about hobbies and preferences in English. Choose your favourite hobbies, rank them, and share your reasons with me. Let's begin!"

    ];


    const [randomIntro] = useState(
        intros[Math.floor(Math.random() * intros.length)]
    );


    const [teacherText, setTeacherText] = useState("");

    const [isSpeaking, setIsSpeaking] = useState(false);


    useEffect(() => {

        window.speechSynthesis.cancel();

        setTeacherText("");

        setIsSpeaking(true);


        /* ===============================
              TEXT TYPING EFFECT
        =============================== */

        let index = 0;

        const typingTimer = setInterval(() => {

            index++;

            setTeacherText(
                randomIntro.substring(0, index)
            );

            if (index >= randomIntro.length) {

                clearInterval(typingTimer);

            }

        }, 35);


        /* ===============================
              TEACHER VOICE
        =============================== */

        const speech =
            new SpeechSynthesisUtterance(randomIntro);

        speech.rate = 0.9;

        speech.pitch = 1.05;

        speech.volume = 1;


        const voices =
            window.speechSynthesis.getVoices();


        speech.voice =

            voices.find(v =>
                v.name.includes("Zira")
            ) ||

            voices.find(v =>
                v.name.includes(
                    "Google UK English Female"
                )
            ) ||

            voices.find(v =>
                v.name.includes("Samantha")
            ) ||

            voices.find(v =>
                /female/i.test(v.name)
            ) ||

            voices[0];


        speech.onend = () => {

            setIsSpeaking(false);


            /* ===============================
                 VOICE FINISHED
            =============================== */

            setTimeout(() => {

                onNext();

            }, 800);

        };


        window.speechSynthesis.speak(speech);


        return () => {

            clearInterval(typingTimer);

            window.speechSynthesis.cancel();

        };

    }, [randomIntro, onNext]);


    return (

        <div className="hobby-ranking-teacher-intro-container">


            {/* =================================
                    MAIN TEACHER CARD
            ================================= */}

            <div className="hobby-ranking-teacher-intro-card">


                {/* =========================
                        TEACHER
                ========================= */}

                <div className="hobby-ranking-teacher-image-area">

                    <img
                        src={teacher}
                        alt="Miss Uroosa"
                        className={
                            isSpeaking
                                ? "hobby-ranking-teacher-image speaking"
                                : "hobby-ranking-teacher-image"
                        }
                    />

                </div>


                {/* =========================
                    SPEECH BUBBLE
                ========================= */}

                <div className="hobby-ranking-teacher-speech-bubble">


                    <div className="hobby-ranking-teacher-name">

                        Miss Uroosa 👩‍🏫

                    </div>


                    <p>

                        {teacherText}

                        {isSpeaking && (

                            <span className="hobby-ranking-typing-dots">

                                ...

                            </span>

                        )}

                    </p>


                </div>


            </div>

        </div>

    );

}


export default HobbyRankingTeacherIntro;