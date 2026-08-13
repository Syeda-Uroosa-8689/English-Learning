import React, { useEffect, useState } from "react";



import teacher from "./assets/teacher1.png";
import bg from "./assets/chatbg.jpeg";


function RestaurantQuizActivity({
    onBack,
    onNext,
    onSkip
}) {

    /* ==========================================
                    QUIZ QUESTIONS
    ========================================== */

    const quizQuestions = [

        {
            question:
                "A waiter asks, 'Are you ready to order?' What is the most appropriate reply?",

            options: [
                "Yes, I'd like the grilled sandwich and orange juice, please.",
                "I like football.",
                "My name is Alex.",
                "See you tomorrow."
            ],

            answer:
                "Yes, I'd like the grilled sandwich and orange juice, please."
        },

        {
            question:
                "Which sentence is the most polite when asking for the bill?",

            options: [
                "Bill!",
                "Bring the bill.",
                "Could we have the bill, please?",
                "Give me the bill now."
            ],

            answer:
                "Could we have the bill, please?"
        },

        {
            question:
                "The waiter says, 'Would you like anything to drink?' Which reply is best?",

            options: [
                "Yes, I'd like a glass of lemonade, please.",
                "I am twelve years old.",
                "My favorite color is blue.",
                "I play cricket."
            ],

            answer:
                "Yes, I'd like a glass of lemonade, please."
        },

        {
            question:
                "What should you say if the waiter serves your food?",

            options: [
                "Thank you very much.",
                "Go away.",
                "You're wrong.",
                "Nothing."
            ],

            answer:
                "Thank you very much."
        },

        {
            question:
                "Your order is incorrect. Which response is polite?",

            options: [
                "Excuse me, I ordered pasta instead of pizza.",
                "This is terrible!",
                "Take it away!",
                "You don't know anything."
            ],

            answer:
                "Excuse me, I ordered pasta instead of pizza."
        }

    ];


    /* ==========================================
                    STATES
    ========================================== */

    const [current, setCurrent] = useState(0);

    const [selected, setSelected] = useState("");

    const [feedback, setFeedback] = useState("");

    const [completed, setCompleted] = useState(false);

    const [isSpeaking, setIsSpeaking] = useState(false);


    /* ==========================================
                    FEMALE VOICE
    ========================================== */

    const speakQuestion = (text) => {

        if (!window.speechSynthesis) return;

        window.speechSynthesis.cancel();

        const speech =
            new SpeechSynthesisUtterance(text);

        speech.lang = "en-US";

        speech.rate = 0.88;

        speech.pitch = 1.05;

        speech.volume = 1;

        const voices =
            window.speechSynthesis.getVoices();

        const femaleVoice =

            voices.find((voice) =>
                /Google UK English Female/i.test(
                    voice.name
                )
            )

            ||

            voices.find((voice) =>
                /Google US English/i.test(
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

            voices.find((voice) =>
                /Zira/i.test(
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
            );


        /*
            IMPORTANT:
            voices[0] fallback nahi hai.
            Isliye male voice randomly select nahi hogi.
        */

        if (femaleVoice) {

            speech.voice = femaleVoice;

        }


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

        /* ==========================================
            LOAD VOICES + FIRST QUESTION
    ========================================== */

    useEffect(() => {

        const loadVoices = () => {

            const voices =
                window.speechSynthesis.getVoices();

            if (voices.length > 0) {

                speakQuestion(
                    quizQuestions[current].question
                );

            }

        };


        /*
            Browser voices kabhi immediately
            load nahi hoti, isliye dono cases
            handle kar rahe hain.
        */

        const voices =
            window.speechSynthesis.getVoices();

        if (voices.length > 0) {

            speakQuestion(
                quizQuestions[current].question
            );

        }


        window.speechSynthesis.onvoiceschanged =
            loadVoices;


        return () => {

            window.speechSynthesis.onvoiceschanged =
                null;

            window.speechSynthesis.cancel();

        };

    }, [current]);


    /* ==========================================
                LISTEN AGAIN
    ========================================== */

    const handleListenAgain = () => {

        speakQuestion(
            quizQuestions[current].question
        );

    };


    /* ==========================================
                HANDLE ANSWER
    ========================================== */

  const handleAnswer = (option) => {

    if (selected) return;

    setSelected(option);

    /* ==========================================
                CORRECT ANSWER
    ========================================== */

    if (option === quizQuestions[current].answer) {

        setFeedback("correct");

        // Teacher speaks feedback
        speakQuestion("Excellent! That's correct.");

        setTimeout(() => {

            if (current === quizQuestions.length - 1) {

                setCompleted(true);

                window.speechSynthesis.cancel();

            } else {

                setCurrent((prev) => prev + 1);

                setSelected("");

                setFeedback("");

            }

        }, 2000);

    }

    /* ==========================================
                WRONG ANSWER
    ========================================== */

    else {

        setFeedback("wrong");

        // Teacher speaks feedback
        speakQuestion("Not quite! Try again.");

        setTimeout(() => {

            setSelected("");

            setFeedback("");

        }, 1800);

    }

};

    /* ==========================================
                OPTION CLASS
    ========================================== */

    const getOptionClass = (option) => {

        let className = "quiz-option";


        /*
            Jab tak answer select nahi hua
            normal button.
        */

        if (!selected) {

            return className;

        }


        /*
            Correct answer hamesha green
            dikhega jab answer submit hua.
        */

        if (
            option ===
            quizQuestions[current].answer
        ) {

            className += " correct";

        }


        /*
            User ne wrong option choose kiya
            to woh red hoga.
        */

        else if (option === selected) {

            className += " wrong";

        }


        return className;

    };

        /* ==========================================
                COMPLETION SCREEN
    ========================================== */

    if (completed) {

        return (

            <div
                className="quiz-page"
                style={{
                    backgroundImage: `url(${bg})`
                }}
            >

                <div className="quiz-overlay"></div>


                <div className="quiz-card">


                    <div className="quiz-complete">


                        {/* ==================================
                                COMPLETION ICON
                        ================================== */}

                        <div className="quiz-complete-icon">

                            🎉

                        </div>


                        {/* ==================================
                                COMPLETION TITLE
                        ================================== */}

                        <h2>

                            Restaurant Quiz Completed!

                        </h2>


                        {/* ==================================
                                COMPLETION MESSAGE
                        ================================== */}

                        <p>

                            Amazing work!
                            You completed all the
                            restaurant quiz questions.
                            Keep practicing your English
                            conversation skills!

                        </p>


                        {/* ==================================
                                NEXT ACTIVITY
                        ================================== */}

                        <button
                            className="quiz-next-btn"
                            onClick={onNext}
                        >

                            Next Activity →

                        </button>


                    </div>

                </div>

            </div>

        );

    }


    /* ==========================================
                MAIN QUIZ PAGE
    ========================================== */

    return (

        <div
            className="quiz-page"
            style={{
                backgroundImage: `url(${bg})`
            }}
        >

            <div className="quiz-overlay"></div>


            <div className="quiz-card">


                {/* ======================================
                            HEADER
                ====================================== */}

                <div className="quiz-header">


                    <button
                        className="quiz-back-btn"
                        onClick={() => {

                            window.speechSynthesis.cancel();

                            onBack();

                        }}
                    >

                        ← Back

                    </button>


                    <h1>

                        Restaurant Quiz

                    </h1>


                    <button
                        className="quiz-skip-btn"
                        onClick={() => {

                            window.speechSynthesis.cancel();

                            onSkip();

                        }}
                    >

                        Skip →

                    </button>


                </div>


                {/* ======================================
                            PROGRESS
                ====================================== */}

                <div className="quiz-progress">

                    Question {current + 1} / {quizQuestions.length}

                </div>


                {/* ======================================
                            CONTENT
                ====================================== */}

                <div className="quiz-content">


                    {/* ==================================
                                TEACHER
                    ================================== */}

                    <div className="quiz-left">

                        <img
                            src={teacher}
                            alt="Teacher"
                            className={
                                isSpeaking
                                    ? "quiz-teacher speaking"
                                    : "quiz-teacher"
                            }
                        />

                    </div>


                    {/* ==================================
                                RIGHT SIDE
                    ================================== */}

                    <div className="quiz-right">


                        {/* ==================================
                                QUESTION BOX
                        ================================== */}

                        <div className="quiz-question-box">


                            <h3>

                                 Listen Carefully

                            </h3>


                            <h2>

                                {quizQuestions[current].question}

                            </h2>


                            {/* ==================================
                                    LISTEN AGAIN
                            ================================== */}

                            <button
                                className="quiz-listen-btn"
                                onClick={handleListenAgain}
                            >

                                 Listen Again

                            </button>


                        </div>


                        {/* ==================================
                                OPTIONS
                        ================================== */}

                        <div className="quiz-options">


                            {quizQuestions[current].options.map(
                                (option, index) => (

                                    <button
                                        key={index}
                                        className={
                                            getOptionClass(option)
                                        }
                                        onClick={() =>
                                            handleAnswer(option)
                                        }
                                        disabled={
                                            selected !== ""
                                        }
                                    >

                                        {option}

                                    </button>

                                )
                            )}


                        </div>


                        {/* ==================================
                                CORRECT FEEDBACK
                        ================================== */}

                        {feedback === "correct" && (

                            <div className="quiz-feedback success">

                                ✅ Excellent! That's correct!

                            </div>

                        )}


                        {/* ==================================
                                WRONG FEEDBACK
                        ================================== */}

                        {feedback === "wrong" && (

                            <div className="quiz-feedback error">

                                ❌ Not quite! Try again.

                            </div>

                        )}


                    </div>

                </div>


            </div>

        </div>

    );

}

export default RestaurantQuizActivity;