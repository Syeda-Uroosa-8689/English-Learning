import React, { useState } from "react";
import PracticeExerciseIntro from "./PracticeExerciseIntro";
import PracticeExercisePage from "./PracticeExercisePage";
import JourneyToRestaurant from "./JourneyToRestaurant"; 

function PracticeExerciseFlow() {
  const [step, setStep] = useState(0);

  const exercises = [
    {
      waiter: "What would you like to order?",
      sentenceStructure: ["I", "____", "____", "dosa,", "____", "."],
      correctWords: ["would", "like", "please"],
      options: ["would", "like", "please"]
    },
    {
      waiter: "What would you like to drink?",
      sentenceStructure: ["Can", "I", "____", "____", "juice,", "____", "."],
      correctWords: ["orange", "please", "have"],
      options: ["orange", "please", "have"]
    },
    {
      waiter: "How was your meal?",
      sentenceStructure: ["The", "____", "was", "____", "."],
      correctWords: ["food", "delicious"],
      options: ["food", "delicious"]
    }
  ];

  const nextStep = () => setStep((prev) => prev + 1);
  const skipPractice = () => setStep(exercises.length + 2);

  // Intro
  if (step === 0) {
    return <PracticeExerciseIntro onNext={nextStep} />;
  }

  // Questions
  if (step >= 1 && step <= exercises.length) {
    return (
      <PracticeExercisePage
        data={exercises[step - 1]}
        current={step}
        total={exercises.length}
        onNext={nextStep}
        onSkip={skipPractice}
      />
    );
  }

  // Transition Scene (Journey to Restaurant)
  if (step === exercises.length + 1) {
    return <JourneyToRestaurant onNext={nextStep} />;
  }

  // Finish (after transition)
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "38px",
        fontWeight: "700"
      }}
    >
      Restaurant Scene Coming Next 🍴
    </div>
  );
}

export default PracticeExerciseFlow;
