
import React, { useState } from "react";

import FinalChallenge4Intro from "./FinalChallenge4Intro";
import FinalChallenge4Activity from "./FinalChallenge4Activity";
import FinalChallenge4Result from "./FinalChallenge4Result";


function FinalChallenge4Flow({
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
            "Final Challenge 4 Result:",
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
       SKIP INTRO

       INTRO → ACTIVITY
    ========================================= */

    const handleIntroSkip = () => {

        setCurrentStep(1);

    };


    /* =========================================
       SKIP ACTIVITY

       ACTIVITY → RESULT
    ========================================= */

    const handleActivitySkip = (result) => {

        const skipResult =
            result || {

                score: 0,

                totalMarks: 25,

                obtainedMarks: 0,

                percentage: 0,

                grade:
                    "Needs Improvement",

                answers: [],

                mistakes: [],

                grammarMistakes: [],

                feedback:
                    "You skipped the Final Calendar Challenge. Try again to show what you have learned."

            };


        setFinalResult(
            skipResult
        );

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

       RESULT → CALLING PAGE
    ========================================= */

    const handleFinish = () => {

        if (onNext) {

            onNext(
                finalResult
            );

        }

    };


    /* =========================================
       STEP 0
       INTRO
    ========================================= */

    if (currentStep === 0) {

        return (

            <FinalChallenge4Intro

                onFinish={
                    handleIntroFinish
                }

                onSkip={
                    handleIntroSkip
                }

                onBack={
                    handleBack
                }

            />

        );

    }


    /* =========================================
       STEP 1
       ACTIVITY

       FINAL CHALLENGE 4

       Topic 4:
       On My Calendar

       Covers:

       • Days & Months
       • My Daily Routine
       • Making Plans

       5 Questions × 5 Marks = 25
    ========================================= */

    if (currentStep === 1) {

        return (

            <FinalChallenge4Activity

                topicId={
                    topicId
                }

                lessonId={
                    lessonId
                }

                userName={
                    userName
                }

                onNext={
                    handleActivityComplete
                }

                onSkip={
                    handleActivitySkip
                }

                onBack={
                    handleBack
                }

            />

        );

    }


    /* =========================================
       STEP 2
       FINAL RESULT

       ALL FINAL CHALLENGE 4
       RESULTS APPEAR HERE
    ========================================= */

    if (currentStep === 2) {

        return (

            <FinalChallenge4Result

                result={
                    finalResult
                }

                onNext={
                    handleFinish
                }

                onRetry={
                    handleRetry
                }

                onBack={
                    handleBack
                }

            />

        );

    }


    return null;

}


export default FinalChallenge4Flow;
