// src/Layouts/MainLayout.jsx
import Header from "/src/Layout/Header.jsx";
import Footer from "/src/Layout/Footer.jsx";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { motion } from 'framer-motion';

import Chatbot from '/src/NewHome/Chatbot.jsx';

const MainLayout = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <>
      <Header />
      <Outlet />
      <Footer />

      {/* Chatbot Floating Button */}
      <motion.button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl z-40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          rotate: isChatOpen ? 180 : 0,
          scale: isChatOpen ? 1.1 : [1, 1.05, 1],
        }}
        transition={{
          rotate: { type: 'spring', stiffness: 300, damping: 20 },
          scale: {
            repeat: isChatOpen ? 0 : Infinity,
            duration: 1.5,
            ease: 'easeInOut',
          },
        }}
      >
        {isChatOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </motion.button>

      {/* Chatbot Component */}
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default MainLayout;
