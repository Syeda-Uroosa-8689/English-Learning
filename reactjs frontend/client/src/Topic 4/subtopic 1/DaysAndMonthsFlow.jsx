import React, { useState } from "react";

import SpinCalendarWheelIntro from "./SpinCalendarWheelIntro";
import SpinCalendarWheel from "./SpinCalendarWheel";

import CalendarCastleIntro from "./CalendarCastleIntro";
import CalendarCastle from "./CalendarCastle";

import CalendarEscapeRoomIntro from "./CalendarEscapeRoomIntro";
import CalendarEscapeRoom from "./CalendarEscapeRoom";


function DaysAndMonthsFlow({ onFinish, onBack }) {

    const [step, setStep] = useState(0);


    /* =========================================
       STEP 0
       SPIN CALENDAR WHEEL INTRO
    ========================================= */

    if (step === 0) {

        return (
            <SpinCalendarWheelIntro
                onFinish={() => {
                    console.log(
                        "Calendar Wheel Intro Finished"
                    );

                    setStep(1);
                }}
            />
        );

    }


    /* =========================================
       STEP 1
       SPIN CALENDAR WHEEL
    ========================================= */

    if (step === 1) {

        return (
            <SpinCalendarWheel
                onFinish={() => {
                    console.log(
                        "Calendar Wheel Finished"
                    );

                    setStep(2);
                }}

                onBack={onBack}
            />
        );

    }


    /* =========================================
       STEP 2
       CALENDAR CASTLE INTRO
    ========================================= */

    if (step === 2) {

        return (
            <CalendarCastleIntro
                onFinish={() => {
                    console.log(
                        "Calendar Castle Intro Finished"
                    );

                    setStep(3);
                }}
            />
        );

    }


    /* =========================================
       STEP 3
       CALENDAR CASTLE
    ========================================= */

    if (step === 3) {

        return (
            <CalendarCastle
                onFinish={() => {
                    console.log(
                        "Calendar Castle Finished"
                    );

                    setStep(4);
                }}

                onBack={onBack}
            />
        );

    }


    /* =========================================
       STEP 4
       CALENDAR ESCAPE ROOM INTRO
    ========================================= */

    if (step === 4) {

        return (
            <CalendarEscapeRoomIntro
                onFinish={() => {
                    console.log(
                        "Calendar Escape Room Intro Finished"
                    );

                    setStep(5);
                }}
            />
        );

    }


    /* =========================================
       STEP 5
       CALENDAR ESCAPE ROOM
    ========================================= */

    if (step === 5) {

        return (
            <CalendarEscapeRoom

                onFinish={() => {
                    console.log(
                        "Calendar Escape Room Finished"
                    );

                    if (onFinish) {
                        onFinish();
                    }
                }}

                onBack={onBack}
            />
        );

    }


    return null;
}


export default DaysAndMonthsFlow;