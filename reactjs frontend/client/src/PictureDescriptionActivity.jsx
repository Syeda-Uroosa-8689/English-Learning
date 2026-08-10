import React, { useEffect, useRef, useState } from "react";

import teacher1 from "./assets/teacher1.png";
import teacher2 from "./assets/teacher2.png";
import teacher3 from "./assets/teacher3.png";
import teacher4 from "./assets/teacher4.png";

import pizza from "./assets/pizza.jpg";
import burger from "./assets/burger.jpg";
import apple from "./assets/apple.jpg";


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

    const [showFinish, setShowFinish] =
        useState(false);

    const [waitingForRepeat, setWaitingForRepeat] =
        useState(false);

    const [correctSentence, setCorrectSentence] =
        useState("");

    const recognitionRef =
        useRef(null);


    /* =========================================
       CURRENT PICTURE / QUESTION
    ========================================= */

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
                (prev + 1) %
                teacherFrames.length
            );

        }, 250);


        return () => clearInterval(timer);

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
       REST OF CODE COMES IN NEXT PART
    ========================================= */

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


        speech.lang = "en-US";

        speech.rate = 0.9;

        speech.pitch = 1.1;

        speech.volume = 1;


        /*
           Female voice prefer karenge.
        */

        const voices =
            window.speechSynthesis.getVoices();


        const femaleVoice =
            voices.find(v =>
                /female|zira|samantha|susan|karen|hazel/i
                    .test(v.name)
            );


        if (femaleVoice) {

            speech.voice = femaleVoice;

        }


        speech.onend = () => {

            setIsSpeaking(false);


            if (onFinish) {

                onFinish();

            }

        };


        window.speechSynthesis.speak(speech);

    };


    /* =========================================
       FIRST QUESTION
    ========================================= */

    useEffect(() => {

        const timer = setTimeout(() => {

            speak(currentQuestion);

        }, 500);


        return () => clearTimeout(timer);

    }, []);


    /* =========================================
       FEMALE VOICE LOAD FIX
    ========================================= */

    useEffect(() => {

        const loadVoices = () => {

            window.speechSynthesis.getVoices();

        };


        loadVoices();


        window.speechSynthesis
            .addEventListener(
                "voiceschanged",
                loadVoices
            );


        return () => {

            window.speechSynthesis
                .removeEventListener(
                    "voiceschanged",
                    loadVoices
                );

        };

    }, []);


        /* =========================================
       MICROPHONE
    ========================================= */

    const startListening = () => {

        /*
           Teacher bol rahi hai to mic start nahi hoga.
        */

        if (isSpeaking || loading) {

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


        /*
           Previous microphone stop karo.
        */

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
           STUDENT SPOKE
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


            /*
               IMPORTANT:

               Agar correction ke baad repeat
               karna hai to handleRepeat chalega.

               Otherwise normal answer AI ko jayega.
            */

            if (waitingForRepeat) {

                handleRepeat(spokenText);

            } else {

                handleSubmit(spokenText);

            }

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
           ERROR
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

            /*
               VERY IMPORTANT:

               onend sirf microphone listening
               stop hone ka signal hai.

               YAHAN moveNext() NAHI HAI.

               Isliye mic automatically next
               question par nahi jayega.
            */

        };

    };

        /* =========================================
       SUBMIT STUDENT ANSWER TO AI
    ========================================= */

    const handleSubmit = async (spokenText) => {

        if (!spokenText || loading) {

            return;

        }


        setLoading(true);


        try {

            const response = await fetch(
                "http://localhost:5000/api/chat",
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
               SAVE CONVERSATION
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
               CHECK FOR CORRECTION
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

                setWaitingForRepeat(false);

                setCorrectSentence("");

            }


            /* =================================
               TEACHER SPEAKS
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

    const handleRepeat = (spokenText) => {

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


        /*
           Student ne corrected sentence
           sahi repeat kiya.
        */

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


        /*
           Repeat galat hai.
           Next question NAHI aayega.
        */

        speak(

            `Good try! Please repeat: ${correctSentence}`

        );

    };


    /* =========================================
       MOVE TO NEXT QUESTION / PICTURE
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
                    currentPicture
                        .questions[nextQuestion]
                );

            }, 500);


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

            }, 500);


            return;

        }


        /* =====================================
           ALL PICTURES COMPLETE
        ===================================== */

        setShowFinish(true);

    };

        /* =========================================
       SKIP CURRENT QUESTION
    ========================================= */
/* =========================================
   SKIP ENTIRE ACTIVITY
========================================= */

const handleSkip = () => {

    // Stop teacher voice
    window.speechSynthesis.cancel();

    // Stop microphone
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
       IMPORTANT:

       Skip means SKIP THE WHOLE ACTIVITY.
       It does NOT call moveNext().
    */

    setShowFinish(true);

    /*
       After showing the lesson completion popup,
       automatically return to Subtopic page.
    */

    setTimeout(() => {

        window.speechSynthesis.cancel();

        if (onNext) {

            onNext();

        }

    }, 3500);

};


    /* =========================================
       FINISH -> NEXT LESSON
    ========================================= */

    const handleNextLesson = () => {

        window.speechSynthesis.cancel();

        setShowFinish(false);

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

        }

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


                {/* ================= HEADER ================= */}

                <div className="picture-header">

                    <button
                        className="picture-back-btn"
                        onClick={handleBack}
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


                {!showFinish && (

                    <>

                        {/* ================= PROGRESS ================= */}

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


                        {/* ================= MAIN ================= */}

                        <div className="picture-main">


                            {/* ================= TEACHER ================= */}

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
                                        {
                                            teacherMessage ||
                                            currentQuestion
                                        }
                                    </p>

                                </div>

                            </div>


                            {/* ================= PICTURE ================= */}

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


                        {/* ================= STATUS ================= */}

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
                                    🔊 Miss Uroosa is speaking...
                                </span>

                            ) : (

                                <span>
                                    🎤 Tap the microphone and answer
                                </span>

                            )}

                        </div>


                        {/* ================= MIC ================= */}

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
                                    : "🎤 Tap to Speak"}

                            </button>

                        </div>

                    </>

                )}


                {/* ================= FINISH ================= */}

                {showFinish && (

                    <div className="picture-finish">

                        <div className="picture-remark">

                            <h2>
                                🎉 Excellent!
                            </h2>

                            <p>
                                You completed all the
                                Picture Description activities.
                            </p>

                        </div>


                        <button
                            className="picture-next-btn"
                            onClick={handleNextLesson}
                        >
                            Next Lesson →
                        </button>

                    </div>

                )}

            </div>

        </div>

    );

}


export default PictureDescriptionActivity;