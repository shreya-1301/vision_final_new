import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import try2 from '../../public/try2.svg';

const ChatInput = ({ 
  isDarkMode, 
  isMobile, 
  inputValue, 
  setInputValue, 
  isLoading, 
  sendMessage 
}) => {
  const textareaRef = useRef(null);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 100);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  // Reset textarea height when inputValue is empty (new chat)
  useEffect(() => {
    adjustTextareaHeight();
    if (inputValue === '') {
      if (textareaRef.current) {
        textareaRef.current.style.height = '30px';
      }
    }
  }, [inputValue]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`${isMobile ? `fixed pb-5 bottom-0 mb-[10px] left-0 right-0 z-50 ${isDarkMode ? 'bg-neutral-950' : 'bg-[#F9F9F9]'} shadow-md input-container` : `pt-3 mb-3 relative bg-transparent w-full z-10 input-container`}`}>
      <div className="relative max-w-3xl   mx-auto">
        {/* Wrapper with gradient border effect */}
        <div className="pt-[2px] px-[2px] rounded-[28px] shadow-2xl shadow-gray-500/25  bg-gradient-to-b border-b-0 border-[2px] border-white from-gray-950/10 via-transparent to-transparent">
          {/* Main input container */}
          <div className="relative  flex bg-gradient-to-b from-white via-gray-100 to-transparent flex-col justify-end rounded-[26px] overflow-hidden">
            {/* Textarea Container */}
            <div className="flex items-end w-full">
              <div className="flex-grow px-4 pb-2 pt-3">
                <textarea
                  ref={textareaRef}
                  className={`w-full ml-2 resize-none outline-none ${isDarkMode ? 'bg-neutral-800 text-white placeholder-neutral-400' : ' text-gray-800 placeholder-gray-500'} text-base overflow-y-auto`}
                  style={{
                    minHeight: "30px",
                    maxHeight: "100px",
                    height: "30px",
                    fontSize: "16px",
                    lineHeight: "1.5",
                  }}
                  rows="1"
                  placeholder="Ask anything"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    adjustTextareaHeight();
                  }}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>
            
            {/* Bottom Row with Plus Button */}
            <div className={`px-2 pb-2 flex justify-start items-center`}>
              <button className={`p-2 ml-1 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700'}`}>
                  <img src={try2} alt="try" className='w-8 h-4' />
              </button>
              {/* <button className={`p-2 ml-1 border cursor-pointer border-gray-200 rounded-full hover:bg-gray-200 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700'}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button> */}
             
             
             
              {/* Send Button */}
              <motion.button
                className={`absolute right-3 bottom-3 rounded-full ${inputValue.trim() === "" || isLoading ? 'bg-gray-300 text-white' : 'bg-[#283A78] text-white hover:bg-gray-800'}`}
                whileHover={inputValue.trim() !== "" && !isLoading ? { scale: 1 } : {}}
                whileTap={inputValue.trim() !== "" && !isLoading ? { scale: 0.95 } : {}}
                onClick={() => {
                  sendMessage();
                  if (textareaRef.current) {
                    textareaRef.current.style.height = '30px';
                  }
                }}
                disabled={inputValue.trim() === "" || isLoading}
                aria-label="Send message"
              >
                {isLoading ? (
                  <div className="w-10 h-10 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="w-9 h-9 flex justify-center items-center">
                    <svg width="18" height="18" className="" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5L12 19M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput; 