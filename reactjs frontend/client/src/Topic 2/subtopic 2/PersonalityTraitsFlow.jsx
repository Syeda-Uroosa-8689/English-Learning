import { useState } from "react";

import TraitDetectiveIntro from "./TraitDetectiveIntro";
import TraitDetectiveActivity from "./TraitDetectiveActivity";

import PersonalityBackpackIntro from "./PersonalityBackpackIntro";
import PersonalityBackpackActivity from "./PersonalityBackpackActivity";

import PersonalityPotionIntro from "./PersonalityPotionIntro";
import PersonalityPotionActivity from "./PersonalityPotionActivity";


function PersonalityTraitsFlow({
    onBack,
    onFinish
}) {

    const [currentScreen, setCurrentScreen] =
        useState("intro1");


    /* =====================================================
       GO BACK TO CALLING PAGE
    ===================================================== */

    const goToCallingPage = () => {

        if (typeof onBack === "function") {
            onBack();
        }

    };


    /* =====================================================
       INTRO 1 FINISH
       INTRO 1
          ↓
       ACTIVITY 1
    ===================================================== */

    const handleIntro1Finish = () => {

        setCurrentScreen("activity1");

    };


    /* =====================================================
       ACTIVITY 1 FINISH
       ACTIVITY 1
          ↓
       INTRO 2
    ===================================================== */

    const handleActivity1Finish = () => {

        setCurrentScreen("intro2");

    };


    /* =====================================================
       INTRO 2 FINISH
       INTRO 2
          ↓
       ACTIVITY 2
    ===================================================== */

    const handleIntro2Finish = () => {

        setCurrentScreen("activity2");

    };


    /* =====================================================
       ACTIVITY 2 FINISH
       ACTIVITY 2
          ↓
       INTRO 3
    ===================================================== */

    const handleActivity2Finish = () => {

        setCurrentScreen("intro3");

    };


    /* =====================================================
       INTRO 3 FINISH
       INTRO 3
          ↓
       ACTIVITY 3
    ===================================================== */

    const handleIntro3Finish = () => {

        setCurrentScreen("activity3");

    };


    /* =====================================================
       ACTIVITY 3 FINISH
       ACTIVITY 3
          ↓
       LESSON COMPLETE
    ===================================================== */

    const handleActivity3Finish = () => {

        if (typeof onFinish === "function") {

            onFinish();

        }

    };


    /* =====================================================
       SCREEN FLOW
    ===================================================== */

    return (
        <>

            {/* =================================================
                INTRO 1
            ================================================= */}

            {currentScreen === "intro1" && (

                <TraitDetectiveIntro

                    onFinish={handleIntro1Finish}

                    onBack={goToCallingPage}

                />

            )}


            {/* =================================================
                ACTIVITY 1
            ================================================= */}

            {currentScreen === "activity1" && (

                <TraitDetectiveActivity

                    onFinish={handleActivity1Finish}

                    onBack={goToCallingPage}

                />

            )}


            {/* =================================================
                INTRO 2
            ================================================= */}

            {currentScreen === "intro2" && (

                <PersonalityBackpackIntro

                    onFinish={handleIntro2Finish}

                    onBack={goToCallingPage}

                />

            )}


            {/* =================================================
                ACTIVITY 2
            ================================================= */}

            {currentScreen === "activity2" && (

                <PersonalityBackpackActivity

                    onFinish={handleActivity2Finish}

                    onBack={goToCallingPage}

                />

            )}


            {/* =================================================
                INTRO 3
            ================================================= */}

            {currentScreen === "intro3" && (

                <PersonalityPotionIntro

                    onFinish={handleIntro3Finish}

                    onBack={goToCallingPage}

                />

            )}


            {/* =================================================
                ACTIVITY 3
            ================================================= */}

            {currentScreen === "activity3" && (

                <PersonalityPotionActivity

                    onFinish={handleActivity3Finish}

                    onBack={goToCallingPage}

                />

            )}

        </>
    );

}


export default PersonalityTraitsFlow;