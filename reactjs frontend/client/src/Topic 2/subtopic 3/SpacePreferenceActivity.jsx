import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import "./SpacePreferenceActivity.css";

/* =====================================================
   IMAGES
===================================================== */

import spaceBackground from "../../assets/spaceBackground.png";
import spaceship from "../../assets/spaceship.png";

import planetArt from "../../assets/planetArt.png";
import planetSports from "../../assets/planetSports.png";
import planetFood from "../../assets/planetFood.png";
import planetBooks from "../../assets/planetBooks.png";
import planetFinal from "../../assets/planetFinal.png";

import painting from "../../assets/painting.png";
import football from "../../assets/football.png";
import pizza from "../../assets/spacePizza.png";
import books from "../../assets/books.png";

import alien from "../../assets/alien.png";
import asteroid from "../../assets/asteroid.png";
import preferenceCrystal from "../../assets/preferenceCrystal.png";


/* =====================================================
   COMPONENT
===================================================== */

const SpacePreferenceMissionActivity = ({
    onFinish,
    teacherImage,
    userName
}) => {

    /* =====================================================
       STATES
    ===================================================== */

    const [screen, setScreen] = useState("intro");

    const [round, setRound] = useState(1);

    const [score, setScore] = useState(0);

    const [crystals, setCrystals] = useState([]);

    const [selectedPlanet, setSelectedPlanet] = useState(null);

    const [feedback, setFeedback] = useState("");

    const [feedbackType, setFeedbackType] = useState("");

    const [showObstacle, setShowObstacle] = useState(false);

    const [showCrystal, setShowCrystal] = useState(false);

    const [spokenAnswer, setSpokenAnswer] = useState("");

    const [isListening, setIsListening] = useState(false);

    const [finalScore, setFinalScore] = useState(0);

    /* =====================================================
       ROUND 2 STATES
    ===================================================== */

    const [showRound2Confetti, setShowRound2Confetti] =
        useState(false);

    const [round2TeacherRemark, setRound2TeacherRemark] =
        useState("");

    const [round2Answered, setRound2Answered] =
        useState(false);

    /* =====================================================
       ROUND 3 STATES
    ===================================================== */

    const [finalChecking, setFinalChecking] =
        useState(false);

    const [finalAnswered, setFinalAnswered] =
        useState(false);

    const [finalTeacherResponse, setFinalTeacherResponse] =
        useState("");

    const recognitionRef = useRef(null);


    /* =====================================================
       PLANETS
    ===================================================== */

    const planets = [
        {
            id: "art",
            name: "Planet Art",
            image: planetArt,
            object: painting,
            objectName: "Painting"
        },

        {
            id: "sports",
            name: "Planet Sports",
            image: planetSports,
            object: football,
            objectName: "Football"
        },

        {
            id: "food",
            name: "Planet Food",
            image: planetFood,
            objectName: "Pizza"
        },

        {
            id: "books",
            name: "Planet Books",
            image: planetBooks,
            object: books,
            objectName: "Reading"
        }
    ];


    /* =====================================================
       ROUND 1
       LISTEN & CHOOSE
    ===================================================== */

    const listenQuestions = [
        {
            text: "My partner likes painting.",
            correct: "art"
        },

        {
            text: "My partner likes reading.",
            correct: "books"
        },

        {
            text: "My partner likes football.",
            correct: "sports"
        },

        {
            text: "My partner likes pizza.",
            correct: "food"
        },

        {
            text: "My partner likes drawing.",
            correct: "art"
        }
    ];

    const [listenIndex, setListenIndex] = useState(0);


    /* =====================================================
       ROUND 2
       FIX THE ALIEN
    ===================================================== */

    const grammarQuestions = [
        {
            wrong: "She like pizza.",
            correct: "She likes pizza.",
            explanation:
                "We use 'likes' with She. So the correct sentence is 'She likes pizza.'"
        },

        {
            wrong: "He like football.",
            correct: "He likes football.",
            explanation:
                "We use 'likes' with He. So the correct sentence is 'He likes football.'"
        },

        {
            wrong: "She don't like swimming.",
            correct: "She doesn't like swimming.",
            explanation:
                "With She, we use 'doesn't', not 'don't'. So the correct sentence is 'She doesn't like swimming.'"
        }
    ];

    const [grammarIndex, setGrammarIndex] = useState(0);


    /* =====================================================
       ROUND 3
       FINAL SPEAKING QUESTION
    ===================================================== */

    const speakPrompt =
        "Tell me one thing your partner likes and one thing your partner does not like.";


    /* =====================================================
       TEACHER SPEECH
    ===================================================== */

    const speakTeacher = (text) => {

        if (!text) return;

        if (!window.speechSynthesis) return;

        window.speechSynthesis.cancel();

        const utterance =
            new SpeechSynthesisUtterance(text);

        utterance.rate = 0.9;
        utterance.pitch = 1.05;

        window.speechSynthesis.speak(utterance);
    };


    /* =====================================================
       CLEANUP SPEECH RECOGNITION
    ===================================================== */

    useEffect(() => {

        return () => {

            if (recognitionRef.current) {

                try {
                    recognitionRef.current.stop();
                } catch (error) {}

            }

            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }

        };

    }, []);


    /* =====================================================
       INTRO SPEECH
    ===================================================== */

    useEffect(() => {

        if (screen === "intro") {

            const timer = setTimeout(() => {

                speakTeacher(
                    "Welcome to the Space Preference Mission! Guide your spaceship to planets that contain things your partner likes."
                );

            }, 500);

            return () => clearTimeout(timer);
        }

    }, [screen]);


    /* =====================================================
       START MISSION
    ===================================================== */

    const startMission = () => {

        setScreen("round1");

        setRound(1);

        setScore(0);

        setCrystals([]);

        setListenIndex(0);

        setGrammarIndex(0);

        setSelectedPlanet(null);

        setFeedback("");

        setFeedbackType("");

        setShowRound2Confetti(false);

        setRound2TeacherRemark("");

        setRound2Answered(false);

        setSpokenAnswer("");

        setIsListening(false);

        setFinalScore(0);

        setFinalChecking(false);

        setFinalAnswered(false);

        setFinalTeacherResponse("");

        setTimeout(() => {

            speakTeacher(
                listenQuestions[0].text
            );

        }, 400);
    };


    /* =====================================================
       COLLECT CRYSTAL
    ===================================================== */

    const collectCrystal = (label) => {

        setShowCrystal(true);

        setCrystals(prev => [
            ...prev,
            label
        ]);

        setTimeout(() => {

            setShowCrystal(false);

        }, 1200);
    };


    /* =====================================================
       ROUND 1
       SPACESHIP MOVEMENT
    ===================================================== */

    const handlePlanetClick = (planet) => {

        if (selectedPlanet) return;

        const currentQuestion =
            listenQuestions[listenIndex];

        setSelectedPlanet(planet.id);


        /* =================================================
           CORRECT
        ================================================= */

        if (planet.id === currentQuestion.correct) {

            setFeedback(
                "Correct! You found your partner's preference! ⭐"
            );

            setFeedbackType("correct");

            setScore(prev => prev + 10);

            collectCrystal(planet.name);

        }


        /* =================================================
           WRONG
        ================================================= */

        else {

            setFeedback(
                "Oops! Wrong answer. This planet does not match the preference you heard. Listen again and try another planet."
            );

            setFeedbackType("wrong");

            speakTeacher(
                "Oops! Wrong answer. This planet does not match the preference you heard. Listen again and try another planet."
            );

            setShowObstacle(true);

            setTimeout(() => {

                setShowObstacle(false);

            }, 1200);
        }


        /* =================================================
           NEXT
        ================================================= */

        setTimeout(() => {

            if (planet.id === currentQuestion.correct) {

                if (
                    listenIndex <
                    listenQuestions.length - 1
                ) {

                    const nextIndex =
                        listenIndex + 1;

                    setListenIndex(nextIndex);

                    setSelectedPlanet(null);

                    setFeedback("");

                    setTimeout(() => {

                        speakTeacher(
                            listenQuestions[nextIndex].text
                        );

                    }, 300);

                }

                else {

                    setSelectedPlanet(null);

                    setFeedback("");

                    setScreen("round2");

                    setRound(2);

                    setGrammarIndex(0);

                    setRound2Answered(false);

                    setRound2TeacherRemark("");

                    setTimeout(() => {

                        speakTeacher(
                            `Great job! Now help the alien fix its English. The alien wrote: ${grammarQuestions[0].wrong}. Which sentence is correct?`
                        );

                    }, 400);
                }

            }

            else {

                setSelectedPlanet(null);

                setFeedback("");

            }

        }, 1400);
    };


    /* =====================================================
       ROUND 2
       CONFETTI
    ===================================================== */

    const launchRound2Confetti = () => {

        setShowRound2Confetti(true);

        confetti({
            particleCount: 120,
            spread: 90,
            startVelocity: 35,
            origin: {
                x: 0.5,
                y: 0.55
            }
        });

        setTimeout(() => {

            confetti({
                particleCount: 70,
                spread: 120,
                startVelocity: 25,
                origin: {
                    x: 0.25,
                    y: 0.6
                }
            });

            confetti({
                particleCount: 70,
                spread: 120,
                startVelocity: 25,
                origin: {
                    x: 0.75,
                    y: 0.6
                }
            });

        }, 250);

        setTimeout(() => {

            setShowRound2Confetti(false);

        }, 1800);
    };


    /* =====================================================
       ROUND 2
       GRAMMAR ANSWER
    ===================================================== */

    const handleGrammarAnswer = (answer) => {

        if (round2Answered) return;

        const current =
            grammarQuestions[grammarIndex];


        /* =================================================
           CORRECT
        ================================================= */

        if (answer === current.correct) {

            setRound2Answered(true);

            setScore(prev => prev + 10);

            setFeedback(
                "Perfect! The alien sentence is fixed! ⭐"
            );

            setFeedbackType("correct");

            collectCrystal("Grammar Crystal");

            launchRound2Confetti();


            const remarks = [
                "Excellent! You fixed it perfectly!",
                "Great job! You know your grammar!",
                "Fantastic! The alien is learning from you!"
            ];

            const remark =
                remarks[
                    grammarIndex %
                    remarks.length
                ];


            setTimeout(() => {

                setRound2TeacherRemark(remark);

                speakTeacher(remark);

            }, 1900);


            setTimeout(() => {

                setFeedback("");

                setRound2TeacherRemark("");

                setRound2Answered(false);


                if (
                    grammarIndex <
                    grammarQuestions.length - 1
                ) {

                    const nextIndex =
                        grammarIndex + 1;

                    setGrammarIndex(nextIndex);


                    setTimeout(() => {

                        const next =
                            grammarQuestions[
                                nextIndex
                            ];

                        speakTeacher(
                            `The alien wrote: ${next.wrong}. Which sentence is correct?`
                        );

                    }, 350);

                }

                else {

                    setScreen("final");

                    setRound(3);

                    setSpokenAnswer("");

                    setFinalChecking(false);

                    setFinalAnswered(false);

                    setFinalTeacherResponse("");

                    setTimeout(() => {

                        speakTeacher(
                            "Excellent! You fixed all the alien's sentences. Now complete the final speaking mission."
                        );

                    }, 400);
                }

            }, 2400);

        }


        /* =================================================
           WRONG ANSWER
        ================================================= */

        else {

            setFeedback(
                `Oops! Wrong answer. ${current.explanation}`
            );

            setFeedbackType("wrong");

            speakTeacher(
                `Oops! Wrong answer. ${current.explanation} Try again.`
            );
        }
    };


    /* =====================================================
       ROUND 3
       START MICROPHONE
    ===================================================== */

    const startListening = () => {

        if (finalChecking) return;

        if (finalAnswered) return;


        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        /* =================================================
           BROWSER SUPPORT
        ================================================= */

        if (!SpeechRecognition) {

            const message =
                "Speech recognition is not supported in this browser.";

            setSpokenAnswer(message);

            setFeedback(
                "Your browser does not support speech recognition."
            );

            setFeedbackType("wrong");

            speakTeacher(
                "Your browser does not support speech recognition. Please use a supported browser and try again."
            );

            return;
        }


        /* =================================================
           STOP PREVIOUS RECOGNITION
        ================================================= */

        if (recognitionRef.current) {

            try {
                recognitionRef.current.stop();
            } catch (error) {}

        }


        /* =================================================
           CREATE RECOGNITION
        ================================================= */

        const recognition =
            new SpeechRecognition();

        recognition.lang = "en-US";

        recognition.continuous = false;

        recognition.interimResults = false;

        recognition.maxAlternatives = 1;


        /* =================================================
           START
        ================================================= */

        recognition.onstart = () => {

            setIsListening(true);

            setSpokenAnswer("");

            setFeedback("");

            setFeedbackType("");

            setFinalTeacherResponse("");
        };


        /* =================================================
           RESULT
        ================================================= */

        recognition.onresult = (event) => {

            const text =
                event
                    ?.results?.[0]?.[0]
                    ?.transcript
                    ?.trim() || "";


            setSpokenAnswer(text);

            setIsListening(false);


            if (!text) {

                handleNoSpeech();

                return;
            }


            /* =============================================
               SEND TO BACKEND
            ============================================= */

            checkSpeakingAnswer(text);
        };


        /* =================================================
           ERROR
        ================================================= */

        recognition.onerror = (event) => {

            setIsListening(false);

            console.log(
                "Speech Recognition Error:",
                event
            );


            if (
                event?.error === "no-speech"
            ) {

                handleNoSpeech();

                return;
            }


            if (
                event?.error === "audio-capture"
            ) {

                setSpokenAnswer(
                    "Microphone could not be accessed."
                );

                setFeedback(
                    "Microphone problem. Please check your microphone and try again."
                );

                setFeedbackType("wrong");

                speakTeacher(
                    "Mujhe microphone se awaaz nahi mil rahi. Please microphone check karo aur phir try karo."
                );

                return;
            }


            setSpokenAnswer(
                "I couldn't hear you. Please try again."
            );

            setFeedback(
                "I couldn't hear you. Please try again."
            );

            setFeedbackType("wrong");

            speakTeacher(
                "I couldn't hear you. Please try again."
            );
        };


        /* =================================================
           END
        ================================================= */

        recognition.onend = () => {

            setIsListening(false);

        };


        recognitionRef.current =
            recognition;


        /* =================================================
           START MICROPHONE
        ================================================= */

        try {

            recognition.start();

        }

        catch (error) {

            console.log(
                "Recognition Start Error:",
                error
            );

            setIsListening(false);

        }
    };


    /* =====================================================
       NO SPEECH
    ===================================================== */

    const handleNoSpeech = () => {

        setSpokenAnswer("");

        setFeedback(
            "Sorry, I couldn't hear you."
        );

        setFeedbackType("wrong");

        setFinalTeacherResponse(
            "Sorry, I couldn't hear you. Please try again."
        );

        speakTeacher(
            "Sorry, I couldn't hear you. Please try again."
        );
    };


    /* =====================================================
       ROUND 3
       BACKEND SPEAKING CHECK
    ===================================================== */

    const checkSpeakingAnswer = async (text) => {

        if (!text || !text.trim()) {

            handleNoSpeech();

            return;
        }


        setFinalChecking(true);

        setFeedback("");

        setFeedbackType("");

        setFinalTeacherResponse("");


        try {

            const response =
                await fetch(
                    "/api/space-preference/activity3",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            question:
                                speakPrompt,

                            message:
                                text,

                            context:
                                "Topic 2 - All About My Partner. Subtopic 3 - Likes and Dislikes. Space Preference Mission - Round 3 Final Speaking Challenge.",

                            userName:
                                userName || "Student"

                        })
                    }
                );


            /* =================================================
               HTTP ERROR
            ================================================= */

            if (!response.ok) {

                const errorText =
                    await response.text();

                console.log(
                    "Backend Error:",
                    errorText
                );

                throw new Error(
                    "Backend request failed."
                );
            }


            /* =================================================
               RESPONSE
            ================================================= */

            const data =
                await response.json();


            console.log(
                "Round 3 Backend Response:",
                data
            );


            /* =================================================
               BACKEND FAILURE
            ================================================= */

            if (!data || data.success === false) {

                throw new Error(
                    data?.message ||
                    "Unable to check answer."
                );
            }


            /* =================================================
               TEACHER RESPONSE
            ================================================= */

            const teacherResponse =
                data.teacherResponse ||
                data.feedback ||
                "Let's try again.";


            setFinalTeacherResponse(
                teacherResponse
            );


            setFeedback(
                data.feedback || ""
            );


            /* =================================================
               CORRECT
            ================================================= */

            if (data.isCorrect === true) {

                setFinalAnswered(true);

                setFeedbackType("correct");

                const newScore =
                    score + 20;

                setScore(newScore);

                setFinalScore(newScore);

                collectCrystal(
                    "Final Speaking Crystal"
                );


                /* =============================================
                   TEACHER SPEAKS BACKEND RESPONSE
                ============================================= */

                speakTeacher(
                    teacherResponse
                );


                /* =============================================
                   FINAL CELEBRATION
                ============================================= */

                confetti({

                    particleCount: 160,

                    spread: 100,

                    startVelocity: 40,

                    origin: {
                        x: 0.5,
                        y: 0.55
                    }

                });


                setTimeout(() => {

                    setScreen("result");

                }, 2500);

            }


            /* =================================================
               INCORRECT / RETRY
            ================================================= */

            else {

                setFinalAnswered(false);

                setFeedbackType("wrong");

                setFinalScore(score);


                /*
                   Backend teacherResponse already contains:
                   - appreciation
                   - Roman English explanation
                   - corrected English sentence
                   - repeat instruction
                */

                speakTeacher(
                    teacherResponse
                );

            }

        }


        /* =====================================================
           NETWORK / SERVER ERROR
        ===================================================== */

        catch (error) {

            console.log(
                "❌ Round 3 Backend Connection Error:",
                error
            );

            setFeedbackType("wrong");

            setFeedback(
                "I couldn't check your answer right now. Please try again."
            );

            setFinalTeacherResponse(
                "Mujhe tumhara answer check karne mein thodi problem aa rahi hai. Please ek baar phir try karo."
            );

            speakTeacher(
                "Mujhe tumhara answer check karne mein thodi problem aa rahi hai. Please ek baar phir try karo."
            );

        }

        finally {

            setFinalChecking(false);

        }
    };


    /* =====================================================
       FINISH
    ===================================================== */

    const finishActivity = () => {

        if (recognitionRef.current) {

            try {
                recognitionRef.current.stop();
            } catch (error) {}

        }

        if (window.speechSynthesis) {

            window.speechSynthesis.cancel();

        }


        if (onFinish) {

            onFinish({

                score:
                    finalScore || score,

                maxScore:
                    100,

                crystals:
                    crystals.length

            });

        }

    };


    /* =====================================================
       INTRO
    ===================================================== */

    if (screen === "intro") {

        return (

            <div className="spm-page">

                <div className="spm-background" />

                <div className="spm-main-container">

                    {/* TOP BUTTONS */}

                    <button
                        className="spm-top-button spm-back-button"
                        onClick={() => {

                            if (onFinish) {
                                onFinish();
                            }

                        }}
                    >
                        ← Back
                    </button>


                    <button
                        className="spm-top-button spm-skip-button"
                        onClick={() =>
                            setScreen("result")
                        }
                    >
                        Skip →
                    </button>


                    {/* HEADER */}

                    <div className="spm-header">

                        <h1>
                            🚀 Space Preference Mission
                        </h1>

                        <p>
                            Explore the secret room and discover what your partner likes!
                        </p>

                    </div>


                    {/* INTRO */}

                    <div className="spm-intro-layout">

                        {/* LEFT */}

                        <div className="spm-intro-left">

                            <div className="spm-intro-teacher-row">

                                <div className="spm-teacher-box">

                                    <img
                                        src={spaceship}
                                        alt="Spaceship"
                                        className="spm-teacher-image"
                                    />

                                    <div className="spm-teacher-name">
                                        Spaceship Voyager
                                    </div>

                                </div>


                                <div className="spm-intro-bubble spm-speech-bubble">

                                    <p>
                                        Your partner is travelling through space!
                                    </p>

                                    <p>
                                        Guide the spaceship toward planets containing things your partner likes.
                                    </p>

                                </div>

                            </div>


                            {/* RULES */}

                            <div className="spm-intro-rules">

                                <div>
                                    🪐
                                    <span>
                                        Find preference planets
                                    </span>
                                </div>

                                <div>
                                    💎
                                    <span>
                                        Collect Preference Crystals
                                    </span>
                                </div>

                                <div>
                                    🚀
                                    <span>
                                        Complete the final speaking mission
                                    </span>
                                </div>

                            </div>


                            {/* STATS */}

                            <div className="spm-intro-stats">

                                <div className="spm-stat">

                                    <div className="spm-stat-icon spm-star-icon">
                                        ⭐
                                    </div>

                                    <strong>
                                        0
                                    </strong>

                                    <span>
                                        Stars
                                    </span>

                                </div>


                                <div className="spm-stat-divider" />


                                <div className="spm-stat">

                                    <div className="spm-stat-icon spm-clue-icon">
                                        🔎
                                    </div>

                                    <strong>
                                        0/5
                                    </strong>

                                    <span>
                                        Planet Clues
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* RIGHT */}

                        <div className="spm-intro-space-side">

                            <div className="spm-intro-space-image-wrap">

                                <img
                                    src={spaceBackground}
                                    alt="Space Preference Mission"
                                    className="spm-intro-space-image"
                                />

                                <img
                                    src={spaceship}
                                    alt="Spaceship"
                                    className="spm-intro-floating-ship"
                                />

                                <img
                                    src={planetArt}
                                    alt="Planet Art"
                                    className="spm-intro-planet spm-intro-planet-1"
                                />

                                <img
                                    src={planetSports}
                                    alt="Planet Sports"
                                    className="spm-intro-planet spm-intro-planet-2"
                                />

                                <img
                                    src={planetFood}
                                    alt="Planet Food"
                                    className="spm-intro-planet spm-intro-planet-3"
                                />

                            </div>


                            <button
                                className="spm-start-exploring"
                                onClick={startMission}
                            >
                                🔎 Start Exploring
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        );
    }


    /* =====================================================
       MAIN ACTIVITY
    ===================================================== */

    return (

        <div className="spm-page">

            <div className="spm-background" />

            <div className="spm-main-container">

                {/* TOP BUTTONS */}

                <button
                    className="spm-top-button spm-back-button"
                    onClick={() => setScreen("intro")}
                >
                    ← Back
                </button>


                <button
                    className="spm-top-button spm-skip-button"
                    onClick={() =>
                        setScreen("result")
                    }
                >
                    Skip →
                </button>


                {/* HEADER */}

                <div className="spm-header">

                    <h1>
                        🚀 Space Preference Mission
                    </h1>

                    <p>
                        Navigate • Discover • Speak
                    </p>

                </div>


                {/* ACTIVITY AREA */}

                <div className="spm-activity-layout">


                    {/* =================================================
                        ROUND 1
                    ================================================= */}

                    {screen === "round1" && (

                        <div className="spm-activity-card">

                            <div className="spm-round-badge">

                                <span>
                                    ROUND
                                </span>

                                <strong>
                                    1
                                </strong>

                                <small>
                                    LISTEN & CHOOSE
                                </small>

                            </div>


                            <div className="spm-score-panel">

                                <div className="spm-score-item">

                                    <span>
                                        ⭐
                                    </span>

                                    <strong>
                                        {score}
                                    </strong>

                                    <small>
                                        SCORE
                                    </small>

                                </div>

                                <div className="spm-score-divider" />

                                <div className="spm-score-item">

                                    <span>
                                        💎
                                    </span>

                                    <strong>
                                        {crystals.length}
                                    </strong>

                                    <small>
                                        CRYSTALS
                                    </small>

                                </div>

                            </div>


                            <img
                                src={spaceBackground}
                                alt=""
                                className="spm-space-bg-image"
                            />


                            <div className="spm-mission-card">

                                <span>
                                    LISTEN CAREFULLY
                                </span>

                                <strong>
                                    {
                                        listenQuestions[
                                            listenIndex
                                        ].text
                                    }
                                </strong>

                                <button
                                    className="spm-listen-button"
                                    onClick={() =>
                                        speakTeacher(
                                            listenQuestions[
                                                listenIndex
                                            ].text
                                        )
                                    }
                                >
                                    🔊
                                </button>

                            </div>


                            <div className="spm-planets">

                                <button
                                    className="spm-planet spm-planet-art"
                                    onClick={() =>
                                        handlePlanetClick(
                                            planets[0]
                                        )
                                    }
                                >

                                    <img
                                        src={planetArt}
                                        alt="Planet Art"
                                    />

                                    <span className="spm-planet-label">
                                        Planet Art
                                    </span>

                                </button>


                                <button
                                    className="spm-planet spm-planet-sports"
                                    onClick={() =>
                                        handlePlanetClick(
                                            planets[1]
                                        )
                                    }
                                >

                                    <img
                                        src={planetSports}
                                        alt="Planet Sports"
                                    />

                                    <span className="spm-planet-label">
                                        Planet Sports
                                    </span>

                                </button>


                                <button
                                    className="spm-planet spm-planet-food"
                                    onClick={() =>
                                        handlePlanetClick(
                                            planets[2]
                                        )
                                    }
                                >

                                    <img
                                        src={planetFood}
                                        alt="Planet Food"
                                    />

                                    <span className="spm-planet-label">
                                        Planet Food
                                    </span>

                                </button>


                                <button
                                    className="spm-planet spm-planet-books"
                                    onClick={() =>
                                        handlePlanetClick(
                                            planets[3]
                                        )
                                    }
                                >

                                    <img
                                        src={planetBooks}
                                        alt="Planet Books"
                                    />

                                    <span className="spm-planet-label">
                                        Planet Books
                                    </span>

                                </button>

                            </div>


                            {/* SPACESHIP */}

                            <div
                                className={
                                    `spm-spaceship ${
                                        selectedPlanet
                                            ? `spm-ship-to-${selectedPlanet}`
                                            : ""
                                    }`
                                }
                            >

                                <img
                                    src={spaceship}
                                    alt="Spaceship"
                                />

                            </div>


                            {/* ASTEROID */}

                            {showObstacle && (

                                <div className="spm-obstacle">

                                    <img
                                        src={asteroid}
                                        alt="Asteroid"
                                    />

                                </div>

                            )}


                            {/* CRYSTAL */}

                            {showCrystal && (

                                <div className="spm-crystal">

                                    <img
                                        src={preferenceCrystal}
                                        alt="Preference Crystal"
                                    />

                                </div>

                            )}


                            {/* COUNTER */}

                            <div className="spm-crystal-counter">

                                <span>
                                    💎
                                </span>

                                {crystals.length}/5 Planet Clues

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        ROUND 2
                    ================================================= */}

                    {screen === "round2" && (

                        <div className="spm-activity-card spm-round-card spm-round2-card">

                            <div className="spm-round-badge">

                                <span>
                                    ROUND
                                </span>

                                <strong>
                                    2
                                </strong>

                                <small>
                                    FIX THE ALIEN
                                </small>

                            </div>


                            <div className="spm-score-panel">

                                <div className="spm-score-item">

                                    <span>
                                        ⭐
                                    </span>

                                    <strong>
                                        {score}
                                    </strong>

                                    <small>
                                        SCORE
                                    </small>

                                </div>

                                <div className="spm-score-divider" />

                                <div className="spm-score-item">

                                    <span>
                                        💎
                                    </span>

                                    <strong>
                                        {crystals.length}
                                    </strong>

                                    <small>
                                        CRYSTALS
                                    </small>

                                </div>

                            </div>


                            <div className="spm-round2-content">


                                {/* ALIEN */}

                                <div className="spm-round2-alien">

                                    <img
                                        src={alien}
                                        alt="Friendly Alien"
                                    />

                                    <div className="spm-round2-alien-bubble">

                                        <span className="spm-alien-emoji">
                                            👽
                                        </span>

                                        <span>
                                            Help me fix my English!
                                        </span>

                                    </div>

                                </div>


                                {/* QUESTION */}

                                <div className="spm-round2-question">

                                    <div className="spm-round2-label">
                                        👽 THE ALIEN WROTE
                                    </div>


                                    <div className="spm-round2-wrong">

                                        "{grammarQuestions[
                                            grammarIndex
                                        ].wrong}"

                                    </div>


                                    <div className="spm-round2-question-title">

                                        🔎 Which sentence is correct?

                                    </div>


                                    {/* OPTIONS */}

                                    <div className="spm-round2-options">

                                        <button
                                            className="spm-round2-option"
                                            disabled={round2Answered}
                                            onClick={() =>
                                                handleGrammarAnswer(
                                                    grammarQuestions[
                                                        grammarIndex
                                                    ].correct
                                                )
                                            }
                                        >

                                            <span className="spm-option-letter">
                                                A
                                            </span>

                                            <span>
                                                {
                                                    grammarQuestions[
                                                        grammarIndex
                                                    ].correct
                                                }
                                            </span>

                                        </button>


                                        <button
                                            className="spm-round2-option"
                                            disabled={round2Answered}
                                            onClick={() =>
                                                handleGrammarAnswer(
                                                    grammarQuestions[
                                                        grammarIndex
                                                    ].wrong
                                                )
                                            }
                                        >

                                            <span className="spm-option-letter">
                                                B
                                            </span>

                                            <span>
                                                {
                                                    grammarQuestions[
                                                        grammarIndex
                                                    ].wrong
                                                }
                                            </span>

                                        </button>

                                    </div>


                                    {/* TEACHER REMARK */}

                                    {round2TeacherRemark && (

                                        <div className="spm-round2-remark">

                                            <span className="spm-remark-icon">
                                                ⭐
                                            </span>

                                            <div>

                                                <strong>
                                                    Voyager says:
                                                </strong>

                                                <p>
                                                    {round2TeacherRemark}
                                                </p>

                                            </div>

                                        </div>

                                    )}

                                </div>

                            </div>


                            {/* PROGRESS */}

                            <div className="spm-round2-progress">

                                {grammarQuestions.map(
                                    (_, index) => (

                                        <div
                                            key={index}
                                            className={
                                                `spm-progress-dot ${
                                                    index <
                                                    grammarIndex
                                                        ? "completed"
                                                        : index ===
                                                          grammarIndex
                                                            ? "active"
                                                            : ""
                                                }`
                                            }
                                        >

                                            {
                                                index <
                                                grammarIndex
                                                    ? "✓"
                                                    : index + 1
                                            }

                                        </div>

                                    )
                                )}

                            </div>


                            {showRound2Confetti && (

                                <div className="spm-round2-confetti-active" />

                            )}

                        </div>

                    )}


                    {/* =================================================
                        ROUND 3 — FINAL SPEAKING
                    ================================================= */}

                    {screen === "final" && (

                        <div className="spm-activity-card spm-round-card">

                            <div className="spm-round-badge">

                                <span>
                                    ROUND
                                </span>

                                <strong>
                                    3
                                </strong>

                                <small>
                                    FINAL SPEAK CHALLENGE
                                </small>

                            </div>


                            <div className="spm-score-panel">

                                <div className="spm-score-item">

                                    <span>
                                        ⭐
                                    </span>

                                    <strong>
                                        {score}
                                    </strong>

                                    <small>
                                        SCORE
                                    </small>

                                </div>

                                <div className="spm-score-divider" />

                                <div className="spm-score-item">

                                    <span>
                                        💎
                                    </span>

                                    <strong>
                                        {crystals.length}
                                    </strong>

                                    <small>
                                        CRYSTALS
                                    </small>

                                </div>

                            </div>


                            {/* FINAL CARD */}

                            <div className="spm-final-card">

                                <img
                                    src={planetFinal}
                                    alt="Final Planet"
                                    className="spm-final-planet"
                                />


                                <div className="spm-final-content">

                                    <h2>
                                        🚀 Final Mission
                                    </h2>


                                    <p>
                                        Tell me one thing your partner likes and one thing your partner does not like.
                                    </p>


                                    {/* QUESTION */}

                                    <div className="spm-speaking-example">

                                        <strong>
                                            🎤 Your Mission
                                        </strong>

                                        <span>
                                            Tell me one thing your partner likes and one thing your partner does not like.
                                        </span>

                                    </div>


                                    {/* EXAMPLE */}

                                    <div className="spm-speaking-example">

                                        Example: My partner likes football. My partner doesn't like swimming.

                                    </div>


                                    {/* MIC */}

                                    <button
                                        className={
                                            `spm-mic-button ${
                                                isListening
                                                    ? "spm-listening"
                                                    : ""
                                            }`
                                        }
                                        onClick={
                                            startListening
                                        }
                                        disabled={
                                            isListening ||
                                            finalChecking ||
                                            finalAnswered
                                        }
                                    >

                                        {finalChecking
                                            ? "⏳ Checking..."
                                            : isListening
                                                ? "🎤 Listening..."
                                                : finalAnswered
                                                    ? "✅ Completed"
                                                    : "🎤 Speak Now"
                                        }

                                    </button>


                                    {/* SPOKEN ANSWER */}

                                    {spokenAnswer && (

                                        <div className="spm-spoken-answer">

                                            <strong>
                                                You said:
                                            </strong>

                                            <span>
                                                {spokenAnswer}
                                            </span>

                                        </div>

                                    )}


                                    {/* BACKEND TEACHER RESPONSE */}

                                    {finalTeacherResponse && (

                                        <div
                                            className={
                                                `spm-final-teacher-response ${
                                                    feedbackType === "correct"
                                                        ? "correct"
                                                        : "wrong"
                                                }`
                                            }
                                        >

                                            <span>
                                                🚀 Voyager says:
                                            </span>

                                            <p>
                                                {finalTeacherResponse}
                                            </p>

                                        </div>

                                    )}

                                </div>

                            </div>

                        </div>

                    )}

                </div>


                {/* =================================================
                    GENERAL FEEDBACK
                ================================================= */}

                {feedback && (

                    <div
                        className={
                            `spm-feedback spm-feedback-${feedbackType}`
                        }
                    >

                        {feedback}

                    </div>

                )}


                {/* =================================================
                    RESULT
                ================================================= */}

                {screen === "result" && (

                    <div className="spm-popup-overlay">

                        <div className="spm-result-popup">

                            <div className="spm-result-icon">
                                🚀
                            </div>


                            <h2>
                                Mission Complete!
                            </h2>


                            <p>
                                You explored the galaxy and discovered your partner's preferences!
                            </p>


                            <div className="spm-revealed-preferences">

                                <div className="spm-revealed-item">
                                    🎨 Painting
                                </div>

                                <div className="spm-revealed-item">
                                    📚 Reading
                                </div>

                            </div>


                            <button
                                className="spm-next-button"
                                onClick={finishActivity}
                            >
                                Continue ⭐
                            </button>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
};


export default SpacePreferenceMissionActivity;