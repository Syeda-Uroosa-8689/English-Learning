import React, { useEffect, useState } from "react";
import teacher from "./assets/teacher1.png";
import waiterImg from "./assets/waiter.png";

function PracticeExercisePage({
    data,
    current,
    total,
    onNext,
    onSkip,
    onBack
}) {

    const [teacherText, setTeacherText] = useState("");
    const [words, setWords] = useState([]);
    const [filledSentence, setFilledSentence] = useState(
        [...data.sentenceStructure]
    );

    // ==========================================
    // WAITER VOICE
    // ==========================================

    const speakWaiter = (text) => {

        window.speechSynthesis.cancel();

        const speech =
            new SpeechSynthesisUtterance(text);

        speech.rate = 0.9;
        speech.pitch = 1;
        speech.volume = 1;

        const voices =
            window.speechSynthesis.getVoices();

        speech.voice =
            voices.find(v =>
                v.name.includes("Google UK English Male")
            ) ||
            voices.find(v =>
                v.name.includes("Daniel")
            ) ||
            voices.find(v =>
                /male/i.test(v.name)
            ) ||
            voices[0];

        window.speechSynthesis.speak(speech);
    };


    // ==========================================
    // TEACHER VOICE
    // ==========================================

    const speakTeacher = (text) => {

        window.speechSynthesis.cancel();

        const speech =
            new SpeechSynthesisUtterance(text);

        speech.rate = 0.95;
        speech.pitch = 1.05;
        speech.volume = 1;

        const voices =
            window.speechSynthesis.getVoices();

        speech.voice =
            voices.find(v =>
                v.name.includes("Zira")
            ) ||
            voices.find(v =>
                v.name.includes("Samantha")
            ) ||
            voices.find(v =>
                /female/i.test(v.name)
            ) ||
            voices[0];

        window.speechSynthesis.speak(speech);
    };


    // ==========================================
    // LOAD EXERCISE
    // ==========================================

    useEffect(() => {

        setTeacherText("");

        setWords([...data.options]);

        setFilledSentence(
            [...data.sentenceStructure]
        );

        speakWaiter(data.waiter);

        return () => {
            window.speechSynthesis.cancel();
        };

    }, [data]);


    // ==========================================
    // DRAG & DROP
    // ==========================================

    const handleDragStart = (e, word) => {

        e.dataTransfer.setData(
            "word",
            word
        );

    };


    const handleDrop = (e, index) => {

        e.preventDefault();

        const word =
            e.dataTransfer.getData("word");

        if (!word) return;


        const newSentence =
            [...filledSentence];

        newSentence[index] = word;

        setFilledSentence(newSentence);


        // Remove selected word
        const remaining =
            words.filter(
                w => w !== word
            );

        setWords(remaining);


        // ======================================
        // CHECK ANSWER
        // ======================================

        if (!newSentence.includes("____")) {

            const userSentence =
                newSentence.join(" ");


            const correctSentence =
                data.sentenceStructure
                    .map((part, i) => {

                        if (part === "____") {

                            const blankIndex =
                                data.sentenceStructure
                                    .slice(0, i)
                                    .filter(
                                        x => x === "____"
                                    ).length;

                            return data.correctWords[
                                blankIndex
                            ];
                        }

                        return part;

                    })
                    .join(" ");


            const isCorrect =
                data.correctWords.every(
                    word =>
                        userSentence
                            .toLowerCase()
                            .includes(
                                word.toLowerCase()
                            )
                );


            if (isCorrect) {

                setTeacherText(
                    "Excellent! Correct sentence. ✨"
                );

                speakTeacher(
                    "Excellent! Correct sentence."
                );


                setTimeout(() => {

                    onNext();

                }, 1200);

            } else {

                setTeacherText(
                    `Oops! Try again. The correct sentence is: ${correctSentence}`
                );

                speakTeacher(
                    `Oops! Try again. The correct sentence is: ${correctSentence}`
                );


                setTimeout(() => {

                    setTeacherText("");

                    setWords(
                        [...data.options]
                    );

                    setFilledSentence(
                        [...data.sentenceStructure]
                    );

                }, 1800);

            }

        }

    };


    // ==========================================
    // PROGRESS
    // ==========================================

    const progress =
        (current / total) * 100;


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="practice-exercise-page">


            {/* =================================
                BACK BUTTON
            ================================= */}

            <button
                className="practice-back-btn"
                onClick={onBack}
            >
                ← Back
            </button>


            {/* =================================
                SKIP BUTTON
            ================================= */}

            <button
                className="practice-skip-btn"
                onClick={onSkip}
            >
                Skip →
            </button>


            {/* =================================
                HEADER
            ================================= */}

            <div className="practice-title-box">

                <h1>
                    Practice Exercise
                </h1>

            </div>


            {/* =================================
                PROGRESS
            ================================= */}

            <div className="practice-progress-area">

                <div className="practice-progress-count">

                    {current} / {total}

                </div>


                <div className="practice-progress-track">

                    <div
                        className="practice-progress-fill"
                        style={{
                            width: `${progress}%`
                        }}
                    />

                </div>

            </div>


            {/* =================================
                MAIN CONTENT
            ================================= */}

            <div className="practice-main-layout">


                {/* =================================
                    WAITER
                ================================= */}

                <div className="practice-waiter-section">

                    <img
                        src={waiterImg}
                        alt="Waiter"
                        className="practice-waiter-image"
                    />


                    <div className="practice-waiter-bubble">

                        <div className="character-name">

                            Waiter 🧑‍🍳

                        </div>


                        <p>
                            {data.waiter}
                        </p>

                    </div>

                </div>


                {/* =================================
                    CENTER EXERCISE CARD
                ================================= */}

                <div className="practice-card">


                    <h2>
                        Complete the sentence
                    </h2>


                    <div className="practice-divider">

                        <span></span>

                        <b>✦</b>

                        <span></span>

                    </div>


                    <p className="practice-instruction">

                        Drag the correct words into the blanks.

                    </p>


                    {/* SENTENCE */}

                    <div className="sentence-box">

                        {filledSentence.map(
                            (part, index) => {

                                if (
                                    part === "____"
                                ) {

                                    return (

                                        <span
                                            key={index}
                                            className="sentence-blank"
                                            onDragOver={
                                                e =>
                                                    e.preventDefault()
                                            }
                                            onDrop={
                                                e =>
                                                    handleDrop(
                                                        e,
                                                        index
                                                    )
                                            }
                                        >
                                            ______
                                        </span>

                                    );

                                }


                                return (

                                    <span
                                        key={index}
                                        className="sentence-word"
                                    >
                                        {part}
                                    </span>

                                );

                            }
                        )}

                    </div>


                    {/* WORD OPTIONS */}

                    <div className="practice-word-container">

                        {words.map(
                            (word, index) => (

                                <div
                                    key={index}
                                    className="practice-word"
                                    draggable
                                    onDragStart={
                                        e =>
                                            handleDragStart(
                                                e,
                                                word
                                            )
                                    }
                                >
                                    {word}
                                </div>

                            )
                        )}

                    </div>


                </div>


                {/* =================================
                    TEACHER
                ================================= */}

                <div className="practice-teacher-section">

                    <div className="practice-teacher-bubble">

                        <div className="character-name">

                            Miss Uroosa 👩‍🏫

                        </div>


                        <p>

                            {teacherText ||
                                "Drag the correct words into the blanks. You can do it! ✨"
                            }

                        </p>

                    </div>


                    <img
                        src={teacher}
                        alt="Miss Uroosa"
                        className="practice-teacher-image"
                    />

                </div>

            </div>


            {/* =================================
                BOTTOM TIP
            ================================= */}

            <div className="practice-tip">

                💡

                <span>
                    Listen carefully and speak clearly.
                </span>

            </div>


        </div>

    );

}

export default PracticeExercisePage;