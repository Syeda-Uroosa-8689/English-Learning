
import React, { useState } from "react";

/* =========================================
   INTRO FILES
========================================= */

import FavouritePersonIntro
  from "./FavouritePersonActivity1Intro";

import FavouritePersonActivity2Intro
  from "./FavouritePersonActivity2Intro";

import FavouritePersonActivity3Intro
  from "./FavouritePersonActivity3Intro";

/* =========================================
   ACTIVITY FILES
========================================= */

import FavouritePersonActivity1
  from "./FavouritePersonActivity1";

import FavouritePersonActivity2
  from "./FavouritePersonActivity2";

import FavouritePersonActivity3
  from "./FavouritePersonActivity3";

/* =========================================
   FAVOURITE PERSON FLOW
========================================= */

function FavouritePersonFlow({
  content,
  topicId,
  lessonId,
  userName,
  onFinish,
  onBack,
}) {
  /*
    FLOW STEPS

    0 = Activity 1 Intro
    1 = Activity 1

    2 = Activity 2 Intro
    3 = Activity 2

    4 = Activity 3 Intro
    5 = Activity 3

    IMPORTANT:
    NO INTERNAL LESSON COMPLETE CARD
  */

  const [currentStep, setCurrentStep] = useState(0);

  /* =========================================
     ACTIVITY NEXT
  ========================================= */

  const handleNext = () => {
    /* Activity 1 complete */

    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }

    /* Activity 2 complete */

    if (currentStep === 3) {
      setCurrentStep(4);
      return;
    }

    /* Activity 3 complete
       DIRECTLY SHOW APP'S COMMON
       LESSON COMPLETE PAGE
    */

    if (currentStep === 5) {
      onFinish?.();
      return;
    }
  };

  /* =========================================
     INTRO FINISHED
  ========================================= */

  const handleIntroFinish = () => {
    /* Activity 1 Intro */

    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }

    /* Activity 2 Intro */

    if (currentStep === 2) {
      setCurrentStep(3);
      return;
    }

    /* Activity 3 Intro */

    if (currentStep === 4) {
      setCurrentStep(5);
      return;
    }
  };

  /* =========================================
     BACK
  ========================================= */

  const handleBack = () => {
    onBack?.();
  };

  /* =========================================
     COMMON PROPS
  ========================================= */

  const commonProps = {
    content,
    topicId,
    lessonId,
    userName,
    onNext: handleNext,
    onBack: handleBack,
  };

  /* =========================================
     STEP 0
     ACTIVITY 1 INTRO
  ========================================= */

  if (currentStep === 0) {
    return (
      <FavouritePersonIntro
        onFinish={handleIntroFinish}
        onBack={handleBack}
      />
    );
  }

  /* =========================================
     STEP 1
     ACTIVITY 1
  ========================================= */

  if (currentStep === 1) {
    return (
      <FavouritePersonActivity1
        {...commonProps}
      />
    );
  }

  /* =========================================
     STEP 2
     ACTIVITY 2 INTRO
  ========================================= */

  if (currentStep === 2) {
    return (
      <FavouritePersonActivity2Intro
        onFinish={handleIntroFinish}
        onBack={handleBack}
      />
    );
  }

  /* =========================================
     STEP 3
     ACTIVITY 2
  ========================================= */

  if (currentStep === 3) {
    return (
      <FavouritePersonActivity2
        {...commonProps}
      />
    );
  }

  /* =========================================
     STEP 4
     ACTIVITY 3 INTRO
  ========================================= */

  if (currentStep === 4) {
    return (
      <FavouritePersonActivity3Intro
        onFinish={handleIntroFinish}
        onBack={handleBack}
      />
    );
  }

  /* =========================================
     STEP 5
     ACTIVITY 3
  ========================================= */

  if (currentStep === 5) {
    return (
      <FavouritePersonActivity3
        {...commonProps}
      />
    );
  }

  return null;
}

export default FavouritePersonFlow;

