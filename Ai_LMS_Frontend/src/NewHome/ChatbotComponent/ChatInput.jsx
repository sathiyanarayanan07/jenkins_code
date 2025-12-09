// src/components/Chatbot/ChatInput.jsx
import { motion } from "framer-motion";
import { FiSend } from "react-icons/fi";

const ChatInput = ({
    userInput,
    onChange,
    onSend,
    onKeyDown,
    isLoading,
    controls,
}) => {
    return (
        <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Ask about any course..."
                    className="flex-1 p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 text-sm"
                    disabled={isLoading}
                />
                <motion.button
                    onClick={onSend}
                    disabled={isLoading || !userInput.trim()}
                    className={`p-3 rounded-xl ${isLoading || !userInput.trim()
                            ? "bg-gray-200 text-gray-400"
                            : "bg-gradient-to-br from-orange-500 to-orange-600 text-white"
                        }`}
                    animate={controls}
                >
                    <FiSend className="h-5 w-5" />
                </motion.button>
            </div>
        </div>
    );
};

export default ChatInput;
