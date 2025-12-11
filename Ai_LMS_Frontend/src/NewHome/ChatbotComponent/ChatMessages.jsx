// src/components/Chatbot/ChatMessages.jsx
import { motion } from "framer-motion";
import { FiThumbsUp } from "react-icons/fi";
import ReactMarkdown from "react-markdown";

const ChatMessages = ({
    messages,
    isLoading,
    messagesEndRef,
    onReact,
    onOpenQuiz,
    formatTime,
}) => {
    return (
        <div className="flex-1 p-3 overflow-y-auto bg-gradient-to-b from-white to-gray-50">
            {messages.map((msg, i) => (
                <div
                    key={i}
                    className={`mb-3 flex ${msg.type === "user" ? "justify-end" : "justify-start"
                        }`}
                >
                    <div
                        className={`max-w-[85%] rounded-2xl p-2.5 text-sm ${msg.type === "user"
                                ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-br-none"
                                : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                            }`}
                    >
                        <div
                            className={`whitespace-pre-line ${msg.type === "user"
                                    ? "text-white"
                                    : "prose prose-sm max-w-none"
                                }`}
                        >
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>

                        {/* Test Yourself Button */}
                        {msg.showTestButton && (
                            <div className="mt-2">
                                <button
                                    onClick={onOpenQuiz}
                                    className="mt-2 px-5 py-3 bg-orange-500 text-white text-lg rounded-lg hover:bg-orange-600"
                                >
                                    Test Yourself 🎯
                                </button>
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-1">
                            <div
                                className={`text-xs ${msg.type === "user"
                                        ? "text-orange-100"
                                        : "text-gray-500"
                                    }`}
                            >
                                {formatTime(msg.timestamp)}
                            </div>

                            {msg.type === "bot" && (
                                <motion.button
                                    onClick={() => onReact(i)}
                                    className={`ml-2 p-1 rounded-full ${msg.reacted
                                            ? "bg-orange-100 text-orange-600"
                                            : "text-gray-400 hover:text-orange-500"
                                        }`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <FiThumbsUp className="h-3 w-3" />
                                </motion.button>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {isLoading && (
                <div className="flex justify-start mb-4">
                    <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl p-3 shadow-sm">
                        <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessages;
