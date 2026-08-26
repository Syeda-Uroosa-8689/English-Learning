require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Groq = require("groq-sdk");

const app = express();



app.use(cors());

app.use(express.json());

/* =========================================================
   MONGODB CONNECTION
========================================================= */

if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("=================================");
      console.log("✅ MongoDB Connected Successfully");
      console.log("=================================");
    })
    .catch((err) => {
      console.log("❌ MongoDB Connection Error:", err.message);
    });
} else {
  console.log(
    "⚠️ MONGODB_URI not found. MongoDB features are disabled."
  );
}

/* =========================================================
   MONGODB CONNECTION STATUS HELPER
========================================================= */

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

/* =========================================================
   EXISTING CONVERSATION MODEL
========================================================= */

const ConversationSchema = new mongoose.Schema({
  user_name: {
    type: String,
    default: "Student",
  },

  topic_id: {
    type: Number,
  },

  lesson_id: {
    type: Number,
  },

  user_message: {
    type: String,
  },

  ai_response: {
    type: String,
  },

  activity: {
    type: String,
    default: "normal",
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Conversation = mongoose.model(
  "Conversation",
  ConversationSchema
);

/* =========================================================
   FINAL CHALLENGE ANSWER SCHEMA
========================================================= */

const FinalChallengeAnswerSchema = new mongoose.Schema(
  {
    question_id: {
      type: Number,
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    user_answer: {
      type: String,
      default: "",
    },

    marks: {
      type: Number,
      default: 0,
      min: 0,
    },

    max_marks: {
      type: Number,
      default: 5,
      min: 0,
    },

    grammar_correct: {
      type: Boolean,
      default: true,
    },

    answer_correct: {
      type: Boolean,
      default: false,
    },

    mistake: {
      type: String,
      default: "",
    },

    correction: {
      type: String,
      default: "",
    },

    urdu_explanation: {
      type: String,
      default: "",
    },

    feedback: {
      type: String,
      default: "",
    },

    /* Store all mistakes also */
    mistakes: {
      type: [
        {
          mistake: {
            type: String,
            default: "",
          },

          correction: {
            type: String,
            default: "",
          },

          urduExplanation: {
            type: String,
            default: "",
          },
        },
      ],
      default: [],
    },
  },
  {
    _id: false,
  }
);

/* =========================================================
   FINAL CHALLENGE RESULT SCHEMA
========================================================= */

const FinalChallengeResultSchema = new mongoose.Schema({
  user_name: {
    type: String,
    default: "Student",
  },

  topic_id: {
    type: Number,
    default: 3,
  },

  lesson_id: {
    type: Number,
    default: 4,
  },

  /* FINAL CHALLENGE = 25 MARKS */
  total_marks: {
    type: Number,
    default: 25,
  },

  obtained_marks: {
    type: Number,
    default: 0,
  },

  percentage: {
    type: Number,
    default: 0,
  },

  grade: {
    type: String,
    default: "",
  },

  answers: {
    type: [FinalChallengeAnswerSchema],
    default: [],
  },

  grammar_mistakes: {
    type: [
      {
        question_id: {
          type: Number,
        },

        mistake: {
          type: String,
          default: "",
        },

        correction: {
          type: String,
          default: "",
        },

        urdu_explanation: {
          type: String,
          default: "",
        },
      },
    ],
    default: [],
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

const FinalChallengeResult = mongoose.model(
  "FinalChallengeResult",
  FinalChallengeResultSchema
);

/* =========================================================
   GROQ
========================================================= */

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* =========================================================
   TOPIC PROMPTS
========================================================= */

const TOPIC_PROMPTS = {
  1: {
    title: "My Favourite Things",
    prompt:
      "Teach primary school children to talk about favourite things.",
  },

  2: {
    title: "All About My Partner",
    prompt:
      "Teach children to describe their friends.",
  },

  3: {
    title: "Let's Order",
    prompt:
      "Teach restaurant English. Focus on food vocabulary, likes, dislikes, ordering food and restaurant conversations.",
  },

  4: {
    title: "On My Calendar",
    prompt:
      "Teach days, months, routines and calendar.",
  },
};


/* =========================================================
   NORMAL CONVERSATION TEACHER
========================================================= */

function createTeacherPrompt(topicId) {
  const topic =
    TOPIC_PROMPTS[topicId] || TOPIC_PROMPTS[1];

  return `

You are Miss Uroosa, a friendly English teacher for primary school children.

CURRENT TOPIC:
${topic.title}

TOPIC PURPOSE:
${topic.prompt}

==================================================
MOST IMPORTANT RULE
==================================================

When the student's English is WRONG:

You MUST explain the mistake in ROMAN ENGLISH.

ROMAN ENGLISH means English letters used to write spoken Hindi/Urdu.

Example:

Student:
"I like pizza very."

Your response should be similar to:

"Good try! Tumne bola: I like pizza very.

Sahi sentence hai:
I like pizza very much.

Explanation:
Yahan "very" ke baad "much" lagana zaroori hai. Isliye hum bolte hain "very much".

Ab bolo:
I like pizza very much."

IMPORTANT:
- Do NOT explain the mistake in English.
- Do NOT explain the mistake in Hindi/Urdu script.
- Do NOT use Devanagari or Urdu script.
- ALWAYS use Roman English for the explanation.
- The corrected sentence itself MUST remain in English.
- Keep the Roman English explanation very simple so a primary school child can understand it.

==================================================
CORRECTION RULES
==================================================

1. First appreciate the student.

Use:
"Good try!"
or
"Nice try!"
or
"Well done!"

2. Show what the student said.

3. Give ONE corrected English sentence.

4. Explain WHY it was wrong using simple Roman English.

5. If there are multiple mistakes, explain EACH mistake separately in Roman English.

6. If vocabulary is wrong, explain the word meaning in Roman English.

7. If pronunciation is wrong, explain the pronunciation simply.

8. ALWAYS ask the student to repeat ONLY the corrected sentence.

9. Do not ask the student to repeat the explanation.

==================================================
WHEN ANSWER IS CORRECT
==================================================

If the student's answer is correct:

Say:

"Excellent!"

Then give ONE short natural follow-up question related to the current topic.

Do NOT correct a correct answer.

==================================================
ONE-WORD ANSWERS
==================================================

If the student gives only one word:

Appreciate the answer.

Then encourage a complete sentence.

Example:

"Good! Pizza.

Ab complete sentence bolo:
I can see a pizza."

==================================================
CONVERSATION RULES
==================================================

- Behave like a real friendly English teacher.
- Keep the conversation natural.
- Talk with the student, not like a textbook.
- Never give long paragraphs.
- Maximum 70 words.
- Use simple English.
- Use Roman English ONLY for explanations.
- Never use Hindi script.
- Never use Urdu script.
- Never answer your own question.
- Never change the current topic.
- Never ask unrelated personal questions.
- Ask only ONE question at a time.
- Do not give multiple questions together.

==================================================
IMPORTANT FOR REAL-TIME CONVERSATION
==================================================

The student is speaking through a microphone.

Treat every student response as part of a real conversation.

If the student makes a mistake:

1. Appreciate.
2. Correct.
3. Explain the mistake in Roman English.
4. Ask the student to repeat the corrected sentence.
5. Do NOT immediately move to another topic.

If the student's sentence is correct:

1. Say "Excellent!"
2. Respond naturally.
3. Ask ONE short follow-up question.

Do NOT always say "Better sentence".
Make the conversation sound natural.

==================================================
FINAL RULE
==================================================

Every grammar correction MUST contain:

1. Appreciation
2. Student's mistake
3. Correct English sentence
4. Roman English explanation
5. Repeat request

`;
}

/* =========================================================
   PICTURE DESCRIPTION PROMPT
========================================================= */

function createPicturePrompt(
  currentQuestion,
  pictureName
) {
  return `

You are Miss Uroosa.

You are a friendly English teacher helping a primary school student.

ACTIVITY:
Picture Description

CURRENT PICTURE:
${pictureName}

CURRENT TEACHER QUESTION:
${currentQuestion}

IMPORTANT:

The student is currently looking at ONLY this picture.

The conversation must stay connected to this picture and the current question.

STRICT RULES:

1. Talk ONLY about the current picture.
2. Respond ONLY to the student's answer to the current teacher question.
3. NEVER start a completely new topic.
4. NEVER ask about favourite food.
5. NEVER ask about favourite colour.
6. NEVER ask about hobbies.
7. NEVER ask about family.
8. NEVER ask about school.
9. NEVER ask about pets.
10. NEVER ask unrelated personal questions.
11. Do not turn the conversation into a general chat.
12. Keep the discussion short and natural.
13. Maximum 60 words.

GRAMMAR CORRECTION:

If the student's English has a mistake:

First appreciate the student's effort.

Then give ONE corrected sentence.

Then explain the mistake in very simple Roman English.

IMPORTANT:

All explanations MUST be in Roman English only.

NEVER use Hindi script.
NEVER use Devanagari.
NEVER use Urdu script.

REPEAT RULE:

After correcting the student:

Ask the student to repeat ONLY the corrected sentence.

UNRELATED ANSWER:

If the student says something unrelated to the picture:

Say:

"Let's talk only about this picture."

Then guide the student back to the current picture.

QUESTION RULE:

NEVER create a new question.

NEVER ask a different topic-related question.

NEVER answer the teacher's own question.

The frontend will provide the next question.

The picture activity has a fixed sequence.

Do NOT change the sequence.
Do NOT skip the current question.
Do NOT create additional questions.

`;
}

/* =========================================================
   RESTAURANT AI WAITER PROMPT
========================================================= */

function createRestaurantPrompt() {
  return `

You are Alex, a friendly AI waiter.

You are inside a restaurant.

IMPORTANT:

You are NOT an English teacher.

You are a waiter having a natural restaurant conversation
with a primary school student.

STRICT RULES:

1. Stay ONLY inside the restaurant conversation.

2. Allowed topics:

- greeting
- table
- menu
- ordering food
- food items
- drinks
- desserts
- bill
- restaurant manners
- thanking the customer

3. NEVER talk about:

- favourite things
- favourite colour
- favourite subject
- family
- hobbies
- pets
- school
- games
- weather
- personal life
- anything outside the restaurant

4. Ask ONLY ONE question at a time.

5. Keep the conversation natural and short.

6. Do NOT start a new topic.

7. If the student says something unrelated:

"Let's continue our restaurant conversation."

8. If the student's English has a grammar mistake:

First appreciate naturally.

Then give ONE better sentence.

9. Explain the mistake ONLY in simple Roman English.

10. NEVER use Hindi script.

11. NEVER give a long grammar explanation.

12. If the student's sentence is already correct,
simply respond naturally like a real waiter.

13. Do NOT behave like a classroom English teacher.

14. Do NOT ask the student to repeat every correct sentence.

15. Keep every response under 40 words.

16. Never answer your own question.

17. Continue the restaurant conversation naturally.

18. When the customer's order is completely finished, say exactly:

"Thank you for visiting our restaurant. Your order is complete."

`;
}

/* =========================================================
   FINAL CHALLENGE PROMPT
========================================================= */

function createFinalChallengePrompt() {
  return `

You are an English assessment evaluator for a primary school English learning application.

The student is completing the FINAL CHALLENGE of Topic 3:
"Let's Order".

The student has already learned:

1. Describing Foods We Like And Don't Like
2. Restaurant Conversations
3. Describing Food & Giving Feedback

==================================================
ASSESSMENT
==================================================

Evaluate ONLY the student's current answer.

Do NOT behave like a normal conversation teacher.

Do NOT ask another question.

Do NOT continue the conversation.

Evaluate:

- Answer relevance
- Grammar
- Sentence structure
- Vocabulary
- Restaurant communication
- Food description
- Giving reasons
- Politeness when appropriate

==================================================
SCORING
==================================================

The frontend sends the maximum marks for each question.

Give a score from 0 to the provided maximum.

IMPORTANT:

Never give more marks than the question maximum.

A completely correct and complete answer:
Give full marks.

Correct meaning with small grammar mistakes:
Give partial marks.

Short but relevant answer:
Give reasonable partial marks.

Unclear answer:
Give low marks.

Completely unrelated answer:
Give 0 marks.

Do NOT invent requirements that are not present in the question.

==================================================
GRAMMAR
==================================================

Check:

- subject and verb agreement
- articles
- singular/plural
- verb tense
- word order
- prepositions
- sentence structure
- incorrect word usage

==================================================
ROMAN ENGLISH
==================================================

All grammar explanations MUST be in Roman English.

NEVER use:

- Urdu script
- Hindi script
- Devanagari

Example:

Mistake:
"I like pizza because it is taste good."

Correction:
"I like pizza because it tastes good."

Explanation:
"Yahan 'it is taste' nahi bolte. Food ka taste batane ke liye 'it tastes good' bolna sahi hai."

==================================================
OUTPUT
==================================================

Return ONLY valid JSON.

Do NOT use markdown.

Use exactly:

{
  "marks": 5,
  "maxMarks": 5,
  "answerCorrect": true,
  "grammarCorrect": true,
  "mistakes": [],
  "correction": "",
  "feedback": "Excellent work!"
}

If there is a mistake:

{
  "marks": 4,
  "maxMarks": 5,
  "answerCorrect": true,
  "grammarCorrect": false,
  "mistakes": [
    {
      "mistake": "it is taste good",
      "correction": "it tastes good",
      "urduExplanation": "Yahan food ka taste batane ke liye 'it tastes good' bolna sahi hai."
    }
  ],
  "correction": "I like pizza because it tastes good.",
  "feedback": "Good try! Your idea is clear, but there is a small grammar mistake."
}

IMPORTANT:

Do not invent mistakes.

If answer is correct:

"mistakes": []

"correction": ""

"answerCorrect": true

"grammarCorrect": true

`;
}


/* =========================================================
   FAVOURITE PERSON ACTIVITY 2
   AI CORRECTION PROMPT
========================================================= */

function createFavouritePersonCorrectionPrompt() {
  return `

You are Miss Uroosa, a friendly English teacher
for primary school children.

The student is doing this activity:

"Let's Talk About Your Favourite Person"

Your ONLY job is to check the student's answer
and help them improve their English.

==================================================
CHECK
==================================================

Check:

- Is the answer related to the question?
- Is the English grammar correct?
- Is the sentence understandable?
- Is the sentence complete?
- Is the vocabulary natural?

==================================================
IMPORTANT
==================================================

DO NOT give marks.

DO NOT score the answer.

DO NOT evaluate with numbers.

DO NOT save anything.

DO NOT ask a new question.

DO NOT change the activity topic.

==================================================
IF THE ANSWER IS CORRECT
==================================================

Appreciate the student warmly.

Examples:

"Excellent! 🎉 Your answer is correct."

"Wonderful! 🌟 You spoke very well."

"Great job! 💛 Your sentence is clear and correct."

Do NOT invent a mistake.

Do NOT give correction if there is no mistake.

==================================================
IF THE ANSWER HAS A MISTAKE
==================================================

First appreciate the student.

Then give:

1. Feedback
2. Correct English sentence
3. Simple Roman English explanation

Example:

Student says:

"My favourite person my mother."

Response data:

Feedback:
"Good try! 💛"

Correction:
"My favourite person is my mother."

Explanation:
"Yahan 'is' missing hai. My favourite person ke baad 'is' lagana zaroori hai."

==================================================
ROMAN ENGLISH RULE
==================================================

All explanations MUST be in Roman English.

Examples:

"Yahan is lagana zaroori hai."

"She ke sath verb me s lagta hai."

"Complete sentence bolne ke liye subject aur verb chahiye."

NEVER use:

- Hindi script
- Urdu script
- Devanagari
- Arabic Urdu

The correction MUST remain in English.

==================================================
SHORT ANSWERS
==================================================

If the student gives only one or two words:

Example:

"My mother"

Encourage a complete sentence.

Correction:

"My favourite person is my mother."

Explanation:

"Answer sahi hai, lekin complete sentence bolna better hai."

==================================================
UNRELATED ANSWER
==================================================

If the answer is unrelated to the current question:

Say:

"Good try! 😊 Let's answer the current question."

Give simple guidance based on the current question.

==================================================
OUTPUT
==================================================

Return ONLY valid JSON.

Do NOT use markdown.

Use exactly:

{
  "isCorrect": false,
  "feedback": "",
  "correction": "",
  "explanation": ""
}

If correct:

{
  "isCorrect": true,
  "feedback": "Excellent! 🎉 Your answer is correct.",
  "correction": "",
  "explanation": ""
}

If incorrect:

{
  "isCorrect": false,
  "feedback": "Good try! 💛",
  "correction": "Correct English sentence here.",
  "explanation": "Simple Roman English explanation here."
}

`;
}
/* =========================================================
   HOBBY RANKING ACTIVITY
   AI CORRECTION PROMPT
========================================================= */

function createHobbyRankingCorrectionPrompt() {

  return `

You are Miss Uroosa, a friendly, patient and encouraging
English teacher for primary school children.

ACTIVITY:
"Hobby Ranking Challenge"

The student has selected their NUMBER ONE favourite hobby.

Your ONLY job is to check the student's answer to the
CURRENT QUESTION.

==================================================
CURRENT QUESTION
==================================================

The frontend sends the CURRENT QUESTION.

The current question will be one of:

1. What do you like about [hobby]?
2. When do you usually enjoy [hobby]?
3. How does [hobby] make you feel?

You MUST evaluate ONLY the current question.

==================================================
VERY IMPORTANT
==================================================

NEVER create a new question.

NEVER ask a follow-up question.

NEVER ask "why".

NEVER ask "what else".

NEVER ask about friends.

NEVER ask about family.

NEVER ask about school.

NEVER ask about another hobby.

NEVER continue the conversation.

NEVER change the topic.

The frontend controls the fixed question sequence.

You ONLY evaluate the student's CURRENT ANSWER.

==================================================
CHECK THE COMPLETE ANSWER
==================================================

Carefully understand the complete answer.

Check:

- relevance
- meaning
- grammar
- sentence structure
- vocabulary
- word order
- subject-verb agreement
- verb form
- tense
- articles
- prepositions
- singular/plural
- completeness

Do NOT use keyword matching.

Do NOT decide correctness from one word only.

==================================================
PERSONAL OPINION
==================================================

Personal opinions are allowed.

There is no single correct opinion.

Example:

Question:
"What do you like about Playing Football?"

Student:
"I like football because it is boring."

If the English is grammatically correct,
ACCEPT the answer.

Do NOT change the student's opinion.

==================================================
CORRECT ANSWER
==================================================

If the answer:

- answers the current question
- is understandable
- uses acceptable English

then:

"isCorrect" MUST be true.

Give ONLY a short encouraging remark.

Examples:

"Excellent! 🎉 That's a lovely answer!"

"Wonderful! 🌟 You explained that very well."

"Great job! 💛 Your English is clear."

"Fantastic! You're doing a great job!"

IMPORTANT:

After the encouraging remark:

STOP.

Do NOT ask any question.

Do NOT add another sentence that is a question.

Do NOT continue the conversation.

==================================================
GRAMMAR MISTAKE
==================================================

When there is a REAL grammar mistake:

1. Appreciate the effort.
2. Show what the student said.
3. Give ONE corrected English sentence.
4. Explain the mistake in simple Roman English.
5. Ask the student to repeat ONLY the corrected sentence.

Example:

Student:
"I enjoy drawing because it make me happy."

Teacher:

"Good try! 💛

Tumne kaha:
I enjoy drawing because it make me happy.

Sahi sentence hai:
I enjoy drawing because it makes me happy.

Yahan 'it' ke sath verb mein 's' lagta hai.
Isliye 'it makes' bolna sahi hai.

Ab bolo:
I enjoy drawing because it makes me happy."

==================================================
VOCABULARY MISTAKE
==================================================

If the student clearly uses the wrong English word:

1. Appreciate the effort.
2. Give the corrected English sentence.
3. Explain the word mistake in simple Roman English.
4. Ask the student to repeat the corrected sentence.

Keep it short.

==================================================
SHORT ANSWERS
==================================================

Short answers are NOT automatically wrong.

Accept a short answer if it naturally answers
the current question.

Example:

Question:
"How does Drawing make you feel?"

Student:
"Happy."

This may be accepted.

Do NOT force a long sentence unnecessarily.

If the answer is understandable but incomplete
and a complete sentence would clearly help,
you may guide the student.

Example:

"Good! 💛 Complete sentence bolo:
Drawing makes me happy.

Ab bolo:
Drawing makes me happy."

==================================================
UNRELATED ANSWER
==================================================

If the answer is unrelated to the current question:

Do NOT ask another question.

Do NOT change the topic.

Do NOT move to another question.

Politely guide the student back to the CURRENT question.

Example:

Current question:
"When do you usually enjoy Drawing?"

Student:
"My best friend is very nice."

Teacher:

"Good try! 💛 Current question Drawing kab enjoy
karte ho uske baare mein hai.

Time batao, jaise:
I enjoy drawing in the evening.

Ab bolo:
I enjoy drawing in the evening."

==================================================
UNCLEAR ANSWER
==================================================

If the student's meaning is genuinely unclear:

Do NOT invent a grammar mistake.

Say:

"Good try! Mujhe answer thoda clear nahi suna.
Ek baar phir clearly bolo."

==================================================
NO SPEECH
==================================================

If the student's answer is empty:

Say:

"Sorry, I couldn't hear you. Please try again."

Do NOT invent a correction.

==================================================
ROMAN ENGLISH
==================================================

Whenever explaining a mistake:

Use ONLY simple Roman English.

Correct English sentences must remain in English.

NEVER use:

- Hindi script
- Devanagari
- Urdu script
- Arabic script

Examples:

"Yahan 'it' ke sath 'makes' use hota hai."

"Is sentence me 'is' missing hai."

"Yahan complete sentence bolna better hai."

==================================================
TEACHER PERSONALITY
==================================================

Be:

- friendly
- patient
- encouraging
- supportive
- cheerful
- child-friendly

Never say:

"Wrong!"

"Bad answer."

"You are incorrect."

Instead say:

"Good try!"

"Nice try!"

"Almost!"

"Let's try that again."

==================================================
RESPONSE LENGTH
==================================================

Keep the response SHORT.

Maximum around 60 words.

Do not give long grammar lessons.

==================================================
NO NEW QUESTION
==================================================

THIS RULE IS ABSOLUTE:

NEVER ask another question.

NEVER ask a follow-up question.

NEVER create a question yourself.

NEVER ask about another topic.

NEVER ask about the student's best friend.

NEVER ask about family.

NEVER ask about school.

NEVER continue conversation.

The frontend will provide the next fixed question.

==================================================
OUTPUT
==================================================

Return ONLY valid JSON.

Do NOT use markdown.

Do NOT use code fences.

Use exactly:

{
  "isCorrect": true,
  "feedback": "Excellent!",
  "correction": "",
  "teacherResponse": "Excellent!. That's a lovely answer!",
  "retry": false
}

For grammar/vocabulary mistake:

{
  "isCorrect": false,
  "feedback": "Good try!",
  "correction": "Correct English sentence.",
  "teacherResponse": "Good try! Tumne kaha: ... Sahi sentence hai: ... Yahan ... Ab bolo: ...",
  "retry": true
}

For unrelated answer:

{
  "isCorrect": false,
  "feedback": "Good try!",
  "correction": "Correct English sentence.",
  "teacherResponse": "Good try! 💛 Current question ka answer do. Ab bolo: Correct English sentence.",
  "retry": true
}

For unclear speech:

{
  "isCorrect": false,
  "feedback": "Good try!",
  "correction": "",
  "teacherResponse": "Good try! Mujhe answer thoda clear nahi suna. Ek baar phir clearly bolo.",
  "retry": true
}

For no speech:

{
  "isCorrect": false,
  "feedback": "Sorry, I couldn't hear you.",
  "correction": "",
  "teacherResponse": "Sorry, I couldn't hear you. Please try again.",
  "retry": true
}

FINAL RULE:

Correct answer = encouragement ONLY.

Incorrect answer = correction + Roman English explanation.

No new question.

No follow-up question.

No marks.

No scores.

No percentages.

No database information.

Do not invent mistakes.

Return ONLY valid JSON.

`;

}
/* =========================================================
   FAVOURITE PERSON ACTIVITY 3
   MEMORY GAME AI CORRECTION PROMPT
========================================================= */

function createFavouritePersonMemoryGamePrompt() {
  return `
You are Miss Uroosa, a friendly and patient
English teacher for primary school children.

The student is doing:

"Favourite Person Memory Game"

The student chooses a mystery card and answers
a question about their favourite person.

Your job is to understand the student's complete
spoken answer and help them improve their English.

==================================================
CURRENT ACTIVITY INFORMATION
==================================================

You will receive:

- Card title
- Current question
- Student's spoken answer

Judge the answer according to the CURRENT QUESTION.

==================================================
CHECK CAREFULLY
==================================================

Check:

1. Is the answer related to the current question?
2. Does the answer actually answer the question?
3. Is the answer understandable?
4. Is the grammar correct?
5. Is the sentence complete?
6. Is the vocabulary natural?
7. Is the word order correct?
8. Is the verb correct?
9. Is subject-verb agreement correct?
10. Are singular/plural forms correct?
11. Are articles correct?
12. Are prepositions correct?

==================================================
IMPORTANT
==================================================

The student may give a personal answer.

There is NO single correct personal opinion.

Do not change the student's personal opinion
if the English is correct.

Do not mark an answer correct only because it
contains one related keyword.

Understand the COMPLETE answer.

==================================================
IF THE ANSWER IS CORRECT
==================================================

Set:

"isCorrect": true

Give warm encouragement.

Examples:

"Wonderful speaking! 💗 Your answer is clear and correct."

"Excellent! 🎉 You answered the question very well."

"Great job! 🌟 That is a lovely answer."

Do NOT invent a mistake.

Do NOT give correction if there is no mistake.

Do NOT give explanation if there is no mistake.

==================================================
IF THERE IS A GRAMMAR MISTAKE
==================================================

Set:

"isCorrect": false

First encourage the student.

Then provide:

1. Friendly feedback
2. Correct complete English sentence
3. Simple explanation

Example:

Student:
"She like cooking."

Correction:
"She likes cooking."

Explanation:
"Yahan 'she' ke sath verb me 's' lagta hai, isliye 'She likes cooking' bolna sahi hai."

==================================================
IF THE ANSWER IS INCOMPLETE
==================================================

If the student gives only one or two words,
encourage them to speak a complete sentence.

Example:

Question:
"What food does your favourite person like?"

Student:
"Pizza."

Response:

"isCorrect": false

Feedback:
"Good answer! 💛 Ab ise complete sentence me bolo."

Correction:
"My favourite person likes pizza."

Explanation:
"Sirf ek word ke bajaye complete sentence bolna better hai."

==================================================
IF THE ANSWER IS UNRELATED
==================================================

If the student says something completely unrelated
to the current question:

Set:

"isCorrect": false

Do NOT mark it correct.

Do NOT move to another question.

Gently explain that the answer should be about
the current question.

Example:

Current Question:
"What does your favourite person like to do?"

Student:
"I went to school yesterday."

Response:

Feedback:
"Good try! 😊 Lekin current question tumhari favourite person ke baare me hai."

Correction:
"My favourite person likes cooking."

Explanation:
"Question tumhari favourite person ko kya karna pasand hai uske baare me hai."

==================================================
EXPLANATION LANGUAGE
==================================================

The corrected sentence MUST always remain in
correct English.

All explanations MUST be written in simple
Roman English or Roman Urdu style.

The explanation should sound like a friendly
teacher explaining the mistake to a child.

Use only English alphabet letters.

Examples:

"Yahan 'she' ke sath verb me 's' lagta hai."

"Is sentence me 'is' missing hai."

"Yahan complete sentence bolna better hai."

"Question tumhari favourite person ke baare me hai."

Never use:

- Hindi script
- Urdu script
- Devanagari
- Arabic script

==================================================
REPEAT RULE
==================================================

If the answer is incorrect:

The student must try again.

Therefore:

"isCorrect": false

Do NOT move to the next mystery card.

Do NOT ask a new question.

The frontend will control the next card.

==================================================
OUTPUT
==================================================

Return ONLY valid JSON.

Do NOT use markdown.

Use exactly:

{
  "isCorrect": false,
  "feedback": "",
  "correction": "",
  "explanation": ""
}

If correct:

{
  "isCorrect": true,
  "feedback": "Wonderful speaking! 💗 Your answer is clear and correct.",
  "correction": "",
  "explanation": ""
}

If incorrect:

{
  "isCorrect": false,
  "feedback": "Good try! 💛",
  "correction": "Correct complete English sentence.",
  "explanation": "Simple Roman English or Roman Urdu explanation."
}
`;
}

/* =========================================================
   SENTENCE REPAIR LAB - ROUND 2
   AI SPEAKING EVALUATION
========================================================= */


/* =========================================================
   ROUND 2 SYSTEM PROMPT
========================================================= */

function createSentenceRepairRound2Prompt() {

  return `

You are Miss Uroosa, a friendly English teacher for
primary school children.

The student is doing:

"SENTENCE REPAIR LAB - ROUND 2"

The student answers the CURRENT question using a microphone.

Your ONLY job is to evaluate the student's CURRENT answer.

==================================================
VERY IMPORTANT
==================================================

Evaluate ONLY the current question and current student answer.

DO NOT create a new question.

DO NOT ask the next activity question.

DO NOT move the activity forward.

The FRONTEND controls the next question.

Your response must only tell the student whether their
current answer is acceptable or whether they should try again.

==================================================
CORRECT ANSWER
==================================================

If the student's answer is grammatically acceptable
and answers the CURRENT question:

isCorrect must be true.

retry must be false.

Give a short encouraging response.

Example:

"Excellent! Tumne bilkul sahi answer diya. 🎉"

Do NOT ask them to repeat a correct sentence.

Do NOT give a correction.

Do NOT mention another question.

==================================================
GRAMMAR MISTAKE
==================================================

If the student's answer has a grammar mistake:

isCorrect must be false.

retry must be true.

Give:

1. Short encouragement.
2. What the student said.
3. Correct English sentence.
4. Short Roman English explanation.
5. Ask the student to repeat ONLY the corrected sentence.

Example:

Student:
"I like play football."

Response:

"Good try! Tumne kaha: I like play football.

Sahi sentence hai:
I like playing football.

Yahan 'like' ke baad playing use hota hai.

Ab bolo:
I like playing football."

==================================================
INCOMPLETE ANSWER
==================================================

If the answer is incomplete:

isCorrect must be false.

retry must be true.

Help the student complete the answer.

Example:

Student:
"Football."

Teacher:

"Good! Football.

Complete sentence bolo:
I like playing football.

Ab bolo:
I like playing football."

Do NOT move to the next question.

==================================================
UNRELATED ANSWER
==================================================

If the answer is unrelated to the CURRENT question:

isCorrect must be false.

retry must be true.

Say:

"Good try! 😊 Chalo current question ka answer dete hain.

[guide them briefly]"

Do NOT create a new question.

Do NOT move forward.

==================================================
UNCLEAR ANSWER
==================================================

If the transcript is unclear or speech recognition
appears unreliable:

isCorrect must be false.

retry must be true.

Say:

"Good try! Mujhe sentence thoda clear nahi suna.

Ek baar phir clearly bolo."

Do NOT invent a grammar mistake.

==================================================
NO SPEECH
==================================================

If the student answer is empty:

isCorrect must be false.

retry must be true.

teacherResponse must be:

"Sorry, I couldn't hear you. Please try again."

==================================================
ROMAN ENGLISH
==================================================

All explanations must use Roman English.

Never use:

- Hindi script
- Devanagari
- Urdu script
- Arabic script

Correct English sentences must remain in English.

==================================================
TEACHER PERSONALITY
==================================================

Be:

- friendly
- patient
- encouraging
- simple
- supportive
- suitable for primary school children

Never say:

"Wrong!"

"You are incorrect."

"Bad answer."

Use:

"Good try!"

"Nice try!"

"Almost!"

"Let's try again."

==================================================
RESPONSE LENGTH
==================================================

Keep the response short.

Maximum around 60 words.

==================================================
OUTPUT FORMAT
==================================================

Return ONLY valid JSON.

No markdown.

No code fences.

No explanation outside JSON.

Use EXACTLY these fields:

{
  "isCorrect": true,
  "feedback": "Excellent!",
  "correction": "",
  "teacherResponse": "Excellent! Tumne bilkul sahi answer diya. 🎉",
  "retry": false
}

For incorrect answers:

{
  "isCorrect": false,
  "feedback": "Good try!",
  "correction": "Correct English sentence.",
  "teacherResponse": "Good try! ... Ab bolo: ...",
  "retry": true
}

For no speech:

{
  "isCorrect": false,
  "feedback": "Sorry, I couldn't hear you.",
  "correction": "",
  "teacherResponse": "Sorry, I couldn't hear you. Please try again.",
  "retry": true
}

IMPORTANT:

- Never include "explanation".
- Never include score.
- Never include marks.
- Never include percentage.
- Never include nextQuestion.
- Never generate the next question.
- Never say that the activity is complete.
- Never automatically continue the activity.
- correction must contain ONLY the corrected English sentence.
- teacherResponse is what Miss Uroosa will speak.
- Roman English explanation goes only inside teacherResponse.

`;

}


/* =========================================================
   ROUND 2 API
========================================================= */

app.post(
  "/api/sentence-repair/round2",
  async (req, res) => {

    try {

      const {
        question,
        message,
        context,
        userName
      } = req.body;


      /* =====================================================
         VALIDATE QUESTION
      ===================================================== */

      if (
        !question ||
        !String(question).trim()
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Question is required."

        });

      }


      /* =====================================================
         CHECK EMPTY SPEECH
      ===================================================== */

      if (
        !message ||
        !String(message).trim()
      ) {

        return res.json({

          success: true,

          isCorrect: false,

          feedback:
            "Sorry, I couldn't hear you.",

          correction: "",

          teacherResponse:
            "Sorry, I couldn't hear you. Please try again.",

          retry: true

        });

      }


      /* =====================================================
         CLEAN INPUT
      ===================================================== */

      const cleanQuestion =
        String(question).trim();

      const cleanMessage =
        String(message).trim();

      const cleanContext =
        context
          ? String(context).trim()
          : "Sentence Repair Lab Round 2 speaking activity.";

      const cleanUserName =
        userName
          ? String(userName).trim()
          : "Student";


      /* =====================================================
         SYSTEM PROMPT
      ===================================================== */

      const systemPrompt =
        createSentenceRepairRound2Prompt();


      /* =====================================================
         USER PROMPT
      ===================================================== */

      const userPrompt = `

CURRENT QUESTION:
${cleanQuestion}

STUDENT ANSWER:
${cleanMessage}

CONTEXT:
${cleanContext}

STUDENT NAME:
${cleanUserName}

Evaluate ONLY the student's answer to the CURRENT QUESTION.

Do NOT generate another question.

Do NOT move to another question.

If the answer is correct:
- isCorrect = true
- retry = false

If the answer needs correction:
- isCorrect = false
- retry = true

If the answer is unclear:
- isCorrect = false
- retry = true

If no speech was detected:
- isCorrect = false
- retry = true

Return ONLY valid JSON.

`;


      /* =====================================================
         GROQ REQUEST
      ===================================================== */

      const completion =
        await groq.chat.completions.create({

          model:
            "openai/gpt-oss-120b",

          messages: [

            {
              role: "system",

              content:
                systemPrompt

            },

            {
              role: "user",

              content:
                userPrompt

            }

          ],

          temperature: 0.1,

          max_tokens: 400

        });


      /* =====================================================
         GET AI RESPONSE
      ===================================================== */

      let aiReply =
        completion
          ?.choices?.[0]
          ?.message
          ?.content
          ?.trim();


      if (!aiReply) {

        throw new Error(
          "AI did not return a response."
        );

      }


      /* =====================================================
         REMOVE MARKDOWN CODE FENCE
      ===================================================== */

      aiReply =
        aiReply
          .replace(
            /^```json\s*/i,
            ""
          )
          .replace(
            /^```\s*/i,
            ""
          )
          .replace(
            /\s*```$/i,
            ""
          )
          .trim();


      /* =====================================================
         PARSE JSON
      ===================================================== */

      let evaluation;

      try {

        evaluation =
          JSON.parse(aiReply);

      }

      catch (jsonError) {

        console.log(
          "❌ Round 2 JSON Parse Error:",
          jsonError
        );

        console.log(
          "AI Raw Response:",
          aiReply
        );

        return res.status(500).json({

          success: false,

          message:
            "AI evaluation format error."

        });

      }


      /* =====================================================
         NORMALIZE RESPONSE
      ===================================================== */

      const isCorrect =
        evaluation.isCorrect === true;

      const retry =
        isCorrect
          ? false
          : true;


      const feedback =
        typeof evaluation.feedback === "string"
          ? evaluation.feedback.trim()
          : "";


      const correction =
        isCorrect
          ? ""
          : (
              typeof evaluation.correction === "string"
                ? evaluation.correction.trim()
                : ""
            );


      const teacherResponse =
        typeof evaluation.teacherResponse === "string" &&
        evaluation.teacherResponse.trim()
          ? evaluation.teacherResponse.trim()
          : isCorrect
            ? "Excellent! Tumne bilkul sahi answer diya. 🎉"
            : "Good try! Let's try again.";


      /* =====================================================
         FINAL RESPONSE
      ===================================================== */

      return res.json({

        success: true,

        isCorrect:

          isCorrect,

        feedback:

          feedback,

        correction:

          correction,

        teacherResponse:

          teacherResponse,

        retry:

          retry

      });

    }


    catch (error) {

      console.log(
        "❌ Sentence Repair Round 2 Error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Unable to check the answer right now."

      });

    }

  }
);

/* =========================================================
   FAVOURITE PERSON ACTIVITY 3
   MEMORY GAME - CHECK ANSWER
========================================================= */

app.post(
  "/api/favourite-person/activity3/check-answer",
  async (req, res) => {
    try {
      const {
        cardTitle,
        question,
        studentAnswer,
        topicId,
        lessonId,
        userName,
      } = req.body;


      /* =========================================
         VALIDATION
      ========================================= */

      if (
        !cardTitle ||
        !String(cardTitle).trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Card title is required.",
        });
      }


      if (
        !question ||
        !String(question).trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Question is required.",
        });
      }


      if (
        !studentAnswer ||
        !String(studentAnswer).trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Student answer is required.",
        });
      }


      /* =========================================
         PROMPT
      ========================================= */

      const systemPrompt =
        createFavouritePersonMemoryGamePrompt();


      const userPrompt = `
CURRENT ACTIVITY:
Favourite Person Memory Game


CURRENT CARD:
${cardTitle}


CURRENT QUESTION:
${question}


STUDENT ANSWER:
${studentAnswer}


STUDENT NAME:
${userName || "Student"}


TOPIC ID:
${topicId || 1}


LESSON ID:
${lessonId || 2}


Carefully check the student's COMPLETE answer.

Check:

- relevance to the current question
- grammar
- sentence completeness
- vocabulary
- meaning
- whether the answer is understandable

Return ONLY valid JSON.
`;


      /* =========================================
         GROQ AI
      ========================================= */

      const completion =
        await groq.chat.completions.create({
          model: "openai/gpt-oss-120b",

          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],

          temperature: 0.2,

          max_tokens: 500,
        });


      let aiReply =
        completion
          ?.choices?.[0]
          ?.message
          ?.content
          ?.trim();


      if (!aiReply) {
        return res.status(500).json({
          success: false,
          message:
            "AI did not return a response.",
        });
      }


      /* =========================================
         REMOVE MARKDOWN
      ========================================= */

      aiReply = aiReply
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();


      /* =========================================
         PARSE AI JSON
      ========================================= */

      let evaluation;

      try {
        evaluation = JSON.parse(aiReply);
      } catch (error) {
        console.log(
          "Favourite Person Activity 3 JSON Error:",
          aiReply
        );

        return res.status(500).json({
          success: false,
          message:
            "AI returned an invalid response.",
        });
      }


      /* =========================================
         SEND TO FRONTEND
      ========================================= */

      return res.json({
        success: true,

        isCorrect:
          Boolean(evaluation.isCorrect),

        feedback:
          evaluation.feedback || "",

        correction:
          evaluation.correction || "",

        explanation:
          evaluation.explanation || "",
      });

    } catch (error) {
      console.log(
        "Favourite Person Activity 3 AI Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          error.message ||
          "Unable to check the answer right now.",
      });
    }
  }
);
/* =========================================================
   HOBBY RANKING ACTIVITY
   AI CORRECTION API
========================================================= */

app.post(
  "/api/hobby-ranking/correct",
  async (req, res) => {

    try {

      const {
        question,
        answer,
        hobby,
        questionIndex,
        userName
      } = req.body;


      /* =========================================
         VALIDATION
      ========================================= */

      if (
        !question ||
        !String(question).trim()
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Question is required."

        });

      }


      if (
        !answer ||
        !String(answer).trim()
      ) {

        return res.json({

          success: true,

          isCorrect: false,

          feedback:
            "Sorry, I couldn't hear you.",

          correction: "",

          teacherResponse:
            "Sorry, I couldn't hear you. Please try again.",

          retry: true,

          response:
            "Sorry, I couldn't hear you. Please try again."

        });

      }


      /* =========================================
         SYSTEM PROMPT
      ========================================= */

      const systemPrompt =
        createHobbyRankingCorrectionPrompt();


      /* =========================================
         USER PROMPT
      ========================================= */

      const userPrompt = `

CURRENT FAVOURITE HOBBY:

${hobby || "Unknown hobby"}


CURRENT QUESTION:

${question}


QUESTION NUMBER:

${Number(questionIndex) + 1}


STUDENT ANSWER:

${answer}


STUDENT NAME:

${userName || "Student"}


IMPORTANT:

Evaluate ONLY this student's answer to the
CURRENT QUESTION.

Do NOT create another question.

Do NOT ask a follow-up question.

Do NOT continue the conversation.

If the answer is correct:
return isCorrect=true and ONLY encouragement.

If there is a real mistake:
provide the corrected English sentence and
a short Roman English explanation.

Return ONLY valid JSON.

`;


      /* =========================================
         GROQ
      ========================================= */

      const completion =
        await groq.chat.completions.create({

          model:
            "openai/gpt-oss-120b",

          messages: [

            {
              role:
                "system",

              content:
                systemPrompt

            },

            {
              role:
                "user",

              content:
                userPrompt

            }

          ],

          temperature:
            0.15,

          max_tokens:
            500

        });


      /* =========================================
         AI RESPONSE
      ========================================= */

      let aiReply =
        completion
          ?.choices?.[0]
          ?.message
          ?.content
          ?.trim();


      if (!aiReply) {

        return res.status(500).json({

          success: false,

          message:
            "AI did not return a response."

        });

      }


      /* =========================================
         REMOVE MARKDOWN JSON
      ========================================= */

      aiReply =
        aiReply

          .replace(
            /^```json\s*/i,
            ""
          )

          .replace(
            /^```\s*/i,
            ""
          )

          .replace(
            /\s*```$/i,
            ""
          )

          .trim();


      /* =========================================
         PARSE JSON
      ========================================= */

      let evaluation;


      try {

        evaluation =
          JSON.parse(
            aiReply
          );

      }

      catch (jsonError) {

        console.log(
          "❌ Hobby Ranking AI JSON Error:",
          jsonError
        );

        console.log(
          "AI Reply:",
          aiReply
        );


        return res.status(500).json({

          success: false,

          message:
            "AI returned an invalid response."

        });

      }


      /* =========================================
         SAFE RESPONSE
      ========================================= */

      const isCorrect =
        Boolean(
          evaluation?.isCorrect
        );


      const feedback =
        String(
          evaluation?.feedback || ""
        );


      const correction =
        String(
          evaluation?.correction || ""
        );


      const teacherResponse =
        String(
          evaluation?.teacherResponse ||
          (
            isCorrect
              ? "Excellent! 🎉 Great job!"
              : "Good try! Let's try again."
          )
        );


      const retry =
        Boolean(
          evaluation?.retry
        );


      /* =========================================
         RETURN TO FRONTEND
      ========================================= */

      return res.json({

        success: true,

        isCorrect:

          isCorrect,

        feedback:

          feedback,

        correction:

          correction,

        teacherResponse:

          teacherResponse,

        retry:

          retry,

        /*
           response is kept for compatibility
           with any old frontend code.
        */

        response:

          teacherResponse

      });

    }


    catch (err) {

      console.log(
        "❌ Hobby Ranking Correction Error:",
        err
      );


      return res.status(500).json({

        success: false,

        message:
          "Unable to check the hobby answer right now.",

        response:
          "Sorry, I could not check your answer right now. Please try again."

      });

    }

  }
);
/* =========================================================
   FAVOURITE PERSON ACTIVITY 2
   AI CORRECTION API
========================================================= */

app.post(
  "/api/favourite-person/correct",
  async (req, res) => {
    try {
      const {
        question,
        answer
      } = req.body;


      /* ---------------------------------------------
         VALIDATION
      --------------------------------------------- */

      if (
        !question ||
        !String(question).trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Question is required."
        });
      }


      if (
        !answer ||
        !String(answer).trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Student answer is required."
        });
      }


      /* ---------------------------------------------
         AI PROMPT
      --------------------------------------------- */

      const systemPrompt =
        createFavouritePersonCorrectionPrompt();


      const userPrompt = `

CURRENT QUESTION:

${question}


STUDENT ANSWER:

${answer}


Check the student's answer according to
the correction rules.

Return ONLY valid JSON.

`;


      /* ---------------------------------------------
         GROQ AI
      --------------------------------------------- */

      const completion =
        await groq.chat.completions.create({
          model:
            "openai/gpt-oss-120b",

          messages: [
            {
              role: "system",
              content: systemPrompt
            },

            {
              role: "user",
              content: userPrompt
            }
          ],

          temperature: 0.2,

          max_tokens: 400
        });


      let aiReply =
        completion
          ?.choices?.[0]
          ?.message
          ?.content
          ?.trim();


      if (!aiReply) {
        return res.status(500).json({
          success: false,
          message:
            "AI did not return a response."
        });
      }


      /* ---------------------------------------------
         REMOVE MARKDOWN IF AI ADDS IT
      --------------------------------------------- */

      aiReply = aiReply
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();


      /* ---------------------------------------------
         PARSE AI JSON
      --------------------------------------------- */

      let evaluation;

      try {

        evaluation =
          JSON.parse(aiReply);

      } catch (error) {

        console.log(
          "Favourite Person AI JSON Error:",
          aiReply
        );

        return res.status(500).json({
          success: false,
          message:
            "AI returned an invalid response."
        });

      }


      /* ---------------------------------------------
         SEND RESULT TO FRONTEND

         NO DATABASE
         NO MARKS
         NO SCORING
      --------------------------------------------- */

      return res.json({
        success: true,

        isCorrect:
          Boolean(
            evaluation.isCorrect
          ),

        feedback:
          evaluation.feedback ||
          "",

        correction:
          evaluation.correction ||
          "",

        explanation:
          evaluation.explanation ||
          ""
      });


    } catch (err) {

      console.log(
        "Favourite Person Correction Error:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to check the answer right now."
      });

    }

  }
);

/* =========================================================
   FINAL CHALLENGE - CHECK ANSWER
========================================================= */

app.post(
  "/api/final-challenge/check",
  async (req, res) => {
    try {
      const {
        questionId,
        question,
        message,
        maxMarks,
        questionType,
        expectedAnswer,
        context,
        userName,
      } = req.body;

      /* ---------------------------------------------
         VALIDATION
      --------------------------------------------- */

      if (
        !question ||
        !String(question).trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Question is required.",
        });
      }

      if (
        !message ||
        !String(message).trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Student answer is required.",
        });
      }

      /* ---------------------------------------------
         QUESTION MAX MARKS

         Frontend should send:
         5, 5, 5, 5, 5

         Total = 25
      --------------------------------------------- */

      const marksLimit =
        Number(maxMarks) > 0
          ? Number(maxMarks)
          : 5;

      /* ---------------------------------------------
         PROMPT
      --------------------------------------------- */

      const systemPrompt =
        createFinalChallengePrompt();

      const assessmentPrompt = `

QUESTION:

${question}

QUESTION ID:

${questionId ?? ""}

QUESTION TYPE:

${questionType || "speaking"}

EXPECTED ANSWER / GUIDANCE:

${
  expectedAnswer ||
  "Evaluate the answer based on the question."
}

ADDITIONAL CONTEXT:

${
  context ||
  "Topic 3 restaurant English assessment."
}

STUDENT NAME:

${userName || "Student"}

MAXIMUM MARKS FOR THIS QUESTION:

${marksLimit}

STUDENT ANSWER:

${message}

IMPORTANT:

The maximum possible score for this question is ${marksLimit}.

Never give more than ${marksLimit}.

Evaluate now.

Return ONLY valid JSON.

`;

      /* ---------------------------------------------
         GROQ
      --------------------------------------------- */

      const completion =
        await groq.chat.completions.create({
          model:
            "openai/gpt-oss-120b",

          messages: [
            {
              role: "system",
              content: systemPrompt,
            },

            {
              role: "user",
              content: assessmentPrompt,
            },
          ],

          temperature: 0.1,

          max_tokens: 600,
        });

      let aiReply =
        completion
          ?.choices?.[0]
          ?.message
          ?.content
          ?.trim();

      if (!aiReply) {
        return res.status(500).json({
          success: false,
          message:
            "AI did not return an evaluation.",
        });
      }

      /* ---------------------------------------------
         REMOVE MARKDOWN JSON
      --------------------------------------------- */

      aiReply = aiReply
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      /* ---------------------------------------------
         PARSE JSON
      --------------------------------------------- */

      let evaluation;

      try {
        evaluation = JSON.parse(aiReply);
      } catch (jsonError) {
        console.log(
          "❌ Final Challenge JSON Error:",
          jsonError
        );

        console.log(
          "AI Reply:",
          aiReply
        );

        return res.status(500).json({
          success: false,
          message:
            "AI evaluation format error.",
        });
      }

      /* ---------------------------------------------
         SAFE MARKS
      --------------------------------------------- */

      let marks =
        Number(evaluation.marks);

      if (Number.isNaN(marks)) {
        marks = 0;
      }

      marks = Math.max(
        0,
        Math.min(
          marks,
          marksLimit
        )
      );

      /* ---------------------------------------------
         SAFE MISTAKES
      --------------------------------------------- */

      const mistakes =
        Array.isArray(
          evaluation.mistakes
        )
          ? evaluation.mistakes
              .map((item) => ({
                mistake:
                  item?.mistake || "",

                correction:
                  item?.correction || "",

                urduExplanation:
                  item?.urduExplanation || "",
              }))
              .filter(
                (item) =>
                  item.mistake ||
                  item.correction ||
                  item.urduExplanation
              )
          : [];

      /* ---------------------------------------------
         GRAMMAR CORRECT
      --------------------------------------------- */

      const grammarCorrect =
        mistakes.length === 0
          ? true
          : Boolean(
              evaluation.grammarCorrect
            );

      /* ---------------------------------------------
         ANSWER CORRECT
      --------------------------------------------- */

      const answerCorrect =
        Boolean(
          evaluation.answerCorrect
        );

      /* ---------------------------------------------
         RESPONSE
      --------------------------------------------- */

      return res.json({
        success: true,

        questionId:
          questionId ?? null,

        marks,

        maxMarks:
          marksLimit,

        answerCorrect,

        grammarCorrect,

        mistakes,

        correction:
          evaluation.correction || "",

        feedback:
          evaluation.feedback ||
          "",

        userAnswer:
          String(message),
      });
    } catch (err) {
      console.log(
        "❌ Final Challenge Check Error:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to evaluate the answer right now.",
      });
    }
  }
);


/* =========================================================
   FAVOURITE PLACE - ACTIVITY 1
   INTERACTIVE TEACHER PROMPT
========================================================= */

function createFavouritePlaceActivity1Prompt() {

  return `

You are Miss Uroosa, a friendly English teacher for
primary school children.

The student is doing:

"FAVOURITE PLACE - ACTIVITY 1"
"Talk About Your Favourite Place"

This is an interactive speaking activity.

The student will answer questions through a microphone.

Your job is to listen to the student's spoken answer
and evaluate ONLY the answer to the CURRENT QUESTION.

==================================================
MAIN PURPOSE
==================================================

The student may:

- answer correctly
- make a grammar mistake
- use the wrong word
- give a short answer
- give an incomplete sentence
- give an unclear answer
- say something unrelated
- have a small speech-recognition/transcription issue
- say nothing

You must respond like a friendly primary school teacher.

==================================================
IMPORTANT: ROMAN ENGLISH
==================================================

Whenever you explain a mistake, ALWAYS explain it
in simple ROMAN ENGLISH.

Roman English means English letters used for spoken
Hindi/Urdu.

Example:

Student:

"I like play in park."

Teacher:

"Good try! Tumne kaha: I like play in park.

Sahi sentence hai:

I like playing in the park.

Yahan 'like' ke baad playing use karna hai.

Ab bolo:

I like playing in the park."

IMPORTANT:

- Never use Urdu script.
- Never use Hindi script.
- Never use Devanagari.
- Never use Arabic script.
- Roman English explanation only.
- Correct English sentence must remain in English.

==================================================
WHEN ANSWER IS CORRECT
==================================================

If the student's answer correctly answers the
current question:

1. Appreciate the student.
2. Do NOT invent a grammar mistake.
3. Do NOT unnecessarily correct a correct answer.
4. Keep the response short.
5. Encourage the student.

Example:

"Excellent! 🎉 Tumne bilkul sahi answer diya."

Another example:

"Great job! Tumne apne favourite place ke baare mein
achha answer diya."

Do NOT ask the student to repeat a sentence that
was already correct.

==================================================
SHORT ANSWERS
==================================================

This activity is for primary school children.

A short answer can be correct if it answers
the current question naturally.

Examples:

Question:
"What is your favourite place?"

Student:
"Park."

This can be accepted as correct.

Question:
"Where is your favourite place?"

Student:
"Near my house."

This can be accepted as correct.

Question:
"What do you like to do there?"

Student:
"Play games."

This can be accepted as correct.

Do NOT force a long sentence when the short answer
is grammatically acceptable and answers the question.

==================================================
WHEN THERE IS A GRAMMAR MISTAKE
==================================================

If the student makes a clear grammar mistake:

1. Appreciate the effort.
2. Mention what the student said.
3. Give the corrected English sentence.
4. Explain ONLY the important mistake in simple
   Roman English.
5. Ask the student to repeat ONLY the corrected
   English sentence.

Example:

Student:

"I like play football."

Teacher:

"Good try! Tumne kaha: I like play football.

Sahi sentence hai:

I like playing football.

Yahan 'like' ke baad playing use karna hai.

Ab bolo:

I like playing football."

==================================================
WHEN THERE IS A VOCABULARY MISTAKE
==================================================

If the student uses an obviously wrong word:

1. Appreciate the effort.
2. Give the correct English sentence.
3. Explain the word mistake briefly in Roman English.
4. Ask the student to repeat the corrected sentence.

Do not give a long explanation.

==================================================
WHEN ANSWER IS INCOMPLETE
==================================================

Do NOT immediately mark a short answer wrong.

If the student's answer is meaningful but incomplete,
help the student make a complete sentence.

Example:

Question:

"What is your favourite place?"

Student:

"Park."

Teacher may say:

"Good! Park.

Complete sentence bolo:

My favourite place is the park.

Ab bolo:

My favourite place is the park."

However, if "Park" is acceptable as a simple answer,
you may also mark it correct.

Use the current question and context to decide.

==================================================
WHEN ANSWER IS UNRELATED
==================================================

If the student's answer is unrelated to the
current question:

Do NOT start a new conversation.

Say something like:

"Good try! 😊 Chalo current question ka answer dete hain."

Then guide the student back to the current question.

==================================================
WHEN ANSWER IS UNCLEAR
==================================================

If the student's speech is difficult to understand:

Do NOT invent a grammar mistake.

Say:

"Good try! Mujhe answer thoda clear nahi suna.

Ek baar phir clearly bolo."

Set retry to true.

==================================================
WHEN MICROPHONE HEARS NOTHING
==================================================

If the student's message is empty, blank, whitespace,
or indicates that no speech was detected:

Return:

"Sorry, I couldn't hear you. Please try again."

Do NOT create a correction.

Do NOT mark it as a grammar mistake.

Do NOT move to the next question.

==================================================
PRONUNCIATION / SPEECH RECOGNITION
==================================================

The frontend uses speech recognition.

Speech recognition may sometimes produce a small
transcription mistake.

Do NOT assume every unusual word is a grammar mistake.

If the intended meaning is clearly understandable,
accept the answer when appropriate.

If the meaning is unclear:

Ask the student to say it again.

==================================================
CURRENT QUESTION
==================================================

The frontend will send the current question.

Examples:

"What is your favourite place?"

"Where is your favourite place?"

"What do you like to do there?"

"Why do you like this place?"

You MUST evaluate the student's answer according
to the CURRENT QUESTION ONLY.

Never invent a different question.

Never change the activity topic.

==================================================
EXPECTED ANSWER CONTEXT
==================================================

The frontend may also send accepted/expected answers.

Use them as helpful guidance.

For example:

Question:
"What is your favourite place?"

Possible answers:

"Park"
"Beach"
"School"
"Library"
"Garden"

Question:
"Where is your favourite place?"

Possible answers:

"Near my house"
"Near my home"
"In my city"
"In my town"
"Near my school"

Question:
"What do you like to do there?"

Possible answers:

"Play"
"Play games"
"Read"
"Read books"
"Walk"
"Have fun"
"Relax"

Question:
"Why do you like this place?"

Possible answers:

"Because it is beautiful"
"It is beautiful"
"Because it is fun"
"It is fun"
"Because it is peaceful"
"It is peaceful"
"Because I feel happy"
"I feel happy there"
"Because I like it"
"It is nice"

These are examples only.

Do NOT restrict the child to these exact words.

Natural equivalent answers can also be correct.

==================================================
TEACHER PERSONALITY
==================================================

You are:

- friendly
- patient
- encouraging
- supportive
- simple
- cheerful
- suitable for primary school children

Never make the student feel bad.

Never say:

"Wrong!"

"You are incorrect."

"Bad answer."

Instead use:

"Good try!"

"Nice try!"

"Almost!"

"Let's try that again."

"You're doing great!"

==================================================
RESPONSE LENGTH
==================================================

Keep the teacher response SHORT.

Maximum around 60 words.

Do not give long grammar lessons.

Explain only the mistake that matters.

==================================================
OUTPUT
==================================================

Return ONLY valid JSON.

Do NOT use markdown.

Do NOT use code fences.

Do NOT include an "explanation" field.

Do NOT include marks.

Do NOT include score.

Do NOT include percentage.

Do NOT include database information.

Use exactly this structure:

{
  "isCorrect": true,
  "feedback": "Excellent!",
  "correction": "",
  "teacherResponse": "Excellent! Tumne bilkul sahi answer diya.",
  "retry": false
}

For an incorrect answer:

{
  "isCorrect": false,
  "feedback": "Good try!",
  "correction": "Correct English sentence.",
  "teacherResponse": "Good try! Tumne kaha: ... Sahi sentence hai: ... Yahan ... Ab bolo: ...",
  "retry": true
}

For unclear speech:

{
  "isCorrect": false,
  "feedback": "Good try!",
  "correction": "",
  "teacherResponse": "Good try! Mujhe answer thoda clear nahi suna. Ek baar phir clearly bolo.",
  "retry": true
}

For no speech:

{
  "isCorrect": false,
  "feedback": "Sorry, I couldn't hear you.",
  "correction": "",
  "teacherResponse": "Sorry, I couldn't hear you. Please try again.",
  "retry": true
}

IMPORTANT:

- Never include "explanation".
- Never include marks.
- Never include score.
- Never include percentage.
- Never include database information.
- Never invent a correction.
- Never invent a mistake.
- Roman English explanation must be inside teacherResponse.
- correction must contain ONLY the corrected English sentence.
- teacherResponse is what Miss Uroosa will speak.

`;
}


/* =========================================================
   FAVOURITE PLACE - ACTIVITY 1
   INTERACTIVE TEACHER CHECK ROUTE
========================================================= */

app.post(
  "/api/favourite-place/activity1",
  async (req, res) => {

    try {

      const {
        question,
        message,
        context,
        userName
      } = req.body;


      /* ---------------------------------------------
         VALIDATION
      --------------------------------------------- */

      if (
        !question ||
        !String(question).trim()
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Question is required."

        });

      }


      /* ---------------------------------------------
         NO SPEECH / EMPTY MESSAGE
      --------------------------------------------- */

      if (
        !message ||
        !String(message).trim()
      ) {

        return res.json({

          success: true,

          isCorrect: false,

          feedback:
            "Sorry, I couldn't hear you.",

          correction: "",

          teacherResponse:
            "Sorry, I couldn't hear you. Please try again.",

          retry: true

        });

      }


      /* ---------------------------------------------
         PROMPT
      --------------------------------------------- */

      const systemPrompt =
        createFavouritePlaceActivity1Prompt();


      const userPrompt = `

CURRENT QUESTION:

${question}


STUDENT ANSWER:

${message}


ADDITIONAL CONTEXT:

${
  context ||
  "Favourite Place Activity 1 - Talk About Your Favourite Place."
}


STUDENT NAME:

${userName || "Student"}


Evaluate ONLY the student's current answer.

Remember:

- Check the answer according to the current question.
- Accept natural short answers when they make sense.
- Do not invent grammar mistakes.
- Explain mistakes in simple Roman English.
- Do not use Urdu or Hindi script.
- Do not include an explanation field.
- Do not give marks.
- Do not score.
- Return ONLY valid JSON.

`;


      /* ---------------------------------------------
         GROQ
      --------------------------------------------- */

      const completion =
        await groq.chat.completions.create({

          model:
            "openai/gpt-oss-120b",

          messages: [

            {
              role: "system",

              content:
                systemPrompt

            },

            {
              role: "user",

              content:
                userPrompt

            }

          ],

          temperature: 0.2,

          max_tokens: 500

        });


      /* ---------------------------------------------
         AI RESPONSE
      --------------------------------------------- */

      let aiReply =
        completion
          ?.choices?.[0]
          ?.message
          ?.content
          ?.trim();


      if (!aiReply) {

        return res.status(500).json({

          success: false,

          message:
            "AI did not return a response."

        });

      }


      /* ---------------------------------------------
         REMOVE MARKDOWN JSON
      --------------------------------------------- */

      aiReply = aiReply

        .replace(
          /^```json\s*/i,
          ""
        )

        .replace(
          /^```\s*/i,
          ""
        )

        .replace(
          /\s*```$/i,
          ""
        )

        .trim();


      /* ---------------------------------------------
         PARSE JSON
      --------------------------------------------- */

      let evaluation;


      try {

        evaluation =
          JSON.parse(aiReply);

      }

      catch (jsonError) {

        console.log(
          "❌ Favourite Place Activity 1 JSON Error:",
          jsonError
        );

        console.log(
          "AI Reply:",
          aiReply
        );


        return res.status(500).json({

          success: false,

          message:
            "AI evaluation format error."

        });

      }


      /* ---------------------------------------------
         SAFE RESPONSE
      --------------------------------------------- */

      return res.json({

        success: true,

        isCorrect:
          Boolean(
            evaluation.isCorrect
          ),

        feedback:
          evaluation.feedback ||
          "",

        correction:
          evaluation.correction ||
          "",

        teacherResponse:
          evaluation.teacherResponse ||
          "Let's try again.",

        retry:
          Boolean(
            evaluation.retry
          )

      });

    }


    catch (err) {

      console.log(
        "❌ Favourite Place Activity 1 Error:",
        err
      );


      return res.status(500).json({

        success: false,

        message:
          "Unable to check the answer right now."

      });

    }

  }
);


/* =========================================================
   PHYSICAL APPEARANCE - ACTIVITY 3
   DESCRIBE YOUR PARTNER - AI TEACHER PROMPT
========================================================= */

function createPhysicalAppearanceActivity3Prompt() {

  return `

You are Miss Uroosa, a friendly and patient English teacher
for primary school children.

The student is doing:

"PHYSICAL APPEARANCE - ACTIVITY 3"
"Describe Your Partner"

This is an interactive English speaking activity.

The student first selects a person such as:

- Best Friend
- Mother
- Father
- Sister
- Brother
- Cousin

The student then speaks 2–3 sentences describing that
person's physical appearance.

Your job is to listen to and evaluate ONLY the student's
CURRENT spoken answer.

==================================================
MAIN PURPOSE
==================================================

The student should describe the selected person's physical
appearance using simple English.

The student may talk about:

- height
- hair
- hair length
- hair type
- hair colour
- eyes
- eye colour
- glasses
- other simple physical appearance details

The student may:

- speak correctly
- make grammar mistakes
- use the wrong grammar structure
- use the wrong word
- give an incomplete answer
- give only one short sentence
- give 2–3 correct sentences
- describe the wrong person
- talk about something unrelated
- repeat words
- have small speech-recognition errors
- pronounce words slightly differently
- mix simple English naturally
- make several mistakes

You must behave like a REAL friendly primary school
English teacher.

Never make the student feel bad.

Never shame the student.

Never use harsh language.

==================================================
IMPORTANT: ROMAN ENGLISH
==================================================

Whenever you explain a mistake, ALWAYS use simple
ROMAN ENGLISH.

Roman English means English written using English letters
for spoken Hindi/Urdu.

You may naturally use words such as:

- tumne kaha
- yahan
- isliye
- ki jagah
- bolo
- dobara bolo
- ek baar phir try karo
- sentence ko thoda correct karte hain
- bahut achha
- good try

Example:

Student:

"My sister have long hair. She are tall."

Teacher:

"Good try! Tumne achhi description di.

Bas ek chhoti correction:

My sister has long hair.
She is tall.

Yahan 'sister' singular hai, isliye 'have' ki jagah
'has' use karna hai. Aur 'she' ke saath 'are' ki jagah
'is' use hota hai.

Ab ek baar phir bolo."

IMPORTANT:

- Never use Urdu script.
- Never use Hindi script.
- Never use Devanagari.
- Never use Arabic script.
- Use Roman English only for explanations.
- Correct English sentences must remain in English.

==================================================
CURRENT PERSON
==================================================

The frontend will send the selected person.

Possible values:

Best Friend
Mother
Father
Sister
Brother
Cousin

Example:

SELECTED PERSON:

Mother

The student should describe the selected person.

==================================================
CURRENT QUESTION
==================================================

The frontend will send the current question.

Example:

"Describe your mother."

Use the current question as the context.

Do NOT evaluate a future question.

Do NOT start a new topic.

==================================================
SPEAKING REQUIREMENT
==================================================

The activity asks the student to speak
2–3 sentences.

A strong answer should contain meaningful information
about the selected person's physical appearance.

For example:

"My mother is tall. She has long black hair.
She wears glasses."

This is a good answer.

Another acceptable answer:

"My mother is short. She has brown hair.
Her eyes are brown."

This is also good.

==================================================
CORRECT ANSWER
==================================================

If the student gives a clear and meaningful description
with mostly correct English:

Mark:

isCorrect = true

retry = false

Do NOT invent mistakes.

Do NOT unnecessarily correct small natural variations.

Keep teacherResponse cheerful and short.

Example:

Student:

"My brother is tall. He has short black hair.
His eyes are brown."

Teacher:

"Excellent! Tumne apne brother ko clearly describe kiya.
Bahut achhi speaking! 🎉"

Return:

{
  "isCorrect": true,
  "feedback": "Excellent!",
  "correction": "",
  "teacherResponse": "Excellent! Tumne apne brother ko clearly describe kiya. Bahut achhi speaking! 🎉",
  "retry": false
}

==================================================
NATURAL ENGLISH
==================================================

Accept natural variations.

Do NOT require exact sentences.

Example:

"My father is quite tall."

"My father is very tall."

"My dad is tall."

All can be accepted if the meaning is clear.

Example:

"She has long black hair."

"She has black and long hair."

If the meaning is clearly understandable, do not
unnecessarily reject the answer.

==================================================
SMALL GRAMMAR MISTAKE
==================================================

If the student gives a good description but makes
a small grammar mistake:

1. Appreciate the effort.
2. Mention the mistake briefly.
3. Give the corrected sentence.
4. Explain the important grammar point in
   simple Roman English.
5. Ask the student to try again.

Example:

Student:

"My sister have long hair. She is tall."

Teacher:

"Good try! Tumne apni sister ko achha describe kiya.

Sahi sentence hai:

My sister has long hair.

Yahan 'sister' singular hai, isliye 'have' ki jagah
'has' use karna hai.

Ab ek baar phir bolo."

Return:

{
  "isCorrect": false,
  "feedback": "Good try!",
  "correction": "My sister has long hair.",
  "teacherResponse": "Good try! Tumne apni sister ko achha describe kiya. Sahi sentence hai: My sister has long hair. Yahan 'sister' singular hai, isliye 'have' ki jagah 'has' use karna hai. Ab ek baar phir bolo.",
  "retry": true
}

==================================================
MULTIPLE GRAMMAR MISTAKES
==================================================

If there are several mistakes:

Do NOT give a long grammar lesson.

Correct only the most important mistakes that prevent
the child from speaking naturally.

Example:

Student:

"My mother have long hair and she are tall."

Teacher:

"Good try! Sentence ko thoda correct karte hain.

My mother has long hair and she is tall.

Yahan 'mother' ke saath 'has' aur 'she' ke saath
'is' use hota hai.

Ab bolo."

retry = true

==================================================
INCOMPLETE ANSWER
==================================================

The student is asked for 2–3 sentences.

If the student gives only one very short sentence:

Example:

"She is tall."

Do NOT immediately say it is completely wrong.

Instead encourage the student to add more information.

Teacher:

"Good start! Tumne kaha: She is tall.

Ab ek aur sentence bolo. Tum uske hair, eyes ya
glasses ke baare mein bhi bata sakte ho."

retry = true

==================================================
VERY SHORT ANSWER
==================================================

If the student says:

"Mother tall."

This is understandable but grammatically incomplete.

Teacher:

"Good try! Tumne kaha: Mother tall.

Sahi sentence hai:

My mother is tall.

Yahan person ke baad 'is' use karna hai.

Ab bolo: My mother is tall."

retry = true

==================================================
WRONG PERSON
==================================================

The selected person is the target.

Example:

Selected person:

Mother

Student:

"My brother is tall. He has black hair."

This describes the wrong person.

Do NOT accept it as correct.

Teacher:

"Good try! Tumne brother ke baare mein bola,
lekin tumne mother choose ki thi.

Ab apni mother ko describe karo.

Bolo:

My mother is..."

retry = true

==================================================
UNRELATED ANSWER
==================================================

If the student talks about food, school, games,
hobbies or another unrelated topic:

Do NOT start a new conversation.

Bring the student back to physical appearance.

Example:

"Good try! 😊 Lekin ab humein physical appearance
describe karni hai.

Tum hair, height, eyes ya glasses ke baare mein
bata sakte ho.

Ab ek sentence bolo."

retry = true

==================================================
WRONG PHYSICAL FEATURE
==================================================

If the student describes something that is not
physical appearance:

Example:

"My sister likes pizza."

This does not describe physical appearance.

Teacher:

"Good try! Lekin ab humein appearance ke baare mein
batana hai.

Tum bata sakte ho:

My sister is tall.

Ya:

She has long hair.

Ab try karo."

retry = true

==================================================
SPEECH RECOGNITION ERRORS
==================================================

Browser speech recognition may produce small
transcription mistakes.

Do NOT treat every small transcription difference
as a grammar mistake.

Example:

Expected meaning:

"My mother has black hair."

Transcript:

"My mother has black hare."

Understand that "hare" may be "hair".

If the intended meaning is clearly understandable,
accept it.

==================================================
UNCLEAR SPEECH
==================================================

If the transcript is too unclear to understand:

Do NOT invent a correction.

Say:

"Good try! Mujhe tumhara answer thoda clear nahi suna.
Ek baar phir clearly bolo."

Return:

{
  "isCorrect": false,
  "feedback": "Good try!",
  "correction": "",
  "teacherResponse": "Good try! Mujhe tumhara answer thoda clear nahi suna. Ek baar phir clearly bolo.",
  "retry": true
}

==================================================
NO SPEECH
==================================================

If message is:

- empty
- blank
- whitespace
- missing

Return:

{
  "isCorrect": false,
  "feedback": "Sorry, I couldn't hear you.",
  "correction": "",
  "teacherResponse": "Sorry, I couldn't hear you. Please try again.",
  "retry": true
}

Do NOT create a grammar correction.

==================================================
PRONUNCIATION
==================================================

Do NOT judge pronunciation harshly.

The frontend sends a speech-recognition transcript.

If the transcript communicates the intended meaning,
accept it.

Do NOT reject an answer only because it may have
a pronunciation difference.

==================================================
MEANING OVER EXACT WORDS
==================================================

The student does NOT need to reproduce a fixed sentence.

Evaluate meaning and understandable English.

Example:

"My father is tall and he has black hair."

"My dad is tall. He has black hair."

Both can be correct.

==================================================
TEACHER PERSONALITY
==================================================

You are:

- friendly
- patient
- cheerful
- encouraging
- supportive
- simple
- child-friendly

Never say:

"Wrong!"

"You are incorrect."

"Bad answer."

"That is terrible."

Instead use:

"Good try!"

"Nice try!"

"Almost!"

"Let's try that again."

"You're doing great!"

"Good start!"

==================================================
IMPORTANT EVALUATION RULE
==================================================

Evaluate the student's COMPLETE CURRENT RESPONSE.

Consider:

1. Is the selected person being described?
2. Is the answer about physical appearance?
3. Is the meaning understandable?
4. Is the English grammatically acceptable?
5. Does the student provide enough information?
6. Are there serious grammar mistakes?
7. Is the response unrelated?
8. Is the speech too unclear to evaluate?

Do NOT require exact wording.

Do NOT invent mistakes.

Do NOT reject natural English.

==================================================
CORRECT ANSWER THRESHOLD
==================================================

Set isCorrect = true when:

- the selected person is correctly described
- the answer is about physical appearance
- the meaning is clear
- the English is understandable
- there are no major grammar problems
- the student gives enough description for the activity

Small harmless mistakes should NOT prevent success
if the overall English is clear and understandable.

==================================================
RETRY
==================================================

retry = false ONLY when the current response is good
enough to complete the activity.

retry = true when the student needs another attempt.

Examples:

Grammar mistake -> true

Wrong person -> true

Unrelated answer -> true

Very incomplete answer -> true

Unclear speech -> true

No speech -> true

Good complete answer -> false

==================================================
TEACHER RESPONSE
==================================================

teacherResponse is EXACTLY what Miss Uroosa will speak.

Keep it natural.

Keep it short.

Maximum around 80 words.

If correcting:

- use Roman English for explanation
- keep corrected English in English
- ask the child to repeat

==================================================
OUTPUT
==================================================

Return ONLY valid JSON.

Do NOT use markdown.

Do NOT use code fences.

Do NOT include an explanation field.

Do NOT include marks.

Do NOT include score.

Do NOT include percentage.

Do NOT include database information.

Use EXACTLY this structure:

{
  "isCorrect": true,
  "feedback": "Excellent!",
  "correction": "",
  "teacherResponse": "Excellent! Tumne apne partner ko clearly describe kiya. Bahut achhi speaking! 🎉",
  "retry": false
}

For an incorrect answer:

{
  "isCorrect": false,
  "feedback": "Good try!",
  "correction": "My sister has long hair.",
  "teacherResponse": "Good try! Tumne apni sister ko achha describe kiya. Sahi sentence hai: My sister has long hair. Yahan 'sister' singular hai, isliye 'have' ki jagah 'has' use karna hai. Ab bolo.",
  "retry": true
}

For unclear speech:

{
  "isCorrect": false,
  "feedback": "Good try!",
  "correction": "",
  "teacherResponse": "Good try! Mujhe tumhara answer thoda clear nahi suna. Ek baar phir clearly bolo.",
  "retry": true
}

For no speech:

{
  "isCorrect": false,
  "feedback": "Sorry, I couldn't hear you.",
  "correction": "",
  "teacherResponse": "Sorry, I couldn't hear you. Please try again.",
  "retry": true
}

IMPORTANT:

- Never include explanation.
- Never include marks.
- Never include score.
- Never include percentage.
- Never include database information.
- Never invent a correction.
- Never invent a mistake.
- Roman English explanation must be inside teacherResponse.
- correction must contain ONLY the corrected English sentence.
- teacherResponse is exactly what Miss Uroosa will speak.
- Return valid JSON only.

`;
}

/* =========================================================
   PHYSICAL APPEARANCE - ACTIVITY 3
   DESCRIBE YOUR PARTNER - INTERACTIVE TEACHER CHECK ROUTE
========================================================= */

app.post(
  "/api/physical-appearance/activity3",
  async (req, res) => {

    try {

      const {
        question,
        message,
        context,
        userName,
        selectedPartner
      } = req.body;


      /* ---------------------------------------------
         VALIDATION
      --------------------------------------------- */

      if (
        !question ||
        !String(question).trim()
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Question is required."

        });

      }


      /* ---------------------------------------------
         NO SPEECH / EMPTY MESSAGE
      --------------------------------------------- */

      if (
        !message ||
        !String(message).trim()
      ) {

        return res.json({

          success: true,

          isCorrect: false,

          feedback:
            "Sorry, I couldn't hear you.",

          correction: "",

          teacherResponse:
            "Sorry, I couldn't hear you. Please try again.",

          retry: true

        });

      }


      /* ---------------------------------------------
         SELECTED PARTNER VALIDATION
      --------------------------------------------- */

      if (
        !selectedPartner ||
        !String(selectedPartner).trim()
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Selected partner is required."

        });

      }


      /* ---------------------------------------------
         PROMPT
      --------------------------------------------- */

      const systemPrompt =
        createPhysicalAppearanceActivity3Prompt();


      const userPrompt = `

CURRENT QUESTION:

${question}


SELECTED PERSON:

${selectedPartner}


STUDENT SPOKEN ANSWER:

${message}


ADDITIONAL CONTEXT:

${
  context ||
  "Physical Appearance Activity 3 - Describe Your Partner."
}


STUDENT NAME:

${userName || "Student"}


Evaluate ONLY the student's CURRENT spoken answer.

IMPORTANT:

- Evaluate the selected person only.
- The student should describe physical appearance.
- The student should normally speak 2–3 sentences.
- Accept natural English variations.
- Do not require exact wording.
- Do not invent grammar mistakes.
- Do not reject understandable English unnecessarily.
- If there is a grammar mistake, correct it.
- Explain the important mistake in simple Roman English.
- If the student describes the wrong person, ask them to describe
  the selected person.
- If the answer is unrelated, bring the student back to
  physical appearance.
- If the answer is incomplete, encourage the student to add
  more information.
- If the answer is unclear, ask the student to repeat.
- If there is no speech, ask the student to try again.
- correction must contain ONLY the corrected English sentence.
- teacherResponse must contain exactly what the teacher should say.
- Never use Urdu script.
- Never use Hindi script.
- Never use Devanagari.
- Never include an explanation field.
- Never give marks.
- Never give score.
- Never give percentage.
- Return ONLY valid JSON.

`;


      /* ---------------------------------------------
         GROQ
      --------------------------------------------- */

      const completion =
        await groq.chat.completions.create({

          model:
            "openai/gpt-oss-120b",

          messages: [

            {
              role: "system",

              content:
                systemPrompt

            },

            {
              role: "user",

              content:
                userPrompt

            }

          ],

          temperature: 0.2,

          max_tokens: 500

        });


      /* ---------------------------------------------
         AI RESPONSE
      --------------------------------------------- */

      let aiReply =
        completion
          ?.choices?.[0]
          ?.message
          ?.content
          ?.trim();


      if (!aiReply) {

        return res.status(500).json({

          success: false,

          message:
            "AI did not return a response."

        });

      }


      /* ---------------------------------------------
         REMOVE MARKDOWN JSON
      --------------------------------------------- */

      aiReply = aiReply

        .replace(
          /^```json\s*/i,
          ""
        )

        .replace(
          /^```\s*/i,
          ""
        )

        .replace(
          /\s*```$/i,
          ""
        )

        .trim();


      /* ---------------------------------------------
         PARSE JSON
      --------------------------------------------- */

      let evaluation;


      try {

        evaluation =
          JSON.parse(aiReply);

      }

      catch (jsonError) {

        console.log(
          "❌ Physical Appearance Activity 3 JSON Error:",
          jsonError
        );

        console.log(
          "AI Reply:",
          aiReply
        );


        return res.status(500).json({

          success: false,

          message:
            "AI evaluation format error."

        });

      }


      /* ---------------------------------------------
         SAFE RESPONSE
      --------------------------------------------- */

      return res.json({

        success: true,

        isCorrect:
          Boolean(
            evaluation.isCorrect
          ),

        feedback:
          evaluation.feedback ||
          "",

        correction:
          evaluation.correction ||
          "",

        teacherResponse:
          evaluation.teacherResponse ||
          "Let's try again.",

        retry:
          Boolean(
            evaluation.retry
          )

      });

    }


    catch (err) {

      console.log(
        "❌ Physical Appearance Activity 3 Error:",
        err
      );


      return res.status(500).json({

        success: false,

        message:
          "Unable to check the answer right now."

      });

    }

  }
);


/* =========================================================
   HOBBY ROLEPLAY - AI PROMPT
========================================================= */

function createHobbyRoleplayPrompt() {

    return `

You are Miss Uroosa, a friendly and patient English
teacher for primary school children.

You are conducting:

"HOBBY ROLEPLAY"

This is an interactive English speaking activity.

The activity has EXACTLY 3 scenes.

=========================================================
SCENE 1 - MEETING A FRIEND
=========================================================

The student is meeting a friend.

Your role:
You are the friend.

Main purpose:
Help the student introduce their favourite hobby.

Typical conversation:

Teacher:
"Hi! What is your favourite hobby?"

Student:
"My favourite hobby is drawing."

You can ask simple follow-up questions related to
introducing the hobby.

Stay focused on:
- favourite hobby
- what the student likes
- simple introduction

Do NOT move to unrelated topics.

=========================================================
SCENE 2 - ASKING ABOUT HOBBIES
=========================================================

The conversation is about hobbies and free-time activities.

You can ask questions such as:

"What do you like doing in your free time?"

"Why do you like it?"

"When do you usually do it?"

"Who do you do it with?"

The student should answer naturally.

You may ask one relevant follow-up question based
on the student's answer.

Stay ONLY within:
- hobbies
- free time
- hobby reasons
- hobby timing
- people they do hobbies with

Do NOT change the topic.

=========================================================
SCENE 3 - NATURAL CONVERSATION
=========================================================

This is a natural hobby conversation.

The student does NOT need to repeat a fixed sentence.

Respond naturally to what the student says.

Ask relevant follow-up questions about their hobby.

Examples:

If student says:
"I like drawing."

You can say:
"That's lovely! What do you like to draw?"

If student says:
"I play football."

You can say:
"Nice! How often do you play football?"

If student says:
"I like reading."

You can say:
"That's great! What kind of books do you enjoy?"

IMPORTANT:

Always keep the conversation about hobbies.

Do NOT start conversations about:
- politics
- religion
- money
- personal/private information
- unrelated school subjects
- dangerous activities
- medical topics
- inappropriate topics

=========================================================
CURRENT SCENE
=========================================================

The frontend will send:

sceneNumber

You MUST follow the current scene.

Never jump to another scene.

The frontend controls scene changes.

You must NEVER tell the frontend to move
to the next scene.

=========================================================
CHECKING STUDENT ANSWER
=========================================================

Check ONLY the student's current answer.

If the answer is relevant and understandable:

- Appreciate the student.
- Continue the roleplay naturally.
- Ask a relevant follow-up question when appropriate.
- Do NOT force the student to repeat a sentence.

Example:

Student:
"My favourite hobby is drawing."

Teacher:
"That's great! What do you like to draw?"

=========================================================
GRAMMAR MISTAKE
=========================================================

If there is a clear grammar mistake:

Be encouraging.

Example:

Student:
"My favourite hobby are drawing."

Teacher:

"Good try! Tumne kaha: My favourite hobby are drawing.

Sahi sentence hai:
My favourite hobby is drawing.

Yahan 'hobby' singular hai, isliye 'is' use hoga.

Ab bolo:
My favourite hobby is drawing."

The explanation must be in simple Roman English.

Never use:
- Hindi script
- Urdu script
- Devanagari
- Arabic script

=========================================================
INCOMPLETE ANSWER
=========================================================

If the student gives a short but relevant answer:

Student:
"Drawing."

Do NOT immediately say it is wrong.

Guide them naturally.

Example:

"Nice! Drawing is a fun hobby. Tell me, what do
you like to draw?"

=========================================================
UNCLEAR ANSWER
=========================================================

If the answer cannot be understood:

Say:

"Good try! Mujhe answer thoda clear nahi suna.
Ek baar phir clearly bolo."

Set retry to true.

=========================================================
UNRELATED ANSWER
=========================================================

If the student talks about something unrelated:

Do NOT follow the unrelated topic.

Bring the student back to hobbies.

Example:

"Good try! 😊 Chalo apne hobby ke baare mein baat karte hain.
What is your favourite hobby?"

=========================================================
NO SPEECH
=========================================================

If the message is empty:

Say:

"Sorry, I couldn't hear you. Please try again."

Set retry to true.

Do NOT continue the conversation.

=========================================================
RESPONSE STYLE
=========================================================

Be:

- friendly
- encouraging
- patient
- natural
- simple
- suitable for primary school children

Do NOT say:

"Wrong!"

"Bad answer."

"You are incorrect."

Use:

"Good try!"

"Nice!"

"That's great!"

"Almost!"

"Let's try that again."

=========================================================
RESPONSE LENGTH
=========================================================

Keep the teacher response short.

Maximum around 60 words.

Do not give long grammar explanations.

=========================================================
IMPORTANT ROLEPLAY RULE
=========================================================

You are participating in a conversation.

Do NOT always use the same response.

Respond according to the student's answer.

Do NOT repeat the exact same question unnecessarily.

Do NOT invent information about the student.

Do NOT assume their hobby unless they tell you.

=========================================================
OUTPUT FORMAT
=========================================================

Return ONLY valid JSON.

Do NOT use markdown.

Do NOT use code fences.

Use EXACTLY this structure:

{
    "isCorrect": true,
    "feedback": "Nice!",
    "correction": "",
    "teacherResponse": "That's great! What do you like about your hobby?",
    "retry": false
}

For a grammar mistake:

{
    "isCorrect": false,
    "feedback": "Good try!",
    "correction": "My favourite hobby is drawing.",
    "teacherResponse": "Good try! Tumne kaha: My favourite hobby are drawing. Sahi sentence hai: My favourite hobby is drawing. Yahan hobby singular hai, isliye is use hoga. Ab bolo: My favourite hobby is drawing.",
    "retry": true
}

For unclear/no speech:

{
    "isCorrect": false,
    "feedback": "Please try again.",
    "correction": "",
    "teacherResponse": "Sorry, I couldn't hear you. Please try again.",
    "retry": true
}

IMPORTANT:

- Never include an explanation field.
- Never include marks.
- Never include score.
- Never include percentage.
- Never include database information.
- Never invent a correction.
- correction contains ONLY the corrected English sentence.
- Roman English explanation must be inside teacherResponse.
- teacherResponse is exactly what Miss Uroosa will speak.

`;
}


/* =========================================================
   HOBBY ROLEPLAY - AI ROUTE
========================================================= */

app.post(
    "/api/hobby-roleplay",
    async (req, res) => {

        try {

            const {
                sceneNumber,
                sceneTitle,
                question,
                message,
                history,
                userName
            } = req.body;


            /* =================================================
                VALIDATION
            ================================================= */

            if (
                !sceneNumber ||
                ![1, 2, 3].includes(
                    Number(sceneNumber)
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Valid sceneNumber is required."

                });

            }


            if (
                !question ||
                !String(question).trim()
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Current roleplay question is required."

                });

            }


            /* =================================================
                NO SPEECH
            ================================================= */

            if (
                !message ||
                !String(message).trim()
            ) {

                return res.json({

                    success: true,

                    isCorrect: false,

                    feedback:
                        "Sorry, I couldn't hear you.",

                    correction: "",

                    teacherResponse:
                        "Sorry, I couldn't hear you. Please try again.",

                    retry: true

                });

            }


            /* =================================================
                SYSTEM PROMPT
            ================================================= */

            const systemPrompt =
                createHobbyRoleplayPrompt();


            /* =================================================
                CONVERSATION HISTORY
            ================================================= */

            let conversationHistory = [];

            if (
                Array.isArray(history)
            ) {

                conversationHistory =
                    history
                        .slice(-8)
                        .map(item => ({

                            role:
                                item.role === "assistant"
                                    ? "assistant"
                                    : "user",

                            content:
                                String(
                                    item.content || ""
                                )

                        }))
                        .filter(
                            item =>
                                item.content.trim()
                        );

            }


            /* =================================================
                CURRENT USER PROMPT
            ================================================= */

            const userPrompt = `

CURRENT SCENE:

Scene ${sceneNumber}

SCENE TITLE:

${sceneTitle || "Hobby Roleplay"}

CURRENT TEACHER QUESTION:

${question}

STUDENT ANSWER:

${message}

STUDENT NAME:

${userName || "Student"}

PREVIOUS CONVERSATION:

${JSON.stringify(
    conversationHistory
)}

IMPORTANT:

Evaluate ONLY the student's current answer.

Stay inside the current hobby roleplay scene.

Do not move to another scene.

The frontend controls scene changes.

Return ONLY valid JSON.

`;


            /* =================================================
                GROQ
            ================================================= */

            const completion =
                await groq.chat.completions.create({

                    model:
                        "openai/gpt-oss-120b",

                    messages: [

                        {
                            role:
                                "system",

                            content:
                                systemPrompt

                        },

                        ...conversationHistory,

                        {
                            role:
                                "user",

                            content:
                                userPrompt

                        }

                    ],

                    temperature:
                        0.35,

                    max_tokens:
                        500

                });


            /* =================================================
                AI RESPONSE
            ================================================= */

            let aiReply =
                completion
                    ?.choices?.[0]
                    ?.message
                    ?.content
                    ?.trim();


            if (!aiReply) {

                throw new Error(
                    "AI did not return a response."
                );

            }


            /* =================================================
                REMOVE MARKDOWN JSON
            ================================================= */

            aiReply =
                aiReply

                    .replace(
                        /^```json\s*/i,
                        ""
                    )

                    .replace(
                        /^```\s*/i,
                        ""
                    )

                    .replace(
                        /\s*```$/i,
                        ""
                    )

                    .trim();


            /* =================================================
                PARSE JSON
            ================================================= */

            let evaluation;

            try {

                evaluation =
                    JSON.parse(aiReply);

            }

            catch (jsonError) {

                console.log(
                    "❌ Hobby Roleplay JSON Error:",
                    jsonError
                );

                console.log(
                    "AI Reply:",
                    aiReply
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "AI evaluation format error."

                });

            }


            /* =================================================
                SAFE RESPONSE
            ================================================= */

            return res.json({

                success: true,

                isCorrect:
                    Boolean(
                        evaluation.isCorrect
                    ),

                feedback:
                    evaluation.feedback ||
                    "",

                correction:
                    evaluation.correction ||
                    "",

                teacherResponse:
                    evaluation.teacherResponse ||
                    "Good try! Let's talk about your hobby.",

                retry:
                    Boolean(
                        evaluation.retry
                    )

            });

        }


        catch (error) {

            console.log(
                "❌ Hobby Roleplay Error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to process Hobby Roleplay right now."

            });

        }

    }
);



/* =========================================================
   PHYSICAL APPEARANCE - ACTIVITY 2
   BUILD & DESCRIBE - INTERACTIVE TEACHER PROMPT
========================================================= */

function createPhysicalAppearanceActivity2Prompt() {

  return `

You are Miss Uroosa, a friendly English teacher for
primary school children.

The student is doing:

"PHYSICAL APPEARANCE - ACTIVITY 2"
"Build & Describe"

This is an interactive English speaking activity.

The student first selects a physical appearance feature.
The frontend creates an expected English sentence.
The student then speaks that sentence through a microphone.

Your job is to evaluate ONLY the student's spoken
sentence for the CURRENT ROUND.

==================================================
MAIN PURPOSE
==================================================

The student may:

- say the sentence correctly
- make a grammar mistake
- use the wrong word
- use the wrong physical appearance feature
- give an incomplete sentence
- give a short but acceptable answer
- have a small speech-recognition/transcription issue
- say something unrelated
- say nothing
- pronounce something slightly differently

You must behave like a friendly primary school teacher.

Never make the student feel bad.

==================================================
IMPORTANT: ROMAN ENGLISH
==================================================

Whenever you explain a mistake, ALWAYS explain it
in simple ROMAN ENGLISH.

Roman English means English written using English
letters for spoken Hindi/Urdu.

Example:

Student:

"My partner are tall."

Teacher:

"Good try! Tumne kaha: My partner are tall.

Sahi sentence hai:

My partner is tall.

Yahan 'partner' singular hai, isliye 'are' ki jagah
'is' use karna hai.

Ab bolo:

My partner is tall."

IMPORTANT:

- Never use Urdu script.
- Never use Hindi script.
- Never use Devanagari.
- Never use Arabic script.
- Use Roman English only for explanations.
- Correct English sentences must remain in English.

==================================================
CURRENT ACTIVITY
==================================================

The activity contains these appearance features:

1. Height
2. Hair Length
3. Hair Type
4. Hair Color
5. Eye Color
6. Glasses

The student selects ONE option in each round.

The frontend will send:

- current feature
- selected option
- current question
- expected sentence
- student's spoken answer

You MUST evaluate ONLY the current round.

Do not evaluate future rounds.

Do not evaluate features that were not selected
in the current round.

==================================================
CURRENT FEATURE
==================================================

Possible current features are:

HEIGHT

Examples:

"My partner is tall."

"My partner is short."


HAIR LENGTH

Examples:

"My partner has long hair."

"My partner has short hair."


HAIR TYPE

Examples:

"My partner has straight hair."

"My partner has curly hair."

"My partner has wavy hair."


HAIR COLOR

Examples:

"My partner has black hair."

"My partner has brown hair."

"My partner has blonde hair."


EYE COLOR

Examples:

"My partner has brown eyes."

"My partner has blue eyes."

"My partner has green eyes."


GLASSES

Examples:

"My partner wears glasses."

"My partner does not wear glasses."

==================================================
WHEN SENTENCE IS CORRECT
==================================================

If the student's spoken answer correctly communicates
the expected sentence:

1. Mark it correct.
2. Appreciate the student.
3. Do NOT invent a grammar mistake.
4. Do NOT unnecessarily correct the sentence.
5. Keep the response short.
6. retry MUST be false.

Example:

Student:

"My partner is tall."

Teacher:

"Excellent! Tumne sentence bilkul sahi bola. 🎉"

Output:

{
  "isCorrect": true,
  "feedback": "Excellent!",
  "correction": "",
  "teacherResponse": "Excellent! Tumne sentence bilkul sahi bola. 🎉",
  "retry": false
}

==================================================
NATURAL VARIATIONS
==================================================

Accept natural English variations when the meaning
is clearly correct.

For example:

Expected:

"My partner is tall."

Student:

"My partner's tall."

This can be accepted.

Expected:

"My partner has brown hair."

Student:

"My partner has brown coloured hair."

This can be accepted if the meaning is clear.

Do NOT force the student to reproduce the exact
expected sentence word-for-word.

The goal is meaningful English speaking.

==================================================
SHORT ANSWERS
==================================================

This activity is primarily sentence-building.

However, do not unnecessarily reject a meaningful
short answer if it clearly communicates the selected
feature.

For example:

Expected:

"My partner is tall."

Student:

"Tall."

This may be treated as incomplete rather than a
serious mistake.

In this situation, guide the child toward the
complete sentence.

Example:

"Good try! Tumne 'Tall' bola.

Complete sentence hai:

My partner is tall.

Ab bolo:

My partner is tall."

Set retry to true.

==================================================
GRAMMAR MISTAKE
==================================================

If the student makes a clear grammar mistake:

1. Appreciate the effort.
2. Mention what the student said.
3. Give the corrected English sentence.
4. Explain ONLY the important mistake in simple
   Roman English.
5. Ask the student to repeat the corrected sentence.
6. Set retry to true.

Example:

Student:

"My partner are tall."

Teacher:

"Good try! Tumne kaha: My partner are tall.

Sahi sentence hai:

My partner is tall.

Yahan 'partner' singular hai, isliye 'are' ki jagah
'is' use karna hai.

Ab bolo:

My partner is tall."

==================================================
WRONG WORD / WRONG FEATURE
==================================================

If the student uses the wrong word for the selected
feature:

Example:

Selected:

Hair Color = Brown

Expected:

"My partner has brown hair."

Student:

"My partner has blue hair."

Explain briefly.

Example:

"Good try! Tumne blue hair bola, lekin tumne brown
hair choose kiya tha.

Sahi sentence hai:

My partner has brown hair.

Ab bolo:

My partner has brown hair."

Set retry to true.

==================================================
WRONG SENTENCE STRUCTURE
==================================================

If the child understands the feature but sentence
structure is incorrect:

Example:

Student:

"My partner tall is."

Teacher:

"Good try! Sentence ko thoda arrange karna hai.

Sahi sentence hai:

My partner is tall.

Ab bolo:

My partner is tall."

Set retry to true.

==================================================
INCOMPLETE ANSWER
==================================================

If the answer is incomplete but understandable:

Do NOT be harsh.

Guide the student to the complete sentence.

Example:

Student:

"Brown hair."

Teacher:

"Good try! Tumne brown hair bola.

Complete sentence hai:

My partner has brown hair.

Ab bolo:

My partner has brown hair."

Set retry to true.

==================================================
UNRELATED ANSWER
==================================================

If the student says something unrelated to the current
feature:

Do NOT start a new conversation.

Guide the student back to the current sentence.

Example:

"Good try! 😊 Chalo selected feature ka sentence
bolte hain.

Ab bolo:

My partner is tall."

Set retry to true.

==================================================
UNCLEAR SPEECH
==================================================

Speech recognition can sometimes produce unclear text.

Do NOT invent a grammar mistake.

If the student's intended meaning cannot be understood:

Say:

"Good try! Mujhe sentence thoda clear nahi suna.
Ek baar phir clearly bolo."

Set retry to true.

correction must be empty.

==================================================
NO SPEECH
==================================================

If the student's message is:

- empty
- blank
- whitespace
- missing

Return:

{
  "isCorrect": false,
  "feedback": "Sorry, I couldn't hear you.",
  "correction": "",
  "teacherResponse": "Sorry, I couldn't hear you. Please try again.",
  "retry": true
}

Do NOT create a grammar correction.

Do NOT move to the next round.

==================================================
SPEECH RECOGNITION
==================================================

The frontend uses browser speech recognition.

The transcript may contain small transcription
differences.

Do NOT treat every transcription difference as
a grammar mistake.

For example:

Expected:

"My partner has brown hair."

Transcript:

"My partner has brown hare."

If the intended meaning is obviously "hair",
accept it when appropriate.

==================================================
EXPECTED SENTENCE
==================================================

The frontend will send the expected sentence.

Example:

CURRENT FEATURE:

Height

SELECTED OPTION:

Tall

EXPECTED SENTENCE:

My partner is tall.

Use this as the primary reference.

==================================================
IMPORTANT EVALUATION RULE
==================================================

The selected option is the target answer.

The student must communicate that selected feature.

For example:

Selected option:

Tall

Expected:

"My partner is tall."

Student:

"My partner is short."

This is NOT correct.

Return retry true.

Do not accept an opposite feature.

==================================================
TEACHER PERSONALITY
==================================================

You are:

- friendly
- patient
- encouraging
- cheerful
- supportive
- simple
- suitable for primary school children

Never say:

"Wrong!"

"You are incorrect."

"Bad answer."

Instead use:

"Good try!"

"Nice try!"

"Almost!"

"Let's try that again."

"You're doing great!"

==================================================
RESPONSE LENGTH
==================================================

Keep the teacher response SHORT.

Maximum around 70 words.

Do not give a long grammar lesson.

Explain only the mistake that matters.

==================================================
OUTPUT
==================================================

Return ONLY valid JSON.

Do NOT use markdown.

Do NOT use code fences.

Do NOT include an "explanation" field.

Do NOT include marks.

Do NOT include score.

Do NOT include percentage.

Do NOT include database information.

Use EXACTLY this structure:

{
  "isCorrect": true,
  "feedback": "Excellent!",
  "correction": "",
  "teacherResponse": "Excellent! Tumne sentence bilkul sahi bola. 🎉",
  "retry": false
}

For an incorrect answer:

{
  "isCorrect": false,
  "feedback": "Good try!",
  "correction": "My partner is tall.",
  "teacherResponse": "Good try! Tumne kaha: My partner are tall. Sahi sentence hai: My partner is tall. Yahan 'partner' singular hai, isliye 'are' ki jagah 'is' use karna hai. Ab bolo: My partner is tall.",
  "retry": true
}

For unclear speech:

{
  "isCorrect": false,
  "feedback": "Good try!",
  "correction": "",
  "teacherResponse": "Good try! Mujhe sentence thoda clear nahi suna. Ek baar phir clearly bolo.",
  "retry": true
}

For no speech:

{
  "isCorrect": false,
  "feedback": "Sorry, I couldn't hear you.",
  "correction": "",
  "teacherResponse": "Sorry, I couldn't hear you. Please try again.",
  "retry": true
}

IMPORTANT:

- Never include "explanation".
- Never include marks.
- Never include score.
- Never include percentage.
- Never include database information.
- Never invent a correction.
- Never invent a mistake.
- Roman English explanation must be inside teacherResponse.
- correction must contain ONLY the corrected English sentence.
- teacherResponse is exactly what Miss Uroosa will speak.
- Return valid JSON only.

`;
}

/* =========================================================
   PHYSICAL APPEARANCE - ACTIVITY 2
   INTERACTIVE TEACHER CHECK ROUTE
========================================================= */

app.post(
  "/api/physical-appearance/activity2",
  async (req, res) => {

    try {

      const {
        question,
        message,
        context,
        userName,
        feature,
        selectedOption,
        expectedSentence
      } = req.body;


      /* ---------------------------------------------
         VALIDATION
      --------------------------------------------- */

      if (
        !question ||
        !String(question).trim()
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Question is required."

        });

      }


      /* ---------------------------------------------
         NO SPEECH / EMPTY MESSAGE
      --------------------------------------------- */

      if (
        !message ||
        !String(message).trim()
      ) {

        return res.json({

          success: true,

          isCorrect: false,

          feedback:
            "Sorry, I couldn't hear you.",

          correction: "",

          teacherResponse:
            "Sorry, I couldn't hear you. Please try again.",

          retry: true

        });

      }


      /* ---------------------------------------------
         EXPECTED SENTENCE VALIDATION
      --------------------------------------------- */

      if (
        !expectedSentence ||
        !String(expectedSentence).trim()
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Expected sentence is required."

        });

      }


      /* ---------------------------------------------
         PROMPT
      --------------------------------------------- */

      const systemPrompt =
        createPhysicalAppearanceActivity2Prompt();


      const userPrompt = `

CURRENT QUESTION:

${question}


CURRENT FEATURE:

${feature || "Physical appearance"}


SELECTED OPTION:

${selectedOption || "Not provided"}


EXPECTED SENTENCE:

${expectedSentence}


STUDENT SPOKEN ANSWER:

${message}


ADDITIONAL CONTEXT:

${
  context ||
  "Physical Appearance Activity 2 - Build & Describe."
}


STUDENT NAME:

${userName || "Student"}


Evaluate ONLY the student's spoken answer for
the CURRENT ROUND.

IMPORTANT:

- The selected option is the target feature.
- Compare the student's answer with the expected sentence.
- Accept natural English variations when the meaning
  is clearly correct.
- Do not invent grammar mistakes.
- Do not reject a correct natural answer unnecessarily.
- If incorrect, explain the mistake in simple Roman English.
- correction must contain ONLY the corrected English sentence.
- teacherResponse must contain the Roman English explanation
  and corrected English sentence when needed.
- If the answer is unclear, ask the child to repeat.
- If there is no speech, ask the child to try again.
- Never use Urdu script.
- Never use Hindi script.
- Never use Devanagari.
- Never include an explanation field.
- Never give marks.
- Never give a score.
- Never give percentage.
- Return ONLY valid JSON.

`;


      /* ---------------------------------------------
         GROQ
      --------------------------------------------- */

      const completion =
        await groq.chat.completions.create({

          model:
            "openai/gpt-oss-120b",

          messages: [

            {
              role: "system",

              content:
                systemPrompt

            },

            {
              role: "user",

              content:
                userPrompt

            }

          ],

          temperature: 0.2,

          max_tokens: 500

        });


      /* ---------------------------------------------
         AI RESPONSE
      --------------------------------------------- */

      let aiReply =
        completion
          ?.choices?.[0]
          ?.message
          ?.content
          ?.trim();


      if (!aiReply) {

        return res.status(500).json({

          success: false,

          message:
            "AI did not return a response."

        });

      }


      /* ---------------------------------------------
         REMOVE MARKDOWN JSON
      --------------------------------------------- */

      aiReply = aiReply

        .replace(
          /^```json\s*/i,
          ""
        )

        .replace(
          /^```\s*/i,
          ""
        )

        .replace(
          /\s*```$/i,
          ""
        )

        .trim();


      /* ---------------------------------------------
         PARSE JSON
      --------------------------------------------- */

      let evaluation;


      try {

        evaluation =
          JSON.parse(aiReply);

      }

      catch (jsonError) {

        console.log(
          "❌ Physical Appearance Activity 2 JSON Error:",
          jsonError
        );

        console.log(
          "AI Reply:",
          aiReply
        );


        return res.status(500).json({

          success: false,

          message:
            "AI evaluation format error."

        });

      }


      /* ---------------------------------------------
         SAFE RESPONSE
      --------------------------------------------- */

      return res.json({

        success: true,

        isCorrect:
          Boolean(
            evaluation.isCorrect
          ),

        feedback:
          evaluation.feedback ||
          "",

        correction:
          evaluation.correction ||
          "",

        teacherResponse:
          evaluation.teacherResponse ||
          "Let's try again.",

        retry:
          Boolean(
            evaluation.retry
          )

      });

    }


    catch (err) {

      console.log(
        "❌ Physical Appearance Activity 2 Error:",
        err
      );


      return res.status(500).json({

        success: false,

        message:
          "Unable to check the answer right now."

      });

    }

  }
);


/* =====================================================
   FAVOURITE PLACE - ACTIVITY 3
   AI TEACHER CHECK
===================================================== */

app.post(
    "/api/favourite-place/activity3",
    async (req, res) => {

        try {

            const {
                question,
                hint,
                message,
                userName,
                topicId,
                lessonId
            } = req.body;


            /* =========================================
               VALIDATION
            ========================================= */

            if (
                !message ||
                !String(message).trim()
            ) {

                return res.status(400).json({

                    isCorrect: false,

                    type: "empty",

                    teacherResponse:
                        "I couldn't hear your answer clearly. Please try again in English."

                });

            }


            const studentAnswer =
                String(message).trim();


            /* =========================================
               AI TEACHER PROMPT
            ========================================= */

            const systemPrompt = `
You are Miss Uroosa, a friendly and professional English teacher teaching children.

You are currently teaching an English lesson called:

"Tell Me About Your Favourite Place"

Your job is to evaluate ONLY the student's answer to the CURRENT QUESTION.

CURRENT QUESTION:
"${question}"

HINT:
"${hint || "Answer in a complete English sentence."}"

STUDENT ANSWER:
"${studentAnswer}"


==================================================
STRICT TEACHER RULES
==================================================

1. Stay focused ONLY on the current question.

2. Do NOT start a general conversation.

3. Do NOT answer unrelated questions.

4. If the student's answer is unrelated to the current question:
   - Say politely that the answer is off topic.
   - Remind the student of the current question.
   - Ask them to try again.
   - Set type to "off_topic".

5. If the student uses Roman Urdu, Roman Hindi, Urdu, Hindi,
   or another language instead of English:
   - Do not treat it as a correct English answer.
   - Politely encourage them to say it in English.
   - You may give a small English example.
   - Set type to "language".

Example:
Student: "Mujhe park pasand hai"
Teacher:
"Good idea! Now try saying it in English. You can say: My favourite place is the park."

6. If the student's answer is in English but has grammar mistakes:
   - Encourage the student.
   - Clearly show the corrected sentence.
   - Ask the student to try again.
   - Set type to "grammar".

Example:
Student:
"I like park because beautiful."

Teacher:
"Good try! Let's make it a complete sentence: I like the park because it is beautiful. Please try saying it again."

7. If the student gives only one or two words when a complete
sentence is expected:
   - Encourage them to speak in a complete sentence.
   - Give an example.
   - Set type to "incomplete".

8. If the answer correctly answers the current question
in clear English:
   - Praise the student.
   - Keep feedback short and encouraging.
   - Set isCorrect to true.
   - Set type to "success".

9. Be supportive and child-friendly.

10. Never shame the student.

11. Do not use difficult grammar explanations.

12. Keep teacher feedback under 45 words.

13. IMPORTANT:
Return ONLY valid JSON.
No markdown.
No extra text.


==================================================
RESPONSE FORMAT
==================================================

{
    "isCorrect": true or false,
    "type": "success | grammar | language | off_topic | incomplete | retry",
    "teacherResponse": "Teacher feedback",
    "correctedAnswer": "Correct English sentence if needed, otherwise empty string"
}
`;


            /* =========================================
               GROQ REQUEST
            ========================================= */

            const completion =
                await groq.chat.completions.create({

                    model:
                        "openai/gpt-oss-120b",

                    messages: [

                        {
                            role: "system",

                            content:
                                systemPrompt
                        },

                        {
                            role: "user",

                            content:
                                studentAnswer
                        }

                    ],

                    temperature: 0.3,

                    max_tokens: 250,

                    response_format: {
                        type: "json_object"
                    }

                });


            /* =========================================
               GET AI RESPONSE
            ========================================= */

            const aiResponse =
                completion.choices?.[0]
                    ?.message?.content;


            let result;


            try {

                result =
                    JSON.parse(aiResponse);

            }

            catch (parseError) {

                console.error(
                    "Activity 3 JSON Parse Error:",
                    parseError
                );


                result = {

                    isCorrect: false,

                    type: "retry",

                    teacherResponse:
                        "Good try! Please answer the question again in English.",

                    correctedAnswer: ""

                };

            }


            /* =========================================
               SAFETY FALLBACK
            ========================================= */

            if (
                typeof result.isCorrect !==
                "boolean"
            ) {

                result.isCorrect =
                    false;

            }


            if (
                !result.type
            ) {

                result.type =
                    result.isCorrect
                        ? "success"
                        : "retry";

            }


            if (
                !result.teacherResponse
            ) {

                result.teacherResponse =
                    result.isCorrect
                        ? "Excellent! That's a great answer!"
                        : "Good try! Please try answering again in English.";

            }


            if (
                !result.correctedAnswer
            ) {

                result.correctedAnswer =
                    "";

            }


            /* =========================================
               SEND RESPONSE
            ========================================= */

            return res.json({

                isCorrect:
                    result.isCorrect,

                type:
                    result.type,

                teacherResponse:
                    result.teacherResponse,

                correctedAnswer:
                    result.correctedAnswer,

                activity:
                    "Favourite Place Activity 3",

                topicId,

                lessonId,

                userName

            });

        }

        catch (error) {

            console.error(
                "Favourite Place Activity 3 AI Error:",
                error
            );


            return res.status(500).json({

                isCorrect: false,

                type: "retry",

                teacherResponse:
                    "Sorry, I couldn't check your answer right now. Please try again.",

                correctedAnswer:
                    ""

            });

        }

    }
);


/* =========================================================
   SAVE FINAL CHALLENGE RESULT
========================================================= */

app.post(
  "/api/final-challenge/save-result",
  async (req, res) => {
    try {
      const {
        userName,
        topicId,
        lessonId,
        totalMarks,
        answers,
      } = req.body;

      /* ---------------------------------------------
         MONGODB CHECK
      --------------------------------------------- */

      if (!isMongoConnected()) {
        return res.status(503).json({
          success: false,
          message:
            "MongoDB is not connected.",
        });
      }

      /* ---------------------------------------------
         ANSWERS VALIDATION
      --------------------------------------------- */

      if (
        !Array.isArray(answers) ||
        answers.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Final Challenge answers are required.",
        });
      }

      /* ---------------------------------------------
         TOTAL MAXIMUM MARKS

         If frontend sends totalMarks,
         use it.

         Otherwise calculate from questions.

         For your current challenge:
         5 + 5 + 5 + 5 + 5 = 25
      --------------------------------------------- */

      let calculatedTotalMarks =
        Number(totalMarks);

      if (
        !calculatedTotalMarks ||
        calculatedTotalMarks <= 0
      ) {
        calculatedTotalMarks =
          answers.reduce(
            (total, answer) => {
              const max =
                Number(
                  answer.max_marks
                ) || 0;

              return total + max;
            },
            0
          );
      }

      /* ---------------------------------------------
         SAFETY DEFAULT

         FINAL CHALLENGE = 25 MARKS
      --------------------------------------------- */

      if (
        calculatedTotalMarks <= 0
      ) {
        calculatedTotalMarks = 25;
      }

      /* ---------------------------------------------
         OBTAINED MARKS
      --------------------------------------------- */

      let obtainedMarks = 0;

      answers.forEach((answer) => {
        const questionMax =
          Number(
            answer.max_marks
          ) || 0;

        let questionMarks =
          Number(answer.marks);

        if (
          Number.isNaN(questionMarks)
        ) {
          questionMarks = 0;
        }

        /* Never allow negative */
        questionMarks = Math.max(
          0,
          questionMarks
        );

        /* Never allow more than question max */
        questionMarks = Math.min(
          questionMarks,
          questionMax
        );

        obtainedMarks +=
          questionMarks;
      });

      /* ---------------------------------------------
         SAFETY: NEVER EXCEED TOTAL
      --------------------------------------------- */

      obtainedMarks = Math.min(
        obtainedMarks,
        calculatedTotalMarks
      );

      /* ---------------------------------------------
         PERCENTAGE
      --------------------------------------------- */

      const percentage =
        calculatedTotalMarks > 0
          ? Number(
              (
                (obtainedMarks /
                  calculatedTotalMarks) *
                100
              ).toFixed(2)
            )
          : 0;

      /* ---------------------------------------------
         GRADE
      --------------------------------------------- */

      let grade = "";

      if (percentage >= 90) {
        grade = "Excellent";
      } else if (percentage >= 80) {
        grade = "Very Good";
      } else if (percentage >= 70) {
        grade = "Good";
      } else if (percentage >= 60) {
        grade = "Keep Practicing";
      } else {
        grade = "Needs Improvement";
      }

      /* ---------------------------------------------
         GRAMMAR MISTAKES
      --------------------------------------------- */

      const grammarMistakes = [];

      answers.forEach((answer) => {
        const questionId =
          Number(
            answer.question_id
          ) || 0;

        /* New mistakes array */
        if (
          Array.isArray(
            answer.mistakes
          )
        ) {
          answer.mistakes.forEach(
            (mistake) => {
              if (
                mistake &&
                (
                  mistake.mistake ||
                  mistake.correction ||
                  mistake.urduExplanation
                )
              ) {
                grammarMistakes.push({
                  question_id:
                    questionId,

                  mistake:
                    mistake.mistake ||
                    "",

                  correction:
                    mistake.correction ||
                    "",

                  urdu_explanation:
                    mistake.urduExplanation ||
                    "",
                });
              }
            }
          );
        }

        /* Also support old single mistake format */
        if (
          answer.mistake &&
          !Array.isArray(
            answer.mistakes
          )
        ) {
          grammarMistakes.push({
            question_id:
              questionId,

            mistake:
              answer.mistake,

            correction:
              answer.correction ||
              "",

            urdu_explanation:
              answer.urdu_explanation ||
              "",
          });
        }
      });

      /* ---------------------------------------------
         PREPARE ANSWER DATA
      --------------------------------------------- */

      const answerData =
        answers.map((answer) => {
          const maxMarks =
            Number(
              answer.max_marks
            ) || 0;

          let marks =
            Number(answer.marks);

          if (
            Number.isNaN(marks)
          ) {
            marks = 0;
          }

          marks = Math.max(
            0,
            Math.min(
              marks,
              maxMarks
            )
          );

          const mistakes =
            Array.isArray(
              answer.mistakes
            )
              ? answer.mistakes.map(
                  (mistake) => ({
                    mistake:
                      mistake?.mistake ||
                      "",

                    correction:
                      mistake?.correction ||
                      "",

                    urduExplanation:
                      mistake?.urduExplanation ||
                      "",
                  })
                )
              : [];

          return {
            question_id:
              Number(
                answer.question_id
              ) || 0,

            question:
              answer.question || "",

            user_answer:
              answer.user_answer || "",

            marks,

            max_marks:
              maxMarks,

            grammar_correct:
              answer.grammar_correct !==
              false,

            answer_correct:
              answer.answer_correct ===
              true,

            mistake:
              answer.mistake || "",

            correction:
              answer.correction || "",

            urdu_explanation:
              answer.urdu_explanation ||
              "",

            feedback:
              answer.feedback || "",

            mistakes,
          };
        });

      /* ---------------------------------------------
         SAVE TO MONGODB
      --------------------------------------------- */

      const result =
        await FinalChallengeResult.create({
          user_name:
            userName || "Student",

          topic_id:
            Number(topicId) || 3,

          lesson_id:
            Number(lessonId) || 4,

          total_marks:
            calculatedTotalMarks,

          obtained_marks:
            obtainedMarks,

          percentage,

          grade,

          answers:
            answerData,

          grammar_mistakes:
            grammarMistakes,
        });

      console.log(
        "================================="
      );

      console.log(
        "✅ FINAL CHALLENGE SAVED TO MONGODB"
      );

      console.log(
        "Result ID:",
        result._id.toString()
      );

      console.log(
        "Student:",
        userName || "Student"
      );

      console.log(
        "Marks:",
        `${obtainedMarks}/${calculatedTotalMarks}`
      );

      console.log(
        "Percentage:",
        `${percentage}%`
      );

      console.log(
        "Grade:",
        grade
      );

      console.log(
        "================================="
      );

      /* ---------------------------------------------
         RESPONSE
      --------------------------------------------- */

      return res.json({
        success: true,

        resultId:
          result._id,

        totalMarks:
          calculatedTotalMarks,

        obtainedMarks,

        percentage,

        grade,

        grammarMistakes,

        message:
          "Final Challenge result saved successfully.",
      });
    } catch (err) {
      console.log(
        "❌ Final Challenge Save Error:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to save final challenge result.",
      });
    }
  }
);

/* =========================================================
   GET FINAL CHALLENGE RESULT BY ID
========================================================= */

app.get(
  "/api/final-challenge/result/:id",
  async (req, res) => {
    try {
      if (!isMongoConnected()) {
        return res.status(503).json({
          success: false,
          message:
            "MongoDB is not connected.",
        });
      }

      const result =
        await FinalChallengeResult.findById(
          req.params.id
        );

      if (!result) {
        return res.status(404).json({
          success: false,
          message:
            "Final Challenge result not found.",
        });
      }

      return res.json({
        success: true,
        result,
      });
    } catch (err) {
      console.log(
        "❌ Final Challenge Result Error:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load final challenge result.",
      });
    }
  }
);

/* =========================================================
   GET LATEST FINAL CHALLENGE RESULT
========================================================= */

app.get(
  "/api/final-challenge/latest/:userName",
  async (req, res) => {
    try {
      if (!isMongoConnected()) {
        return res.status(503).json({
          success: false,
          message:
            "MongoDB is not connected.",
        });
      }

      const result =
        await FinalChallengeResult
          .findOne({
            user_name:
              req.params.userName,
          })
          .sort({
            created_at: -1,
          });

      if (!result) {
        return res.status(404).json({
          success: false,
          message:
            "No final challenge result found.",
        });
      }

      return res.json({
        success: true,
        result,
      });
    } catch (err) {
      console.log(
        "❌ Latest Result Error:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load latest result.",
      });
    }
  }
);

/* =========================================================
   CHAT API
========================================================= */

app.post(
  "/api/chat",
  async (req, res) => {
    try {
      const {
        message,
        history,
        topicId,
        lessonId,
        userName,
        activity,
        pictureName,
        currentQuestion,
      } = req.body;

      /* ---------------------------------------------
         EMPTY MESSAGE
      --------------------------------------------- */

      if (
        !message ||
        message.trim() === ""
      ) {
        return res.json({
          response:
            "Please say something.",
        });
      }

      /* ---------------------------------------------
         SELECT PROMPT
      --------------------------------------------- */

      let systemPrompt;

      if (
        activity === "picture"
      ) {
        systemPrompt =
          createPicturePrompt(
            currentQuestion,
            pictureName
          );
      } else if (
        activity ===
        "restaurant-ai"
      ) {
        systemPrompt =
          createRestaurantPrompt();
      } else {
        systemPrompt =
          createTeacherPrompt(
            topicId
          );
      }

      /* ---------------------------------------------
         BUILD MESSAGES
      --------------------------------------------- */

      const messages = [
        {
          role: "system",
          content: systemPrompt,
        },
      ];

      /* ---------------------------------------------
         HISTORY
      --------------------------------------------- */

      if (
        history &&
        Array.isArray(history)
      ) {
        history
          .slice(-6)
          .forEach((chat) => {
            messages.push({
              role:
                chat.sender === "user"
                  ? "user"
                  : "assistant",

              content:
                chat.text,
            });
          });
      }

      /* ---------------------------------------------
         CURRENT MESSAGE
      --------------------------------------------- */

      messages.push({
        role: "user",
        content: message,
      });

      /* ---------------------------------------------
         GROQ
      --------------------------------------------- */

      const completion =
        await groq.chat.completions.create({
          model:
            "openai/gpt-oss-120b",

          messages,

          temperature: 0.5,

          max_tokens: 150,
        });

      /* ---------------------------------------------
         AI RESPONSE
      --------------------------------------------- */

      const aiReply =
        completion
          ?.choices?.[0]
          ?.message
          ?.content
          ?.trim() ||
        "Sorry, I couldn't understand. Please try again.";

      /* ---------------------------------------------
         SAVE CONVERSATION TO MONGODB
         
         IMPORTANT:
         Previously this was commented out.
         Now it will actually save.
      --------------------------------------------- */

      if (isMongoConnected()) {
        try {
          await Conversation.create({
            user_name:
              userName || "Student",

            topic_id:
              Number(topicId) || 0,

            lesson_id:
              Number(lessonId) || 0,

            activity:
              activity || "normal",

            user_message:
              message,

            ai_response:
              aiReply,
          });
        } catch (dbError) {
          console.log(
            "⚠️ Conversation save failed:",
            dbError.message
          );
        }
      }

      /* ---------------------------------------------
         RESPONSE
      --------------------------------------------- */

      return res.json({
        response: aiReply,
      });
    } catch (err) {
      console.log(
        "❌ Chat API Error:",
        err
      );

      return res.status(500).json({
        response:
          "Sorry. I couldn't understand. Please try again.",
      });
    }
  }
);

/* =========================================================
   HOME ROUTE
========================================================= */

app.get("/", (req, res) => {
  res.send(
    "✅ English Learning API Running"
  );
});

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get(
  "/api/health",
  (req, res) => {
    return res.json({
      status: "ok",

      mongoConnected:
        isMongoConnected(),

      message:
        "AI English Learning Server is running.",
    });
  }
);

/* =========================================================
   MONGODB STATUS ROUTE
========================================================= */

app.get(
  "/api/mongodb-status",
  (req, res) => {
    const connected =
      isMongoConnected();

    return res.json({
      success: true,

      mongoConnected:
        connected,

      readyState:
        mongoose.connection.readyState,

      message: connected
        ? "MongoDB is connected."
        : "MongoDB is not connected.",
    });
  }
);


/* =========================================================
   FINAL CHALLENGE1 EVALUATION PROMPT
========================================================= */

function createFinalChallengePrompt() {
  return `

You are an English assessment evaluator for a primary school
English learning application.

The student is completing a FINAL CHALLENGE.

IMPORTANT:

Evaluate ONLY the student's current answer.

Do NOT behave like a normal conversation teacher.

Do NOT ask another question.

Do NOT continue the conversation.

Do NOT add extra conversation.

==================================================
ASSESSMENT
==================================================

Evaluate the student's answer according to the
specific question and challenge context provided.

Check:

- Answer relevance
- Grammar
- Sentence structure
- Vocabulary
- Correct use of the English learned in the lesson
- Communication clarity
- Politeness when appropriate
- Completeness when required

==================================================
SCORING
==================================================

The frontend sends the maximum marks for each question.

Give a score from 0 to the provided maximum marks.

IMPORTANT:

Never give more marks than the question maximum.

A completely correct and complete answer:
Give full marks.

Correct meaning with small grammar mistakes:
Give partial marks.

Short but relevant answer:
Give reasonable partial marks.

Unclear answer:
Give low marks.

Completely unrelated answer:
Give 0 marks.

Do NOT invent requirements that are not present
in the question.

Do NOT require exact wording if the student's
answer has the same correct meaning.

==================================================
GRAMMAR
==================================================

Check:

- subject and verb agreement
- articles
- singular/plural
- verb tense
- word order
- prepositions
- sentence structure
- incorrect word usage

==================================================
ROMAN ENGLISH
==================================================

All grammar explanations MUST be in Roman English.

NEVER use:

- Urdu script
- Hindi script
- Devanagari

Example:

Mistake:
"He have blue eyes."

Correction:
"He has blue eyes."

Explanation:
"Yahan 'He' ke sath 'has' use hota hai."

==================================================
OUTPUT
==================================================

Return ONLY valid JSON.

Do NOT use markdown.

Do NOT write anything before or after the JSON.

Use exactly this structure:

{
  "marks": 5,
  "maxMarks": 5,
  "answerCorrect": true,
  "grammarCorrect": true,
  "mistakes": [],
  "correction": "",
  "feedback": "Excellent work!"
}

If there is a mistake:

{
  "marks": 4,
  "maxMarks": 5,
  "answerCorrect": true,
  "grammarCorrect": false,
  "mistakes": [
    {
      "mistake": "wrong text from student answer",
      "correction": "correct English version",
      "urduExplanation": "Roman English me short aur simple explanation."
    }
  ],
  "correction": "Correct full sentence.",
  "feedback": "Good try! Your idea is clear, but there is a small grammar mistake."
}

IMPORTANT:

Do not invent mistakes.

If the answer is correct:

"mistakes": []

"correction": ""

"answerCorrect": true

"grammarCorrect": true

`;
}


/* =========================================================
   FINAL CHALLENGE1 - CHECK ANSWER
========================================================= */

app.post(
  "/api/final-challenge/check",
  async (req, res) => {
    try {
      const {
        questionId,
        challengeId,
        question,
        message,
        maxMarks,
        questionType,
        expectedAnswer,
        context,
        userName,
      } = req.body;

      /* ---------------------------------------------
         VALIDATION
      --------------------------------------------- */

      if (
        !question ||
        !String(question).trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Question is required.",
        });
      }

      if (
        !message ||
        !String(message).trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Student answer is required.",
        });
      }

      /* ---------------------------------------------
         QUESTION MAX MARKS
      --------------------------------------------- */

      const marksLimit =
        Number(maxMarks) > 0
          ? Number(maxMarks)
          : 5;

      /* ---------------------------------------------
         PROMPT
      --------------------------------------------- */

      const systemPrompt =
        createFinalChallengePrompt();

      const assessmentPrompt = `

FINAL CHALLENGE ID:

${challengeId ?? questionId ?? ""}

QUESTION:

${question}

QUESTION ID:

${questionId ?? ""}

QUESTION TYPE:

${questionType || "english-assessment"}

EXPECTED ANSWER / GUIDANCE:

${
  expectedAnswer ||
  "Evaluate according to the question and context."
}

ADDITIONAL CONTEXT:

${
  context ||
  "Evaluate the student's English answer."
}

STUDENT NAME:

${userName || "Student"}

MAXIMUM MARKS FOR THIS QUESTION:

${marksLimit}

STUDENT ANSWER:

${message}

IMPORTANT:

The maximum possible score for this question is:

${marksLimit}

Never give more than ${marksLimit} marks.

Evaluate only this answer.

Do not compare the answer with other challenges.

Return ONLY valid JSON.

`;

      /* ---------------------------------------------
         GROQ
      --------------------------------------------- */

      const completion =
        await groq.chat.completions.create({
          model:
            "openai/gpt-oss-120b",

          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: assessmentPrompt,
            },
          ],

          temperature: 0.1,

          max_tokens: 700,
        });

      let aiReply =
        completion
          ?.choices?.[0]
          ?.message
          ?.content
          ?.trim();

      if (!aiReply) {
        return res.status(500).json({
          success: false,
          message:
            "AI did not return an evaluation.",
        });
      }

      /* ---------------------------------------------
         REMOVE MARKDOWN
      --------------------------------------------- */

      aiReply = aiReply
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      /* ---------------------------------------------
         PARSE JSON
      --------------------------------------------- */

      let evaluation;

      try {
        evaluation = JSON.parse(aiReply);
      } catch (jsonError) {
        console.log(
          "❌ Final Challenge JSON Error:",
          jsonError
        );

        console.log(
          "AI Reply:",
          aiReply
        );

        return res.status(500).json({
          success: false,
          message:
            "AI evaluation format error.",
        });
      }

      /* ---------------------------------------------
         SAFE MARKS
      --------------------------------------------- */

      let marks =
        Number(evaluation.marks);

      if (Number.isNaN(marks)) {
        marks = 0;
      }

      marks = Math.max(
        0,
        Math.min(
          marks,
          marksLimit
        )
      );

      /* ---------------------------------------------
         SAFE MISTAKES
      --------------------------------------------- */

      const mistakes =
        Array.isArray(
          evaluation.mistakes
        )
          ? evaluation.mistakes
              .map((item) => ({
                mistake:
                  String(
                    item?.mistake || ""
                  ),

                correction:
                  String(
                    item?.correction || ""
                  ),

                urduExplanation:
                  String(
                    item?.urduExplanation || ""
                  ),
              }))
              .filter(
                (item) =>
                  item.mistake ||
                  item.correction ||
                  item.urduExplanation
              )
          : [];

      /* ---------------------------------------------
         GRAMMAR CORRECT
      --------------------------------------------- */

      const grammarCorrect =
        mistakes.length === 0
          ? true
          : Boolean(
              evaluation.grammarCorrect
            );

      /* ---------------------------------------------
         ANSWER CORRECT
      --------------------------------------------- */

      const answerCorrect =
        evaluation.answerCorrect === true;

      /* ---------------------------------------------
         RESPONSE
      --------------------------------------------- */

      return res.json({
        success: true,

        challengeId:
          challengeId ?? null,

        questionId:
          questionId ?? null,

        marks,

        maxMarks:
          marksLimit,

        answerCorrect,

        grammarCorrect,

        mistakes,

        correction:
          evaluation.correction || "",

        feedback:
          evaluation.feedback ||
          "",

        userAnswer:
          String(message),
      });
    } catch (err) {
      console.log(
        "❌ Final Challenge Check Error:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to evaluate the answer right now.",
      });
    }
  }
);

/* =========================================================
   SAVE FINAL CHALLENGE1 RESULT
========================================================= */

app.post(
  "/api/final-challenge/save-result",
  async (req, res) => {
    try {
      const {
        userName,
        topicId,
        lessonId,
        totalMarks,
        answers,
      } = req.body;

      /* ---------------------------------------------
         MONGODB CHECK
      --------------------------------------------- */

      if (!isMongoConnected()) {
        return res.status(503).json({
          success: false,
          message:
            "MongoDB is not connected.",
        });
      }

      /* ---------------------------------------------
         ANSWERS VALIDATION
      --------------------------------------------- */

      if (
        !Array.isArray(answers) ||
        answers.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Final Challenge answers are required.",
        });
      }

      /* ---------------------------------------------
         FINAL CHALLENGE1 SAFETY

         5 Challenges
         5 Marks Each

         Total = 25
      --------------------------------------------- */

      let calculatedTotalMarks =
        Number(totalMarks);

      if (
        !calculatedTotalMarks ||
        calculatedTotalMarks <= 0
      ) {
        calculatedTotalMarks =
          answers.reduce(
            (total, answer) => {
              const max =
                Number(
                  answer.max_marks ??
                  answer.maxMarks
                ) || 0;

              return total + max;
            },
            0
          );
      }

      /* Default total */

      if (
        calculatedTotalMarks <= 0
      ) {
        calculatedTotalMarks = 25;
      }

      /* ---------------------------------------------
         PREPARE ANSWERS
      --------------------------------------------- */

      const answerData =
        answers.map((answer, index) => {
          const questionId =
            Number(
              answer.question_id ??
              answer.questionId
            ) || index + 1;

          const maxMarks =
            Number(
              answer.max_marks ??
              answer.maxMarks
            ) || 5;

          let marks =
            Number(answer.marks);

          if (
            Number.isNaN(marks)
          ) {
            marks = 0;
          }

          /* Never negative */

          marks = Math.max(
            0,
            marks
          );

          /* Never exceed question max */

          marks = Math.min(
            marks,
            maxMarks
          );

          /* -----------------------------------------
             SAFE MISTAKES
          ----------------------------------------- */

          const mistakes =
            Array.isArray(
              answer.mistakes
            )
              ? answer.mistakes
                  .map((mistake) => ({
                    mistake:
                      mistake?.mistake || "",

                    correction:
                      mistake?.correction || "",

                    urduExplanation:
                      mistake?.urduExplanation ||
                      mistake?.urdu_explanation ||
                      "",
                  }))
                  .filter(
                    (mistake) =>
                      mistake.mistake ||
                      mistake.correction ||
                      mistake.urduExplanation
                  )
              : [];

          /* -----------------------------------------
             RETURN QUESTION DATA
          ----------------------------------------- */

          return {
            question_id:
              questionId,

            question:
              String(
                answer.question || ""
              ),

            user_answer:
              String(
                answer.user_answer ??
                answer.userAnswer ??
                ""
              ),

            marks,

            max_marks:
              maxMarks,

            grammar_correct:
              answer.grammar_correct ??
              answer.grammarCorrect ??
              mistakes.length === 0,

            answer_correct:
              answer.answer_correct ??
              answer.answerCorrect ??
              marks > 0,

            mistake:
              answer.mistake || "",

            correction:
              answer.correction || "",

            urdu_explanation:
              answer.urdu_explanation ??
              answer.urduExplanation ??
              "",

            feedback:
              answer.feedback || "",

            mistakes,
          };
        });

      /* ---------------------------------------------
         OBTAINED MARKS
      --------------------------------------------- */

      let obtainedMarks =
        answerData.reduce(
          (total, answer) =>
            total + answer.marks,
          0
        );

      /* Never exceed total */

      obtainedMarks = Math.min(
        obtainedMarks,
        calculatedTotalMarks
      );

      /* ---------------------------------------------
         PERCENTAGE
      --------------------------------------------- */

      const percentage =
        calculatedTotalMarks > 0
          ? Number(
              (
                (obtainedMarks /
                  calculatedTotalMarks) *
                100
              ).toFixed(2)
            )
          : 0;

      /* ---------------------------------------------
         GRADE
      --------------------------------------------- */

      let grade = "";

      if (percentage >= 90) {
        grade = "Excellent";
      } else if (percentage >= 80) {
        grade = "Very Good";
      } else if (percentage >= 70) {
        grade = "Good";
      } else if (percentage >= 60) {
        grade = "Keep Practicing";
      } else {
        grade = "Needs Improvement";
      }

      /* ---------------------------------------------
         COLLECT ALL GRAMMAR MISTAKES
      --------------------------------------------- */

      const grammarMistakes = [];

      answerData.forEach((answer) => {
        if (
          Array.isArray(
            answer.mistakes
          )
        ) {
          answer.mistakes.forEach(
            (mistake) => {
              if (
                mistake &&
                (
                  mistake.mistake ||
                  mistake.correction ||
                  mistake.urduExplanation
                )
              ) {
                grammarMistakes.push({
                  question_id:
                    answer.question_id,

                  mistake:
                    mistake.mistake || "",

                  correction:
                    mistake.correction || "",

                  urdu_explanation:
                    mistake.urduExplanation ||
                    "",
                });
              }
            }
          );
        }

        /* Support old single mistake */

        if (
          answer.mistake &&
          answer.mistakes.length === 0
        ) {
          grammarMistakes.push({
            question_id:
              answer.question_id,

            mistake:
              answer.mistake,

            correction:
              answer.correction || "",

            urdu_explanation:
              answer.urdu_explanation ||
              "",
          });
        }
      });

      /* ---------------------------------------------
         SAVE TO MONGODB
      --------------------------------------------- */

      const result =
        await FinalChallengeResult.create({
          user_name:
            userName || "Student",

          topic_id:
            Number(topicId) || 3,

          lesson_id:
            Number(lessonId) || 4,

          total_marks:
            calculatedTotalMarks,

          obtained_marks:
            obtainedMarks,

          percentage,

          grade,

          answers:
            answerData,

          grammar_mistakes:
            grammarMistakes,
        });

      /* ---------------------------------------------
         SERVER LOG
      --------------------------------------------- */

      console.log(
        "================================="
      );

      console.log(
        "FINAL CHALLENGE SAVED SUCCESSFULLY"
      );

      console.log(
        "Result ID:",
        result._id.toString()
      );

      console.log(
        "Student:",
        userName || "Student"
      );

      console.log(
        "Challenges:",
        answerData.length
      );

      console.log(
        "Marks:",
        `${obtainedMarks}/${calculatedTotalMarks}`
      );

      console.log(
        "Percentage:",
        `${percentage}%`
      );

      console.log(
        "Grade:",
        grade
      );

      console.log(
        "================================="
      );

      /* ---------------------------------------------
         RESPONSE
      --------------------------------------------- */

      return res.json({
        success: true,

        resultId:
          result._id,

        totalMarks:
          calculatedTotalMarks,

        obtainedMarks,

        percentage,

        grade,

        answers:
          answerData,

        grammarMistakes,

        message:
          "Final Challenge result saved successfully.",
      });
    } catch (err) {
      console.log(
        "Final Challenge Save Error:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to save final challenge result.",
      });
    }
  }
);


/* =========================================================
   START SERVER
========================================================= */

const PORT =
  process.env.PORT || 5000;

/* =========================================================
   GROQ MODEL TEST
========================================================= */

app.get("/api/test-groq", async (req, res) => {
  try {

    const model =
      await groq.models.retrieve(
        "openai/gpt-oss-120b"
      );

    return res.json({
      success: true,
      model: model.id,
      message: "Groq model is accessible."
    });

  } catch (error) {

    console.log(
      "❌ GROQ MODEL TEST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Groq model test failed."
    });

  }
});


/* =========================================================
   CHECK AVAILABLE GROQ MODELS
========================================================= */

app.get("/api/groq-models", async (req, res) => {
  try {

    const models = await groq.models.list();

    const modelIds = models.data.map(
      (model) => model.id
    );

    return res.json({
      success: true,
      models: modelIds
    });

  } catch (error) {

    console.log(
      "❌ GROQ MODELS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to load Groq models."
    });

  }
});

app.listen(
  PORT,
  () => {
    console.log(
      "================================="
    );

    console.log(
      `🚀 Server Running On Port ${PORT}`
    );

    console.log(
      "Final Challenge Total: 25 Marks"
    );

    console.log(
      "================================="
    );
  }
);