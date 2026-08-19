import React, { useEffect, useState } from "react";
import teacher from "../../assets/teacher1.png";
import "./HobbiesTeacherIntro.css";

function HobbiesTeacherIntro({ onNext }) {

    const intros = [

        "Hello! I'm your English teacher, Miss Uroosa. Today we'll talk about hobbies and the things we enjoy doing in our free time. Listen carefully and get ready to share your ideas!",

        "Hi! I'm Miss Uroosa. Today we're going to talk about hobbies. We'll learn how to talk about the activities we enjoy and how to describe them in English. Let's get started!",

        "Hello! Welcome back. I'm Miss Uroosa. Today we'll practice talking about hobbies and the activities we love doing. Listen carefully, think about your favourite hobbies, and let's begin!"

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

        <div className="hobbies-teacher-intro-container">


            {/* =================================
                MAIN TEACHER CARD
            ================================= */}

            <div className="hobbies-teacher-intro-card">


                {/* =========================
                    TEACHER
                ========================= */}

                <div className="hobbies-teacher-image-area">

                    <img
                        src={teacher}
                        alt="Miss Uroosa"
                        className={
                            isSpeaking
                                ? "hobbies-teacher-image speaking"
                                : "hobbies-teacher-image"
                        }
                    />

                </div>


                {/* =========================
                    SPEECH BUBBLE
                ========================= */}

                <div className="hobbies-teacher-speech-bubble">


                    <div className="hobbies-teacher-name">

                        Miss Uroosa 👩‍🏫

                    </div>


                    <p>

                        {teacherText}

                        {isSpeaking && (

                            <span className="hobbies-typing-dots">

                                ...

                            </span>

                        )}

                    </p>


                </div>


            </div>

        </div>

    );

}


export default HobbiesTeacherIntro;