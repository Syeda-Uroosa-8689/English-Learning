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
            "llama-3.3-70b-versatile",

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
            "llama-3.3-70b-versatile",

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
   START SERVER
========================================================= */

const PORT =
  process.env.PORT || 5000;

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