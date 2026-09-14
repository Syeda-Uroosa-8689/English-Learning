import React, { useState } from "react";

import HobbiesIntro from "./HobbiesIntro";
import HobbiesTeacherIntro from "./HobbiesTeacherIntro";
import HobbiesActivity from "./HobbiesActivity";

import HobbyRankingIntro from "./HobbyRankingIntro";
import HobbyRankingTeacherIntro from "./HobbyRankingTeacherIntro";
import HobbyRankingActivity from "./HobbyRankingActivity";

import SentenceRepairLabIntro from "./SentenceRepairLabIntro";
import SentenceRepairLabTeacherIntro from "./SentenceRepairLabTeacherIntro";
import SentenceRepairLabActivity from "./SentenceRepairLabActivity";

import HobbyRoleplayIntro from "./HobbyRoleplayIntro";
import HobbyRoleplayTeacherIntro from "./HobbyRoleplayTeacherIntro";
import HobbyRoleplayActivity from "./HobbyRoleplayActivity";


function HobbiesFlow({
    content,
    onFinish,
    onBack
}) {

    const [step, setStep] = useState("intro");


    /* ==========================================
                HOBBIES INTRO → TEACHER
    ========================================== */

    const handleIntroFinish = () => {
        setStep("teacherIntro");
    };


    /* ==========================================
                TEACHER → HOBBIES ACTIVITY
    ========================================== */

    const handleTeacherNext = () => {
        setStep("activity");
    };


    /* ==========================================
          HOBBIES ACTIVITY → RANKING INTRO
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
       RANKING TEACHER → RANKING ACTIVITY
    ========================================== */

    const handleRankingTeacherNext = () => {
        setStep("rankingActivity");
    };


    /* ==========================================
       RANKING ACTIVITY → SENTENCE REPAIR INTRO
    ========================================== */

    const handleRankingActivityNext = () => {
        setStep("sentenceRepairIntro");
    };


    /* ==========================================
       SENTENCE REPAIR INTRO → TEACHER
    ========================================== */

    const handleSentenceRepairIntroNext = () => {
        setStep("sentenceRepairTeacherIntro");
    };


    /* ==========================================
       SENTENCE REPAIR TEACHER → ACTIVITY
    ========================================== */

    const handleSentenceRepairTeacherNext = () => {
        setStep("sentenceRepairActivity");
    };


    /* ==========================================
       SENTENCE REPAIR ACTIVITY → ROLEPLAY INTRO

       IMPORTANT:
       HobbyRoleplayIntro uses onFinish
    ========================================== */

    const handleSentenceRepairActivityNext = () => {
        setStep("roleplayIntro");
    };


    /* ==========================================
       ROLEPLAY INTRO → ROLEPLAY TEACHER

       HobbyRoleplayIntro prop = onFinish
    ========================================== */

    const handleRoleplayIntroFinish = () => {
        setStep("roleplayTeacherIntro");
    };


    /* ==========================================
       ROLEPLAY TEACHER → ROLEPLAY ACTIVITY
    ========================================== */

    const handleRoleplayTeacherNext = () => {
        setStep("roleplayActivity");
    };


    /* ==========================================
       ROLEPLAY ACTIVITY → LESSON COMPLETE
    ========================================== */

    const handleRoleplayActivityNext = () => {

        if (onFinish) {
            onFinish();
        }

    };


    /* ==========================================
                        FLOW
    ========================================== */

    return (
        <>


            {/* ======================================
                    1. HOBBIES INTRO
            ====================================== */}

            {step === "intro" && (

                <HobbiesIntro
                    onFinish={handleIntroFinish}
                    onBack={onBack}
                />

            )}


            {/* ======================================
                    2. HOBBIES TEACHER INTRO
            ====================================== */}

            {step === "teacherIntro" && (

                <HobbiesTeacherIntro
                    onNext={handleTeacherNext}
                    onBack={onBack}
                />

            )}


            {/* ======================================
                    3. HOBBIES ACTIVITY
            ====================================== */}

            {step === "activity" && (

                <HobbiesActivity
                    content={content}
                    onNext={handleActivityNext}
                    onBack={onBack}
                />

            )}


            {/* ======================================
                    4. HOBBY RANKING INTRO
            ====================================== */}

            {step === "rankingIntro" && (

                <HobbyRankingIntro
                    onStart={handleRankingIntroNext}
                    onBack={onBack}
                />

            )}


            {/* ======================================
                    5. HOBBY RANKING TEACHER INTRO
            ====================================== */}

            {step === "rankingTeacherIntro" && (

                <HobbyRankingTeacherIntro
                    onNext={handleRankingTeacherNext}
                    onBack={onBack}
                />

            )}


            {/* ======================================
                    6. HOBBY RANKING ACTIVITY
            ====================================== */}

            {step === "rankingActivity" && (

                <HobbyRankingActivity
                    content={content}
                    onNext={handleRankingActivityNext}
                    onBack={onBack}
                />

            )}


            {/* ======================================
                    7. SENTENCE REPAIR LAB INTRO
            ====================================== */}

            {step === "sentenceRepairIntro" && (

                <SentenceRepairLabIntro
                    onStart={handleSentenceRepairIntroNext}
                    onBack={onBack}
                />

            )}


            {/* ======================================
                    8. SENTENCE REPAIR LAB TEACHER
            ====================================== */}

            {step === "sentenceRepairTeacherIntro" && (

                <SentenceRepairLabTeacherIntro
                    onNext={handleSentenceRepairTeacherNext}
                    onBack={onBack}
                />

            )}


            {/* ======================================
                    9. SENTENCE REPAIR LAB ACTIVITY
            ====================================== */}

            {step === "sentenceRepairActivity" && (

                <SentenceRepairLabActivity
                    content={content}
                    onNext={handleSentenceRepairActivityNext}
                    onBack={onBack}
                />

            )}


            {/* ======================================
                    10. HOBBY ROLEPLAY INTRO
            ====================================== */}

            {step === "roleplayIntro" && (

                <HobbyRoleplayIntro
                    onFinish={handleRoleplayIntroFinish}
                    onBack={onBack}
                />

            )}


            {/* ======================================
                    11. HOBBY ROLEPLAY TEACHER INTRO
            ====================================== */}

            {step === "roleplayTeacherIntro" && (

                <HobbyRoleplayTeacherIntro
                    onNext={handleRoleplayTeacherNext}
                    onBack={onBack}
                />

            )}


            {/* ======================================
                    12. HOBBY ROLEPLAY ACTIVITY
            ====================================== */}

            {step === "roleplayActivity" && (

                <HobbyRoleplayActivity
                    content={content}
                    onNext={handleRoleplayActivityNext}
                    onBack={onBack}
                />

            )}

        </>
    );
}


export default HobbiesFlow;