import React, { useEffect, useRef, useState } from "react";

import teacher from "../../assets/teacher1.png";
import bg from "../../assets/chatbg.jpeg";
import yaySound from "../../assets/yay.mp3";

import confetti from "canvas-confetti";

import "./SentenceRepairActivity.css";

function SentenceRepairActivity({
    onBack,
    onNext
}) {

    /* =====================================================
                    ROUND 1 QUESTIONS
    ===================================================== */

    const roundOneQuestions = [

        {
            sentence: "I like ___ football.",
            options: [
                "play",
                "playing",
                "played"
            ],
            answer: "playing",
            correction:
                "Like ke baad yahan playing use hoga. Isliye correct sentence hai: I like playing football. Dobara try karo."
        },

        {
            sentence: "She ___ reading books.",
            options: [
                "enjoy",
                "enjoys",
                "enjoying"
            ],
            answer: "enjoys",
            correction:
                "She ke saath present tense mein enjoys use hota hai. Correct answer enjoys hai. Dobara try karo."
        },

        {
            sentence: "He ___ listening to music.",
            options: [
                "like",
                "likes",
                "liking"
            ],
            answer: "likes",
            correction:
                "He ke saath present tense mein likes use hota hai. Correct answer likes hai. Dobara try karo."
        },

        {
            sentence: "I am ___ games after school.",
            options: [
                "play",
                "playing",
                "plays"
            ],
            answer: "playing",
            correction:
                "I am ke baad verb ka ing form use hota hai. Isliye playing correct hai. Dobara try karo."
        },

        {
            sentence: "My favourite hobby ___ drawing.",
            options: [
                "are",
                "be",
                "is"
            ],
            answer: "is",
            correction:
                "My favourite hobby ek singular subject hai, isliye is use hoga. Dobara try karo."
        }

    ];


    /* =====================================================
                    ROUND 2 QUESTIONS
    ===================================================== */

    const roundTwoQuestions = [

        {
            question:
                "What is your favourite hobby?"
        },

        {
            question:
                "What do you like doing in your free time?"
        },

        {
            question:
                "What hobby do you enjoy on weekends?"
        },

        {
            question:
                "Why do you like your favourite hobby?"
        },

        {
            question:
                "Who do you like doing your hobby with?"
        }

    ];


    /* =====================================================
                    ROUND 3 QUESTIONS
    ===================================================== */

    const roundThreeQuestions = [

        {
            sentence:
                "She go to school every day.",

            options: [
                "She go to school every day.",
                "She goes to school every day.",
                "She going to school every day."
            ],

            answer:
                "She goes to school every day.",

            correction:
                "She ke saath present tense mein goes use hota hai. Correct sentence hai: She goes to school every day. Dobara try karo."
        },

        {
            sentence:
                "He play football after school.",

            options: [
                "He plays football after school.",
                "He play football after school.",
                "He playing football after school."
            ],

            answer:
                "He plays football after school.",

            correction:
                "He ke saath present tense mein plays use hota hai. Correct sentence hai: He plays football after school. Dobara try karo."
        },

        {
            sentence:
                "I likes reading books.",

            options: [
                "I likes reading books.",
                "I like reading books.",
                "I liking reading books."
            ],

            answer:
                "I like reading books.",

            correction:
                "I ke saath like use hota hai, likes nahi. Correct sentence hai: I like reading books. Dobara try karo."
        },

        {
            sentence:
                "They is playing games.",

            options: [
                "They is playing games.",
                "They are playing games.",
                "They am playing games."
            ],

            answer:
                "They are playing games.",

            correction:
                "They ke saath are use hota hai. Correct sentence hai: They are playing games. Dobara try karo."
        },

        {
            sentence:
                "My friend enjoy music.",

            options: [
                "My friend enjoy music.",
                "My friend enjoying music.",
                "My friend enjoys music."
            ],

            answer:
                "My friend enjoys music.",

            correction:
                "My friend singular hai, isliye enjoys use hoga. Correct sentence hai: My friend enjoys music. Dobara try karo."
        }

    ];


    /* =====================================================
                        STATE
    ===================================================== */

    const [round, setRound] = useState(1);

    const [questionIndex, setQuestionIndex] =
        useState(0);

    const [selectedAnswer, setSelectedAnswer] =
        useState("");

    const [answerStatus, setAnswerStatus] =
        useState("");

    const [teacherMessage, setTeacherMessage] =
        useState("");

    const [userAnswer, setUserAnswer] =
        useState("");

    const [isSpeaking, setIsSpeaking] =
        useState(false);

    const [isListening, setIsListening] =
        useState(false);

    const [processing, setProcessing] =
        useState(false);


    /* =====================================================
                        REFS
    ===================================================== */

    const recognitionRef =
        useRef(null);

    const timeoutRefs =
        useRef([]);


    /* =====================================================
                    CURRENT QUESTION
    ===================================================== */

    const currentQuestion =
        round === 1
            ? roundOneQuestions[questionIndex]
            : round === 2
                ? roundTwoQuestions[questionIndex]
                : roundThreeQuestions[questionIndex];


    /* =====================================================
                    CLEAR TIMERS
    ===================================================== */

    const clearAllTimers = () => {

        timeoutRefs.current.forEach(
            (timer) => clearTimeout(timer)
        );

        timeoutRefs.current = [];

    };


    /* =====================================================
                    STOP EVERYTHING
    ===================================================== */

    const stopEverything = () => {

        clearAllTimers();

        if (window.speechSynthesis) {

            window.speechSynthesis.cancel();

        }

        if (recognitionRef.current) {

            try {

                recognitionRef.current.abort();

            }

            catch (error) {

                console.log(
                    "Recognition stop error:",
                    error
                );

            }

            recognitionRef.current = null;

        }

        setIsListening(false);
        setIsSpeaking(false);
        setProcessing(false);

    };


    /* =====================================================
                            SPEAK
    ===================================================== */

    const speak = (text) => {

        return new Promise((resolve) => {

            if (
                !text ||
                !window.speechSynthesis
            ) {

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
                    /Google UK English Female/i.test(
                        v.name
                    )
                )

                ||

                voices.find(v =>
                    /Google US English/i.test(
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
                    /Jenny/i.test(
                        v.name
                    )
                )

                ||

                voices.find(v =>
                    /Aria/i.test(
                        v.name
                    )
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


    /* =====================================================
                        YAY SOUND
    ===================================================== */

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


    /* =====================================================
                        CONFETTI
    ===================================================== */

    const celebrate = () => {

        confetti({

            particleCount: 130,

            spread: 85,

            startVelocity: 35,

            origin: {
                x: 0.5,
                y: 0.65
            }

        });


        const timer1 = setTimeout(() => {

            confetti({

                particleCount: 70,

                spread: 100,

                origin: {
                    x: 0.15,
                    y: 0.65
                }

            });

        }, 150);


        const timer2 = setTimeout(() => {

            confetti({

                particleCount: 70,

                spread: 100,

                origin: {
                    x: 0.85,
                    y: 0.65
                }

            });

        }, 300);


        timeoutRefs.current.push(
            timer1,
            timer2
        );

    };


    /* =====================================================
                    INITIALIZE
    ===================================================== */

    useEffect(() => {

        setRound(1);
        setQuestionIndex(0);

        return () => {

            stopEverything();

        };

    }, []);


    /* =====================================================
                MOVE TO NEXT ROUND
    ===================================================== */

    const moveToNextRound = async () => {

        const nextRound =
            round + 1;


        setSelectedAnswer("");
        setAnswerStatus("");
        setUserAnswer("");
        setTeacherMessage("");
        setQuestionIndex(0);
        setProcessing(false);


        /* =================================================
                            ROUND 2
        ================================================= */

        if (nextRound === 2) {

            setRound(2);

            await new Promise(resolve => {

                const timer = setTimeout(
                    resolve,
                    500
                );

                timeoutRefs.current.push(
                    timer
                );

            });


            await speak(
                "Great job! Round 1 is complete. Now let's practise speaking. I will ask you a question, and you will answer me using your microphone."
            );


            await new Promise(resolve => {

                const timer = setTimeout(
                    resolve,
                    500
                );

                timeoutRefs.current.push(
                    timer
                );

            });


            await speak(
                roundTwoQuestions[0].question
            );


            return;

        }


        /* =================================================
                            ROUND 3
        ================================================= */

        if (nextRound === 3) {

            setRound(3);

            await new Promise(resolve => {

                const timer = setTimeout(
                    resolve,
                    500
                );

                timeoutRefs.current.push(
                    timer
                );

            });


            await speak(
                "Excellent! Round 2 is complete. Now it is time for Round 3, the Sentence Detective challenge. Find the sentence that is grammatically correct."
            );


            return;

        }


        /* =================================================
                    ACTIVITY FINISHED
        ================================================= */

        if (nextRound === 4) {

            await speak(
                "Amazing work! You completed all three rounds of the Sentence Repair Lab. You are a fantastic sentence detective!"
            );


            await new Promise(resolve => {

                const timer = setTimeout(
                    resolve,
                    1200
                );

                timeoutRefs.current.push(
                    timer
                );

            });


            if (onNext) {

                onNext();

            }

        }

    };


    /* =====================================================
                ROUND 1 + ROUND 3 OPTIONS
    ===================================================== */

    const handleOptionSelect = async (option) => {

        if (
            processing ||
            answerStatus === "correct" ||
            !currentQuestion
        ) {

            return;

        }


        setSelectedAnswer(option);
        setProcessing(true);


        /* =================================================
                        WRONG ANSWER
        ================================================= */

        if (
            option !== currentQuestion.answer
        ) {

            setAnswerStatus("wrong");


            await speak(
                currentQuestion.correction
            );


            setProcessing(false);

            return;

        }


        /* =================================================
                        CORRECT ANSWER
        ================================================= */

        setAnswerStatus("correct");

        celebrate();

        await playYaySound();


        await speak(

            round === 1

                ? "Excellent! That's the correct word. Well done!"

                : "Excellent! You found the correct sentence. Great detective work!"

        );


        /* =================================================
                    LAST QUESTION
        ================================================= */

        const questionsLength =
            round === 1
                ? roundOneQuestions.length
                : roundThreeQuestions.length;


        if (
            questionIndex ===
            questionsLength - 1
        ) {

            await moveToNextRound();

            return;

        }


        /* =================================================
                    NEXT QUESTION
        ================================================= */

        const nextIndex =
            questionIndex + 1;


        setQuestionIndex(
            nextIndex
        );

        setSelectedAnswer("");
        setAnswerStatus("");
        setTeacherMessage("");
        setProcessing(false);


        const timer = setTimeout(async () => {

            if (round === 1) {

                await speak(
                    "Great job! Let's repair the next sentence."
                );

            }

            else if (round === 3) {

                await speak(
                    "Great detective work! Let's investigate the next sentence."
                );

            }

        }, 400);


        timeoutRefs.current.push(
            timer
        );

    };


    /* =====================================================
                    ROUND 2 LISTENING
    ===================================================== */

    const startListening = () => {

        if (
            processing ||
            isListening ||
            round !== 2 ||
            !currentQuestion
        ) {

            return;

        }


        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if (!SpeechRecognition) {

            speak(
                "Sorry, speech recognition is not supported in this browser. Please use Google Chrome."
            );

            return;

        }


        /*
            Stop old teacher speech.
        */

        if (window.speechSynthesis) {

            window.speechSynthesis.cancel();

        }


        /*
            Stop previous recognition.
        */

        if (recognitionRef.current) {

            try {

                recognitionRef.current.abort();

            }

            catch (error) {

                console.log(error);

            }

            recognitionRef.current = null;

        }


        clearAllTimers();


        setTeacherMessage("");
        setUserAnswer("");
        setAnswerStatus("");
        setIsListening(true);
        setProcessing(false);


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


        recognitionRef.current =
            recognition;


        /* =================================================
                        SPEECH RESULT
        ================================================= */

        recognition.onresult =
            async (event) => {

                const transcript =
                    event
                        ?.results
                        ?.[
                            0
                        ]
                        ?.[
                            0
                        ]
                        ?.transcript
                        ?.trim();


                setIsListening(false);

                recognitionRef.current =
                    null;


                if (!transcript) {

                    setProcessing(false);

                    setAnswerStatus("wrong");

                    await speak(
                        "Sorry, I couldn't hear you. Please try again."
                    );

                    return;

                }


                setUserAnswer(
                    transcript
                );


                await checkSpeakingAnswer(
                    transcript
                );

            };


        /* =================================================
                        SPEECH ERROR
        ================================================= */

        recognition.onerror =
            async (event) => {

                console.log(
                    "Speech Recognition Error:",
                    event?.error
                );


                recognitionRef.current =
                    null;


                setIsListening(false);
                setProcessing(false);


                /*
                    No confetti.
                    No yay.
                    No next question.
                */

                if (
                    event?.error ===
                    "no-speech"
                ) {

                    setAnswerStatus(
                        "wrong"
                    );


                    await speak(
                        "Sorry, I couldn't hear you. Please try again."
                    );


                    return;

                }


                setAnswerStatus(
                    "error"
                );


                await speak(
                    "Sorry, I could not hear you clearly. Please try again."
                );

            };


        /* =================================================
                        SPEECH END
        ================================================= */

        recognition.onend =
            () => {

                setIsListening(false);


                if (
                    recognitionRef.current ===
                    recognition
                ) {

                    recognitionRef.current =
                        null;

                }

            };


        /* =================================================
                        START MICROPHONE
        ================================================= */

        try {

            recognition.start();

        }

        catch (error) {

            console.log(
                "Recognition start error:",
                error
            );


            recognitionRef.current =
                null;


            setIsListening(false);
            setProcessing(false);

        }

    };


    /* =====================================================
                    ROUND 2 ANSWER CHECK
    ===================================================== */

    const checkSpeakingAnswer =
        async (answer) => {

            if (
                processing ||
                !answer ||
                !answer.trim() ||
                round !== 2 ||
                !currentQuestion
            ) {

                return;

            }


            setProcessing(true);

            setAnswerStatus("");


            try {

                /* =========================================
                        BACKEND REQUEST
                ========================================= */

                const response =
                    await fetch(
                        `${import.meta.env.VITE_API_URL}/api/sentence-repair/round2`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                question:
                                    currentQuestion.question,

                                message:
                                    answer.trim(),

                                context:
                                    "Sentence Repair Lab Round 2 interactive speaking activity. Evaluate only the current question.",

                                userName:
                                    "Student"

                            })

                        }
                    );


                /* =========================================
                        SERVER ERROR
                ========================================= */

                if (!response.ok) {

                    throw new Error(
                        `Server returned ${response.status}`
                    );

                }


                const data =
                    await response.json();


                /* =========================================
                        INVALID RESPONSE
                ========================================= */

                if (
                    !data ||
                    data.success !== true
                ) {

                    throw new Error(
                        data?.message ||
                        "Invalid server response."
                    );

                }


                const teacherResponse =
                    data
                        ?.teacherResponse
                        ?.trim();


                /* =========================================
                        TEACHER RESPONSE
                ========================================= */

                if (teacherResponse) {

                    await speak(
                        teacherResponse
                    );

                }


                /* =========================================
                    WRONG / RETRY ANSWER
                ========================================= */

                if (
                    data.isCorrect !== true
                ) {

                    /*
                        IMPORTANT:

                        Wrong answer:

                        ❌ NO CONFETTI
                        ❌ NO YAY
                        ❌ NO NEXT QUESTION
                        ❌ NO questionIndex change

                        Same question remains.
                    */

                    setAnswerStatus(
                        data.retry === false
                            ? "error"
                            : "wrong"
                    );


                    setProcessing(false);


                    /*
                        User manually presses
                        Speak Your Answer again.
                    */

                    return;

                }


                /* =========================================
                        CORRECT ANSWER
                ========================================= */

                setAnswerStatus(
                    "correct"
                );


                /*
                    ONLY correct answer gets
                    celebration.
                */

                celebrate();


                await playYaySound();


                /* =========================================
                        LAST QUESTION
                ========================================= */

                if (
                    questionIndex ===
                    roundTwoQuestions.length - 1
                ) {

                    setProcessing(false);


                    await moveToNextRound();


                    return;

                }


                /* =========================================
                        NEXT QUESTION
                ========================================= */

                const nextIndex =
                    questionIndex + 1;


                /*
                    Stop processing before
                    changing question.
                */

                setProcessing(false);


                setQuestionIndex(
                    nextIndex
                );

                setUserAnswer("");
                setAnswerStatus("");
                setTeacherMessage("");


                await new Promise(resolve => {

                    const timer =
                        setTimeout(
                            resolve,
                            400
                        );

                    timeoutRefs.current.push(
                        timer
                    );

                });


                /*
                    Ask ONLY the next question.

                    No extra question.
                */

                if (
                    roundTwoQuestions[
                        nextIndex
                    ]
                ) {

                    await speak(
                        roundTwoQuestions[
                            nextIndex
                        ].question
                    );

                }

            }


            catch (error) {

                console.log(
                    "❌ Sentence Repair Round 2 Error:",
                    error
                );


                setProcessing(false);

                setAnswerStatus(
                    "error"
                );


                /*
                    Error par:

                    ❌ no confetti
                    ❌ no yay
                    ❌ no next question
                */

                await speak(
                    "Sorry, I could not check your answer right now. Please try again."
                );

            }

        };


    /* =====================================================
                        SKIP
    ===================================================== */

    const handleSkip = () => {

        stopEverything();

        setTeacherMessage("");
        setSelectedAnswer("");
        setAnswerStatus("");
        setUserAnswer("");


        if (onNext) {

            onNext();

        }

    };


    /* =====================================================
                        BACK
    ===================================================== */

    const handleBack = () => {

        stopEverything();

        setTeacherMessage("");
        setSelectedAnswer("");
        setAnswerStatus("");
        setUserAnswer("");


        if (onBack) {

            onBack();

        }

    };


    /* =====================================================
                    ROUND TITLE
    ===================================================== */

    const getRoundTitle = () => {

        if (round === 1) {

            return "Round 1 • Find the Correct Word";

        }


        if (round === 2) {

            return "Round 2 • Talk to Miss Uroosa";

        }


        if (round === 3) {

            return "Round 3 • Sentence Detective";

        }


        return "";

    };


    /* =====================================================
                        MAIN UI
    ===================================================== */

    return (

        <div
            className="sentence-repair-activity-page"
            style={{
                backgroundImage:
                    `url(${bg})`
            }}
        >

            <div
                className="sentence-repair-activity-overlay"
            />


            <div
                className="sentence-repair-activity-card"
            >

                {/* =================================================
                                HEADER
                ================================================= */}

                <div
                    className="sentence-repair-header"
                >

                    <button
                        type="button"
                        className="sentence-repair-back-btn"
                        onClick={handleBack}
                    >
                        ← Back
                    </button>


                    <div
                        className="sentence-repair-header-center"
                    >

                        <h1>
                            Sentence Repair Lab
                        </h1>

                        <span>
                            {getRoundTitle()}
                        </span>

                    </div>


                    <button
                        type="button"
                        className="sentence-repair-skip-btn"
                        onClick={handleSkip}
                    >
                        Skip →
                    </button>

                </div>


                {/* =================================================
                        QUESTION NUMBER
                ================================================= */}

                <div
                    className="sentence-repair-question-number"
                >
                    {questionIndex + 1}/5
                </div>


                {/* =================================================
                            MAIN CONTENT
                ================================================= */}

                <div
                    className="sentence-repair-main"
                >

                    {/* =================================================
                                TEACHER
                    ================================================= */}

                    <div
                        className="sentence-repair-teacher-section"
                    >

                        <div
                            className="sentence-repair-teacher-stage"
                        >

                            <img
                                src={teacher}
                                alt="Miss Uroosa"
                                className={
                                    isSpeaking
                                        ? "sentence-repair-teacher speaking"
                                        : "sentence-repair-teacher"
                                }
                            />

                        </div>


                        {teacherMessage && (

                            <div
                                className="sentence-repair-teacher-bubble"
                            >

                                <div
                                    className="sentence-repair-teacher-name"
                                >
                                    Miss Uroosa
                                </div>


                                <div
                                    className="sentence-repair-teacher-text"
                                >
                                    {teacherMessage}
                                </div>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                            ROUND 1
                    ================================================= */}

                    {round === 1 && (

                        <div
                            className="sentence-repair-question-section"
                        >

                            <div
                                className="sentence-repair-badge"
                            >
                                🔧 Repair This Sentence
                            </div>


                            <div
                                className="sentence-repair-question-card"
                            >

                                <div
                                    className="sentence-repair-question-label"
                                >
                                    Find the correct word
                                </div>


                                <div
                                    className="sentence-repair-sentence"
                                >

                                    {currentQuestion.sentence
                                        .split("___")
                                        .map(
                                            (part, index) => (

                                                <React.Fragment
                                                    key={index}
                                                >

                                                    {part}

                                                    {index === 0 && (

                                                        <span
                                                            className={
                                                                selectedAnswer
                                                                    ? "sentence-blank filled"
                                                                    : "sentence-blank"
                                                            }
                                                        >

                                                            {selectedAnswer ||
                                                                "____"}

                                                        </span>

                                                    )}

                                                </React.Fragment>

                                            )
                                        )}

                                </div>


                                <p
                                    className="sentence-repair-instruction"
                                >
                                    Choose the word that makes
                                    the sentence correct.
                                </p>


                                <div
                                    className="sentence-repair-options"
                                >

                                    {currentQuestion.options.map(
                                        (option) => (

                                            <button
                                                type="button"
                                                key={option}
                                                className={

                                                    selectedAnswer === option

                                                        ? answerStatus === "correct"

                                                            ? "sentence-option selected correct-option"

                                                            : answerStatus === "wrong"

                                                                ? "sentence-option selected wrong-option"

                                                                : "sentence-option selected"

                                                        : "sentence-option"

                                                }
                                                onClick={() =>
                                                    handleOptionSelect(
                                                        option
                                                    )
                                                }
                                                disabled={
                                                    processing ||
                                                    answerStatus === "correct"
                                                }
                                            >

                                                {selectedAnswer === option && (

                                                    <span>
                                                        ✓
                                                    </span>

                                                )}

                                                {option}

                                            </button>

                                        )
                                    )}

                                </div>


                                {answerStatus === "wrong" && (

                                    <div
                                        className="sentence-repair-status wrong"
                                    >
                                        ❌ Try again! Miss Uroosa ki
                                        explanation suno aur dobara
                                        answer karo.
                                    </div>

                                )}


                                {answerStatus === "correct" && (

                                    <div
                                        className="sentence-repair-status correct"
                                    >
                                        🎉 Excellent! Correct answer!
                                    </div>

                                )}

                            </div>

                        </div>

                    )}


                    {/* =================================================
                            ROUND 2
                    ================================================= */}

                    {round === 2 && (

                        <div
                            className="sentence-repair-question-section"
                        >

                            <div
                                className="sentence-repair-badge"
                            >
                                🗣️ Talk to Miss Uroosa
                            </div>


                            <div
                                className="sentence-repair-question-card"
                            >

                                <div
                                    className="sentence-repair-question-label"
                                >
                                    Speaking Practice
                                </div>


                                <h2
                                    className="sentence-repair-speaking-question"
                                >
                                    {currentQuestion.question}
                                </h2>


                                <p
                                    className="sentence-repair-instruction"
                                >
                                    Listen to Miss Uroosa and
                                    answer in complete English
                                    sentences.
                                </p>


                                {/* =================================================
                                    MICROPHONE BUTTON
                                ================================================= */}

                                <button
                                    type="button"
                                    className={
                                        isListening
                                            ? "sentence-repair-mic-btn listening"
                                            : "sentence-repair-mic-btn"
                                    }
                                    onClick={
                                        startListening
                                    }
                                    disabled={
                                        processing ||
                                        isListening
                                    }
                                >

                                    {isListening

                                        ? "🎙️ Listening..."

                                        : processing

                                            ? "🤔 Miss Uroosa is checking..."

                                            : "🎤 Speak Your Answer"

                                    }

                                </button>


                                {/* =================================================
                                    USER ANSWER
                                ================================================= */}

                                {userAnswer && (

                                    <div
                                        className="sentence-repair-user-answer"
                                    >

                                        <strong>
                                            You said:
                                        </strong>

                                        <span>
                                            "{userAnswer}"
                                        </span>

                                    </div>

                                )}


                                {/* =================================================
                                    CORRECT
                                ================================================= */}

                                {answerStatus === "correct" && (

                                    <div
                                        className="sentence-repair-status correct"
                                    >
                                        🎉 Excellent! Great answer!
                                    </div>

                                )}


                                {/* =================================================
                                    WRONG / RETRY
                                ================================================= */}

                                {answerStatus === "wrong" && (

                                    <div
                                        className="sentence-repair-status wrong"
                                    >
                                        🔄 Let's try again. Repeat the
                                        corrected sentence.
                                    </div>

                                )}


                                {/* =================================================
                                    ERROR
                                ================================================= */}

                                {answerStatus === "error" && (

                                    <div
                                        className="sentence-repair-status wrong"
                                    >
                                        ⚠️ Please try again.
                                    </div>

                                )}

                            </div>

                        </div>

                    )}


                    {/* =================================================
                            ROUND 3
                    ================================================= */}

                    {round === 3 && (

                        <div
                            className="sentence-repair-question-section"
                        >

                            <div
                                className="sentence-repair-badge"
                            >
                                🕵️ Sentence Detective
                            </div>


                            <div
                                className="sentence-repair-question-card"
                            >

                                <div
                                    className="sentence-repair-question-label"
                                >
                                    Find the correct sentence
                                </div>


                                <div
                                    className="sentence-repair-sentence"
                                >
                                    {currentQuestion.sentence}
                                </div>


                                <p
                                    className="sentence-repair-instruction"
                                >
                                    Look carefully and choose
                                    the grammatically correct
                                    sentence.
                                </p>


                                <div
                                    className="sentence-repair-options"
                                >

                                    {currentQuestion.options.map(
                                        (option) => (

                                            <button
                                                type="button"
                                                key={option}
                                                className={

                                                    selectedAnswer === option

                                                        ? answerStatus === "correct"

                                                            ? "sentence-option selected correct-option"

                                                            : answerStatus === "wrong"

                                                                ? "sentence-option selected wrong-option"

                                                                : "sentence-option selected"

                                                        : "sentence-option"

                                                }
                                                onClick={() =>
                                                    handleOptionSelect(
                                                        option
                                                    )
                                                }
                                                disabled={
                                                    processing ||
                                                    answerStatus === "correct"
                                                }
                                            >

                                                {selectedAnswer === option && (

                                                    <span>
                                                        ✓
                                                    </span>

                                                )}

                                                {option}

                                            </button>

                                        )
                                    )}

                                </div>


                                {answerStatus === "wrong" && (

                                    <div
                                        className="sentence-repair-status wrong"
                                    >
                                        ❌ Not quite! Miss Uroosa ki
                                        explanation suno aur dobara
                                        try karo.
                                    </div>

                                )}


                                {answerStatus === "correct" && (

                                    <div
                                        className="sentence-repair-status correct"
                                    >
                                        🎉 Excellent detective work!
                                    </div>

                                )}

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

export default SentenceRepairActivity;