import React, { useState, useEffect, useRef } from "react";

import teacher from "./assets/teacher1.png";
import yaySound from "./assets/yay.mp3";

import confetti from "canvas-confetti";


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

    const [selectedOption, setSelectedOption] = useState("");

    const [answerStatus, setAnswerStatus] = useState("");

    const [celebrating, setCelebrating] = useState(false);


    /* =========================================
                    REFS
    ========================================= */

    const recognitionRef = useRef(null);

    const yayAudioRef = useRef(null);

    const confettiFrameRef = useRef(null);

    const mountedRef = useRef(true);


    /* =========================================
                    SPEECH RECOGNITION
    ========================================= */

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    /* =========================================
                    CLEANUP
    ========================================= */

    useEffect(() => {

        mountedRef.current = true;

        return () => {

            mountedRef.current = false;

            window.speechSynthesis.cancel();

            if (recognitionRef.current) {

                try {

                    recognitionRef.current.stop();

                } catch (error) {

                    // Ignore stop error

                }

                recognitionRef.current = null;

            }

            if (yayAudioRef.current) {

                yayAudioRef.current.pause();

                yayAudioRef.current.currentTime = 0;

            }

            if (confettiFrameRef.current) {

                cancelAnimationFrame(
                    confettiFrameRef.current
                );

            }

        };

    }, []);


    /* =========================================
                    FIND FEMALE VOICE
    ========================================= */

    const getFemaleVoice = () => {

        const voices =
            window.speechSynthesis.getVoices();

        return (

            voices.find(v =>
                /Google UK English Female/i.test(
                    v.name
                )
            )

            ||

            voices.find(v =>
                /Google US English Female/i.test(
                    v.name
                )
            )

            ||

            voices.find(v =>
                /Microsoft.*Jenny/i.test(
                    v.name
                )
            )

            ||

            voices.find(v =>
                /Microsoft.*Aria/i.test(
                    v.name
                )
            )

            ||

            voices.find(v =>
                /Samantha/i.test(
                    v.name
                )
            )

            ||

            voices.find(v =>
                /Zira/i.test(
                    v.name
                )
            )

            ||

            voices.find(v =>
                /female/i.test(
                    v.name
                )
            )

            ||

            null

        );

    };


    /* =========================================
                    SPEAK
    ========================================= */

    const speak = (
        text,
        callback
    ) => {

        if (!window.speechSynthesis) {

            if (callback) callback();

            return;

        }

        window.speechSynthesis.cancel();

        const speech =
            new SpeechSynthesisUtterance(text);

        speech.lang = "en-US";

        speech.rate = 0.9;

        speech.pitch = 1.05;

        speech.volume = 1;


        const femaleVoice =
            getFemaleVoice();

        if (femaleVoice) {

            speech.voice = femaleVoice;

        }


        speech.onend = () => {

            if (!mountedRef.current) return;

            if (callback) {

                callback();

            }

        };


        speech.onerror = () => {

            if (!mountedRef.current) return;

            if (callback) {

                callback();

            }

        };


        window.speechSynthesis.speak(
            speech
        );

    };


    /* =========================================
                LOAD VOICES
    ========================================= */

    useEffect(() => {

        if (!window.speechSynthesis) return;

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


    /* =========================================
                RESET NEW QUESTION
    ========================================= */

    useEffect(() => {

        window.speechSynthesis.cancel();

        if (recognitionRef.current) {

            try {

                recognitionRef.current.stop();

            } catch (error) {

                // Ignore

            }

            recognitionRef.current = null;

        }

        if (yayAudioRef.current) {

            yayAudioRef.current.pause();

            yayAudioRef.current.currentTime = 0;

        }

        if (confettiFrameRef.current) {

            cancelAnimationFrame(
                confettiFrameRef.current
            );

            confettiFrameRef.current = null;

        }

        setStage(0);

        setTeacherText(data.sentence);

        setUserSentence("");

        setListening(false);

        setSelectedOption("");

        setAnswerStatus("");

        setCelebrating(false);


        const timer = setTimeout(() => {

            if (!mountedRef.current) return;

            speak(data.sentence);

        }, 300);


        return () => {

            clearTimeout(timer);

            window.speechSynthesis.cancel();

        };

    }, [data]);


    /* =========================================
                PLAY YAY SOUND
    ========================================= */

    const playYaySound = (callback) => {

        if (!mountedRef.current) return;


        const audio =
            new Audio(yaySound);

        yayAudioRef.current = audio;

        audio.volume = 1;


        let finished = false;


        const finish = () => {

            if (finished) return;

            finished = true;

            if (!mountedRef.current) return;

            if (callback) {

                callback();

            }

        };


        audio.onended = finish;

        audio.onerror = finish;


        const playPromise =
            audio.play();


        if (
            playPromise &&
            typeof playPromise.catch === "function"
        ) {

            playPromise.catch(() => {

                finish();

            });

        }

    };


    /* =========================================
                CANVAS CONFETTI
    ========================================= */

    const playConfetti = () => {

        if (!mountedRef.current) return;


        setCelebrating(true);


        const duration = 1800;

        const end =
            Date.now() + duration;


        const frame = () => {

            if (!mountedRef.current) return;


            confetti({

                particleCount: 6,

                spread: 75,

                startVelocity: 35,

                gravity: 0.9,

                ticks: 100,

                origin: {

                    x: Math.random(),

                    y:
                        Math.random() * 0.5

                }

            });


            if (Date.now() < end) {

                confettiFrameRef.current =
                    requestAnimationFrame(
                        frame
                    );

            } else {

                confettiFrameRef.current =
                    null;

            }

        };


        frame();

    };


    /* =========================================
                STOP CELEBRATION
    ========================================= */

    const stopCelebration = () => {

        if (yayAudioRef.current) {

            yayAudioRef.current.pause();

            yayAudioRef.current.currentTime = 0;

        }


        if (confettiFrameRef.current) {

            cancelAnimationFrame(
                confettiFrameRef.current
            );

            confettiFrameRef.current = null;

        }


        setCelebrating(false);

    };


    /* =========================================
                CORRECT ANSWER
    ========================================= */

    const correctAnswer = () => {

        if (!mountedRef.current) return;

        if (answerStatus === "correct") return;


        setListening(false);

        setAnswerStatus("correct");

        setTeacherText(
            "Excellent! That's correct."
        );


        /* =====================================
                STOP SPEECH RECOGNITION
        ===================================== */

        if (recognitionRef.current) {

            try {

                recognitionRef.current.stop();

            } catch (error) {

                // Ignore

            }

            recognitionRef.current = null;

        }


        /* =====================================
                YAY + CONFETTI
        ===================================== */

        setCelebrating(true);

        playConfetti();


        /*
            IMPORTANT:

            First YAY sound will finish.
            Then teacher voice will start.
        */

        playYaySound(() => {

            if (!mountedRef.current) return;


            /* ================================
                    TEACHER VOICE
            ================================= */

            speak(
                "Excellent! That's correct.",
                () => {

                    if (!mountedRef.current)
                        return;


                    /*
                        Teacher voice complete.
                        Now stop celebration and
                        move to next question.
                    */

                    setTimeout(() => {

                        if (
                            !mountedRef.current
                        ) return;


                        stopCelebration();

                        onNext();

                    }, 250);

                }
            );

        });

    };


    /* =========================================
                WRONG ANSWER
    ========================================= */

    const wrongAnswer = () => {

        if (!mountedRef.current) return;

        if (answerStatus === "correct") return;


        setListening(false);

        setAnswerStatus("wrong");

        setTeacherText(
            "Not quite! Try again."
        );


        speak(
            "Not quite! Try again.",
            () => {

                if (!mountedRef.current)
                    return;

                setTimeout(() => {

                    if (!mountedRef.current)
                        return;

                    setAnswerStatus("");

                    setTeacherText(
                        stage === 0
                            ? data.sentence
                            : "Choose a word and say the complete sentence."
                    );

                }, 300);

            }
        );

    };


    /* =========================================
            NORMALIZE SPEECH TEXT
    ========================================= */

    const normalizeText = (text) => {

        return text
            .toLowerCase()
            .replace(/[.,!?;:'"]/g, "")
            .replace(/\s+/g, " ")
            .trim();

    };


    /* =========================================
            CHECK FINAL SENTENCE
    ========================================= */

    const checkFinalSentence = (
        spokenText,
        selectedWord
    ) => {

        const spoken =
            normalizeText(
                spokenText
            );


        /*
            Expected answer:

            Prefer data.correctAnswer
            if your data has it.

            Otherwise use selected
            option + sentence.
        */

        let expected = "";


        if (data.correctAnswer) {

            expected =
                normalizeText(
                    data.correctAnswer
                );

        }

        else if (data.answer) {

            expected =
                normalizeText(
                    data.answer
                );

        }

        else {

            /*
                If your data structure only
                has sentence + blank + options,
                check selected option.

                Example:

                sentence:
                "I would like ____ please."

                option:
                "pasta"

                Then spoken sentence must
                contain the selected word.
            */

            expected =
                normalizeText(
                    selectedWord
                );

        }


        if (!expected) {

            return false;

        }


        /*
            Exact / strong validation.

            This prevents random words from
            being accepted.
        */

        if (spoken === expected) {

            return true;

        }


        /*
            If complete expected sentence
            is available, allow punctuation
            and small spacing differences.
        */

        if (
            spoken.includes(expected) &&
            expected.length > 3
        ) {

            return true;

        }


        return false;

    };


    /* =========================================
            FIRST SPEAKING
    ========================================= */

    const startRepeatRecognition = () => {

        if (celebrating) return;

        if (listening) return;


        if (!SpeechRecognition) {

            alert(
                "Speech Recognition not supported"
            );

            return;

        }


        window.speechSynthesis.cancel();


        if (recognitionRef.current) {

            try {

                recognitionRef.current.stop();

            } catch (error) {

                // Ignore

            }

        }


        const recognition =
            new SpeechRecognition();


        recognitionRef.current =
            recognition;


        recognition.lang =
            "en-US";

        recognition.interimResults =
            false;

        recognition.maxAlternatives =
            1;


        setListening(true);


        recognition.start();


        recognition.onresult = (
            event
        ) => {

            if (!mountedRef.current)
                return;


            setListening(false);

            recognitionRef.current =
                null;


            /*
                First stage is simply
                repeat practice.

                We don't mark it wrong.
            */

            setStage(1);

            teacherCompleteSentence();

        };


        recognition.onerror = () => {

            if (!mountedRef.current)
                return;


            setListening(false);

            recognitionRef.current =
                null;


            setTeacherText(
                "I didn't hear you. Please try again."
            );


            speak(
                "I didn't hear you. Please try again."
            );

        };


        recognition.onend = () => {

            if (!mountedRef.current)
                return;


            setListening(false);

            if (
                recognitionRef.current ===
                recognition
            ) {

                recognitionRef.current =
                    null;

            }

        };

    };


    /* =========================================
            TEACHER INSTRUCTION
    ========================================= */

    const teacherCompleteSentence = () => {

        if (!mountedRef.current)
            return;


        const message =
            "Now let's complete the sentence. Please choose a word and repeat the complete sentence.";


        setTeacherText(message);


        speak(message);

    };


    /* =========================================
            OPTION CLICK
    ========================================= */

    const handleOptionClick = (
        option
    ) => {

        if (celebrating) return;

        if (answerStatus === "correct")
            return;


        setSelectedOption(option);


        /*
            If data.correctOption exists,
            use it.

            Otherwise if data.correctAnswer
            is available and option matches it,
            use that.
        */

        let isCorrect = false;


        if (
            data.correctOption !==
            undefined
        ) {

            isCorrect =
                normalizeText(option) ===
                normalizeText(
                    data.correctOption
                );

        }

        else if (
            data.correctAnswer
        ) {

            isCorrect =
                normalizeText(option) ===
                normalizeText(
                    data.correctAnswer
                );

        }

        else if (
            data.answer
        ) {

            isCorrect =
                normalizeText(option) ===
                normalizeText(
                    data.answer
                );

        }

        else {

            /*
                If no explicit correct answer
                is present, don't automatically
                call it correct.

                This is important because
                frontend should not guess.
            */

            isCorrect = false;

        }


        if (isCorrect) {

            correctAnswer();

        } else {

            wrongAnswer();

        }

    };


    /* =========================================
            FINAL SPEAKING
    ========================================= */

    const startFinalRecognition = () => {

        if (celebrating) return;

        if (listening) return;


        if (!SpeechRecognition) {

            alert(
                "Speech Recognition not supported"
            );

            return;

        }


        if (!selectedOption) {

            setTeacherText(
                "Please choose a word first."
            );


            speak(
                "Please choose a word first."
            );


            return;

        }


        window.speechSynthesis.cancel();


        if (recognitionRef.current) {

            try {

                recognitionRef.current.stop();

            } catch (error) {

                // Ignore

            }

        }


        const recognition =
            new SpeechRecognition();


        recognitionRef.current =
            recognition;


        recognition.lang =
            "en-US";

        recognition.interimResults =
            false;

        recognition.maxAlternatives =
            1;


        setListening(true);


        recognition.start();


        recognition.onresult = (
            event
        ) => {

            if (!mountedRef.current)
                return;


            setListening(false);

            recognitionRef.current =
                null;


            const text =
                event
                    .results[0][0]
                    .transcript;


            setUserSentence(text);


            /*
                Validate actual spoken
                sentence.

                WRONG => wrongAnswer()
                CORRECT => correctAnswer()
            */

            const isCorrect =
                checkFinalSentence(
                    text,
                    selectedOption
                );


            if (isCorrect) {

                correctAnswer();

            } else {

                wrongAnswer();

            }

        };


        recognition.onerror = () => {

            if (!mountedRef.current)
                return;


            setListening(false);

            recognitionRef.current =
                null;


            /*
                IMPORTANT:

                Recognition error is NOT
                treated as correct anymore.
            */

            setTeacherText(
                "I couldn't hear you clearly. Please try again."
            );


            speak(
                "I couldn't hear you clearly. Please try again."
            );

        };


        recognition.onend = () => {

            if (!mountedRef.current)
                return;


            setListening(false);


            if (
                recognitionRef.current ===
                recognition
            ) {

                recognitionRef.current =
                    null;

            }

        };

    };


    /* =========================================
                    PROGRESS
    ========================================= */

    const progress =
        (current / total) * 100;


    /* =========================================
                    OPTION CLASS
    ========================================= */

    const getOptionClass = (
        option
    ) => {

        let className =
            "lr-option";


        if (
            selectedOption === option &&
            answerStatus === "wrong"
        ) {

            className +=
                " wrong";

        }


        if (
            selectedOption === option &&
            answerStatus === "correct"
        ) {

            className +=
                " correct";

        }


        return className;

    };


    /* =========================================
                    BACK
    ========================================= */

    const handleBack = () => {

        window.speechSynthesis.cancel();


        if (recognitionRef.current) {

            try {

                recognitionRef.current.stop();

            } catch (error) {

                // Ignore

            }

            recognitionRef.current = null;

        }


        stopCelebration();


        if (onBack) {

            onBack();

        }

    };


    /* =========================================
                    SKIP
    ========================================= */

    const handleSkip = () => {

        window.speechSynthesis.cancel();


        if (recognitionRef.current) {

            try {

                recognitionRef.current.stop();

            } catch (error) {

                // Ignore

            }

            recognitionRef.current = null;

        }


        stopCelebration();


        if (onSkip) {

            onSkip();

        }

    };


    /* =========================================
                    UI
    ========================================= */

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
                        onClick={
                            handleBack
                        }
                        disabled={
                            celebrating
                        }
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
                        onClick={
                            handleSkip
                        }
                        disabled={
                            celebrating
                        }
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
                        className={
                            celebrating
                                ? "lr-teacher celebrating"
                                : listening
                                    ? "lr-teacher speaking"
                                    : "lr-teacher"
                        }
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
                                disabled={
                                    celebrating
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
                                    (
                                        option,
                                        index
                                    ) => (

                                        <button
                                            key={index}
                                            type="button"
                                            className={
                                                getOptionClass(
                                                    option
                                                )
                                            }
                                            onClick={() =>
                                                handleOptionClick(
                                                    option
                                                )
                                            }
                                            disabled={
                                                celebrating ||
                                                answerStatus ===
                                                    "correct"
                                            }
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
                                disabled={
                                    celebrating ||
                                    answerStatus ===
                                        "correct"
                                }
                            >

                                🎙️

                            </button>


                            <p className="lr-mic-label">

                                {listening
                                    ? "Listening..."
                                    : "Tap to Speak"}

                            </p>


                            {/* =========================
                                SPOKEN SENTENCE
                            ========================= */}

                            {userSentence && (

                                <p className="lr-spoken-text">

                                    You said: "{userSentence}"

                                </p>

                            )}


                            {/* =========================
                                FEEDBACK
                            ========================= */}

                            {answerStatus ===
                                "wrong" && (

                                <div className="lr-answer-feedback wrong">

                                    ❌ Not quite! Try again.

                                </div>

                            )}


                            {answerStatus ===
                                "correct" && (

                                <div className="lr-answer-feedback correct">

                                    🎉 Excellent! That's correct!

                                </div>

                            )}

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