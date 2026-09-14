import React, { useEffect, useState } from "react";

import teacher from "./assets/teacher1.png";
import chatBg from "./assets/chatbg.jpeg";
import yaySound from "./assets/yay.mp3";

import confetti from "canvas-confetti";

function ArrangeConversationActivity({

    onNext,
    onBack

}) {

    /* ==========================================
                ALL CONVERSATIONS
    ========================================== */

    const conversations = [

        [

            "🍽️ Waiter: Welcome! May I take your order?",

            "🧒 Customer: I would like a pizza, please.",

            "🍽️ Waiter: Would you like something to drink?",

            "🧒 Customer: Yes, orange juice, please.",

            "🍽️ Waiter: Your order will be ready soon."

        ],

        [

            "🍽️ Waiter: Here is your pizza.",

            "🍽️ Waiter: Here is your orange juice.",

            "🧒 Customer: Thank you very much.",

            "🍽️ Waiter: Enjoy your meal!",

            "🧒 Customer: Thank you!"

        ],

        [

            "🍽️ Waiter: Hello! Welcome to our restaurant.",

            "🧒 Customer: Can I see the menu, please?",

            "🍽️ Waiter: Of course. Here is the menu.",

            "🧒 Customer: I would like a burger, please.",

            "🍽️ Waiter: Certainly! Your burger will be ready soon."

        ],

        [

            "🍽️ Waiter: Would you like dessert?",

            "🧒 Customer: Yes, an ice cream please.",

            "🍽️ Waiter: Here is your ice cream.",

            "🧒 Customer: It looks delicious!",

            "🍽️ Waiter: Have a wonderful day!"

        ]

    ];

    /* ==========================================
                STATES
    ========================================== */

    const [round, setRound] = useState(0);

    const currentConversation = conversations[round];

    const [cards, setCards] = useState([]);

    const [answers, setAnswers] = useState([]);

    const [dragItem, setDragItem] = useState(null);

    const [teacherMessage, setTeacherMessage] = useState(
        "Drag the conversation into the correct order."
    );

    const [isSpeaking, setIsSpeaking] = useState(false);

    const [finished, setFinished] = useState(false);

    /*
       IMPORTANT

       celebrationRunning = true

       Iske time par user doosra card
       drag/drop nahi kar sakta.
    */

    const [celebrationRunning, setCelebrationRunning] =
        useState(false);

    /* ==========================================
                LOAD VOICES
    ========================================== */

    useEffect(() => {

        const loadVoices = () => {

            window.speechSynthesis.getVoices();

        };

        loadVoices();

        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {

            window.speechSynthesis.onvoiceschanged = null;

            window.speechSynthesis.cancel();

        };

    }, []);

    /* ==========================================
                TEACHER VOICE
    ========================================== */

    const speak = (text, onFinish = null) => {

        if (!window.speechSynthesis) {

            if (onFinish) {

                onFinish();

            }

            return;

        }

        window.speechSynthesis.cancel();

        setTeacherMessage(text);

        setIsSpeaking(true);

        const speech =
            new SpeechSynthesisUtterance(text);

        speech.lang = "en-US";

        speech.rate = 0.9;

        speech.pitch = 1.05;

        speech.volume = 1;

        const voices =
            window.speechSynthesis.getVoices();

        /* ==========================================
            FEMALE VOICE ONLY
        ========================================== */

        const femaleVoice =

            voices.find(v =>
                /Google UK English Female/i.test(v.name)
            )

            ||

            voices.find(v =>
                /Google US English/i.test(v.name)
            )

            ||

            voices.find(v =>
                /Samantha/i.test(v.name)
            )

            ||

            voices.find(v =>
                /Zira/i.test(v.name)
            )

            ||

            voices.find(v =>
                /Microsoft.*Jenny/i.test(v.name)
            )

            ||

            voices.find(v =>
                /Microsoft.*Aria/i.test(v.name)
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

        speech.onerror = () => {

            setIsSpeaking(false);

            if (onFinish) {

                onFinish();

            }

        };

        window.speechSynthesis.speak(speech);

    };

    /* ==========================================
            PLAY YAY SOUND
    ========================================== */

    const playYaySound = () => {

        return new Promise((resolve) => {

            const audio = new Audio(yaySound);

            audio.volume = 1;

            let resolved = false;

            const finish = () => {

                if (resolved) return;

                resolved = true;

                resolve();

            };

            audio.onended = finish;

            audio.onerror = finish;

            try {

                const promise = audio.play();

                if (promise) {

                    promise.catch(() => {

                        finish();

                    });

                }

            }

            catch (error) {

                console.log(
                    "Yay sound error:",
                    error
                );

                finish();

            }

        });

    };

    /* ==========================================
            CONFETTI
    ========================================== */

    const playConfetti = () => {

        confetti({

            particleCount: 180,

            spread: 100,

            startVelocity: 45,

            origin: {
                y: 0.65
            }

        });

        /* Second small burst */

        setTimeout(() => {

            confetti({

                particleCount: 100,

                spread: 120,

                startVelocity: 35,

                origin: {
                    x: 0.2,
                    y: 0.7
                }

            });

            confetti({

                particleCount: 100,

                spread: 120,

                startVelocity: 35,

                origin: {
                    x: 0.8,
                    y: 0.7
                }

            });

        }, 250);

    };

    /* ==========================================
            ROUND CELEBRATION

            IMPORTANT:

            LAST CORRECT MATCH
            ↓
            CONFETTI
            ↓
            YAY SOUND COMPLETE
            ↓
            TEACHER VOICE COMPLETE
            ↓
            NEXT ROUND
    ========================================== */

    const celebrateRoundComplete = async () => {

        if (celebrationRunning) return;

        setCelebrationRunning(true);

        setDragItem(null);

        /* ==============================
             CONFETTI
        ============================== */

        playConfetti();

        /* ==============================
             YAY SOUND

             Pura sound finish hone ka
             wait hoga.
        ============================== */

        await playYaySound();

        /* ==============================
             FINAL ROUND
        ============================== */

        if (round === conversations.length - 1) {

            speak(

                "Fantastic! You completed all restaurant conversations.",

                () => {

                    setCelebrationRunning(false);

                    setFinished(true);

                }

            );

            return;

        }

        /* ==============================
             NEXT ROUND VOICE
        ============================== */

        speak(

            "Excellent! Let's continue with the next conversation.",

            () => {

                /*
                   Teacher voice completely
                   finish hone ke baad hi
                   next conversation load hogi.
                */

                setTimeout(() => {

                    setRound(prev => prev + 1);

                    setCelebrationRunning(false);

                }, 300);

            }

        );

    };

    /* ==========================================
                LOAD ROUND
    ========================================== */

    useEffect(() => {

        const shuffled = [...currentConversation].sort(

            () => Math.random() - 0.5

        );

        setCards(shuffled);

        setAnswers(

            Array(currentConversation.length).fill("")

        );

        setDragItem(null);

        /*
           New round start hone par
           celebration false rahega.
        */

        setCelebrationRunning(false);

        speak(

            `Conversation ${round + 1}. Drag the sentences into the correct order.`

        );

    }, [round]);

    /* ==========================================
                CLEANUP
    ========================================== */

    useEffect(() => {

        return () => {

            window.speechSynthesis.cancel();

        };

    }, []);

    /* ==========================================
                DRAG START
    ========================================== */

    const handleDragStart = (sentence) => {

        /*
           Celebration ke time drag
           completely disabled.
        */

        if (celebrationRunning || finished) {

            return;

        }

        setDragItem(sentence);

    };

    /* ==========================================
                DRAG OVER
    ========================================== */

    const handleDragOver = (e) => {

        if (celebrationRunning || finished) {

            return;

        }

        e.preventDefault();

    };

    /* ==========================================
                DROP
    ========================================== */

    const handleDrop = (index) => {

        /*
           Celebration ke time koi
           drop allowed nahi.
        */

        if (celebrationRunning || finished) {

            return;

        }

        if (!dragItem) return;

        if (answers[index] !== "") {

            setDragItem(null);

            return;

        }

        /* ======================================
                WRONG POSITION
        ====================================== */

        if (dragItem !== currentConversation[index]) {

            speak(

                "Oops! That's not the correct order. Try again."

            );

            setDragItem(null);

            return;

        }

        /* ======================================
                CORRECT POSITION
        ====================================== */

        const updatedAnswers = [...answers];

        updatedAnswers[index] = dragItem;

        setAnswers(updatedAnswers);

        setCards(

            cards.filter(

                item => item !== dragItem

            )

        );

        setDragItem(null);

        /* ======================================
                CHECK COMPLETE ROUND
        ====================================== */

        const completed = updatedAnswers.every(

            item => item !== ""

        );

        /*
           IMPORTANT:

           Sirf LAST correct match par
           celebration hoga.

           Har normal correct match par
           koi confetti / yay nahi.
        */

        if (completed) {

            celebrateRoundComplete();

        }

    };

    /* ==========================================
                SKIP
    ========================================== */

    const handleSkip = () => {

        if (celebrationRunning) {

            return;

        }

        window.speechSynthesis.cancel();

        setCelebrationRunning(false);

        if (onNext) {

            onNext();

        }

    };

    /* ==========================================
                BACK
    ========================================== */

    const handleBack = () => {

        if (celebrationRunning) {

            return;

        }

        window.speechSynthesis.cancel();

        if (onBack) {

            onBack();

        }

    };

    /* ==========================================
                TEACHER MESSAGE
    ========================================== */

    const instruction = teacherMessage;

    /* ==========================================
                    UI
    ========================================== */

    return (

        <div
            className="arrange-page"
            style={{
                backgroundImage: `url(${chatBg})`
            }}
        >

            <div className="arrange-overlay"></div>

            <div className="arrange-card">

                {/* ================= HEADER ================= */}

                <div className="arrange-header">

                    <button
                        className="arrange-back-btn"
                        onClick={handleBack}
                        disabled={celebrationRunning}
                    >
                        ← Back
                    </button>

                    <button
                        className="arrange-skip-btn"
                        onClick={handleSkip}
                        disabled={celebrationRunning}
                    >
                        Skip →
                    </button>

                </div>

                {/* ================= TITLE ================= */}

                <div className="arrange-title">

                    <h1>

                        ARRANGE CONVERSATION

                    </h1>

                    <h3
                        style={{
                            marginTop: "8px",
                            color: "#8A6B2D",
                            fontWeight: "600"
                        }}
                    >

                        Conversation {round + 1} of {conversations.length}

                    </h3>

                </div>

                {/* ================= TEACHER ================= */}

                <div className="arrange-top-section">

                    <div className="arrange-teacher-box">

                        <img

                            src={teacher}

                            alt="Teacher"

                            className={

                                isSpeaking

                                    ?

                                    "arrange-teacher-img speaking"

                                    :

                                    "arrange-teacher-img"

                            }

                        />

                    </div>

                    <div className="arrange-speech-box">

                        <div className="arrange-speech-arrow"></div>

                        <p>

                            {instruction}

                        </p>

                    </div>

                </div>

                {/* ================= MAIN ================= */}

                <div className="arrange-bottom-section">

                    {/* ================= LEFT ================= */}

                    <div className="arrange-left">

                        {

                            currentConversation.map(

                                (sentence, index) => (

                                    <div

                                        key={index}

                                        className="arrange-drop-box"

                                        onDragOver={handleDragOver}

                                        onDrop={() =>
                                            handleDrop(index)
                                        }

                                    >

                                        {

                                            answers[index]

                                                ?

                                                <div className="arrange-answer">

                                                    {answers[index]}

                                                </div>

                                                :

                                                <div className="arrange-placeholder">

                                                    <span>

                                                        {index + 1}.

                                                    </span>

                                                    Drop dialogue here...

                                                </div>

                                        }

                                    </div>

                                )

                            )

                        }

                    </div>

                    {/* ================= RIGHT ================= */}

                    <div className="arrange-right">

                        <h2>

                            Drag These Dialogues

                        </h2>

                        <div className="arrange-card-list">

                            {

                                cards.map(

                                    (sentence, index) => (

                                        <div

                                            key={index}

                                            className="arrange-sentence-card"

                                            draggable={
                                                !celebrationRunning &&
                                                !finished
                                            }

                                            onDragStart={() =>
                                                handleDragStart(sentence)
                                            }

                                        >

                                            ☰ {sentence}

                                        </div>

                                    )

                                )

                            }

                        </div>

                    </div>

                </div>

                {/* ================= FINISH POPUP ================= */}

                {

                    finished && (

                        <div className="arrange-finish-overlay">

                            <div className="arrange-finish-card">

                                <h2>

                                    🎉 Excellent!

                                </h2>

                                <p>

                                    Congratulations!

                                    <br />

                                    You completed all restaurant conversations successfully.

                                </p>

                                <button

                                    className="arrange-next-btn"

                                    onClick={onNext}

                                >

                                    Next →

                                </button>

                            </div>

                        </div>

                    )

                }

            </div>

        </div>

    );

}

export default ArrangeConversationActivity;