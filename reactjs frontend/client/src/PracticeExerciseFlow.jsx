import React, { useState } from "react";

import PracticeExerciseIntro from "./PracticeExerciseIntro";
import PracticeExerciseTeacherIntro from "./PracticeExerciseTeacherIntro";
import PracticeExercisePage from "./PracticeExercisePage";

function PracticeExerciseFlow({ onBack, onFinish }) {

    const [step, setStep] = useState(0);

    const exercises = [
        {
            waiter: "What would you like to order?",
            sentenceStructure: [
                "I",
                "____",
                "____",
                "dosa,",
                "____",
                "."
            ],
            correctWords: [
                "would",
                "like",
                "please"
            ],
            options: [
                "would",
                "like",
                "please"
            ]
        },

        {
            waiter: "What would you like to drink?",
            sentenceStructure: [
                "Can",
                "I",
                "____",
                "____",
                "juice,",
                "____",
                "."
            ],
            correctWords: [
                "orange",
                "please",
                "have"
            ],
            options: [
                "orange",
                "please",
                "have"
            ]
        },

        {
            waiter: "How was your meal?",
            sentenceStructure: [
                "The",
                "____",
                "was",
                "____",
                "."
            ],
            correctWords: [
                "food",
                "delicious"
            ],
            options: [
                "food",
                "delicious"
            ]
        }
    ];


    // =========================
    // NEXT
    // =========================

    const nextStep = () => {

        setStep(prev => prev + 1);

    };


    // =========================
    // SKIP
    // =========================

    const skipPractice = () => {

        // Practice skip karne ke baad
        // directly activity complete

        if (typeof onFinish === "function") {
            onFinish();
        }

    };


    // =========================
    // BACK
    // ONLY EXERCISE PAGE
    // =========================

    const handleExerciseBack = () => {

        console.log(
            "PracticeExerciseFlow → BACK"
        );

        if (typeof onBack === "function") {

            onBack();

        }

    };


    // =========================
    // STEP 0
    // PRACTICE INTRO CARD
    // =========================

    if (step === 0) {

        return (
            <PracticeExerciseIntro
                onNext={nextStep}
            />
        );

    }


    // =========================
    // STEP 1
    // TEACHER INTRO
    // =========================

    if (step === 1) {

        return (
            <PracticeExerciseTeacherIntro
                onNext={nextStep}
            />
        );

    }


    // =========================
    // STEP 2 - 4
    // EXERCISES
    // =========================

    if (
        step >= 2 &&
        step <= exercises.length + 1
    ) {

        const exerciseIndex = step - 2;

        return (
            <PracticeExercisePage
                data={exercises[exerciseIndex]}
                current={exerciseIndex + 1}
                total={exercises.length}
                onNext={nextStep}
                onSkip={skipPractice}
                onBack={handleExerciseBack}
            />
        );

    }


    // =========================
    // AFTER LAST EXERCISE
    // =========================

    if (step >= exercises.length + 2) {

        if (typeof onFinish === "function") {
            onFinish();
        }

        return null;

    }


    return null;
}

export default PracticeExerciseFlow;