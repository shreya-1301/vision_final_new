"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { useTheme } from './context/ThemeContext';
import ChatFeed from "./components/ChatFeed";
import ChatInput from "./components/ChatInput";
import Layout from "./components/Layout";
import './App.css'; // Import the CSS file with Inter font definitions

// Logo component to replace Next.js Image
const Logo = ({ width, height, priority, className }) => (
  <img 
    src="/logo.png" 
    alt="logo" 
    width={width} 
    height={height} 
    className={className}
    style={{ objectFit: 'contain' }}
    loading={priority ? "eager" : "lazy"}
  />
);

export default function App() { 
  // const { theme } = dark;
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(true);
  // Add chat functionality states
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  // Loading state for API calls
  const [isLoading, setIsLoading] = useState(false);
  // Font loading state
  const [fontLoaded, setFontLoaded] = useState(false);

  // Handle mounted state to avoid hydration issues
  useEffect(() => {
    setMounted(true);
    
    // Check if Inter font is loaded
    document.fonts.ready.then(() => {
      if (document.fonts.check("12px Inter")) {
        setFontLoaded(true);
      } else {
        // Fallback for browsers that don't support font loading API
        setTimeout(() => setFontLoaded(true), 500);
      }
    });
  }, []);

  // Determine if dark mode is active
  const isDarkMode = false;

  // Modified scroll to bottom function to work better - but don't auto-scroll during streaming
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight;
      const height = chatContainerRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      
      // Check if user is already at the bottom before forcing scroll
      const isAtBottom = chatContainerRef.current.scrollTop + height >= scrollHeight - 100;
      
      // Only force scroll if user is already at the bottom or this is a new conversation
      if (isAtBottom || messages.length <= 2) {
        chatContainerRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
      }
      
      // Prevent body scrolling when chat is active on mobile
      if (isMobile && messages.length > 0) {
        document.body.style.overflow = 'hidden';
      }
    }
  }, [messages, isMobile]);

  // Scroll to bottom only for new complete messages, not during streaming
  useEffect(() => {
    // Don't automatically scroll during streaming updates
    const lastMessage = messages[messages.length - 1];
    const isStreaming = lastMessage && lastMessage.isStreaming === true;
    
    // Only scroll when a new complete message is added
    if (!isStreaming || messages.length <= 2) {
    scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Toggle sidebar function
  const toggleSidebar = () => {
    if (isSidebarOpen) {
      // When closing the sidebar
      setSidebarOpen(false);
      setIsContentVisible(false);
    } else {
      // When opening the sidebar
      setSidebarOpen(true);
      setIsContentVisible(true);
    }
  };

  // Prevent content shifting when focusing input on mobile
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    // Detect keyboard state
    let keyboardOpen = false;
    let keyboardHeight = 0;
    
    const handleKeyboardAppearance = () => {
      if (!isMobile) return;
      
      const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      const windowHeight = window.innerHeight;
      
      // Check if keyboard is visible 
      if (windowHeight - viewportHeight > 150) {
        keyboardOpen = true;
        keyboardHeight = windowHeight - viewportHeight;
        
        // Adjust for mobile keyboard - close sidebar if it's open
        if (isSidebarOpen) {
          setSidebarOpen(false);
        }
        
        // Handle iOS keyboard appearance
        if (isIOS) {
          document.body.classList.add('keyboard-open');
          
          // Fix position for input container - place it directly above keyboard
          const inputContainers = document.querySelectorAll('.input-container');
          inputContainers.forEach(container => {
            if (container) {
              // Apply styles to make the input stick above keyboard
              container.style.position = 'fixed';
              container.style.bottom = `${keyboardHeight + 5}px`; // 5px margin when keyboard is open
              container.style.left = '0';
              container.style.right = '0';
              container.style.zIndex = '9999';
              container.style.background = '#F9F9F9';
              // Add a subtle shadow for separation
              container.style.boxShadow = '0 -2px 10px rgba(0,0,0,0.1)';
            }
          });
          
          // Adjust chat container to ensure full visibility of messages
          const chatContainer = document.querySelector('.chat-container');
          if (chatContainer) {
            chatContainer.style.paddingBottom = `${keyboardHeight + 70}px`;
            chatContainer.scrollTop = chatContainer.scrollHeight;
          }
          
          // Set a timeout for iOS to properly render
          setTimeout(() => {
            // Scroll to keep input visible
            window.scrollTo(0, 0);
            scrollToBottom();
          }, 50);
        }
        
        // Handle Android keyboard appearance
        if (isAndroid) {
          // Fix input position for Android
          const inputContainers = document.querySelectorAll('.input-container');
          inputContainers.forEach(container => {
            if (container) {
              container.style.position = 'fixed';
              container.style.bottom = '0px';
              container.style.left = '0';
              container.style.right = '0';
              container.style.zIndex = '9999';
            }
          });
          
          // Adjust chat container for Android
          const chatContainer = document.querySelector('.chat-container');
          if (chatContainer) {
            chatContainer.style.paddingBottom = '70px';
            chatContainer.scrollTop = chatContainer.scrollHeight;
          }
          
          // Ensure chat feed is scrolled properly
          scrollToBottom();
        }
      } else {
        // Keyboard is closed
        keyboardOpen = false;
        keyboardHeight = 0;
        
        if (isIOS) {
          document.body.classList.remove('keyboard-open');
          
          // Reset input container position
          const inputContainers = document.querySelectorAll('.input-container');
          inputContainers.forEach(container => {
            if (container) {
              // Reset position for normal view
              container.style.position = isMobile ? 'fixed' : 'relative';
              container.style.bottom = isMobile ? '10px' : ''; // 10px margin when keyboard is closed
              container.style.boxShadow = '';
            }
          });
          
          // Reset chat container padding
          const chatContainer = document.querySelector('.chat-container');
          if (chatContainer) {
            chatContainer.style.paddingBottom = '70px';
          }
        }
        
        if (isAndroid) {
          // Reset containers for Android
          const inputContainers = document.querySelectorAll('.input-container');
          inputContainers.forEach(container => {
            if (container) {
              container.style.position = isMobile ? 'fixed' : 'relative';
              container.style.bottom = isMobile ? '10px' : '';
            }
          });
          
          const chatContainer = document.querySelector('.chat-container');
          if (chatContainer) {
            chatContainer.style.paddingBottom = '70px';
          }
        }
      }
    };
    
    if (isMobile) {
      // Setup for iOS
      if (isIOS) {
        // Add global styles for iOS keyboard handling
        const style = document.createElement('style');
        style.innerHTML = `
          body.keyboard-open {
            height: 100% !important;
            overflow: hidden !important;
            position: fixed !important;
            width: 100% !important;
          }
          
          .keyboard-open .main-content {
            overflow: auto !important;
            height: calc(100% - 60px) !important; /* Adjust based on your input height */
            padding-bottom: 60px !important;
          }
          
          .chat-container {
            padding-bottom: 70px !important;
          }
        `;
        document.head.appendChild(style);
      }
      
      // Listen for resize events from visualViewport API
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleKeyboardAppearance);
        window.visualViewport.addEventListener('scroll', handleKeyboardAppearance);
      } else {
        // Fallback for older browsers
        window.addEventListener('resize', handleKeyboardAppearance);
      }
      
      // Set meta viewport for proper scaling
      const viewportMeta = document.querySelector('meta[name=viewport]');
      if (viewportMeta) {
        viewportMeta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0';
      } else {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0';
        document.getElementsByTagName('head')[0].appendChild(meta);
      }
    }
    
    return () => {
      // Cleanup handlers
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleKeyboardAppearance);
        window.visualViewport.removeEventListener('scroll', handleKeyboardAppearance);
      } else {
        window.removeEventListener('resize', handleKeyboardAppearance);
      }
    };
  }, [isMobile, isSidebarOpen, scrollToBottom]);

  // Function to call Groq API
  const callGroqAPI = async (userMessage) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: [
            { role: "system", content: "You are JSW Assistant, an AI helper for JSW Steel. Provide concise, helpful responses about JSW products, services, and general information." },
            ...messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            { role: "user", content: userMessage }
          ] 
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling Groq API:', error);
      return {
        message: "Sorry, I encountered an error processing your request. Please try again later.",
        haschart: false,
        chatdata: null
      };
    } finally {
      setIsLoading(false);
    }
  };

    const formatText = (text) => {

      if (text.match(/^\d+\.\s/m)) {
        // Split the text into lines
        const lines = text.split('\n');
        
        // Process each line
        return lines.map((line, index) => {

          const listItemMatch = line.match(/^(\d+)\.\s(.+)$/);

          if (listItemMatch) {

            return (
              <div key={index} className="flex items-start mb-2">
                <span className="mr-2 font-medium">{listItemMatch[1]}.</span>
                <span>{listItemMatch[2]}</span>
              </div>
            );
          } else {
            // Regular paragraph
            return line.trim() === '' ? 
              <div key={index} className="h-3"></div> : 
              <p key={index} className="mb-3">{line}</p>;
          }
        });
      } else {
        // If no list pattern is found, just split by newlines
        return text.split('\n').map((line, index) => 
          line.trim() === '' ? 
            <div key={index} className="h-3"></div> : 
            <p key={index} className="mb-3">{line}</p>
        );
      }
    };

  // Send message function with API integration
  const sendMessage = async () => {
    if (inputValue.trim() === "" || isLoading) return;
    
    const userMessage = inputValue;
    // Add user message
    const newMessages = [
      ...messages,
      { sender: "user", text: userMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ];
    
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);
    
    // Add a temporary streaming message
    const streamingMessageId = Date.now().toString();
    setMessages(prev => [
      ...prev,
      { 
        id: streamingMessageId,
        sender: "bot", 
        text: "",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStreaming: true
      }
    ]);
    
    // Call Groq API
    try {
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: [
            { role: "system", content: "You are JSW Assistant, an AI helper for JSW Steel. Provide concise, helpful responses about JSW products, services, and general information." },
            ...newMessages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            }))
          ] 
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Simulate streaming the response text character by character
      const fullText = data.message || "";
      const chunkSize = 3; // Characters per chunk
      let currentText = "";
      
      // Function to update message text gradually
      const streamTextChunk = async (index) => {
        if (index >= fullText.length) return;
        
        // Get the next chunk of text
        const end = Math.min(index + chunkSize, fullText.length);
        const chunk = fullText.substring(index, end);
        currentText += chunk;
        
        // Update the message with the current text
        setMessages(prev => {
          // Find the streaming message by id
          const messageIndex = prev.findIndex(msg => msg.id === streamingMessageId);
          if (messageIndex === -1) return prev;
          
          const updatedMessages = [...prev];
          updatedMessages[messageIndex] = {
            ...updatedMessages[messageIndex],
            text: currentText
          };
          return updatedMessages;
        });
        
        // Add a small delay for the typing effect
        await new Promise(resolve => setTimeout(resolve, 10));
        
        // Continue streaming if the component is still mounted
        try {
          await streamTextChunk(end);
        } catch (error) {
          console.error("Streaming interrupted:", error);
        }
      };
      
      // Start the streaming simulation
      try {
        await streamTextChunk(0);
      } catch (error) {
        console.error("Error during text streaming:", error);
      }
      
      // After streaming is complete, replace the streaming message with the final message
      setMessages(prev => {
        // Find and replace the streaming message
        return prev.map(msg => 
          msg.id === streamingMessageId ? {
            id: msg.id,
            sender: "bot", 
            text: data.message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            haschart: data.haschart,
            chartData: data.chatdata,
            isStreaming: false
          } : msg
        );
      });
    } catch (error) {
      console.error('Error calling Groq API:', error);
      
      // Handle error state
      setMessages(prev => {
        // Find and replace the streaming message with an error message
        return prev.map(msg => 
          msg.id === streamingMessageId ? {
            id: msg.id,
            sender: "bot", 
            text: "Sorry, I encountered an error processing your request. Please try again later.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isStreaming: false
          } : msg
        );
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // Check if mobile on mount and window resize using a memoized callback
  const checkIfMobile = useCallback(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    
    // Only auto-close sidebar on initial detection, not on every resize
    if (mobile && isSidebarOpen && !isMobile) {
      setSidebarOpen(false);
    }
  }, [isSidebarOpen, isMobile]);

  useEffect(() => {
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, [checkIfMobile]);

  // Update useEffect to sync isContentVisible with isSidebarOpen
  useEffect(() => {
    if (isSidebarOpen) {
      setIsContentVisible(true);
    } else {
      setIsContentVisible(false);
    }
  }, [isSidebarOpen]);

  // Layout-based sidebar width to prevent complete rerenders
  const sidebarWidth = isSidebarOpen 
    ? (isMobile ? "80%" : "20%") 
    : "0px";

  const mainContentWidth = isMobile 
    ? "100%" 
    : (isSidebarOpen ? "calc(100% - 20%)" : "100%");

  // Function to handle retry of a bot message
  const handleRetry = (index) => {
    // Get the last user message before this bot message
    const messagesCopy = [...messages];
    
    // Find the user message that triggered this bot response
    let userMessageIndex = -1;
    for (let i = index - 1; i >= 0; i--) {
      if (messagesCopy[i].sender === 'user') {
        userMessageIndex = i;
        break;
      }
    }
    
    if (userMessageIndex !== -1) {
      // Remove all messages after the user message
      const userMessage = messagesCopy[userMessageIndex].text;
      const updatedMessages = messagesCopy.slice(0, userMessageIndex + 1);
      setMessages(updatedMessages);
      
      // Trigger API call again
      setTimeout(() => {
        // Add a temporary streaming message
        const streamingMessageId = Date.now().toString();
        setMessages(prev => [
          ...prev,
          { 
            id: streamingMessageId,
            sender: "bot", 
            text: "",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isStreaming: true
          }
        ]);
        
        // Call the API with the user message
        callGroqAPI(userMessage).then(data => {
          const fullText = data.message || "";
          
          // Start the streaming simulation for the new response
          let currentText = "";
          let index = 0;
          
          const streamText = () => {
            if (index < fullText.length) {
              const chunkSize = 3;
              const end = Math.min(index + chunkSize, fullText.length);
              const chunk = fullText.substring(index, end);
              currentText += chunk;
              
              setMessages(prev => {
                const messageIndex = prev.findIndex(msg => msg.id === streamingMessageId);
                if (messageIndex === -1) return prev;
                
                const updatedMessages = [...prev];
                updatedMessages[messageIndex] = {
                  ...updatedMessages[messageIndex],
                  text: currentText
                };
                
                return updatedMessages;
              });
              
              index = end;
              setTimeout(streamText, 10);
            } else {
              // Replace streaming message with final message
              setMessages(prev => {
                return prev.map(msg => 
                  msg.id === streamingMessageId ? {
                    id: msg.id,
                    sender: "bot", 
                    text: data.message,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    haschart: data.haschart,
                    chartData: data.chatdata,
                    isStreaming: false
                  } : msg
                );
              });
            }
          };
          
          streamText();
        }).catch(error => {
          console.error('Error retrying message:', error);
          
          setMessages(prev => {
            return prev.map(msg => 
              msg.id === streamingMessageId ? {
                id: msg.id,
                sender: "bot", 
                text: "Sorry, I encountered an error processing your request. Please try again later.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isStreaming: false
              } : msg
            );
          });
        });
      }, 500);
    }
  };

  // Message rendering function that supports charts
  const renderMessageContent = (message) => {
    if (message.isLoading) {
      return (
        <div className="flex items-center space-x-2">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse delay-200"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse delay-400"></div>
        </div>
      );
    }
    
    // For streaming messages, show the current text with a typing indicator
    if (message.isStreaming) {
      return (
        <div className="text-sm leading-relaxed">
          <div className="text-content">
            {formatText(message.text || "")}
            <span className="typing-indicator ml-1">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
        </div>
      );
    }
    
  

  return (
      <div className="text-sm leading-relaxed">
        <div className="text-content">
          {formatText(message.text)}
        </div>
        
        {message.haschart && message.chartData && (
          <ChatChart chartData={message.chartData} />
        )}
      </div>
    );
  };

  return (
    <Layout
      isDarkMode={isDarkMode}
      isSidebarOpen={isSidebarOpen}
      setSidebarOpen={setSidebarOpen}
      isContentVisible={isContentVisible}
      setIsContentVisible={setIsContentVisible}
      isMobile={isMobile}
      messages={messages}
      setMessages={setMessages}
      setInputValue={setInputValue}
      setSelectedCard={setSelectedCard}
      toggleSidebar={toggleSidebar}
      Logo={Logo}
      inputValue={inputValue}
      isLoading={isLoading}
      sendMessage={sendMessage}
    >
      <motion.div 
        key="chat-conversation"
        className="flex flex-col w-full max-w-4xl mx-auto h-full overflow-hidden relative z-10"
      >
        {/* Use the ChatFeed component */}
        <ChatFeed 
          messages={messages} 
          onRetry={handleRetry} 
          darkMode={isDarkMode} 
        />
      </motion.div>
    </Layout>
  );
}
