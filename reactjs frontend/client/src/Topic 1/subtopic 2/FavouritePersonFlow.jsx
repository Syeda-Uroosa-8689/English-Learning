import React, { useState } from "react";

/* =========================================
   INTRO FILES
========================================= */

import FavouritePersonIntro from "./FavouritePersonActivity1Intro";

import FavouritePersonActivity2Intro
    from "./FavouritePersonActivity2Intro";

import FavouritePersonActivity3Intro
    from "./FavouritePersonActivity3Intro";

import FavouritePersonActivity4Intro
    from "./FavouritePersonActivity4Intro";

import FavouritePersonActivity5Intro
    from "./FavouritePersonActivity5Intro";


/* =========================================
   ACTIVITY FILES
========================================= */

import FavouritePersonActivity1
    from "./FavouritePersonActivity1";

import FavouritePersonActivity2
    from "./FavouritePersonActivity2";

import FavouritePersonActivity3
    from "./FavouritePersonActivity3";

import FavouritePersonActivity4
    from "./FavouritePersonActivity4";

import FavouritePersonActivity5
    from "./FavouritePersonActivity5";


/* =========================================
   FAVOURITE PERSON FLOW
========================================= */

function FavouritePersonFlow({

    content,

    topicId,

    lessonId,

    userName,

    onFinish,

    onBack

}) {


    /* =========================================
       FLOW STEPS

       0 = Activity 1 Intro
       1 = Activity 1

       2 = Activity 2 Intro
       3 = Activity 2

       4 = Activity 3 Intro
       5 = Activity 3

       6 = Activity 4 Intro
       7 = Activity 4

       8 = Activity 5 Intro
       9 = Activity 5
    ========================================= */

    const [currentStep, setCurrentStep] =
        useState(0);


    /* =========================================
       NEXT / SKIP
    ========================================= */

    const handleNext = () => {

        /* Activity 1 complete */
        if (currentStep === 1) {

            setCurrentStep(2);

            return;

        }


        /* Activity 2 complete */
        if (currentStep === 3) {

            setCurrentStep(4);

            return;

        }


        /* Activity 3 complete */
        if (currentStep === 5) {

            setCurrentStep(6);

            return;

        }


        /* Activity 4 complete */
        if (currentStep === 7) {

            setCurrentStep(8);

            return;

        }


        /* Activity 5 complete */
        if (currentStep === 9) {

            if (onFinish) {

                onFinish();

            }

            return;

        }

    };


    /* =========================================
       INTRO FINISHED
    ========================================= */

    const handleIntroFinish = () => {


        /* Activity 1 Intro */
        if (currentStep === 0) {

            setCurrentStep(1);

            return;

        }


        /* Activity 2 Intro */
        if (currentStep === 2) {

            setCurrentStep(3);

            return;

        }


        /* Activity 3 Intro */
        if (currentStep === 4) {

            setCurrentStep(5);

            return;

        }


        /* Activity 4 Intro */
        if (currentStep === 6) {

            setCurrentStep(7);

            return;

        }


        /* Activity 5 Intro */
        if (currentStep === 8) {

            setCurrentStep(9);

            return;

        }

    };


    /* =========================================
       BACK BUTTON
       
       IMPORTANT:
       Back from ANY activity or intro
       goes directly to CALLING PAGE.

       It does NOT go to previous intro.
    ========================================= */

    const handleBack = () => {

        if (onBack) {

            onBack();

        }

    };


    /* =========================================
       COMMON PROPS
    ========================================= */

    const commonProps = {

        content,

        topicId,

        lessonId,

        userName,

        onNext: handleNext,

        onBack: handleBack

    };


    /* =========================================
       STEP 0
       ACTIVITY 1 INTRO
    ========================================= */

    if (currentStep === 0) {

        return (

            <FavouritePersonIntro

                onFinish={
                    handleIntroFinish
                }

                onBack={
                    handleBack
                }

            />

        );

    }


    /* =========================================
       STEP 1
       ACTIVITY 1
    ========================================= */

    if (currentStep === 1) {

        return (

            <FavouritePersonActivity1

                {...commonProps}

            />

        );

    }


    /* =========================================
       STEP 2
       ACTIVITY 2 INTRO
    ========================================= */

    if (currentStep === 2) {

        return (

            <FavouritePersonActivity2Intro

                onFinish={
                    handleIntroFinish
                }

                onBack={
                    handleBack
                }

            />

        );

    }


    /* =========================================
       STEP 3
       ACTIVITY 2
    ========================================= */

    if (currentStep === 3) {

        return (

            <FavouritePersonActivity2

                {...commonProps}

            />

        );

    }


    /* =========================================
       STEP 4
       ACTIVITY 3 INTRO
    ========================================= */

    if (currentStep === 4) {

        return (

            <FavouritePersonActivity3Intro

                onFinish={
                    handleIntroFinish
                }

                onBack={
                    handleBack
                }

            />

        );

    }


    /* =========================================
       STEP 5
       ACTIVITY 3
    ========================================= */

    if (currentStep === 5) {

        return (

            <FavouritePersonActivity3

                {...commonProps}

            />

        );

    }


    /* =========================================
       STEP 6
       ACTIVITY 4 INTRO
    ========================================= */

    if (currentStep === 6) {

        return (

            <FavouritePersonActivity4Intro

                onFinish={
                    handleIntroFinish
                }

                onBack={
                    handleBack
                }

            />

        );

    }


    /* =========================================
       STEP 7
       ACTIVITY 4
    ========================================= */

    if (currentStep === 7) {

        return (

            <FavouritePersonActivity4

                {...commonProps}

            />

        );

    }


    /* =========================================
       STEP 8
       ACTIVITY 5 INTRO
    ========================================= */

    if (currentStep === 8) {

        return (

            <FavouritePersonActivity5Intro

                onFinish={
                    handleIntroFinish
                }

                onBack={
                    handleBack
                }

            />

        );

    }


    /* =========================================
       STEP 9
       ACTIVITY 5
    ========================================= */

    if (currentStep === 9) {

        return (

            <FavouritePersonActivity5

                {...commonProps}

            />

        );

    }


    return null;

}


export default FavouritePersonFlow;