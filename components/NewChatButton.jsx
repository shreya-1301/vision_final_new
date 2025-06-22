import React, { useState } from 'react';
import { motion } from 'framer-motion';

const NewChatButton = ({ onClick, className = "", darkMode = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className={`
        flex items-center w-full hover:cursor-pointer py-3 px-5 rounded-xl 
        ${darkMode 
          ? 'bg-gradient-to-r from-[#283A78]/40 to-[#AD2B1E]/20 border border-[#283A78]/40 text-white hover:from-[#283A78]/50 hover:to-[#AD2B1E]/30 backdrop-blur-sm' 
          : 'bg-white/70 backdrop-blur-sm shadow-sm border border-gray-200/70 text-gray-700 hover:bg-white/90 hover:shadow'
        } transition-all duration-300 text-sm font-medium ${className}
      `}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div 
        className={`flex items-center justify-center w-6 h-6 mr-3 rounded-full ${
          darkMode ? 'bg-[#283A78]/80' : 'bg-[#283A78]'
        }`}
        initial={{ opacity: 1, x: 0 }}
        animate={{ 
          opacity: isHovered ? 0 : 1,
          x: isHovered ? -20 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </motion.div>
      
      <motion.span
        initial={{ x: 0 }}
        animate={{ 
          x: isHovered ? -20 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        New Chat
      </motion.span>
      
      <motion.span 
        className="ml-auto" 
        initial={{ opacity: 0, x: 20 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          x: isHovered ? 0 : 20
        }}
        transition={{ duration: 0.3 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
      </motion.span>
    </motion.button>
  );
};

export default NewChatButton; 