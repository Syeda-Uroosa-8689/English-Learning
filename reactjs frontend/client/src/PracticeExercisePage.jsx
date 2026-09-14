import React, {
    useEffect,
    useState,
    useRef
} from "react";

import teacher from "./assets/teacher1.png";
import waiterImg from "./assets/waiter.png";
import yaySound from "./assets/yay.mp3";

import confetti from "canvas-confetti";


function PracticeExercisePage({

    data,
    current,
    total,
    onNext,
    onSkip,
    onBack

}) {


    /* ==========================================
                    STATES
    ========================================== */

    const [teacherText, setTeacherText] =
        useState("");

    const [words, setWords] =
        useState([]);

    const [filledSentence, setFilledSentence] =
        useState([
            ...data.sentenceStructure
        ]);

    const [celebrating, setCelebrating] =
        useState(false);


    /* ==========================================
                    REFS
    ========================================== */

    const speechTimerRef =
        useRef(null);

    const nextTimerRef =
        useRef(null);

    const confettiFrameRef =
        useRef(null);

    const isMountedRef =
        useRef(true);

    const isProcessingRef =
        useRef(false);

    const audioRef =
        useRef(null);


    /* ==========================================
                    CLEAR ALL
    ========================================== */

    const clearAllTimers = () => {

        if (speechTimerRef.current) {

            clearTimeout(
                speechTimerRef.current
            );

            speechTimerRef.current =
                null;

        }


        if (nextTimerRef.current) {

            clearTimeout(
                nextTimerRef.current
            );

            nextTimerRef.current =
                null;

        }

    };


    /* ==========================================
                    STOP CONFETTI
    ========================================== */

    const stopConfetti = () => {

        if (confettiFrameRef.current) {

            cancelAnimationFrame(
                confettiFrameRef.current
            );

            confettiFrameRef.current =
                null;

        }

    };


    /* ==========================================
                    STOP AUDIO
    ========================================== */

    const stopAudio = () => {

        if (audioRef.current) {

            audioRef.current.pause();

            audioRef.current.currentTime = 0;

            audioRef.current =
                null;

        }

    };


    /* ==========================================
                    MOUNT / UNMOUNT
    ========================================== */

    useEffect(() => {

        isMountedRef.current = true;


        return () => {

            isMountedRef.current = false;

            clearAllTimers();

            stopConfetti();

            stopAudio();

            window.speechSynthesis.cancel();

        };

    }, []);


    /* ==========================================
                FIND WAITER VOICE
    ========================================== */

    const getWaiterVoice = () => {

        const voices =
            window.speechSynthesis.getVoices();

        return (

            voices.find(v =>
                /Google UK English Male/i.test(
                    v.name
                )
            )

            ||

            voices.find(v =>
                /Google US English Male/i.test(
                    v.name
                )
            )

            ||

            voices.find(v =>
                /Microsoft.*Guy/i.test(
                    v.name
                )
            )

            ||

            voices.find(v =>
                /Microsoft.*Ryan/i.test(
                    v.name
                )
            )

            ||

            voices.find(v =>
                /Daniel/i.test(
                    v.name
                )
            )

            ||

            voices.find(v =>
                /Alex/i.test(
                    v.name
                )
            )

            ||

            voices.find(v =>
                /English.*Male/i.test(
                    v.name
                )
            )

            ||

            null

        );

    };


    /* ==========================================
                FIND TEACHER VOICE
    ========================================== */

    const getTeacherVoice = () => {

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

            null

        );

    };


    /* ==========================================
                    WAITER VOICE
    ========================================== */

    const speakWaiter = (text) => {

        if (
            !window.speechSynthesis ||
            !text
        ) {

            return;

        }


        window.speechSynthesis.cancel();


        const speech =
            new SpeechSynthesisUtterance(
                text
            );


        speech.lang = "en-US";

        speech.rate = 0.95;

        speech.pitch = 1;

        speech.volume = 1;


        const waiterVoice =
            getWaiterVoice();


        if (waiterVoice) {

            speech.voice =
                waiterVoice;

        }


        window.speechSynthesis.speak(
            speech
        );

    };


    /* ==========================================
                    TEACHER VOICE
    ========================================== */

    const speakTeacher = (
        text,
        callback
    ) => {

        if (
            !window.speechSynthesis ||
            !text
        ) {

            callback?.();

            return;

        }


        window.speechSynthesis.cancel();


        const speech =
            new SpeechSynthesisUtterance(
                text
            );


        speech.lang = "en-US";

        /* Faster teacher speech */

        speech.rate = 1.05;

        speech.pitch = 1.05;

        speech.volume = 1;


        const teacherVoice =
            getTeacherVoice();


        if (teacherVoice) {

            speech.voice =
                teacherVoice;

        }


        const finishSpeech = () => {

            if (
                !isMountedRef.current
            ) {

                return;

            }


            callback?.();

        };


        speech.onend =
            finishSpeech;

        speech.onerror =
            finishSpeech;


        window.speechSynthesis.speak(
            speech
        );

    };


    /* ==========================================
                    CONFETTI
                    FASTER
    ========================================== */

    const playConfetti = () => {

        if (
            !isMountedRef.current
        ) {

            return;

        }


        /* Earlier: 1800ms
           Now: 1000ms */

        const duration =
            1000;


        const end =
            Date.now() + duration;


        const frame = () => {

            if (
                !isMountedRef.current
            ) {

                return;

            }


            confetti({

                particleCount: 4,

                spread: 65,

                startVelocity: 30,

                origin: {

                    x: Math.random(),

                    y:
                        Math.random() * 0.5

                }

            });


            if (
                Date.now() < end
            ) {

                confettiFrameRef.current =
                    requestAnimationFrame(
                        frame
                    );

            }

            else {

                confettiFrameRef.current =
                    null;

            }

        };


        frame();

    };


    /* ==========================================
                    YAY SOUND
    ========================================== */

    const playYaySound = (
        callback
    ) => {

        if (
            !isMountedRef.current
        ) {

            return;

        }


        const audio =
            new Audio(yaySound);


        audioRef.current =
            audio;


        audio.volume =
            1;


        let finished =
            false;


        const finishSound = () => {

            if (finished) {

                return;

            }


            finished =
                true;


            audio.onended =
                null;

            audio.onerror =
                null;


            if (
                audioRef.current ===
                audio
            ) {

                audioRef.current =
                    null;

            }


            if (
                isMountedRef.current &&
                callback
            ) {

                callback();

            }

        };


        audio.onended =
            finishSound;

        audio.onerror =
            finishSound;


        audio.play().catch(
            finishSound
        );

    };


    /* ==========================================
            CORRECT CELEBRATION
    ========================================== */

    const celebrateCorrectSentence = () => {

        if (
            !isMountedRef.current ||
            isProcessingRef.current
        ) {

            return;

        }


        /* Prevent double next */

        isProcessingRef.current =
            true;


        setCelebrating(
            true
        );


        setTeacherText(
            "Excellent! Correct sentence. ✨"
        );


        /*
            STEP 1
            CONFETTI + YAY TOGETHER
        */

        playConfetti();


        playYaySound(() => {

            if (
                !isMountedRef.current
            ) {

                return;

            }


            /*
                STEP 2
                YAY COMPLETE
                → Teacher speaks
            */

            speakTeacher(

                "Excellent! Correct sentence.",

                () => {

                    if (
                        !isMountedRef.current
                    ) {

                        return;

                    }


                    /*
                        Small transition delay
                        Earlier: 200ms
                        Now: 100ms
                    */

                    nextTimerRef.current =
                        setTimeout(() => {

                            if (
                                !isMountedRef.current
                            ) {

                                return;

                            }


                            setCelebrating(
                                false
                            );


                            isProcessingRef.current =
                                false;


                            onNext?.();

                        }, 100);

                }

            );

        });

    };


    /* ==========================================
                    LOAD EXERCISE
    ========================================== */

    useEffect(() => {

        clearAllTimers();

        stopConfetti();


        isProcessingRef.current =
            false;


        setTeacherText(
            ""
        );


        setWords(
            [...data.options]
        );


        setFilledSentence(
            [
                ...data.sentenceStructure
            ]
        );


        setCelebrating(
            false
        );


        speakWaiter(
            data.waiter
        );


        return () => {

            window.speechSynthesis.cancel();

            clearAllTimers();

        };

    }, [data]);


    /* ==========================================
                    DRAG START
    ========================================== */

    const handleDragStart = (
        e,
        word
    ) => {

        if (
            celebrating
        ) {

            return;

        }


        e.dataTransfer.setData(
            "word",
            word
        );

    };


    /* ==========================================
                    DROP
    ========================================== */

    const handleDrop = (
        e,
        index
    ) => {

        e.preventDefault();


        if (
            celebrating ||
            isProcessingRef.current
        ) {

            return;

        }


        const word =
            e.dataTransfer.getData(
                "word"
            );


        if (!word) {

            return;

        }


        if (
            filledSentence[index] !==
            "____"
        ) {

            return;

        }


        const newSentence =
            [...filledSentence];


        newSentence[index] =
            word;


        setFilledSentence(
            newSentence
        );


        setWords(

            words.filter(
                w => w !== word
            )

        );


        /* ======================================
                    CHECK ANSWER
        ====================================== */

        if (
            !newSentence.includes(
                "____"
            )
        ) {


            const correctFilledWords =
                data.sentenceStructure.map(
                    (
                        part,
                        i
                    ) => {

                        if (
                            part ===
                            "____"
                        ) {

                            const blankIndex =
                                data
                                    .sentenceStructure
                                    .slice(
                                        0,
                                        i
                                    )
                                    .filter(
                                        x =>
                                            x ===
                                            "____"
                                    ).length;


                            return data
                                .correctWords[
                                    blankIndex
                                ];

                        }


                        return part;

                    }
                );


            const correctSentence =
                correctFilledWords.join(
                    " "
                );


            const isCorrect =
                newSentence.every(
                    (
                        part,
                        i
                    ) =>

                        part
                            .toLowerCase() ===

                        correctFilledWords[
                            i
                        ]
                            .toLowerCase()
                );


            /* ==================================
                    CORRECT
            ================================== */

            if (
                isCorrect
            ) {

                celebrateCorrectSentence();

            }


            /* ==================================
                    WRONG
            ================================== */

            else {


                const wrongMessage =
                    `Oops! Try again. The correct sentence is: ${correctSentence}`;


                setTeacherText(
                    wrongMessage
                );


                speakTeacher(
                    wrongMessage
                );


                speechTimerRef.current =
                    setTimeout(() => {

                        if (
                            !isMountedRef.current
                        ) {

                            return;

                        }


                        setTeacherText(
                            ""
                        );


                        setWords(
                            [
                                ...data.options
                            ]
                        );


                        setFilledSentence(
                            [
                                ...data.sentenceStructure
                            ]
                        );

                    }, 1200);

            }

        }

    };


    /* ==========================================
                    BACK
    ========================================== */

    const handleBack = () => {

        if (
            celebrating
        ) {

            return;

        }


        clearAllTimers();

        stopConfetti();

        stopAudio();


        window.speechSynthesis.cancel();


        onBack?.();

    };


    /* ==========================================
                    SKIP
    ========================================== */

    const handleSkip = () => {

        if (
            celebrating
        ) {

            return;

        }


        clearAllTimers();

        stopConfetti();

        stopAudio();


        window.speechSynthesis.cancel();


        onSkip?.();

    };


    /* ==========================================
                    PROGRESS
    ========================================== */

    const progress =
        (current / total) * 100;


    return (

        <div className="practice-exercise-page">


            <button
                className="practice-back-btn"
                onClick={handleBack}
                disabled={celebrating}
            >

                ← Back

            </button>


            <button
                className="practice-skip-btn"
                onClick={handleSkip}
                disabled={celebrating}
            >

                Skip →

            </button>


            <div className="practice-title-box">

                <h1>
                    Practice Exercise
                </h1>

            </div>


            <div className="practice-progress-area">


                <div className="practice-progress-count">

                    {current} / {total}

                </div>


                <div className="practice-progress-track">

                    <div
                        className="practice-progress-fill"
                        style={{

                            width:
                                `${progress}%`

                        }}
                    />

                </div>


            </div>


            <div className="practice-main-layout">


                {/* WAITER */}

                <div className="practice-waiter-section">


                    <img
                        src={waiterImg}
                        alt="Waiter"
                        className="practice-waiter-image"
                    />


                    <div className="practice-waiter-bubble">


                        <div className="character-name">

                            Waiter 🧑‍🍳

                        </div>


                        <p>

                            {data.waiter}

                        </p>


                    </div>


                </div>


                {/* EXERCISE */}

                <div className="practice-card">


                    <h2>
                        Complete the sentence
                    </h2>


                    <div className="practice-divider">

                        <span></span>

                        <b>✦</b>

                        <span></span>

                    </div>


                    <p className="practice-instruction">

                        Drag the correct words
                        into the blanks.

                    </p>


                    <div className="sentence-box">


                        {filledSentence.map(

                            (
                                part,
                                index
                            ) => {


                                if (
                                    part ===
                                    "____"
                                ) {

                                    return (

                                        <span
                                            key={index}
                                            className="sentence-blank"
                                            onDragOver={
                                                e =>
                                                    e.preventDefault()
                                            }
                                            onDrop={
                                                e =>
                                                    handleDrop(
                                                        e,
                                                        index
                                                    )
                                            }
                                        >

                                            ______

                                        </span>

                                    );

                                }


                                return (

                                    <span
                                        key={index}
                                        className="sentence-word"
                                    >

                                        {part}

                                    </span>

                                );

                            }

                        )}


                    </div>


                    <div className="practice-word-container">


                        {words.map(

                            (
                                word,
                                index
                            ) => (

                                <div
                                    key={index}
                                    className="practice-word"
                                    draggable={
                                        !celebrating
                                    }
                                    onDragStart={
                                        e =>
                                            handleDragStart(
                                                e,
                                                word
                                            )
                                    }
                                >

                                    {word}

                                </div>

                            )

                        )}


                    </div>


                </div>


                {/* TEACHER */}

                <div className="practice-teacher-section">


                    <div className="practice-teacher-bubble">


                        <div className="character-name">

                            Miss Uroosa 👩‍🏫

                        </div>


                        <p>

                            {
                                teacherText ||

                                "Drag the correct words into the blanks. You can do it! ✨"
                            }

                        </p>


                    </div>


                    <img
                        src={teacher}
                        alt="Miss Uroosa"
                        className="practice-teacher-image"
                    />


                </div>


            </div>


            <div className="practice-tip">

                💡

                <span>

                    Listen carefully and
                    speak clearly.

                </span>

            </div>


        </div>

    );

}


export default PracticeExercisePage;