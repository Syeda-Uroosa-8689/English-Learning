import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import confetti from "canvas-confetti";

import "./DayInMyShoesActivity.css";

/* =====================================================
   INTRO
===================================================== */

import dayInMyShoesIntro from "../../assets/dayInMyShoesIntro.jpeg";

/* =====================================================
   BACKGROUNDS
===================================================== */

import dayBedroomMorning from "../../assets/dayBedroomMorning.png";
import dayBathroom from "../../assets/dayBathroom.png";
import dayKitchen from "../../assets/dayKitchen.png";
import dayBusStop from "../../assets/dayBusStop.png";
import daySchoolClassroom from "../../assets/daySchoolClassroom.png";
import daySchoolLunch from "../../assets/daySchoolLunch.jpeg";
import daySchoolPlayground from "../../assets/daySchoolPlayground.jpeg";
import dayHomeAfternoon from "../../assets/dayHomeAfternoon.jpeg";
import dayStudyRoom from "../../assets/dayStudyRoom.jpeg";
import dayDinnerRoom from "../../assets/dayDinnerRoom.jpg";
import dayBedroomNight from "../../assets/dayBedroomNight.jpeg";

/* =====================================================
   CHARACTER POSES
===================================================== */

import characterSleep from "../../assets/dayCharacterSleep.png";
import characterWake from "../../assets/dayCharacterWake.png";
import characterStand from "../../assets/dayCharacterStand.png";
import characterWalk from "../../assets/dayCharacterWalk.png";
import characterBrush from "../../assets/dayCharacterBrush.png";
import characterEat from "../../assets/dayCharacterEat.png";
import characterStudy from "../../assets/dayCharacterStudy.jpeg";
import characterPlay from "../../assets/dayCharacterPlay.jpeg";
import characterPajamas from "../../assets/dayCharacterPajamas.jpeg";
import characterBed from "../../assets/dayCharacterBed.jpeg";

/* =====================================================
   OBJECTS
===================================================== */

import alarmClock from "../../assets/dayAlarmClock.png";
import morningSunlight from "../../assets/dayMorningSunlight.png";
import moonStars from "../../assets/dayMoonStars.png";
import toothbrush from "../../assets/dayToothbrush.png";
import breakfastPlate from "../../assets/dayBreakfastPlate.png";
import schoolBus from "../../assets/daySchoolBus.png";
import schoolBooks from "../../assets/daySchoolBooks.png";
import lunchTray from "../../assets/dayLunchTray.png";
import football from "../../assets/dayFootball.png";
import schoolBag from "../../assets/daySchoolBag.png";
import homeworkNotebook from "../../assets/dayHomeworkNotebook.png";
import dinnerPlate from "../../assets/dayDinnerPlate.png";
import pajamas from "../../assets/dayPajamas.png";

/* =====================================================
   SOUND
===================================================== */

import yaySound from "../../assets/yay.mp3";

/* =====================================================
   SCENES
===================================================== */

const scenes = [
  {
    id: "bedroom-morning",
    location: "Bedroom",
    title: "A New Day Begins",
    time: "7:00 AM",
    background: dayBedroomMorning,
    icon: "🏠",

    character: characterSleep,
    actionCharacter: characterWake,

    object: alarmClock,
    objectClass: "day-alarm",

    teacherText:
      "A new day begins! What should you do when the alarm rings?",

    speakingText: "I wake up.",

    actionText:
      "Excellent! You woke up and started your day.",

    wrongSpeechText:
      "Thoda dhyan se bolo. Tumhe kehna hai: I wake up. Is sentence ko ek baar phir bolo.",

    options: [
      {
        text: "Wake up",
        correct: true,
      },
      {
        text: "Keep sleeping",
        correct: false,
      },
    ],
  },

  {
    id: "bathroom",
    location: "Bathroom",
    title: "Getting Ready",
    time: "7:30 AM",
    background: dayBathroom,
    icon: "🪥",

    character: characterStand,
    actionCharacter: characterBrush,

    object: toothbrush,
    objectClass: "day-toothbrush",

    teacherText:
      "What do you do after waking up?",

    speakingText: "I brush my teeth.",

    actionText:
      "Great! Your teeth are clean and shiny.",

    wrongSpeechText:
      "Thoda dhyan se bolo. Tumhe kehna hai: I brush my teeth. Is sentence ko ek baar phir bolo.",

    options: [
      {
        text: "Brush my teeth",
        correct: true,
      },
      {
        text: "Go back to sleep",
        correct: false,
      },
    ],
  },

  {
    id: "kitchen",
    location: "Kitchen",
    title: "Breakfast Time",
    time: "8:00 AM",
    background: dayKitchen,
    icon: "🍳",

    character: characterStand,
    actionCharacter: characterEat,

    object: breakfastPlate,
    objectClass: "day-breakfast",

    teacherText:
      "What should you do before going to school?",

    speakingText: "I have breakfast.",

    actionText:
      "Yummy! You had breakfast and are ready for school.",

    wrongSpeechText:
      "Good try! Tumhe bolna hai: I have breakfast. Ek baar phir clearly bolo.",

    options: [
      {
        text: "Have breakfast",
        correct: true,
      },
      {
        text: "Play with toys",
        correct: false,
      },
    ],
  },

  {
    id: "bus-stop",
    location: "Bus Stop",
    title: "Off to School!",
    time: "8:30 AM",
    background: dayBusStop,
    icon: "🚌",

    character: characterWalk,
    actionCharacter: characterWalk,

    object: schoolBus,
    objectClass: "day-bus",

    teacherText:
      "How do you go to school?",

    speakingText: "I go to school.",

    actionText:
      "Wonderful! The school bus is here. Let's go!",

    wrongSpeechText:
      "Almost! Tumhe bolna hai: I go to school. Is sentence ko ek baar phir bolo.",

    options: [
      {
        text: "Take the school bus",
        correct: true,
      },
      {
        text: "Go back home",
        correct: false,
      },
    ],
  },

  {
    id: "classroom",
    location: "Classroom",
    title: "Time to Study",
    time: "9:00 AM",
    background: daySchoolClassroom,
    icon: "🏫",

    character: characterStand,
    actionCharacter: characterStudy,

    object: schoolBooks,
    objectClass: "day-books",

    teacherText:
      "What do you do when you are in the classroom?",

    speakingText: "I study.",

    actionText:
      "Wonderful! You are learning new things.",

    wrongSpeechText:
      "Good try! Tumhe bolna hai: I study. Ek baar phir bolo.",

    options: [
      {
        text: "Study",
        correct: true,
      },
      {
        text: "Go to bed",
        correct: false,
      },
    ],
  },

  {
    id: "school-lunch",
    location: "School Lunch",
    title: "Lunchtime!",
    time: "12:30 PM",
    background: daySchoolLunch,
    icon: "🍱",

    character: characterStand,
    actionCharacter: characterEat,

    object: lunchTray,
    objectClass: "day-lunch",

    teacherText:
      "What do you do when it is lunchtime?",

    speakingText: "I have lunch.",

    actionText:
      "Great! It is lunchtime. Enjoy your meal!",

    wrongSpeechText:
      "Almost! Tumhe bolna hai: I have lunch. Is sentence ko ek baar phir bolo.",

    options: [
      {
        text: "Have lunch",
        correct: true,
      },
      {
        text: "Brush my teeth",
        correct: false,
      },
    ],
  },

  {
    id: "playground",
    location: "Playground",
    title: "Playtime!",
    time: "2:00 PM",
    background: daySchoolPlayground,
    icon: "⚽",

    character: characterStand,
    actionCharacter: characterPlay,

    object: football,
    objectClass: "day-football",

    teacherText:
      "What do you do during playtime?",

    speakingText: "I play.",

    actionText:
      "Awesome! Let's play and have some fun!",

    wrongSpeechText:
      "Good try! Tumhe bolna hai: I play. Ek baar phir clearly bolo.",

    options: [
      {
        text: "Play",
        correct: true,
      },
      {
        text: "Study in bed",
        correct: false,
      },
    ],
  },

  {
    id: "home-afternoon",
    location: "Home",
    title: "Back Home",
    time: "4:00 PM",
    background: dayHomeAfternoon,
    icon: "🏡",

    character: characterWalk,
    actionCharacter: characterStand,

    object: schoolBag,
    objectClass: "day-school-bag",

    teacherText:
      "What do you do after school?",

    speakingText: "I go home.",

    actionText:
      "Welcome home! You had a busy day at school.",

    wrongSpeechText:
      "Almost! Tumhe bolna hai: I go home. Ek baar phir bolo.",

    options: [
      {
        text: "Go home",
        correct: true,
      },
      {
        text: "Go to school",
        correct: false,
      },
    ],
  },

  {
    id: "study-room",
    location: "Study Room",
    title: "Homework Time",
    time: "4:30 PM",
    background: dayStudyRoom,
    icon: "📚",

    character: characterStand,
    actionCharacter: characterStudy,

    object: homeworkNotebook,
    objectClass: "day-homework",

    teacherText:
      "What should you do after coming home?",

    speakingText: "I do my homework.",

    actionText:
      "Fantastic! Your homework is complete.",

    wrongSpeechText:
      "Good try! Tumhe bolna hai: I do my homework. Ek baar phir bolo.",

    options: [
      {
        text: "Do my homework",
        correct: true,
      },
      {
        text: "Play all day",
        correct: false,
      },
    ],
  },

  {
    id: "dinner-room",
    location: "Dinner Room",
    title: "Dinner Time",
    time: "7:00 PM",
    background: dayDinnerRoom,
    icon: "🍽️",

    character: characterStand,
    actionCharacter: characterEat,

    object: dinnerPlate,
    objectClass: "day-dinner",

    teacherText:
      "What do you do in the evening?",

    speakingText: "I have dinner.",

    actionText:
      "Dinner is ready! Enjoy your meal.",

    wrongSpeechText:
      "Almost! Tumhe bolna hai: I have dinner. Is sentence ko ek baar phir bolo.",

    options: [
      {
        text: "Have dinner",
        correct: true,
      },
      {
        text: "Go to school",
        correct: false,
      },
    ],
  },

  {
    id: "bedroom-night",
    location: "Bedroom",
    title: "Time for Bed",
    time: "8:30 PM",
    background: dayBedroomNight,
    icon: "🌙",

    character: characterPajamas,
    actionCharacter: characterBed,

    object: pajamas,
    objectClass: "day-pajamas",

    teacherText:
      "What do you do before going to bed?",

    speakingText: "I go to bed.",

    actionText:
      "Wonderful! Good night. You completed your whole day.",

    wrongSpeechText:
      "Good try! Tumhe bolna hai: I go to bed. Ek baar phir bolo.",

    options: [
      {
        text: "Put on pajamas",
        correct: true,
      },
      {
        text: "Go to school",
        correct: false,
      },
    ],
  },
];

/* =====================================================
   HELPERS
===================================================== */

const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const normalizeSpeech = (text) => {
  return text
    .toLowerCase()
    .replace(/[.,!?'"`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const isSpeechCorrect = (
  spoken,
  expected
) => {
  const actual =
    normalizeSpeech(spoken);

  const target =
    normalizeSpeech(expected);

  if (!actual || !target) {
    return false;
  }

  if (actual === target) {
    return true;
  }

  /*
    Small tolerance for speech recognition.
  */

  const removeThe = (value) =>
    value
      .replace(/\bthe\b/g, "")
      .replace(/\s+/g, " ")
      .trim();

  if (
    removeThe(actual) ===
    removeThe(target)
  ) {
    return true;
  }

  return false;
};

/* =====================================================
   COMPONENT
===================================================== */

function DayInMyShoes({
  onFinish,
  onBack,
  onSkip,
}) {
  /* =====================================================
     MAIN STATES
  ===================================================== */

  const [showIntro, setShowIntro] =
    useState(true);

  const [currentScene, setCurrentScene] =
    useState(0);

  const [scenePhase, setScenePhase] =
    useState("intro");

  const [selectedOption, setSelectedOption] =
    useState(null);

  const [showSpeaking, setShowSpeaking] =
    useState(false);

  const [isSpeaking, setIsSpeaking] =
    useState(false);

  const [completed, setCompleted] =
    useState(false);

  const [score, setScore] =
    useState(0);

  /* =====================================================
     USER SPEECH STATES
  ===================================================== */

  const [isListening, setIsListening] =
    useState(false);

  const [speechResult, setSpeechResult] =
    useState("");

  const [speechCorrect, setSpeechCorrect] =
    useState(null);

  const [speechError, setSpeechError] =
    useState("");

  const [
    waitingForUserSpeech,
    setWaitingForUserSpeech,
  ] = useState(false);

  /* =====================================================
     REFS
  ===================================================== */

  const speechRef =
    useRef(null);

  const recognitionRef =
    useRef(null);

  const yayRef =
    useRef(null);

  const mountedRef =
    useRef(true);

  const sequenceRef =
    useRef(0);

  /* =====================================================
     CURRENT SCENE
  ===================================================== */

  const scene =
    scenes[currentScene];

  const progress = useMemo(
    () =>
      ((currentScene + 1) /
        scenes.length) *
      100,
    [currentScene]
  );

  /* =====================================================
     CLEANUP
  ===================================================== */

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      sequenceRef.current += 1;

      if (
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
      }

      if (
        recognitionRef.current
      ) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // ignore
        }
      }

      if (yayRef.current) {
        yayRef.current.pause();
        yayRef.current.currentTime = 0;
      }
    };
  }, []);

  /* =====================================================
     STOP EVERYTHING
  ===================================================== */

  const stopSpeech = () => {
    if (
      "speechSynthesis" in window
    ) {
      window.speechSynthesis.cancel();
    }

    if (
      recognitionRef.current
    ) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        // ignore
      }
    }

    if (mountedRef.current) {
      setIsSpeaking(false);
      setIsListening(false);
    }
  };

  /* =====================================================
     FEMALE VOICE
  ===================================================== */

  const getFemaleVoice = () => {
    if (
      !("speechSynthesis" in window)
    ) {
      return null;
    }

    const voices =
      window.speechSynthesis.getVoices();

    const englishVoices =
      voices.filter((voice) =>
        voice.lang
          ?.toLowerCase()
          .startsWith("en")
      );

    const femaleVoice =
      englishVoices.find((voice) =>
        /female|samantha|zira|aria|jenny|susan|karen|hazel|sara|ava|emma|siri/i.test(
          voice.name
        )
      );

    if (femaleVoice) {
      return femaleVoice;
    }

    return (
      englishVoices[0] || null
    );
  };

  /* =====================================================
     SPEAK AND WAIT
===================================================== */

  const speakAndWait = (text) => {
    return new Promise((resolve) => {
      if (
        !("speechSynthesis" in window)
      ) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const utterance =
        new SpeechSynthesisUtterance(
          text
        );

      utterance.lang = "en-US";

      utterance.rate = 0.82;

      utterance.pitch = 1.18;

      utterance.volume = 1;

      const voice =
        getFemaleVoice();

      if (voice) {
        utterance.voice = voice;
      }

      let finished = false;

      let fallbackTimer = null;

      const finish = () => {
        if (finished) {
          return;
        }

        finished = true;

        if (fallbackTimer) {
          clearTimeout(
            fallbackTimer
          );
        }

        if (mountedRef.current) {
          setIsSpeaking(false);
        }

        resolve();
      };

      utterance.onstart = () => {
        if (mountedRef.current) {
          setIsSpeaking(true);
        }
      };

      utterance.onend = () => {
        finish();
      };

      utterance.onerror = () => {
        finish();
      };

      speechRef.current =
        utterance;

      window.speechSynthesis.speak(
        utterance
      );

      /*
        Safety fallback.
        Browser normally finishes through onend.
      */

      const safetyTime =
        Math.max(
          12000,
          text.length * 200
        );

      fallbackTimer =
        setTimeout(
          finish,
          safetyTime
        );
    });
  };

  /* =====================================================
     LOAD VOICES
  ===================================================== */

  useEffect(() => {
    if (
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.getVoices();

    const handleVoicesChanged =
      () => {
        window.speechSynthesis.getVoices();
      };

    window.speechSynthesis.onvoiceschanged =
      handleVoicesChanged;

    return () => {
      window.speechSynthesis.onvoiceschanged =
        null;
    };
  }, []);

  /* =====================================================
     START ADVENTURE
  ===================================================== */

  const handleStartAdventure =
    () => {
      sequenceRef.current += 1;

      stopSpeech();

      setShowIntro(false);

      setCurrentScene(0);

      setScenePhase("intro");

      setSelectedOption(null);

      setShowSpeaking(false);

      setCompleted(false);

      setScore(0);

      setIsListening(false);

      setSpeechResult("");

      setSpeechCorrect(null);

      setSpeechError("");

      setWaitingForUserSpeech(
        false
      );
    };

  /* =====================================================
     OPEN NEW SCENE
  ===================================================== */

  useEffect(() => {
    if (
      showIntro ||
      completed
    ) {
      return;
    }

    sequenceRef.current += 1;

    const sceneSequence =
      sequenceRef.current;

    stopSpeech();

    setScenePhase("intro");

    setSelectedOption(null);

    setShowSpeaking(false);

    setIsListening(false);

    setSpeechResult("");

    setSpeechCorrect(null);

    setSpeechError("");

    setWaitingForUserSpeech(
      false
    );

    let questionTimer = null;

    const readyTimer =
      setTimeout(() => {
        if (
          !mountedRef.current ||
          sceneSequence !==
            sequenceRef.current
        ) {
          return;
        }

        setScenePhase("ready");

        questionTimer =
          setTimeout(() => {
            if (
              !mountedRef.current ||
              sceneSequence !==
                sequenceRef.current
            ) {
              return;
            }

            speakAndWait(
              scene.teacherText
            );
          }, 300);
      }, 700);

    return () => {
      clearTimeout(
        readyTimer
      );

      if (questionTimer) {
        clearTimeout(
          questionTimer
        );
      }

      stopSpeech();
    };
  }, [
    currentScene,
    showIntro,
    completed,
  ]);

  /* =====================================================
     YAY
  ===================================================== */

  const playYayAndWait = () => {
    return new Promise(
      (resolve) => {
        const audio =
          yayRef.current;

        if (!audio) {
          resolve();
          return;
        }

        let finished = false;

        let fallbackTimer = null;

        const finish = () => {
          if (finished) {
            return;
          }

          finished = true;

          if (fallbackTimer) {
            clearTimeout(
              fallbackTimer
            );
          }

          audio.removeEventListener(
            "ended",
            finish
          );

          resolve();
        };

        audio.pause();

        audio.currentTime = 0;

        audio.addEventListener(
          "ended",
          finish,
          {
            once: true,
          }
        );

        const playPromise =
          audio.play();

        if (playPromise) {
          playPromise.catch(() => {
            finish();
          });
        }

        const fallbackTime =
          Number.isFinite(
            audio.duration
          ) &&
          audio.duration > 0
            ? Math.ceil(
                audio.duration *
                  1000
              ) + 300
            : 2500;

        fallbackTimer =
          setTimeout(
            finish,
            fallbackTime
          );
      }
    );
  };

  /* =====================================================
     CONFETTI
  ===================================================== */

  const playConfettiAndWait =
    () => {
      return new Promise(
        (resolve) => {
          try {
            confetti({
              particleCount: 120,
              spread: 85,
              startVelocity: 38,
              scalar: 1,
              origin: {
                x: 0.5,
                y: 0.48,
              },
            });

            confetti({
              particleCount: 55,
              spread: 65,
              startVelocity: 32,
              scalar: 0.9,
              origin: {
                x: 0.12,
                y: 0.55,
              },
            });

            confetti({
              particleCount: 55,
              spread: 65,
              startVelocity: 32,
              scalar: 0.9,
              origin: {
                x: 0.88,
                y: 0.55,
              },
            });
          } catch (error) {
            console.error(
              "Confetti error:",
              error
            );
          }

          setTimeout(
            resolve,
            1900
          );
        }
      );
    };

  /* =====================================================
     PREPARE USER SPEAKING
  ===================================================== */

  const prepareUserSpeaking =
    async () => {
      if (
        !mountedRef.current
      ) {
        return;
      }

      setScenePhase("action");

      setShowSpeaking(true);

      setSpeechResult("");

      setSpeechCorrect(null);

      setSpeechError("");

      setWaitingForUserSpeech(
        false
      );

      await delay(350);

      if (
        !mountedRef.current
      ) {
        return;
      }

      /*
        Teacher says target sentence.
      */

      await speakAndWait(
        `Now say: ${scene.speakingText}`
      );

      if (
        !mountedRef.current
      ) {
        return;
      }

      /*
        Mic becomes available ONLY
        after teacher finishes.
      */

      setWaitingForUserSpeech(
        true
      );
    };

  /* =====================================================
     CORRECT OPTION
  ===================================================== */

  const handleCorrectAnswer =
    async (selectedIndex) => {
      if (
        scenePhase !== "ready" ||
        showSpeaking
      ) {
        return;
      }

      const answerSequence =
        ++sequenceRef.current;

      setSelectedOption(
        selectedIndex
      );

      setScenePhase("correct");

      setScore(
        (prev) => prev + 1
      );

      /*
        YAY + CONFETTI
      */

      await Promise.all([
        playYayAndWait(),
        playConfettiAndWait(),
      ]);

      if (
        !mountedRef.current ||
        answerSequence !==
          sequenceRef.current
      ) {
        return;
      }

      /*
        Teacher remark.
      */

      await speakAndWait(
        `Excellent! ${scene.actionText}`
      );

      if (
        !mountedRef.current ||
        answerSequence !==
          sequenceRef.current
      ) {
        return;
      }

      /*
        Now say + microphone.
      */

      await prepareUserSpeaking();
    };

  /* =====================================================
     WRONG OPTION
  ===================================================== */

  const handleWrongAnswer =
    async () => {
      if (
        scenePhase !== "ready" ||
        showSpeaking
      ) {
        return;
      }

      const wrongSequence =
        ++sequenceRef.current;

      setSelectedOption(null);

      setScenePhase("wrong");

      await speakAndWait(
        `Oops! That's not quite right. ${scene.teacherText} Think carefully and choose the action that matches the question.`
      );

      if (
        !mountedRef.current ||
        wrongSequence !==
          sequenceRef.current
      ) {
        return;
      }

      await delay(500);

      if (
        !mountedRef.current ||
        wrongSequence !==
          sequenceRef.current
      ) {
        return;
      }

      setSelectedOption(null);

      setScenePhase("ready");

      await delay(250);

      if (
        !mountedRef.current ||
        wrongSequence !==
          sequenceRef.current
      ) {
        return;
      }

      await speakAndWait(
        scene.teacherText
      );
    };

  /* =====================================================
     CHOICE
  ===================================================== */

  const handleChoice = (
    option,
    index
  ) => {
    if (
      scenePhase !== "ready" ||
      showSpeaking
    ) {
      return;
    }

    if (option.correct) {
      handleCorrectAnswer(
        index
      );
    } else {
      handleWrongAnswer();
    }
  };

  /* =====================================================
     CHECK USER SPEECH
  ===================================================== */

  const checkUserSpeech =
    async (spokenText) => {
      if (
        !mountedRef.current
      ) {
        return;
      }

      const correct =
        isSpeechCorrect(
          spokenText,
          scene.speakingText
        );

      setSpeechResult(
        spokenText
      );

      setSpeechCorrect(
        correct
      );

      setSpeechError("");

      if (correct) {
        /*
          ========================================
          CORRECT SPEECH
          ========================================
        */

        setWaitingForUserSpeech(
          false
        );

        setIsListening(false);

        await delay(450);

        if (
          !mountedRef.current
        ) {
          return;
        }

        await speakAndWait(
          "Excellent! You said it correctly!"
        );

        if (
          !mountedRef.current
        ) {
          return;
        }

        await delay(900);

        if (
          !mountedRef.current
        ) {
          return;
        }

        /*
          FINAL SCENE
        */

        if (
          currentScene ===
          scenes.length - 1
        ) {
          sequenceRef.current += 1;

          stopSpeech();

          setShowSpeaking(false);

          setWaitingForUserSpeech(
            false
          );

          setCompleted(true);

          return;
        }

        /*
          NEXT SCENE
          DIRECTLY.
        */

        sequenceRef.current += 1;

        stopSpeech();

        setShowSpeaking(false);

        setWaitingForUserSpeech(
          false
        );

        setSpeechResult("");

        setSpeechCorrect(null);

        setSelectedOption(null);

        setScenePhase("intro");

        setCurrentScene(
          (prev) => prev + 1
        );

        return;
      }

      /*
        ========================================
        WRONG SPEECH
        ========================================
      */

      setWaitingForUserSpeech(
        false
      );

      setIsListening(false);

      await delay(350);

      if (
        !mountedRef.current
      ) {
        return;
      }

      /*
        Roman English explanation.
      */

      await speakAndWait(
        scene.wrongSpeechText
      );

      if (
        !mountedRef.current
      ) {
        return;
      }

      /*
        Say Again.
      */

      setSpeechCorrect(false);

      setWaitingForUserSpeech(
        true
      );
    };

  /* =====================================================
     START MICROPHONE
  ===================================================== */

  const startListening = () => {
    if (
      isSpeaking ||
      isListening ||
      !waitingForUserSpeech
    ) {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError(
        "Voice recognition is not supported in this browser. Please use Google Chrome."
      );

      return;
    }

    if (
      recognitionRef.current
    ) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        // ignore
      }
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.maxAlternatives = 3;

    recognitionRef.current =
      recognition;

    setSpeechResult("");

    setSpeechError("");

    setSpeechCorrect(null);

    setIsListening(true);

    recognition.onstart = () => {
      if (mountedRef.current) {
        setIsListening(true);
      }
    };

    recognition.onresult =
      (event) => {
        if (
          !mountedRef.current
        ) {
          return;
        }

        const result =
          event.results[0];

        const transcript =
          result?.[0]?.transcript ||
          "";

        setIsListening(false);

        checkUserSpeech(
          transcript
        );
      };

    recognition.onerror =
      (event) => {
        if (
          !mountedRef.current
        ) {
          return;
        }

        setIsListening(false);

        if (
          event.error ===
          "not-allowed"
        ) {
          setSpeechError(
            "Microphone permission allow karo, phir Say Again press karo."
          );

          return;
        }

        if (
          event.error ===
          "no-speech"
        ) {
          setSpeechError(
            "Mujhe tumhari voice sunai nahi di. Mic dabao aur sentence bolo."
          );

          setWaitingForUserSpeech(
            true
          );

          return;
        }

        setSpeechError(
          "Voice clear nahi mili. Ek baar phir mic dabao aur sentence bolo."
        );

        setWaitingForUserSpeech(
          true
        );
      };

    recognition.onend = () => {
      if (
        mountedRef.current
      ) {
        setIsListening(false);
      }
    };

    try {
      recognition.start();
    } catch (error) {
      console.error(
        "Recognition start error:",
        error
      );

      setIsListening(false);

      setSpeechError(
        "Mic start nahi hua. Ek baar phir try karo."
      );

      setWaitingForUserSpeech(
        true
      );
    }
  };

  /* =====================================================
     MIC CLICK
  ===================================================== */

  const handleMicClick =
    () => {
      if (
        isListening ||
        isSpeaking
      ) {
        return;
      }

      startListening();
    };

  /* =====================================================
     BACK TO CALLING PAGE
     
     IMPORTANT:
     This DOES NOT go back to intro.
     It directly calls parent's onBack().
  ===================================================== */

  const handleBack = () => {
    /*
      Invalidate all running async sequences.
    */

    sequenceRef.current += 1;

    /*
      Stop teacher speech.
    */

    stopSpeech();

    /*
      Stop yay sound.
    */

    if (yayRef.current) {
      yayRef.current.pause();

      yayRef.current.currentTime = 0;
    }

    /*
      Reset recognition state.
    */

    setIsListening(false);

    setWaitingForUserSpeech(
      false
    );

    /*
      DIRECTLY CALL PARENT / CALLING PAGE.
    */

    if (
      typeof onBack ===
      "function"
    ) {
      onBack();

      return;
    }

    /*
      Fallback only if parent
      didn't provide onBack.
    */

    console.warn(
      "DayInMyShoes: onBack prop is not provided."
    );
  };

  /* =====================================================
     SKIP
  ===================================================== */

  const handleSkip = () => {
    sequenceRef.current += 1;

    stopSpeech();

    if (yayRef.current) {
      yayRef.current.pause();

      yayRef.current.currentTime = 0;
    }

    if (
      typeof onSkip ===
      "function"
    ) {
      onSkip();

      return;
    }

    if (
      typeof onFinish ===
      "function"
    ) {
      onFinish();
    }
  };

  /* =====================================================
     INTRO
  ===================================================== */

  if (showIntro) {
    return (
      <div className="day-story-page day-intro-page">

        <div className="day-intro-card">

          <img
            src={dayInMyShoesIntro}
            alt="A Day in My Shoes"
            className="day-intro-image"
          />

          <button
            type="button"
            className="day-intro-start-button"
            onClick={
              handleStartAdventure
            }
            aria-label="Start Adventure"
          />

        </div>

      </div>
    );
  }

  /* =====================================================
     COMPLETION
  ===================================================== */

  if (completed) {
    return (
      <div className="day-story-page">

        <audio
          ref={yayRef}
          src={yaySound}
          preload="auto"
        />

        <div className="day-story-card day-completion-card">

          <div className="day-completion-stars">
            ✨ ⭐ ✨
          </div>

          <div className="day-completion-icon">
            🌙
          </div>

          <h1>
            You Completed My Day!
          </h1>

          <p>
            Amazing work! You followed
            the whole day and learned
            your daily routine.
          </p>

          <div className="day-final-score">

            <span>
              ⭐
            </span>

            <strong>
              {score}
            </strong>

            <small>
              / {scenes.length}
            </small>

          </div>

          <div className="day-completion-journey">

            {scenes.map(
              (item) => (
                <span
                  key={item.id}
                >
                  {item.icon}
                </span>
              )
            )}

          </div>

          <button
            type="button"
            className="day-next-button"
            onClick={() => {
              stopSpeech();

              if (
                typeof onFinish ===
                "function"
              ) {
                onFinish();
              }
            }}
          >
            Finish Adventure →
          </button>

        </div>

      </div>
    );
  }

  /* =====================================================
     ACTIVITY
  ===================================================== */

  return (
    <div className="day-story-page">

      <audio
        ref={yayRef}
        src={yaySound}
        preload="auto"
      />

      <div className="day-story-card">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="day-story-header">

          <button
            type="button"
            className="day-header-button"
            onClick={handleBack}
          >
            ← Back
          </button>

          <div className="day-header-title">

            <h1>
              A DAY IN MY SHOES
            </h1>

            <span>
              Live My Day!
            </span>

          </div>

          <button
            type="button"
            className="day-header-button"
            onClick={handleSkip}
          >
            Skip →
          </button>

        </header>

        {/* =================================================
            JOURNEY
        ================================================= */}

        <div className="day-journey-section">

          <div className="day-journey-label">

            <span>
              👟 Day Journey
            </span>

            <span>
              {currentScene + 1} /{" "}
              {scenes.length}
            </span>

          </div>

          <div className="day-journey-track">

            <div
              className="day-journey-fill"
              style={{
                width: `${progress}%`,
              }}
            />

            {scenes.map(
              (item, index) => (
                <div
                  key={item.id}
                  className={`day-journey-stop ${
                    index <
                    currentScene
                      ? "completed"
                      : index ===
                        currentScene
                      ? "active"
                      : ""
                  }`}
                >
                  <span>
                    {item.icon}
                  </span>
                </div>
              )
            )}

          </div>

        </div>

        {/* =================================================
            SCENE
        ================================================= */}

        <div
          className={`day-scene-area day-phase-${scenePhase}`}
          key={scene.id}
        >

          <img
            src={scene.background}
            alt={`${scene.location} scene`}
            className="day-scene-background"
          />

          {currentScene === 0 && (
            <>
              <div className="day-morning-darkness" />

              <img
                src={morningSunlight}
                alt=""
                className="day-morning-sunlight"
              />
            </>
          )}

          {currentScene ===
            scenes.length - 1 && (
            <img
              src={moonStars}
              alt=""
              className="day-moon-stars"
            />
          )}

          <div className="day-scene-heading">

            <span>
              {scene.icon}
            </span>

            <div>

              <h2>
                {scene.title}
              </h2>

              <p>
                {scene.time}
              </p>

            </div>

          </div>

          {scene.object && (
            <img
              src={scene.object}
              alt=""
              className={`day-scene-object ${scene.objectClass}`}
            />
          )}

          <img
            src={
              scenePhase ===
              "action"
                ? scene.actionCharacter
                : scene.character
            }
            alt="Child character"
            className={`day-story-character ${
              scenePhase ===
              "action"
                ? "character-action"
                : ""
            }`}
          />

        </div>

        {/* =================================================
            TEACHER
        ================================================= */}

        <div className="day-teacher-section">

          <div
            className={`day-teacher-avatar ${
              isSpeaking
                ? "teacher-speaking"
                : ""
            }`}
          >
            👩‍🏫
          </div>

          <div className="day-teacher-bubble">

            <div className="day-teacher-name">

              Miss Uroosa

              {isSpeaking && (
                <span className="teacher-voice-bars">
                  ▮ ▮ ▮
                </span>
              )}

            </div>

            <p>

              {scenePhase ===
                "intro" &&
                `Let's visit the ${scene.location}!`}

              {scenePhase ===
                "wrong" &&
                `Oops! Let's understand the question first. ${scene.teacherText}`}

              {scenePhase ===
                "correct" &&
                "Excellent choice!"}

              {scenePhase ===
                "action" &&
                scene.actionText}

              {scenePhase ===
                "ready" &&
                scene.teacherText}

            </p>

          </div>

        </div>

        {/* =================================================
            SPEAKING + MIC
        ================================================= */}

        {showSpeaking && (
          <div className="day-speaking-section">

            <div className="day-speaking-text">

              <span>
                🗣️
              </span>

              <p>
                Now say:{" "}
                <strong>
                  "{scene.speakingText}"
                </strong>
              </p>

            </div>

            {!waitingForUserSpeech && (
              <div className="day-auto-speaking">
                🔊 Listen &amp; Say
              </div>
            )}

            {waitingForUserSpeech && (
              <button
                type="button"
                className={`day-mic-button ${
                  isListening
                    ? "listening"
                    : ""
                } ${
                  speechCorrect ===
                  false
                    ? "say-again"
                    : ""
                }`}
                onClick={
                  handleMicClick
                }
                disabled={
                  isListening ||
                  isSpeaking
                }
              >

                <span className="day-mic-icon">
                  🎤
                </span>

                <span className="day-mic-label">

                  {isListening
                    ? "Listening..."
                    : speechCorrect ===
                      false
                    ? "Say Again"
                    : "Say It"}

                </span>

              </button>
            )}

            {isListening && (
              <div className="day-listening-message">
                🎙️ I'm listening...
                Speak clearly!
              </div>
            )}

            {speechResult && (
              <div
                className={`day-speech-result ${
                  speechCorrect
                    ? "correct"
                    : "wrong"
                }`}
              >

                {speechCorrect ? (
                  <>
                    ✓ Great! You said:
                    <strong>
                      "{speechResult}"
                    </strong>
                  </>
                ) : (
                  <>
                    You said:
                    <strong>
                      "{speechResult}"
                    </strong>
                  </>
                )}

              </div>
            )}

            {speechError && (
              <div className="day-speech-error">
                ⚠️ {speechError}
              </div>
            )}

          </div>
        )}

        {/* =================================================
            OPTIONS
        ================================================= */}

        <div className="day-options-section">

          {!showSpeaking &&
            scenePhase ===
              "intro" && (
              <div className="day-options-title">
                Listen to Miss
                Uroosa...
              </div>
            )}

          {scenePhase ===
            "ready" && (
            <>
              <div className="day-options-title">
                Choose the correct
                action
              </div>

              <div className="day-choice-grid">

                {scene.options.map(
                  (
                    option,
                    index
                  ) => (
                    <button
                      type="button"
                      key={
                        option.text
                      }
                      className={`day-choice-button ${
                        selectedOption ===
                        index
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleChoice(
                          option,
                          index
                        )
                      }
                    >

                      <span className="choice-number">
                        {index + 1}
                      </span>

                      <span>
                        {
                          option.text
                        }
                      </span>

                    </button>
                  )
                )}

              </div>
            </>
          )}

          {scenePhase ===
            "wrong" && (
            <div className="day-feedback wrong">

              <span className="feedback-icon">
                💭
              </span>

              <div className="feedback-content">

                <strong>
                  Oops! Not quite.
                </strong>

                <p>
                  The question asks:
                  <br />

                  <b>
                    {scene.teacherText}
                  </b>
                </p>

                <span>
                  Think carefully and
                  choose the action that
                  matches the question.
                </span>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default DayInMyShoes;