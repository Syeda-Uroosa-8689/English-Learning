import React, {
    useEffect,
    useRef,
    useState
} from "react";

import teacher1 from "./assets/teacher1.png";
import teacher2 from "./assets/teacher2.png";
import teacher3 from "./assets/teacher3.png";
import teacher4 from "./assets/teacher4.png";

import pizza from "./assets/pizza.jpg";
import burger from "./assets/burger.jpg";
import apple from "./assets/apple.jpg";

/* =========================================
   CONFETTI + YAY SOUND
========================================= */

import confetti from "canvas-confetti";
import yaySound from "./assets/yay.mp3";


function PictureDescriptionActivity({
    topicId,
    lessonId,
    userName,
    onNext,
    onBack
}) {

    /* =========================================
       TEACHER FRAMES
    ========================================= */

    const teacherFrames = [
        teacher1,
        teacher2,
        teacher3,
        teacher4
    ];


    /* =========================================
       PICTURE ACTIVITIES
    ========================================= */

    const pictureActivities = [

        {
            title: "Pizza",

            image: pizza,

            questions: [

                "Look at this picture carefully. What can you see?",

                "What colour is the pizza?"

            ]
        },

        {
            title: "Burger",

            image: burger,

            questions: [

                "Look at this picture carefully. What can you see?",

                "What ingredients can you see in the burger?"

            ]
        },

        {
            title: "Apple",

            image: apple,

            questions: [

                "Look at this picture carefully. What can you see?",

                "Why is an apple healthy?"

            ]
        }

    ];


    /* =========================================
       STATES
    ========================================= */

    const [frame, setFrame] = useState(0);

    const [teacherMessage, setTeacherMessage] =
        useState("");

    const [isSpeaking, setIsSpeaking] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [pictureIndex, setPictureIndex] =
        useState(0);

    const [questionIndex, setQuestionIndex] =
        useState(0);

    const [history, setHistory] =
        useState([]);

    const [waitingForRepeat, setWaitingForRepeat] =
        useState(false);

    const [correctSentence, setCorrectSentence] =
        useState("");

    const [showLessonComplete, setShowLessonComplete] =
        useState(false);

    const recognitionRef =
        useRef(null);

    const currentPicture =
        pictureActivities[pictureIndex];

    const currentQuestion =
        currentPicture.questions[questionIndex];


    /* =========================================
       TEACHER ANIMATION
    ========================================= */

    useEffect(() => {

        if (!isSpeaking) {

            setFrame(0);

            return;

        }

        const timer = setInterval(() => {

            setFrame(prev =>
                (prev + 1) % teacherFrames.length
            );

        }, 250);

        return () => {

            clearInterval(timer);

        };

    }, [isSpeaking]);


    /* =========================================
       CLEANUP
    ========================================= */

    useEffect(() => {

        return () => {

            window.speechSynthesis.cancel();

            if (recognitionRef.current) {

                try {

                    recognitionRef.current.stop();

                } catch (error) {

                    console.log(error);

                }

            }

        };

    }, []);


    /* =========================================
       STOP EVERYTHING
    ========================================= */

    const stopActivity = () => {

        window.speechSynthesis.cancel();

        if (recognitionRef.current) {

            try {

                recognitionRef.current.stop();

            } catch (error) {

                console.log(error);

            }

            recognitionRef.current = null;

        }

        setLoading(false);

        setIsSpeaking(false);

    };


    /* =========================================
       CONFETTI
    ========================================= */

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


        setTimeout(() => {

            confetti({

                particleCount: 70,

                spread: 100,

                startVelocity: 30,

                origin: {
                    x: 0.15,
                    y: 0.65
                }

            });

        }, 150);


        setTimeout(() => {

            confetti({

                particleCount: 70,

                spread: 100,

                startVelocity: 30,

                origin: {
                    x: 0.85,
                    y: 0.65
                }

            });

        }, 300);

    };


    /* =========================================
       YAY SOUND
    ========================================= */

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


    /* =========================================
       TEACHER SPEAK
    ========================================= */

    const speak = (text, onFinish = null) => {

        window.speechSynthesis.cancel();

        setTeacherMessage("");

        setIsSpeaking(true);

        let index = 0;

        const typing = setInterval(() => {

            index++;

            setTeacherMessage(
                text.substring(0, index)
            );

            if (index >= text.length) {

                clearInterval(typing);

            }

        }, 30);


        const speech =
            new SpeechSynthesisUtterance(text);


        /* =====================================
           FEMALE ENGLISH VOICE
        ===================================== */

        speech.lang = "en-US";

        speech.rate = 0.9;

        speech.pitch = 1.1;

        speech.volume = 1;


        const voices =
            window.speechSynthesis.getVoices();


        const femaleVoice =
            voices.find(v =>
                /zira|samantha|susan|karen|hazel|female/i
                    .test(v.name)
            );


        if (femaleVoice) {

            speech.voice = femaleVoice;

        }


        speech.onend = () => {

            clearInterval(typing);

            setIsSpeaking(false);

            if (onFinish) {

                onFinish();

            }

        };


        speech.onerror = () => {

            clearInterval(typing);

            setIsSpeaking(false);

        };


        window.speechSynthesis.speak(speech);

    };


    /* =========================================
       LOAD AVAILABLE VOICES
    ========================================= */

    useEffect(() => {

        const loadVoices = () => {

            window.speechSynthesis.getVoices();

        };


        loadVoices();


        window.speechSynthesis.addEventListener(
            "voiceschanged",
            loadVoices
        );


        return () => {

            window.speechSynthesis.removeEventListener(
                "voiceschanged",
                loadVoices
            );

        };

    }, []);


    /* =========================================
       ASK FIRST QUESTION
    ========================================= */

    useEffect(() => {

        const timer = setTimeout(() => {

            speak(currentQuestion);

        }, 700);


        return () => {

            clearTimeout(timer);

        };

    }, []);


    /* =========================================
       MICROPHONE
    ========================================= */

    const startListening = () => {

        /* -------------------------------------
           Don't start while teacher is speaking
        ------------------------------------- */

        if (
            isSpeaking ||
            loading ||
            showLessonComplete
        ) {

            return;

        }


        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if (!SpeechRecognition) {

            alert(
                "Speech Recognition is not supported. Please use Google Chrome."
            );

            return;

        }


        /* -------------------------------------
           Stop previous recognition
        ------------------------------------- */

        if (recognitionRef.current) {

            try {

                recognitionRef.current.stop();

            } catch (error) {

                console.log(error);

            }

        }


        const recognition =
            new SpeechRecognition();


        recognition.lang = "en-US";

        recognition.interimResults = false;

        recognition.maxAlternatives = 1;

        recognition.continuous = false;


        recognitionRef.current =
            recognition;


        setLoading(true);


        try {

            recognition.start();

        } catch (error) {

            console.log(error);

            setLoading(false);

            return;

        }


        /* =====================================
           STUDENT ANSWER RECEIVED
        ===================================== */

        recognition.onresult = (event) => {

            const spokenText =
                event.results[0][0]
                    .transcript
                    .trim();


            setLoading(false);

            recognitionRef.current = null;


            if (!spokenText) {

                speak(
                    "I couldn't hear you. Please try again."
                );

                return;

            }


            /* ---------------------------------
               CORRECTION REPEAT MODE
            --------------------------------- */

            if (waitingForRepeat) {

                handleRepeat(spokenText);

                return;

            }


            /* ---------------------------------
               NORMAL ANSWER
            --------------------------------- */

            handleSubmit(spokenText);

        };


        /* =====================================
           NO MATCH
        ===================================== */

        recognition.onnomatch = () => {

            setLoading(false);

            recognitionRef.current = null;


            speak(
                "I couldn't understand you. Please try again."
            );

        };


        /* =====================================
           MICROPHONE ERROR
        ===================================== */

        recognition.onerror = (event) => {

            setLoading(false);

            recognitionRef.current = null;


            console.log(
                "Microphone error:",
                event.error
            );


            if (event.error === "no-speech") {

                speak(
                    "I couldn't hear you. Please tap the microphone and answer the same question."
                );

                return;

            }


            if (event.error === "aborted") {

                return;

            }


            speak(
                "Sorry, something went wrong. Please try again."
            );

        };


        /* =====================================
           MICROPHONE ENDED
        ===================================== */

        recognition.onend = () => {

            setLoading(false);

        };

    };


    /* =========================================
       SUBMIT ANSWER TO BACKEND / AI
    ========================================= */

    const handleSubmit = async (spokenText) => {

        if (!spokenText || loading) {

            return;

        }


        setLoading(true);


        try {

            const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/chat`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        message: spokenText,

                        history: history,

                        topicId: topicId,

                        lessonId: lessonId,

                        userName: userName,

                        activity: "picture",

                        pictureName:
                            currentPicture.title,

                        currentQuestion:
                            currentQuestion

                    })

                }
            );


            if (!response.ok) {

                throw new Error(
                    "Backend request failed"
                );

            }


            const data =
                await response.json();


            const aiReply =
                data.response ||
                "Good try! Please try again.";


            /* =================================
               SAVE CHAT HISTORY
            ================================= */

            setHistory(prev => [

                ...prev,

                {
                    sender: "user",
                    text: spokenText
                },

                {
                    sender: "teacher",
                    text: aiReply
                }

            ]);


            /* =================================
               FIND CORRECTED SENTENCE
            ================================= */

            const betterMatch =
                aiReply.match(
                    /better sentence\s*:\s*["“]?([^"”\n]+)["”]?/i
                );


            const correctMatch =
                aiReply.match(
                    /correct sentence\s*:\s*["“]?([^"”\n]+)["”]?/i
                );


            let sentence = "";


            if (betterMatch) {

                sentence =
                    betterMatch[1].trim();

            }

            else if (correctMatch) {

                sentence =
                    correctMatch[1].trim();

            }


            /* =================================
               CORRECTION FOUND
            ================================= */

            if (sentence) {

                setCorrectSentence(sentence);

                setWaitingForRepeat(true);

            }

            else {

                setCorrectSentence("");

                setWaitingForRepeat(false);

            }


            /* =================================
               TEACHER REPLY
            ================================= */

            speak(aiReply);

        }

        catch (error) {

            console.log(
                "Picture activity error:",
                error
            );


            speak(
                "Sorry, I could not connect. Please try again."
            );

        }

        finally {

            setLoading(false);

        }

    };


    /* =========================================
       REPEAT CORRECTED SENTENCE
    ========================================= */

    const handleRepeat = async (spokenText) => {

        if (!spokenText || loading) {

            return;

        }


        const normalize = (text) => {

            return text
                .toLowerCase()
                .replace(/[.,!?'"“”]/g, "")
                .replace(/\s+/g, " ")
                .trim();

        };


        const studentAnswer =
            normalize(spokenText);


        const expectedAnswer =
            normalize(correctSentence);


        /* =====================================
           CORRECT REPEAT
        ===================================== */

        if (
            expectedAnswer &&
            (
                studentAnswer === expectedAnswer ||
                studentAnswer.includes(expectedAnswer) ||
                expectedAnswer.includes(studentAnswer)
            )
        ) {

            setWaitingForRepeat(false);

            setCorrectSentence("");

            setHistory([]);


            /* =================================
               CONFETTI + YAY SOUND
            ================================= */

            celebrate();

            await playYaySound();


            speak(
                "Excellent! That's correct.",
                () => {

                    setTimeout(() => {

                        moveNext();

                    }, 1000);

                }
            );


            return;

        }


        /* =====================================
           WRONG REPEAT

           SAME QUESTION RAHEGA.
        ===================================== */

        speak(
            `Good try! Please repeat: ${correctSentence}`
        );

    };


    /* =========================================
       MOVE NEXT
    ========================================= */

    const moveNext = () => {

        window.speechSynthesis.cancel();


        /* =====================================
           NEXT QUESTION — SAME PICTURE
        ===================================== */

        if (
            questionIndex <
            currentPicture.questions.length - 1
        ) {

            const nextQuestion =
                questionIndex + 1;


            setQuestionIndex(nextQuestion);

            setWaitingForRepeat(false);

            setCorrectSentence("");

            setHistory([]);


            setTimeout(() => {

                speak(
                    currentPicture.questions[nextQuestion]
                );

            }, 600);


            return;

        }


        /* =====================================
           NEXT PICTURE
        ===================================== */

        if (
            pictureIndex <
            pictureActivities.length - 1
        ) {

            const nextPicture =
                pictureIndex + 1;


            setPictureIndex(nextPicture);

            setQuestionIndex(0);

            setWaitingForRepeat(false);

            setCorrectSentence("");

            setHistory([]);


            setTimeout(() => {

                speak(
                    pictureActivities[
                        nextPicture
                    ].questions[0]
                );

            }, 600);


            return;

        }


        /* =====================================
           ALL PICTURES COMPLETE
        ===================================== */

        completeActivity();

    };


    /* =========================================
       COMPLETE ACTIVITY
    ========================================= */

    const completeActivity = () => {

        window.speechSynthesis.cancel();


        /* -------------------------------------
           Stop microphone
        ------------------------------------- */

        if (recognitionRef.current) {

            try {

                recognitionRef.current.stop();

            } catch (error) {

                console.log(error);

            }

            recognitionRef.current = null;

        }


        setLoading(false);

        setIsSpeaking(false);

        setWaitingForRepeat(false);

        setCorrectSentence("");


        /* -------------------------------------
           Tell parent activity is complete
        ------------------------------------- */

        if (onNext) {

            onNext();

        }

    };


    /* =========================================
       SKIP WHOLE ACTIVITY
    ========================================= */

    const handleSkip = () => {

        window.speechSynthesis.cancel();


        /* -------------------------------------
           Stop microphone
        ------------------------------------- */

        if (recognitionRef.current) {

            try {

                recognitionRef.current.stop();

            } catch (error) {

                console.log(error);

            }

            recognitionRef.current = null;

        }


        setLoading(false);

        setIsSpeaking(false);

        setWaitingForRepeat(false);

        setCorrectSentence("");


        /*
           Skip = complete whole activity
        */

        if (onNext) {

            onNext();

        }

    };


    /* =========================================
       BACK BUTTON
    ========================================= */

    const handleBack = () => {

        window.speechSynthesis.cancel();


        if (recognitionRef.current) {

            try {

                recognitionRef.current.stop();

            } catch (error) {

                console.log(error);

            }

            recognitionRef.current = null;

        }


        setLoading(false);

        setIsSpeaking(false);


        if (onBack) {

            onBack();

        }

    };


    /* =========================================
       MAIN UI
    ========================================= */

    return (

        <div className="picture-container">

            <div className="picture-card">


                {/* =================================
                    HEADER
                ================================= */}

                <div className="picture-header">

                    <button
                        className="picture-back-btn"
                        onClick={handleBack}
                        disabled={loading}
                    >
                        ← Back
                    </button>


                    <h1>
                        Picture Description
                    </h1>


                    <button
                        className="picture-skip-btn"
                        onClick={handleSkip}
                        disabled={loading}
                    >
                        Skip →
                    </button>

                </div>


                {/* =================================
                    PROGRESS
                ================================= */}

                <div className="picture-progress">

                    <span>
                        Picture {pictureIndex + 1} of{" "}
                        {pictureActivities.length}
                    </span>


                    <span>
                        Question {questionIndex + 1} of{" "}
                        {currentPicture.questions.length}
                    </span>

                </div>


                {/* =================================
                    MAIN CONTENT
                ================================= */}

                <div className="picture-main">


                    {/* =================================
                        TEACHER SIDE
                    ================================= */}

                    <div className="picture-left">

                        <img
                            src={teacherFrames[frame]}
                            alt="Miss Uroosa"
                            className={
                                isSpeaking
                                    ? "teacher-img speaking"
                                    : "teacher-img"
                            }
                        />


                        <div className="picture-bubble">

                            <p>

                                {teacherMessage ||
                                    currentQuestion}

                            </p>

                        </div>

                    </div>


                    {/* =================================
                        PICTURE SIDE
                    ================================= */}

                    <div className="picture-right">

                        <div className="picture-image-card">

                            <img
                                src={currentPicture.image}
                                alt={currentPicture.title}
                                className="activity-picture"
                            />

                        </div>


                        <h3>
                            {currentPicture.title}
                        </h3>

                    </div>

                </div>


                {/* =================================
                    STATUS
                ================================= */}

                <div className="picture-status">

                    {waitingForRepeat ? (

                        <span>
                            🔁 Please repeat the corrected sentence
                        </span>

                    ) : loading ? (

                        <span>
                            🎙 Listening...
                        </span>

                    ) : isSpeaking ? (

                        <span>
                            Miss Uroosa is speaking...
                        </span>

                    ) : (

                        <span>
                            🎙️ Tap the microphone and answer
                        </span>

                    )}

                </div>


                {/* =================================
                    MICROPHONE BUTTON
                ================================= */}

                <div className="picture-buttons">

                    <button
                        className="picture-mic-btn"
                        onClick={startListening}
                        disabled={
                            loading ||
                            isSpeaking
                        }
                    >

                        {loading
                            ? "🎙 Listening..."
                            : "🎙️ Tap to Speak"}

                    </button>

                </div>


            </div>

        </div>

    );

}


export default PictureDescriptionActivity;