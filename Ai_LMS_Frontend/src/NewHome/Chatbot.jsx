// import { useState, useRef, useEffect } from 'react';
// import { motion, AnimatePresence, useAnimation } from 'framer-motion';
// import { FiSend, FiX, FiChevronUp, FiThumbsUp } from 'react-icons/fi';
// import { RiRobot2Line } from 'react-icons/ri';
// import axios from 'axios';
// import ReactMarkdown from "react-markdown";

// // Chatbot.jsx
// import {
//   buildConversationContext,
//   formatTime,
//   fetchLMSData
// } from "/src/Utils/ChatUtil.js";

// // ✅ Use environment variable for security
// const GEMINI_API_URL = import.meta.env.VITE_GEMINIAI_API_KEY;
// const GEMINI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY; // stored in .env

// const baseUrl = import.meta.env.VITE_BASE_URL;

// // ✅ Optional: Local knowledge base (keep your original one, shortened here for brevity)
// const knowledgeBase = [
//   { question: ['hi', 'hello'], answer: 'Hi! 👋 I’m your EduMaster assistant. How can I help you today?' },
//   { question: ['python', 'learn python'], answer: 'Our Python course covers basics to advanced topics.' },
//   { question: ['free courses'], answer: 'You can explore free Python, JS, and Cyber Security basics courses.' },
//   { question: ['suggest'], answer: "I have some suggestions for courses — want to try a quick test?" }
// ];

// const Chatbot = ({ isOpen, onClose }) => {
//   const [messages, setMessages] = useState([]);
//   const [userInput, setUserInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isMinimized, setIsMinimized] = useState(false);
//   const [showQuizModal, setShowQuizModal] = useState(false); // added for quiz modal
//   const messagesEndRef = useRef(null);
//   const hasGreeted = useRef(false);
//   const controls = useAnimation();

//   useEffect(() => {
//     const greetings = [
//       "Hello! I'm your EduMaster assistant. Ask me about any course!",
//       "Hi! Need info on Python, ML, Cyber Security, or more?",
//       "Welcome! I can guide you on courses and more.",
//     ];

//     if (isOpen && !hasGreeted.current) {
//       const greet = greetings[Math.floor(Math.random() * greetings.length)];
//       setMessages([{ type: 'bot', text: greet, timestamp: new Date(), reacted: false }]);
//       hasGreeted.current = true; // ✅ Prevent future greetings
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     const saved = localStorage.getItem("edumaster_chat");
//     if (saved) {
//       try {
//         const parsed = JSON.parse(saved).map(msg => ({
//           ...msg,
//           timestamp: new Date(msg.timestamp) // ✅ Convert back here too
//         }));
//         setMessages(parsed);
//       } catch (err) {
//         console.error("Failed to parse saved chat:", err);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     try {
//       localStorage.setItem("edumaster_chat", JSON.stringify(messages));
//     } catch (err) {
//       console.error("Failed to save chat to localStorage:", err);
//     }
//   }, [messages]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, isMinimized]);

//   const handleReaction = (index) => {
//     setMessages(prev =>
//       prev.map((msg, i) => (i === index ? { ...msg, reacted: !msg.reacted } : msg))
//     );
//   };

//   // ---------------- Quiz result handling ----------------
//   const handleQuizResult = (answers) => {
//     // More nuanced suggestion logic using multiple answers:
//     // Prioritize q3 (interest). Use time availability and comfort to refine suggestion.
//     let suggested = "";
//     const interest = answers?.q3 || "";
//     const time = answers?.q5 || "";
//     const comfort = answers?.q2 || "";
//     const goal = answers?.q4 || "";

//     // Basic mapping by interest (primary)
//     if (interest === "Programming") {
//       if (comfort === "Not comfortable" || comfort === "Basic level") {
//         suggested = "Programming Foundations with Python (Beginner)";
//       } else {
//         suggested = "Advanced Python & Data Structures Track";
//       }
//     } else if (interest === "Web Development") {
//       if (time === "30 mins" || time === "1 hour") {
//         suggested = "Frontend Essentials (HTML/CSS/JS)";
//       } else {
//         suggested = "Full-Stack Web Development (MERN)";
//       }
//     } else if (interest === "Cyber Security") {
//       suggested = "Cyber Security Essentials — Hands-on";
//     } else if (interest === "AI & ML") {
//       suggested = "Machine Learning Fundamentals with Python";
//     } else if (interest === "UI/UX") {
//       suggested = "UI/UX Design Basics";
//     } else if (interest === "Business") {
//       suggested = "Business & Soft Skills for Tech Careers";
//     } else {
//       // fallback using goal and other answers
//       if (goal === "Get a job") suggested = "Job-Ready Full-Stack Bootcamp";
//       else suggested = "Foundational Courses (Programming basics & projects)";
//     }

//     const followUp = `🎯 Based on your answers, I recommend: **${suggested}**.\nWould you like course details, syllabus, example projects, or a pathway plan?`;

//     setMessages(prev => [
//       ...prev,
//       {
//         type: "bot",
//         text: followUp,
//         timestamp: new Date(),
//         reacted: false,
//         showTestButton: false,
//       },
//     ]);
//   };
//   // ------------------------------------------------------

//   const handleSend = async () => {
//     const input = userInput.trim();
//     if (!input) return;

//     const userMessage = { type: 'user', text: input, timestamp: new Date() };
//     setMessages(prev => [...prev, userMessage]);
//     setUserInput('');
//     setIsLoading(true);

//     await controls.start({
//       scale: [1, 1.2, 1],
//       rotate: [0, 10, -10, 0],
//       transition: { duration: 0.4 },
//     });

//     try {
//       const lowerInput = input.toLowerCase();

//       // ✅ 1. Check local knowledge base first
//       let foundAnswer = null;
//       for (let item of knowledgeBase) {
//         if (
//           item.question.some(keyword =>
//             new RegExp(`\\b${keyword}\\b`, "i").test(lowerInput)
//           )
//         ) {
//           // 👇 prevent re-greeting after first message
//           if (item.answer.includes("Hi! 👋") && hasGreeted.current) continue;
//           foundAnswer = item.answer;
//           break;
//         }
//       }

//       // Determine if we should show Test button for this query
//       const needsTestButton =
//         lowerInput.includes("suggest") ||
//         lowerInput.includes("recommend") ||
//         lowerInput.includes("which course") ||
//         lowerInput.includes("what should i learn") ||
//         lowerInput.includes("what to learn") ||
//         lowerInput.includes("which path") ||
//         lowerInput.includes("course");

//       // ---------- FIXED block for foundAnswer ----------
//       if (foundAnswer) {
//         setMessages(prev => [
//           ...prev,
//           {
//             type: 'bot',
//             text: foundAnswer,
//             timestamp: new Date(),
//             reacted: false,
//             showTestButton: needsTestButton
//           },
//         ]);

//         setIsLoading(false);
//         return;
//       }
//       // -------------------------------------------------

//       // If not found in the local knowledge base, use Gemini + LMS context
//       const lmsContext = await fetchLMSData(input);
//       const chatHistory = buildConversationContext(messages);
//       const trimmedHistory = chatHistory.slice(-1500); // Keep last ~1500 chars

//       const prompt = `
// You are EduMaster AI, the official assistant for ${baseUrl}.
// You are having a conversation with a user about EduMaster courses.
// Use both the conversation history and the LMS course data below to respond naturally.
// Stay concise (2–4 sentences), friendly, and on-topic.

// === CONVERSATION HISTORY ===
// ${trimmedHistory}

// === COURSE DATA CONTEXT ===
// ${lmsContext}

// User: ${input}
// Assistant:
// `;

//       // ✅ 2. Call Gemini API for natural conversation
//       const geminiResponse = await axios.post(
//         GEMINI_API_URL,
//         {
//           contents: [{
//             parts: [{ text: prompt }],
//           }]
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'X-goog-api-key': GEMINI_API_KEY,
//           },
//         }
//       );

//       let botReply =
//         geminiResponse?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
//         "I'm sorry, I couldn't find that in our system.";

//       // 🧩 Enforce brevity (hard cap)
//       const trimmedReply =
//         botReply.length > 400
//           ? botReply.slice(0, 380).trim() + "..."
//           : botReply;

//       setMessages(prev => [
//         ...prev,
//         { type: 'bot', text: trimmedReply, timestamp: new Date(), reacted: false, showTestButton: needsTestButton },
//       ]);

//       // ✅ 3. (Optional) LMS integration — fetch course data dynamically
//       if (lowerInput.includes('courses') || lowerInput.includes('list')) {
//         try {
//           const { data: courses } = await axios.get(`${baseUrl}/api/course/`);
//           const formattedCourses = Array.isArray(courses)
//             ? courses.map(c => `• ${c.name} ${c.duration ? `(${c.duration})` : ''}`).join('\n')
//             : '';

//           if (formattedCourses) {
//             setMessages(prev => [
//               ...prev,
//               {
//                 type: 'bot',
//                 text: `Here are some available courses:\n${formattedCourses}`,
//                 timestamp: new Date(),
//                 reacted: false,
//               },
//             ]);
//           }
//         } catch (err) {
//           console.error('LMS fetch error:', err);
//         }
//       }
//     } catch (err) {
//       console.error('Error sending message:', err);
//       setMessages(prev => [
//         ...prev,
//         {
//           type: 'bot',
//           text: '⚠️ Sorry, there was an issue reaching the AI server. Please try again later.',
//           timestamp: new Date(),
//           reacted: false,
//         },
//       ]);
//     }

//     setIsLoading(false);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   const toggleMinimize = () => setIsMinimized(!isMinimized);
//   const handleClose = () => {
//     setMessages([]);
//     hasGreeted.current = false; // ✅ Allow greeting again next time it opens
//     onClose();
//   };

//   // ---------------- 10-question mixed Quiz Modal (Skill-Based Career Questions) ----------------
//   const QuizModal = ({ onClose, onFinish }) => {
//     const [step, setStep] = useState(0);
//     const [answers, setAnswers] = useState({
//       q1: "", q2: "", q3: "", q4: "", q5: "",
//       q6: "", q7: "", q8: "", q9: "", q10: ""
//     });


//     // Dynamic question generator
//     const getDynamicQuestions = () => {
//       const q1 = answers.q1;  // Education
//       const q3 = answers.q3;  // Interest

//       // FIRST FIXED 3 QUESTIONS
//       let baseQuestions = [
//         {
//           id: "q1",
//           question: "What is your current education / skill level?",
//           type: "radio",
//           options: ["Student", "Graduate", "Working Professional", "Self-Learner"]
//         },
//         {
//           id: "q2",
//           question: "How comfortable are you with computers?",
//           type: "radio",
//           options: ["Not comfortable", "Basic level", "Intermediate", "Advanced"]
//         },
//         {
//           id: "q3",
//           question: "Which area interests you the most?",
//           type: "radio",
//           options: ["Programming", "Web Development", "Cyber Security", "AI & ML", "UI/UX", "Business"]
//         }
//       ];

//       // AFTER FIRST 3 ANSWERS, SWITCH QUESTION SETS

//       if (q1 === "Student") {
//         return [
//           ...baseQuestions,
//           { id: "q4", question: "What is your department/major?", type: "radio", options: ["CSE", "ECE", "EEE", "IT", "Mechanical", "Civil", "Other"] },
//           { id: "q5", question: "Are you looking for internships?", type: "radio", options: ["Yes", "Maybe", "No"] },
//           { id: "q6", question: "What is your coding level?", type: "radio", options: ["Beginner", "Intermediate", "Advanced"] },
//           { id: "q7", question: "How many hours weekly can you learn?", type: "radio", options: ["2 hours", "5 hours", "10 hours", "15+ hours"] },
//           { id: "q8", question: "Are you preparing for placements?", type: "radio", options: ["Yes", "No"] }
//         ];
//       }

//       // For Working Professionals
//       if (q1 === "Working Professional") {
//         return [
//           ...baseQuestions,
//           { id: "q4", question: "What is your current job role?", type: "radio", options: ["IT", "Non-IT", "Business", "Fresher"] },
//           // { id: "q5", question: "Are you planning a career shift?", type: "radio", options: ["Yes", "No", "Not sure"] },
//           { id: "q6", question: "How many hours weekly can you spend?", type: "radio", options: ["3 hours", "5 hours", "8 hours", "10+ hours"] },
//           { id: "q7", question: "Which learning style do you prefer?", type: "radio", options: ["Fast-track", "In-depth", "Project-based"] },
//           { id: "q8", question: "Your goal:", type: "radio", options: ["Promotion", "Career shift", "Freelance", "Skill upgrade"] }
//         ];
//       }

//       // DEFAULT: self-learners or graduates
//       return [
//         ...baseQuestions,
//         { id: "q4", question: "What motivates you to learn?", type: "radio", options: ["Career", "Passion", "Money", "Growth"] },
//         { id: "q5", question: "How consistent are you in learning?", type: "radio", options: ["Daily", "Weekly", "Rarely"] },
//         { id: "q6", question: "Do you prefer structured courses?", type: "radio", options: ["Yes", "No"] },
//         { id: "q7", question: "How many hours weekly can you commit?", type: "radio", options: ["2", "5", "10", "15"] },
//         { id: "q8", question: "Do you enjoy project-based learning?", type: "radio", options: ["Yes", "Sometimes", "No"] }
//       ];
//     };

//     const questions = getDynamicQuestions();
//     const current = questions[step];

//     // const current = questions[step];

//     const update = (value) => {
//       setAnswers(prev => ({ ...prev, [current.id]: value }));
//     };

//     const next = () => {
//       // require selection for current
//       if (!answers[current.id]) return;
//       if (step === questions.length - 1) {
//         // final submit
//         onFinish(answers);
//         onClose();
//       } else {
//         setStep(step + 1);
//       }
//     };

//     const back = () => {
//       if (step === 0) return;
//       setStep(step - 1);
//     };


//     return (
//       <div className="fixed inset-0 z-[200] flex items-center justify-center">
//         <div
//           className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//           onClick={onClose}
//         />

//         <motion.div
//           initial={{ scale: 0.9, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           exit={{ scale: 0.9, opacity: 0 }}
//           transition={{ type: "spring", stiffness: 260, damping: 22 }}
//           className="
//       relative bg-white/95 backdrop-blur-xl
//       w-[97%] max-w-3xl 
//       h-[80vh]                /* 🔥 FIXED HEIGHT */
//       overflow-hidden         /* No expanding */
//       rounded-3xl p-8
//       shadow-[0_10px_40px_rgba(0,0,0,0.30)]
//       border border-white/40
//     "
//         >
//           {/* HEADER */}
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-xl font-semibold">Career Skill Test — Step {step + 1} of {questions.length}</h3>
//             <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
//               <FiX className="text-2xl" />
//             </button>
//           </div>

//           {/* 🌟 Scrollable Content Area */}
//           <div className="overflow-y-auto h-[56vh] pr-2">

//             <p className="text-gray-700 text-lg mb-4">{current.question}</p>

//             <div className="space-y-3">
//               {/* RADIO OPTIONS */}
//               {current.type === "radio" &&
//                 current.options.map(opt => (
//                   <label
//                     key={opt}
//                     className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-gray-300 hover:bg-orange-50 transition cursor-pointer"
//                   >
//                     <input
//                       type="radio"
//                       name={current.id}
//                       checked={answers[current.id] === opt}
//                       onChange={() => update(opt)}
//                       className="h-4 w-4 accent-orange-500"
//                     />
//                     <span className="text-gray-800">{opt}</span>
//                   </label>
//                 ))
//               }

//             </div>
//           </div>

//           {/* BUTTONS FIXED AT BOTTOM */}
//           <div className="mt-5 flex justify-between items-center">
//             <button
//               onClick={back}
//               className="px-5 py-2 bg-gray-200 rounded-xl text-gray-800 hover:bg-gray-300"
//             >
//               Back
//             </button>

//             <button
//               onClick={next}
//               disabled={!answers[current.id]}
//               className="px-8 py-3 rounded-xl text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90 shadow-md disabled:opacity-40"
//             >
//               {step === questions.length - 1 ? "Submit" : "Next"}
//             </button>
//           </div>
//         </motion.div>
//       </div>

//     )
//   };

//   // -----------------------------------------------------------------------------------------------

//   // ---------------- UI render ----------------
//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0, y: 20, scale: 0.95 }}
//           animate={{
//             opacity: 1,
//             y: 0,
//             scale: 1,
//             height: isMinimized ? 70 : 820,
//           }}
//           exit={{ opacity: 0, y: 20, scale: 0.95 }}
//           transition={{ type: 'spring', damping: 25, stiffness: 300 }}
//           className={`fixed bottom-5 right-28 w-[95vw] max-w-[450px] max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 ${isMinimized ? 'cursor-pointer' : ''
//             }`}
//           onClick={isMinimized ? toggleMinimize : undefined}
//         >
//           {/* Header */}
//           <motion.div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 flex items-center justify-between h-14">
//             <div className="flex items-center space-x-3">
//               <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm">
//                 <RiRobot2Line className="text-orange-500 text-lg" />
//               </div>
//               <div>
//                 <h3 className="text-white font-semibold text-sm">
//                   EduMaster AI
//                 </h3>
//                 {!isMinimized && (
//                   <p className="text-xs text-orange-100">Course Assistant</p>
//                 )}
//               </div>
//             </div>
//             <div className="flex items-center space-x-2">
//               <motion.button
//                 onClick={toggleMinimize}
//                 className="text-white hover:text-orange-200"
//               >
//                 <FiChevronUp
//                   className={`h-5 w-5 ${isMinimized ? 'rotate-180' : ''}`}
//                 />
//               </motion.button>
//               <motion.button
//                 onClick={handleClose}
//                 className="text-white hover:text-orange-200"
//               >
//                 <FiX className="h-5 w-5" />
//               </motion.button>
//             </div>
//           </motion.div>

//           {!isMinimized && (
//             <>
//               {/* Messages */}
//               <div className="flex-1 p-3 overflow-y-auto bg-gradient-to-b from-white to-gray-50">
//                 {messages.map((msg, i) => (
//                   <div
//                     key={i}
//                     className={`mb-3 flex ${msg.type === 'user'
//                       ? 'justify-end'
//                       : 'justify-start'
//                       }`}
//                   >
//                     <div
//                       className={`max-w-[85%] rounded-2xl p-2.5 text-sm ${msg.type === 'user'
//                         ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-br-none'
//                         : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
//                         }`}
//                     >
//                       <div className={`whitespace-pre-line ${msg.type === 'user' ? "text-white" : " prose prose-sm  max-w-none"}`}><ReactMarkdown>{msg.text}</ReactMarkdown></div>

//                       {/* Render Test Yourself button (if flagged) */}
//                       {msg.showTestButton && (
//                         <div className="mt-2">
//                           <button
//                             onClick={() => setShowQuizModal(true)}
//                             className="mt-2 px-5 py-3 bg-orange-500 text-white text-lg rounded-lg hover:bg-orange-600"
//                           >
//                             Test Yourself 🎯
//                           </button>
//                         </div>
//                       )}

//                       <div className="flex justify-between items-center mt-1">
//                         <div
//                           className={`text-xs ${msg.type === 'user'
//                             ? 'text-orange-100'
//                             : 'text-gray-500'
//                             }`}
//                         >
//                           {formatTime(msg.timestamp)}
//                         </div>
//                         {msg.type === 'bot' && (
//                           <motion.button
//                             onClick={() => handleReaction(i)}
//                             className={`ml-2 p-1 rounded-full ${msg.reacted
//                               ? 'bg-orange-100 text-orange-600'
//                               : 'text-gray-400 hover:text-orange-500'
//                               }`}
//                             whileHover={{ scale: 1.1 }}
//                             whileTap={{ scale: 0.9 }}
//                           >
//                             <FiThumbsUp className="h-3 w-3" />
//                           </motion.button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 {isLoading && (
//                   <div className="flex justify-start mb-4">
//                     <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl p-3 shadow-sm">
//                       <span className="text-sm text-gray-600">
//                         Thinking...
//                       </span>
//                     </div>
//                   </div>
//                 )}
//                 <div ref={messagesEndRef} />
//               </div>

//               {/* Input */}
//               <div className="p-3 border-t border-gray-200 bg-white">
//                 <div className="flex items-center space-x-2">
//                   <input
//                     type="text"
//                     value={userInput}
//                     onChange={(e) => setUserInput(e.target.value)}
//                     onKeyDown={handleKeyDown}
//                     placeholder="Ask about any course..."
//                     className="flex-1 p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 text-sm"
//                     disabled={isLoading}
//                   />
//                   <motion.button
//                     onClick={handleSend}
//                     disabled={isLoading || !userInput.trim()}
//                     className={`p-3 rounded-xl ${isLoading || !userInput.trim()
//                       ? 'bg-gray-200 text-gray-400'
//                       : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
//                       }`}
//                     animate={controls}
//                   >
//                     <FiSend className="h-5 w-5" />
//                   </motion.button>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* Show Quiz Modal when triggered */}
//           {showQuizModal && (
//             <QuizModal
//               onClose={() => setShowQuizModal(false)}
//               onFinish={handleQuizResult}
//             />
//           )}
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default Chatbot;



// src/components/Chatbot/Chatbot.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import axios from "axios";

import ChatHeader from "/src/NewHome/ChatbotComponent/ChatHeader.jsx";
import ChatMessages from "/src/NewHome/ChatbotComponent/ChatMessages.jsx";
import ChatInput from "/src/NewHome/ChatbotComponent/ChatInput.jsx";
import QuizModal from "/src/NewHome/ChatbotComponent/QuizModal.jsx";

import {
  buildConversationContext,
  formatTime,
  fetchLMSData,
} from "/src/Utils/ChatUtil.js";

import {
  shouldShowTestButton,
  checkLocalSuggestions,
  getQuizSuggestion,
} from "/src/Utils/SuggestionUtil.js";

// ✅ Environment variables
const GEMINI_API_URL = import.meta.env.VITE_GEMINIAI_API_KEY; // endpoint URL
const GEMINI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;   // actual key
const baseUrl = import.meta.env.VITE_BASE_URL;

// ✅ Local knowledge base
const knowledgeBase = [
  {
    question: ["hi", "hello"],
    answer: "Hi! 👋 I’m your EduMaster assistant. How can I help you today?",
  },
  {
    question: ["python", "learn python"],
    answer: "Our Python course covers basics to advanced topics.",
  },
  {
    question: ["free courses"],
    answer:
      "You can explore free Python, JavaScript, and Cyber Security basics courses.",
  },
  {
    question: ["suggest"],
    answer:
      "I have some suggestions for courses — want to try a quick test?",
  },
];

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  const messagesEndRef = useRef(null);
  const hasGreeted = useRef(false);
  const controls = useAnimation();

  // ---------- Greeting when opened ----------
  useEffect(() => {
    const greetings = [
      "Hello! I'm your EduMaster assistant. Ask me about any course!",
      "Hi! Need info on Python, ML, Cyber Security, or more?",
      "Welcome! I can guide you on courses and more.",
    ];

    if (isOpen && !hasGreeted.current) {
      const greet =
        greetings[Math.floor(Math.random() * greetings.length)];
      setMessages([
        {
          type: "bot",
          text: greet,
          timestamp: new Date(),
          reacted: false,
        },
      ]);
      hasGreeted.current = true;
    }
  }, [isOpen]);

  // ---------- Load messages from localStorage ----------
  useEffect(() => {
    const saved = localStorage.getItem("edumaster_chat");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved).map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));
      setMessages(parsed);
    } catch (err) {
      console.error("Failed to parse saved chat:", err);
    }
  }, []);

  // ---------- Persist messages to localStorage ----------
  useEffect(() => {
    try {
      localStorage.setItem("edumaster_chat", JSON.stringify(messages));
    } catch (err) {
      console.error("Failed to save chat to localStorage:", err);
    }
  }, [messages]);

  // ---------- Auto-scroll ----------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isMinimized]);

  // ---------- Reactions ----------
  const handleReaction = (index) => {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === index ? { ...msg, reacted: !msg.reacted } : msg
      )
    );
  };

  // ---------- Quiz result handling ----------
  const handleQuizResult = (answers) => {
    const followUp = getQuizSuggestion(answers);

    setMessages((prev) => [
      ...prev,
      {
        type: "bot",
        text: followUp,
        timestamp: new Date(),
        reacted: false,
        showTestButton: false,
      },
    ]);
  };

  // ---------- Send handler ----------
  const handleSend = async () => {
    const input = userInput.trim();
    if (!input) return;

    const userMessage = {
      type: "user",
      text: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsLoading(true);

    // Small icon animation
    await controls.start({
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.4 },
    });

    try {
      // 1️⃣ Check local suggestion first
      const localAnswer = checkLocalSuggestions(
        input,
        knowledgeBase,
        hasGreeted
      );
      const needsTestButton = shouldShowTestButton(input);

      if (localAnswer) {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: localAnswer,
            timestamp: new Date(),
            reacted: false,
            showTestButton: needsTestButton,
          },
        ]);
        setIsLoading(false);
        return;
      }

      // 2️⃣ Build LMS + conversation context
      const lmsContext = await fetchLMSData(input);
      const chatHistory = buildConversationContext(messages);
      const trimmedHistory = chatHistory.slice(-1500);

      const prompt = `
You are EduMaster AI, the official assistant for ${baseUrl}.
You are having a conversation with a user about EduMaster courses.
Use both the conversation history and the LMS course data below to respond naturally.
Stay concise (2–4 sentences), friendly, and on-topic.

=== CONVERSATION HISTORY ===
${trimmedHistory}

=== COURSE DATA CONTEXT ===
${lmsContext}

User: ${input}
Assistant:
`;

      // 3️⃣ Call Gemini API
      const geminiResponse = await axios.post(
        GEMINI_API_URL,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": GEMINI_API_KEY,
          },
          timeout: 15000,
        }
      );

      let botReply =
        geminiResponse?.data?.candidates?.[0]?.content?.parts?.[0]
          ?.text || "I'm sorry, I couldn't find that in our system.";

      // Hard cap length
      const trimmedReply =
        botReply.length > 400
          ? botReply.slice(0, 380).trim() + "..."
          : botReply;

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: trimmedReply,
          timestamp: new Date(),
          reacted: false,
          showTestButton: needsTestButton,
        },
      ]);

      // 4️⃣ Optional: fetch LMS course list if message asks for courses
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes("courses") || lowerInput.includes("list")) {
        try {
          const { data: courses } = await axios.get(
            `${baseUrl}/api/course/`
          );

          const formattedCourses = Array.isArray(courses)
            ? courses
                .map((c) => `• ${c.name}${c.duration ? ` (${c.duration})` : ""}`)
                .join("\n")
            : "";

          if (formattedCourses) {
            setMessages((prev) => [
              ...prev,
              {
                type: "bot",
                text: `Here are some available courses:\n${formattedCourses}`,
                timestamp: new Date(),
                reacted: false,
              },
            ]);
          }
        } catch (err) {
          console.error("LMS fetch error:", err);
        }
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text:
            "⚠️ Sorry, there was an issue reaching the AI server. Please try again later.",
          timestamp: new Date(),
          reacted: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMinimize = () => setIsMinimized((prev) => !prev);

  const handleClose = () => {
    setMessages([]);
    hasGreeted.current = false;
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            height: isMinimized ? 70 : 820,
          }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`fixed bottom-5 right-28 w-[95vw] max-w-[450px] max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 ${
            isMinimized ? "cursor-pointer" : ""
          }`}
          onClick={isMinimized ? toggleMinimize : undefined}
        >
          {/* Header */}
          <ChatHeader
            isMinimized={isMinimized}
            onToggleMinimize={toggleMinimize}
            onClose={handleClose}
          />

          {/* Body */}
          {!isMinimized && (
            <>
              <ChatMessages
                messages={messages}
                isLoading={isLoading}
                messagesEndRef={messagesEndRef}
                onReact={handleReaction}
                onOpenQuiz={() => setShowQuizModal(true)}
                formatTime={formatTime}
              />

              <ChatInput
                userInput={userInput}
                onChange={setUserInput}
                onSend={handleSend}
                onKeyDown={handleKeyDown}
                isLoading={isLoading}
                controls={controls}
              />
            </>
          )}

          {/* Quiz Modal */}
          {showQuizModal && (
            <QuizModal
              onClose={() => setShowQuizModal(false)}
              onFinish={handleQuizResult}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Chatbot;
