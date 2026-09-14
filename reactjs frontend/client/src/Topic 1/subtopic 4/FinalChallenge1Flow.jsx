
import React, { useState } from "react";

import FinalChallenge1Intro from "./FinalChallenge1Intro";
import FinalChallenge1Activity from "./FinalChallenge1Activity";
import FinalChallenge1Result from "./FinalChallenge1Result";


function FinalChallenge1Flow({
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

       RECEIVES:
       - score
       - totalMarks
       - obtainedMarks
       - percentage
       - grade
       - all 5 answers
       - grammar mistakes
       - result ID
    ========================================= */

    const handleActivityComplete = (result) => {

        console.log(
            "Final Challenge 1 Result:",
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
           INTRO → PREVIOUS PAGE
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

           NOTE:
           This returns to activity UI.
           Retry button will properly restart.
        ===================================== */

        if (currentStep === 2) {

            setCurrentStep(1);

            return;

        }

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

       RESULT → NEXT PAGE
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

            <FinalChallenge1Intro

                onFinish={handleIntroFinish}

                onBack={handleBack}

            />

        );

    }


    /* =========================================
       STEP 1
       ACTIVITY

       ALL 5 CHALLENGES ARE INSIDE:
       FinalChallenge1Activity.jsx

       Challenge 1
       → backend check

       Challenge 2
       → backend check

       Challenge 3
       → backend check

       Challenge 4
       → backend check

       Challenge 5
       → backend check

       Then:
       → save complete result
    ========================================= */

    if (currentStep === 1) {

        return (

            <FinalChallenge1Activity

                topicId={topicId}

                lessonId={lessonId}

                userName={userName}

                onNext={handleActivityComplete}

                onBack={handleBack}

            />

        );

    }


    /* =========================================
       STEP 2
       FINAL COMBINED RESULT

       ALL 5 CHALLENGES RESULT
       APPEARS TOGETHER HERE
    ========================================= */

    if (currentStep === 2) {

        return (

            <FinalChallenge1Result

                result={finalResult}

                onNext={handleFinish}

                onRetry={handleRetry}

                onBack={handleBack}

            />

        );

    }


    return null;

}


export default FinalChallenge1Flow;

