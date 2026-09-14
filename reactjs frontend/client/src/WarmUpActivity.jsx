import React, { useEffect, useState } from "react";

import teacher1 from "./assets/teacher1.png";
import teacher2 from "./assets/teacher2.png";
import teacher3 from "./assets/teacher3.png";
import teacher4 from "./assets/teacher4.png";

import confetti from "canvas-confetti";
import yaySound from "./assets/yay.mp3";

function WarmUpActivity({

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

    const [frame,setFrame]=useState(0);

    const [teacherMessage,setTeacherMessage]=useState("");

    const [isSpeaking,setIsSpeaking]=useState(false);

    const [loading,setLoading]=useState(false);

    const [history,setHistory]=useState([]);

    /* ==========================
       Teacher Animation
    ========================== */

    useEffect(()=>{

        if(!isSpeaking){

            setFrame(0);

            return;

        }

        const timer=setInterval(()=>{

            setFrame(prev=>

                (prev+1)%teacherFrames.length

            );

        },250);

        return()=>clearInterval(timer);

    },[isSpeaking]);

    /* ==========================
       Teacher Voice + Typing
    ========================== */

    const speak=(text)=>{

        window.speechSynthesis.cancel();

        setTeacherMessage("");

        setIsSpeaking(true);

        let index=0;

        const typing=setInterval(()=>{

            index++;

            setTeacherMessage(

                text.substring(0,index)

            );

            if(index>=text.length){

                clearInterval(typing);

            }

        },35);

        const speech=

        new SpeechSynthesisUtterance(text);

        speech.rate=0.9;

        speech.pitch=1.1;

        speech.volume=1;

        const voices=

        window.speechSynthesis.getVoices();

        speech.voice=

        voices.find(v=>v.name.includes("Zira")) ||

        voices.find(v=>v.name.includes("Samantha")) ||

        voices[0];

        speech.onend=()=>{

            setIsSpeaking(false);

        };

        window.speechSynthesis.speak(speech);

    };

    /* ==========================
       YAY SOUND
    ========================== */

    const playYaySound = () => {

        const audio = new Audio(yaySound);

        audio.volume = 1;

        audio.play().catch((err) => {

            console.log("Yay sound could not play:", err);

        });

    };

    /* ==========================
       CONFETTI
    ========================== */

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

                origin: {
                    x: 0.85,
                    y: 0.65
                }

            });

        }, 300);

    };

    /* ==========================
       First Question
    ========================== */

    useEffect(()=>{

        if(question){

            speak(question.question);

        }

    },[question]);

    /* ==========================
       Speech Recognition
    ========================== */

    const startListening=()=>{

        const SpeechRecognition=

        window.SpeechRecognition ||

        window.webkitSpeechRecognition;

        if(!SpeechRecognition){

            alert("Speech Recognition not supported");

            return;

        }

        const recognition=new SpeechRecognition();

        recognition.lang="en-US";

        recognition.interimResults=false;

        recognition.maxAlternatives=1;

        recognition.start();

        recognition.onresult=async(event)=>{

            const spokenText=

            event.results[0][0].transcript;

            setLoading(true);

            try{

                const response=await fetch(

                    `${import.meta.env.VITE_API_URL}/api/chat`,

                    {

                        method:"POST",

                        headers:{

                            "Content-Type":"application/json"

                        },

                        body:JSON.stringify({

                            message:spokenText,

                            history,

                            topicId,

                            lessonId,

                            userName

                        })

                    }

                );

                const data=await response.json();

                /* ==========================
                   CORRECT / ACCEPTED ANSWER
                   CONFETTI + YAY
                ========================== */

                celebrate();

                playYaySound();

                /* ==========================
                   TEACHER RESPONSE
                ========================== */

                speak(data.response);

                setHistory(prev=>[

                    ...prev,

                    {

                        sender:"user",

                        text:spokenText

                    },

                    {

                        sender:"teacher",

                        text:data.response

                    }

                ]);

            }

            catch(err){

                console.log(err);

                alert("Backend Error");

            }

            finally{

                setLoading(false);

            }

        };

    };

    useEffect(()=>{

        return()=>{

            window.speechSynthesis.cancel();

        };

    },[]);

    return(

        <div className="warmup-container">

            <div className="warmup-card">

                {/* ================= Top Bar ================= */}

                <div className="warmup-header">

                    <button

                        className="warm-back-btn"

                        onClick={onBack}

                    >

                        ← Back

                    </button>

                    <button

                        className="warm-skip-btn"

                        onClick={onNext}

                    >

                        Skip →

                    </button>

                </div>

                {/* ================= Teacher ================= */}

                <div className="teacher-area">

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

                </div>

                {/* ================= Speech ================= */}

                <div className="speech-box">

                    <p>

                        {

                            teacherMessage ||

                            question.question

                        }

                    </p>

                </div>

                {/* ================= Mic ================= */}

                <div className="mic-area">

                    <button

                        className="mic-btn"

                        onClick={startListening}

                        disabled={loading}

                    >

                        {loading ? "..." : "🎙️"}

                    </button>

                </div>

            </div>

        </div>

    );

}

export default WarmUpActivity;