import React, { useState } from "react";

/* =========================================
   FAVOURITE PLACE INTRO FILES
========================================= */

import FavouritePlaceActivity1Intro
    from "./FavouritePlaceActivity1Intro";

import FavouritePlaceActivity2Intro
    from "./FavouritePlaceActivity2Intro";

import FavouritePlaceActivity3Intro
    from "./FavouritePlaceActivity3Intro";


/* =========================================
   FAVOURITE PLACE ACTIVITY FILES
========================================= */

import FavouritePlaceActivity1
    from "./FavouritePlaceActivity1";

import FavouritePlaceActivity2
    from "./FavouritePlaceActivity2";

import FavouritePlaceActivity3
    from "./FavouritePlaceActivity3";


/* =========================================
   FAVOURITE PLACE FLOW

   0 = Activity 1 Intro
   1 = Activity 1

   2 = Activity 2 Intro
   3 = Activity 2

   4 = Activity 3 Intro
   5 = Activity 3
========================================= */

function FavouritePlaceFlow({
    content,
    topicId,
    lessonId,
    userName,
    onFinish,
    onBack
}) {

    const [currentStep, setCurrentStep] = useState(0);

    const [isCompleted, setIsCompleted] = useState(false);


    /* =========================================
       NEXT
    ========================================= */

    const handleNext = () => {

        setCurrentStep((previousStep) => {

            if (previousStep >= 5) {
                return previousStep;
            }

            return previousStep + 1;

        });

    };


    /* =========================================
       COMPLETE FLOW
    ========================================= */

    const handleFlowComplete = () => {

        if (isCompleted) {
            return;
        }

        setIsCompleted(true);

        if (typeof onFinish === "function") {
            onFinish();
        }

    };


    /* =========================================
       BACK

       ALWAYS GO BACK TO CHAT PAGE
    ========================================= */

    const handleBack = () => {

        console.log(
            "FavouritePlaceFlow BACK called"
        );

        if (typeof onBack === "function") {

            onBack();

        }

    };


    /* =========================================
       STEP 0
    ========================================= */

    if (currentStep === 0) {

        return (
            <FavouritePlaceActivity1Intro
                onFinish={handleNext}
                onNext={handleNext}
                onBack={handleBack}
            />
        );

    }


    /* =========================================
       STEP 1
    ========================================= */

    if (currentStep === 1) {

        return (
            <FavouritePlaceActivity1
                content={content}
                topicId={topicId}
                lessonId={lessonId}
                userName={userName}
                onNext={handleNext}
                onBack={handleBack}
            />
        );

    }


    /* =========================================
       STEP 2
    ========================================= */

    if (currentStep === 2) {

        return (
            <FavouritePlaceActivity2Intro
                onFinish={handleNext}
                onNext={handleNext}
                onBack={handleBack}
            />
        );

    }


    /* =========================================
       STEP 3
    ========================================= */

    if (currentStep === 3) {

        return (
            <FavouritePlaceActivity2
                content={content}
                topicId={topicId}
                lessonId={lessonId}
                userName={userName}
                onNext={handleNext}
                onBack={handleBack}
            />
        );

    }


    /* =========================================
       STEP 4
    ========================================= */

    if (currentStep === 4) {

        return (
            <FavouritePlaceActivity3Intro
                onFinish={handleNext}
                onNext={handleNext}
                onBack={handleBack}
            />
        );

    }


    /* =========================================
       STEP 5
    ========================================= */

    if (currentStep === 5) {

        return (
            <FavouritePlaceActivity3
                content={content}
                topicId={topicId}
                lessonId={lessonId}
                userName={userName}

                onNext={handleFlowComplete}

                onFinish={handleFlowComplete}

                onBack={handleBack}
            />
        );

    }


    return null;

}


export default FavouritePlaceFlow;