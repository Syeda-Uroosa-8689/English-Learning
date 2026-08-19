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
import FinalChallengeFlow from "./FinalChallengeFlow";

/* =========================================
   TOPIC 1
========================================= */

/* Subtopic 1 - Talking About Hobbies */
import HobbiesFlow from "./Topic 1/Subtopic 1/HobbiesFlow";

/* Subtopic 2 - Favourite Person */
import FavouritePersonFlow from "./Topic 1/subtopic 2/FavouritePersonFlow.jsx";


import LessonComplete from "./LessonComplete";

import "./App.css";


function App() {

    /* =========================================
       USER NAME
    ========================================= */

    const [userName, setUserName] = useState("");


    /* =========================================
       CURRENT PAGE
    ========================================= */

    const [currentPage, setCurrentPage] =
        useState("home");


    /* =========================================
       SELECTED TOPIC
    ========================================= */

    const [selectedTopic, setSelectedTopic] =
        useState(null);


    /* =========================================
       SELECTED LESSON
    ========================================= */

    const [selectedLesson, setSelectedLesson] =
        useState(null);


    return (

        <div className="app-main-wrapper">


            {/* =========================================
                HOME PAGE
            ========================================= */}

            {currentPage === "home" && (

                <HomePage

                    onStart={() =>
                        setCurrentPage("login")
                    }

                />

            )}


            {/* =========================================
                LOGIN PAGE
            ========================================= */}

            {currentPage === "login" && (

                <LoginPage

                    onLogin={() =>
                        setCurrentPage("pathway")
                    }

                    onBack={() =>
                        setCurrentPage("home")
                    }

                />

            )}


            {/* =========================================
                PATHWAY PAGE
            ========================================= */}

            {currentPage === "pathway" && (

                <PathwayPage

                    onBack={() =>
                        setCurrentPage("home")
                    }

                    onSelectMode={() =>
                        setCurrentPage("topics")
                    }

                />

            )}


            {/* =========================================
                TOPICS PAGE
            ========================================= */}

            {currentPage === "topics" && (

                <TopicPage

                    onBack={() =>
                        setCurrentPage("pathway")
                    }

                    onSelectTopic={(topic) => {

                        setSelectedTopic(topic);

                        setCurrentPage("subtopics");

                    }}

                />

            )}


            {/* =========================================
                SUBTOPICS PAGE
            ========================================= */}

            {currentPage === "subtopics" && (

                <SubtopicPage

                    selectedTopic={
                        selectedTopic
                    }

                    onBack={() =>
                        setCurrentPage("topics")
                    }

                    onSelectTopic={(lesson) => {

                        setSelectedLesson(lesson);

                        setCurrentPage("chat");

                    }}

                />

            )}


            {/* =========================================
                CHAT PAGE
            ========================================= */}

            {currentPage === "chat" && (

                <ChatPage

                    userName={userName}

                    setUserName={setUserName}


                    onBack={() =>
                        setCurrentPage("subtopics")
                    }


                    onStartLesson={() => {


                        /* =========================
                           FOOD LESSON
                        ========================= */

                        if (
                            selectedLesson?.type ===
                            "lesson"
                        ) {

                            setCurrentPage(
                                "foodFlow"
                            );

                        }


                        /* =========================
                           RESTAURANT CONVERSATION
                        ========================= */

                        else if (
                            selectedLesson?.type ===
                            "restaurantConversation"
                        ) {

                            setCurrentPage(
                                "restaurantConversation"
                            );

                        }


                        /* =========================
                           FINAL CHALLENGE
                        ========================= */

                        else if (
                            selectedLesson?.type ===
                            "finalChallenge"
                        ) {

                            setCurrentPage(
                                "finalChallenge"
                            );

                        }


                        /* =========================
                           VOCABULARY
                        ========================= */

                        else if (
                            selectedLesson?.type ===
                            "vocabulary"
                        ) {

                            setCurrentPage(
                                "vocabulary"
                            );

                        }


                        /* =========================
                           OLD RESTAURANT
                        ========================= */

                        else if (
                            selectedLesson?.type ===
                            "restaurant"
                        ) {

                            setCurrentPage(
                                "restaurant"
                            );

                        }


                        /* =========================
                           TOPIC 1
                           SUBTOPIC 1
                           TALKING ABOUT HOBBIES
                        ========================= */

                        else if (
                            selectedLesson?.type ===
                            "hobbies"
                        ) {

                            setCurrentPage(
                                "hobbiesFlow"
                            );

                        }


                        /* =========================
                           TOPIC 1
                           SUBTOPIC 2
                           FAVOURITE PERSON
                        ========================= */

                        else if (
                            selectedLesson?.type ===
                            "favouritePerson"
                        ) {

                            setCurrentPage(
                                "favouritePersonFlow"
                            );

                        }

                    }}

                />

            )}


            {/* =========================================
                FOOD FLOW
            ========================================= */}

            {currentPage === "foodFlow" && (

                <FoodFlow

                    content={
                        selectedLesson?.content
                    }

                    topicId={
                        selectedTopic?.id
                    }

                    lessonId={
                        selectedLesson?.id
                    }

                    userName={
                        userName
                    }


                    onFinish={() => {

                        setCurrentPage(
                            "lessonComplete"
                        );

                    }}


                    onBack={() => {

                        setCurrentPage(
                            "chat"
                        );

                    }}

                />

            )}


            {/* =========================================
                RESTAURANT CONVERSATION FLOW
            ========================================= */}

            {currentPage ===
                "restaurantConversation" && (

                <RestaurantConversationFlow

                    content={
                        selectedLesson?.content
                    }

                    topicId={
                        selectedTopic?.id
                    }

                    lessonId={
                        selectedLesson?.id
                    }

                    userName={
                        userName
                    }


                    onFinish={() => {

                        setCurrentPage(
                            "lessonComplete"
                        );

                    }}


                    onBack={() => {

                        setCurrentPage(
                            "chat"
                        );

                    }}

                />

            )}


            {/* =========================================
                FINAL CHALLENGE FLOW
            ========================================= */}

            {currentPage ===
                "finalChallenge" && (

                <FinalChallengeFlow

                    content={
                        selectedLesson?.content
                    }

                    topicId={
                        selectedTopic?.id
                    }

                    lessonId={
                        selectedLesson?.id
                    }

                    userName={
                        userName
                    }


                    onFinish={() => {

                        setCurrentPage(
                            "lessonComplete"
                        );

                    }}


                    onBack={() => {

                        setCurrentPage(
                            "chat"
                        );

                    }}

                />

            )}


            {/* =========================================
                VOCABULARY FLOW
            ========================================= */}

            {currentPage === "vocabulary" && (

                <VocabularyFlow

                    content={
                        selectedLesson?.content
                    }


                    onFinish={() => {

                        setCurrentPage(
                            "listenRepeat"
                        );

                    }}


                    onBack={() => {

                        setCurrentPage(
                            "chat"
                        );

                    }}

                />

            )}


            {/* =========================================
                LISTEN & REPEAT
            ========================================= */}

            {currentPage === "listenRepeat" && (

                <ListenRepeatFlow

                    onFinish={() => {

                        setCurrentPage(
                            "lessonComplete"
                        );

                    }}


                    onBack={() => {

                        console.log(
                            "APP BACK FUNCTION CALLED"
                        );

                        setCurrentPage(
                            "chat"
                        );

                    }}

                />

            )}


            {/* =========================================
                TOPIC 1
                SUBTOPIC 1
                TALKING ABOUT HOBBIES
            ========================================= */}

            {currentPage === "hobbiesFlow" && (

                <HobbiesFlow

                    content={
                        selectedLesson?.content
                    }


                    topicId={
                        selectedTopic?.id
                    }


                    lessonId={
                        selectedLesson?.id
                    }


                    userName={
                        userName
                    }


                    onFinish={() => {

                        setCurrentPage(
                            "lessonComplete"
                        );

                    }}


                    onBack={() => {

                        setCurrentPage(
                            "chat"
                        );

                    }}

                />

            )}


            {/* =========================================
                TOPIC 1
                SUBTOPIC 2
                FAVOURITE PERSON
            ========================================= */}

            {currentPage ===
                "favouritePersonFlow" && (

                <FavouritePersonFlow

                    content={
                        selectedLesson?.content
                    }


                    topicId={
                        selectedTopic?.id
                    }


                    lessonId={
                        selectedLesson?.id
                    }


                    userName={
                        userName
                    }


                    onFinish={() => {

                        setCurrentPage(
                            "lessonComplete"
                        );

                    }}


                    onBack={() => {

                        setCurrentPage(
                            "chat"
                        );

                    }}

                />

            )}


            {/* =========================================
                OLD RESTAURANT PAGE
            ========================================= */}

            {currentPage === "restaurant" && (

                <div className="lesson-page">

                    <h2>
                        Restaurant Flow Coming Soon...
                    </h2>

                </div>

            )}


            {/* =========================================
                COMMON LESSON COMPLETE PAGE
            ========================================= */}

            {currentPage ===
                "lessonComplete" && (

                <LessonComplete

                    onFinish={() => {

                        setCurrentPage(
                            "subtopics"
                        );

                    }}

                />

            )}

        </div>

    );

}


export default App;