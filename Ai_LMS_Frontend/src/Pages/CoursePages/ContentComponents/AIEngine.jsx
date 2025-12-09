// // /src/Components/AI/AIEngine.jsx
// import React, { useState } from "react";
// import axios from "axios";
// import { Sparkles, Cpu } from "lucide-react";

// /* ------------------------------------------------------------------ */
// /*  UTILITY FUNCTIONS                                                 */
// /* ------------------------------------------------------------------ */
// const getRandomItems = (arr, count = 5) => {
//   if (arr.length <= count) return arr;
//   return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
// };

// /* ------------------------------------------------------------------ */
// /*  AI QUIZ GENERATOR                                                 */
// /* ------------------------------------------------------------------ */
// export const AIQuizGenerator = ({
//   chapterDescription,
//   videoDescription,
//   onQuizGenerated,
//   chapterId,
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [generatedQuestions, setGeneratedQuestions] = useState([]);
//   const [displayedQuestions, setDisplayedQuestions] = useState([]);

//   const generateQuiz = async () => {
//     const description = videoDescription || chapterDescription;
//     if (!description) {
//       setError("No description available to generate quiz.");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setGeneratedQuestions([]);
//     setDisplayedQuestions([]);

//     try {
//       const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
//       const API_URL = import.meta.env.VITE_GEMINIAI_API_KEY;

//       const response = await axios.post(
//         API_URL,
//         {
//           contents: [
//             {
//               parts: [
//                 {
//                   text: `Generate 10 MCQ questions based on: "${description}". 
//                   Return valid JSON only:
//                   {
//                     "questions": [
//                       {
//                         "question": "...",
//                         "options": ["..","..","..",".."],
//                         "correctAnswer": 0,
//                         "explanation": "..."
//                       }
//                     ]
//                   }`,
//                 },
//               ],
//             },
//           ],
//           generationConfig: {
//             temperature: 0.7,
//           },
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "X-goog-api-key": API_KEY,
//           },
//         }
//       );

//       const responseText =
//         response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
//       const jsonMatch = responseText.match(/\{[\s\S]*\}/);
//       if (!jsonMatch) throw new Error("Invalid JSON response from AI");

//       const quizJson = JSON.parse(jsonMatch[0]);
//       const prepared = quizJson.questions.map((q, i) => ({
//         id: `ai-${chapterId}-${i}-${Date.now()}`,
//         question: q.question,
//         options: q.options,
//         correctAnswer: q.correctAnswer,
//         explanation: q.explanation,
//       }));

//       setGeneratedQuestions(prepared);

//       const sliced = getRandomItems(prepared, 5);
//       setDisplayedQuestions(sliced);
//       onQuizGenerated(sliced);
//     } catch (err) {
//       console.error(err);
//       setError("AI service failed. Try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const shuffle = () => {
//     if (!generatedQuestions.length) return;
//     const sliced = getRandomItems(generatedQuestions, 5);
//     setDisplayedQuestions(sliced);
//     onQuizGenerated(sliced);
//   };

//   return (
//     <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
//       <div className="flex justify-between mb-3">
//         <h4 className="text-lg font-semibold text-orange-700 flex items-center gap-2">
//           <Sparkles size={20} /> AI-Generated Quiz
//         </h4>

//         <div className="flex gap-2">
//           {generatedQuestions.length > 5 && (
//             <button
//               onClick={shuffle}
//               disabled={loading}
//               className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//             >
//               Shuffle
//             </button>
//           )}

//           <button
//             onClick={generateQuiz}
//             disabled={loading}
//             className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
//           >
//             {loading ? "Generating..." : "Generate Quiz"}
//           </button>
//         </div>
//       </div>

//       {error && <p className="text-red-600 text-sm">{error}</p>}

//       {displayedQuestions.length > 0 && (
//         <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
//           <p className="text-green-700 text-sm font-medium">
//             {displayedQuestions.length} questions ready!
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// /* ------------------------------------------------------------------ */
// /*  AI CODING CHALLENGE GENERATOR                                    */
// /* ------------------------------------------------------------------ */
// export const AICodingChallengeGenerator = ({ onChallengeGenerated }) => {
//   const [loading, setLoading] = useState(false);
//   const [generated, setGenerated] = useState(false);

//   const generate = async () => {
//     setLoading(true);
//     setGenerated(false);

//     await new Promise((r) => setTimeout(r, 1200)); // Simulated

//     setGenerated(true);
//     onChallengeGenerated(true);
//     setLoading(false);
//   };

//   return (
//     <div className="bg-orange-50 border rounded-xl p-4 mb-4">
//       <div className="flex justify-between mb-3">
//         <h4 className="text-lg font-semibold text-orange-500 flex items-center gap-2">
//           <Cpu size={20} /> AI Coding Challenge
//         </h4>

//         <button
//           onClick={generate}
//           disabled={loading}
//           className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
//         >
//           {loading ? "Generating..." : "Start Challenge"}
//         </button>
//       </div>

//       {generated && (
//         <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
//           <p className="text-green-700 text-sm font-medium">
//             Challenge ready!
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };





// /src/Components/AI/AIEngine.jsx
import React, { useState } from "react";
import axios from "axios";
import { Sparkles, Cpu } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  UTILITY FUNCTIONS                                                 */
/* ------------------------------------------------------------------ */
const getRandomItems = (arr, count = 5) => {
  if (arr.length <= count) return arr;
  return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
};

/* ------------------------------------------------------------------ */
/*  AI QUIZ GENERATOR                                                 */
/* ------------------------------------------------------------------ */
export const AIQuizGenerator = ({
  chapterDescription,
  videoDescription,
  onQuizGenerated,
  chapterId,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [displayedQuestions, setDisplayedQuestions] = useState([]);

  const generateQuiz = async () => {
    const description = videoDescription || chapterDescription;
    if (!description) {
      setError("No description available to generate quiz.");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedQuestions([]);
    setDisplayedQuestions([]);

    try {
      const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
      const API_URL = import.meta.env.VITE_GEMINIAI_API_KEY;

      if (!API_KEY || !API_URL) {
        throw new Error("AI API key / URL not configured");
      }

      const response = await axios.post(
        API_URL,
        {
          contents: [
            {
              parts: [
                {
                  text: `Generate 10 MCQ questions based on: "${description}". 
                  Requirements:
                  - 10 questions
                  - 4 options per question
                  - correctAnswer as index (0-3)
                  - brief explanation
                  
                  Return valid JSON ONLY:
                  {
                    "questions": [
                      {
                        "question": "...",
                        "options": ["..","..","..",".."],
                        "correctAnswer": 0,
                        "explanation": "..."
                      }
                    ]
                  }`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": API_KEY,
          },
          timeout: 30000,
        }
      );

      const responseText =
        response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid JSON response from AI");

      const quizJson = JSON.parse(jsonMatch[0]);

      if (!quizJson.questions || !Array.isArray(quizJson.questions)) {
        throw new Error("Invalid questions structure from AI");
      }

      const prepared = quizJson.questions.map((q, i) => ({
        id: `ai-${chapterId}-${i}-${Date.now()}`,
        question: q.question || `Question ${i + 1}`,
        options:
          q.options?.length === 4
            ? q.options
            : ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer:
          typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
        explanation: q.explanation || "No explanation provided.",
      }));

      setGeneratedQuestions(prepared);

      const sliced = getRandomItems(prepared, 5);
      setDisplayedQuestions(sliced);
      onQuizGenerated?.(sliced);
    } catch (err) {
      console.error("[AIQuizGenerator] Error:", err);
      setError("AI service failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const shuffle = () => {
    if (!generatedQuestions.length) return;
    const sliced = getRandomItems(generatedQuestions, 5);
    setDisplayedQuestions(sliced);
    onQuizGenerated?.(sliced);
  };

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <h4 className="text-lg font-semibold text-orange-700 flex items-center gap-2">
          <Sparkles size={20} /> AI-Generated Quiz
        </h4>

        <div className="flex gap-2">
          {generatedQuestions.length > 5 && (
            <button
              onClick={shuffle}
              disabled={loading}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
            >
              Shuffle
            </button>
          )}

          <button
            onClick={generateQuiz}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
          >
            {loading ? "Generating..." : "Generate Quiz"}
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      {displayedQuestions.length > 0 && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm font-medium">
            {displayedQuestions.length} questions generated and ready!
          </p>
          <p className="text-green-600 text-xs mt-1">
            Scroll down to answer them in the AI quiz section.
          </p>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  AI CODING CHALLENGE GENERATOR (STUB)                              */
/* ------------------------------------------------------------------ */
export const AICodingChallengeGenerator = ({ onChallengeGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generate = async () => {
    setLoading(true);
    setGenerated(false);

    try {
      // Simulate async generation
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setGenerated(true);
      onChallengeGenerated?.(true);
    } catch (err) {
      console.error("[AICodingChallengeGenerator] Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <h4 className="text-lg font-semibold text-orange-500 flex items-center gap-2">
          <Cpu size={20} /> AI Coding Challenge
        </h4>

        <button
          onClick={generate}
          disabled={loading}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
        >
          {loading ? "Generating..." : "Start Challenge"}
        </button>
      </div>

      {generated && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm font-medium">
            Challenge generated! You can render the coding workspace below.
          </p>
        </div>
      )}
    </div>
  );
};
