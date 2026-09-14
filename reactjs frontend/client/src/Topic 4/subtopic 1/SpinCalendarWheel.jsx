/* =========================================================
   SPIN CALENDAR WHEEL
   UI + WHEEL LOGIC FIXED
   CONTENT / ACTIVITY CONCEPTS UNCHANGED
========================================================= */

import React, { useEffect, useRef, useState } from "react";

import teacher from "../../assets/teacher1.png";
import bg from "../../assets/chatbg.jpeg";
import yaySound from "../../assets/yay.mp3";

import confetti from "canvas-confetti";

import "./SpinCalendarWheel.css";


const SpinCalendarWheel = ({ onFinish, onBack }) => {

    /* =====================================================
       CALENDAR WORDS — SAME
    ===================================================== */

    const calendarWords = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",

        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];


    /* =====================================================
       STATES — SAME
    ===================================================== */

    const [selectedWord, setSelectedWord] = useState("");

    const [isSpinning, setIsSpinning] = useState(false);

    const [round, setRound] = useState(1);

    const [answer, setAnswer] = useState("");

    const [message, setMessage] = useState("");

    const [isCorrect, setIsCorrect] = useState(false);

    const [showResult, setShowResult] = useState(false);

    const [isSpeaking, setIsSpeaking] = useState(false);

    const [isListening, setIsListening] = useState(false);

    const [micMessage, setMicMessage] = useState("");


    /* =====================================================
       REFS
    ===================================================== */

    const recognitionRef = useRef(null);

    const mountedRef = useRef(true);

    const wheelRef = useRef(null);

    const totalRounds = 5;


    /* =====================================================
       WHEEL CONFIG
    ===================================================== */

    const totalWords = calendarWords.length;

    const segmentAngle = 360 / totalWords;


    /*
       This keeps track of the wheel's current rotation.

       We need this because the wheel can be spun multiple
       times during the activity.
    */

    const currentRotationRef = useRef(0);


    /* =====================================================
       CLEANUP — SAME
    ===================================================== */

    useEffect(() => {

        mountedRef.current = true;

        return () => {

            mountedRef.current = false;

            window.speechSynthesis?.cancel();

            if (recognitionRef.current) {

                try {
                    recognitionRef.current.stop();
                } catch (error) {
                    // already stopped
                }

            }

        };

    }, []);


    /* =====================================================
       TEXT TO SPEECH — SAME
    ===================================================== */

    const speak = (text) => {

        if (!text || !("speechSynthesis" in window)) {
            return;
        }

        window.speechSynthesis.cancel();

        const utterance =
            new SpeechSynthesisUtterance(text);

        utterance.lang = "en-US";
        utterance.rate = 0.92;
        utterance.pitch = 1.05;

        const voices =
            window.speechSynthesis.getVoices();

        const preferredVoice =
            voices.find(
                (voice) =>
                    voice.lang === "en-US" &&
                    (
                        voice.name
                            .toLowerCase()
                            .includes("female") ||
                        voice.name
                            .toLowerCase()
                            .includes("samantha") ||
                        voice.name
                            .toLowerCase()
                            .includes("zira")
                    )
            ) ||
            voices.find(
                (voice) =>
                    voice.lang === "en-US"
            );

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => {

            if (mountedRef.current) {
                setIsSpeaking(true);
            }

        };

        utterance.onend = () => {

            if (mountedRef.current) {
                setIsSpeaking(false);
            }

        };

        utterance.onerror = () => {

            if (mountedRef.current) {
                setIsSpeaking(false);
            }

        };

        window.speechSynthesis.speak(utterance);
    };


    /* =====================================================
       INTRO SPEECH — SAME
    ===================================================== */

    useEffect(() => {

        const timer = setTimeout(() => {

            speak(
                "Welcome to Calendar Wheel! Spin the wheel, get a calendar word, and make a sentence using it."
            );

        }, 700);

        return () => clearTimeout(timer);

    }, []);


    /* =====================================================
       SPEECH RECOGNITION — SAME
    ===================================================== */

    useEffect(() => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            return;
        }

        const recognition =
            new SpeechRecognition();

        recognition.continuous = false;

        recognition.interimResults = true;

        recognition.lang = "en-US";


        recognition.onstart = () => {

            if (!mountedRef.current) return;

            setIsListening(true);

            setMicMessage(
                "Listening... Speak your sentence."
            );

        };


        recognition.onresult = (event) => {

            if (!mountedRef.current) return;

            let transcript = "";

            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {

                transcript +=
                    event.results[i][0].transcript;

            }

            transcript =
                transcript.trim();

            if (transcript) {

                setAnswer(transcript);

                setMicMessage(
                    "Got it! You can edit your sentence if needed."
                );

            }

        };


        recognition.onerror = (event) => {

            if (!mountedRef.current) return;

            setIsListening(false);

            if (event.error === "not-allowed") {

                setMicMessage(
                    "Microphone permission was blocked."
                );

            } else if (event.error === "no-speech") {

                setMicMessage(
                    "I couldn't hear you. Please try again."
                );

            } else {

                setMicMessage(
                    "Something went wrong. Please try again."
                );

            }

        };


        recognition.onend = () => {

            if (!mountedRef.current) return;

            setIsListening(false);

        };


        recognitionRef.current =
            recognition;


        return () => {

            try {
                recognition.stop();
            } catch (error) {
                // already stopped
            }

        };

    }, []);


    /* =====================================================
       MIC — SAME
    ===================================================== */

    const handleMic = () => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {

            setMicMessage(
                "Speech recognition is not supported in this browser."
            );

            return;
        }


        if (!recognitionRef.current) {

            const recognition =
                new SpeechRecognition();

            recognition.continuous = false;

            recognition.interimResults = true;

            recognition.lang = "en-US";


            recognition.onstart = () => {

                setIsListening(true);

                setMicMessage(
                    "Listening... Speak your sentence."
                );

            };


            recognition.onresult = (event) => {

                let transcript = "";

                for (
                    let i = event.resultIndex;
                    i < event.results.length;
                    i++
                ) {

                    transcript +=
                        event.results[i][0].transcript;

                }

                transcript =
                    transcript.trim();

                if (transcript) {

                    setAnswer(transcript);

                    setMicMessage(
                        "Got it! You can edit your sentence if needed."
                    );

                }

            };


            recognition.onerror = (event) => {

                setIsListening(false);

                if (event.error === "not-allowed") {

                    setMicMessage(
                        "Microphone permission was blocked."
                    );

                } else if (event.error === "no-speech") {

                    setMicMessage(
                        "I couldn't hear you. Please try again."
                    );

                } else {

                    setMicMessage(
                        "Please try the microphone again."
                    );

                }

            };


            recognition.onend = () => {

                setIsListening(false);

            };


            recognitionRef.current =
                recognition;

        }


        if (isListening) {

            try {
                recognitionRef.current.stop();
            } catch (error) {
                // already stopped
            }

            setIsListening(false);

            return;
        }


        setMicMessage(
            "Listening... Speak your sentence."
        );


        try {

            recognitionRef.current.start();

        } catch (error) {

            try {
                recognitionRef.current.stop();
            } catch (stopError) {
                // ignore
            }

            setTimeout(() => {

                try {

                    recognitionRef.current.start();

                } catch (startError) {

                    setMicMessage(
                        "Please press the microphone again."
                    );

                }

            }, 150);

        }

    };


    /* =====================================================
       SPIN WHEEL — FIXED
       VISUAL POINTER = SELECTED WORD
    ===================================================== */

    const spinWheel = () => {

        if (isSpinning) {
            return;
        }


        /* -------------------------------------------------
           RESET CURRENT ROUND UI
        ------------------------------------------------- */

        setIsSpinning(true);

        setSelectedWord("");

        setAnswer("");

        setMessage("");

        setIsCorrect(false);

        setShowResult(false);

        setMicMessage("");


        /* -------------------------------------------------
           STOP MICROPHONE
        ------------------------------------------------- */

        if (recognitionRef.current) {

            try {
                recognitionRef.current.stop();
            } catch (error) {
                // already stopped
            }

        }


        speak("Spin the wheel!");


        /* -------------------------------------------------
           SELECT TARGET WORD
        -------------------------------------------------

           The SAME targetIndex is used for:

           1. Wheel rotation
           2. selectedWord

           So both can NEVER mismatch.
        ------------------------------------------------- */

        const targetIndex =
            Math.floor(
                Math.random() *
                totalWords
            );


        /* -------------------------------------------------
           CALCULATE TARGET ANGLE
        -------------------------------------------------

           Pointer is fixed at TOP.

           Each word gets one equal segment.

           We move the CENTER of the selected segment
           exactly underneath the pointer.
        ------------------------------------------------- */

        const targetSegmentCenter =
            (targetIndex * segmentAngle) +
            (segmentAngle / 2);


        /*
           Because the pointer is at 12 o'clock,
           wheel must rotate in the opposite direction.
        */

        const desiredRotation =
            360 -
            targetSegmentCenter;


        /* -------------------------------------------------
           ADD FULL SPINS
        ------------------------------------------------- */

        const fullSpins = 6;

        const currentNormalized =
            ((currentRotationRef.current % 360) + 360) % 360;


        /*
           Calculate how much more rotation is needed
           from the current wheel position.
        */

        let additionalRotation =
            desiredRotation -
            currentNormalized;


        if (additionalRotation < 0) {
            additionalRotation += 360;
        }


        additionalRotation +=
            fullSpins * 360;


        const finalRotation =
            currentRotationRef.current +
            additionalRotation;


        currentRotationRef.current =
            finalRotation;


        /* -------------------------------------------------
           APPLY ROTATION DIRECTLY TO WHEEL
        ------------------------------------------------- */

        const wheel =
            wheelRef.current;

        if (wheel) {

            /*
               Remove previous transition/animation state
            */

            wheel.classList.remove("spinning");

            /*
               Force browser reflow so every spin
               starts properly.
            */

            void wheel.offsetWidth;


            /*
               Store exact final rotation in CSS variable.
            */

            wheel.style.setProperty(
                "--wheel-start-rotation",
                `${currentRotationRef.current - additionalRotation}deg`
            );

            wheel.style.setProperty(
                "--wheel-final-rotation",
                `${finalRotation}deg`
            );


            wheel.classList.add("spinning");

        }


        /* -------------------------------------------------
           WAIT FOR WHEEL TO STOP
        ------------------------------------------------- */

        setTimeout(() => {

            if (!mountedRef.current) {
                return;
            }


            /*
               SAME targetIndex used above.

               Therefore the word shown to the student
               is EXACTLY the word under the pointer.
            */

            const word =
                calendarWords[targetIndex];


            setSelectedWord(word);

            setIsSpinning(false);


            /* -------------------------------------------------
               SPEAK SELECTED WORD
            ------------------------------------------------- */

            setTimeout(() => {

                if (mountedRef.current) {

                    speak(
                        `Your calendar word is ${word}. Make a sentence using it.`
                    );

                }

            }, 300);


        }, 4200);

    };


    /* =====================================================
       CHECK SENTENCE — SAME
    ===================================================== */

    const checkSentence = () => {

        const cleanedAnswer =
            answer.trim();


        if (!selectedWord) {

            setMessage(
                "Spin the wheel first!"
            );

            setIsCorrect(false);

            setShowResult(true);

            return;
        }


        if (!cleanedAnswer) {

            setMessage(
                "Please type a sentence or use the microphone."
            );

            setIsCorrect(false);

            setShowResult(true);

            speak(
                "Please type a sentence or use the microphone."
            );

            return;
        }


        const escapedWord =
            selectedWord.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );


        const wordRegex =
            new RegExp(
                `\\b${escapedWord}\\b`,
                "i"
            );


        const valid =
            wordRegex.test(cleanedAnswer);


        if (valid) {

            setIsCorrect(true);

            setMessage(
                `Great job! You used "${selectedWord}" correctly.`
            );

            setShowResult(true);


            confetti({
                particleCount: 130,
                spread: 80,
                origin: {
                    y: 0.65
                }
            });


            try {

                const audio =
                    new Audio(yaySound);

                audio.volume = 0.7;

                audio.play().catch(() => {});

            } catch (error) {
                // audio not available
            }


            speak(
                `Excellent! You made a sentence using ${selectedWord}.`
            );

        } else {

            setIsCorrect(false);

            setMessage(
                `Almost! Try making a sentence that uses "${selectedWord}".`
            );

            setShowResult(true);

            speak(
                `Almost! Try again. Use the word ${selectedWord} in your sentence.`
            );

        }

    };


    /* =====================================================
       NEXT ROUND — SAME
    ===================================================== */

    const nextRound = () => {

        setShowResult(false);

        setSelectedWord("");

        setAnswer("");

        setMessage("");

        setIsCorrect(false);

        setMicMessage("");


        if (round >= totalRounds) {

            speak(
                "Amazing work! You completed all five rounds."
            );

            setTimeout(() => {

                onFinish?.();

            }, 900);

            return;
        }


        const next =
            round + 1;

        setRound(next);


        setTimeout(() => {

            speak(
                `Round ${next}. Spin the wheel when you're ready.`
            );

        }, 300);

    };


    /* =====================================================
       RETRY — SAME
    ===================================================== */

    const retrySentence = () => {

        setShowResult(false);

        setMessage("");

        setMicMessage("");


        setTimeout(() => {

            speak(
                `Try again. Make a sentence using ${selectedWord}.`
            );

        }, 200);

    };


    /* =====================================================
       CHANGE WORD — SAME
    ===================================================== */

    const changeWord = () => {

        setSelectedWord("");

        setAnswer("");

        setMessage("");

        setShowResult(false);

        setIsCorrect(false);

        setMicMessage("");

        spinWheel();

    };


    /* =====================================================
       BACK — SAME
    ===================================================== */

    const handleBack = () => {

        window.speechSynthesis?.cancel();

        if (recognitionRef.current) {

            try {
                recognitionRef.current.stop();
            } catch (error) {
                // already stopped
            }

        }

        onBack?.();

    };


    /* =====================================================
       SKIP — SAME
    ===================================================== */

    const handleSkip = () => {

        window.speechSynthesis?.cancel();

        if (recognitionRef.current) {

            try {
                recognitionRef.current.stop();
            } catch (error) {
                // already stopped
            }

        }

        onFinish?.();

    };


    /* =====================================================
       PROGRESS — SAME
    ===================================================== */

    const progress =
        ((round - 1) / totalRounds) * 100;


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div
            className="spin-calendar-page"
            style={{
                backgroundImage: `url(${bg})`
            }}
        >

            <div className="spin-calendar-overlay">

                <div className="spin-calendar-game-container">


                    {/* =================================================
                        TOP BUTTONS
                    ================================================= */}

                    <div className="spin-calendar-topbar">

                        <button
                            className="spin-calendar-back-btn"
                            onClick={handleBack}
                        >
                            ← Back
                        </button>


                        <button
                            className="spin-calendar-skip-top-btn"
                            onClick={handleSkip}
                        >
                            Skip →
                        </button>

                    </div>


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="spin-calendar-header">

                        <div className="spin-calendar-header-left">

                            <div className="spin-calendar-game-icon">
                                🗓️
                            </div>


                            <div>

                                <h1>
                                    Calendar Wheel
                                </h1>

                                <p>
                                    Spin • Think • Make a Sentence!
                                </p>

                            </div>

                        </div>


                        <div className="spin-calendar-stats">


                            <div className="spin-calendar-stat">

                                <span className="stat-icon">
                                    ⭐
                                </span>

                                <div>

                                    <small>
                                        Stars
                                    </small>

                                    <strong>
                                        {
                                            isCorrect
                                                ? round
                                                : Math.max(
                                                    0,
                                                    round - 1
                                                )
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="spin-calendar-stat">

                                <span className="stat-icon">
                                    🎯
                                </span>

                                <div>

                                    <small>
                                        Round
                                    </small>

                                    <strong>
                                        {round}/{totalRounds}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        ORIGINAL PROGRESS
                    ================================================= */}

                    <div className="spin-calendar-progress-area">

                        <div className="spin-calendar-progress-text">

                            Round {round} of {totalRounds}

                        </div>


                        <div className="spin-calendar-progress-track">

                            <div
                                className="spin-calendar-progress-fill"
                                style={{
                                    width: `${progress}%`
                                }}
                            />

                        </div>

                    </div>


                    {/* =================================================
                        MAIN 3-COLUMN AREA
                    ================================================= */}

                    <div className="spin-calendar-game-body">


                        {/* =================================================
                            LEFT — TEACHER
                        ================================================= */}

                        <div className="spin-calendar-teacher-section">

                            <div className="spin-calendar-teacher-image-wrap">

                                <img
                                    src={teacher}
                                    alt="Miss Uroosa"
                                    className="spin-calendar-teacher"
                                />

                            </div>


                            <div className="spin-calendar-speech">

                                <button
                                    className="spin-calendar-speech-speaker"
                                    onClick={() => {

                                        if (selectedWord) {

                                            speak(
                                                `Your word is ${selectedWord}. Make a sentence using it.`
                                            );

                                        } else {

                                            speak(
                                                "Spin the wheel and make a sentence!"
                                            );

                                        }

                                    }}
                                    aria-label="Teacher voice"
                                >
                                    🔊
                                </button>


                                <p>

                                    {selectedWord ? (

                                        <>

                                            Your word is{" "}

                                            <strong>
                                                {selectedWord}!
                                            </strong>

                                            <br />

                                            Make a sentence

                                            <br />

                                            using it.

                                        </>

                                    ) : (

                                        <>

                                            Spin the wheel

                                            <br />

                                            and make a sentence!

                                        </>

                                    )}

                                </p>

                            </div>


                            <div className="spin-calendar-teacher-name">

                                Miss Uroosa

                            </div>

                        </div>



                        {/* =================================================
                            CENTER — WHEEL
                        ================================================= */}

                        <div className="spin-calendar-game-area">


                            <div className="spin-calendar-game-heading">

                                <div className="spin-calendar-heading-ribbon">

                                    <span>
                                        ⭐
                                    </span>

                                    <h2>
                                        SPIN THE WHEEL!
                                    </h2>

                                    <span>
                                        ⭐
                                    </span>

                                </div>


                                <p>
                                    Get a calendar word and complete your sentence challenge.
                                </p>

                            </div>


                            {/* =================================================
                                WHEEL STAGE
                            ================================================= */}

                            <div className="spin-calendar-wheel-stage">

                                {/* FIXED POINTER */}

                                <div className="spin-calendar-pointer">
                                    <span>▼</span>
                                </div>


                                {/* ACTUAL WHEEL */}

                                <div
                                    ref={wheelRef}
                                    className="spin-calendar-wheel"
                                >

                                    <div className="spin-calendar-wheel-ring" />


                                    <div className="spin-calendar-wheel-inner">

                                        {calendarWords.map(
                                            (word, index) => {

                                                const angle =
                                                    index *
                                                    segmentAngle;


                                                return (

                                                    <div
                                                        key={word}
                                                        className="spin-calendar-wheel-item"
                                                        style={{
                                                            transform:
                                                                `rotate(${angle}deg)`
                                                        }}
                                                    >

                                                        <span
                                                            style={{
                                                                transform:
                                                                    `rotate(${-angle}deg)`
                                                            }}
                                                        >

                                                            {word}

                                                        </span>

                                                    </div>

                                                );

                                            }
                                        )}


                                        <div className="spin-calendar-wheel-center">

                                            SPIN

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                SPIN BUTTON
                            ================================================= */}

                            {!selectedWord && (

                                <button
                                    className="spin-calendar-spin-btn"
                                    onClick={spinWheel}
                                    disabled={isSpinning}
                                >

                                    <span className="wheel-button-icon">
                                        🎡
                                    </span>

                                    {
                                        isSpinning
                                            ? "Spinning..."
                                            : "Spin the Wheel"
                                    }

                                </button>

                            )}


                            {/* =================================================
                                SPIN AGAIN
                            ================================================= */}

                            {selectedWord && !showResult && (

                                <button
                                    className="spin-calendar-change-word-btn spin-calendar-center-again"
                                    onClick={changeWord}
                                    disabled={isSpinning}
                                >

                                    ↻ Spin Again

                                </button>

                            )}


                        </div>



                        {/* =================================================
                            RIGHT — CHALLENGE PANEL
                        ================================================= */}

                        <div className="spin-calendar-challenge-panel">


                            {/* =================================================
                                CALENDAR WORD
                            ================================================= */}

                            <div className="spin-calendar-word-card">

                                <div className="spin-calendar-word-card-title">

                                    <span>
                                        ♥
                                    </span>

                                    Your Calendar Word

                                    <span>
                                        ♥
                                    </span>

                                </div>


                                <div className="spin-calendar-word-value">

                                    {selectedWord || "—"}

                                </div>

                            </div>



                            {/* =================================================
                                SENTENCE CHALLENGE
                            ================================================= */}

                            {selectedWord && !showResult && (

                                <div className="spin-calendar-answer-section">

                                    <div className="spin-calendar-answer-title">

                                        <span>
                                            ✏️
                                        </span>

                                        Sentence Challenge

                                    </div>


                                    <p className="spin-calendar-answer-instruction">

                                        Make a sentence using{" "}

                                        <strong>
                                            {selectedWord}.
                                        </strong>

                                    </p>


                                    <div className="spin-calendar-answer-input-wrap">

                                        <textarea
                                            className="spin-calendar-answer-input"
                                            value={answer}
                                            onChange={(event) => {

                                                setAnswer(
                                                    event.target.value
                                                );

                                                setMicMessage("");

                                            }}
                                            placeholder={`Example: I have a drawing class on ${selectedWord}.`}
                                        />


                                        <button
                                            type="button"
                                            className={`spin-calendar-mic-btn ${
                                                isListening
                                                    ? "listening"
                                                    : ""
                                            }`}
                                            onClick={handleMic}
                                            aria-label={
                                                isListening
                                                    ? "Stop microphone"
                                                    : "Use microphone"
                                            }
                                            title={
                                                isListening
                                                    ? "Stop listening"
                                                    : "Speak your sentence"
                                            }
                                        >

                                            {
                                                isListening
                                                    ? "⏹"
                                                    : "🎤"
                                            }

                                        </button>

                                    </div>


                                    {micMessage && (

                                        <div className="spin-calendar-mic-status">

                                            {
                                                isListening
                                                    ? "🎤 Listening..."
                                                    : `💬 ${micMessage}`
                                            }

                                        </div>

                                    )}


                                    <button
                                        className="spin-calendar-check-btn"
                                        onClick={checkSentence}
                                    >

                                        ✓ Check My Sentence

                                    </button>

                                </div>

                            )}



                            {/* =================================================
                                BEFORE WORD
                            ================================================= */}

                            {!selectedWord && (

                                <div className="spin-calendar-empty-challenge">

                                    <div>
                                        ✨
                                    </div>

                                    <strong>
                                        Spin the wheel!
                                    </strong>

                                    <p>
                                        Your calendar word will appear here.
                                    </p>

                                </div>

                            )}



                            {/* =================================================
                                RESULT
                            ================================================= */}

                            {showResult && (

                                <div className="spin-calendar-result-card">

                                    {isCorrect ? (

                                        <>

                                            <div className="result-icon">
                                                🎉
                                            </div>

                                            <h2>
                                                Excellent!
                                            </h2>

                                            <p>
                                                {message}
                                            </p>

                                            <button
                                                onClick={nextRound}
                                            >

                                                {
                                                    round >= totalRounds
                                                        ? "Finish Lesson"
                                                        : "Next Round →"
                                                }

                                            </button>

                                        </>

                                    ) : (

                                        <>

                                            <div className="result-icon">
                                                💡
                                            </div>

                                            <h2>
                                                Try Again!
                                            </h2>

                                            <p>
                                                {message}
                                            </p>

                                            <button
                                                onClick={retrySentence}
                                            >

                                                Try Again

                                            </button>

                                        </>

                                    )}

                                </div>

                            )}

                        </div>


                    </div>


                    {/* =================================================
                        FOOTER TIP
                    ================================================= */}

                    <div className="spin-calendar-footer">

                        <span>
                            💡 <b>Tip</b>
                        </span>

                        <div className="spin-calendar-footer-divider" />

                        <p>
                            Use the calendar word naturally in your sentence.
                        </p>

                    </div>


                </div>

            </div>

        </div>

    );

};


export default SpinCalendarWheel;