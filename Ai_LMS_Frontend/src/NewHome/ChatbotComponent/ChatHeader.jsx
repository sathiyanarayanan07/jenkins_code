// src/components/Chatbot/ChatHeader.jsx
import { motion } from "framer-motion";
import { FiX, FiChevronUp } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";

const ChatHeader = ({ isMinimized, onToggleMinimize, onClose }) => {
    return (
        <motion.div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 flex items-center justify-between h-14">
            <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <RiRobot2Line className="text-orange-500 text-lg" />
                </div>
                <div>
                    <h3 className="text-white font-semibold text-sm">EduMaster AI</h3>
                    {!isMinimized && (
                        <p className="text-xs text-orange-100">Course Assistant</p>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <motion.button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleMinimize();
                    }}
                    className="text-white hover:text-orange-200"
                >
                    <FiChevronUp
                        className={`h-5 w-5 ${isMinimized ? "rotate-180" : ""}`}
                    />
                </motion.button>
                <motion.button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="text-white hover:text-orange-200"
                >
                    <FiX className="h-5 w-5" />
                </motion.button>
            </div>
        </motion.div>
    );
};

export default ChatHeader;
