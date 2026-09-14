import React, { useState } from "react";

import FinalChallenge2Intro from "./FinalChallenge2Intro";
import FinalChallenge2Activity from "./FinalChallenge2Activity";
import FinalChallenge2Result from "./FinalChallenge2Result";


function FinalChallenge2Flow({
    topicId,
    lessonId,
    userName,
    onNext,
    onBack
}) {

    /* =========================================
       FLOW STATES

       0 = INTRO
       1 = ACTIVITY
       2 = RESULT
    ========================================= */

    const [currentStep, setCurrentStep] =
        useState(0);


    /* =========================================
       FINAL RESULT DATA
    ========================================= */

    const [finalResult, setFinalResult] =
        useState(null);


    /* =========================================
       INTRO FINISHED

       INTRO → ACTIVITY
    ========================================= */

    const handleIntroFinish = () => {

        setCurrentStep(1);

    };


    /* =========================================
       ACTIVITY COMPLETED

       ACTIVITY → RESULT
    ========================================= */

    const handleActivityComplete = (result) => {

        console.log(
            "Final Challenge 2 Result:",
            result
        );

        setFinalResult(result);

        setCurrentStep(2);

    };


    /* =========================================
       BACK BUTTON
    ========================================= */

    const handleBack = () => {

        /* =====================================
           INTRO → CALLING PAGE
        ===================================== */

        if (currentStep === 0) {

            if (onBack) {
                onBack();
            }

            return;

        }


        /* =====================================
           ACTIVITY → INTRO
        ===================================== */

        if (currentStep === 1) {

            setCurrentStep(0);

            return;

        }


        /* =====================================
           RESULT → ACTIVITY
        ===================================== */

        if (currentStep === 2) {

            setCurrentStep(1);

            return;

        }

    };


    /* =========================================
       SKIP BUTTON

       INTRO → ACTIVITY
    ========================================= */

    const handleIntroSkip = () => {

        setCurrentStep(1);

    };


    /* =========================================
       SKIP FROM ACTIVITY

       ACTIVITY → RESULT

       If activity sends its current result,
       use that result.

       Otherwise create a safe result.
    ========================================= */

    const handleActivitySkip = (result) => {

        const skipResult = result || {

            score: 0,

            totalMarks: 25,

            obtainedMarks: 0,

            percentage: 0,

            grade: "Needs Practice",

            answers: [],

            mistakes: [],

            feedback:
                "You skipped the Final Challenge. Try again to show what you have learned."

        };

        setFinalResult(skipResult);

        setCurrentStep(2);

    };


    /* =========================================
       RETRY ACTIVITY

       RESULT → ACTIVITY
    ========================================= */

    const handleRetry = () => {

        setFinalResult(null);

        setCurrentStep(1);

    };


    /* =========================================
       FINISH FINAL CHALLENGE

       RESULT → CALLING PAGE / NEXT PAGE
    ========================================= */

    const handleFinish = () => {

        if (onNext) {
            onNext();
        }

    };


    /* =========================================
       STEP 0
       INTRO
    ========================================= */

    if (currentStep === 0) {

        return (

            <FinalChallenge2Intro

                onFinish={handleIntroFinish}

                onSkip={handleIntroSkip}

                onBack={handleBack}

            />

        );

    }


    /* =========================================
       STEP 1
       ACTIVITY

       FINAL CHALLENGE 2
       ALL CHALLENGES ARE INSIDE
       FinalChallenge2Activity.jsx

       Topic 2:
       All About My Partner

       Content covers:
       • Physical Appearance
       • Personality Traits
       • Likes & Dislikes
       ========================================= */

    if (currentStep === 1) {

        return (

            <FinalChallenge2Activity

                topicId={topicId}

                lessonId={lessonId}

                userName={userName}

                onNext={handleActivityComplete}

                onSkip={handleActivitySkip}

                onBack={handleBack}

            />

        );

    }


    /* =========================================
       STEP 2
       FINAL COMBINED RESULT

       ALL FINAL CHALLENGE 2 RESULTS
       APPEAR TOGETHER HERE
    ========================================= */

    if (currentStep === 2) {

        return (

            <FinalChallenge2Result

                result={finalResult}

                onNext={handleFinish}

                onRetry={handleRetry}

                onBack={handleBack}

            />

        );

    }


    return null;

}


export default FinalChallenge2Flow;