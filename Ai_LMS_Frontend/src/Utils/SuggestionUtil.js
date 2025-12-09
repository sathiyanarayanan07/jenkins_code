// src/Utils/SuggestionUtil.js
// -------------------------------------------------------------
// Handles all suggestion / recommendation logic for Chatbot.jsx
// -------------------------------------------------------------

/**
 * Detects if a user message should show the "Test Yourself" button.
 */
export const shouldShowTestButton = (input = "") => {
  const text = input.toLowerCase();
  return (
    text.includes("suggest") ||
    text.includes("recommend") ||
    text.includes("which course") ||
    text.includes("what should i learn") ||
    text.includes("what to learn") ||
    text.includes("which path") ||
    text.includes("course")
  );
};

/**
 * Local keyword-based response logic using knowledge base.
 * Returns either a string answer or null.
 */
export const checkLocalSuggestions = (input, knowledgeBase, hasGreetedRef) => {
  const lowerInput = input.toLowerCase();

  for (let item of knowledgeBase) {
    const matched = item.question.some((keyword) =>
      new RegExp(`\\b${keyword}\\b`, "i").test(lowerInput)
    );

    if (matched) {
      // prevent re-greeting if we've already greeted once
      if (item.answer.includes("Hi! 👋") && hasGreetedRef.current) continue;
      return item.answer;
    }
  }

  return null;
};

/**
 * Returns a markdown string with final quiz-based recommendation.
 */
export const getQuizSuggestion = (answers) => {
  let suggested = "";
  const interest = answers?.q3 || "";
  const time = answers?.q5 || "";
  const comfort = answers?.q2 || "";
  const goal = answers?.q4 || "";

  switch (interest) {
    case "Programming":
      suggested =
        comfort === "Not comfortable" || comfort === "Basic level"
          ? "Programming Foundations with Python (Beginner)"
          : "Advanced Python & Data Structures Track";
      break;

    case "Web Development":
      suggested =
        time === "30 mins" || time === "1 hour"
          ? "Frontend Essentials (HTML, CSS & JavaScript)"
          : "Full-Stack Web Development (MERN)";
      break;

    case "Cyber Security":
      suggested = "Cyber Security Essentials — Hands-on";
      break;

    case "AI & ML":
      suggested = "Machine Learning Fundamentals with Python";
      break;

    case "UI/UX":
      suggested = "UI/UX Design Basics";
      break;

    case "Business":
      suggested = "Business & Soft Skills for Tech Careers";
      break;

    default:
      suggested =
        goal === "Get a job"
          ? "Job-Ready Full-Stack Bootcamp"
          : "Foundational Courses — Programming Basics & Projects";
      break;
  }

  return `🎯 Based on your answers, I recommend: **${suggested}**.

Would you like course details, syllabus, example projects, or a complete learning pathway plan?`;
};
