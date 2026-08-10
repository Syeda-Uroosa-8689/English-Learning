import React, { useEffect, useState } from "react";

import teacher from "./assets/teacher1.png";
import chatBg from "./assets/chatbg.jpeg";

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

const speak = (text) => {

    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    setTeacherMessage(text);

    setIsSpeaking(true);

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";

    speech.rate = 0.9;

    speech.pitch = 1.05;

    speech.volume = 1;

    const voices = window.speechSynthesis.getVoices();

    /* ==========================================
        FEMALE VOICE ONLY
    ========================================== */

    const femaleVoice =
        voices.find(v =>
            /Google UK English Female/i.test(v.name)
        ) ||

        voices.find(v =>
            /Google US English/i.test(v.name)
        ) ||

        voices.find(v =>
            /Samantha/i.test(v.name)
        ) ||

        voices.find(v =>
            /Zira/i.test(v.name)
        ) ||

        voices.find(v =>
            /Microsoft.*Jenny/i.test(v.name)
        ) ||

        voices.find(v =>
            /Microsoft.*Aria/i.test(v.name)
        );

    /*
        IMPORTANT:
        Female voice nahi mili to voices[0]
        use nahi karenge.
    */

    if (femaleVoice) {

        speech.voice = femaleVoice;

    }

    speech.onend = () => {

        setIsSpeaking(false);

    };

    speech.onerror = () => {

        setIsSpeaking(false);

    };

    window.speechSynthesis.speak(speech);

};
    /* ==========================================
                LOAD ROUND
    ========================================== */

    useEffect(() => {

        setCards(

            [...currentConversation].sort(

                () => Math.random() - 0.5

            )

        );

        setAnswers(

            Array(currentConversation.length).fill("")

        );

        speak(

            `Conversation ${round + 1}. Drag the sentences into the correct order.`

        );

    }, [round]);

    useEffect(() => {

        return () => {

            window.speechSynthesis.cancel();

        };

    }, []);

        /* ==========================================
                DRAG START
    ========================================== */

    const handleDragStart = (sentence) => {

        setDragItem(sentence);

    };

    /* ==========================================
                DRAG OVER
    ========================================== */

    const handleDragOver = (e) => {

        e.preventDefault();

    };

    /* ==========================================
                DROP
    ========================================== */

    const handleDrop = (index) => {

        if (!dragItem) return;

        if (answers[index] !== "") return;

        /* ---------- Wrong Position ---------- */

        if (dragItem !== currentConversation[index]) {

            speak(

                "Oops! That's not the correct order. Try again."

            );

            setDragItem(null);

            return;

        }

        /* ---------- Correct Position ---------- */

        const updatedAnswers = [...answers];

        updatedAnswers[index] = dragItem;

        setAnswers(updatedAnswers);

        setCards(

            cards.filter(

                item => item !== dragItem

            )

        );

        speak("Excellent!");

        /* ---------- Check Round ---------- */

        const completed = updatedAnswers.every(

            item => item !== ""

        );

        if (completed) {

            if (round < conversations.length - 1) {

                setTimeout(() => {

                    speak(

                        "Excellent! Let's continue with the next conversation."

                    );

                }, 700);

                setTimeout(() => {

                    setRound(prev => prev + 1);

                }, 2200);

            }

            else {

                setTimeout(() => {

                    speak(

                        "Fantastic! You completed all restaurant conversations."

                    );

                    setFinished(true);

                }, 800);

            }

        }

        setDragItem(null);

    };

    /* ==========================================
                TEACHER MESSAGE
    ========================================== */

    const instruction = teacherMessage;

        /* ==========================================
                    UI
    ========================================== */

    return(

    <div
        className="arrange-page"
        style={{
            backgroundImage:`url(${chatBg})`
        }}
    >

        <div className="arrange-overlay"></div>

        <div className="arrange-card">

            {/* ================= HEADER ================= */}

            <div className="arrange-header">

                <button
                    className="arrange-back-btn"
                    onClick={onBack}
                >
                    ← Back
                </button>

                <div className="arrange-header-logo">

                    💬

                </div>

                <button
                    className="arrange-skip-btn"
                    onClick={onNext}
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
                        marginTop:"8px",
                        color:"#8A6B2D",
                        fontWeight:"600"
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

                        currentConversation.map((sentence,index)=>(

                            <div

                                key={index}

                                className="arrange-drop-box"

                                onDragOver={handleDragOver}

                                onDrop={()=>handleDrop(index)}

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

                                            {index+1}.

                                        </span>

                                        Drop dialogue here...

                                    </div>

                                }

                            </div>

                        ))

                    }

                </div>

                {/* ================= RIGHT ================= */}

                <div className="arrange-right">

                    <h2>

                        Drag These Dialogues

                    </h2>

                    <div className="arrange-card-list">

                        {

                            cards.map((sentence,index)=>(

                                <div

                                    key={index}

                                    className="arrange-sentence-card"

                                    draggable

                                    onDragStart={()=>

                                        handleDragStart(sentence)

                                    }

                                >

                                    ☰ {sentence}

                                </div>

                            ))

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