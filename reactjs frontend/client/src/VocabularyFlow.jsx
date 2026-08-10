import React, { useState } from "react";
import VocabularyIntro from "./VocabularyIntro";
import QuestionPage from "./QuestionPage";
import ListenRepeatIntro from "./ListenRepeatIntro";
import data from "./topics.json";
import ListenRepeatFlow from "./ListenRepeatFlow";

function VocabularyFlow() {

  const [step, setStep] = useState(0);
  const [showListenIntro, setShowListenIntro] = useState(false);

  const subtopic = data.topics[2].subtopics[2];
  const questions = subtopic.content.questions;

  const nextStep = () => {

    if (step === questions.length) {

      setShowListenIntro(true);

    } else {

      setStep((prev) => prev + 1);

    }

  };

  if (showListenIntro) {

    return (

      <ListenRepeatFlow
        onNext={() => {
          
        }}
      />

    );

  }

  if (step === 0) {

    return (
      <VocabularyIntro
        lesson={subtopic}
        onNext={nextStep}
      />
    );

  }

  return (

    <QuestionPage
  question={questions[step - 1]}
  currentQuestion={step}
  totalQuestions={questions.length}
  onNext={nextStep}
  onSkip={() => setShowListenIntro(true)}
/>

  );

}

export default VocabularyFlow;