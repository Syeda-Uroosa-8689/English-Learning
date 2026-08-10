import React, { useEffect, useState } from "react";

import teacher1 from "./assets/teacher1.png";
import teacher2 from "./assets/teacher2.png";
import teacher3 from "./assets/teacher3.png";
import teacher4 from "./assets/teacher4.png";



function ConversationActivity({

    question,
    topicId,
    lessonId,
    userName,
    onNext,
    onBack

}){

    const teacherFrames=[

        teacher1,
        teacher2,
        teacher3,
        teacher4

    ];

    const remarks=[

        "Excellent!",
        "Very Good!",
        "Amazing!",
        "Fantastic!",
        "Great Job!",
        "Wonderful!",
        "Keep it up!"

    ];

    const [frame,setFrame]=useState(0);

    const [isSpeaking,setIsSpeaking]=useState(false);

    const [teacherReply,setTeacherReply]=useState("");

    const [displayText,setDisplayText]=useState("");

    const [history,setHistory]=useState([]);

    const [count,setCount]=useState(0);

    const [loading,setLoading]=useState(false);

    const [showNext,setShowNext]=useState(false);

    const [teacherRemark,setTeacherRemark]=useState("");

    /* ================= STOP TEACHER ================= */

    const stopTeacher=()=>{

        window.speechSynthesis.cancel();

        setIsSpeaking(false);

        setDisplayText("");

    };

    /* Stop speech when component closes */

    useEffect(()=>{

        return ()=>{

            stopTeacher();

        };

    },[]);

    /* Teacher animation */

    useEffect(()=>{

        if(!isSpeaking){

            setFrame(0);

            return;

        }

        const timer=setInterval(()=>{

            setFrame(prev=>

                (prev+1)%teacherFrames.length

            );

        },300);

        return ()=>clearInterval(timer);

    },[isSpeaking]);

    /* ================= TEACHER SPEAK ================= */

    const speak=(text,onFinish=null)=>{

        stopTeacher();

        setTeacherReply(text);

        setDisplayText("");

        setIsSpeaking(true);

        let i=0;

        const typing=setInterval(()=>{

            setDisplayText(

                text.substring(0,i+1)

            );

            i++;

            if(i>=text.length){

                clearInterval(typing);

            }

        },35);

        const speech=

            new SpeechSynthesisUtterance(text);

        speech.rate=0.9;

        speech.pitch=1.2;

        speech.volume=1;

        const voices=

            window.speechSynthesis.getVoices();

        speech.voice=

            voices.find(v=>v.name.includes("Zira")) ||

            voices.find(v=>v.name.includes("Samantha")) ||

            voices[0];

        speech.onend=()=>{

            clearInterval(typing);

            setDisplayText(text);

            setIsSpeaking(false);

            if(onFinish){

                onFinish();

            }

        };

        window.speechSynthesis.speak(speech);

    };

    useEffect(()=>{

        if(question?.question){

            speak(question.question);

        }

    },[question]);

        /* ================= MIC ================= */

    const startListening = () => {

        stopTeacher();

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

        recognition.onresult = (event) => {

            const spokenText =

                event.results[0][0].transcript;

            handleSubmit(spokenText);

        };

    };



    /* ================= SUBMIT ================= */

    const handleSubmit = async (spokenText) => {

        if (!spokenText) return;

        setLoading(true);

        try {

            const res = await fetch(

                "http://localhost:5000/api/chat",

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        message: spokenText,

                        history,

                        topicId,

                        lessonId,

                        userName

                    })

                }

            );

            const data = await res.json();

            setHistory(prev => [

                ...prev,

                {

                    sender: "user",

                    text: spokenText

                },

                {

                    sender: "teacher",

                    text: data.response

                }

            ]);

            const total = count + 1;

            setCount(total);

            if(total >= 5){

                const randomRemark =

                    remarks[

                        Math.floor(

                            Math.random() * remarks.length

                        )

                    ];

                setTeacherRemark(randomRemark);

                speak(

                    data.response,

                    ()=>{

                        speak(

                            randomRemark,

                            ()=>{

                                setShowNext(true);

                            }

                        );

                    }

                );

            }

            else{

                speak(data.response);

            }

        }

        catch(err){

            console.log(err);

            alert("Backend Error");

        }

        finally{

            setLoading(false);

        }

    };

        return(

        <div className="conversation-container">

            <div className="conversation-card">

                {/* ================= HEADER ================= */}

                <div className="conversation-header">

                    <button

                        className="conversation-back-btn"

                        onClick={()=>{

                            stopTeacher();

                            onBack();

                        }}

                    >

                        ← Back

                    </button>

                    <h1>

                        Conversation Activity

                    </h1>

                    <button

                        className="conversation-skip-btn"

                        onClick={()=>{

                            stopTeacher();

                            onNext();

                        }}

                    >

                        Skip →

                    </button>

                </div>

                {/* ================= TEACHER ================= */}

                <div className="conversation-teacher">

                    <img

                        src={teacherFrames[frame]}

                        alt="Teacher"

                        className={

                            isSpeaking

                            ?

                            "teacher-img speaking"

                            :

                            "teacher-img"

                        }

                    />

                    <div className="conversation-speech">

                        <h2>

                            Miss Uroosa

                        </h2>

                        <p>

                            {displayText}

                        </p>

                    </div>

                </div>

                {/* ================= MIC ================= */}

                <div className="conversation-buttons">

                    <button

                        className="conversation-mic-btn"

                        onClick={startListening}

                        disabled={loading}

                    >

                        {

                            loading

                            ?

                            "🎙️ Listening..."

                            :

                            "🎤 Tap to Speak"

                        }

                    </button>

                </div>

                {/* ================= FINISH ================= */}

                {

                    showNext && (

                        <div className="conversation-finish">

                            <div className="conversation-remark">

                                🌟 {teacherRemark}

                            </div>

                            <button

                                className="conversation-next-btn"

                                onClick={()=>{

                                    stopTeacher();

                                    onNext();

                                }}

                            >

                                Next Activity →

                            </button>

                        </div>

                    )

                }

            </div>

        </div>

    );

}

export default ConversationActivity;