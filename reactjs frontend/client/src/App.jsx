import React, { useState } from "react";

import HomePage from "./homepage";
import LoginPage from "./LoginPage";
import PathwayPage from "./pathwaypage";
import TopicPage from "./TopicPage";
import SubtopicPage from "./SubtopicPage";
import ChatPage from "./chatpage";

import FoodFlow from "./FoodFlow";
import VocabularyFlow from "./VocabularyFlow";
import ListenRepeatFlow from "./ListenRepeatFlow";
import RestaurantConversationFlow from "./RestaurantConversationFlow";

import "./App.css";

function App() {

  const [userName, setUserName] = useState("");
  const [currentPage, setCurrentPage] = useState("home");

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  return (

    <div className="app-main-wrapper">

      {/* HOME */}

      {currentPage === "home" && (

        <HomePage
          onStart={() => setCurrentPage("login")}
        />

      )}

      {/* LOGIN */}

      {currentPage === "login" && (

        <LoginPage
          onLogin={() => setCurrentPage("pathway")}
          onBack={() => setCurrentPage("home")}
        />

      )}

      {/* PATHWAY */}

      {currentPage === "pathway" && (

        <PathwayPage
          onBack={() => setCurrentPage("home")}
          onSelectMode={() => setCurrentPage("topics")}
        />

      )}

      {/* TOPICS */}

      {currentPage === "topics" && (

        <TopicPage

          onBack={() => setCurrentPage("pathway")}

          onSelectTopic={(topic) => {

            setSelectedTopic(topic);

            setCurrentPage("subtopics");

          }}

        />

      )}

      {/* SUBTOPICS */}

      {currentPage === "subtopics" && (

        <SubtopicPage

          selectedTopic={selectedTopic}

          onBack={() => setCurrentPage("topics")}

          onSelectTopic={(lesson) => {

            setSelectedLesson(lesson);

            setCurrentPage("chat");

          }}

        />

      )}

      {/* CHAT PAGE */}

      {currentPage === "chat" && (

        <ChatPage

          userName={userName}

          setUserName={setUserName}

          onBack={() => setCurrentPage("subtopics")}

          onStartLesson={() => {

            if (selectedLesson?.type === "lesson") {

              setCurrentPage("foodFlow");

            }

            else if (selectedLesson?.type === "restaurantConversation") {

              setCurrentPage("restaurantConversation");

            }

            else if (selectedLesson?.type === "vocabulary") {

              setCurrentPage("vocabulary");

            }

            else if (selectedLesson?.type === "restaurant") {

              setCurrentPage("restaurant");

            }

          }}

        />

      )}

      {/* ================= FOOD FLOW ================= */}

      {currentPage === "foodFlow" && (

        <FoodFlow

          content={selectedLesson?.content}

          topicId={selectedTopic?.id}

          lessonId={selectedLesson?.id}

          userName={userName}

          onFinish={() => setCurrentPage("lessonComplete")}

          onBack={() => setCurrentPage("chat")}

        />

      )}

      

      {/* ================= RESTAURANT CONVERSATION FLOW ================= */}

{currentPage === "restaurantConversation" && (

  <RestaurantConversationFlow

    content={selectedLesson?.content}

    topicId={selectedTopic?.id}

    lessonId={selectedLesson?.id}

    userName={userName}

    onFinish={() => {

      // Lesson Complete popup ke baad
      // directly SubtopicPage par wapas

      setCurrentPage("subtopics");

    }}

    onBack={() => setCurrentPage("chat")}

  />

)}
      {/* ================= VOCABULARY FLOW ================= */}

      {currentPage === "vocabulary" && (

        <VocabularyFlow

          content={selectedLesson?.content}

          onFinish={() => {

            setCurrentPage("listenRepeat");

          }}

        />

      )}

      {/* ================= LISTEN & REPEAT ================= */}

      {currentPage === "listenRepeat" && (

        <ListenRepeatFlow

          onFinish={() => {

            setCurrentPage("lessonComplete");

          }}

        />

      )}

      {/* ================= OLD RESTAURANT PAGE ================= */}

      {currentPage === "restaurant" && (

        <div className="lesson-page">

          <h2>Restaurant Flow Coming Soon...</h2>

        </div>

      )}

      {/* ================= LESSON COMPLETE ================= */}

      {currentPage === "lessonComplete" && (

        <div className="lesson-page">

          <h1>🎉 Lesson Completed</h1>

          <button

            className="next-btn"

            onClick={() => {

              setCurrentPage("subtopics");

            }}

          >

            Back To Subtopics

          </button>

        </div>

      )}

    </div>

  );

}

export default App;