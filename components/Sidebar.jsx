import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NewChatButton from './NewChatButton';
import RecentConversations from './RecentConversations';
import SearchBar from './SearchBar';

const Sidebar = ({
  isDarkMode,
  isSidebarOpen,
  setSidebarOpen,
  isContentVisible,
  setIsContentVisible,
  isMobile,
  setMessages,
  setInputValue,
  setSelectedCard,
  sidebarWidth,
  Logo
}) => {
  const handleNewChat = () => {
    setMessages([]);
    setInputValue("");
    setSelectedCard(null);
  };

  const sidebarVariants = {
    open: {
      x: 0,
      width: sidebarWidth,
      transition: {
        type: "tween",
        ease: [0.4, 0, 0.2, 1],
        duration: 0.4
      }
    },
    closed: {
      x: isMobile ? -300 : 0,
      width: isMobile ? 0 : "0px",
      transition: {
        type: "tween",
        ease: [0.4, 0, 0.2, 1],
        duration: 0.4
      }
    }
  };

  const contentVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    hidden: {
      opacity: 0,
      y: 10,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <motion.div 
      className={`flex flex-col h-screen pb-5 relative ${isDarkMode 
        ? 'bg-[#1a1f35]/20 backdrop-blur-sm border-r border-neutral-800/30' 
        : 'bg-[#DDE5FF] md:bg-white/20 backdrop-blur-sm border-r border-gray-200/50'
      } ${isMobile ? "fixed left-0 top-0 bottom-0 z-50 shadow-xl" : ""}`}
      layout={false}
      style={{ width: sidebarWidth, position: isMobile ? 'fixed' : 'static' }}
      initial={isMobile ? "closed" : "open"}
      animate={isSidebarOpen ? "open" : "closed"}
      variants={sidebarVariants}
    >
      {!isMobile && (
        <div className="absolute -left-36 -bottom-32 flex flex-col h-[300px] w-[500px] rotate-[40deg] rounded-lg bg-gradient-to-t from-red-500 to-transparent blur-2xl opacity-30"></div>
      )}

      <div className={`w-full py-6 px-5 flex flex-col items-start ${isDarkMode ? 'border-b border-neutral-700/20' : 'border-b border-gray-200/50'}`}>
        <div className="flex w-full items-center justify-center">
          <div className="flex items-end hover:cursor-pointer" onClick={handleNewChat}>
            <Logo width={120} height={120} priority className="object-contain" />
          </div>
          <motion.button
            onClick={() => {
              setSidebarOpen(false);
              setIsContentVisible(false);
            }}
            className={`p-2 absolute right-2 top-2 rounded-full hover:cursor-pointer hover:bg-gray-300 ${isDarkMode ? 'hover:bg-neutral-800/50 text-gray-300' : 'hover:bg-gray-100 text-black'}`}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "tween", duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            <img src="/Close.svg" alt="Open" className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

     
        <div className="px-3 mt-6">
          <NewChatButton
            onClick={handleNewChat}
            className={`w-full ${isDarkMode ? 'dark' : ''}`}
            darkMode={isDarkMode}
          />
        </div>
        
      <AnimatePresence mode="wait">
        {isSidebarOpen && isContentVisible && (
          <motion.div 
            key="sidebar-content"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col mt-4 z-30 bg-white/70 backdrop-blur-sm mx-3 rounded-xl flex-grow h-fit overflow-hidden"
          >
            <div>
              <SearchBar isDarkMode={isDarkMode} />
              <RecentConversations isDarkMode={isDarkMode} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isMobile && !isSidebarOpen && (
        <motion.button
          onClick={() => {  
            setSidebarOpen(true);
            setIsContentVisible(true);
          }}
          className={`fixed top-10 left-5 ${isDarkMode 
            ? 'bg-gradient-to-r from-[#283A78]/60 to-[#AD2B1E]/50 backdrop-blur-md border border-neutral-700/30' 
            : 'bg-gradient-to-r from-[#283A78]/20 to-[#AD2B1E]/10 backdrop-blur-md border border-gray-200/70'
          } hover:opacity-90 ${isDarkMode ? 'text-white' : 'text-gray-700'} rounded-full flex items-center justify-center shadow-sm z-50 cursor-pointer transition-all duration-300 w-8 h-8`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "tween", duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          title="Expand sidebar"
        >
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 24H4C1.8 24 0 22.2 0 20V4C0 1.8 1.8 0 4 0H20C22.2 0 24 1.8 24 4V20C24 22.2 22.2 24 20 24ZM4 2C2.9 2 2 2.9 2 4V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V4C22 2.9 21.1 2 20 2H4Z" fill="currentColor" />
            <path d="M8 24C7.4 24 7 23.6 7 23V1C7 0.4 7.4 0 8 0C8.6 0 9 0.4 9 1V23C9 23.6 8.6 24 8 24Z" fill="currentColor" />
            <path d="M17.5 16.25C17.125 16.25 16.875 16.125 16.625 15.875C16.125 15.375 16.125 14.625 16.625 14.125L20.375 10.375C20.875 9.875 21.625 9.875 22.125 10.375C22.625 10.875 22.625 11.625 22.125 12.125L18.375 15.875C18.125 16.125 17.875 16.25 17.5 16.25Z" fill="currentColor" />
            <path d="M21.25 20C20.875 20 20.625 19.875 20.375 19.625L16.625 15.875C16.125 15.375 16.125 14.625 16.625 14.125C17.125 13.625 17.875 13.625 18.375 14.125L22.125 17.875C22.625 18.375 22.625 19.125 22.125 19.625C21.875 19.875 21.625 20 21.25 20Z" fill="currentColor" />
          </svg>
        </motion.button>
      )}
    </motion.div>
  );
};

export default Sidebar;
