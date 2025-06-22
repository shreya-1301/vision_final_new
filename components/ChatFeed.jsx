import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Message from './Message';

const ChatFeed = ({ messages, onRetry, darkMode = false }) => {
  const chatContainerRef = useRef(null);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const prevMessagesLengthRef = useRef(messages.length);
  const prevMessagesRef = useRef([]);
  const isStreamingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const userHasScrolledRef = useRef(false);

  // Find the last bot message index
  const lastBotMessageIndex = messages.length > 0 
    ? messages.map(m => m.sender === 'bot').lastIndexOf(true)
    : -1;

  // Get streaming status
  const isStreaming = messages.some(msg => msg.isStreaming);
  
  // Force scroll to bottom - this is a direct imperative call
  const scrollToBottom = (smooth = true) => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight;
      const height = chatContainerRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      
      chatContainerRef.current.scrollTo({
        top: maxScrollTop > 0 ? maxScrollTop : 0,
        behavior: smooth ? 'smooth' : 'auto'
      });
      
      console.log("Scrolling to bottom executed");
    }
  };

  // Check if user is at bottom - with a very small threshold
  const isAtBottom = () => {
    if (!chatContainerRef.current) return true;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    return scrollTop + clientHeight >= scrollHeight - 10;
  };

  // Handle scroll button click
  const handleScrollButtonClick = () => {
    setAutoScrollEnabled(true);
    userHasScrolledRef.current = false;
    scrollToBottom(true);
  };

  // Handle user scroll events
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 10;
    
    // Show scroll button when not at bottom
    setShowScrollButton(!atBottom);
    
    // If scrolling up, mark that user has scrolled and disable auto-scroll
    if (scrollTop < lastScrollTop) {
      userHasScrolledRef.current = true;
      setAutoScrollEnabled(false);
    }
    
    // When manually scrolled to bottom, reset user scroll flag and enable auto-scroll
    if (atBottom) {
      userHasScrolledRef.current = false;
      setAutoScrollEnabled(true);
    }
    
    setLastScrollTop(scrollTop);
  };

  // Always scroll to bottom when a new message is added (sent by user)
  useEffect(() => {
    if (messages.length === 0) return;
    
    const messagesAdded = messages.length > prevMessagesLengthRef.current;
    prevMessagesLengthRef.current = messages.length;
    prevMessagesRef.current = [...messages];
    
    // If a new message was added
    if (messagesAdded) {
      const lastMessage = messages[messages.length - 1];
      
      // If the last message is from the user, always scroll to bottom
      if (lastMessage.sender === 'user') {
        console.log("User message detected, scrolling to bottom");
        userHasScrolledRef.current = false; // Reset user scroll flag
        setAutoScrollEnabled(true); // Enable auto-scroll
        setTimeout(() => scrollToBottom(true), 0); // Scroll to bottom immediately
        return;
      }
      
      // For non-user messages, if it's not streaming and auto-scroll is on or at bottom
      if (!isStreaming && (autoScrollEnabled || isAtBottom())) {
        setTimeout(() => scrollToBottom(true), 0);
      }
    }
  }, [messages.length]);

  // Handle streaming messages
  useEffect(() => {
    // Previous streaming state
    const wasStreaming = isStreamingRef.current;
    
    // If streaming just started
    if (isStreaming && !wasStreaming) {
      // Always scroll to bottom when streaming starts with a new bot message
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.sender === 'bot') {
        userHasScrolledRef.current = false;
        setAutoScrollEnabled(true);
        setTimeout(() => scrollToBottom(true), 0);
      }
    }
    
    // Update streaming state
    isStreamingRef.current = isStreaming;
    
    // During streaming - scroll if auto-scroll is enabled
    if (isStreaming && autoScrollEnabled) {
      scrollToBottom(true);
    }
    
    // Set up polling for streaming messages
    if (isStreaming && autoScrollEnabled) {
      if (scrollTimeoutRef.current) {
        clearInterval(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setInterval(() => {
        if (autoScrollEnabled) {
          scrollToBottom(true);
        }
      }, 100); // Faster interval for smoother scrolling
      
      return () => {
        if (scrollTimeoutRef.current) {
          clearInterval(scrollTimeoutRef.current);
          scrollTimeoutRef.current = null;
        }
      };
    } else if (scrollTimeoutRef.current) {
      clearInterval(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
  }, [isStreaming, messages, autoScrollEnabled]);

  useEffect(() => {
    // Force initial scroll to bottom on component mount
    setTimeout(() => scrollToBottom(false), 100);
    
    // Set up a resize observer to handle viewport changes (especially on iOS)
    const resizeObserver = new ResizeObserver(() => {
      if (autoScrollEnabled) {
        setTimeout(() => scrollToBottom(true), 100);
      }
    });
    
    if (chatContainerRef.current) {
      resizeObserver.observe(chatContainerRef.current);
    }
    
    // Check if running on iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    // Special handling for iOS
    if (isIOS) {
      // Add iOS-specific CSS class to container
      if (chatContainerRef.current) {
        chatContainerRef.current.classList.add('ios-chat-container');
      }
      
      // Add iOS-specific class to body for global styling
      document.body.classList.add('ios-device');
      
      // Add extra scroll check for iOS
      const intervalId = setInterval(() => {
        if (autoScrollEnabled && !userHasScrolledRef.current) {
          scrollToBottom(true);
        }
      }, 500);
      
      return () => {
        // Clean up iOS-specific classes
        document.body.classList.remove('ios-device');
        if (chatContainerRef.current) {
          chatContainerRef.current.classList.remove('ios-chat-container');
        }
        clearInterval(intervalId);
        resizeObserver.disconnect();
      };
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleRetry = (index) => {
    if (onRetry) {
      onRetry(index);
    }
  };

  return (
    <div 
      className={`flex-1 overflow-y-auto overflow-x-hidden px-2 md:px-4 mt-3 lg:px-0 flex flex-col pb-32 md:pb-10 hide-scrollbar chat-container relative`}
      ref={chatContainerRef}
      onScroll={handleScroll}
      style={{ 
        WebkitOverflowScrolling: 'touch', 
        overscrollBehavior: 'contain',
        scrollbarWidth: 'none', /* Firefox */
        msOverflowStyle: 'none', /* IE 10+ */
        paddingBottom: '80px', /* Additional padding to ensure content isn't hidden behind input */
      }}
    >
      <div className="max-w-3xl w-full mx-auto pb-10" >
        {messages.map((message, index) => (
          <motion.div 
            key={index}
            className="fade-in-up w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Message 
              message={message} 
              isUser={message.sender === 'user'} 
              onRetry={() => handleRetry(index)}
              darkMode={darkMode}
              isLastBotMessage={index === lastBotMessageIndex && message.sender === 'bot'}
            />
          </motion.div>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="h-full flex items-center justify-center">
          <div className="text-center p-8 rounded-xl bg-gray-50 dark:bg-neutral-900 max-w-md mx-auto shadow-sm">
            <div className="w-20 h-20 mx-auto mb-6">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#283A78] to-[#AD2B1E] flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
            <h3 className={`text-xl font-medium ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>
              Start a conversation
            </h3>
            <p className={`text-base ${darkMode ? 'text-neutral-400' : 'text-gray-500'} max-w-xs mx-auto`}>
              Ask JSW Riddler about products, services, or any information you need assistance with.
            </p>
          </div>
        </div>
      )}

      {showScrollButton && (
        <motion.button
          className={`fixed bottom-40 right-6 z-10 rounded-full p-3 shadow-lg ${darkMode ? 'bg-neutral-800 text-white' : 'bg-white text-gray-700'} hover:${darkMode ? 'bg-neutral-700' : 'bg-gray-100'} transition-all duration-200`}
          onClick={handleScrollButtonClick}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.button>
      )}

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        /* iOS-specific adjustments */
        :global(.ios-device .chat-container) {
          padding-bottom: 120px !important;
        }
        
        :global(.ios-device .input-container) {
          z-index: 30 !important;
        }
        
        :global(.ios-chat-container) {
          padding-bottom: 120px !important;
        }
        
        /* Extra padding on mobile */
        @media (max-width: 768px) {
          .chat-container {
            padding-bottom: 100px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatFeed; 