// src/components/Chatbot/QuizModal.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";

const QuizModal = ({ onClose, onFinish }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({
        q1: "",
        q2: "",
        q3: "",
        q4: "",
        q5: "",
        q6: "",
        q7: "",
        q8: "",
        q9: "",
        q10: "",
    });

    const getDynamicQuestions = () => {
        const q1 = answers.q1;

        const baseQuestions = [
            {
                id: "q1",
                question: "What is your current education / skill level?",
                type: "radio",
                options: ["Student", "Graduate", "Working Professional", "Self-Learner"],
            },
            {
                id: "q2",
                question: "How comfortable are you with computers?",
                type: "radio",
                options: ["Not comfortable", "Basic level", "Intermediate", "Advanced"],
            },
            {
                id: "q3",
                question: "Which area interests you the most?",
                type: "radio",
                options: [
                    "Programming",
                    "Web Development",
                    "Cyber Security",
                    "AI & ML",
                    "UI/UX",
                    "Business",
                ],
            },
        ];

        if (q1 === "Student") {
            return [
                ...baseQuestions,
                {
                    id: "q4",
                    question: "What is your department/major?",
                    type: "radio",
                    options: ["CSE", "ECE", "EEE", "IT", "Mechanical", "Civil", "Other"],
                },
                {
                    id: "q5",
                    question: "Are you looking for internships?",
                    type: "radio",
                    options: ["Yes", "Maybe", "No"],
                },
                {
                    id: "q6",
                    question: "What is your coding level?",
                    type: "radio",
                    options: ["Beginner", "Intermediate", "Advanced"],
                },
                {
                    id: "q7",
                    question: "How many hours weekly can you learn?",
                    type: "radio",
                    options: ["2 hours", "5 hours", "10 hours", "15+ hours"],
                },
                {
                    id: "q8",
                    question: "Are you preparing for placements?",
                    type: "radio",
                    options: ["Yes", "No"],
                },
            ];
        }

        if (q1 === "Working Professional") {
            return [
                ...baseQuestions,
                {
                    id: "q4",
                    question: "What is your current job role?",
                    type: "radio",
                    options: ["IT", "Non-IT", "Business", "Fresher"],
                },
                {
                    id: "q6",
                    question: "How many hours weekly can you spend?",
                    type: "radio",
                    options: ["3 hours", "5 hours", "8 hours", "10+ hours"],
                },
                {
                    id: "q7",
                    question: "Which learning style do you prefer?",
                    type: "radio",
                    options: ["Fast-track", "In-depth", "Project-based"],
                },
                {
                    id: "q8",
                    question: "Your goal:",
                    type: "radio",
                    options: ["Promotion", "Career shift", "Freelance", "Skill upgrade"],
                },
            ];
        }

        // Default for Graduate / Self-Learner
        return [
            ...baseQuestions,
            {
                id: "q4",
                question: "What motivates you to learn?",
                type: "radio",
                options: ["Career", "Passion", "Money", "Growth"],
            },
            {
                id: "q5",
                question: "How consistent are you in learning?",
                type: "radio",
                options: ["Daily", "Weekly", "Rarely"],
            },
            {
                id: "q6",
                question: "Do you prefer structured courses?",
                type: "radio",
                options: ["Yes", "No"],
            },
            {
                id: "q7",
                question: "How many hours weekly can you commit?",
                type: "radio",
                options: ["2", "5", "10", "15"],
            },
            {
                id: "q8",
                question: "Do you enjoy project-based learning?",
                type: "radio",
                options: ["Yes", "Sometimes", "No"],
            },
        ];
    };

    const questions = getDynamicQuestions();
    const current = questions[step];

    const update = (value) => {
        setAnswers((prev) => ({ ...prev, [current.id]: value }));
    };

    const next = () => {
        if (!answers[current.id]) return;

        if (step === questions.length - 1) {
            onFinish(answers);
            onClose();
        } else {
            setStep((prev) => prev + 1);
        }
    };

    const back = () => {
        if (step === 0) return;
        setStep((prev) => prev - 1);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="
          relative bg-white/95 backdrop-blur-xl
          w-[97%] max-w-3xl 
          h-[80vh]
          overflow-hidden
          rounded-3xl p-8
          shadow-[0_10px_40px_rgba(0,0,0,0.30)]
          border border-white/40
        "
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">
                        Career Skill Test — Step {step + 1} of {questions.length}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <FiX className="text-2xl" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto h-[56vh] pr-2">
                    <p className="text-gray-700 text-lg mb-4">{current.question}</p>

                    <div className="space-y-3">
                        {current.type === "radio" &&
                            current.options.map((opt) => (
                                <label
                                    key={opt}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-gray-300 hover:bg-orange-50 transition cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name={current.id}
                                        checked={answers[current.id] === opt}
                                        onChange={() => update(opt)}
                                        className="h-4 w-4 accent-orange-500"
                                    />
                                    <span className="text-gray-800">{opt}</span>
                                </label>
                            ))}
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-5 flex justify-between items-center">
                    <button
                        onClick={back}
                        className="px-5 py-2 bg-gray-200 rounded-xl text-gray-800 hover:bg-gray-300"
                    >
                        Back
                    </button>
                    <button
                        onClick={next}
                        disabled={!answers[current.id]}
                        className="px-8 py-3 rounded-xl text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90 shadow-md disabled:opacity-40"
                    >
                        {step === questions.length - 1 ? "Submit" : "Next"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default QuizModal;
