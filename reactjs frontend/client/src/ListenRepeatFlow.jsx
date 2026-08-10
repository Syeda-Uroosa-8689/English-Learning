import React, { useState } from "react";

import ListenRepeatIntro from "./ListenRepeatIntro";
import ListenRepeatTeacherIntro from "./ListenRepeatTeacherIntro";
import ListenRepeatPage from "./ListenRepeatPage";
import PracticeExerciseFlow from "./PracticeExerciseFlow";

function ListenRepeatFlow({ onFinish}) {

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
  // Next Step
  // =========================

  const nextStep = () => {

    setStep((prev) => prev + 1);

  };

  // =========================
  // Skip Listen & Repeat
  // =========================

  const skipPractice = () => {

    setStep(5);

  };

  // =========================
  // Listen Intro
  // =========================

  if (step === 0) {

    return (

      <ListenRepeatIntro

        onNext={nextStep}

      />

    );

  }

  // =========================
  // Teacher Intro
  // =========================

  if (step === 1) {

    return (

      <ListenRepeatTeacherIntro

        onNext={nextStep}

      />

    );

  }

  // =========================
  // Sentence 1
  // =========================

  if (step === 2) {

    return (

      <ListenRepeatPage

        data={sentences[0]}

        current={1}

        total={3}

        onNext={nextStep}

        onSkip={skipPractice}

      />

    );

  }

  // =========================
  // Sentence 2
  // =========================

  if (step === 3) {

    return (

      <ListenRepeatPage

        data={sentences[1]}

        current={2}

        total={3}

        onNext={nextStep}

        onSkip={skipPractice}

      />

    );

  }

  // =========================
  // Sentence 3
  // =========================

  if (step === 4) {

    return (

      <ListenRepeatPage

        data={sentences[2]}

        current={3}

        total={3}

        onNext={nextStep}

        onSkip={skipPractice}

      />

    );

  }

  // =========================
  // Practice Exercise
  // =========================

  if (step === 5) {

    return (

      <PracticeExerciseFlow />

    );

  }

  return null;

}

export default ListenRepeatFlow;