import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const Layout = ({
  children,
  isDarkMode,
  isSidebarOpen,
  setSidebarOpen,
  isContentVisible,
  setIsContentVisible,
  isMobile,
  messages,
  setMessages,
  setInputValue,
  setSelectedCard,
  toggleSidebar,
  Logo,
  inputValue,
  isLoading,
  sendMessage
}) => {
  // Layout-based sidebar width to prevent complete rerenders
  const sidebarWidth = isSidebarOpen 
    ? (isMobile ? "80%" : "20%") 
    : "0px";

  const mainContentWidth = isMobile 
    ? "100%" 
    : (isSidebarOpen ? "calc(100% - 20%)" : "100%");

  return (
    <div className={`flex flex-row w-full h-full ${isDarkMode ? 'bg-neutral-950 text-white' : 'bg-[#DDE5FF] from-70% to-red-500/20'} overflow-hidden md:flex-row flex-col`}>
      {/* Mobile Overlay - Only visible when sidebar is open on mobile */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black opacity-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar Component */}
      <Sidebar 
        isDarkMode={isDarkMode}
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isContentVisible={isContentVisible}
        setIsContentVisible={setIsContentVisible}
        isMobile={isMobile}
        setMessages={setMessages}
        setInputValue={setInputValue}
        setSelectedCard={setSelectedCard}
        sidebarWidth={sidebarWidth}
        Logo={Logo}
      />
      
      {/* Sidebar Toggle Button - Only visible when sidebar is closed and not on mobile */}
      {!isMobile && !isSidebarOpen && (
        <>
        <motion.button
          onClick={() => {
            setSidebarOpen(true);
            setIsContentVisible(true);
          }}
          className={`fixed top-5 left-5 ${isDarkMode 
            ? 'bg-neutral-800/80 hover:bg-neutral-700/80 backdrop-blur-md text-white border border-neutral-700/30' 
            : 'bg-[#f9f9f9] hover:bg-gray-300 backdrop-blur-md text-gray-700  border-gray-200/50'
          } rounded-md flex items-center justify-center z-50 cursor-pointer transition-all duration-300 w-10 h-10`}
       
          whileTap={{ scale: 0.95 }}
          title="Open sidebar"
        >
        <img src="/Open.svg" alt="Open" className="w-6 h-6" />
        </motion.button>
        <motion.button
          onClick={() => {
            setMessages([]);
            setInputValue("");
            setSelectedCard(null);
          }}
          className={`fixed top-5 left-16 ${isDarkMode 
            ? 'bg-neutral-800/80 hover:bg-neutral-700/80 backdrop-blur-md text-white border border-neutral-700/30' 
            : 'bg-[#f9f9f9] hover:bg-gray-300 backdrop-blur-md text-gray-700  border-gray-200/50'
          } rounded-md flex items-center justify-center p-2 z-50 cursor-pointer transition-all duration-300 w-10 h-10`}
        >
          <img src="/chat.svg" alt="Open" className="w-5 h-5" />
        </motion.button>
        </>
      )}
      
      {/* Main Content Component */}
      <MainContent 
        isDarkMode={isDarkMode}
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isContentVisible={isContentVisible}
        setIsContentVisible={setIsContentVisible}
        messages={messages}
        Logo={Logo}
        inputValue={inputValue}
        setInputValue={setInputValue}
        isLoading={isLoading}
        sendMessage={sendMessage}
        setMessages={setMessages}
      >
        {children}
      </MainContent>
    </div>
  );
};

export default Layout; 