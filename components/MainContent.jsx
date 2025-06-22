import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatInput from './ChatInput';

/**
 * QuickLinkCard Component
 * 
 * Renders an interactive card for quick access to common queries in the welcome screen.
 * Features animations on hover and selection with Framer Motion.
 */
const QuickLinkCard = ({ card, index, isDarkMode, selectedCard, setSelectedCard, handleCardClick }) => {
  return (
    <motion.div 
      key={index}
      className="group p-[1.5px] rounded-[8px] w-full h-full bg-[#E6E6E6] hover:bg-gradient-to-t from-[#da4133] to-[#283A78] cursor-pointer overflow-hidden"
      whileHover={{ scale: 1.02 }}
      animate={selectedCard === index ? { scale: 1.03 } : { scale: 1 }}
      onClick={() => {
        setSelectedCard(index === selectedCard ? null : index);
        if (index !== selectedCard) {
          handleCardClick(card);
        }
      }}
      transition={{ duration: 0.2 }}
      layout
    >
      <div className={`flex flex-col rounded-[6px] justify-between w-full h-full ${isDarkMode ? 'border-neutral-800 bg-neutral-900' : 'border-white bg-white'} p-2.5 md:p-4 relative ${selectedCard === index ? (isDarkMode ? 'bg-neutral-800' : 'bg-blue-50') : ''}`}>
        <div className="flex justify-between items-start">
          <span className={`font-bold text-xs md:text-[18px] space-y-1 flex flex-col ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-t group-hover:from-[#3950a1] via-amber-900 group-hover:to-[#c6382b] leading-[100%] tracking-[-0.07em]`}>
            {card.title.split(' ').map((word, index) => (
              <span key={index} className="font-medium">{word}<br /></span>
            ))}
          </span>
          <motion.div 
            className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full md:group-hover:rotate-90 md:rotate-0 transition-transform duration-300"
            whileTap={{ scale: 0.9 }}
          >
            <svg width="16" height="16" className="md:w-5 md:h-5" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.96029 18.1289L18.1284 8.96077M18.1284 8.96077H11.2523M18.1284 8.96077V15.8368" 
                    stroke={isDarkMode ? "#cccccc" : "#666666"} 
                    strokeLinecap="round" 
                    strokeLinejoin="round"/>
              <circle cx="13.5" cy="13.5" r="13" stroke={isDarkMode ? "#cccccc" : "#666666"}/>
            </svg>
          </motion.div>
        </div>
        <p className={`text-[9px] md:text-[10px] group-hover:text-black flex items-center text-left font-normal mt-1 md:mt-2 leading-[100%] tracking-[-0.07em] ${isDarkMode ? 'text-neutral-400' : 'text-gray-400'}`}>
          {card.description.substring(0, 50) + (card.description.length > 50 ? '...' : '')}
        </p>
      </div>
    </motion.div>
  );
};

/**
 * MainContent Component
 * 
 * The primary content area of the application, handling both the welcome screen
 * and chat interface. Manages transitions between states and positioning of the
 * chat input based on application state.
 */
const MainContent = ({
  children,
  isDarkMode,
  isMobile,
  isSidebarOpen,
  setSidebarOpen,
  setIsContentVisible,
  messages,
  Logo,
  inputValue,
  setInputValue,
  isLoading,
  sendMessage,
  setMessages
}) => {
  // UI state management
  const [selectedCard, setSelectedCard] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const chatInputRef = useRef(null);
  const welcomeScreenRef = useRef(null);
  const logoRef = useRef(null);
  
  // Input position state based on application mode
  const [inputPosition, setInputPosition] = useState(messages.length === 0 ? 'center' : 'bottom');
  
  // Derived state for UI rendering conditions
  const isWelcomeMode = messages.length === 0 && !isTransitioning;
  const isChatMode = messages.length > 0 || isTransitioning;
  
  /**
   * Effect to update input position when messages change
   * Ensures chat input is positioned at the bottom when in chat mode
   */
  useEffect(() => {
    if (messages.length > 0 && inputPosition === 'center') {
      setInputPosition('bottom');
    }
  }, [messages, inputPosition]);
  
  /**
   * Handles sending messages with appropriate animations
   * Different behavior for initial message vs subsequent messages
   */
  const handleSendMessage = (message) => {
    if (messages.length === 0) {
      if (!isMobile) {
        // Desktop: First message triggers transition animation
        setIsTransitioning(true);
        setInputPosition('bottom');
        
        // Delayed send to allow for animation
        setTimeout(() => {
          sendMessage(message);
          setTimeout(() => {
            setInputPosition('bottom');
            setIsTransitioning(false);
          }, 400);
        }, 300);
      } else {
        // Mobile: Direct send without animation
        sendMessage(message);
        setInputPosition('bottom');
      }
    } else {
      // Subsequent messages: no transition needed
      sendMessage(message);
    }
  };
  
  /**
   * Handles quick link card clicks
   * Creates messages for the selected card topic
   */
  const handleCardClick = (card) => {
    if (setMessages) {
      if (!isMobile) {
        // Desktop: Set transition state but avoid input position animation
        setIsTransitioning(true);
        setInputPosition('bottom');
        
        // Create user message from card
        setTimeout(() => {
          setMessages([
            { 
              sender: "user", 
              text: card.description, 
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            }
          ]);
          
          // Create bot response after a delay
          setTimeout(() => {
            setMessages(prev => [
              ...prev,
              { 
                sender: "bot", 
                text: `Here's information about ${card.title}: I'll analyze the data and provide insights on ${card.description.toLowerCase()}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
              }
            ]);
            
            setInputPosition('bottom');
            setIsTransitioning(false);
          }, 1000);
        }, 300);
      } else {
        // Mobile: Direct message creation without animations
        setMessages([
          { 
            sender: "user", 
            text: card.description, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          }
        ]);
        
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            { 
              sender: "bot", 
              text: `Here's information about ${card.title}: I'll analyze the data and provide insights on ${card.description.toLowerCase()}`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            }
          ]);
        }, 1000);
      }
    }
  };
  
  // Quick links data configuration
  const quickLinks = [
    {
      title: "Visit Summary",
      description: "How many times has each customer site been visited in the last 30 days?"
    },
    {
      title: "Customer Sentiments",
      description: "How many times has each customer site been visited in the last 30 days?"
    },
    {
      title: "CAM Performance",
      description: "Which sales reps have conducted the most impactful or frequent visits recently?"
    },
    {
      title: "New Orders",
      description: "Which customer accounts have reported new or upcoming orders during recent meetings?"
    }
  ];

  // Animation variants for content resizing
  const mainContentVariants = {
    expanded: {
      width: isMobile ? "100%" : "100%",
      transition: {
        type: "tween", 
        ease: [0.25, 0.1, 0.25, 1],
        duration: 0.5
      }
    },
    collapsed: {
      width: isMobile ? "100%" : "80%",
      transition: {
        type: "tween",
        ease: [0.25, 0.1, 0.25, 1],
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className={`flex relative flex-col h-screen ${isDarkMode ? 'bg-neutral-950 text-white' : 'bg-[#F9F9F9]'} ${isMobile ? "w-full absolute inset-0" : "flex-1"} overflow-hidden main-content`}
      layout={false}
      variants={!isMobile ? mainContentVariants : undefined}
      animate={!isMobile ? (isSidebarOpen ? "collapsed" : "expanded") : undefined}
      initial={!isMobile ? (isSidebarOpen ? "collapsed" : "expanded") : undefined}
      style={{
        width: isMobile ? "100%" : (isSidebarOpen ? "80%" : "100%")
      }}
    >
      {/* Top Header Bar */}
      <div className={`h-[10%] w-full flex items-center justify-between px-7 sticky top-0 ${isDarkMode ? 'bg-neutral-950' : 'bg-[#F9F9F9]'} z-30 py-4`}>
        {isMobile && !isSidebarOpen && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 15 
            }}
            onClick={() => {
              setSidebarOpen(true);
              setIsContentVisible(true);
            }}
            className="p-2 bg-transparent z-20"
          >
              <img src="/Open.svg" alt="Open" className="w-6 h-6" />
        
          </motion.button>
        )}
        {isMobile && !isSidebarOpen && messages.length > 0 && (       
          <motion.div 
            className="w-full flex items-center justify-center"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1
            }}
          >
            <div className="flex items-end">
              <Logo width={100} height={100} priority className="object-contain" />
            </div>
          </motion.div>
        )}

        <div className="flex-1"></div>
      </div>

      {/* Main Content Container with AnimatePresence for smooth transitions */}
      <div className="flex-1 overflow-y-auto relative">
        <AnimatePresence mode="wait">
          {isWelcomeMode ? (
            // Welcome Screen Mode
            <motion.div 
              ref={welcomeScreenRef}
              key="welcome-screen"
              className={`flex flex-col h-full w-[95%] mx-auto justify-between items-center flex-grow px-4 overflow-y-hidden relative z-10 ${isDarkMode ? 'bg-neutral-950' : ''} welcome-container`}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              <div className="flex-1"></div>
              
              {/* Logo Section */}
              <motion.div 
                ref={logoRef}
                className="mb-5 md:mb-1 flex items-center justify-center"
              >
                <div className="hidden md:flex items-end w-full">
                  <span className={`text-5xl md:text-4xl -ml-1 mb-1 text-[#2644a1] italic`}>Riddler</span>
                </div>
                <div className="md:hidden flex items-end w-full">
                  <span className={`text-2xl -ml-1 italic font-normal text-[#2644a1]`}>Riddler</span>
                </div>
              </motion.div>
              
              {/* Welcome Message */}
              <motion.h1 
                className={`hidden tracking-tighter md:block text-3xl mb-6 md:text-4xl font-[400] ${isDarkMode ? 'text-white' : 'text-gray-800'} text-center`}
              >
                How can we <span className="premium-gradient font-[400]">assist</span> you today?
              </motion.h1>
              <div className='hidden md:flex flex-col h-36 justify-between'></div>
              
              {/* Quick Links Grid */}
              <div className="grid grid-cols-2 mb-12 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full md:w-full md:h-[140px] max-w-3xl md:pt-1 md:pb-1">
                {quickLinks.map((card, index) => (
                  <QuickLinkCard 
                    key={index}
                    card={card} 
                    index={index} 
                    isDarkMode={isDarkMode} 
                    selectedCard={selectedCard}
                    setSelectedCard={setSelectedCard}
                    handleCardClick={handleCardClick}
                  />
                ))}
              </div>
              
              <div className="flex-1"></div>
              {/* Mobile-only chat input in welcome mode */}
              {isMobile && (
              <ChatInput
                isDarkMode={isDarkMode}
                isMobile={isMobile}
                inputValue={inputValue}
                setInputValue={setInputValue}
                isLoading={isLoading}
                sendMessage={handleSendMessage}
              />
              )}
            </motion.div>
          ) : (
            // Chat Mode
            <div className='flex flex-col h-full justify-between'>
              <motion.div 
                key="chat-content"
                className="flex-1 overflow-y-auto z-10 bg-transparent via-gray-50 to-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
              
              {/* Spacer for bottom input positioning */}
              <div className="h-16 md:h-20 w-full"></div>
            </div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Mobile Chat Input (only shown in chat mode) */}
      {isMobile && messages.length > 0 && (
      <motion.div
        ref={chatInputRef}
        className="w-full z-30 px-4 mx-auto absolute left-0 right-0"
        initial={false}
        animate={{
          position: inputPosition === 'bottom' ? 'fixed' : 'absolute',
          bottom: inputPosition === 'bottom' ? '10px' : 'auto',
          top: inputPosition === 'center' ? '50%' : 
               inputPosition === 'transitioning' ? '70%' : 'auto',
          left: '50%',
          right: 'auto',
          x: '-50%',
          y: inputPosition === 'center' ? '-50%' : 
             inputPosition === 'transitioning' ? '-50%' : 0,
          opacity: 1,
          scale: inputPosition === 'transitioning' ? 0.98 : 1,
        }}
        transition={{
          type: "tween",
          ease: [0.25, 0.1, 0.25, 1],
          duration: 0.5
        }}
      >
        <ChatInput 
          isDarkMode={isDarkMode}
          isMobile={isMobile}
          inputValue={inputValue}
          setInputValue={setInputValue}
          isLoading={isLoading}
          sendMessage={handleSendMessage}
          className="w-full"
        />
      </motion.div>
      )}
      
      {/* Desktop Chat Input with dynamic positioning */}
      {!isMobile && (
      <motion.div
        ref={chatInputRef}
        className={`w-full absolute z-30 px-4 mx-auto ${!isWelcomeMode ? 'pt-24' : ''} bg-gradient-to-b from-transparent via-gray-50 to-[#F9F9F9]`}
        initial={false}
        animate={{
          bottom: inputPosition === 'bottom' ? '10px' : 'auto',
          top: inputPosition === 'center' ? '50%' : 
               inputPosition === 'transitioning' ? '70%' : 'auto',
          left: '50%',
          right: 'auto',
          x: '-50%',
          y: inputPosition === 'center' ? '-50%' : 
             inputPosition === 'transitioning' ? '-50%' : 0,
          opacity: 1,
          scale: inputPosition === 'transitioning' ? 0.98 : 1,
        }}
        transition={{
          type: "tween",
          ease: [0.25, 0.1, 0.25, 1],
          duration: 0.5
        }}
      >
        <ChatInput 
          isDarkMode={isDarkMode}
          isMobile={isMobile}
          inputValue={inputValue}
          setInputValue={setInputValue}
          isLoading={isLoading}
          sendMessage={handleSendMessage}
          className="w-full"
        />
      </motion.div>
      )}
    </motion.div>
  );
};

export default MainContent; 