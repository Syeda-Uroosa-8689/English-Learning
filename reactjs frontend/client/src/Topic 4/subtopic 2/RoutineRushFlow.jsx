import React, { useState } from "react";

/* =====================================================
   ROUTINE RUSH
===================================================== */

import RoutineRushIntro from "./RoutineRushIntro";
import RoutineRushActivity from "./RoutineRushActivity";

/* =====================================================
   DAY IN MY SHOES
===================================================== */

import DayInMyShoesIntro from "./DayInMyShoesIntro";
import DayInMyShoes from "./DayInMyShoesActivity";

/* =====================================================
   DAILY ROUTINE ESCAPE
===================================================== */

import DailyRoutineEscapeIntro from "./DailyRoutineEscapeIntro";
import DailyRoutineEscape from "./DailyRoutineEscapeActivity";

function RoutineRushFlow({ onFinish, onBack }) {
  const [step, setStep] = useState(0);

  /* =========================================
     STEP 0
     ROUTINE RUSH INTRO
  ========================================= */

  if (step === 0) {
    return (
      <RoutineRushIntro
        onFinish={() => {
          console.log("Routine Rush Intro Finished");
          setStep(1);
        }}
        onBack={onBack}
        onSkip={() => {
          console.log("Routine Rush Intro Skipped");
          setStep(2);
        }}
      />
    );
  }

  /* =========================================
     STEP 1
     ROUTINE RUSH ACTIVITY
  ========================================= */

  if (step === 1) {
    return (
      <RoutineRushActivity
        onFinish={() => {
          console.log("Routine Rush Finished");
          setStep(2);
        }}
        onBack={onBack}
        onSkip={() => {
          console.log("Routine Rush Activity Skipped");
          setStep(2);
        }}
      />
    );
  }

  /* =========================================
     STEP 2
     DAY IN MY SHOES INTRO
  ========================================= */

  if (step === 2) {
    return (
      <DayInMyShoesIntro
        onFinish={() => {
          console.log("Day In My Shoes Intro Finished");
          setStep(3);
        }}
        onBack={onBack}
        onSkip={() => {
          console.log("Day In My Shoes Intro Skipped");
          setStep(4);
        }}
      />
    );
  }

  /* =========================================
     STEP 3
     DAY IN MY SHOES ACTIVITY
  ========================================= */

  if (step === 3) {
    return (
      <DayInMyShoes
        onFinish={() => {
          console.log("Day In My Shoes Finished");
          setStep(4);
        }}
        onBack={onBack}
        onSkip={() => {
          console.log("Day In My Shoes Activity Skipped");
          setStep(4);
        }}
      />
    );
  }

  /* =========================================
     STEP 4
     DAILY ROUTINE ESCAPE INTRO
  ========================================= */

  if (step === 4) {
    return (
      <DailyRoutineEscapeIntro
        onFinish={() => {
          console.log("Daily Routine Escape Intro Finished");
          setStep(5);
        }}
        onBack={onBack}
        onSkip={() => {
          console.log("Daily Routine Escape Intro Skipped");
          setStep(5);
        }}
      />
    );
  }

  /* =========================================
     STEP 5
     DAILY ROUTINE ESCAPE ACTIVITY
  ========================================= */

  if (step === 5) {
    return (
      <DailyRoutineEscape
        onFinish={() => {
          console.log("Daily Routine Escape Finished");

          if (typeof onFinish === "function") {
            onFinish();
          }
        }}
        onBack={onBack}
        onSkip={() => {
          console.log("Daily Routine Escape Activity Skipped");

          if (typeof onFinish === "function") {
            onFinish();
          }
        }}
      />
    );
  }

  return null;
}

export default RoutineRushFlow;