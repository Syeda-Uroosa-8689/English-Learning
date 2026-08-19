
import React, {
    useEffect,
    useRef,
    useState
} from "react";

import confetti from "canvas-confetti";

import teacher1 from "../../assets/teacher1.png";
import teacher2 from "../../assets/teacher2.png";
import teacher3 from "../../assets/teacher3.png";
import teacher4 from "../../assets/teacher4.png";

import chatBg from "../../assets/chatbg.jpeg";

import yaySound from "../../assets/yay.mp3";

import "./FavouritePersonActivity1.css";


function FavouritePersonActivity1({
    content,
    topicId,
    lessonId,
    userName,
    onNext,
    onBack
}) {

    const rounds =
        content?.activities?.[0]?.rounds || [];


    const teacherImages = [
        teacher1,
        teacher2,
        teacher3,
        teacher4
    ];


    const [currentRound, setCurrentRound] =
        useState(0);

    const [selectedAnswer, setSelectedAnswer] =
        useState(null);

    const [feedback, setFeedback] =
        useState("");

    const [isCorrect, setIsCorrect] =
        useState(false);

    const [isSpeaking, setIsSpeaking] =
        useState(false);


    const mountedRef =
        useRef(true);

    const nextTimerRef =
        useRef(null);

    const wrongTimerRef =
        useRef(null);

    const soundRef =
        useRef(null);


    const round =
        rounds[currentRound];


    useEffect(() => {

        mountedRef.current = true;

        return () => {

            mountedRef.current = false;

            window.speechSynthesis?.cancel();

            if (nextTimerRef.current) {
                clearTimeout(nextTimerRef.current);
            }

            if (wrongTimerRef.current) {
                clearTimeout(wrongTimerRef.current);
            }

            if (soundRef.current) {
                soundRef.current.pause();
                soundRef.current.currentTime = 0;
            }

        };

    }, []);


    const getTeacherVoice = () => {

        if (!window.speechSynthesis) {
            return null;
        }

        const voices =
            window.speechSynthesis.getVoices();

        return (

            voices.find((voice) =>
                /Google UK English Female/i.test(
                    voice.name
                )
            )

            ||

            voices.find((voice) =>
                /Microsoft.*Jenny/i.test(
                    voice.name
                )
            )

            ||

            voices.find((voice) =>
                /Microsoft.*Aria/i.test(
                    voice.name
                )
            )

            ||

            voices.find((voice) =>
                /Samantha/i.test(
                    voice.name
                )
            )

            ||

            null

        );

    };


    const speakTeacher = (text) => {

        if (!window.speechSynthesis) {
            return;
        }

        window.speechSynthesis.cancel();

        const speech =
            new SpeechSynthesisUtterance(text);

        const voice =
            getTeacherVoice();

        if (voice) {
            speech.voice = voice;
        }

        speech.lang = "en-US";
        speech.rate = 0.88;
        speech.pitch = 1.08;

        speech.onstart = () => {
            setIsSpeaking(true);
        };

        speech.onend = () => {
            setIsSpeaking(false);
        };

        speech.onerror = () => {
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(speech);

    };


    const playCorrectSound = () => {

        try {

            if (soundRef.current) {

                soundRef.current.pause();

                soundRef.current.currentTime = 0;

            }

            const audio =
                new Audio(yaySound);

            audio.volume = 1;

            soundRef.current = audio;

            audio.play().catch((error) => {

                console.log(
                    "Yay sound error:",
                    error
                );

            });

        } catch (error) {

            console.log(
                "Sound error:",
                error
            );

        }

    };


    const triggerConfetti = () => {

        const end =
            Date.now() + 1800;

        const frame = () => {

            confetti({

                particleCount: 7,

                angle: 60,

                spread: 70,

                origin: {
                    x: 0
                }

            });


            confetti({

                particleCount: 7,

                angle: 120,

                spread: 70,

                origin: {
                    x: 1
                }

            });


            if (Date.now() < end) {

                requestAnimationFrame(frame);

            }

        };

        frame();

    };


    const goToNextRound = () => {

        if (
            currentRound <
            rounds.length - 1
        ) {

            setCurrentRound(
                (previousRound) =>
                    previousRound + 1
            );

            setSelectedAnswer(null);
            setFeedback("");
            setIsCorrect(false);

        }

        else if (onNext) {

            onNext();

        }

    };


    const handleAnswer = (optionIndex) => {

        if (
            selectedAnswer !== null ||
            !round
        ) {
            return;
        }


        setSelectedAnswer(optionIndex);


        const correct =
            optionIndex ===
            round.correctAnswer;


        setIsCorrect(correct);


        if (correct) {

            setFeedback(
                "Excellent! That's the correct answer!"
            );


            playCorrectSound();

            triggerConfetti();


            speakTeacher(
                "Excellent! That's the correct answer!"
            );


            nextTimerRef.current =
                setTimeout(() => {

                    goToNextRound();

                }, 3500);

        }

        else {

            setFeedback(
                "Try again! Read the clue carefully."
            );


            speakTeacher(
                "Try again! Read the clue carefully."
            );


            wrongTimerRef.current =
                setTimeout(() => {

                    setSelectedAnswer(null);

                    setFeedback("");

                    setIsCorrect(false);

                }, 1800);

        }

    };


    const handleSkip = () => {

        window.speechSynthesis?.cancel();

        if (nextTimerRef.current) {
            clearTimeout(nextTimerRef.current);
        }

        if (onNext) {
            onNext();
        }

    };


    const handleBack = () => {

        window.speechSynthesis?.cancel();

        if (nextTimerRef.current) {
            clearTimeout(nextTimerRef.current);
        }

        if (onBack) {
            onBack();
        }

    };


    if (!rounds.length) {

        return (

            <div
                className="favourite-person-activity1-page"
                style={{
                    backgroundImage:
                        `url(${chatBg})`
                }}
            >

                <div className="favourite-person-empty-card">

                    <h2>
                        Activity content not found
                    </h2>

                    <button
                        onClick={handleBack}
                    >
                        ← Back
                    </button>

                </div>

            </div>

        );

    }


    const currentTeacher =
        teacherImages[
            currentRound %
            teacherImages.length
        ];


    return (

        <div
            className="favourite-person-activity1-page"
            style={{
                backgroundImage:
                    `url(${chatBg})`
            }}
        >

            <div className="favourite-person-activity1-overlay"></div>


            <div className="favourite-person-activity1-card">


                <div className="fp-activity-header">

                    <button
                        type="button"
                        className="fp-back-button"
                        onClick={handleBack}
                    >
                        ← Back
                    </button>


                    <div className="fp-title-area">

                        <h1>
                            Activity 1
                        </h1>

                        <div className="fp-title-strip">
                            Guess The Favourite Person
                        </div>

                    </div>


                    <button
                        type="button"
                        className="fp-skip-button"
                        onClick={handleSkip}
                    >
                        Skip →
                    </button>

                </div>


                <div className="fp-progress">

                    Round {currentRound + 1}
                    {" / "}
                    {rounds.length}

                </div>


                <div className="fp-main-content">


                    <div className="fp-teacher-section">

                        <div className="fp-teacher-image-wrapper">

                            <img
                                src={currentTeacher}
                                alt="Teacher"
                                className={
                                    isSpeaking
                                        ? "fp-teacher-image speaking"
                                        : "fp-teacher-image"
                                }
                            />

                        </div>


                        <div
                            className={
                                feedback
                                    ? `fp-teacher-bubble ${
                                        isCorrect
                                            ? "success"
                                            : "try-again"
                                    }`
                                    : "fp-teacher-bubble"
                            }
                        >

                            <strong>

                                {feedback
                                    ? isCorrect
                                        ? "Excellent! 🎉"
                                        : "Try again! 💛"
                                    : "Ready? 👋"
                                }

                            </strong>


                            <p>

                                {feedback ||
                                    "Read the clue and choose the correct person."
                                }

                            </p>

                        </div>

                    </div>


                    <div className="fp-question-section">

                        <div className="fp-question-card">

                            <h2>
                                Who could this person be?
                            </h2>


                            <div className="fp-clue">

                                <span>
                                    Clue:
                                </span>

                                {round.clue ||
                                    round.situation}

                            </div>


                            <div className="fp-options">

                                {round.options.map(
                                    (option, index) => {

                                        const isSelected =
                                            selectedAnswer === index;

                                        let optionClass =
                                            "fp-option";

                                        if (
                                            isSelected &&
                                            isCorrect
                                        ) {
                                            optionClass += " correct";
                                        }

                                        if (
                                            isSelected &&
                                            !isCorrect
                                        ) {
                                            optionClass += " wrong";
                                        }


                                        return (

                                            <button
                                                key={index}
                                                type="button"
                                                className={optionClass}
                                                onClick={() =>
                                                    handleAnswer(index)
                                                }
                                                disabled={
                                                    selectedAnswer !== null
                                                }
                                            >

                                                <span className="fp-option-letter">

                                                    {String.fromCharCode(
                                                        65 + index
                                                    )}

                                                </span>


                                                <span className="fp-option-text">

                                                    {option}

                                                </span>

                                            </button>

                                        );

                                    }
                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default FavouritePersonActivity1;

