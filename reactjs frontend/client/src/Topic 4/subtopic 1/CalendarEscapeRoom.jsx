import React, { useEffect, useState } from "react";

import teacher from "../../assets/teacher1.png";
import bg from "../../assets/chatbg.jpeg";

import escapeRoomBg from "../../assets/calendarEscapeRoomBg.png";
import escapeDoor from "../../assets/calendarEscapeDoor.png";
import escapeCalendar from "../../assets/calendarEscapeCalendar.png";
import escapeDeskCalendar from "../../assets/calendarEscapeDeskCalendar.png";
import escapeClock from "../../assets/calendarEscapeClock.png";
import escapeClueNote from "../../assets/calendarEscapeClueNote.png";
import escapeLock from "../../assets/calendarEscapeLock.png";

import yaySound from "../../assets/yay.mp3";

import confetti from "canvas-confetti";

import "./CalendarEscapeRoom.css";


const CalendarEscapeRoom = ({
    onBack,
    onSkip,
    onFinish
}) => {

    /* =====================================================
       CHALLENGES
    ===================================================== */

    const challenges = [
        {
            id: 1,
            type: "day",
            question:
                "I come after Monday and before Wednesday. Which day am I?",
            options: [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday"
            ],
            answer: "Tuesday",
            hint: "Think about the order of the days."
        },

        {
            id: 2,
            type: "month",
            question:
                "Which month comes after March?",
            options: [
                "February",
                "April",
                "May",
                "June"
            ],
            answer: "April",
            hint: "Remember the order of the months."
        },

        {
            id: 3,
            type: "order",
            question:
                "Which day comes first: Friday, Tuesday or Sunday?",
            options: [
                "Friday",
                "Tuesday",
                "Sunday"
            ],
            answer: "Tuesday",
            hint: "Start from the beginning of the week."
        },

        {
            id: 4,
            type: "clue",
            question:
                "My birthday is in the month before August. Which month is it?",
            options: [
                "June",
                "July",
                "August",
                "September"
            ],
            answer: "July",
            hint: "Which month comes just before August?"
        },

        {
            id: 5,
            type: "escape",
            question:
                "Final clue! What comes after Thursday and before Saturday?",
            options: [
                "Wednesday",
                "Thursday",
                "Friday",
                "Sunday"
            ],
            answer: "Friday",
            hint: "One last calendar clue! Think carefully."
        }
    ];


    /* =====================================================
       STATE
    ===================================================== */

    const [showActivity, setShowActivity] = useState(false);

    const [round, setRound] = useState(1);

    const [challenge, setChallenge] = useState(
        challenges[0]
    );

    const [selectedAnswer, setSelectedAnswer] = useState("");

    const [message, setMessage] = useState("");

    const [isCorrect, setIsCorrect] = useState(false);

    const [showResult, setShowResult] = useState(false);

    const [isSpeaking, setIsSpeaking] = useState(false);

    const [unlockedRooms, setUnlockedRooms] = useState([]);

    const totalRounds = challenges.length;

    const score = unlockedRooms.length * 20;


    /* =====================================================
       FEMALE VOICE
    ===================================================== */

    const getFemaleVoice = () => {

        if (!window.speechSynthesis) return null;

        const voices =
            window.speechSynthesis.getVoices();

        const preferredNames = [
            "Google UK English Female",
            "Google US English Female",
            "Microsoft Zira",
            "Microsoft Jenny",
            "Microsoft Aria",
            "Microsoft Sonia",
            "Samantha",
            "Victoria",
            "Karen",
            "Moira",
            "Susan",
            "Hazel",
            "Tessa",
            "Ava",
            "Siri Female"
        ];

        for (const name of preferredNames) {

            const found = voices.find((voice) =>
                voice.name
                    .toLowerCase()
                    .includes(name.toLowerCase())
            );

            if (found) return found;
        }

        const femaleVoice = voices.find((voice) =>
            /female|woman|girl/i.test(voice.name)
        );

        if (femaleVoice) return femaleVoice;

        const englishVoice = voices.find((voice) =>
            voice.lang?.toLowerCase().startsWith("en")
        );

        return englishVoice || voices[0] || null;
    };


    /* =====================================================
       SPEAK
    ===================================================== */

    const speak = (text, callback) => {

        if (!window.speechSynthesis) {

            if (callback) callback();

            return;
        }

        window.speechSynthesis.cancel();

        const utterance =
            new SpeechSynthesisUtterance(text);

        const femaleVoice =
            getFemaleVoice();

        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }

        utterance.lang = "en-US";
        utterance.rate = 0.88;
        utterance.pitch = 1.18;
        utterance.volume = 1;

        utterance.onstart = () => {
            setIsSpeaking(true);
        };

        utterance.onend = () => {

            setIsSpeaking(false);

            if (callback) callback();
        };

        utterance.onerror = () => {

            setIsSpeaking(false);

            if (callback) callback();
        };

        window.speechSynthesis.speak(
            utterance
        );
    };


    /* =====================================================
       LOAD VOICES
    ===================================================== */

    useEffect(() => {

        if (!window.speechSynthesis) return;

        window.speechSynthesis.getVoices();

        const handleVoices =
            () => window.speechSynthesis.getVoices();

        window.speechSynthesis.addEventListener(
            "voiceschanged",
            handleVoices
        );

        return () => {

            window.speechSynthesis.removeEventListener(
                "voiceschanged",
                handleVoices
            );
        };

    }, []);


    /* =====================================================
       INTRO SPEECH
    ===================================================== */

    useEffect(() => {

        if (showActivity) return;

        const timer = setTimeout(() => {

            speak(
                "Welcome to Calendar Escape Room! Solve the calendar clues, unlock the rooms, and escape!"
            );

        }, 500);

        return () => clearTimeout(timer);

    }, [showActivity]);


    /* =====================================================
       FIRST QUESTION SPEECH
    ===================================================== */

    useEffect(() => {

        if (!showActivity) return;

        const timer = setTimeout(() => {

            speak(challenge.question);

        }, 500);

        return () => clearTimeout(timer);

    }, [showActivity]);


    /* =====================================================
       NEXT QUESTION SPEECH
    ===================================================== */

    useEffect(() => {

        if (!showActivity) return;

        if (round === 1) return;

        const timer = setTimeout(() => {

            speak(challenge.question);

        }, 500);

        return () => clearTimeout(timer);

    }, [round, challenge, showActivity]);


    /* =====================================================
       START
    ===================================================== */

    const startActivity = () => {

        window.speechSynthesis?.cancel();

        setShowActivity(true);
        setRound(1);
        setChallenge(challenges[0]);
        setSelectedAnswer("");
        setMessage("");
        setShowResult(false);
        setIsCorrect(false);
        setUnlockedRooms([]);

    };


    /* =====================================================
       BACK
    ===================================================== */

    const handleBack = () => {

        window.speechSynthesis?.cancel();

        if (showActivity) {

            setShowActivity(false);

            setRound(1);
            setChallenge(challenges[0]);
            setSelectedAnswer("");
            setMessage("");
            setShowResult(false);
            setIsCorrect(false);
            setUnlockedRooms([]);

        } else {

            if (onBack) onBack();

        }
    };


    /* =====================================================
       SKIP
    ===================================================== */

    const handleSkip = () => {

        window.speechSynthesis?.cancel();

        if (onSkip) {

            onSkip();

        } else if (onFinish) {

            onFinish();

        }
    };


    /* =====================================================
       CORRECT ANSWER
    ===================================================== */

    const handleCorrect = () => {

        setIsCorrect(true);
        setShowResult(true);

        const correctAnswer =
            challenge.answer;

        setMessage(
            `Wonderful! ${correctAnswer} is correct!`
        );


        setUnlockedRooms((previous) => {

            if (previous.includes(round)) {
                return previous;
            }

            return [
                ...previous,
                round
            ];

        });


        confetti({
            particleCount: 90,
            spread: 70,
            origin: {
                y: 0.65
            }
        });


        const moveToNext = () => {

            if (round >= totalRounds) {

                speak(
                    "Amazing! You escaped the Calendar Room!",
                    () => {

                        if (onFinish) {
                            onFinish();
                        }

                    }
                );

                return;
            }


            const next =
                challenges[round];


            setRound(
                previous => previous + 1
            );

            setChallenge(next);

            setSelectedAnswer("");

            setMessage("");

            setShowResult(false);

            setIsCorrect(false);

        };


        try {

            const audio =
                new Audio(yaySound);

            audio.volume = 0.6;

            audio.onended = () => {

                speak(
                    `Wonderful! ${correctAnswer} is correct!`,
                    () => {
                        moveToNext();
                    }
                );

            };


            audio.onerror = () => {

                speak(
                    `Wonderful! ${correctAnswer} is correct!`,
                    () => {
                        moveToNext();
                    }
                );

            };


            audio.play().catch(() => {

                speak(
                    `Wonderful! ${correctAnswer} is correct!`,
                    () => {
                        moveToNext();
                    }
                );

            });

        } catch (error) {

            speak(
                `Wonderful! ${correctAnswer} is correct!`,
                () => {
                    moveToNext();
                }
            );

        }

    };


    /* =====================================================
       WRONG ANSWER
    ===================================================== */

    const handleWrong = () => {

        setIsCorrect(false);

        setShowResult(true);

        setMessage(
            `Good try! Look carefully. The answer is ${challenge.answer}.`
        );


        setTimeout(() => {

            speak(
                `Good try! Look carefully. The answer is ${challenge.answer}.`
            );

        }, 200);

    };


    /* =====================================================
       SELECT ANSWER
    ===================================================== */

    const handleAnswer = (answer) => {

        if (isSpeaking) return;

        if (showResult) return;

        setSelectedAnswer(answer);

        if (answer === challenge.answer) {

            handleCorrect();

        } else {

            handleWrong();

        }

    };


    /* =====================================================
       REPEAT QUESTION
    ===================================================== */

    const repeatQuestion = () => {

        speak(challenge.question);

    };


    /* =====================================================
       RETRY
    ===================================================== */

    const retryQuestion = () => {

        window.speechSynthesis?.cancel();

        setSelectedAnswer("");

        setMessage("");

        setShowResult(false);

        setIsCorrect(false);

    };


    /* =====================================================
       INTRO SCREEN
    ===================================================== */

    if (!showActivity) {

        return (

            <div
                className="calendar-escape-page"
                style={{
                    backgroundImage: `url(${bg})`
                }}
            >

                <div className="calendar-escape-card">

                    <header className="escape-header">

                        <button
                            className="escape-nav-btn"
                            onClick={handleBack}
                        >
                            ← Back
                        </button>


                        <div className="escape-title">

                            <div className="escape-title-main">
                                🗓️ Calendar Escape Room
                            </div>

                            <div className="escape-title-sub">
                                Solve the clues & escape!
                            </div>

                        </div>


                        <button
                            className="escape-nav-btn"
                            onClick={handleSkip}
                        >
                            Skip →
                        </button>

                    </header>


                    <div className="escape-intro-content">

                        {/* TEACHER */}

                        <div className="escape-teacher-section">

                            <img
                                src={teacher}
                                alt="Miss Uroosa"
                                className="escape-teacher"
                            />


                            <div className="escape-teacher-name">
                                Miss Uroosa
                            </div>


                            <div className="escape-speech">

                                <button
                                    className="escape-speech-btn"
                                    onClick={() =>
                                        speak(
                                            "Welcome to Calendar Escape Room! Solve the calendar clues, unlock the rooms, and escape!"
                                        )
                                    }
                                >
                                    🔊
                                </button>


                                <strong>
                                    Welcome to Calendar
                                    Escape Room!
                                </strong>

                                <p>
                                    Solve the calendar
                                    clues, unlock the
                                    rooms, and escape!
                                </p>

                            </div>

                        </div>


                        {/* ROOM */}

                        <div className="escape-room-preview">

                            <img
                                src={escapeRoomBg}
                                alt=""
                                className="escape-room-bg"
                            />


                            <img
                                src={escapeDoor}
                                alt=""
                                className="escape-door"
                            />


                            <img
                                src={escapeCalendar}
                                alt=""
                                className="escape-wall-calendar"
                            />


                            <img
                                src={escapeClock}
                                alt=""
                                className="escape-clock"
                            />


                            <img
                                src={escapeDeskCalendar}
                                alt=""
                                className="escape-desk-calendar"
                            />


                            <div className="escape-lock-glow">
                                🔒
                            </div>


                            <div className="escape-preview-overlay">

                                <span>
                                    🔐
                                </span>

                                <b>
                                    5 Clues
                                </b>

                                <small>
                                    5 Rooms to Unlock
                                </small>

                            </div>

                        </div>

                    </div>


                    <div className="escape-intro-bottom">

                        <div className="escape-stat">

                            <span>⭐</span>

                            <div>
                                <b>0</b>
                                <small>Stars</small>
                            </div>

                        </div>


                        <div className="escape-stat">

                            <span>🔒</span>

                            <div>
                                <b>0/5</b>
                                <small>Rooms</small>
                            </div>

                        </div>


                        <button
                            className="escape-start-btn"
                            onClick={startActivity}
                        >
                            Let's Go! 🔑
                        </button>

                    </div>

                </div>

            </div>

        );
    }


    /* =====================================================
       ACTIVITY SCREEN
    ===================================================== */

    return (

        <div
            className="calendar-escape-page"
            style={{
                backgroundImage: `url(${bg})`
            }}
        >

            <div className="calendar-escape-card activity-card">

                {/* HEADER */}

                <header className="escape-header">

                    <button
                        className="escape-nav-btn"
                        onClick={handleBack}
                    >
                        ← Back
                    </button>


                    <div className="escape-round">

                        <span>🔐</span>

                        Room {round}/{totalRounds}

                    </div>


                    <div className="escape-title">

                        <div className="escape-title-main">
                            🗓️ Calendar Escape Room
                        </div>

                        <div className="escape-title-sub">
                            Find the clue and unlock the room
                        </div>

                    </div>


                    <button
                        className="escape-nav-btn"
                        onClick={handleSkip}
                    >
                        Skip →
                    </button>

                </header>


                <div className="escape-game-layout">

                    {/* LEFT SIDE */}

                    <aside className="escape-left">

                        <div className="escape-teacher-section">

                            <img
                                src={teacher}
                                alt="Miss Uroosa"
                                className="escape-teacher"
                            />


                            <div className="escape-teacher-name">
                                Miss Uroosa
                            </div>


                            <div className="escape-speech">

                                <button
                                    className="escape-speech-btn"
                                    onClick={repeatQuestion}
                                >
                                    🔊
                                </button>


                                <span className="clue-label">
                                    Clue:
                                </span>


                                <p>
                                    {challenge.question}
                                </p>

                            </div>

                        </div>


                        <div className="escape-hint-box">

                            <div className="hint-title">
                                💡 HINT
                            </div>

                            <p>
                                {challenge.hint}
                            </p>

                        </div>

                    </aside>


                    {/* CENTER */}

                    <main className="escape-center">

                        <div className="escape-question-card">

                            <div className="question-icon">
                                🗝️
                            </div>

                            <h2>
                                Solve the Calendar Clue
                            </h2>

                            <p>
                                Which answer unlocks
                                this room?
                            </p>

                        </div>


                        <div className="escape-options">

                            {challenge.options.map(
                                (option, index) => (

                                    <button
                                        key={option}
                                        className={`
                                            escape-option
                                            ${
                                                selectedAnswer === option
                                                    ? isCorrect
                                                        ? "correct"
                                                        : "wrong"
                                                    : ""
                                            }
                                        `}
                                        onClick={() =>
                                            handleAnswer(option)
                                        }
                                        disabled={
                                            isSpeaking ||
                                            showResult
                                        }
                                    >

                                        <span className="option-number">
                                            {String.fromCharCode(
                                                65 + index
                                            )}
                                        </span>

                                        <span>
                                            {option}
                                        </span>

                                    </button>

                                )
                            )}

                        </div>


                        {/* RESULT */}

                        {showResult && (

                            <div
                                className={
                                    isCorrect
                                        ? "escape-feedback correct-feedback"
                                        : "escape-feedback wrong-feedback"
                                }
                            >

                                <span>
                                    {isCorrect
                                        ? "🔓"
                                        : "💭"}
                                </span>

                                <div>

                                    <strong>
                                        {message}
                                    </strong>

                                    {!isCorrect && (

                                        <button
                                            className="escape-retry-btn"
                                            onClick={retryQuestion}
                                        >
                                            Try Again
                                        </button>

                                    )}

                                </div>

                            </div>

                        )}

                    </main>


                    {/* RIGHT SIDE */}

                    <aside className="escape-right">

                        <div className="escape-door-card">

                            <img
                                src={escapeDoor}
                                alt=""
                                className="mini-door"
                            />

                            <div>
                                <strong>
                                    Escape Door
                                </strong>

                                <small>
                                    Unlock all rooms
                                </small>
                            </div>

                        </div>


                        <div className="rooms-card">

                            <h3>
                                UNLOCKED ROOMS
                            </h3>


                            <div className="rooms-row">

                                {challenges.map(
                                    (_, index) => {

                                        const unlocked =
                                            unlockedRooms.includes(
                                                index + 1
                                            );

                                        return (

                                            <div
                                                key={index}
                                                className={
                                                    unlocked
                                                        ? "room-item unlocked"
                                                        : "room-item"
                                                }
                                            >

                                                <span>
                                                    {unlocked
                                                        ? "🔓"
                                                        : "🔒"}
                                                </span>

                                                <small>
                                                    {index + 1}
                                                </small>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        </div>


                        <div className="progress-card">

                            <h3>
                                YOUR PROGRESS
                            </h3>


                            <div className="escape-progress">

                                <div
                                    className="escape-progress-fill"
                                    style={{
                                        width: `${
                                            (unlockedRooms.length /
                                                totalRounds) *
                                            100
                                        }%`
                                    }}
                                />

                            </div>


                            <div className="progress-text">

                                <span>
                                    {unlockedRooms.length}/{totalRounds}
                                </span>

                                <span>
                                    Rooms
                                </span>

                            </div>

                        </div>


                        <div className="score-card">

                            <h3>
                                ⭐ SCORE
                            </h3>

                            <div className="score-number">
                                {score}
                            </div>

                        </div>


                        <div className="mini-lock">

                            <img
                                src={escapeLock}
                                alt=""
                            />

                        </div>

                    </aside>

                </div>


                {/* BOTTOM */}

                <footer className="escape-footer">

                    <div className="footer-room">

                        🔐 Room {round}

                    </div>


                    <div className="footer-progress">

                        <span>
                            Escape Progress
                        </span>

                        <div className="footer-bar">

                            <div
                                style={{
                                    width: `${
                                        (unlockedRooms.length /
                                            totalRounds) *
                                        100
                                    }%`
                                }}
                            />

                        </div>

                    </div>


                    <div className="footer-stars">

                        ⭐ {score}

                    </div>

                </footer>

            </div>

        </div>

    );
};


export default CalendarEscapeRoom;