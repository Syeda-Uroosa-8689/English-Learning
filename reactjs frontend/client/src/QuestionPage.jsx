import React, { useState, useEffect } from "react";

import teacher from "./assets/teacher1.png";
import laddu from "./assets/laddu.jpg";
import panipuri from "./assets/panipuri.jpg";

function QuestionPage({

question,

onNext,

onSkip,

currentQuestion,

totalQuestions

}){

const [feedback,setFeedback]=useState("");

const [builtWord,setBuiltWord]=useState("");

const [usedLetters,setUsedLetters]=useState([]);

const [teacherText,setTeacherText]=useState("");

const [showRibbon,setShowRibbon]=useState(false);

useEffect(()=>{

setFeedback("");

setBuiltWord("");

setUsedLetters([]);

setTeacherText("");

setShowRibbon(false);

},[question]);

const images={

"laddu.jpg":laddu,

"panipuri.jpg":panipuri

};

const speak=(text)=>{

window.speechSynthesis.cancel();

const speech=new SpeechSynthesisUtterance(text);

speech.rate=0.9;

speech.pitch=1.15;

speech.volume=1;

const voices=window.speechSynthesis.getVoices();

speech.voice=

voices.find(v=>v.name.includes("Zira"))||

voices.find(v=>v.name.includes("Google UK English Female"))||

voices.find(v=>v.name.includes("Samantha"))||

voices.find(v=>v.name.toLowerCase().includes("female"))||

voices[0];

window.speechSynthesis.speak(speech);

};

const correctReaction=()=>{

const reactions=[

"Amazing!",

"Excellent!",

"Wonderful!"

];

const random=

reactions[Math.floor(Math.random()*reactions.length)];

setTeacherText(random);

setFeedback("correct");

setShowRibbon(true);

speak(random);

setTimeout(()=>{

setShowRibbon(false);

onNext();

},2200);

};

const wrongReaction=()=>{

setTeacherText("No... Try again!");

setFeedback("wrong");

speak("No...Try again!");

};

const handleOptionClick=(option)=>{

if(option.isCorrect){

correctReaction();

}

else{

wrongReaction();

}

};
const startPractice=()=>{

const SpeechRecognition=

window.SpeechRecognition||

window.webkitSpeechRecognition;

if(!SpeechRecognition){

alert("Speech Recognition Not Supported");

return;

}

const recognition=new SpeechRecognition();

recognition.lang="en-US";

recognition.interimResults=false;

recognition.maxAlternatives=1;

recognition.start();

recognition.onresult=(event)=>{

const spokenWord=

event.results[0][0].transcript

.toLowerCase()

.trim();

const correctWord=

question.practice.expectedAnswer

.toLowerCase()

.trim();

if(spokenWord.includes(correctWord)){

correctReaction();

}

else{

wrongReaction();

}

};

};

const handleLetterClick=(letter,index)=>{

if(usedLetters.includes(index)){

return;

}

const newWord=builtWord+letter;

setBuiltWord(newWord);

setUsedLetters([...usedLetters,index]);

if(newWord===question.wordBuilder.answer){

correctReaction();

}

};

const resetWord=()=>{

setBuiltWord("");

setUsedLetters([]);

};

const progress=

(currentQuestion/totalQuestions)*100;

return(

<div className="quiz-container">


<button
className="skip-btn"
onClick={onSkip}
>
Skip →
</button>


{showRibbon&&(

<div className="ribbon-container">

<div className="ribbon red"></div>

<div className="ribbon blue"></div>

<div className="ribbon yellow"></div>

<div className="ribbon green"></div>

<div className="ribbon pink"></div>

<div className="ribbon purple"></div>

</div>

)}



<div className="quiz-header">

<h2 className="question-text">

{question.question}

</h2>

<div className="progress-section">

<div className="progress-bar">

<div

className="progress-fill"

style={{

width:`${progress}%`

}}

></div>

</div>

<span>

{currentQuestion}/{totalQuestions}

</span>

</div>

</div>

<img

src={teacher}

alt=""

className="teacher-avatar"

/>

{teacherText&&(

<div className="teacher-bubble">

{teacherText}

</div>

)}
{/* ---------------- QUESTION 1 ---------------- */}

{question.options && (

<>

<div className="word-card">

{question.prompt}

</div>

<div className="image-options">

{question.options.map((option,index)=>(

<div

key={index}

className="food-card"

onClick={()=>handleOptionClick(option)}

>

<img

src={images[option.image]}

alt={option.text}

/>

<p>{option.text}</p>

</div>

))}

</div>

</>

)}

{/* ---------------- QUESTION 2 ---------------- */}

{question.practice && (

<div className="practice-container">

<div className="practice-card">

<img

src={panipuri}

alt=""

className="practice-image"

/>

<div className="practice-word">

{question.practice.expectedAnswer}

</div>

</div>

<p className="practice-text">

Tap the mic and say the word

</p>

<button

className="mic-btn"

onClick={startPractice}

>

🎤

</button>

</div>

)}

{/* ---------------- QUESTION 3 ---------------- */}

{question.wordBuilder && (

<div className="word-builder">

<h2 className="builder-title">

Pick And Make The Word

</h2>

<div className="blank-word">

{question.wordBuilder.answer

.split("")

.map((_,index)=>(

<div

key={index}

className="blank-box"

>

{builtWord[index] || ""}

</div>

))}

</div>

<div className="letter-container">

{question.wordBuilder.letters.map((letter,index)=>(

<button

key={index}

className={`letter-btn ${usedLetters.includes(index) ? "used" : ""}`}

disabled={usedLetters.includes(index)}

onClick={()=>handleLetterClick(letter,index)}

>

{letter}

</button>

))}

</div>

<button

className="reset-btn"

onClick={resetWord}

>

Reset

</button>

</div>

)}

{feedback==="correct" && (

<div className="correct-msg">

✨ {teacherText}

</div>

)}

{feedback==="wrong" && (

<div className="wrong-msg">

💙 {teacherText}

</div>

)}

</div>

);

}

export default QuestionPage;