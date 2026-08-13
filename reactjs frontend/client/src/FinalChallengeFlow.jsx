import React, { useState } from "react";

import FinalChallengeIntro from "./FinalChallengeIntro";
import FinalChallenge from "./FinalChallenge";
import FinalChallengeResult from "./FinalChallengeResult";


function FinalChallengeFlow({
    topicId,
    lessonId,
    userName,
    onNext,
    onBack
}) {

    /*
    =========================================
    FLOW STATES

    0 = Final Challenge Intro
    1 = Final Challenge
    2 = Final Challenge Result
    =========================================
    */

    const [currentStep, setCurrentStep] = useState(0);

    const [finalResult, setFinalResult] = useState(null);


    /*
    =========================================
    INTRO FINISHED
    =========================================
    */

    const handleIntroFinish = () => {

        setCurrentStep(1);

    };


    /*
    =========================================
    FINAL CHALLENGE COMPLETED
    =========================================
    */

    const handleChallengeComplete = (result) => {

        console.log(
            "Final Challenge Result:",
            result
        );

        setFinalResult(result);

        setCurrentStep(2);

    };


    /*
    =========================================
    BACK BUTTON
    =========================================
    */

    const handleBack = () => {

        /*
        =====================================
        FROM FINAL CHALLENGE
        DIRECTLY GO BACK TO CALLING PAGE
        =====================================
        */

        if (currentStep === 1) {

            if (onBack) {

                onBack();

            }

            return;

        }


        /*
        =====================================
        FROM INTRO
        GO BACK TO CALLING PAGE
        =====================================
        */

        if (currentStep === 0) {

            if (onBack) {

                onBack();

            }

            return;

        }


        /*
        =====================================
        FROM RESULT
        GO BACK TO FINAL CHALLENGE
        =====================================
        */

        if (currentStep === 2) {

            setCurrentStep(1);

            return;

        }

    };


    /*
    =========================================
    FINISH FINAL CHALLENGE
    =========================================
    */

    const handleFinish = () => {

        if (onNext) {

            onNext();

        }

    };


    /*
    =========================================
    STEP 0
    FINAL CHALLENGE INTRO
    =========================================
    */

    if (currentStep === 0) {

        return (

            <FinalChallengeIntro

                onFinish={handleIntroFinish}

            />

        );

    }


    /*
    =========================================
    STEP 1
    FINAL CHALLENGE
    =========================================
    */

    if (currentStep === 1) {

        return (

            <FinalChallenge

                topicId={topicId}

                lessonId={lessonId}

                userName={userName}

                onNext={handleChallengeComplete}

                onBack={handleBack}

            />

        );

    }


    /*
    =========================================
    STEP 2
    FINAL CHALLENGE RESULT
    =========================================
    */

    if (currentStep === 2) {

        return (

            <FinalChallengeResult

                result={finalResult}

                topicId={topicId}

                lessonId={lessonId}

                userName={userName}

                onNext={handleFinish}

                onBack={handleBack}

            />

        );

    }


    return null;

}


export default FinalChallengeFlow;