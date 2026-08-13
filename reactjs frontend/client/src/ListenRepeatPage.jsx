import React, { useState, useEffect } from "react";
import teacher from "./assets/teacher1.png";

function ListenRepeatPage({
    data,
    current,
    total,
    onNext,
    onSkip,
    onBack
}) {

    const [stage, setStage] = useState(0);
    const [teacherText, setTeacherText] = useState("");
    const [userSentence, setUserSentence] = useState("");
    const [listening, setListening] = useState(false);

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    /* =========================================
       SPEAK
    ========================================= */

    const speak = (text, callback) => {

        window.speechSynthesis.cancel();

        const speech =
            new SpeechSynthesisUtterance(text);

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
                v.name.toLowerCase().includes("female")
            ) ||
            voices[0];

        speech.onend = () => {

            if (callback) {
                callback();
            }

        };

        window.speechSynthesis.speak(speech);

    };


    /* =========================================
       NEW SENTENCE
    ========================================= */

    useEffect(() => {

        setStage(0);
        setTeacherText(data.sentence);
        setUserSentence("");
        setListening(false);

        speak(data.sentence);

    }, [data]);


    /* =========================================
       FIRST SPEAKING
    ========================================= */

    const startRepeatRecognition = () => {

        if (!SpeechRecognition) {

            alert(
                "Speech Recognition not supported"
            );

            return;

        }

        setListening(true);

        const recognition =
            new SpeechRecognition();

        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.start();


        recognition.onresult = () => {

            setListening(false);

            setStage(1);

            teacherCompleteSentence();

        };


        recognition.onerror = () => {

            setListening(false);

        };

    };


    /* =========================================
       TEACHER INSTRUCTION
    ========================================= */

    const teacherCompleteSentence = () => {

        const message =
            "Now let's complete the sentence. Please repeat the complete sentence with your choice.";

        setTeacherText(message);

        speak(message);

    };


    /* =========================================
       FINAL SPEAKING
    ========================================= */

    const startFinalRecognition = () => {

        if (!SpeechRecognition) {

            alert(
                "Speech Recognition not supported"
            );

            return;

        }

        setListening(true);

        const recognition =
            new SpeechRecognition();

        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.start();


        recognition.onresult = (event) => {

            setListening(false);

            const text =
                event.results[0][0].transcript;

            setUserSentence(text);

            const isCorrect =
                data.options.some(option =>
                    text
                        .toLowerCase()
                        .includes(
                            option.toLowerCase()
                        )
                );

            if (isCorrect) {

                correctAnswer();

            } else {

                // Same behavior as your old code:
                // move ahead even if answer is wrong.

                correctAnswer();

            }

        };


        recognition.onerror = () => {

            setListening(false);

            correctAnswer();

        };

    };


    /* =========================================
       CORRECT / NEXT
    ========================================= */

    const correctAnswer = () => {

        const message =
            "Great! Let's move on to the next sentence.";

        setTeacherText(message);

        speak(message, () => {

            setTimeout(() => {

                onNext();

            }, 1000);

        });

    };


    /* =========================================
       PROGRESS
    ========================================= */

    const progress =
        (current / total) * 100;


    return (

        <div className="lr-page">


            {/* =================================
                MAIN CARD
            ================================= */}

            <div className="lr-main-card">


                {/* =================================
                    HEADER
                ================================= */}

                <div className="lr-header">


                    {/* BACK */}

                  <button
    type="button"
    className="lr-back-btn"
    onClick={() => {
        console.log("BACK CLICKED");
        if (onBack) {
            onBack();
        }
    }}
>
    ← Back
</button>


                    {/* TITLE + PROGRESS */}

                    <div className="lr-title-area">

                        <div className="lr-title-box">

                            <h1>
                                Listen &amp; Repeat
                            </h1>

                        </div>


                       

                        <div className="lr-progress">

                            <div
                                className="lr-progress-fill"
                                style={{
                                    width:
                                        `${progress}%`
                                }}
                            />

                        </div>

                    </div>


                    {/* SKIP */}

                    <button
                        className="lr-skip-btn"
                        onClick={onSkip}
                    >
                        Skip →
                    </button>

                </div>


                {/* =================================
                    TEACHER SECTION
                ================================= */}

                <div className="lr-teacher-section">


                    <div className="lr-speech-bubble">

                        <p>
                            {stage === 0
                                ? "Let's listen carefully and repeat together!"
                                : teacherText}
                        </p>

                    </div>


                    <img
                        src={teacher}
                        alt="Miss Uroosa"
                        className="lr-teacher"
                    />


                    <div className="lr-teacher-name">

                        🌿 &nbsp; Miss Uroosa &nbsp; 🌿

                    </div>

                </div>


                {/* =================================
                    ACTIVITY CARD
                ================================= */}

                <div className="lr-activity-card">


                    {/* BADGE */}

                    <div className="lr-listen-badge">

                         &nbsp; Listen carefully

                    </div>


                    {/* =================================
                        STAGE 0
                    ================================= */}

                    {stage === 0 && (

                        <>

                            <h2 className="lr-sentence">

                                {data.sentence}

                            </h2>


                            <div className="lr-divider">

                                <span></span>

                                <b>✦</b>

                                <span></span>

                            </div>


                            <p className="lr-instruction">

                                Listen to Miss Uroosa
                                and repeat the sentence.

                            </p>


                            <button
                                className={
                                    listening
                                        ? "lr-mic listening"
                                        : "lr-mic"
                                }
                                onClick={
                                    startRepeatRecognition
                                }
                            >

                                🎙️

                            </button>


                            <p className="lr-mic-label">

                                {listening
                                    ? "Listening..."
                                    : "Tap to Repeat"}

                            </p>

                        </>

                    )}


                    {/* =================================
                        STAGE 1
                    ================================= */}

                    {stage === 1 && (

                        <>

                            <div className="lr-complete-badge">

                                ✨ Complete the sentence

                            </div>


                            <h2 className="lr-sentence">

                                {data.blank}

                            </h2>


                            <div className="lr-divider">

                                <span></span>

                                <b>✦</b>

                                <span></span>

                            </div>


                            <p className="lr-instruction">

                                Choose a word and say
                                the complete sentence.

                            </p>


                            <div className="lr-options">

                                {data.options.map(
                                    (option, index) => (

                                        <button
                                            key={index}
                                            className="lr-option"
                                        >
                                            {option}
                                        </button>

                                    )
                                )}

                            </div>


                            <button
                                className={
                                    listening
                                        ? "lr-mic listening"
                                        : "lr-mic"
                                }
                                onClick={
                                    startFinalRecognition
                                }
                            >

                                🎙️

                            </button>


                            <p className="lr-mic-label">

                                {listening
                                    ? "Listening..."
                                    : "Tap to Speak"}

                            </p>

                        </>

                    )}

                </div>


                {/* =================================
                    BOTTOM TIP
                ================================= */}

                <div className="lr-bottom-tip">

                    💡 &nbsp;
                    Listen carefully and speak clearly.

                </div>


            </div>

        </div>

    );

}

export default ListenRepeatPage;