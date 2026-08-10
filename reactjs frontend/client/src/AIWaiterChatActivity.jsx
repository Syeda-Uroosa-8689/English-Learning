import React, { useState, useEffect } from "react";

import waiter from "./assets/waiter.jpeg";


import chatBg from "./assets/chatbg.jpeg";

function AIWaiterChatActivity({

    topicId,
    lessonId,
    userName,
    onNext,
    onBack

}) {

    /* ==============================
            Waiter Animation
    ============================== */

    const waiterFrames = [

    waiter

];

    /* ==============================
            Restaurant Conversation
    ============================== */

    const conversation = [

        {

            waiter:
                "Welcome to our restaurant. May I take your order?",

            answers: [

                "I would like a pizza please",

                "Can I have a pizza please",

                "Pizza please",

                "I want pizza"

            ]

        },

        {

            waiter:
                "What would you like to drink?",

            answers: [

                "Water please",

                "Orange juice please",

                "Juice please",

                "Coke please"

            ]

        },

        {

            waiter:
                "Would you like anything else?",

            answers: [

                "No thank you",

                "That's all",

                "Nothing else"

            ]

        }

    ];

    /* ==============================
            States
    ============================== */

    const [frame, setFrame] = useState(0);

    const [step, setStep] = useState(0);

    const [teacherMessage, setTeacherMessage] = useState("");

    const [studentText, setStudentText] = useState("");

    const [history, setHistory] = useState([]);

    const [isSpeaking, setIsSpeaking] = useState(false);

    const [showMic, setShowMic] = useState(false);

    const [loading, setLoading] = useState(false);

    const [conversationFinished, setConversationFinished] = useState(false);

    /* ==============================
        Waiter Talking Animation
    ============================== */

    useEffect(() => {

        if (!isSpeaking) {

            setFrame(0);

            return;

        }

        const timer = setInterval(() => {

            setFrame(prev =>

                (prev + 1) % waiterFrames.length

            );

        }, 250);

        return () => clearInterval(timer);

    }, [isSpeaking]);

    /* ==============================
            First Question
    ============================== */

    useEffect(() => {

        setTeacherMessage(

            conversation[0].waiter

        );

    }, []);

        /* ==============================
            Teacher Voice
    ============================== */

    const speak = (text) => {

        window.speechSynthesis.cancel();

        setTeacherMessage(text);

        setIsSpeaking(true);

        const speech = new SpeechSynthesisUtterance(text);

        speech.rate = 0.9;

        speech.pitch = 1.1;

        speech.volume = 1;
const voices = window.speechSynthesis.getVoices();

const maleVoice =
    voices.find(v => v.name.includes("Google UK English Male")) ||
    voices.find(v => v.name.includes("David")) ||
    voices.find(v => v.name.includes("Alex")) ||
    voices[0];

speech.voice = maleVoice;

        speech.onend = () => {

            setIsSpeaking(false);

            setShowMic(true);

        };

        window.speechSynthesis.speak(speech);

    };

    /* ==============================
            Start First Question
    ============================== */

    useEffect(() => {

        speak(conversation[0].waiter);

    }, []);

    /* ==============================
        Speech Recognition
    ============================== */

    const startListening = () => {

        const SpeechRecognition =

            window.SpeechRecognition ||

            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {

            alert("Speech Recognition is not supported.");

            return;

        }

        const recognition = new SpeechRecognition();

        recognition.lang = "en-US";

        recognition.interimResults = false;

        recognition.maxAlternatives = 1;

        recognition.start();

        setShowMic(false);

        recognition.onresult = async (event) => {

            const answer = event.results[0][0].transcript;

            setStudentText(answer);

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

                            message: answer,

                            history,

                            topicId,

                            lessonId,

                            userName,
                            activity: "restaurant-ai",

                        })

                    }

                );

                const data = await response.json();

                const updatedHistory = [

                    ...history,

                    {

                        sender: "user",

                        text: answer

                    },

                    {

                        sender: "teacher",

                        text: data.response

                    }

                ];

                setHistory(updatedHistory);

                checkAnswer(answer, data.response);

            }

            catch (err) {

                console.log(err);

                alert("Backend Error");

                setShowMic(true);

            }

            finally {

                setLoading(false);

            }

        };

        recognition.onerror = () => {

            setShowMic(true);

        };

    };

    /* ==============================
        Check Conversation
    ============================== */

    const checkAnswer = (answer, aiReply) => {

        const current = conversation[step];

        const lower = answer.toLowerCase();

        const correct = current.answers.some(item =>

            lower.includes(item.toLowerCase())

        );

        if (correct) {

            if (step < conversation.length - 1) {

                const nextStep = step + 1;

                setStep(nextStep);

                setTimeout(() => {

                    speak(

                        conversation[nextStep].waiter

                    );

                }, 1000);

            }

            else {

                setConversationFinished(true);

                setTimeout(() => {

                    speak(

                        "Excellent! You completed the restaurant conversation."

                    );

                }, 800);

            }

        }

        else {

            speak(aiReply);

        }

    };

    /* ==============================
        Cleanup
    ============================== */

    useEffect(() => {

        return () => {

            window.speechSynthesis.cancel();

        };

    }, []);

    return (

<div
className="restaurant-chat-page"
style={{
backgroundImage:`url(${chatBg})`
}}
>

<div className="restaurant-overlay"></div>

<div className="restaurant-card">

{/* ================= Header ================= */}

<div className="restaurant-header">

<button
className="restaurant-back-btn"
onClick={onBack}
>
← Back
</button>

<div className="restaurant-header-right">

<button
    className="restaurant-skip-btn"
    onClick={() => {
        window.speechSynthesis.cancel();
        onNext();
    }}
>
    Skip →
</button>

{
conversationFinished && (

<button

className="restaurant-next-btn"

onClick={onNext}

>

Next →

</button>

)

}

</div>

</div>

{/* ================= Content ================= */}

<div className="restaurant-content">

{/* LEFT */}

<div className="waiter-panel">

<div className="waiter-frame">

<img

src={waiterFrames[frame]}

alt="AI Waiter"

className={
isSpeaking
?
"waiter-img speaking"
:
"waiter-img"
}

/>

</div>

<div className="waiter-badge">

AI WAITER

</div>

</div>

{/* RIGHT */}

<div className="conversation-panel">

<div className="assistant-info">

<div className="assistant-avatar">

👨🏻‍🍳

</div>

<div>

<h2>

AI Waiter

</h2>

<p>

Restaurant Assistant

</p>

</div>

</div>

<div className="speech-card">

<div className="speaker-icon">

🔊

</div>

<p>

{

teacherMessage ||

conversation[step]?.waiter

}

</p>

</div>

<div className="student-card">

<strong>

👤 You

</strong>

<p>

{

history.length===0

?

"Tap the microphone and answer."

:

history[history.length-2]?.text

}

</p>

</div>

<div className="mic-section">

{

!conversationFinished &&

showMic && (

<button

className="restaurant-mic-btn"

onClick={startListening}

>

🎤

</button>

)

}

</div>

{

conversationFinished && (

<div className="finish-card">

<h2>

🎉 Excellent!

</h2>

<p>

You completed this conversation.

</p>

</div>

)

}

</div>

</div>

</div>

</div>

);
}
export default AIWaiterChatActivity;