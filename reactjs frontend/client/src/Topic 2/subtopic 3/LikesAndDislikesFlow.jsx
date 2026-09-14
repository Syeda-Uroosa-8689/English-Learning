import { useState } from "react";

/* =====================================================
   PARTNER SECRET ROOM
===================================================== */

import PartnerSecretRoomIntro from "./PartnerSecretRoomIntro";
import PartnerSecretRoomActivity from "./PartnerSecretRoomActivity";

/* =====================================================
   PREFERENCE THEME PARK
===================================================== */

import PreferenceThemeParkIntro from "./PreferenceThemeParkIntro";
import PreferenceThemeParkActivity from "./PreferenceThemeParkActivity";

/* =====================================================
   MYSTERY GIFT MISSION
===================================================== */

import MysteryGiftMissionIntro from "./MysteryGiftMissionIntro";
import MysteryGiftMissionActivity from "./MysteryGiftMissionActivity";

/* =====================================================
   GAME SHOW
===================================================== */

import GameShowGuessMyPreferenceIntro
    from "./GameShowGuessMyPreferenceIntro";

import GameShowGuessMyPreferenceActivity
    from "./GameShowGuessMyPreferenceActivity";

/* =====================================================
   SPACE PREFERENCE
===================================================== */

import SpacePreferenceIntro from "./SpacePreferenceIntro";
import SpacePreferenceActivity from "./SpacePreferenceActivity";


function LikesAndDislikesFlow({
    onBack,
    onFinish
}) {

    const [currentScreen, setCurrentScreen] =
        useState("intro1");


    /* =====================================================
       DIRECT BACK TO CALLING PAGE
       
       Har activity ka Back button yahi call karega.
    ===================================================== */

    const handleActivityBack = () => {

        if (typeof onBack === "function") {
            onBack();
        }

    };


    /* =====================================================
       INTRO 1 FINISH
       
       PARTNER SECRET ROOM INTRO
              ↓
       PARTNER SECRET ROOM ACTIVITY
    ===================================================== */

    const handleIntro1Finish = () => {

        setCurrentScreen("activity1");

    };


    /* =====================================================
       ACTIVITY 1 FINISH
       
       PARTNER SECRET ROOM ACTIVITY
              ↓
       PREFERENCE THEME PARK INTRO
    ===================================================== */

    const handleActivity1Finish = () => {

        setCurrentScreen("intro2");

    };


    /* =====================================================
       ACTIVITY 1 SKIP
       
       PARTNER SECRET ROOM ACTIVITY
              ↓
       PREFERENCE THEME PARK INTRO
    ===================================================== */

    const handleActivity1Skip = () => {

        setCurrentScreen("intro2");

    };


    /* =====================================================
       INTRO 2 FINISH
       
       PREFERENCE THEME PARK INTRO
              ↓
       PREFERENCE THEME PARK ACTIVITY
    ===================================================== */

    const handleIntro2Finish = () => {

        setCurrentScreen("activity2");

    };


    /* =====================================================
       ACTIVITY 2 FINISH
       
       PREFERENCE THEME PARK ACTIVITY
              ↓
       MYSTERY GIFT MISSION INTRO
    ===================================================== */

    const handleActivity2Finish = () => {

        setCurrentScreen("intro3");

    };


    /* =====================================================
       ACTIVITY 2 SKIP
       
       PREFERENCE THEME PARK ACTIVITY
              ↓
       MYSTERY GIFT MISSION INTRO
    ===================================================== */

    const handleActivity2Skip = () => {

        setCurrentScreen("intro3");

    };


    /* =====================================================
       INTRO 3 FINISH
       
       MYSTERY GIFT MISSION INTRO
              ↓
       MYSTERY GIFT MISSION ACTIVITY
    ===================================================== */

    const handleIntro3Finish = () => {

        setCurrentScreen("activity3");

    };


    /* =====================================================
       ACTIVITY 3 FINISH
       
       MYSTERY GIFT MISSION ACTIVITY
              ↓
       GAME SHOW INTRO
    ===================================================== */

    const handleActivity3Finish = () => {

        setCurrentScreen("intro4");

    };


    /* =====================================================
       ACTIVITY 3 SKIP
       
       MYSTERY GIFT MISSION ACTIVITY
              ↓
       GAME SHOW INTRO
    ===================================================== */

    const handleActivity3Skip = () => {

        setCurrentScreen("intro4");

    };


    /* =====================================================
       INTRO 4 FINISH
       
       GAME SHOW INTRO
              ↓
       GAME SHOW ACTIVITY
    ===================================================== */

    const handleIntro4Finish = () => {

        setCurrentScreen("activity4");

    };


    /* =====================================================
       ACTIVITY 4 FINISH
       
       GAME SHOW ACTIVITY
              ↓
       SPACE PREFERENCE INTRO
    ===================================================== */

    const handleActivity4Finish = () => {

        setCurrentScreen("intro5");

    };


    /* =====================================================
       ACTIVITY 4 SKIP
       
       GAME SHOW ACTIVITY
              ↓
       SPACE PREFERENCE INTRO
    ===================================================== */

    const handleActivity4Skip = () => {

        setCurrentScreen("intro5");

    };


    /* =====================================================
       INTRO 5 FINISH
       
       SPACE PREFERENCE INTRO
              ↓
       SPACE PREFERENCE ACTIVITY
    ===================================================== */

    const handleIntro5Finish = () => {

        setCurrentScreen("activity5");

    };


    /* =====================================================
       ACTIVITY 5 FINISH
       
       SPACE PREFERENCE ACTIVITY
              ↓
       LESSON COMPLETE
    ===================================================== */

    const handleActivity5Finish = () => {

        if (typeof onFinish === "function") {
            onFinish();
        }

    };


    /* =====================================================
       ACTIVITY 5 SKIP
       
       LAST ACTIVITY
              ↓
       LESSON COMPLETE
    ===================================================== */

    const handleActivity5Skip = () => {

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
                Partner Secret Room Intro
            ================================================= */}

            {currentScreen === "intro1" && (

                <PartnerSecretRoomIntro

                    onFinish={handleIntro1Finish}

                />

            )}


            {/* =================================================
                ACTIVITY 1
                Partner Secret Room
            ================================================= */}

            {currentScreen === "activity1" && (

                <PartnerSecretRoomActivity

                    onFinish={handleActivity1Finish}

                    onBack={handleActivityBack}

                    onSkip={handleActivity1Skip}

                />

            )}


            {/* =================================================
                INTRO 2
                Preference Theme Park
            ================================================= */}

            {currentScreen === "intro2" && (

                <PreferenceThemeParkIntro

                    onFinish={handleIntro2Finish}

                />

            )}


            {/* =================================================
                ACTIVITY 2
                Preference Theme Park
            ================================================= */}

            {currentScreen === "activity2" && (

                <PreferenceThemeParkActivity

                    onFinish={handleActivity2Finish}

                    onBack={handleActivityBack}

                    onSkip={handleActivity2Skip}

                />

            )}


            {/* =================================================
                INTRO 3
                Mystery Gift Mission
            ================================================= */}

            {currentScreen === "intro3" && (

                <MysteryGiftMissionIntro

                    onFinish={handleIntro3Finish}

                />

            )}


            {/* =================================================
                ACTIVITY 3
                Mystery Gift Mission
            ================================================= */}

            {currentScreen === "activity3" && (

                <MysteryGiftMissionActivity

                    onFinish={handleActivity3Finish}

                    onBack={handleActivityBack}

                    onSkip={handleActivity3Skip}

                />

            )}


            {/* =================================================
                INTRO 4
                Game Show Guess My Preference
            ================================================= */}

            {currentScreen === "intro4" && (

                <GameShowGuessMyPreferenceIntro

                    onFinish={handleIntro4Finish}

                />

            )}


            {/* =================================================
                ACTIVITY 4
                Game Show Guess My Preference
            ================================================= */}

            {currentScreen === "activity4" && (

                <GameShowGuessMyPreferenceActivity

                    onFinish={handleActivity4Finish}

                    onBack={handleActivityBack}

                    onSkip={handleActivity4Skip}

                />

            )}


            {/* =================================================
                INTRO 5
                Space Preference
            ================================================= */}

            {currentScreen === "intro5" && (

                <SpacePreferenceIntro

                    onFinish={handleIntro5Finish}

                />

            )}


            {/* =================================================
                ACTIVITY 5
                Space Preference
            ================================================= */}

            {currentScreen === "activity5" && (

                <SpacePreferenceActivity

                    onFinish={handleActivity5Finish}

                    onBack={handleActivityBack}

                    onSkip={handleActivity5Skip}

                />

            )}

        </>
    );

}


export default LikesAndDislikesFlow;