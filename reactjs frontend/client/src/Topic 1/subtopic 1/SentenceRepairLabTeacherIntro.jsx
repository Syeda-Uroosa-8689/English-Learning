import React, { useEffect, useState } from "react";

import teacher from "../../assets/teacher1.png";

import "./SentenceRepairLabTeacherIntro.css";


function SentenceRepairLabTeacherIntro({ onNext }) {


    /* =========================================
                SENTENCE REPAIR INTROS
    ========================================= */

    const intros = [

        "Hello! I'm your English teacher, Miss Uroosa. Welcome to the Sentence Repair Lab! Today we'll find mistakes in sentences, fix them together, and then practise saying the correct sentences. Listen carefully and let's begin!",

        "Hi! I'm Miss Uroosa. Today we're going to become sentence detectives! I'll show you sentences with mistakes, and your job will be to find the mistake, repair the sentence, and say it correctly. Are you ready?",

        "Hello! Welcome to the Sentence Repair Lab. I'm Miss Uroosa, and today we'll practise making sentences better. Look carefully, think about the grammar, fix the mistake, and speak the correct sentence. Let's get started!"

    ];


    /* =========================================
                RANDOM INTRO
    ========================================= */

    const [randomIntro] = useState(

        intros[
            Math.floor(
                Math.random() * intros.length
            )
        ]

    );


    /* =========================================
                STATES
    ========================================= */

    const [teacherText, setTeacherText] =
        useState("");

    const [isSpeaking, setIsSpeaking] =
        useState(false);


    /* =========================================
                TEACHER INTRO EFFECT
    ========================================= */

    useEffect(() => {


        window.speechSynthesis.cancel();

        setTeacherText("");

        setIsSpeaking(true);


        /* =====================================
                TEXT TYPING EFFECT
        ===================================== */

        let index = 0;


        const typingTimer = setInterval(() => {

            index++;


            setTeacherText(
                randomIntro.substring(
                    0,
                    index
                )
            );


            if (
                index >=
                randomIntro.length
            ) {

                clearInterval(
                    typingTimer
                );

            }

        }, 35);


        /* =====================================
                TEACHER VOICE
        ===================================== */

        const speech =
            new SpeechSynthesisUtterance(
                randomIntro
            );


        speech.rate = 0.9;

        speech.pitch = 1.05;

        speech.volume = 1;


        /* =====================================
                FEMALE VOICE
        ===================================== */

        const voices =
            window.speechSynthesis
                .getVoices();


        speech.voice =

            voices.find(
                v =>
                    v.name.includes(
                        "Zira"
                    )
            )

            ||

            voices.find(
                v =>
                    v.name.includes(
                        "Google UK English Female"
                    )
            )

            ||

            voices.find(
                v =>
                    v.name.includes(
                        "Samantha"
                    )
            )

            ||

            voices.find(
                v =>
                    /female/i.test(
                        v.name
                    )
            )

            ||

            voices[0];


        /* =====================================
                VOICE FINISHED
        ===================================== */

        speech.onend = () => {

            setIsSpeaking(false);


            setTimeout(() => {

                onNext();

            }, 800);

        };


        window.speechSynthesis.speak(
            speech
        );


        /* =====================================
                CLEANUP
        ===================================== */

        return () => {

            clearInterval(
                typingTimer
            );

            window.speechSynthesis.cancel();

        };


    }, [randomIntro, onNext]);


    /* =========================================
                    UI
    ========================================= */

    return (

        <div className="sentence-repair-teacher-intro-container">


            {/* =================================
                    MAIN TEACHER CARD
            ================================= */}

            <div className="sentence-repair-teacher-intro-card">


                {/* =============================
                        TEACHER
                ============================= */}

                <div className="sentence-repair-teacher-image-area">

                    <img
                        src={teacher}
                        alt="Miss Uroosa"
                        className={
                            isSpeaking
                                ? "sentence-repair-teacher-image speaking"
                                : "sentence-repair-teacher-image"
                        }
                    />

                </div>


                {/* =============================
                    SPEECH BUBBLE
                ============================= */}

                <div className="sentence-repair-teacher-speech-bubble">


                    <div className="sentence-repair-teacher-name">

                        Miss Uroosa 👩‍🏫

                    </div>


                    <p>

                        {teacherText}

                        {isSpeaking && (

                            <span className="sentence-repair-typing-dots">

                                ...

                            </span>

                        )}

                    </p>


                </div>


            </div>


        </div>

    );

}


export default SentenceRepairLabTeacherIntro;