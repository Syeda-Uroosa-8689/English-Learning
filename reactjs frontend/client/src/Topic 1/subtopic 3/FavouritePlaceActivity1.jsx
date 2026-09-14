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

import "./FavouritePlaceActivity1.css";


/* =====================================================
   FAVOURITE PLACE - ACTIVITY 1
   TALK ABOUT YOUR FAVOURITE PLACE

   BACKEND:
   POST /api/favourite-place/activity1
===================================================== */

function FavouritePlaceActivity1({
    content,
    topicId,
    lessonId,
    userName,
    onNext,
    onBack
}) {

    /* =====================================================
       DEFAULT QUESTIONS
    ===================================================== */

    const defaultRounds = [
        {
            question:
                "What is your favourite place?"
        },

        {
            question:
                "Where is your favourite place?"
        },

        {
            question:
                "What do you like to do there?"
        },

        {
            question:
                "Why do you like this place?"
        }
    ];


    /* =====================================================
       GET CONTENT ROUNDS
    ===================================================== */

    const contentRounds =
        content?.activities?.[0]?.rounds;


    const rounds =
        contentRounds?.length
            ? contentRounds
            : defaultRounds;


    /* =====================================================
       TEACHER IMAGES
    ===================================================== */

    const teacherImages = [
        teacher1,
        teacher2,
        teacher3,
        teacher4
    ];


    /* =====================================================
       STATES
    ===================================================== */

    const [
        currentRound,
        setCurrentRound
    ] = useState(0);

    const [
        userAnswer,
        setUserAnswer
    ] = useState("");

    const [
        feedback,
        setFeedback
    ] = useState("");

    const [
        feedbackType,
        setFeedbackType
    ] = useState("");

    const [
        isSpeaking,
        setIsSpeaking
    ] = useState(false);

    const [
        isListening,
        setIsListening
    ] = useState(false);

    const [
        isAnswered,
        setIsAnswered
    ] = useState(false);

    const [
        isProcessing,
        setIsProcessing
    ] = useState(false);


    /* =====================================================
       REFS
    ===================================================== */

    const mountedRef =
        useRef(true);

    const recognitionRef =
        useRef(null);

    const nextTimerRef =
        useRef(null);

    const soundRef =
        useRef(null);

    const confettiFrameRef =
        useRef(null);


    /* =====================================================
       CURRENT ROUND
    ===================================================== */

    const round =
        rounds[currentRound];


    /* =====================================================
       REMOVE EMOJIS FROM VOICE
       
       Emojis can remain on screen.
       They will NOT be spoken by teacher.
    ===================================================== */

    const removeEmojisForSpeech = (
        text = ""
    ) => {

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
                /[\uFE0F\u200D]/g,
                ""
            )

            .replace(
                /\s+/g,
                " "
            )

            .trim();
    };


    /* =====================================================
       GET CURRENT QUESTION
    ===================================================== */

    const getCurrentQuestion = () => {

        return (
            round?.question ||
            round?.prompt ||
            round?.text ||
            ""
        );
    };


    /* =====================================================
       CLEANUP
    ===================================================== */

    useEffect(() => {

        mountedRef.current = true;

        return () => {

            mountedRef.current = false;

            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }

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

            if (nextTimerRef.current) {

                clearTimeout(
                    nextTimerRef.current
                );

                nextTimerRef.current = null;
            }

            if (soundRef.current) {

                soundRef.current.pause();

                soundRef.current.currentTime = 0;
            }

            if (confettiFrameRef.current) {

                cancelAnimationFrame(
                    confettiFrameRef.current
                );

                confettiFrameRef.current = null;
            }

        };

    }, []);


    /* =====================================================
       GET TEACHER VOICE
    ===================================================== */

    const getTeacherVoice = () => {

        if (!window.speechSynthesis) {
            return null;
        }

        const voices =
            window.speechSynthesis.getVoices();

        return (

            voices.find(
                (voice) =>
                    /Google UK English Female/i.test(
                        voice.name
                    )
            )

            ||

            voices.find(
                (voice) =>
                    /Microsoft.*Jenny/i.test(
                        voice.name
                    )
            )

            ||

            voices.find(
                (voice) =>
                    /Microsoft.*Aria/i.test(
                        voice.name
                    )
            )

            ||

            voices.find(
                (voice) =>
                    /Samantha/i.test(
                        voice.name
                    )
            )

            ||

            voices.find(
                (voice) =>
                    /Zira/i.test(
                        voice.name
                    )
            )

            ||

            null
        );
    };


    /* =====================================================
       SPEAK TEACHER
       
       IMPORTANT:
       Screen:
       Excellent! 🎉

       Voice:
       Excellent!
    ===================================================== */

    const speakTeacher = (text) => {

        if (
            !window.speechSynthesis ||
            !text
        ) {
            return;
        }

        const cleanText =
            removeEmojisForSpeech(text);

        if (!cleanText) {
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
        speech.pitch = 1.08;
        speech.volume = 1;

        speech.onstart = () => {

            if (mountedRef.current) {
                setIsSpeaking(true);
            }

        };

        speech.onend = () => {

            if (mountedRef.current) {
                setIsSpeaking(false);
            }

        };

        speech.onerror = () => {

            if (mountedRef.current) {
                setIsSpeaking(false);
            }

        };

        window.speechSynthesis.speak(
            speech
        );
    };


    /* =====================================================
       PLAY YAY SOUND
    ===================================================== */

    const playCorrectSound = () => {

        try {

            if (soundRef.current) {

                soundRef.current.pause();

                soundRef.current.currentTime = 0;
            }

            const audio =
                new Audio(yaySound);

            audio.volume = 1;

            soundRef.current =
                audio;

            audio.play().catch(
                (error) => {

                    console.log(
                        "Yay sound error:",
                        error
                    );

                }
            );

        } catch (error) {

            console.log(
                "Sound error:",
                error
            );

        }
    };


    /* =====================================================
       CONFETTI
    ===================================================== */

    const triggerConfetti = () => {

        const end =
            Date.now() + 1800;

        const frame = () => {

            if (!mountedRef.current) {
                return;
            }

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


    /* =====================================================
       STOP ALL AUDIO
    ===================================================== */

    const stopAllAudio = () => {

        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }

        if (soundRef.current) {

            soundRef.current.pause();

            soundRef.current.currentTime = 0;
        }

        if (confettiFrameRef.current) {

            cancelAnimationFrame(
                confettiFrameRef.current
            );

            confettiFrameRef.current = null;
        }
    };


    /* =====================================================
       CHECK ANSWER WITH BACKEND
    ===================================================== */

    const checkAnswer = async (
        answer
    ) => {

        if (
            !answer ||
            !round ||
            isAnswered ||
            isProcessing
        ) {
            return;
        }

        const cleanedAnswer =
            String(answer).trim();

        if (!cleanedAnswer) {
            return;
        }

        setUserAnswer(
            cleanedAnswer
        );

        setIsProcessing(true);

        setFeedback("");

        setFeedbackType("");


        try {

            const response =
                await fetch(
                    `${import.meta.env.VITE_API_URL}/api/favourite-place/activity1`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                question:
                                    getCurrentQuestion(),

                                message:
                                    cleanedAnswer,

                                context:
                                    "Favourite Place Activity 1 - Talk About Your Favourite Place.",

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
                                    "Favourite Place Activity 1"

                            })
                    }
                );


            let data;

            try {

                data =
                    await response.json();

            } catch (error) {

                throw new Error(
                    "Invalid response from backend."
                );
            }


            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    "Backend request failed."
                );
            }


            /* =================================================
               CORRECT
            ================================================= */

            if (
                data.isCorrect === true
            ) {

                setIsAnswered(true);

                setFeedbackType(
                    "success"
                );

                const teacherResponse =
                    data.teacherResponse ||
                    "Excellent! That's a great answer!";

                setFeedback(
                    teacherResponse
                );


                /* ---------------------------------------------
                   YAY + CONFETTI
                --------------------------------------------- */

                playCorrectSound();

                triggerConfetti();


                /* ---------------------------------------------
                   TEACHER SPEAKS AFTER YAY
                --------------------------------------------- */

                nextTimerRef.current =
                    setTimeout(() => {

                        if (
                            !mountedRef.current
                        ) {
                            return;
                        }

                        speakTeacher(
                            teacherResponse
                        );

                    }, 1200);


                /* ---------------------------------------------
                   NEXT ROUND
                --------------------------------------------- */

                nextTimerRef.current =
                    setTimeout(() => {

                        if (
                            !mountedRef.current
                        ) {
                            return;
                        }

                        goToNextRound();

                    }, 4000);

                return;
            }


            /* =================================================
               WRONG / RETRY
            ================================================= */

            const teacherResponse =
                data.teacherResponse ||
                "Good try! Let's try that again.";

            setFeedbackType(
                "try-again"
            );

            setFeedback(
                teacherResponse
            );

            speakTeacher(
                teacherResponse
            );

            setIsProcessing(false);

        } catch (error) {

            console.error(
                "Favourite Place Activity 1 API Error:",
                error
            );

            setFeedbackType(
                "try-again"
            );

            setFeedback(
                "Sorry, I couldn't check your answer right now. Please try again."
            );

            speakTeacher(
                "Sorry, I couldn't check your answer right now. Please try again."
            );

            setIsProcessing(false);
        }
    };


    /* =====================================================
       SPEECH RECOGNITION
    ===================================================== */

    const startListening = () => {

        if (
            isListening ||
            isAnswered ||
            isProcessing
        ) {
            return;
        }


        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if (!SpeechRecognition) {

            setFeedbackType(
                "try-again"
            );

            setFeedback(
                "Voice input is not supported in this browser. Please use Chrome."
            );

            speakTeacher(
                "Voice input is not supported in this browser. Please use Chrome."
            );

            return;
        }


        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }


        const recognition =
            new SpeechRecognition();


        recognition.lang =
            "en-US";

        recognition.interimResults =
            false;

        recognition.continuous =
            false;

        recognition.maxAlternatives =
            1;


        recognitionRef.current =
            recognition;


        setIsListening(true);

        setFeedback("");

        setFeedbackType("");


        recognition.onstart =
            () => {

                if (
                    mountedRef.current
                ) {

                    setIsListening(true);

                }

            };


        recognition.onresult =
            (event) => {

                const transcript =
                    event.results?.[0]?.[0]
                        ?.transcript || "";

                setIsListening(false);

                if (transcript) {

                    setUserAnswer(
                        transcript
                    );

                    checkAnswer(
                        transcript
                    );
                }
            };


        recognition.onerror =
            (event) => {

                console.log(
                    "Speech recognition error:",
                    event.error
                );

                if (
                    !mountedRef.current
                ) {
                    return;
                }

                setIsListening(false);

                setIsProcessing(false);


                if (
                    event.error ===
                    "no-speech"
                ) {

                    setFeedbackType(
                        "try-again"
                    );

                    setFeedback(
                        "Sorry, I couldn't hear you. Please try again."
                    );

                    speakTeacher(
                        "Sorry, I couldn't hear you. Please try again."
                    );

                } else if (
                    event.error ===
                    "aborted"
                ) {

                    return;

                } else {

                    setFeedbackType(
                        "try-again"
                    );

                    setFeedback(
                        "I couldn't hear you clearly. Please try again."
                    );

                    speakTeacher(
                        "I couldn't hear you clearly. Please try again."
                    );
                }
            };


        recognition.onend =
            () => {

                if (
                    mountedRef.current
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

            setIsListening(false);

            setIsProcessing(false);
        }
    };


    /* =====================================================
       ASK QUESTION
    ===================================================== */

    const askQuestion = () => {

        const questionText =
            getCurrentQuestion();

        if (!questionText) {
            return;
        }

        setFeedbackType(
            "question"
        );

        setFeedback(
            questionText
        );

        speakTeacher(
            questionText
        );
    };


    /* =====================================================
       AUTO ASK QUESTION
    ===================================================== */

    useEffect(() => {

        if (!round) {
            return;
        }

        setUserAnswer("");

        setFeedback("");

        setFeedbackType("");

        setIsAnswered(false);

        setIsProcessing(false);

        setIsListening(false);


        const timer =
            setTimeout(() => {

                askQuestion();

            }, 700);


        return () => {

            clearTimeout(timer);

            if (
                window.speechSynthesis
            ) {

                window.speechSynthesis.cancel();
            }
        };

    }, [currentRound]);


    /* =====================================================
       NEXT ROUND
    ===================================================== */

    const goToNextRound = () => {

        if (nextTimerRef.current) {

            clearTimeout(
                nextTimerRef.current
            );

            nextTimerRef.current = null;
        }

        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }


        if (
            currentRound <
            rounds.length - 1
        ) {

            setCurrentRound(
                (previousRound) =>
                    previousRound + 1
            );

            return;
        }


        if (
            typeof onNext ===
            "function"
        ) {

            onNext();
        }
    };


    /* =====================================================
       BACK BUTTON
       
       IMPORTANT:
       Activity 1 Back:
       currentStep = 1
       FavouritePlaceFlow.handleBack()
       -> currentStep = 0
       -> Activity 1 Intro
    ===================================================== */

    const handleBack = () => {

        console.log(
            "FavouritePlaceActivity1: BACK CLICKED"
        );


        /* Stop teacher voice */
        if (window.speechSynthesis) {

            window.speechSynthesis.cancel();
        }


        /* Stop microphone */
        if (recognitionRef.current) {

            try {

                recognitionRef.current.onresult =
                    null;

                recognitionRef.current.onerror =
                    null;

                recognitionRef.current.onend =
                    null;

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


        /* Stop yay sound */
        if (soundRef.current) {

            try {

                soundRef.current.pause();

                soundRef.current.currentTime =
                    0;

            } catch (error) {

                console.log(
                    "Audio stop error:",
                    error
                );
            }
        }


        /* Stop confetti */
        if (confettiFrameRef.current) {

            cancelAnimationFrame(
                confettiFrameRef.current
            );

            confettiFrameRef.current =
                null;
        }


        /* Clear automatic next */
        if (nextTimerRef.current) {

            clearTimeout(
                nextTimerRef.current
            );

            nextTimerRef.current =
                null;
        }


        /* Reset local state */
        setIsListening(false);

        setIsProcessing(false);

        setIsAnswered(false);


        /* =============================================
           VERY IMPORTANT

           Parent FavouritePlaceFlow receives this.

           currentStep 1 -> currentStep 0
        ============================================= */

        if (
            typeof onBack ===
            "function"
        ) {

            onBack();

        } else {

            console.error(
                "FavouritePlaceActivity1: onBack prop is missing."
            );
        }
    };


    /* =====================================================
       SKIP
    ===================================================== */

    const handleSkip = () => {

        stopAllAudio();


        if (recognitionRef.current) {

            try {

                recognitionRef.current.onresult =
                    null;

                recognitionRef.current.onerror =
                    null;

                recognitionRef.current.onend =
                    null;

                recognitionRef.current.stop();

            } catch (error) {

                console.log(error);
            }

            recognitionRef.current =
                null;
        }


        if (nextTimerRef.current) {

            clearTimeout(
                nextTimerRef.current
            );

            nextTimerRef.current =
                null;
        }


        setIsListening(false);

        setIsProcessing(false);


        if (
            typeof onNext ===
            "function"
        ) {

            onNext();
        }
    };


    /* =====================================================
       EMPTY STATE
    ===================================================== */

    if (!rounds.length) {

        return (

            <div
                className="favourite-place-activity1-page"
                style={{
                    backgroundImage:
                        `url(${chatBg})`
                }}
            >

                <div className="favourite-place-empty-card">

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
        );
    }


    /* =====================================================
       CURRENT TEACHER
    ===================================================== */

    const currentTeacher =
        teacherImages[
            currentRound %
            teacherImages.length
        ];


    /* =====================================================
       MAIN UI
    ===================================================== */

    return (

        <div
            className="favourite-place-activity1-page"
            style={{
                backgroundImage:
                    `url(${chatBg})`
            }}
        >

            <div className="favourite-place-activity1-overlay">
            </div>


            <div className="favourite-place-activity1-card">


                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="fpa1-header">

                    <button
                        type="button"
                        className="fpa1-back-button"
                        onClick={handleBack}
                    >
                        ← Back
                    </button>


                    <div className="fpa1-title-area">

                        <h1>
                            Activity 1
                        </h1>

                        <div className="fpa1-title-strip">

                            Talk About Your Favourite Place

                        </div>

                    </div>


                    <button
                        type="button"
                        className="fpa1-skip-button"
                        onClick={handleSkip}
                    >
                        Skip →
                    </button>

                </div>


                {/* =================================================
                   PROGRESS
                ================================================= */}

                <div className="fpa1-progress">

                    Question{" "}

                    {currentRound + 1}

                    {" / "}

                    {rounds.length}

                </div>


                {/* =================================================
                   MAIN CONTENT
                ================================================= */}

                <div className="fpa1-main-content">


                    {/* =================================================
                       TEACHER
                    ================================================= */}

                    <div className="fpa1-teacher-section">

                        <div className="fpa1-teacher-image-wrapper">

                            <img
                                src={currentTeacher}
                                alt="Teacher"
                                className={
                                    isSpeaking
                                        ? "fpa1-teacher-image speaking"
                                        : "fpa1-teacher-image"
                                }
                            />

                        </div>


                        <div
                            className={
                                feedback
                                    ? `fpa1-teacher-bubble ${feedbackType}`
                                    : "fpa1-teacher-bubble"
                            }
                        >

                            <strong>

                                {feedbackType ===
                                "success"

                                    ? "Excellent! 🎉"

                                    : feedbackType ===
                                      "try-again"

                                        ? "Try Again 💛"

                                        : "Teacher 👩‍🏫"

                                }

                            </strong>


                            <p>

                                {feedback ||

                                    "Answer the question about your favourite place."

                                }

                            </p>

                        </div>

                    </div>


                    {/* =================================================
                       QUESTION
                    ================================================= */}

                    <div className="fpa1-question-section">

                        <div className="fpa1-question-card">


                            <div className="fpa1-question-number">

                                Question{" "}

                                {currentRound + 1}

                            </div>


                            <h2>

                                {getCurrentQuestion()}

                            </h2>


                            {/* =================================================
                               ANSWER BOX
                            ================================================= */}

                            <div className="fpa1-answer-box">

                                <div className="fpa1-answer-label">

                                    Your Answer

                                </div>


                                <div
                                    className={
                                        userAnswer
                                            ? "fpa1-answer-text filled"
                                            : "fpa1-answer-text"
                                    }
                                >

                                    {userAnswer ||

                                        "Your spoken answer will appear here..."

                                    }

                                </div>

                            </div>


                            {/* =================================================
                               MIC BUTTON
                            ================================================= */}

                            <button
                                type="button"
                                className={
                                    isListening
                                        ? "fpa1-mic-button listening"
                                        : "fpa1-mic-button"
                                }
                                onClick={
                                    startListening
                                }
                                disabled={
                                    isListening ||
                                    isAnswered ||
                                    isProcessing
                                }
                            >

                                <span className="fpa1-mic-icon">

                                    🎙️

                                </span>


                                <span>

                                    {isProcessing

                                        ? "Checking..."

                                        : isListening

                                            ? "Listening..."

                                            : "Tap to Answer"

                                    }

                                </span>

                            </button>


                            {/* =================================================
                               LISTEN QUESTION AGAIN
                            ================================================= */}

                            <button
                                type="button"
                                className="fpa1-listen-button"
                                onClick={
                                    askQuestion
                                }
                                disabled={
                                    isListening ||
                                    isProcessing ||
                                    isAnswered
                                }
                            >

                                🔊 Listen to Question Again

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default FavouritePlaceActivity1;