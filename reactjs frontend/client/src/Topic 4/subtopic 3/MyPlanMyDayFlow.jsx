import React, { useState } from "react";

/* =====================================================
   MY PLAN, MY DAY — ACTIVITY 1
===================================================== */

import MyPlanMyDayIntro from "./MyPlanMyDayIntro";
import MyPlanMyDayActivity from "./MyPlanMyDayActivity";

/* =====================================================
   PLAN IT TOGETHER — ACTIVITY 2
===================================================== */

import PlanItTogetherIntro from "./PlanItTogetherIntro";
import PlanItTogetherActivity from "./PlanItTogetherActivity";

/* =====================================================
   THE SECRET PLAN — ACTIVITY 3
===================================================== */

import TheSecretPlanIntro from "./TheSecretPlanIntro";
import TheSecretPlanActivity from "./TheSecretPlanActivity";


function MyPlanMyDayFlow({ onFinish, onBack }) {
  const [step, setStep] = useState(0);


  /* =========================================
     STEP 0
     MY PLAN, MY DAY INTRO
  ========================================= */

  if (step === 0) {
    return (
      <MyPlanMyDayIntro
        onFinish={() => {
          console.log("My Plan, My Day Intro Finished");
          setStep(1);
        }}
        onBack={onBack}
        onSkip={() => {
          console.log("My Plan, My Day Intro Skipped");
          setStep(1);
        }}
      />
    );
  }


  /* =========================================
     STEP 1
     MY PLAN, MY DAY ACTIVITY
  ========================================= */

  if (step === 1) {
    return (
      <MyPlanMyDayActivity
        onFinish={() => {
          console.log("My Plan, My Day Finished");
          setStep(2);
        }}
        onBack={onBack}
        onSkip={() => {
          console.log("My Plan, My Day Activity Skipped");
          setStep(2);
        }}
      />
    );
  }


  /* =========================================
     STEP 2
     PLAN IT TOGETHER INTRO
  ========================================= */

  if (step === 2) {
    return (
      <PlanItTogetherIntro
        onFinish={() => {
          console.log("Plan It Together Intro Finished");
          setStep(3);
        }}
        onBack={onBack}
        onSkip={() => {
          console.log("Plan It Together Intro Skipped");
          setStep(3);
        }}
      />
    );
  }


  /* =========================================
     STEP 3
     PLAN IT TOGETHER ACTIVITY
  ========================================= */

  if (step === 3) {
    return (
      <PlanItTogetherActivity
        onFinish={() => {
          console.log("Plan It Together Finished");
          setStep(4);
        }}
        onBack={onBack}
        onSkip={() => {
          console.log("Plan It Together Activity Skipped");
          setStep(4);
        }}
      />
    );
  }


  /* =========================================
     STEP 4
     THE SECRET PLAN INTRO
  ========================================= */

  if (step === 4) {
    return (
      <TheSecretPlanIntro
        onFinish={() => {
          console.log("The Secret Plan Intro Finished");
          setStep(5);
        }}
        onBack={onBack}
        onSkip={() => {
          console.log("The Secret Plan Intro Skipped");
          setStep(5);
        }}
      />
    );
  }


  /* =========================================
     STEP 5
     THE SECRET PLAN ACTIVITY
  ========================================= */

  if (step === 5) {
    return (
      <TheSecretPlanActivity
        onFinish={() => {
          console.log("The Secret Plan Finished");

          if (typeof onFinish === "function") {
            onFinish();
          }
        }}
        onBack={onBack}
        onSkip={() => {
          console.log("The Secret Plan Activity Skipped");

          if (typeof onFinish === "function") {
            onFinish();
          }
        }}
      />
    );
  }


  return null;
}


export default MyPlanMyDayFlow;