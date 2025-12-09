// // /src/Components/AI/AICodingAssignment.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Editor from "@monaco-editor/react";
// import { Cpu, Play, Lightbulb, Loader2 } from "lucide-react";

// const AICodingAssignment = ({
//     chapterId,
//     videoDescription,
//     onComplete
// }) => {
//     const [loading, setLoading] = useState(false);
//     const [problem, setProblem] = useState(null);
//     const [code, setCode] = useState("// Write your solution here");
//     const [output, setOutput] = useState("");
//     const [running, setRunning] = useState(false);

//     const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
//     const AI_URL = import.meta.env.VITE_GEMINIAI_API_KEY;
//     const EXECUTE_URL = import.meta.env.VITE_CODE_EXECUTION_API;
//     // Your backend code runner endpoint

//     /* ------------------------------------------------------------- */
//     /* Generate coding challenges based on video summary              */
//     /* ------------------------------------------------------------- */
//     const generateChallenge = async () => {
//         setLoading(true);
//         setProblem(null);

//         try {
//             const prompt = `
//       Based on the following video lesson description, generate 1 coding challenge.
//       Description: "${videoDescription}"

//       Return JSON ONLY in this format:

//       {
//         "title": "",
//         "difficulty": "Easy/Medium/Hard",
//         "description": "",
//         "examples": [
//             {"input": "", "output": ""}
//         ],
//         "testCases": [
//             {"input": "", "output": ""}
//         ]
//       }
//       `;

//             const res = await axios.post(
//                 AI_URL,
//                 {
//                     contents: [{ parts: [{ text: prompt }] }],
//                     generationConfig: { temperature: 0.4 },
//                 },
//                 {
//                     headers: {
//                         "X-goog-api-key": API_KEY,
//                         "Content-Type": "application/json"
//                     }
//                 }
//             );

//             const text = res?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
//             const json = JSON.parse(text.match(/\{[\s\S]*\}/)[0]);

//             setProblem(json);

//         } catch (err) {
//             console.error("AI Error:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     /* ------------------------------------------------------------- */
//     /* Execute Code via Backend                                      */
//     /* ------------------------------------------------------------- */
//     const runCode = async () => {
//         if (!code.trim()) return;

//         setRunning(true);
//         setOutput("");

//         try {
//             const res = await axios.post(
//                 EXECUTE_URL,
//                 {
//                     language: "python",     // choose dynamically if needed
//                     code,
//                     testCases: problem?.testCases,
//                 }
//             );

//             setOutput(res.data.output ?? "No output received.");

//             if (res.data.allPassed) {
//                 onComplete?.(true);
//             }

//         } catch (err) {
//             setOutput(err.response?.data || "Execution error.");
//         } finally {
//             setRunning(false);
//         }
//     };

//     /* Auto-load assignment */
//     useEffect(() => {
//         generateChallenge();
//     }, [chapterId]);

//     return (
//         <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">

//             {/* Header */}
//             <div className="flex items-center gap-2 mb-4">
//                 <Cpu className="text-orange-500" />
//                 <h2 className="text-xl sm:text-2xl font-bold text-orange-600">
//                     Coding Assignment
//                 </h2>
//             </div>

//             {/* Loader */}
//             {loading && (
//                 <div className="flex items-center gap-3 text-orange-500 text-sm">
//                     <Loader2 className="animate-spin" />
//                     Generating coding problem…
//                 </div>
//             )}

//             {/* Problem Content */}
//             {problem && (
//                 <>
//                     <div className="mb-4">
//                         <h3 className="font-bold text-lg">{problem.title}</h3>
//                         <span className="px-2 py-1 text-xs bg-orange-100 rounded">
//                             {problem.difficulty}
//                         </span>
//                         <p className="mt-2 text-gray-700 whitespace-pre-wrap">
//                             {problem.description}
//                         </p>
//                     </div>

//                     {/* Examples */}
//                     <div className="bg-gray-50 p-3 rounded-lg border mb-4">
//                         <h4 className="font-semibold mb-2 flex items-center gap-1">
//                             <Lightbulb size={16} /> Examples
//                         </h4>

//                         {problem.examples.map((ex, i) => (
//                             <pre key={i} className="text-xs bg-white p-2 rounded border mb-2">
//                                 Input:
//                                 {ex.input}

//                                 Output:
//                                 {ex.output}
//                             </pre>
//                         ))}
//                     </div>

//                     {/* Code Editor */}
//                     <div className="border rounded-xl overflow-hidden mb-4">
//                         <Editor
//                             height="300px"
//                             defaultLanguage="python"
//                             theme="vs-dark"
//                             value={code}
//                             onChange={setCode}
//                         />
//                     </div>

//                     {/* Run Button */}
//                     <button
//                         onClick={runCode}
//                         disabled={running}
//                         className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
//                     >
//                         {running ? <Loader2 className="animate-spin" /> : <Play />}
//                         Run Code
//                     </button>

//                     {/* Output */}
//                     {output && (
//                         <div className="mt-4 bg-black text-green-400 p-3 rounded-lg text-sm font-mono whitespace-pre-wrap">
//                             {output}
//                         </div>
//                     )}
//                 </>
//             )}
//         </div>
//     );
// };

// export default AICodingAssignment;








import React, { useEffect, useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import {
  Cpu,
  Play,
  Lightbulb,
  Loader2,
  BookText,
  FileCode,
} from "lucide-react";

const AICodingAssignment = ({
  chapterId,
  videoDescription,
  onComplete
}) => {
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [problem, setProblem] = useState(null);
  const [caseStudy, setCaseStudy] = useState(null);
  const [code, setCode] = useState("// Write your solution here…");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  const AI_URL = import.meta.env.VITE_GEMINIAI_API_KEY;
  const EXECUTE_URL = import.meta.env.VITE_CODE_EXECUTION_API;

  /* ------------------------------------------------------------- */
  /* Generate Coding Challenge (Triggered by button)               */
  /* ------------------------------------------------------------- */
  const generateChallenge = async () => {
    setLoading(true);
    setProblem(null);
    setCaseStudy(null);

    try {
      const prompt = `
Based on the following video lesson description, generate:

1️⃣ One coding challenge  
2️⃣ One case-study scenario  
3️⃣ Test cases for auto evaluation  

DESCRIPTION:
"${videoDescription}"

------------------------------------------
Return VALID JSON ONLY in this format:
{
  "challenge": {
    "title": "",
    "difficulty": "",
    "description": "",
    "examples": [
      {"input": "", "output": ""}
    ],
    "testCases": [
      {"input": "", "output": ""}
    ]
  },
  "caseStudy": {
    "scenario": "",
    "tasks": [
      "task description 1",
      "task description 2"
    ],
    "expectedOutcome": ""
  }
}
------------------------------------------
`;

      const res = await axios.post(
        AI_URL,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.5 },
        },
        {
          headers: {
            "X-goog-api-key": API_KEY,
            "Content-Type": "application/json"
          }
        }
      );

      const responseText =
        res?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      const json = JSON.parse(responseText.match(/\{[\s\S]*\}/)[0]);

      setProblem(json.challenge);
      setCaseStudy(json.caseStudy);

    } catch (err) {
      console.error("AI Assignment Error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------- */
  /* Execute Code                                                  */
  /* ------------------------------------------------------------- */
  const runCode = async () => {
    if (!code.trim()) return;

    setRunning(true);
    setOutput("");

    try {
      const res = await axios.post(EXECUTE_URL, {
        language: "python",
        code,
        testCases: problem?.testCases,
      });

      setOutput(res.data.output ?? "No output received.");

      if (res.data.allPassed) {
        onComplete?.(true);
      }
    } catch (err) {
      setOutput(err.response?.data || "Execution error.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="text-orange-500" />
        <h2 className="text-xl sm:text-2xl font-bold text-orange-600">
          Coding Assignment
        </h2>
      </div>

      {/* Start Button (before challenge loads) */}
      {!started && (
        <button
          onClick={() => {
            setStarted(true);
            generateChallenge();
          }}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
        >
          <FileCode size={18} />
          Start Coding Assignment
        </button>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center gap-3 text-orange-500 text-sm mt-4">
          <Loader2 className="animate-spin" />
          Generating coding challenge…
        </div>
      )}

      {/* Challenge Content */}
      {started && !loading && problem && (
        <>
          {/* Coding Challenge */}
          <div className="mb-4">
            <h3 className="font-bold text-lg">{problem.title}</h3>
            <span className="px-2 py-1 text-xs bg-orange-100 rounded">
              {problem.difficulty}
            </span>
            <p className="mt-2 text-gray-700 whitespace-pre-wrap">
              {problem.description}
            </p>
          </div>

          {/* Examples */}
          <div className="bg-gray-50 p-3 rounded-lg border mb-4">
            <h4 className="font-semibold mb-2 flex items-center gap-1">
              <Lightbulb size={16} /> Examples
            </h4>

            {problem.examples.map((ex, i) => (
              <pre
                key={i}
                className="text-xs bg-white p-2 rounded border mb-2"
              >
{`Input: ${ex.input}
Output: ${ex.output}`}
              </pre>
            ))}
          </div>

          {/* Case Study Section */}
          {caseStudy && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
              <h4 className="font-semibold flex items-center gap-2 text-blue-700">
                <BookText size={18} /> Case Study
              </h4>

              <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                {caseStudy.scenario}
              </p>

              <ul className="list-disc ml-4 mt-3 text-gray-800 text-sm">
                {caseStudy.tasks.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>

              <p className="text-sm mt-3 text-blue-600 font-medium">
                Expected Outcome: {caseStudy.expectedOutcome}
              </p>
            </div>
          )}

          {/* Code Editor */}
          <div className="border rounded-xl overflow-hidden mb-4">
            <Editor
              height="300px"
              language="python"
              theme="vs-dark"
              value={code}
              onChange={setCode}
            />
          </div>

          {/* Run Button */}
          <button
            onClick={runCode}
            disabled={running}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            {running ? <Loader2 className="animate-spin" /> : <Play />}
            Run Code
          </button>

          {/* Output */}
          {output && (
            <div className="mt-4 bg-black text-green-400 p-3 rounded-lg text-sm font-mono whitespace-pre-wrap">
              {output}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AICodingAssignment;
