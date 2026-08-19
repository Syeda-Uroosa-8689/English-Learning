import React, { useState } from "react";

import HobbiesIntro from "./HobbiesIntro";
import HobbiesTeacherIntro from "./HobbiesTeacherIntro";
import HobbiesActivity from "./HobbiesActivity";

import HobbyRankingIntro from "./HobbyRankingIntro";
import HobbyRankingTeacherIntro from "./HobbyRankingTeacherIntro";


function HobbiesFlow({
    content,
    onFinish,
    onBack
}) {

    const [step, setStep] =
        useState("intro");


    /* ==========================================
                HOBBIES INTRO → TEACHER
    ========================================== */

    const handleIntroFinish = () => {

        setStep("teacherIntro");

    };


    /* ==========================================
                TEACHER → ACTIVITY
    ========================================== */

    const handleTeacherNext = () => {

        setStep("activity");

    };


    /* ==========================================
                ACTIVITY → RANKING INTRO
    ========================================== */

    const handleActivityNext = () => {

        setStep("rankingIntro");

    };


    /* ==========================================
             RANKING INTRO → RANKING TEACHER
    ========================================== */

    const handleRankingIntroNext = () => {

        setStep("rankingTeacherIntro");

    };


    /* ==========================================
             RANKING TEACHER → NEXT ACTIVITY
    ========================================== */

    const handleRankingTeacherNext = () => {

        onFinish();

    };


    return (

        <>

            {/* ======================================
                    1. HOBBIES INTRO
            ====================================== */}

            {step === "intro" && (

                <HobbiesIntro
                    onFinish={
                        handleIntroFinish
                    }
                    onBack={onBack}
                />

            )}


            {/* ======================================
                    2. HOBBIES TEACHER INTRO
            ====================================== */}

            {step === "teacherIntro" && (

                <HobbiesTeacherIntro
                    onNext={
                        handleTeacherNext
                    }
                    onBack={onBack}
                />

            )}


            {/* ======================================
                    3. WHICH SENTENCE ACTIVITY
            ====================================== */}

            {step === "activity" && (

                <HobbiesActivity
                    content={content}
                    onNext={
                        handleActivityNext
                    }
                    onBack={onBack}
                />

            )}


            {/* ======================================
                    4. HOBBY RANKING INTRO
            ====================================== */}

            {step === "rankingIntro" && (

                <HobbyRankingIntro
                    onStart={
                        handleRankingIntroNext
                    }
                    onBack={onBack}
                />

            )}


            {/* ======================================
                    5. HOBBY RANKING TEACHER INTRO
            ====================================== */}

            {step === "rankingTeacherIntro" && (

                <HobbyRankingTeacherIntro
                    onNext={
                        handleRankingTeacherNext
                    }
                    onBack={onBack}
                />

            )}

        </>

    );

}


export default HobbiesFlow;