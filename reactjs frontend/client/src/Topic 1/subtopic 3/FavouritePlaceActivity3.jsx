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

import "./FavouritePlaceActivity3.css";


function FavouritePlaceActivity3({
    content,
    topicId,
    lessonId,
    userName,
    onNext,
    onFinish,
    onBack
}) {

    /* =========================================
       DEFAULT QUESTIONS
    ========================================= */

    const defaultQuestions = [
        {
            question:
                "What is your favourite place?",

            hint:
                "Tell me the name of your favourite place."
        },

        {
            question:
                "Where is this place?",

            hint:
                "Tell me where your favourite place is."
        },

        {
            question:
                "What do you like about this place?",

            hint:
                "Tell me one thing you like about it."
        },

        {
            question:
                "Why do you like this place?",

            hint:
                "Tell me why this place is special to you."
        }
    ];


    /* =========================================
       GET QUESTIONS FROM CONTENT
    ========================================= */

    const questions =
        content?.activities?.[2]?.questions?.length
            ? content.activities[2].questions
            : defaultQuestions;


    /* =========================================
       TEACHER IMAGES
    ========================================= */

    const teacherImages = [
        teacher1,
        teacher2,
        teacher3,
        teacher4
    ];


    /* =========================================
       STATES
    ========================================= */

    const [
        currentQuestion,
        setCurrentQuestion
    ] = useState(0);


    const [
        answer,
        setAnswer
    ] = useState("");


    const [
        isListening,
        setIsListening
    ] = useState(false);


    const [
        isSpeaking,
        setIsSpeaking
    ] = useState(false);


    const [
        feedback,
        setFeedback
    ] = useState("");


    const [
        feedbackType,
        setFeedbackType
    ] = useState("");


    const [
        completed,
        setCompleted
    ] = useState(false);


    const [
        isProcessing,
        setIsProcessing
    ] = useState(false);


    /* =========================================
       REFS
    ========================================= */

    const recognitionRef =
        useRef(null);


    const soundRef =
        useRef(null);


    const nextTimerRef =
        useRef(null);


    const mountedRef =
        useRef(true);


    const confettiFrameRef =
        useRef(null);


    /*
       IMPORTANT

       Agar user Back/Skip karta hai,
       to koi pending API / voice callback
       activity ko continue nahi karega.
    */

    const isLeavingRef =
        useRef(false);


    /* =========================================
       CURRENT QUESTION
    ========================================= */

    const question =
        questions[currentQuestion];


    /* =========================================
       CLEANUP
    ========================================= */

    useEffect(() => {

        mountedRef.current = true;

        isLeavingRef.current = false;


        return () => {

            mountedRef.current = false;

            isLeavingRef.current = true;


            /* Stop teacher voice */

            if (
                window.speechSynthesis
            ) {

                window.speechSynthesis.cancel();

            }


            /* Stop recognition */

            if (
                recognitionRef.current
            ) {

                try {

                    recognitionRef.current.stop();

                } catch (error) {

                    console.log(
                        "Recognition cleanup error:",
                        error
                    );

                }

                recognitionRef.current =
                    null;

            }


            /* Stop yay sound */

            if (
                soundRef.current
            ) {

                soundRef.current.pause();

                soundRef.current.currentTime =
                    0;

                soundRef.current =
                    null;

            }


            /* Clear next timer */

            if (
                nextTimerRef.current
            ) {

                clearTimeout(
                    nextTimerRef.current
                );

                nextTimerRef.current =
                    null;

            }


            /* Stop confetti */

            if (
                confettiFrameRef.current
            ) {

                cancelAnimationFrame(
                    confettiFrameRef.current
                );

                confettiFrameRef.current =
                    null;

            }

        };

    }, []);


    /* =========================================
       GET FEMALE TEACHER VOICE
    ========================================= */

    const getTeacherVoice = () => {

        if (
            !window.speechSynthesis
        ) {

            return null;

        }


        const voices =
            window.speechSynthesis.getVoices();


        return (

            voices.find(
                voice =>
                    /Google UK English Female/i
                        .test(
                            voice.name
                        )
            )

            ||

            voices.find(
                voice =>
                    /Google US English/i
                        .test(
                            voice.name
                        )
            )

            ||

            voices.find(
                voice =>
                    /Microsoft.*Jenny/i
                        .test(
                            voice.name
                        )
            )

            ||

            voices.find(
                voice =>
                    /Microsoft.*Aria/i
                        .test(
                            voice.name
                        )
            )

            ||

            voices.find(
                voice =>
                    /Samantha/i
                        .test(
                            voice.name
                        )
            )

            ||

            voices.find(
                voice =>
                    /Zira/i
                        .test(
                            voice.name
                        )
            )

            ||

            null

        );

    };


    /* =========================================
       SPEAK TEACHER
       CALLBACK ONLY AFTER VOICE FINISHES
    ========================================= */

    const speakTeacher = (
        text,
        callback
    ) => {

        if (
            !text ||
            isLeavingRef.current ||
            !mountedRef.current
        ) {

            if (callback) {
                callback();
            }

            return;

        }


        if (
            !window.speechSynthesis
        ) {

            if (callback) {
                callback();
            }

            return;

        }


        window.speechSynthesis.cancel();


        const speech =
            new SpeechSynthesisUtterance(
                text
            );


        const voice =
            getTeacherVoice();


        if (voice) {

            speech.voice =
                voice;

        }


        speech.lang =
            "en-US";


        speech.rate =
            0.88;


        speech.pitch =
            1.08;


        speech.volume =
            1;


        let finished =
            false;


        const finishSpeech = () => {

            if (finished) {
                return;
            }


            finished = true;


            if (
                mountedRef.current &&
                !isLeavingRef.current
            ) {

                setIsSpeaking(false);

            }


            if (
                callback &&
                mountedRef.current &&
                !isLeavingRef.current
            ) {

                callback();

            }

        };


        speech.onstart = () => {

            if (
                mountedRef.current &&
                !isLeavingRef.current
            ) {

                setIsSpeaking(true);

            }

        };


        speech.onend =
            finishSpeech;


        speech.onerror =
            finishSpeech;


        if (
            !isLeavingRef.current &&
            mountedRef.current
        ) {

            window.speechSynthesis.speak(
                speech
            );

        }

    };


    /* =========================================
       AUTO SPEAK QUESTION
    ========================================= */

    useEffect(() => {

        if (
            !question ||
            completed ||
            isLeavingRef.current
        ) {

            return;

        }


        const timer =
            setTimeout(() => {

                if (
                    mountedRef.current &&
                    !isLeavingRef.current
                ) {

                    speakTeacher(
                        question.question
                    );

                }

            }, 500);


        return () => {

            clearTimeout(timer);

        };

    }, [
        currentQuestion,
        completed
    ]);


    /* =========================================
       PLAY SUCCESS SOUND
       WAITS UNTIL AUDIO FINISHES
    ========================================= */

    const playCorrectSound =
        (callback) => {

            if (
                !mountedRef.current ||
                isLeavingRef.current
            ) {

                return;

            }


            try {

                if (
                    soundRef.current
                ) {

                    soundRef.current.pause();

                    soundRef.current.currentTime =
                        0;

                    soundRef.current =
                        null;

                }


                const audio =
                    new Audio(yaySound);


                audio.volume =
                    1;


                soundRef.current =
                    audio;


                let finished =
                    false;


                const finish = () => {

                    if (finished) {
                        return;
                    }


                    finished = true;


                    audio.onended =
                        null;

                    audio.onerror =
                        null;


                    if (
                        soundRef.current ===
                        audio
                    ) {

                        soundRef.current =
                            null;

                    }


                    if (
                        callback &&
                        mountedRef.current &&
                        !isLeavingRef.current
                    ) {

                        callback();

                    }

                };


                audio.onended =
                    finish;


                audio.onerror =
                    finish;


                const playPromise =
                    audio.play();


                if (
                    playPromise &&
                    typeof playPromise.catch ===
                        "function"
                ) {

                    playPromise.catch(
                        () => {

                            finish();

                        }
                    );

                }

            } catch (error) {

                console.log(
                    "Sound error:",
                    error
                );


                if (
                    callback &&
                    mountedRef.current &&
                    !isLeavingRef.current
                ) {

                    callback();

                }

            }

        };


    /* =========================================
       CONFETTI
    ========================================= */

    const triggerConfetti = () => {

        if (
            !mountedRef.current ||
            isLeavingRef.current
        ) {

            return;

        }


        const duration =
            1800;


        const end =
            Date.now() + duration;


        const frame = () => {

            if (
                !mountedRef.current ||
                isLeavingRef.current
            ) {

                confettiFrameRef.current =
                    null;

                return;

            }


            confetti({

                particleCount:
                    7,

                angle:
                    60,

                spread:
                    70,

                origin: {
                    x: 0
                }

            });


            confetti({

                particleCount:
                    7,

                angle:
                    120,

                spread:
                    70,

                origin: {
                    x: 1
                }

            });


            if (
                Date.now() < end &&
                mountedRef.current &&
                !isLeavingRef.current
            ) {

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
       START VOICE RECOGNITION
    ========================================= */

    const startListening = () => {

        if (
            isListening ||
            isProcessing ||
            completed ||
            isLeavingRef.current
        ) {

            return;

        }


        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if (!SpeechRecognition) {

            setFeedbackType(
                "error"
            );


            setFeedback(
                "Voice recognition is not supported in this browser. Please use Google Chrome or type your answer."
            );


            return;

        }


        window.speechSynthesis?.cancel();


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


        setIsListening(true);


        setFeedbackType(
            "listening"
        );


        setFeedback(
            "I'm listening... Please answer in English."
        );


        recognition.onstart = () => {

            if (
                mountedRef.current &&
                !isLeavingRef.current
            ) {

                setIsListening(true);

            }

        };


        recognition.onresult =
            event => {

                if (
                    !mountedRef.current ||
                    isLeavingRef.current
                ) {

                    return;

                }


                const spokenText =
                    event.results?.[0]?.[0]
                        ?.transcript || "";


                if (!spokenText) {

                    return;

                }


                setAnswer(
                    spokenText
                );


                setIsListening(false);


                setFeedbackType(
                    "heard"
                );


                setFeedback(
                    "Great! I heard you. Now checking your answer..."
                );


                checkAnswer(
                    spokenText
                );

            };


        recognition.onerror =
            event => {

                console.log(
                    "Speech recognition error:",
                    event.error
                );


                if (
                    !mountedRef.current ||
                    isLeavingRef.current
                ) {

                    return;

                }


                setIsListening(false);


                if (
                    event.error ===
                    "no-speech"
                ) {

                    const message =
                        "Sorry, I couldn't hear you. Please try again and speak clearly.";


                    setFeedbackType(
                        "try-again"
                    );


                    setFeedback(
                        message
                    );


                    speakTeacher(
                        message
                    );

                }

                else {

                    const message =
                        "I couldn't understand that. Please try speaking again in English.";


                    setFeedbackType(
                        "try-again"
                    );


                    setFeedback(
                        message
                    );


                    speakTeacher(
                        message
                    );

                }

            };


        recognition.onend = () => {

            if (
                mountedRef.current &&
                !isLeavingRef.current
            ) {

                setIsListening(false);

            }

        };


        try {

            recognition.start();

        } catch (error) {

            console.log(
                "Recognition start error:",
                error
            );


            if (
                mountedRef.current &&
                !isLeavingRef.current
            ) {

                setIsListening(false);

            }

        }

    };


    /* =========================================
       CHECK ANSWER WITH BACKEND
    ========================================= */

    const checkAnswer =
        async (
            submittedAnswer
        ) => {

            const cleanedAnswer =
                String(
                    submittedAnswer || ""
                ).trim();


            if (
                !cleanedAnswer ||
                !question ||
                isProcessing ||
                completed ||
                isLeavingRef.current
            ) {

                return;

            }


            setIsProcessing(true);


            setFeedbackType(
                "checking"
            );


            setFeedback(
                "Let me check your answer..."
            );


            try {

                const response =
                    await fetch(
                       `${import.meta.env.VITE_API_URL}/api/favourite-place/activity3`,
                        {
                            method:
                                "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    question:
                                        question.question ||
                                        "",

                                    hint:
                                        question.hint ||
                                        "",

                                    message:
                                        cleanedAnswer,

                                    userAnswer:
                                        cleanedAnswer,

                                    userName:
                                        userName ||
                                        "Student",

                                    topicId:
                                        topicId ||
                                        "",

                                    lessonId:
                                        lessonId ||
                                        "",

                                    activity:
                                        "Favourite Place Activity 3",

                                    context:
                                        "The student is answering questions about their favourite place. The AI teacher must behave like a real English teacher. Check whether the answer is relevant to the current question and topic. If the student uses another language, Roman Urdu, Roman Hindi, Urdu, Hindi, or mixed language, politely ask them to try again in English. If the answer is unrelated or off-topic, remind the student of the exact question and ask them to answer about their favourite place. If the answer has grammar mistakes but the meaning is relevant, kindly explain the mistake and give a corrected natural English version, then ask the student to try again. If the answer is correct and relevant, praise the student positively and briefly. Do not go off-topic. Stay focused on the current favourite-place question."

                                })
                        }
                    );


                const data =
                    await response.json();


                /* =====================================
                   IMPORTANT BACK / SKIP GUARD

                   Agar user Back/Skip kar chuka hai,
                   API response ko ignore karo.
                ===================================== */

                if (
                    !mountedRef.current ||
                    isLeavingRef.current
                ) {

                    return;

                }


                if (
                    !response.ok
                ) {

                    throw new Error(
                        data?.message ||
                        "Backend request failed."
                    );

                }


                const teacherResponse =
                    data.teacherResponse ||
                    data.feedback ||
                    "Let's check your answer again.";


                const isCorrect =
                    data.isCorrect === true;


                const correctedAnswer =
                    data.correctedAnswer ||
                    data.correctAnswer ||
                    "";


                /* =====================================
                   CORRECT ANSWER
                ===================================== */

                if (isCorrect) {

                    if (
                        !mountedRef.current ||
                        isLeavingRef.current
                    ) {

                        return;

                    }


                    setFeedbackType(
                        "success"
                    );


                    setFeedback(
                        teacherResponse
                    );


                    /*
                       CONFETTI STARTS
                    */

                    triggerConfetti();


                    /*
                       YAY SOUND STARTS

                       YAY finish hone ke baad
                       teacher remark start hoga.
                    */

                    playCorrectSound(
                        () => {

                            if (
                                !mountedRef.current ||
                                isLeavingRef.current
                            ) {

                                return;

                            }


                            /*
                               Teacher remark
                               starts only AFTER
                               yay sound finishes.
                            */

                            speakTeacher(

                                teacherResponse,

                                () => {

                                    if (
                                        !mountedRef.current ||
                                        isLeavingRef.current
                                    ) {

                                        return;

                                    }


                                    /*
                                       Teacher voice
                                       completely finished.

                                       Then 400ms pause.
                                    */

                                    nextTimerRef.current =
                                        setTimeout(
                                            () => {

                                                if (
                                                    !mountedRef.current ||
                                                    isLeavingRef.current
                                                ) {

                                                    return;

                                                }


                                                nextTimerRef.current =
                                                    null;


                                                goToNextQuestion();

                                            },
                                            400
                                        );

                                }

                            );

                        }
                    );


                    return;

                }


                /* =====================================
                   WRONG / GRAMMAR / LANGUAGE /
                   OFF TOPIC
                ===================================== */

                let finalFeedback =
                    teacherResponse;


                if (
                    correctedAnswer &&
                    !teacherResponse
                ) {

                    finalFeedback =
                        `Good try! A better English answer would be: ${correctedAnswer}. Please try again.`;

                }


                if (
                    !mountedRef.current ||
                    isLeavingRef.current
                ) {

                    return;

                }


                setFeedbackType(
                    "try-again"
                );


                setFeedback(
                    finalFeedback
                );


                speakTeacher(
                    finalFeedback
                );


                setIsProcessing(
                    false
                );

            }

            catch (error) {

                console.error(
                    "Favourite Place Activity 3 API Error:",
                    error
                );


                if (
                    !mountedRef.current ||
                    isLeavingRef.current
                ) {

                    return;

                }


                setFeedbackType(
                    "error"
                );


                setFeedback(
                    "Sorry, I couldn't check your answer right now. Please try again."
                );


                speakTeacher(
                    "Sorry, I couldn't check your answer right now. Please try again."
                );


                setIsProcessing(
                    false
                );

            }

        };


    /* =========================================
       SUBMIT ANSWER
    ========================================= */

    const submitAnswer = () => {

        if (
            isLeavingRef.current
        ) {

            return;

        }


        const trimmedAnswer =
            answer.trim();


        if (!trimmedAnswer) {

            setFeedbackType(
                "try-again"
            );


            setFeedback(
                "Please answer the question first."
            );


            speakTeacher(
                "Please answer the question first."
            );


            return;

        }


        checkAnswer(
            trimmedAnswer
        );

    };


    /* =========================================
       LISTEN QUESTION AGAIN
    ========================================= */

    const repeatQuestion = () => {

        if (
            isListening ||
            isProcessing ||
            completed ||
            isLeavingRef.current
        ) {

            return;

        }


        if (
            !question?.question
        ) {

            return;

        }


        setFeedbackType(
            "question"
        );


        setFeedback(
            "Listen carefully and answer in English."
        );


        speakTeacher(
            question.question
        );

    };


    /* =========================================
       NEXT QUESTION
    ========================================= */

    const goToNextQuestion = () => {

        if (
            !mountedRef.current ||
            isLeavingRef.current
        ) {

            return;

        }


        window.speechSynthesis?.cancel();


        if (
            currentQuestion <
            questions.length - 1
        ) {

            setCurrentQuestion(
                previousQuestion =>
                    previousQuestion + 1
            );


            setAnswer("");


            setFeedback("");


            setFeedbackType("");


            setIsProcessing(
                false
            );


            setIsListening(
                false
            );


            setIsSpeaking(
                false
            );


            return;

        }


        /* =====================================
           ALL QUESTIONS COMPLETED
        ===================================== */

        setCompleted(true);


        setIsProcessing(false);


        setFeedbackType(
            "success"
        );


        const finalMessage =
            "Amazing! You told me all about your favourite place! Great job!";


        setFeedback(
            finalMessage
        );


        speakTeacher(

            finalMessage,

            () => {

                if (
                    !mountedRef.current ||
                    isLeavingRef.current
                ) {

                    return;

                }


                nextTimerRef.current =
                    setTimeout(
                        () => {

                            if (
                                !mountedRef.current ||
                                isLeavingRef.current
                            ) {

                                return;

                            }


                            nextTimerRef.current =
                                null;


                            if (
                                typeof onFinish ===
                                "function"
                            ) {

                                onFinish();

                                return;

                            }


                            if (
                                typeof onNext ===
                                "function"
                            ) {

                                onNext();

                            }

                        },
                        500
                    );

            }

        );

    };


    /* =========================================
       BACK BUTTON
       ALWAYS CLICKABLE
    ========================================= */

    const handleBack = () => {

        /*
           VERY IMPORTANT:

           User is leaving the activity.
           All pending async callbacks
           must stop.
        */

        isLeavingRef.current =
            true;


        /* Stop teacher voice */

        if (
            window.speechSynthesis
        ) {

            window.speechSynthesis.cancel();

        }


        setIsSpeaking(false);


        /* Stop microphone */

        if (
            recognitionRef.current
        ) {

            try {

                recognitionRef.current.stop();

            } catch (error) {

                console.log(
                    "Recognition stop error:",
                    error
                );

            }


            recognitionRef.current =
                null;

        }


        setIsListening(false);


        /* Stop yay sound */

        if (
            soundRef.current
        ) {

            soundRef.current.pause();

            soundRef.current.currentTime =
                0;

            soundRef.current =
                null;

        }


        /* Clear next question timer */

        if (
            nextTimerRef.current
        ) {

            clearTimeout(
                nextTimerRef.current
            );

            nextTimerRef.current =
                null;

        }


        /* Stop confetti */

        if (
            confettiFrameRef.current
        ) {

            cancelAnimationFrame(
                confettiFrameRef.current
            );

            confettiFrameRef.current =
                null;

        }


        /* Reset processing */

        setIsProcessing(false);


        /*
           Finally go back.
        */

        if (
            typeof onBack ===
            "function"
        ) {

            onBack();

        }

    };


    /* =========================================
       SKIP BUTTON
    ========================================= */

    const handleSkip = () => {

        isLeavingRef.current =
            true;


        /* Stop voice */

        window.speechSynthesis?.cancel();


        setIsSpeaking(false);


        /* Stop recognition */

        if (
            recognitionRef.current
        ) {

            try {

                recognitionRef.current.stop();

            } catch (error) {

                console.log(
                    "Recognition stop error:",
                    error
                );

            }


            recognitionRef.current =
                null;

        }


        setIsListening(false);


        /* Stop timer */

        if (
            nextTimerRef.current
        ) {

            clearTimeout(
                nextTimerRef.current
            );

            nextTimerRef.current =
                null;

        }


        /* Stop sound */

        if (
            soundRef.current
        ) {

            soundRef.current.pause();

            soundRef.current.currentTime =
                0;

            soundRef.current =
                null;

        }


        /* Stop confetti */

        if (
            confettiFrameRef.current
        ) {

            cancelAnimationFrame(
                confettiFrameRef.current
            );

            confettiFrameRef.current =
                null;

        }


        setIsProcessing(false);


        if (
            typeof onFinish ===
            "function"
        ) {

            onFinish();

        }

    };


    /* =========================================
       EMPTY STATE
    ========================================= */

    if (
        !questions.length
    ) {

        return (

            <div
                className="favourite-place-activity3-page"
                style={{
                    backgroundImage:
                        `url(${chatBg})`
                }}
            >

                <div
                    className="favourite-place-activity3-overlay"
                >
                </div>


                <div
                    className="favourite-place-activity3-card"
                >

                    <div
                        className="favourite-place-empty-card"
                    >

                        <h2>
                            Activity content not found
                        </h2>


                        <button
                            type="button"
                            onClick={handleBack}
                        >
                            ← Back
                        </button>

                    </div>

                </div>

            </div>

        );

    }


    /* =========================================
       CURRENT TEACHER
    ========================================= */

    const currentTeacher =
        teacherImages[
            currentQuestion %
            teacherImages.length
        ];


    /* =========================================
       MAIN UI
    ========================================= */

    return (

        <div
            className="favourite-place-activity3-page"
            style={{
                backgroundImage:
                    `url(${chatBg})`
            }}
        >

            <div
                className="favourite-place-activity3-overlay"
            >
            </div>


            <div
                className="favourite-place-activity3-card"
            >


                {/* =====================================
                    HEADER
                ===================================== */}

                <div
                    className="fpa3-header"
                >


                    {/* BACK */}

                    <button
                        type="button"
                        className="fpa3-back-button"
                        onClick={handleBack}
                    >

                        ← Back

                    </button>


                    {/* TITLE */}

                    <div
                        className="fpa3-title-area"
                    >

                        <h1>
                            Activity 3
                        </h1>


                        <div
                            className="fpa3-title-strip"
                        >

                            Tell Me About Your Favourite Place

                        </div>

                    </div>


                    {/* SKIP */}

                    <button
                        type="button"
                        className="fpa3-skip-button"
                        onClick={handleSkip}
                        disabled={isProcessing}
                    >

                        Skip →

                    </button>

                </div>


                {/* =====================================
                    PROGRESS
                ===================================== */}

                <div
                    className="fpa3-progress"
                >

                    Question{" "}
                    {currentQuestion + 1}
                    {" / "}
                    {questions.length}

                </div>


                {/* =====================================
                    MAIN
                ===================================== */}

                <div
                    className="fpa3-main-content"
                >


                    {/* =================================
                        TEACHER
                    ================================= */}

                    <div
                        className="fpa3-teacher-section"
                    >

                        <div
                            className="fpa3-teacher-image-wrapper"
                        >

                            <img
                                src={currentTeacher}
                                alt="Teacher"
                                className={
                                    isSpeaking
                                        ? "fpa3-teacher-image speaking"
                                        : "fpa3-teacher-image"
                                }
                            />

                        </div>


                        <div
                            className={
                                feedback
                                    ? `fpa3-teacher-bubble active ${feedbackType}`
                                    : "fpa3-teacher-bubble"
                            }
                        >

                            <strong>

                                {feedbackType ===
                                "success"

                                    ? "Excellent! 🎉"

                                    : feedbackType ===
                                      "try-again"

                                        ? "Let's Try Again 💛"

                                        : feedbackType ===
                                          "checking"

                                            ? "Checking... 🤔"

                                            : isListening

                                                ? "I'm Listening 👂"

                                                : "Your Teacher 👩‍🏫"

                                }

                            </strong>


                            <p>

                                {feedback ||

                                    "Answer the question in English. Take your time!"

                                }

                            </p>

                        </div>

                    </div>


                    {/* =================================
                        QUESTION
                    ================================= */}

                    <div
                        className="fpa3-question-section"
                    >

                        <div
                            className="fpa3-question-card"
                        >


                            <div
                                className="fpa3-question-number"
                            >

                                Question{" "}
                                {currentQuestion + 1}

                            </div>


                            <h2>

                                {question.question}

                            </h2>


                            <div
                                className="fpa3-hint"
                            >

                                💡{" "}

                                {question.hint ||
                                    "Speak in a complete English sentence."
                                }

                            </div>


                            {/* =================================
                                ANSWER
                            ================================= */}

                            <textarea
                                className="fpa3-answer-box"
                                placeholder="Type your answer in English..."
                                value={answer}
                                onChange={
                                    event =>
                                        setAnswer(
                                            event.target.value
                                        )
                                }
                                disabled={
                                    isListening ||
                                    isProcessing ||
                                    completed
                                }
                            />


                            {/* =================================
                                CONTROLS
                            ================================= */}

                            <div
                                className="fpa3-controls"
                            >


                                {/* MIC */}

                                <button
                                    type="button"
                                    className={
                                        isListening
                                            ? "fpa3-mic-button listening"
                                            : "fpa3-mic-button"
                                    }
                                    onClick={
                                        startListening
                                    }
                                    disabled={
                                        isProcessing ||
                                        completed
                                    }
                                >

                                    <span
                                        className="fpa3-mic-icon"
                                    >

                                        🎤

                                    </span>


                                    <span>

                                        {isListening
                                            ? "Listening..."
                                            : "Speak Answer"
                                        }

                                    </span>

                                </button>


                                {/* SUBMIT */}

                                <button
                                    type="button"
                                    className="fpa3-submit-button"
                                    onClick={
                                        submitAnswer
                                    }
                                    disabled={
                                        isProcessing ||
                                        completed ||
                                        !answer.trim()
                                    }
                                >

                                    {isProcessing
                                        ? "Checking..."
                                        : "Submit Answer →"
                                    }

                                </button>

                            </div>


                            {/* =================================
                                REPEAT QUESTION
                            ================================= */}

                            <button
                                type="button"
                                className="fpa3-listen-button"
                                onClick={
                                    repeatQuestion
                                }
                                disabled={
                                    isListening ||
                                    isProcessing ||
                                    completed
                                }
                            >

                                🔊 Listen to Question Again

                            </button>


                            <div
                                className="fpa3-bottom-message"
                            >

                                🎤 You can speak or type your answer in English.

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default FavouritePlaceActivity3;