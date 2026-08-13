import React, { useEffect, useState } from "react";
import teacher from "./assets/teacher1.png";

function PracticeExerciseTeacherIntro({ onNext }) {

    const intros = [
        "Wonderful! You did a great job in the Listen and Repeat activity. Now let's practice using restaurant sentences. You'll see a sentence with a missing word. Simply drag the correct word into the blank. Let's begin!",

        "Excellent work! Now it's time for some practice. Read the waiter's question carefully, then drag the correct word to complete the sentence. Let's get started!",

        "Amazing! Now we'll practice restaurant English. Complete each sentence by dragging the correct word into the blank. Ready? Let's begin!"
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


        // =========================
        // TYPING EFFECT
        // =========================

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


        // =========================
        // TEACHER VOICE
        // =========================

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
                v.name.includes("Google UK English Female")
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

        <div className="practice-teacher-intro-container">

            <div className="practice-teacher-intro-card">


                {/* =========================
                    TEACHER
                ========================= */}

                <div className="practice-teacher-image-area">

                    <img
                        src={teacher}
                        alt="Miss Uroosa"
                        className={
                            isSpeaking
                                ? "practice-teacher-image speaking"
                                : "practice-teacher-image"
                        }
                    />

                </div>


                {/* =========================
                    SPEECH BUBBLE
                ========================= */}

                <div className="practice-teacher-speech-bubble">

                    <div className="practice-teacher-name">

                        Miss Uroosa 👩‍🏫

                    </div>

                    <p>

                        {teacherText}

                        {isSpeaking && (

                            <span className="practice-typing-dots">
                                ...
                            </span>

                        )}

                    </p>

                </div>

            </div>

        </div>

    );

}

export default PracticeExerciseTeacherIntro;