require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Groq = require("groq-sdk");

const app = express();

app.use(cors());
app.use(express.json());

/* ===================================
   MongoDB Connection
=================================== */
/*
mongoose
  .connect(
    "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/myLearningApp"
  )
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));
*/

/* ===================================
   Models
=================================== */

const ConversationSchema = new mongoose.Schema({

  user_name: String,

  topic_id: Number,

  lesson_id: Number,

  user_message: String,

  ai_response: String,

  activity: String,

  created_at: {

    type: Date,

    default: Date.now

  }

});

const Conversation = mongoose.model(

  "Conversation",

  ConversationSchema

);

/* ===================================
   Groq
=================================== */

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

/* ===================================
   Topic Prompt
=================================== */

const TOPIC_PROMPTS = {

  1: {
    title: "My Favourite Things",

    prompt:
      "Teach primary school children to talk about favourite things."
  },

  2: {
    title: "All About My Partner",

    prompt:
      "Teach children to describe their friends."
  },

  3: {
    title: "Let's Order",

    prompt:
      "Teach restaurant English. Focus on food vocabulary, likes, dislikes, ordering food and restaurant conversations."
  },

  4: {
    title: "On My Calendar",

    prompt:
      "Teach days, months, routines and calendar."
  }

};

/* ===================================
   Normal Conversation Teacher
=================================== */
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

Example:

"Healthy ka matlab hai body ke liye achha aur hume strong rakhne wala."

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
EXAMPLE
==================================================

Student:
"I like pizza very."

Teacher:

"Good try! Tumne bola: I like pizza very.

Sahi sentence hai:
I like pizza very much.

Explanation:
Yahan "very" ke baad "much" lagta hai jab hum kisi cheez ko bahut pasand karne ki baat karte hain.

Ab bolo:
I like pizza very much."

==================================================
ANOTHER EXAMPLE
==================================================

Student:
"I see a pizza."

Teacher:

"Good try!

Picture describe karte waqt hum bol sakte hain:
I can see a pizza.

Explanation:
Picture me jo cheez hum dekh rahe hain uske liye "I can see" natural sentence hai.

Ab bolo:
I can see a pizza."

==================================================
NEVER DO THIS
==================================================

Do NOT say:

"Your grammar is incorrect because..."

Do NOT give a long English grammar lesson.

Do NOT explain mistakes completely in English.

Do NOT use Hindi/Urdu script.

Do NOT ask a new unrelated question after correcting the student.

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

/* ===================================
   Picture Description Prompt
=================================== */

function createPicturePrompt(currentQuestion, pictureName) {

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

4. NEVER ask about the student's favourite food.

5. NEVER ask about the student's favourite colour.

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

Example:

"Good try!"


Then give ONE corrected sentence.


Then explain the mistake in very simple Roman English.

Example:

Tumne bola:
"I see pizza."

Better sentence:
"I can see a pizza."

Explanation:
Picture describe karte waqt hum "I can see" bol sakte hain.


IMPORTANT:

All explanations MUST be in Roman English only.

NEVER use Hindi script.

NEVER use Devanagari.

Do not use Urdu script.

Use simple Roman English that a primary school child can understand.


REPEAT RULE:

After correcting the student:

Ask the student to repeat ONLY the corrected sentence.


UNRELATED ANSWER:

If the student says something unrelated to the picture:

Say:

"Let's talk only about this picture."


Then briefly guide the student back to the current picture.


If the student continues saying unrelated things:

Say:

"I couldn't understand. Please describe only what you can see in this picture."


QUESTION RULE:

NEVER create a new question.

NEVER ask a different topic-related question.

NEVER answer the teacher's own question.

The frontend will provide the next teacher question.


CONVERSATION RULE:

The student may give a short answer.

You may briefly respond naturally about the picture.

You may correct the student's English.

You may encourage the student.

But DO NOT let the conversation become a long discussion.


IMPORTANT:

The picture activity has a fixed sequence of questions.

Do NOT change the question sequence.

Do NOT skip the current question.

Do NOT create additional questions.

Wait for the frontend to provide the next question.


EXAMPLE:

Teacher:
"What can you see in this picture?"


Student:
"I see pizza."


Teacher:
"Good try! A better sentence is: 'I can see a pizza.'

Picture describe karte waqt hum 'I can see' use kar sakte hain.

Please repeat:
'I can see a pizza.'"


FINAL RULE:

Stay focused on the current picture.

Stay focused on the current question.

Keep the conversation short.

Use Roman English for explanations only.

`;

}

/* ===================================
   Restaurant AI Waiter Prompt
=================================== */

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

2. Allowed topics are ONLY:

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

7. If the student says something unrelated to the restaurant, say:

"Let's continue our restaurant conversation."

Then continue with the previous restaurant question.

8. If the student's English has a grammar mistake:

First appreciate naturally.

Example:

"Good try!"

Then give ONE better sentence.

9. Explain the mistake ONLY in simple Roman English.

Example:

"Yahan 'a' use karna better hai kyunki hum ek food item ki baat kar rahe hain."

10. NEVER use Hindi script.

11. NEVER give a long grammar explanation.

12. If the student's sentence is already correct, simply respond naturally like a real waiter.

13. Do NOT behave like a classroom English teacher.

14. Do NOT ask the student to repeat every correct sentence.

15. Keep every response under 40 words.

16. Never answer your own question.

17. Continue the restaurant conversation naturally based on the student's answer.

18. When the customer's order is completely finished, say exactly:

"Thank you for visiting our restaurant. Your order is complete."

`;

}



/* ===================================
   Chat API
=================================== */

app.post("/api/chat", async (req, res) => {

  try {

    const {

      message,
      history,
      topicId,
      lessonId,
      userName,
      activity,
      pictureName,
      currentQuestion

    } = req.body;


    /* ===================================
       Empty Message Check
    =================================== */

    if (!message || message.trim() === "") {

      return res.json({

        response: "Please say something."

      });

    }


    /* ===================================
       Select Correct AI Prompt
    =================================== */

    let systemPrompt;


    /*
       Picture Description Activity
    */

    if (activity === "picture") {

      systemPrompt = createPicturePrompt(

        currentQuestion,
        pictureName

      );

    }


    /*
       Restaurant AI Activity
    */

    else if (activity === "restaurant-ai") {

      systemPrompt = createRestaurantPrompt();

    }


    /*
       Normal English Learning Activity
    */

    else {

      systemPrompt = createTeacherPrompt(topicId);

    }


    /* ===================================
       Build Conversation Messages
    =================================== */

    const messages = [

      {

        role: "system",

        content: systemPrompt

      }

    ];


    /* ===================================
       Add Previous Conversation
    =================================== */

    if (history && Array.isArray(history)) {

      history
        .slice(-6)
        .forEach((chat) => {

          messages.push({

            role:
              chat.sender === "user"
                ? "user"
                : "assistant",

            content: chat.text

          });

        });

    }


    /* ===================================
       Current Student Message
    =================================== */

    messages.push({

      role: "user",

      content: message

    });


    /* ===================================
       Groq Request
    =================================== */

    const completion =
      await groq.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        messages,

        temperature: 0.5,

        max_tokens: 150

      });


    /* ===================================
       AI Response
    =================================== */

    const aiReply =

      completion
        ?.choices
        ?.[0]
        ?.message
        ?.content
        ?.trim()

      ||

      "Sorry, I couldn't understand. Please try again.";


    /* ===================================
       Save Conversation
       Enable when MongoDB is ready
    =================================== */

    /*
    await Conversation.create({

      user_name: userName || "Student",

      topic_id: topicId,

      lesson_id: lessonId,

      activity: activity || "normal",

      user_message: message,

      ai_response: aiReply

    });
    */


    /* ===================================
       Send Response
    =================================== */

    res.json({

      response: aiReply

    });

  }

  catch (err) {

    console.log("❌ Chat API Error:", err);


    res.status(500).json({

      response:
        "Sorry. I couldn't understand. Please try again."

    });

  }

});


/* ===================================
   Home Route
=================================== */

app.get("/", (req, res) => {

  res.send("✅ English Learning API Running");

});


/* ===================================
   Health Check Route
=================================== */

app.get("/api/health", (req, res) => {

  res.json({

    status: "ok",

    message: "AI English Learning Server is running."

  });

});


/* ===================================
   Start Server
=================================== */

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {

  console.log(
    `🚀 Server Running On Port ${PORT}`
  );

});