import React, { useEffect, useState } from "react";

import teacher from "../../assets/teacher1.png";
import bg from "../../assets/chatbg.jpeg";
import yaySound from "../../assets/yay.mp3";

import confetti from "canvas-confetti";

import "./HobbiesActivity.css";


function HobbiesActivity({
    content,
    onBack,
    onNext
}) {

    /* ==========================================
                    ACTIVITY DATA
    ========================================== */

    const rounds =
        content?.activities?.[0]?.rounds || [];


    /* ==========================================
                    STATES
    ========================================== */

    const [current, setCurrent] = useState(0);

    const [selected, setSelected] = useState(null);

    const [feedback, setFeedback] = useState("");

    const [teacherMessage, setTeacherMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const [isSpeaking, setIsSpeaking] = useState(false);


    /* ==========================================
                    CURRENT ROUND
    ========================================== */

    const currentRound =
        rounds[current];


    /* ==========================================
                TEACHER SPEAK
                RETURNS PROMISE
    ========================================== */

    const speak = (text) => {

        return new Promise((resolve) => {

            if (!text) {

                resolve();

                return;

            }


            if (!window.speechSynthesis) {

                resolve();

                return;

            }


            window.speechSynthesis.cancel();


            setTeacherMessage(text);

            setIsSpeaking(true);


            const speech =
                new SpeechSynthesisUtterance(text);


            speech.lang = "en-US";

            speech.rate = 0.88;

            speech.pitch = 1.05;

            speech.volume = 1;


            const voices =
                window.speechSynthesis.getVoices();


            const femaleVoice =

                voices.find(v =>
                    /Google UK English Female/i.test(v.name)
                )

                ||

                voices.find(v =>
                    /Google US English/i.test(v.name)
                )

                ||

                voices.find(v =>
                    /Samantha/i.test(v.name)
                )

                ||

                voices.find(v =>
                    /Zira/i.test(v.name)
                )

                ||

                voices.find(v =>
                    /Jenny/i.test(v.name)
                )

                ||

                voices.find(v =>
                    /Aria/i.test(v.name)
                );


            if (femaleVoice) {

                speech.voice =
                    femaleVoice;

            }


            speech.onend = () => {

                setIsSpeaking(false);

                resolve();

            };


            speech.onerror = () => {

                setIsSpeaking(false);

                resolve();

            };


            window.speechSynthesis.speak(
                speech
            );

        });

    };


    /* ==========================================
            YAY SOUND
            RETURNS PROMISE
    ========================================== */

    const playYaySound = () => {

        return new Promise((resolve) => {

            const audio =
                new Audio(yaySound);


            audio.volume = 1;


            let finished = false;


            const finish = () => {

                if (finished) return;

                finished = true;

                resolve();

            };


            audio.addEventListener(
                "ended",
                finish,
                { once: true }
            );


            audio.addEventListener(
                "error",
                finish,
                { once: true }
            );


            audio.play().catch(() => {

                finish();

            });

        });

    };


    /* ==========================================
                    CONFETTI
    ========================================== */

    const celebrate = () => {

        // Main burst

        confetti({

            particleCount: 140,

            spread: 90,

            startVelocity: 40,

            origin: {
                x: 0.5,
                y: 0.65
            }

        });


        // Left burst

        setTimeout(() => {

            confetti({

                particleCount: 80,

                spread: 100,

                startVelocity: 35,

                origin: {
                    x: 0.15,
                    y: 0.65
                }

            });

        }, 100);


        // Right burst

        setTimeout(() => {

            confetti({

                particleCount: 80,

                spread: 100,

                startVelocity: 35,

                origin: {
                    x: 0.85,
                    y: 0.65
                }

            });

        }, 200);

    };


    /* ==========================================
                TEACHER REMARKS
    ========================================== */
const correctRemarks = {

    1:
        "Excellent! Sara ek person hai, isliye hum 'likes' kehte hain. Bohat acha!",

    2:
        "Excellent! Ali ek single person hai, isliye hum 'enjoys' kehte hain. Great job!",

    3:
        "Excellent! Ryan ek single person hai, isliye hum 'goes' aur 'helps' kehte hain. Amazing work!"

};


    /* ==========================================
                WRONG EXPLANATIONS
    ========================================== */

    const explanations = {

    1:
        "Chalo isko samajhte hain. Sara ek person hai, isliye hum 'likes' use karte hain, 'like' nahi. Aur hum 'it is' kehte hain. Ab sentence dobara try karo.",

    2:
        "Chalo isko samajhte hain. Ali ek single person hai, isliye hum 'enjoys' use karte hain, 'enjoy' nahi. Ab dobara try karo.",

    3:
        "Chalo isko samajhte hain. Ryan ek single person hai, isliye hum 'goes' use karte hain, 'go' nahi. Aur 'it' ke saath hum 'helps' use karte hain. Ab dobara try karo."

};
  

    /* ==========================================
                READ CURRENT SITUATION
    ========================================== */

    useEffect(() => {

        if (!currentRound) return;


        setSelected(null);

        setFeedback("");

        setTeacherMessage("");

        setLoading(false);


        const timer = setTimeout(() => {

            speak(
                currentRound.situation
            );

        }, 500);


        return () => {

            clearTimeout(timer);

            window.speechSynthesis.cancel();

        };

    }, [current]);


    /* ==========================================
                    LISTEN AGAIN
    ========================================== */

    const listenAgain = () => {

        if (
            !currentRound ||
            loading
        ) {

            return;

        }


        speak(
            currentRound.situation
        );

    };


    /* ==========================================
                    HANDLE ANSWER
    ========================================== */

    const handleAnswer = async (index) => {

        if (
            selected !== null ||
            loading ||
            !currentRound
        ) {

            return;

        }


        setSelected(index);

        setLoading(true);


        const isCorrect =
            index === currentRound.correctAnswer;


        /* ======================================
                    CORRECT ANSWER
        ====================================== */

        if (isCorrect) {

            setFeedback("correct");


            /*
                IMPORTANT:

                Confetti and yay sound
                START AT THE SAME TIME.
            */

            celebrate();

            try {

                /* ==================================
                        STEP 1

                        YAY SOUND

                        Confetti is already
                        running simultaneously.
                ================================== */

                await playYaySound();


                /*
                    IMPORTANT:

                    Yahan tabhi aayega jab
                    yay.mp3 completely finish
                    ho chuka hoga.
                */


                /* ==================================
                        STEP 2

                        TEACHER REMARK
                ================================== */

                const remark =
                    correctRemarks[
                        currentRound.round
                    ] ||
                    "Excellent! That's correct!";


                await speak(remark);


                /*
                    IMPORTANT:

                    Teacher remark completely
                    finish hone ke baad hi
                    next round chalega.
                */


                /* ==================================
                        STEP 3

                        NEXT ROUND
                ================================== */

                if (
                    current >=
                    rounds.length - 1
                ) {

                    window.speechSynthesis.cancel();

                    onNext();

                }

                else {

                    setCurrent(
                        prev =>
                            prev + 1
                    );

                }

            }

            catch (error) {

                console.log(
                    "Correct answer sequence error:",
                    error
                );

            }

            finally {

                setLoading(false);

            }

            return;

        }


        /* ======================================
                    WRONG ANSWER
        ====================================== */

        setFeedback("wrong");


        try {

            /*
                Wrong answer par
                explanation teacher bolegi.
            */

            const explanation =
                explanations[
                    currentRound.round
                ] ||
                "That's not quite right. Let's try again.";


            await speak(
                explanation
            );


            /*
                Explanation completely finish
                hone ke baad same round reset.
            */

            setSelected(null);

            setFeedback("");

            setTeacherMessage("");

        }

        catch (error) {

            console.log(
                "Wrong answer explanation error:",
                error
            );

            setSelected(null);

            setFeedback("");

        }

        finally {

            setLoading(false);

        }

    };


    /* ==========================================
                    OPTION CLASS
    ========================================== */

    const getOptionClass = (index) => {

        let className =
            "hobbies-option";


        if (
            selected === null
        ) {

            return className;

        }


        if (
            index ===
            currentRound.correctAnswer
        ) {

            className +=
                " correct";

        }

        else if (
            index === selected
        ) {

            className +=
                " wrong";

        }


        return className;

    };


    /* ==========================================
                    NO DATA
    ========================================== */

    if (!rounds.length) {

        return (

            <div
                className="hobbies-activity-page"
                style={{
                    backgroundImage:
                        `url(${bg})`
                }}
            >

                <div
                    className="hobbies-activity-overlay"
                />


                <div
                    className="hobbies-activity-card"
                >

                    <div
                        className="hobbies-no-data"
                    >

                        <h2>
                            Hobbies Activity
                        </h2>


                        <p>
                            Activity content is not available.
                        </p>


                        <button
                            className="hobbies-next-btn"
                            onClick={onBack}
                        >

                            ← Back

                        </button>

                    </div>

                </div>

            </div>

        );

    }


    /* ==========================================
                    MAIN
    ========================================== */

    return (

        <div
            className="hobbies-activity-page"
            style={{
                backgroundImage:
                    `url(${bg})`
            }}
        >

            <div
                className="hobbies-activity-overlay"
            />


            <div
                className="hobbies-activity-card"
            >


                {/* ==================================
                            HEADER
                ================================== */}

                <div
                    className="hobbies-activity-header"
                >

                    <button
                        className="hobbies-back-btn"
                        onClick={() => {

                            window.speechSynthesis.cancel();

                            onBack();

                        }}
                    >

                        ← Back

                    </button>


                    <h1>
                        Which Sentence Is Correct?
                    </h1>


                    <button
                        className="hobbies-skip-btn"
                        onClick={() => {

                            window.speechSynthesis.cancel();

                            onNext();

                        }}
                    >

                        Skip →

                    </button>

                </div>


                {/* ==================================
                            PROGRESS
                ================================== */}

                <div
                    className="hobbies-progress"
                >

                    Round{" "}

                    {current + 1}

                    {" / "}

                    {rounds.length}

                </div>


                {/* ==================================
                            CONTENT
                ================================== */}

                <div
                    className="hobbies-activity-content"
                >


                    {/* ==================================
                                TEACHER
                    ================================== */}

                    <div
                        className="hobbies-activity-left"
                    >

                        <div
                            className="teacher-stage"
                        >

                            <img
                                src={teacher}
                                alt="Miss Uroosa"
                                className={
                                    isSpeaking
                                        ? "hobbies-activity-teacher speaking"
                                        : "hobbies-activity-teacher"
                                }
                            />

                        </div>


                        {/* ==================================
                                TEACHER SPEECH
                        ================================== */}

                        {teacherMessage && (

                            <div
                                className="teacher-speech-bubble"
                            >

                                {teacherMessage}

                            </div>

                        )}

                    </div>


                    {/* ==================================
                                RIGHT SIDE
                    ================================== */}

                    <div
                        className="hobbies-activity-right"
                    >


                        {/* ==================================
                                SITUATION
                        ================================== */}

                        <div
                            className="hobbies-situation-box"
                        >

                            <div
                                className="situation-title"
                            >

                                🎧 Listen Carefully

                            </div>


                            <p>
                                {currentRound.situation}
                            </p>


                            <button
                                className="hobbies-listen-btn"
                                onClick={listenAgain}
                                disabled={loading}
                            >

                                🔊 Listen Again

                            </button>

                        </div>


                        {/* ==================================
                                QUESTION
                        ================================== */}

                        <div
                            className="hobbies-question-title"
                        >

                            Which sentence is correct?

                        </div>


                        {/* ==================================
                                OPTIONS
                        ================================== */}

                        <div
                            className="hobbies-options"
                        >

                            {currentRound.options.map(
                                (option, index) => (

                                    <button
                                        key={index}
                                        className={
                                            getOptionClass(
                                                index
                                            )
                                        }
                                        onClick={() =>
                                            handleAnswer(
                                                index
                                            )
                                        }
                                        disabled={
                                            selected !== null ||
                                            loading
                                        }
                                    >

                                        <span
                                            className="option-number"
                                        >

                                            {index + 1}

                                        </span>


                                        <span
                                            className="option-text"
                                        >

                                            {option}

                                        </span>

                                    </button>

                                )
                            )}

                        </div>


                        {/* ==================================
                                CORRECT FEEDBACK
                        ================================== */}

                        {feedback === "correct" && (

                            <div
                                className="hobbies-feedback success"
                            >

                                🎉 Excellent!

                            </div>

                        )}


                        {/* ==================================
                                WRONG FEEDBACK
                        ================================== */}

                        {feedback === "wrong" && (

                            <div
                                className="hobbies-feedback error"
                            >

                                ❌ Let's try again!

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>

    );

}


export default HobbiesActivity;