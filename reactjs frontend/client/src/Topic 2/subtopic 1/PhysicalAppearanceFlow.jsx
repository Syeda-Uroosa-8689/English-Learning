import React, { useState } from "react";

/* =====================================================
   ACTIVITY 1
===================================================== */

import PhysicalAppearanceActivity1Intro
    from "./PhysicalAppearanceActivity1Intro";

import PhysicalAppearanceActivity1
    from "./PhysicalAppearanceActivity1";


/* =====================================================
   ACTIVITY 2
===================================================== */

import PhysicalAppearanceActivity2Intro
    from "./PhysicalAppearanceActivity2Intro";

import PhysicalAppearanceActivity2
    from "./PhysicalAppearanceActivity2";


/* =====================================================
   ACTIVITY 3
===================================================== */

import PhysicalAppearanceActivity3Intro
    from "./PhysicalAppearanceActivity3Intro";

import PhysicalAppearanceActivity3
    from "./PhysicalAppearanceActivity3";


/* =====================================================
   FLOW
===================================================== */

function PhysicalAppearanceFlow({ onFinish, onBack }) {

    /*
        STEP VALUES

        -1 = Activity 1 Intro
         0 = Activity 1
         1 = Activity 2 Intro
         2 = Activity 2
         3 = Activity 3 Intro
         4 = Activity 3
    */

    const [currentStep, setCurrentStep] = useState(-1);


    /* =================================================
       ACTIVITY 1 INTRO FINISHED
    ================================================= */

    const handleActivity1IntroFinish = () => {

        setCurrentStep(0);

    };


    /* =================================================
       ACTIVITY 1 FINISHED
    ================================================= */

    const handleActivity1Finish = () => {

        setCurrentStep(1);

    };


    /* =================================================
       ACTIVITY 2 INTRO FINISHED
    ================================================= */

    const handleActivity2IntroFinish = () => {

        setCurrentStep(2);

    };


    /* =================================================
       ACTIVITY 2 FINISHED
    ================================================= */

    const handleActivity2Finish = () => {

        setCurrentStep(3);

    };


    /* =================================================
       ACTIVITY 3 INTRO FINISHED
    ================================================= */

    const handleActivity3IntroFinish = () => {

        setCurrentStep(4);

    };


    /* =================================================
       ACTIVITY 3 FINISHED
    ================================================= */

    const handleActivity3Finish = () => {

        if (onFinish) {

            onFinish();

        }

    };


    /* =================================================
       BACK TO CALLING PAGE
    ================================================= */

    const handleBackToCallingPage = () => {

        if (onBack) {

            onBack();

        }

    };


    /* =================================================
       RENDER
    ================================================= */

    return (

        <>

            {/* =========================================
                ACTIVITY 1 INTRO
            ========================================= */}

            {currentStep === -1 && (

                <PhysicalAppearanceActivity1Intro
                    onFinish={handleActivity1IntroFinish}
                    onBack={handleBackToCallingPage}
                />

            )}


            {/* =========================================
                ACTIVITY 1
            ========================================= */}

            {currentStep === 0 && (

                <PhysicalAppearanceActivity1
                    onFinish={handleActivity1Finish}
                    onBack={handleBackToCallingPage}
                />

            )}


            {/* =========================================
                ACTIVITY 2 INTRO
            ========================================= */}

            {currentStep === 1 && (

                <PhysicalAppearanceActivity2Intro
                    onFinish={handleActivity2IntroFinish}
                    onBack={handleBackToCallingPage}
                />

            )}


            {/* =========================================
                ACTIVITY 2
            ========================================= */}

            {currentStep === 2 && (

                <PhysicalAppearanceActivity2
                    onFinish={handleActivity2Finish}
                    onBack={handleBackToCallingPage}
                />

            )}


            {/* =========================================
                ACTIVITY 3 INTRO
            ========================================= */}

            {currentStep === 3 && (

                <PhysicalAppearanceActivity3Intro
                    onFinish={handleActivity3IntroFinish}
                    onBack={handleBackToCallingPage}
                />

            )}


            {/* =========================================
                ACTIVITY 3
            ========================================= */}

            {currentStep === 4 && (

                <PhysicalAppearanceActivity3
                    onFinish={handleActivity3Finish}
                    onBack={handleBackToCallingPage}
                />

            )}

        </>

    );

}


export default PhysicalAppearanceFlow;