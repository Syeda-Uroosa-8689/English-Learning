import React, { useEffect, useState, useRef } from "react";

import teacher1 from "./assets/teacher1.png";
import teacher2 from "./assets/teacher2.png";
import teacher3 from "./assets/teacher3.png";
import teacher4 from "./assets/teacher4.png";

import chatBg from "./assets/chatbg.jpeg";


function MoodConversationActivity({
    onNext,
    onBack
}) {

    /* ==========================================
                    CONVERSATIONS
    ========================================== */

    const conversations = [

        {
            id: 1,

            teacher: teacher1,

            waiter:
                "Good evening! Welcome to our restaurant.",

            customer:
                "Good evening. I'd like a grilled sandwich and a glass of orange juice, please.",

            question:
                "What is the customer's mood?",

            options: [
                "😊 Polite",
                "😠 Angry",
                "😟 Worried",
                "😴 Tired"
            ],

            answer:
                "😊 Polite",

            feedback:
                "Excellent! The customer is speaking politely."
        },

        {
            id: 2,

            teacher: teacher2,

            waiter:
                "I'm sorry. Your food will take another fifteen minutes.",

            customer:
                "That's alright. I can wait.",

            question:
                "How does the customer feel?",

            options: [
                "😌 Patient",
                "😠 Angry",
                "😢 Sad",
                "😨 Nervous"
            ],

            answer:
                "😌 Patient",

            feedback:
                "Correct! The customer stayed patient."
        },

        {
            id: 3,

            teacher: teacher3,

            waiter:
                "Congratulations! You are our lucky customer today.",

            customer:
                "Really? That's wonderful!",

            question:
                "Which mood is shown?",

            options: [
                "🤩 Excited",
                "😴 Sleepy",
                "😡 Angry",
                "😢 Sad"
            ],

            answer:
                "🤩 Excited",

            feedback:
                "Great! The customer is excited."
        },

        {
            id: 4,

            teacher: teacher4,

            waiter:
                "Sorry, we don't have chocolate cake today.",

            customer:
                "Oh...that's disappointing.",

            question:
                "How does the customer feel?",

            options: [
                "😔 Disappointed",
                "😊 Happy",
                "😎 Confident",
                "🤩 Excited"
            ],

            answer:
                "😔 Disappointed",

            feedback:
                "Correct! The customer feels disappointed."
        },

        {
            id: 5,

            teacher: teacher1,

            waiter:
                "Would you like anything else?",

            customer:
                "No thank you. Everything was delicious.",

            question:
                "How does the customer feel?",

            options: [
                "😄 Satisfied",
                "😠 Angry",
                "😨 Nervous",
                "😢 Sad"
            ],

            answer:
                "😄 Satisfied",

            feedback:
                "Excellent! The customer is satisfied."
        },

        {
            id: 6,

            teacher: teacher2,

            waiter:
                "We'll replace your meal immediately.",

            customer:
                "Thank you very much. I appreciate it.",

            question:
                "What mood is shown?",

            options: [
                "🙏 Grateful",
                "😠 Annoyed",
                "😴 Sleepy",
                "😭 Lonely"
            ],

            answer:
                "🙏 Grateful",

            feedback:
                "Wonderful! The customer is grateful."
        }

    ];


    /* ==========================================
                    STATES
    ========================================== */

    const [current, setCurrent] = useState(0);

    const [showCustomer, setShowCustomer] = useState(false);

    const [showQuestion, setShowQuestion] = useState(false);

    const [selected, setSelected] = useState("");

    const [feedback, setFeedback] = useState("");

    const [completed, setCompleted] = useState(false);

    const [isSpeaking, setIsSpeaking] = useState(false);


    /* ==========================================
                SPEECH CONTROL REF
    ========================================== */

    const speechSequenceRef = useRef(null);

    const isMountedRef = useRef(true);


    /* ==========================================
                    MOUNT / UNMOUNT
    ========================================== */

    useEffect(() => {

        isMountedRef.current = true;

        return () => {

            isMountedRef.current = false;

            window.speechSynthesis.cancel();

            if (speechSequenceRef.current) {

                clearTimeout(speechSequenceRef.current);

            }

        };

    }, []);


    /* ==========================================
                BROWSER VOICES LOAD
    ========================================== */

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

        /* ==========================================
                FIND MALE WAITER VOICE
    ========================================== */

    const getWaiterVoice = () => {

        const voices =
            window.speechSynthesis.getVoices();

        return (

            voices.find((voice) =>
                /Google UK English Male/i.test(
                    voice.name
                )
            )

            ||

            voices.find((voice) =>
                /Google US English Male/i.test(
                    voice.name
                )
            )

            ||

            voices.find((voice) =>
                /Microsoft.*Guy/i.test(
                    voice.name
                )
            )

            ||

            voices.find((voice) =>
                /Microsoft.*Ryan/i.test(
                    voice.name
                )
            )

            ||

            voices.find((voice) =>
                /Daniel/i.test(
                    voice.name
                )
            )

            ||

            voices.find((voice) =>
                /Alex/i.test(
                    voice.name
                )
            )

            ||

            voices.find((voice) =>
                /English.*Male/i.test(
                    voice.name
                )
            )

            ||

            null

        );

    };


    /* ==========================================
                FIND CUSTOMER VOICE
                CHILD-LIKE SETTINGS
    ========================================== */

    const getCustomerVoice = () => {

        const voices =
            window.speechSynthesis.getVoices();

        /*
            Browser mein actual child voice
            har system par available nahi hoti.

            Isliye ek suitable English voice
            ko higher pitch + slightly faster
            rate ke saath child-like banayenge.
        */

        return (

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

            voices.find((voice) =>
                /Zira/i.test(
                    voice.name
                )
            )

            ||

            null

        );

    };


    /* ==========================================
                FIND TEACHER FEMALE VOICE
    ========================================== */

    const getTeacherVoice = () => {

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
                /Google US English/i.test(
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

            voices.find((voice) =>
                /Zira/i.test(
                    voice.name
                )
            )

            ||

            null

        );

    };


    /* ==========================================
                    GENERIC SPEAK
    ========================================== */

    const speakText = (
        text,
        voiceType,
        callback
    ) => {

        if (!window.speechSynthesis) {

            if (callback) callback();

            return;

        }


        /*
            Previous speech ko completely stop
            karna important hai.

            Isse duplicate dialogue nahi chalega.
        */

        window.speechSynthesis.cancel();


        const speech =
            new SpeechSynthesisUtterance(text);


        speech.lang = "en-US";


        /* ======================================
                    VOICE SETTINGS
        ====================================== */

        if (voiceType === "waiter") {

            const voice = getWaiterVoice();

            if (voice) {

                speech.voice = voice;

            }

            /*
                Male waiter:
                normal adult voice
            */

            speech.rate = 0.88;

            speech.pitch = 0.85;

            speech.volume = 1;

        }


        else if (voiceType === "customer") {

            const voice = getCustomerVoice();

            if (voice) {

                speech.voice = voice;

            }

            /*
                Child-like customer:
                higher pitch + slightly faster
            */

            speech.rate = 0.98;

            speech.pitch = 1.35;

            speech.volume = 1;

        }


        else if (voiceType === "teacher") {

            const voice = getTeacherVoice();

            if (voice) {

                speech.voice = voice;

            }

            /*
                Female teacher:
                clear and slightly slower
            */

            speech.rate = 0.88;

            speech.pitch = 1.08;

            speech.volume = 1;

        }


        /* ======================================
                    SPEECH START
        ====================================== */

        speech.onstart = () => {

            if (!isMountedRef.current) return;

            setIsSpeaking(true);

        };


        /* ======================================
                    SPEECH END
        ====================================== */

        speech.onend = () => {

            if (!isMountedRef.current) return;

            setIsSpeaking(false);

            if (callback) {

                callback();

            }

        };


        /* ======================================
                    SPEECH ERROR
        ====================================== */

        speech.onerror = () => {

            if (!isMountedRef.current) return;

            setIsSpeaking(false);

            if (callback) {

                callback();

            }

        };


        window.speechSynthesis.speak(speech);

    };


    /* ==========================================
                    WAITER SPEAK
    ========================================== */

    const speakWaiter = (
        text,
        callback
    ) => {

        speakText(
            text,
            "waiter",
            callback
        );

    };


    /* ==========================================
                    CUSTOMER SPEAK
    ========================================== */

    const speakCustomer = (
        text,
        callback
    ) => {

        speakText(
            text,
            "customer",
            callback
        );

    };


    /* ==========================================
                    TEACHER SPEAK
    ========================================== */

    const speakTeacher = (
        text,
        callback
    ) => {

        speakText(
            text,
            "teacher",
            callback
        );

    };

        /* ==========================================
            PLAY FULL CONVERSATION
    ========================================== */

    const playConversation = () => {

        if (!isMountedRef.current) return;

        /*
            Kisi bhi previous speech ko stop karo.
            Isse "Good evening" multiple times nahi chalega.
        */

        window.speechSynthesis.cancel();


        /*
            Previous timeout bhi clear karo.
        */

        if (speechSequenceRef.current) {

            clearTimeout(
                speechSequenceRef.current
            );

        }


        const conversation =
            conversations[current];


        /* ======================================
                RESET SCREEN
        ====================================== */

        setShowCustomer(false);

        setShowQuestion(false);

        setSelected("");

        setFeedback("");

        setIsSpeaking(false);


        /* ======================================
                STEP 1 — WAITER
                MALE VOICE
        ====================================== */

        speakWaiter(

            conversation.waiter,

            () => {

                if (!isMountedRef.current) return;


                /*
                    Small gap between waiter
                    and customer.
                */

                speechSequenceRef.current =
                    setTimeout(() => {

                        if (!isMountedRef.current)
                            return;


                        /* ==========================
                            SHOW CUSTOMER
                        ========================== */

                        setShowCustomer(true);


                        /* ==========================
                            STEP 2 — CUSTOMER
                            CHILD-LIKE VOICE
                        ========================== */

                        speakCustomer(

                            conversation.customer,

                            () => {

                                if (
                                    !isMountedRef.current
                                ) return;


                                /*
                                    Small pause before
                                    teacher question.
                                */

                                speechSequenceRef.current =
                                    setTimeout(() => {

                                        if (
                                            !isMountedRef.current
                                        ) return;


                                        /* ==================
                                            SHOW QUESTION
                                        ================== */

                                        setShowQuestion(
                                            true
                                        );


                                        /* ==================
                                            STEP 3 — TEACHER
                                            FEMALE VOICE
                                        ================== */

                                        speechSequenceRef.current =
                                            setTimeout(() => {

                                                if (
                                                    !isMountedRef.current
                                                ) return;


                                                speakTeacher(

                                                    conversation.question

                                                );

                                            }, 400);


                                    }, 500);

                            }

                        );


                    }, 700);

            }

        );

    };


    /* ==========================================
                FIRST LOAD / NEXT QUESTION
    ========================================== */

    useEffect(() => {

        playConversation();


        return () => {

            window.speechSynthesis.cancel();


            if (
                speechSequenceRef.current
            ) {

                clearTimeout(
                    speechSequenceRef.current
                );

            }

        };

    }, [current]);


    /* ==========================================
                    LISTEN AGAIN
    ========================================== */

    const handleListenAgain = () => {

        /*
            Same complete sequence:
            
            Waiter
                ↓
            Customer
                ↓
            Teacher Question
        */

        playConversation();

    };


    /* ==========================================
                STOP ALL SPEECH
    ========================================== */

    const stopAllSpeech = () => {

        window.speechSynthesis.cancel();


        if (
            speechSequenceRef.current
        ) {

            clearTimeout(
                speechSequenceRef.current
            );

            speechSequenceRef.current = null;

        }


        if (isMountedRef.current) {

            setIsSpeaking(false);

        }

    };

        /* ==========================================
                    HANDLE ANSWER
    ========================================== */

    const handleAnswer = (option) => {

        /*
            Ek baar answer select hone ke baad
            dobara click nahi karne dena.
        */

        if (selected !== "") return;


        const conversation =
            conversations[current];


        setSelected(option);


        /* ======================================
                    CORRECT ANSWER
        ====================================== */

        if (option === conversation.answer) {

            setFeedback("correct");


            /*
                Teacher female voice
            */

            speakTeacher(
                conversation.feedback
            );


            /*
                Teacher ke feedback ke baad
                next conversation.
            */

            speechSequenceRef.current =
                setTimeout(() => {

                    if (!isMountedRef.current)
                        return;


                    if (
                        current <
                        conversations.length - 1
                    ) {

                        setCurrent(
                            (prev) => prev + 1
                        );

                    }

                    else {

                        /*
                            Last question complete
                        */

                        stopAllSpeech();

                        setCompleted(true);

                    }

                }, 2200);

        }


        /* ======================================
                    WRONG ANSWER
        ====================================== */

        else {

            setFeedback("wrong");


            /*
                Teacher female voice
            */

            speakTeacher(
                "Not quite! Try again."
            );


            /*
                User ko khud correct answer
                choose karne dena hai.

                Question automatically
                dobara nahi chalega.
            */

            speechSequenceRef.current =
                setTimeout(() => {

                    if (!isMountedRef.current)
                        return;


                    setSelected("");

                    setFeedback("");

                }, 1800);

        }

    };


    /* ==========================================
                    OPTION CLASS
    ========================================== */

    const getOptionClass = (option) => {

        let className =
            "mood-option-btn";


        /*
            Normal state
        */

        if (selected === "") {

            return className;

        }


        /*
            Correct answer
            sirf correct hone ke baad
            green hoga.
        */

        if (
            option ===
            conversations[current].answer
        ) {

            className += " correct";

        }


        /*
            User ka selected wrong answer
        */

        else if (
            option === selected
        ) {

            className += " wrong";

        }


        return className;

    };


    /* ==========================================
                FEEDBACK TEXT
    ========================================== */

    const getFeedbackText = () => {

        if (feedback === "correct") {

            return conversations[current].feedback;

        }


        if (feedback === "wrong") {

            return "Good try! Listen again and choose the correct mood.";

        }


        return "";

    };


    /* ==========================================
                    BACK BUTTON
    ========================================== */

    const handleBack = () => {

        stopAllSpeech();

        onBack();

    };


    /* ==========================================
                    SKIP BUTTON
    ========================================== */

    const handleSkip = () => {

        /*
            IMPORTANT:
            Skip karte hi waiter/customer/
            teacher ki pending speech aur
            timeout sab stop honge.
        */

        stopAllSpeech();

        onNext();

    };

        /* ==========================================
                    COMPLETION SCREEN
    ========================================== */

    if (completed) {

        return (

            <div
                className="mood-page"
                style={{
                    backgroundImage: `url(${chatBg})`
                }}
            >

                <div className="mood-overlay"></div>


                <div className="mood-card">

                    <div className="mood-complete-card">

                        <div className="mood-confetti">

                            🎉 🎊 🎉 🎊 🎉

                        </div>


                        <h2>

                            Excellent!

                        </h2>


                        <p>

                            You identified all the
                            customer moods correctly.

                        </p>


                        <button
                            className="mood-next-btn"
                            onClick={() => {

                                stopAllSpeech();

                                onNext();

                            }}
                        >

                            Next →

                        </button>

                    </div>

                </div>

            </div>

        );

    }


    /* ==========================================
                    MAIN UI
    ========================================== */

    return (

        <div
            className="mood-page"
            style={{
                backgroundImage: `url(${chatBg})`
            }}
        >

            <div className="mood-overlay"></div>


            <div className="mood-card">


                {/* ==================================
                            HEADER
                ================================== */}

                <div className="mood-header">


                    <button
                        className="mood-back-btn"
                        onClick={handleBack}
                    >

                        ← Back

                    </button>


                    <h1>

                        😊 Mood Conversation

                    </h1>


                    <button
                        className="mood-skip-btn"
                        onClick={handleSkip}
                    >

                        Skip →

                    </button>

                </div>


                {/* ==================================
                            PROGRESS
                ================================== */}

                <div className="mood-progress">

                    Conversation {current + 1} of{" "}
                    {conversations.length}

                </div>


                {/* ==================================
                        TOP CONVERSATION SECTION
                ================================== */}

                <div className="mood-top-section">


                    {/* ==================================
                                TEACHER
                    ================================== */}

                    <div className="mood-teacher-box">

                        <img
                            src={
                                conversations[current].teacher
                            }
                            alt="Teacher"
                            className={
                                isSpeaking
                                    ? "mood-teacher-img speaking"
                                    : "mood-teacher-img"
                            }
                        />

                    </div>


                    {/* ==================================
                            DIALOGUE BOX
                    ================================== */}

                    <div className="mood-speech-box">

                        <div className="mood-dialog">


                            {/* ==========================
                                    WAITER
                            ========================== */}

                            <div className="mood-speaker">

                                🍽️ Waiter

                            </div>


                            <p>

                                {
                                    conversations[current]
                                        .waiter
                                }

                            </p>


                            {/* ==========================
                                    CUSTOMER
                            ========================== */}

                            {showCustomer && (

                                <>

                                    <div className="mood-divider"></div>


                                    <div className="mood-speaker">

                                        🧒 Customer

                                    </div>


                                    <p>

                                        {
                                            conversations[current]
                                                .customer
                                        }

                                    </p>

                                </>

                            )}

                        </div>

                    </div>

                </div>


                {/* ==================================
                            LISTEN AGAIN
                ================================== */}

                <div className="mood-listen">

                    <button
                        className="listen-btn"
                        onClick={handleListenAgain}
                    >

                         Listen Again

                    </button>

                </div>


                {/* ==================================
                            QUESTION
                ================================== */}

                {showQuestion && (

                    <>

                        <div className="mood-question-box">

                            <h3>

                                 Listen Carefully

                            </h3>


                            <h2>

                                {
                                    conversations[current]
                                        .question
                                }

                            </h2>

                        </div>


                        {/* ==================================
                                ANSWER OPTIONS
                        ================================== */}

                        <div className="mood-options">

                            {
                                conversations[
                                    current
                                ].options.map(

                                    (option, index) => (

                                        <button
                                            key={index}
                                            className={
                                                getOptionClass(
                                                    option
                                                )
                                            }
                                            onClick={() =>
                                                handleAnswer(
                                                    option
                                                )
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
                                FEEDBACK
                        ================================== */}

                        {feedback !== "" && (

                            <div
                                className={
                                    feedback === "correct"
                                        ? "mood-feedback success"
                                        : "mood-feedback error"
                                }
                            >

                                {getFeedbackText()}

                            </div>

                        )}

                    </>

                )}

            </div>

        </div>

    );

}


export default MoodConversationActivity;