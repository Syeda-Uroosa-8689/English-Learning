import React, { useState } from "react";

import ListenRepeatIntro from "./ListenRepeatIntro";
import ListenRepeatTeacherIntro from "./ListenRepeatTeacherIntro";
import ListenRepeatPage from "./ListenRepeatPage";
import PracticeExerciseFlow from "./PracticeExerciseFlow";

function ListenRepeatFlow({ onFinish, onBack }) {

    const [step, setStep] = useState(0);

    const sentences = [
        {
            sentence: "The soup is very hot.",
            blank: "The soup is very ______.",
            answer: "hot",
            options: ["Hot", "Cold", "Sweet"]
        },
        {
            sentence: "I would like a bowl of soup, please.",
            blank: "I would like a bowl of ______, please.",
            answer: "soup",
            options: ["Soup", "Pizza", "Juice"]
        },
        {
            sentence: "The food tastes delicious.",
            blank: "The food tastes ______.",
            answer: "delicious",
            options: ["Delicious", "Spicy", "Sour"]
        }
    ];


    // =========================
    // NEXT
    // =========================

    const nextStep = () => {

        setStep(prev => prev + 1);

    };


    // =========================
    // SKIP LISTEN & REPEAT
    // =========================

    const skipPractice = () => {

        // Jump to Practice Intro
        setStep(5);

    };


    // =========================
    // BACK
    // =========================

    const handleBack = () => {

        console.log("ListenRepeatFlow → BACK");

        if (typeof onBack === "function") {

            onBack();

        } else {

            console.log("❌ ListenRepeatFlow onBack missing");

        }

    };


    // =========================
    // STEP 0
    // LISTEN INTRO
    // =========================

    if (step === 0) {

        return (
            <ListenRepeatIntro
                onNext={nextStep}
                onBack={handleBack}
            />
        );

    }


    // =========================
    // STEP 1
    // TEACHER INTRO
    // =========================

    if (step === 1) {

        return (
            <ListenRepeatTeacherIntro
                onNext={nextStep}
                onBack={handleBack}
            />
        );

    }


    // =========================
    // STEP 2
    // SENTENCE 1
    // =========================

    if (step === 2) {

        return (
            <ListenRepeatPage
                data={sentences[0]}
                current={1}
                total={3}
                onNext={nextStep}
                onSkip={skipPractice}
                onBack={handleBack}
            />
        );

    }


    // =========================
    // STEP 3
    // SENTENCE 2
    // =========================

    if (step === 3) {

        return (
            <ListenRepeatPage
                data={sentences[1]}
                current={2}
                total={3}
                onNext={nextStep}
                onSkip={skipPractice}
                onBack={handleBack}
            />
        );

    }


    // =========================
    // STEP 4
    // SENTENCE 3
    // =========================

    if (step === 4) {

        return (
            <ListenRepeatPage
                data={sentences[2]}
                current={3}
                total={3}
                onNext={nextStep}
                onSkip={skipPractice}
                onBack={handleBack}
            />
        );

    }


    // =========================
    // STEP 5
    // PRACTICE EXERCISE
    // INTRO
    // =========================

    if (step === 5) {

        return (
            <PracticeExerciseFlow
                onBack={handleBack}
                onFinish={onFinish}
            />
        );

    }


    return null;
}

export default ListenRepeatFlow;