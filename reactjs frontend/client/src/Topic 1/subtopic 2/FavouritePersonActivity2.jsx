import React, { useEffect, useRef, useState } from "react";

import teacher1 from "../../assets/teacher1.png";
import teacher2 from "../../assets/teacher2.png";
import teacher3 from "../../assets/teacher3.png";
import teacher4 from "../../assets/teacher4.png";

import chatBg from "../../assets/chatbg.jpeg";
import yaySound from "../../assets/yay.mp3";

import confetti from "canvas-confetti";

import "./FavouritePersonActivity2.css";

function FavouritePersonActivity2({
    content,
    topicId,
    lessonId,
    userName,
    onNext,
    onBack,
}) {

    /* =====================================================
            QUESTIONS
    ===================================================== */

    const questions =
        content?.activities?.[1]?.questions ||
        content?.activities?.[0]?.questions ||
        [
            {
                id: 1,
                question:
                    "Who is your favourite person?",
                hint:
                    "You can say: My favourite person is my mother.",
            },
            {
                id: 2,
                question:
                    "Why do you like this person?",
                hint:
                    "Try to use the word because.",
            },
            {
                id: 3,
                question:
                    "What does your favourite person do for you?",
                hint:
                    "You can talk about how they help, care for, or love you.",
            },
        ];

    /* =====================================================
            TEACHER IMAGES
    ===================================================== */

    const teacherImages = [
        teacher1,
        teacher2,
        teacher3,
        teacher4,
    ];

    /* =====================================================
            STATES
    ===================================================== */

    const [
        currentQuestion,
        setCurrentQuestion
    ] = useState(0);

    const [
        isListening,
        setIsListening
    ] = useState(false);

    const [
        isSpeaking,
        setIsSpeaking
    ] = useState(false);

    const [
        spokenAnswer,
        setSpokenAnswer
    ] = useState("");

    const [
        feedback,
        setFeedback
    ] = useState("");

    const [
        isCorrect,
        setIsCorrect
    ] = useState(false);

    const [
        showFeedback,
        setShowFeedback
    ] = useState(false);

    const [
        isChecking,
        setIsChecking
    ] = useState(false);

    const [
        apiError,
        setApiError
    ] = useState("");

    const [
        teacherIntro,
        setTeacherIntro
    ] = useState(
        "Listen carefully and answer the question in English."
    );

    /* =====================================================
            REFS
    ===================================================== */

    const recognitionRef =
        useRef(null);

    const mountedRef =
        useRef(true);

    const speechReceivedRef =
        useRef(false);

    const celebrationRunningRef =
        useRef(false);

    const audioRef =
        useRef(null);

    /* =====================================================
            CURRENT QUESTION
    ===================================================== */

    const question =
        questions[currentQuestion];

    const currentTeacher =
        teacherImages[
            currentQuestion %
            teacherImages.length
        ];

    /* =====================================================
            WAIT
    ===================================================== */

    const wait = (milliseconds) =>
        new Promise((resolve) =>
            setTimeout(resolve, milliseconds)
        );

    /* =====================================================
            CLEANUP
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
                    console.log(
                        "Recognition cleanup error:",
                        error
                    );
                }
            }

            if (audioRef.current) {
                try {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                } catch (error) {
                    console.log(
                        "Audio cleanup error:",
                        error
                    );
                }
            }

        };

    }, []);

    /* =====================================================
            LOAD VOICES
    ===================================================== */

    useEffect(() => {

        if (!window.speechSynthesis) {
            return;
        }

        const loadVoices = () => {
            window.speechSynthesis.getVoices();
        };

        loadVoices();

        window.speechSynthesis.onvoiceschanged =
            loadVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged =
                null;
        };

    }, []);

    /* =====================================================
            GET FEMALE TEACHER VOICE
    ===================================================== */

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
            ) ||

            voices.find((voice) =>
                /Google US English/i.test(
                    voice.name
                )
            ) ||

            voices.find((voice) =>
                /Microsoft.*Jenny/i.test(
                    voice.name
                )
            ) ||

            voices.find((voice) =>
                /Microsoft.*Aria/i.test(
                    voice.name
                )
            ) ||

            voices.find((voice) =>
                /Samantha/i.test(
                    voice.name
                )
            ) ||

            voices.find((voice) =>
                /Zira/i.test(
                    voice.name
                )
            ) ||

            null
        );

    };

    /* =====================================================
            REMOVE EMOJIS BEFORE SPEECH
    ===================================================== */

    const cleanSpeechText = (text) => {

        if (!text) {
            return "";
        }

        return String(text)
            .replace(
                /[\u{1F300}-\u{1FAFF}]/gu,
                ""
            )
            .replace(
                /[\u{2600}-\u{27BF}]/gu,
                ""
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim();

    };

    /* =====================================================
            TEACHER SPEAK
    ===================================================== */

    const speakTeacher = (text) => {

        return new Promise((resolve) => {

            if (
                !window.speechSynthesis ||
                !text
            ) {
                resolve();
                return;
            }

            const cleanText =
                cleanSpeechText(text);

            if (!cleanText) {
                resolve();
                return;
            }

            window.speechSynthesis.cancel();

            const speech =
                new SpeechSynthesisUtterance(
                    cleanText
                );

            const voice =
                getTeacherVoice();

            if (voice) {
                speech.voice = voice;
            }

            speech.lang = "en-US";
            speech.rate = 0.88;
            speech.pitch = 1.05;
            speech.volume = 1;

            let finished = false;

            const finishSpeech = () => {

                if (finished) {
                    return;
                }

                finished = true;

                if (mountedRef.current) {
                    setIsSpeaking(false);
                }

                resolve();

            };

            speech.onstart = () => {

                if (mountedRef.current) {
                    setIsSpeaking(true);
                }

            };

            speech.onend =
                finishSpeech;

            speech.onerror =
                finishSpeech;

            window.speechSynthesis.speak(
                speech
            );

            setTimeout(() => {
                finishSpeech();
            }, 5500);

        });

    };

    /* =====================================================
            PLAY YAY SOUND
    ===================================================== */

    const playYaySound = () => {

        return new Promise((resolve) => {

            try {

                if (audioRef.current) {
                    try {
                        audioRef.current.pause();
                        audioRef.current.currentTime = 0;
                    } catch {}
                }

                const audio =
                    new Audio(yaySound);

                audio.volume = 1;

                audioRef.current =
                    audio;

                let completed =
                    false;

                const finishAudio = () => {

                    if (completed) {
                        return;
                    }

                    completed = true;

                    resolve();

                };

                audio.addEventListener(
                    "ended",
                    finishAudio,
                    { once: true }
                );

                audio.addEventListener(
                    "error",
                    finishAudio,
                    { once: true }
                );

                audio
                    .play()
                    .then(() => {

                        setTimeout(
                            finishAudio,
                            3000
                        );

                    })
                    .catch(() => {

                        finishAudio();

                    });

            } catch (error) {

                console.log(
                    "Yay sound error:",
                    error
                );

                resolve();

            }

        });

    };

    /* =====================================================
            CONFETTI
    ===================================================== */

    const celebrateCorrectAnswer = () => {

        return new Promise((resolve) => {

            try {

                const end =
                    Date.now() + 1700;

                const frame = () => {

                    confetti({
                        particleCount: 8,
                        angle: 60,
                        spread: 70,
                        origin: {
                            x: 0,
                            y: 0.6,
                        },
                    });

                    confetti({
                        particleCount: 8,
                        angle: 120,
                        spread: 70,
                        origin: {
                            x: 1,
                            y: 0.6,
                        },
                    });

                    if (
                        Date.now() < end
                    ) {

                        requestAnimationFrame(
                            frame
                        );

                    } else {

                        resolve();

                    }

                };

                frame();

            } catch (error) {

                console.log(
                    "Confetti error:",
                    error
                );

                resolve();

            }

        });

    };

    /* =====================================================
            INITIAL INSTRUCTION + QUESTION
    ===================================================== */

    useEffect(() => {

        if (
            !question?.question
        ) {
            return;
        }

        const timer =
            setTimeout(
                async () => {

                    if (
                        !mountedRef.current
                    ) {
                        return;
                    }

                    setShowFeedback(false);
                    setFeedback("");
                    setSpokenAnswer("");
                    setApiError("");
                    setIsCorrect(false);

                    const instruction =
                        "Listen carefully and answer the question in English.";

                    setTeacherIntro(
                        instruction
                    );

                    await speakTeacher(
                        instruction
                    );

                    if (
                        !mountedRef.current
                    ) {
                        return;
                    }

                    await wait(350);

                    await speakTeacher(
                        question.question
                    );

                },
                700
            );

        return () => {

            clearTimeout(timer);

            window.speechSynthesis?.cancel();

        };

    }, [currentQuestion]);

    /* =====================================================
            SPEAK QUESTION AGAIN
    ===================================================== */

    const handleSpeakQuestion = () => {

        if (!question?.question) {
            return;
        }

        speakTeacher(
            question.question
        );

    };

    /* =====================================================
            MOVE TO NEXT QUESTION
    ===================================================== */

    const moveToNextQuestion = async () => {

        if (!mountedRef.current) {
            return;
        }

        window.speechSynthesis?.cancel();

        if (
            currentQuestion <
            questions.length - 1
        ) {

            setCurrentQuestion(
                (previous) =>
                    previous + 1
            );

        } else {

            await speakTeacher(
                "Amazing work! You did a wonderful job talking about your favourite person."
            );

            if (mountedRef.current && onNext) {
                onNext();
            }

        }

    };

    /* =====================================================
            NO SPEECH
    ===================================================== */

    const handleNoSpeech = () => {

        if (!mountedRef.current) {
            return;
        }

        window.speechSynthesis?.cancel();

        setIsListening(false);
        setIsChecking(false);
        setSpokenAnswer("");
        setIsCorrect(false);
        setApiError("");

        const noSpeechMessage =
            "Sorry, I couldn't hear you. Can you say it again?";

        setTeacherIntro(
            "Let's try again."
        );

        setFeedback(
            noSpeechMessage
        );

        setShowFeedback(true);

        speakTeacher(
            noSpeechMessage
        );

    };

    /* =====================================================
            CHECK ANSWER WITH BACKEND
    ===================================================== */

    const checkAnswerWithAI =
        async (answerText) => {

            if (
                !answerText ||
                !answerText.trim()
            ) {

                handleNoSpeech();

                return;

            }

            try {

                setIsChecking(true);
                setApiError("");

                const response =
                    await fetch(
                       `${import.meta.env.VITE_API_URL}/api/favourite-person/correct`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",
                            },

                            body: JSON.stringify({

                                question:
                                    question.question,

                                answer:
                                    answerText.trim(),

                                topicId:
                                    topicId || 2,

                                lessonId:
                                    lessonId || 2,

                                userName:
                                    userName ||
                                    "Student",

                            }),

                        }
                    );

                let data;

                try {

                    data =
                        await response.json();

                } catch {

                    throw new Error(
                        "Server returned an invalid response."
                    );

                }

                if (!response.ok) {

                    throw new Error(
                        data?.message ||
                        "Unable to check your answer."
                    );

                }

                if (
                    !mountedRef.current
                ) {
                    return;
                }

                const correct =
                    Boolean(
                        data?.isCorrect
                    );

                /* =========================================
                        CORRECT ANSWER
                ========================================= */

                if (correct) {

                    if (
                        celebrationRunningRef.current
                    ) {
                        return;
                    }

                    celebrationRunningRef.current =
                        true;

                    setIsCorrect(true);

                    setFeedback(
                        "Excellent!"
                    );

                    setShowFeedback(true);

                    setApiError("");

                    /*
                        Teacher says ONLY:
                        Excellent!
                    */

                    await speakTeacher(
                        "Excellent!"
                    );

                    if (
                        !mountedRef.current
                    ) {
                        return;
                    }

                    /*
                        Sound + confetti
                    */

                    await Promise.all([
                        playYaySound(),
                        celebrateCorrectAnswer(),
                    ]);

                    await wait(500);

                    if (
                        mountedRef.current
                    ) {

                        celebrationRunningRef.current =
                            false;

                        moveToNextQuestion();

                    }

                    return;

                }

                /* =========================================
                        WRONG / NEEDS CORRECTION
                ========================================= */

                const feedbackText =
                    data?.feedback ||
                    "Good try!";

                const correctionText =
                    data?.correction ||
                    "";

                const explanationText =
                    data?.explanation ||
                    "";

                let teacherResponse =
                    feedbackText;

                if (correctionText) {

                    teacherResponse +=
                        ` You said: ${answerText.trim()}. Correct sentence: ${correctionText}.`;

                }

                if (explanationText) {

                    teacherResponse +=
                        ` ${explanationText}`;

                }

                setIsCorrect(false);

                setFeedback(
                    teacherResponse
                );

                setShowFeedback(true);

                setApiError("");

                /*
                    Correction is spoken by teacher.
                    It is NOT shown separately.
                */

                await speakTeacher(
                    teacherResponse
                );

            } catch (error) {

                console.log(
                    "Favourite Person AI Error:",
                    error
                );

                if (
                    !mountedRef.current
                ) {
                    return;
                }

                const errorMessage =
                    "Sorry! I could not check your answer right now. Please try again.";

                setIsCorrect(false);

                setFeedback(
                    errorMessage
                );

                setApiError("");

                setShowFeedback(true);

                await speakTeacher(
                    errorMessage
                );

            } finally {

                if (
                    mountedRef.current
                ) {
                    setIsChecking(false);
                }

            }

        };

    /* =====================================================
            START LISTENING
    ===================================================== */

    const startListening = () => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {

            const message =
                "Speech recognition is not supported in this browser. Please use Google Chrome.";

            setFeedback(
                message
            );

            setShowFeedback(true);

            speakTeacher(
                message
            );

            return;
        }

        if (
            isListening ||
            isChecking ||
            celebrationRunningRef.current
        ) {
            return;
        }

        window.speechSynthesis?.cancel();

        if (recognitionRef.current) {

            try {
                recognitionRef.current.stop();
            } catch {}

        }

        speechReceivedRef.current =
            false;

        setIsListening(true);
        setSpokenAnswer("");
        setFeedback("");
        setShowFeedback(false);
        setIsCorrect(false);
        setApiError("");

        const recognition =
            new SpeechRecognition();

        recognition.lang =
            "en-US";

        recognition.continuous =
            false;

        recognition.interimResults =
            false;

        recognition.maxAlternatives =
            1;

        recognition.onstart = () => {

            if (
                mountedRef.current
            ) {

                setIsListening(true);

            }

        };

        recognition.onresult =
            async (event) => {

                const transcript =
                    event
                        ?.results?.[0]?.[0]
                        ?.transcript
                        ?.trim() ||
                    "";

                speechReceivedRef.current =
                    true;

                if (!transcript) {

                    handleNoSpeech();

                    return;

                }

                if (
                    !mountedRef.current
                ) {
                    return;
                }

                setIsListening(false);

                setSpokenAnswer(
                    transcript
                );

                await checkAnswerWithAI(
                    transcript
                );

            };

        recognition.onerror =
            (event) => {

                console.log(
                    "Speech Recognition Error:",
                    event?.error
                );

                if (
                    event?.error ===
                    "no-speech"
                ) {

                    handleNoSpeech();
                    return;

                }

                if (
                    event?.error ===
                    "audio-capture"
                ) {

                    handleNoSpeech();
                    return;

                }

                if (
                    event?.error ===
                    "not-allowed"
                ) {

                    const message =
                        "Please allow microphone permission and try again.";

                    setIsListening(false);
                    setIsChecking(false);
                    setFeedback(message);
                    setShowFeedback(true);

                    speakTeacher(
                        message
                    );

                    return;

                }

                setIsListening(false);
                setIsChecking(false);

            };

        recognition.onend = () => {

            if (
                !mountedRef.current
            ) {
                return;
            }

            setIsListening(false);

            if (
                !speechReceivedRef.current
            ) {

                handleNoSpeech();

            }

        };

        recognitionRef.current =
            recognition;

        try {

            recognition.start();

        } catch (error) {

            console.log(
                "Recognition Start Error:",
                error
            );

            setIsListening(false);

        }

    };

    /* =====================================================
            TRY AGAIN
    ===================================================== */

    const handleTryAgain = () => {

        window.speechSynthesis?.cancel();

        if (
            recognitionRef.current
        ) {

            try {
                recognitionRef.current.stop();
            } catch {}

        }

        celebrationRunningRef.current =
            false;

        setSpokenAnswer("");
        setFeedback("");
        setShowFeedback(false);
        setIsCorrect(false);
        setApiError("");
        setIsChecking(false);
        setIsListening(false);

        setTimeout(() => {

            if (
                mountedRef.current &&
                question?.question
            ) {

                speakTeacher(
                    question.question
                );

            }

        }, 300);

    };

    /* =====================================================
            BACK
    ===================================================== */

    const handleBack = () => {

        window.speechSynthesis?.cancel();

        celebrationRunningRef.current =
            false;

        if (
            recognitionRef.current
        ) {

            try {
                recognitionRef.current.stop();
            } catch {}

        }

        setIsListening(false);
        setIsChecking(false);

        if (onBack) {
            onBack();
        }

    };

    /* =====================================================
            SKIP
    ===================================================== */

    const handleSkip = () => {

        window.speechSynthesis?.cancel();

        celebrationRunningRef.current =
            false;

        if (
            recognitionRef.current
        ) {

            try {
                recognitionRef.current.stop();
            } catch {}

        }

        setIsListening(false);
        setIsChecking(false);

        if (onNext) {
            onNext();
        }

    };

    /* =====================================================
            EMPTY CONTENT
    ===================================================== */

    if (!questions.length) {

        return (

            <div
                className="favourite-person-activity2-page"
                style={{
                    backgroundImage:
                        `url(${chatBg})`,
                }}
            >

                <div className="fp2-overlay" />

                <div className="favourite-person-activity2-card empty-card">

                    <h2>
                        Activity content not found
                    </h2>

                    <button
                        type="button"
                        className="fp2-back-button"
                        onClick={handleBack}
                    >
                        ← Back
                    </button>

                </div>

            </div>

        );

    }

    /* =====================================================
            MAIN UI
    ===================================================== */

    return (

        <div
            className="favourite-person-activity2-page"
            style={{
                backgroundImage:
                    `url(${chatBg})`,
            }}
        >

            <div className="fp2-overlay" />

            <div className="favourite-person-activity2-card">

                {/* =========================================
                        HEADER
                ========================================= */}

                <div className="fp2-header">

                    <button
                        type="button"
                        className="fp2-back-button"
                        onClick={handleBack}
                        disabled={
                            isChecking ||
                            celebrationRunningRef.current
                        }
                    >
                        ← Back
                    </button>

                    <div className="fp2-title-area">

                        <h1>
                            Activity 2
                        </h1>

                        <div className="fp2-title-strip">
                            Talk About Your Favourite Person
                        </div>

                    </div>

                    <button
                        type="button"
                        className="fp2-skip-button"
                        onClick={handleSkip}
                        disabled={
                            isChecking ||
                            celebrationRunningRef.current
                        }
                    >
                        Skip →
                    </button>

                </div>

                {/* =========================================
                        PROGRESS
                ========================================= */}

                <div className="fp2-progress">

                    Question{" "}
                    {currentQuestion + 1}
                    {" / "}
                    {questions.length}

                </div>

                {/* =========================================
                        MAIN CONTENT
                ========================================= */}

                <div className="fp2-main-content">

                    {/* =====================================
                            TEACHER
                    ===================================== */}

                    <div className="fp2-teacher-section">

                        <div className="fp2-teacher-image-wrapper">

                            <img
                                src={currentTeacher}
                                alt="Miss Uroosa"
                                className={
                                    isSpeaking
                                        ? "fp2-teacher-image speaking"
                                        : "fp2-teacher-image"
                                }
                            />

                        </div>

                        <div
                            className={
                                `fp2-teacher-bubble ${
                                    showFeedback
                                        ? isCorrect
                                            ? "success"
                                            : "try-again"
                                        : ""
                                }`
                            }
                        >

                            <strong>

                                {showFeedback
                                    ? isCorrect
                                        ? "Excellent!"
                                        : "Miss Uroosa"
                                    : "Miss Uroosa"
                                }

                            </strong>

                            <p>

                                {showFeedback
                                    ? feedback
                                    : teacherIntro
                                }

                            </p>

                        </div>

                    </div>

                    {/* =====================================
                            QUESTION
                    ===================================== */}

                    <div className="fp2-question-section">

                        <div className="fp2-question-card">

                            <div className="fp2-question-heading">

                                <h2>
                                    {question.question}
                                </h2>

                                <button
                                    type="button"
                                    className="fp2-speaker-button"
                                    onClick={
                                        handleSpeakQuestion
                                    }
                                    disabled={
                                        isListening ||
                                        isChecking
                                    }
                                    title="Listen to question"
                                >
                                    🔊
                                </button>

                            </div>

                            <div className="fp2-divider" />

                            {!showFeedback && (

                                <div className="fp2-answer-area">

                                    <p className="fp2-answer-title">

                                        {isListening
                                            ? "I'm listening..."
                                            : isChecking
                                                ? "Miss Uroosa is checking your answer..."
                                                : "Speak your answer"
                                        }

                                    </p>

                                    <div className="fp2-wave-row">

                                        <div className="fp2-wave">

                                            <span />
                                            <span />
                                            <span />
                                            <span />
                                            <span />

                                        </div>

                                        <button
                                            type="button"
                                            className={
                                                isListening
                                                    ? "fp2-mic-button listening"
                                                    : "fp2-mic-button"
                                            }
                                            onClick={
                                                startListening
                                            }
                                            disabled={
                                                isListening ||
                                                isChecking ||
                                                celebrationRunningRef.current
                                            }
                                        >
                                            🎙️
                                        </button>

                                        <div className="fp2-wave">

                                            <span />
                                            <span />
                                            <span />
                                            <span />
                                            <span />

                                        </div>

                                    </div>

                                    <p className="fp2-tap-text">

                                        {isListening
                                            ? "Speak clearly..."
                                            : isChecking
                                                ? "Please wait..."
                                                : "Tap the microphone to speak"
                                        }

                                    </p>

                                </div>

                            )}

                            {spokenAnswer && !isCorrect && (

                                <div className="fp2-spoken-answer">

                                    <span>
                                        You said:
                                    </span>

                                    <strong>
                                        "{spokenAnswer}"
                                    </strong>

                                </div>

                            )}

                            {showFeedback && (

                                <div
                                    className={
                                        isCorrect
                                            ? "fp2-feedback success"
                                            : "fp2-feedback try-again"
                                    }
                                >

                                    <strong>
                                        {isCorrect
                                            ? "Excellent!"
                                            : "Teacher Feedback"
                                        }
                                    </strong>

                                </div>

                            )}

                            {showFeedback &&
                                !isCorrect && (

                                <button
                                    type="button"
                                    className="fp2-retry-button"
                                    onClick={
                                        handleTryAgain
                                    }
                                >
                                    🎙️ Try Again
                                </button>

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default FavouritePersonActivity2;