import React, { useState } from "react";

import RestaurantIntro from "./RestaurantIntro";

import AIWaiterChatIntro from "./AIWaiterChatIntro";
import AIWaiterChatActivity from "./AIWaiterChatActivity";

import MenuMatchingIntro from "./MenuMatchingIntro";
import MenuMatchingActivity from "./MenuMatchingActivity";

import ArrangeConversationIntro from "./ArrangeConversationIntro";
import ArrangeConversationActivity from "./ArrangeConversationActivity";

import MoodConversationIntro from "./MoodConversationIntro";
import MoodConversationActivity from "./MoodConversationActivity";

import RestaurantQuizIntro from "./RestaurantQuizIntro";
import RestaurantQuizActivity from "./RestaurantQuizActivity";

import LessonComplete from "./LessonComplete";


function RestaurantConversationFlow({

    content,
    topicId,
    lessonId,
    userName,
    onFinish,
    onBack

}) {


    /*
    ==================================================
                    FLOW STEPS
    ==================================================

    -1 = Restaurant Intro
     0 = AI Waiter
     1 = Menu Matching
     2 = Arrange Conversation
     3 = Mood Conversation
     4 = Restaurant Quiz
     5 = Lesson Completed
    */

    const [currentStep, setCurrentStep] = useState(-1);


    /*
    ==================================================
                    INTRO STATES
    ==================================================
    */

    const [showAIIntro, setShowAIIntro] =
        useState(false);

    const [showMenuIntro, setShowMenuIntro] =
        useState(false);

    const [showArrangeIntro, setShowArrangeIntro] =
        useState(false);

    const [showMoodIntro, setShowMoodIntro] =
        useState(false);

    const [showQuizIntro, setShowQuizIntro] =
        useState(false);


    /*
    ==================================================
                    NEXT STEP
    ==================================================
    */

    const nextStep = () => {


        /* ------------------------------------------
                    AI WAITER → MENU
        ------------------------------------------ */

        if (currentStep === 0) {

            setCurrentStep(1);

            setShowMenuIntro(true);

            return;

        }


        /* ------------------------------------------
                    MENU → ARRANGE
        ------------------------------------------ */

        if (currentStep === 1) {

            setCurrentStep(2);

            setShowArrangeIntro(true);

            return;

        }


        /* ------------------------------------------
                    ARRANGE → MOOD
        ------------------------------------------ */

        if (currentStep === 2) {

            setCurrentStep(3);

            setShowMoodIntro(true);

            return;

        }


        /* ------------------------------------------
                    MOOD → QUIZ
        ------------------------------------------ */

        if (currentStep === 3) {

            setCurrentStep(4);

            setShowQuizIntro(true);

            return;

        }


        /* ------------------------------------------
                    QUIZ → COMPLETE
        ------------------------------------------ */

        if (currentStep === 4) {

            setCurrentStep(5);

            return;

        }


        /*
            Safety fallback
        */

        if (currentStep < 4) {

            setCurrentStep(
                prev => prev + 1
            );

        }

    };


    /*
    ==================================================
                        RETURN
    ==================================================
    */

    return (

        <div className="restaurant-flow">


            {/* ========================================
                    RESTAURANT INTRO
            ======================================== */}

            {
                currentStep === -1 && (

                    <RestaurantIntro

                        onFinish={() => {

                            setShowAIIntro(true);

                        }}

                    />

                )
            }


            {/* ========================================
                    AI WAITER INTRO
            ======================================== */}

            {
                showAIIntro && (

                    <AIWaiterChatIntro

                        onFinish={() => {

                            setShowAIIntro(false);

                            setCurrentStep(0);

                        }}

                    />

                )
            }


            {/* ========================================
                    AI WAITER ACTIVITY
            ======================================== */}

            {
                currentStep === 0 &&
                !showAIIntro &&
                !showMenuIntro && (

                    <AIWaiterChatActivity

                        topicId={topicId}

                        lessonId={lessonId}

                        userName={userName}

                        onNext={nextStep}

                        onBack={onBack}

                    />

                )
            }


            {/* ========================================
                    MENU MATCHING INTRO
            ======================================== */}

            {
                showMenuIntro && (

                    <MenuMatchingIntro

                        onFinish={() => {

                            setShowMenuIntro(false);

                            setCurrentStep(1);

                        }}

                    />

                )
            }


            {/* ========================================
                    MENU MATCHING ACTIVITY
            ======================================== */}

            {
                currentStep === 1 &&
                !showMenuIntro &&
                !showArrangeIntro && (

                    <MenuMatchingActivity

                        onNext={nextStep}

                        onBack={onBack}

                    />

                )
            }


            {/* ========================================
                    ARRANGE CONVERSATION INTRO
            ======================================== */}

            {
                showArrangeIntro && (

                    <ArrangeConversationIntro

                        onFinish={() => {

                            setShowArrangeIntro(false);

                            setCurrentStep(2);

                        }}

                    />

                )
            }


            {/* ========================================
                    ARRANGE CONVERSATION ACTIVITY
            ======================================== */}

            {
                currentStep === 2 &&
                !showArrangeIntro &&
                !showMoodIntro && (

                    <ArrangeConversationActivity

                        onNext={nextStep}

                        onBack={onBack}

                    />

                )
            }


            {/* ========================================
                    MOOD CONVERSATION INTRO
            ======================================== */}

            {
                showMoodIntro && (

                    <MoodConversationIntro

                        onFinish={() => {

                            setShowMoodIntro(false);

                            setCurrentStep(3);

                        }}

                    />

                )
            }


            {/* ========================================
                    MOOD CONVERSATION ACTIVITY
            ======================================== */}

            {
                currentStep === 3 &&
                !showMoodIntro &&
                !showQuizIntro && (

                    <MoodConversationActivity

                        onNext={nextStep}

                        onBack={onBack}

                    />

                )
            }


            {/* ========================================
                    RESTAURANT QUIZ INTRO
            ======================================== */}

            {
                showQuizIntro && (

                    <RestaurantQuizIntro

                        onFinish={() => {

                            setShowQuizIntro(false);

                            setCurrentStep(4);

                        }}

                    />

                )
            }


            {/* ========================================
                    RESTAURANT QUIZ ACTIVITY
            ======================================== */}
{
    currentStep === 4 &&
    !showQuizIntro && (

        <RestaurantQuizActivity

            onNext={nextStep}

            onBack={onBack}

            onSkip={() => {

                setCurrentStep(5);

            }}

        />

    )
}
            {/* ========================================
                    LESSON COMPLETE POPUP
            ======================================== */}
{
    currentStep === 5 && (

        <LessonComplete

            onFinish={() => {

                onFinish();

            }}

        />

    )
}


        </div>

    );

}


export default RestaurantConversationFlow;