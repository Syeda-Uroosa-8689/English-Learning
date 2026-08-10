import React, { useState } from "react";

import WarmUpIntro from "./WarmUpIntro";
import WarmUpActivity from "./WarmUpActivity";

import SortingIntro from "./SortingIntro";
import SortingActivity from "./SortingActivity";

import ConversationIntro from "./ConversationIntro";
import ConversationActivity from "./ConversationActivity";

/* Picture Description */
import PictureDescriptionIntro from "./PictureDescriptionIntro";
import PictureDescriptionActivity from "./PictureDescriptionActivity";

function FoodFlow({

    content,
    topicId,
    lessonId,
    userName,
    onFinish,
    onBack

}){

    // -1 = WarmUp Intro
    // 0 = WarmUp
    // 1 = Sorting
    // 2 = Conversation
    // 3 = Assessment

    const [currentStep, setCurrentStep] = useState(-1);

    const [showSortingIntro, setShowSortingIntro] = useState(false);

    const [showConversationIntro, setShowConversationIntro] = useState(false);

   const [showPictureIntro, setShowPictureIntro] = useState(false);

    const nextStep = () => {

        // WarmUp → Sorting Intro
        if(currentStep===0){

            setShowSortingIntro(true);

            return;

        }

        // Sorting → Conversation Intro
        if(currentStep===1){

            setShowConversationIntro(true);

            return;

        }


      // Conversation → Picture Description Intro
if(currentStep===2){

    setShowPictureIntro(true);

    return;

}

        // Finish
        if(currentStep<3){

            setCurrentStep(prev=>prev+1);

        }

        else{

            onFinish();

        }

    };

    return(

        <div className="food-flow">

            {/* ================= WarmUp Intro ================= */}

            {

                currentStep===-1 && (

                    <WarmUpIntro

                        onFinish={() => setCurrentStep(0)}

                    />

                )

            }

            {/* ================= WarmUp Activity ================= */}

            {

                currentStep===0 &&

                !showSortingIntro && (

                    <WarmUpActivity

                        question={content.questions[0]}

                        topicId={topicId}

                        lessonId={lessonId}

                        userName={userName}

                        onNext={nextStep}

                        onBack={onBack}

                    />

                )

            }

            {/* ================= Sorting Intro ================= */}

            {

                showSortingIntro && (

                    <SortingIntro

                        onFinish={() => {

                            setShowSortingIntro(false);

                            setCurrentStep(1);

                        }}

                    />

                )

            }

            {/* ================= Sorting Activity ================= */}

            {

                currentStep===1 &&

                !showSortingIntro &&

                !showConversationIntro && (

                    <SortingActivity

                        question={content.questions[1]}

                        onNext={nextStep}

                        onBack={onBack}

                    />

                )

            }

            {/* ================= Conversation Intro ================= */}

            {

                showConversationIntro && (

                    <ConversationIntro

                        onFinish={() => {

                            setShowConversationIntro(false);

                            setCurrentStep(2);

                        }}

                    />

                )

            }

           {/* ================= Conversation Activity ================= */}

{

    currentStep===2 &&

    !showConversationIntro &&

    !showPictureIntro && (

        <ConversationActivity

            question={content.questions[2]}

            topicId={topicId}

            lessonId={lessonId}

            userName={userName}

            onNext={nextStep}

            onBack={onBack}

        />

    )

}

            {/* ================= Assessment Intro ================= */}

            {

                showPictureIntro && (

                  <PictureDescriptionIntro
    onFinish={() => {
        setShowPictureIntro(false);
        setCurrentStep(3);
    }}
/>

                )

            }

            {/* ================= Assessment Activity ================= */}

            {

             currentStep===3 &&
!showPictureIntro && (

                    <PictureDescriptionActivity
    topicId={topicId}
    lessonId={lessonId}
    userName={userName}
    onNext={onFinish}
    onBack={onBack}
/>

                )

            }

        </div>

    );

}

export default FoodFlow;