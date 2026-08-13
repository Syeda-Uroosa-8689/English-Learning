import React, { useState } from "react";

import VocabularyIntro from "./VocabularyIntro";
import QuestionPage from "./QuestionPage";
import data from "./topics.json";

function VocabularyFlow({ onFinish, onBack }) {

    const [step, setStep] = useState(0);

    const subtopic = data.topics[2].subtopics[2];

    const questions =
        subtopic.content.questions;


    // =========================
    // NEXT QUESTION
    // =========================

    const nextStep = () => {

        if (step === questions.length) {

            // Vocabulary complete
            // App.jsx -> Listen & Repeat

            if (onFinish) {
                onFinish();
            }

        } else {

            setStep(prev => prev + 1);

        }

    };


    // =========================
    // SKIP VOCABULARY
    // =========================

    const skipVocabulary = () => {

        // Skip button directly
        // Listen & Repeat par jayega

        if (onFinish) {
            onFinish();
        }

    };


    // =========================
    // BACK
    // =========================

    const handleBack = () => {

        console.log("VocabularyFlow → BACK");

        if (onBack) {
            onBack();
        }

    };


    // =========================
    // VOCABULARY INTRO
    // =========================

    if (step === 0) {

        return (
            <VocabularyIntro
                lesson={subtopic}
                onNext={nextStep}
                onBack={handleBack}
            />
        );

    }


    // =========================
    // QUESTION PAGE
    // =========================

    return (

        <QuestionPage

            question={
                questions[step - 1]
            }

            currentQuestion={
                step
            }

            totalQuestions={
                questions.length
            }

            // Next question
            onNext={
                nextStep
            }

            // Skip -> Listen & Repeat
            onSkip={
                skipVocabulary
            }

            // Back -> Calling page / Chat
            onBack={
                handleBack
            }

        />

    );

}

export default VocabularyFlow;