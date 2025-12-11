import React, { useState, useEffect, useContext } from "react";
import AceEditor from "react-ace";
import { ChallengeContext } from "/src/App";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

const API_URL = import.meta.env.VITE_GEMINIAI_API_URL;
const API_KEY = import.meta.env.VITE_GEM_API_KEY;

// Utility function
const deepEqual = (a, b) => {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
};

// AI Evaluation Function
const evaluateCodeWithAI = async (question, userCode, language) => {
  try {
    const prompt = {
      contents: [{
        parts: [{
          text: `You are a precise code evaluator. Evaluate the following ${language} code against the problem.

PROBLEM DETAILS:
- Title: ${question.title}
- Description: ${question.description}
- Function Name: ${question.functionName}
- Language: ${language}
- Difficulty: ${question.difficulty || "Not specified"}

TEST CASES:
${JSON.stringify(question.tests, null, 2)}

${question.schema ? `DATABASE SCHEMA (for SQL):\n${question.schema}` : ''}

INSTRUCTIONS:
${question.instructions}

USER'S SUBMITTED CODE:
\`\`\`${language}
${userCode}
\`\`\`

EVALUATION INSTRUCTIONS:
1. Analyze the code for syntax and logical correctness
2. For each test case, mentally execute the code with the given input
3. Compare the expected output vs what the code would actually produce
4. Check for edge cases and error handling
5. Provide specific, constructive feedback

RETURN FORMAT (JSON only):
{
  "overallPassed": boolean,
  "score": number (0-100),
  "testResults": [
    {
      "testCase": number,
      "input": array,
      "expected": any,
      "actual": any,
      "passed": boolean,
      "error": string (if any, else null),
      "feedback": string
    }
  ],
  "feedback": {
    "summary": string,
    "strengths": [string],
    "improvements": [string],
    "hints": [string]
  },
  "correctSolution": "${language === 'python' ? 'def solution(...):' : '-- SQL solution'} (only show if user failed)"
}

BE STRICT BUT FAIR. If code has syntax errors, mark all tests as failed.`
        }]
      }]
    };

    console.log("Sending to AI for evaluation...");
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prompt),
    });

    if (!response.ok) {
      throw new Error(`API evaluation failed: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("AI response:", responseText);
      throw new Error('Invalid JSON response from AI evaluator');
    }
    
    const result = JSON.parse(jsonMatch[0]);
    console.log("AI Evaluation Result:", result);
    return result;
    
  } catch (error) {
    console.error('Error in AI evaluation:', error);
    // Return a fallback evaluation
    return {
      overallPassed: false,
      score: 0,
      testResults: [],
      feedback: {
        summary: "Evaluation failed. Please try again.",
        strengths: [],
        improvements: ["AI evaluation service is temporarily unavailable"],
        hints: ["Check your internet connection and try again"]
      }
    };
  }
};

// Generate AI Question
const generateAICodingQuestion = async (language, difficulty) => {
  try {
    const prompt = {
      contents: [{
        parts: [{
          text: `Generate a ${difficulty} level ${language} coding challenge.

IMPORTANT: Return ONLY valid JSON in this exact format:
{
  "title": "Challenge Title",
  "description": "Problem description",
  "functionName": "${language === 'python' ? 'function_name' : 'query_name'}",
  "template": "${language === 'python' ? 'def function_name(param):\\n    # Your code here\\n    pass' : '-- Write your SQL query here'}",
  "tests": [
    {"input": [value1], "expected": expected1},
    {"input": [value2], "expected": expected2},
    {"input": [value3], "expected": expected3}
  ],
  "instructions": "Step-by-step guide",
  "schema": ${language === 'sql' ? `"CREATE TABLE ..."` : 'null'},
  "difficulty": "${difficulty}",
  "referenceSolution": "${language === 'python' ? 'def solution(param):\\n    return result' : 'SELECT * FROM solution'}",
  "evaluationCriteria": ["correctness", "efficiency", "readability"]
}

Requirements:
- Difficulty: ${difficulty}
- Language: ${language}
- Include 3 test cases with clear inputs and expected outputs
- Make it educational and practical
- Provide a reference solution for the evaluator
- For SQL, include relevant table schema`
        }]
      }]
    };

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prompt),
    });

    if (!response.ok) {
      throw new Error(`Question generation failed: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response from AI');
    }
    
    const questionData = JSON.parse(jsonMatch[0]);
    
    // Validate required fields
    if (!questionData.title || !questionData.tests || !questionData.functionName) {
      throw new Error('Invalid question structure');
    }
    
    return questionData;
    
  } catch (error) {
    console.error('Error generating question:', error);
    // Return fallback question
    return getFallbackQuestion(language, difficulty);
  }
};

// Fallback questions
const getFallbackQuestion = (lang, diff) => {
  const fallbacks = {
    python: {
      beginner: {
        title: "Calculate Square of a Number",
        description: "Write a function that takes an integer and returns its square.",
        functionName: "square_number",
        template: "def square_number(n):\n    # Your code here\n    pass",
        tests: [
          { input: [4], expected: 16 },
          { input: [7], expected: 49 },
          { input: [-3], expected: 9 }
        ],
        instructions: "1. Define a function square_number with one parameter n\n2. Calculate n * n\n3. Return the result",
        schema: null,
        difficulty: "beginner",
        referenceSolution: "def square_number(n):\n    return n * n",
        evaluationCriteria: ["correctness", "simplicity"]
      },
      intermediate: {
        title: "Find Maximum in List",
        description: "Write a function that finds the maximum value in a list of numbers.",
        functionName: "find_max",
        template: "def find_max(numbers):\n    # Your code here\n    pass",
        tests: [
          { input: [[1, 5, 3, 9, 2]], expected: 9 },
          { input: [[-1, -5, -3]], expected: -1 },
          { input: [[10]], expected: 10 }
        ],
        instructions: "1. Handle empty list case\n2. Iterate through the list\n3. Keep track of maximum value",
        schema: null,
        difficulty: "intermediate",
        referenceSolution: "def find_max(numbers):\n    if not numbers:\n        return None\n    max_val = numbers[0]\n    for num in numbers:\n        if num > max_val:\n            max_val = num\n    return max_val",
        evaluationCriteria: ["correctness", "edge cases", "efficiency"]
      }
    },
    sql: {
      beginner: {
        title: "Select All Employees",
        description: "Write a SQL query to select all columns from the employees table.",
        functionName: "select_all_employees",
        template: "-- Write your SQL query here",
        tests: [
          { input: [], expected: [
            { id: 1, name: 'John Doe', department: 'IT', salary: 50000 },
            { id: 2, name: 'Jane Smith', department: 'HR', salary: 45000 }
          ]}
        ],
        instructions: "1. Use SELECT statement\n2. Specify all columns with *\n3. Use FROM clause for employees table",
        schema: "CREATE TABLE employees (\n  id INT PRIMARY KEY,\n  name VARCHAR(100),\n  department VARCHAR(50),\n  salary DECIMAL(10,2)\n);",
        difficulty: "beginner",
        referenceSolution: "SELECT * FROM employees;",
        evaluationCriteria: ["syntax", "correctness", "completeness"]
      }
    }
  };

  return fallbacks[lang]?.[diff] || fallbacks.python.beginner;
};

// SQL-specific components
const DatabaseSchemaView = ({ schema }) => {
  if (!schema) return null;
  
  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
        Database Schema
      </h4>
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
        <pre className="whitespace-pre-wrap">{schema}</pre>
      </div>
    </div>
  );
};

const QueryResultTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        No data returned
      </div>
    );
  }

  if (typeof data === 'number' || typeof data === 'string') {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm font-medium text-gray-700">Result:</div>
        <div className="font-mono text-lg mt-1">{data}</div>
      </div>
    );
  }

  if (typeof data === 'object' && !Array.isArray(data)) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Object.keys(data).map((key) => (
                <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase border-b">
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {Object.values(data).map((value, index) => (
                <td key={index} className="px-4 py-2 text-sm border-b">
                  {JSON.stringify(value)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  const columns = Object.keys(data[0] || {});
  
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th 
                key={column} 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td 
                  key={column} 
                  className="px-4 py-3 text-sm text-gray-900 border-b"
                >
                  {row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TestCaseItem = ({ test, index, language, showResults, testResult }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left"
      >
        <div className="flex items-center space-x-3">
          <div className={`w-2 h-2 rounded-full ${isExpanded ? 'bg-orange-500' : 'bg-gray-400'}`}></div>
          <span className="text-sm font-medium text-gray-900">
            Test Case {index + 1}
            {showResults && testResult && (
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${testResult.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {testResult.passed ? '✓ Passed' : '✗ Failed'}
              </span>
            )}
          </span>
        </div>
        <div className="text-gray-500">
          {isExpanded ? '▼' : '▶'}
        </div>
      </button>
      
      {isExpanded && (
        <div className="p-4 bg-white border-t border-gray-200">
          {showResults && testResult ? (
            // Show AI evaluation results
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-2">AI Evaluation:</h5>
                <div className={`p-3 rounded-lg ${testResult.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Status: {testResult.passed ? 'PASSED' : 'FAILED'}</span>
                    <span className={`text-sm font-semibold ${testResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {testResult.passed ? '✓' : '✗'}
                    </span>
                  </div>
                  
                  {testResult.input && testResult.input.length > 0 && (
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700">Input: </span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {JSON.stringify(testResult.input)}
                      </code>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Expected:</span>
                      <div className="mt-1 text-sm bg-gray-50 p-2 rounded">
                        {JSON.stringify(testResult.expected)}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Actual:</span>
                      <div className="mt-1 text-sm bg-gray-50 p-2 rounded">
                        {testResult.error ? testResult.error : JSON.stringify(testResult.actual)}
                      </div>
                    </div>
                  </div>
                  
                  {testResult.feedback && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-100 rounded">
                      <span className="text-sm font-medium text-amber-700">Feedback:</span>
                      <p className="text-sm text-amber-600 mt-1">{testResult.feedback}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Original test case details */}
              <div className="pt-4 border-t border-gray-200">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Original Test Case:</h5>
                <div className="space-y-2 text-sm">
                  {test.input && test.input.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">Input: </span>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {JSON.stringify(test.input)}
                      </code>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-700">Expected: </span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {JSON.stringify(test.expected)}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Show only original test case (before evaluation)
            <div className="space-y-2 text-sm">
              {test.input && test.input.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Input: </span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {JSON.stringify(test.input)}
                  </code>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700">Expected: </span>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {JSON.stringify(test.expected)}
                </code>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const FeedbackSection = ({ feedback, overallPassed, score }) => {
  if (!feedback) return null;

  return (
    <div className="mt-6">
      {/* Score Summary */}
      <div className={`p-4 rounded-lg mb-4 ${overallPassed ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-lg font-bold text-gray-900">AI Evaluation Complete!</h4>
            <p className={`text-sm ${overallPassed ? 'text-green-700' : 'text-orange-700'}`}>
              {overallPassed ? '🎉 All tests passed!' : '📝 Some tests need improvement.'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">{score}%</div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
        </div>
      </div>

      {/* Overall Feedback */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
          AI Feedback
        </h4>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="mb-4">
            <h5 className="font-medium text-gray-800 mb-1">Summary:</h5>
            <p className="text-gray-700">{feedback.summary}</p>
          </div>
          
          {feedback.strengths && feedback.strengths.length > 0 && (
            <div className="mb-4">
              <h5 className="font-medium text-green-700 mb-1">Strengths:</h5>
              <ul className="list-disc pl-5 text-green-600">
                {feedback.strengths.map((strength, idx) => (
                  <li key={idx} className="mb-1">{strength}</li>
                ))}
              </ul>
            </div>
          )}
          
          {feedback.improvements && feedback.improvements.length > 0 && (
            <div className="mb-4">
              <h5 className="font-medium text-amber-700 mb-1">Areas for Improvement:</h5>
              <ul className="list-disc pl-5 text-amber-600">
                {feedback.improvements.map((improvement, idx) => (
                  <li key={idx} className="mb-1">{improvement}</li>
                ))}
              </ul>
            </div>
          )}
          
          {feedback.hints && feedback.hints.length > 0 && (
            <div>
              <h5 className="font-medium text-purple-700 mb-1">Hints:</h5>
              <ul className="list-disc pl-5 text-purple-600">
                {feedback.hints.map((hint, idx) => (
                  <li key={idx} className="mb-1">{hint}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AICodingChallenge({ onComplete }) {
  const { challengeName, setChallengeName, setChallengeScore } = useContext(ChallengeContext);

  // UI state
  const [inputName, setInputName] = useState(challengeName || "");
  const [showStart, setShowStart] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [code, setCode] = useState("");
  const [outputLog, setOutputLog] = useState([]);
  const [lastRunPassed, setLastRunPassed] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [language, setLanguage] = useState("python");
  const [difficulty, setDifficulty] = useState("beginner");
  const [aiFeedback, setAiFeedback] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [showTestResults, setShowTestResults] = useState(false);

  useEffect(() => {
    if (questions.length > 0) {
      setCurrentQuestion(questions[currentQuestionIndex]);
      setCode(questions[currentQuestionIndex]?.template || "");
      setOutputLog([]);
      setAiFeedback(null);
      setTestResults([]);
      setShowTestResults(false);
    }
  }, [questions, currentQuestionIndex]);

  const handleStart = async () => {
    if (!inputName || inputName.trim().length < 2) {
      alert("Please enter a valid name (min 2 chars).");
      return;
    }

    const trimmed = inputName.trim();
    localStorage.setItem("challengeName", trimmed);
    setChallengeName?.(trimmed);
    
    setLoading(true);
    try {
      const questionPromises = Array(3).fill().map(() => 
        generateAICodingQuestion(language, difficulty)
      );
      
      const generatedQuestions = await Promise.all(questionPromises);
      setQuestions(generatedQuestions);
      setShowStart(false);
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Failed to generate questions. Using fallback questions.');
      const fallbackQuestions = [
        getFallbackQuestion(language, difficulty),
        getFallbackQuestion(language, 'intermediate'),
        getFallbackQuestion(language, 'advanced')
      ];
      setQuestions(fallbackQuestions);
      setShowStart(false);
    } finally {
      setLoading(false);
    }
  };

  const runTests = async () => {
    if (!currentQuestion) return;

    setLoading(true);
    setShowTestResults(false); // Hide results while loading
    
    try {
      // Send both question and user's code to AI for evaluation
      const evaluation = await evaluateCodeWithAI(
        currentQuestion,
        code,
        language
      );

      console.log("AI Evaluation received:", evaluation);

      // Calculate score
      const passedCount = evaluation.testResults.filter(t => t.passed).length;
      const totalTests = evaluation.testResults.length;
      const questionScore = Math.round((passedCount / totalTests) * 100);
      
      setScore(prev => Math.max(prev, questionScore));
      setChallengeScore?.(questionScore);
      setLastRunPassed(evaluation.overallPassed);
      setAiFeedback(evaluation.feedback);
      setTestResults(evaluation.testResults);
      
      // Show test results in the left panel
      setShowTestResults(true);
      
      // Format output log for right panel
      const results = evaluation.testResults.map((test, index) => ({
        index: index + 1,
        input: test.input,
        expected: test.expected,
        actual: test.actual,
        passed: test.passed,
        error: test.error,
        feedback: test.feedback
      }));
      
      setOutputLog(results);

    } catch (error) {
      console.error('Evaluation error:', error);
      setOutputLog([{ 
        type: "error", 
        message: `Evaluation Error: ${error.message}. Please try again.` 
      }]);
      setLastRunPassed(false);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (!lastRunPassed) {
      alert("Please pass all tests before proceeding to the next question!");
      return;
    }

    setCurrentQuestionIndex(prev => {
      const next = prev + 1;
      if (next >= questions.length) {
        setCompleted(true);
        setChallengeScore?.(score);
      }
      return Math.min(next, questions.length - 1);
    });
    setOutputLog([]);
    setLastRunPassed(false);
    setAiFeedback(null);
    setTestResults([]);
    setShowTestResults(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTryAgain = () => {
    setCode(currentQuestion?.template || "");
    setOutputLog([]);
    setLastRunPassed(false);
    setAiFeedback(null);
    setTestResults([]);
    setShowTestResults(false);
  };

  const handleFinish = () => {
    setCompleted(true);
    setChallengeScore?.(score);
    onComplete?.(score);
  };

  const renderResultRow = (r) => {
    if (r.type === "error") {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 text-red-700">
            <span>⚠</span>
            <span className="font-medium">{r.message}</span>
          </div>
        </div>
      );
    }

    return (
      <div
        key={r.index}
        className={`p-4 rounded-lg border-2 ${
          r.passed 
            ? "bg-green-50 border-green-200" 
            : "bg-red-50 border-red-200"
        }`}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${r.passed ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div className="text-sm font-semibold">
              {`Test ${r.index} — ${r.passed ? "Passed" : "Failed"}`}
            </div>
          </div>
          <div className={`text-sm font-medium ${r.passed ? "text-green-600" : "text-red-600"}`}>
            {r.passed ? "✓ PASS" : "✗ FAIL"}
          </div>
        </div>
        
        {language === 'sql' ? (
          <div className="space-y-3">
            <div>
              <div className="text-xs font-medium text-gray-600 mb-1">Expected Result:</div>
              <QueryResultTable data={r.expected} />
            </div>
            <div>
              <div className="text-xs font-medium text-gray-600 mb-1">Your Result:</div>
              <QueryResultTable data={r.actual} />
            </div>
          </div>
        ) : (
          <div className="text-sm space-y-2">
            {r.input && r.input.length > 0 && (
              <div>
                <span className="font-medium text-gray-700">Input: </span>
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {JSON.stringify(r.input)}
                </code>
              </div>
            )}
            <div>
              <span className="font-medium text-gray-700">Expected: </span>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                {JSON.stringify(r.expected)}
              </code>
            </div>
            <div>
              <span className="font-medium text-gray-700">Actual: </span>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                {r.error ? r.error : JSON.stringify(r.actual)}
              </code>
            </div>
            {r.feedback && (
              <div>
                <span className="font-medium text-amber-700">AI Feedback: </span>
                <span className="text-amber-600">{r.feedback}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading && showStart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 font-medium">Generating AI-powered coding challenges...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                {language === 'sql' ? 'SQL' : 'Python'} AI Challenge
              </h1>
            </div>
            {!showStart && !completed && (
              <div className="flex items-center space-x-6">
                <div className="text-sm text-gray-600">
                  Question <span className="font-bold text-orange-600">{currentQuestionIndex + 1}</span> of <span className="font-bold">{questions.length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {showStart ? (
          // Start Screen
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🚀</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                AI-Powered Code Evaluation
              </h2>
              <p className="text-gray-600 mb-8">
                Write code. AI evaluates it instantly with detailed feedback.
              </p>
              
              <div className="space-y-6 max-w-md mx-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    >
                      <option value="python">Python</option>
                      <option value="sql">SQL</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      Difficulty
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={handleStart}
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Starting..." : "Start Challenge"}
                </button>
              </div>
              
              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">AI</div>
                  <div className="text-sm text-gray-600">Evaluation</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">Real</div>
                  <div className="text-sm text-gray-600">Feedback</div>
                </div>
              </div>
            </div>
          </div>
        ) : completed ? (
          // Completion Screen
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🏆</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Challenge Complete!
              </h2>
              <p className="text-gray-600 mb-2">
                Excellent work, <span className="font-semibold text-orange-600">{inputName}</span>!
              </p>
              <div className="mb-8">
                <div className="text-5xl font-bold text-orange-600 my-4">{score}%</div>
                <div className="text-gray-600">Final Score</div>
              </div>
              
              <button
                onClick={() => onComplete?.(score)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                View Leaderboard
              </button>
            </div>
          </div>
        ) : currentQuestion ? (
          // Main Challenge Interface
          <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
            {/* Left: Problem Statement */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {currentQuestion.title}
                      </h3>
                      <div className="flex gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {language.toUpperCase()}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {currentQuestion.difficulty || difficulty}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Problem Content */}
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 leading-relaxed">
                          {currentQuestion.description}
                        </p>
                      </div>
                    </div>

                    {/* Database Schema for SQL */}
                    {language === 'sql' && (
                      <DatabaseSchemaView schema={currentQuestion.schema} />
                    )}

                    {/* Instructions */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h4>
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-700 whitespace-pre-line">
                            {currentQuestion.instructions}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Test Cases or AI Feedback - Dynamic based on evaluation */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {showTestResults ? "AI Evaluation" : "Test Cases"}
                        </h4>
                        {showTestResults && (
                          <div className="flex items-center space-x-2">
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${lastRunPassed ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                              Score: {score}%
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${lastRunPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {lastRunPassed ? 'All Passed' : 'Some Failed'}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {showTestResults ? (
                        // Show ONLY AI Feedback (no test summary or detailed results)
                        <FeedbackSection 
                          feedback={aiFeedback}
                          overallPassed={lastRunPassed}
                          score={score}
                        />
                      ) : (
                        // Show Original Test Cases only
                        <div className="space-y-3">
                          {currentQuestion.tests.map((test, i) => (
                            <TestCaseItem 
                              key={i} 
                              test={test} 
                              index={i} 
                              language={language}
                              showResults={false}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Code Editor and Console */}
            <div className="flex flex-col space-y-6">
              {/* Code Editor */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden flex-1 flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {language === 'python' ? 'Python Editor' : 'SQL Query Editor'}
                  </h4>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500 font-medium">
                      {language === 'python' ? 'Python 3' : 'SQL'}
                    </span>
                    <button
                      onClick={() => setCode(currentQuestion.template)}
                      className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Reset Template
                    </button>
                  </div>
                </div>
                <div className="flex-1 p-2">
                  <AceEditor
                    mode={language}
                    theme="github"
                    name="ai_coding_challenge_editor"
                    value={code}
                    onChange={setCode}
                    width="100%"
                    height="100%"
                    fontSize={14}
                    showPrintMargin={false}
                    setOptions={{
                      enableBasicAutocompletion: true,
                      enableLiveAutocompletion: true,
                      enableSnippets: true,
                      showLineNumbers: true,
                      tabSize: 2,
                      showGutter: true,
                      highlightActiveLine: true,
                      useWorker: language === 'sql'
                    }}
                  />
                </div>
              </div>

              {/* Console and Controls */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="border-b border-gray-200">
                  <div className="flex border-b border-gray-200">
                    <button className="px-6 py-3 border-b-2 border-orange-500 text-orange-600 font-medium text-sm">
                      Console Output
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-3"></div>
                        <p className="text-gray-600">AI is evaluating your code...</p>
                        <p className="text-sm text-gray-500 mt-1">This may take a moment</p>
                      </div>
                    ) : outputLog.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <div className="text-3xl mb-2">🤖</div>
                        <p className="font-medium text-gray-700">Click "Run code" AI Evaluation to test your code</p>
                        <p className="text-sm text-gray-500 mt-1">Detailed feedback will appear on the left</p>
                      </div>
                    ) : (
                      <>
                        {outputLog.map((r, idx) => (
                          <div key={idx}>{renderResultRow(r)}</div>
                        ))}
                      </>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        Current Score: <span className="font-bold text-orange-600">{score}%</span>
                      </div>
                      {lastRunPassed && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <span>✓</span>
                          <span className="text-sm font-medium">Ready for next!</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleTryAgain}
                        className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors duration-200"
                      >
                        Reset Code
                      </button>
                      
                      <button
                        onClick={runTests}
                        disabled={loading}
                        className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                      >
                        {loading ? (
                          <>
                            <span>Evaluating...</span>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          </>
                        ) : (
                          <>
                            <span>Run Code</span>
                            <span>🤖</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={handleNextQuestion}
                        className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center space-x-2"
                      >
                        <span>Next Question</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}