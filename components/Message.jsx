import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChatChart from './ChatChart';
import LottieAnimation from './LottieAnimation';
import try2 from '../../public/try2.svg';
// Dynamically import components to avoid SSR issues


// Function to render message content including lists
const renderMessageContent = (content) => {
  if (!content) return null;
  
  // Check if content is already a react element
  if (React.isValidElement(content)) {
    return content;
  }
  
  // If content is a string, format it properly
  if (typeof content === 'string') {
    // Split by lines to handle numbered lists
    const lines = content.split('\n');
    const elements = [];
    
    let inList = false;
    let listItems = [];
    
    lines.forEach((line, index) => {
      // Check if the line is a numbered list item (starts with number followed by period and space)
      const listItemMatch = line.match(/^(\d+)\.\s(.+)$/);
      
      if (listItemMatch) {
        inList = true;
        listItems.push(
          <li key={`item-${index}`} className="ml-5 list-decimal">
            {listItemMatch[2]}
          </li>
        );
      } else if (line.trim() === '' && inList) {
        // Empty line after list ends the list
        elements.push(
          <ol key={`list-${index}`} className="list-decimal pl-5 my-2">
            {listItems}
          </ol>
        );
        inList = false;
        listItems = [];
      } else if (line.trim() !== '') {
        // Regular paragraph
        if (inList) {
          // End the previous list before adding a paragraph
          elements.push(
            <ol key={`list-${index}`} className="list-decimal pl-5 my-2">
              {listItems}
            </ol>
          );
          inList = false;
          listItems = [];
        }
        
        elements.push(
          <p key={`paragraph-${index}`} className="my-1">
            {line}
          </p>
        );
      }
    });
    
    // Add any remaining list items
    if (inList && listItems.length > 0) {
      elements.push(
        <ol key={`list-final`} className="list-decimal pl-5 my-2">
          {listItems}
        </ol>
      );
    }
    
    return elements.length > 0 ? elements : <p>{content}</p>;
  }
  
  // Return content as is if it's not a string or React element
  return content;
};

const Message = ({ message, isUser, onRetry, darkMode = false, isLastBotMessage = false }) => {
  const [copied, setCopied] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => console.error('Could not copy text: ', err));
  };

  const handleFeedback = (isPositive) => {
    setFeedbackGiven(true);
    setFeedbackType(isPositive ? 'positive' : 'negative');
    // You can add API call here to send feedback to your backend
    setTimeout(() => setFeedbackGiven(false), 3000);
  };  

  // Define user avatar component
  const UserAvatar = () => (
    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium text-sm">
      V
    </div>
  );

  return (
    <div className={`flex py-3 ${isUser && darkMode ? 'bg-gray-900' : ''} ${isUser ? 'justify-end' : 'justify-start'}  max-w-full px-2 ${isUser ? '' : (darkMode ? '' : '')}`}
      style={{ touchAction: 'pan-y', WebkitTapHighlightColor: 'transparent' }}
    >
      <div className={`flex ${isUser ? 'flex-row-reverse p-2 rounded-lg space-x-2' : 'flex-row space-x-2 w-full'}`}>
      {/* Avatar Column - Only for User */}
      <div className="flex-shrink-0">
        {isUser ? <UserAvatar /> : null}
      </div>
      
      {/* Message Content */}
      <div className={`flex flex-col ${isUser ? 'items-end text-center bg-blue-100 mr-2 px-4 pt-4 rounded-lg max-w-[70%] md:max-w-[90%]' : 'w-full'}`}>
        
        {/* Message Content */}
        <div className={`${darkMode ? 'text-neutral-100' : 'text-gray-700'} text-base leading-relaxed w-full`}>
          {message.isStreaming ? (
            <div className={` max-w-none  ${darkMode ? 'prose-invert' : ''}  prose-pre:bg-gray-800 prose-pre:text-gray-100 overflow-x-hidden break-words`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.text || ''}
              </ReactMarkdown>
              <span className="inline-flex items-center">
              <LottieAnimation width={100} height={40} className="inline-block -ml-11 -mt-5" />
              </span>
            </div>
          ) : (
            <div className={` max-w-none markdown-body ${darkMode ? 'prose-invert' : ''} prose-headings:font-semibold  overflow-x-hidden break-words`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.text || ''}
              </ReactMarkdown>
            </div>
          )}
          
          {/* Chart display if exists */}
          {message.haschart && message.chartData && (
            <div className="mt-4 overflow-x-auto">
              <ChatChart chartData={message.chartData} darkMode={darkMode} />
            </div>
          )}
        </div>
        
        {/* Feedback button container - Fixed to properly align to right */}
        <div className={`flex w-full ${isLastBotMessage ? 'justify-end' : 'justify-end'}`}>
          {/* {!isUser && isLastBotMessage && !message.isStreaming && (
            <>
            <div className="ml-2 mt-3">
                <img src={try2} alt="try" className='w-8 h-4' />
            </div>
            </>
          )} */}
          
          {/* Feedback buttons - Only for bot messages */}
          {!isUser && !message.isStreaming && (
  <div className="group/container flex items-center justify-end -mt-1 space-x-1">
    <div className="relative group/copy">
      <button 
        onClick={handleCopy}
        className={`${darkMode ? 'text-neutral-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-300/80'} p-3 ${!isLastBotMessage ? 'opacity-0 group-hover/container:opacity-100' : 'opacity-100'} transition-opacity ease-in-out duration-200 cursor-pointer rounded-md  duration-200`}
        disabled={copied}
      >
        {copied ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
          </svg>
        )}
      </button>
      <div className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap opacity-0 group-hover/copy:opacity-100 transition-opacity duration-200 pointer-events-none ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}>
        {copied ? "Copied!" : "Copy"}
      </div>
    </div>
    
    {!feedbackGiven ? (
      <>
        <div className="relative group/helpful">
          <button 
            onClick={() => handleFeedback(true)}
            className={`${darkMode ? 'text-neutral-400 hover:text-green-400 hover:bg-gray-800' : 'text-gray-500 hover:text-green-600 hover:bg-gray-300/80'} p-3 ${!isLastBotMessage ? 'opacity-0 group-hover/container:opacity-100' : 'opacity-100'}  transition-opacity ease-in-out duration-200 cursor-pointer rounded-md  `}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"></path>
            </svg>
          </button>
          <div className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap opacity-0 group-hover/helpful:opacity-100 transition-opacity duration-200 pointer-events-none ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}>
            Helpful
          </div>
        </div>
        
        <div className="relative group/nothelpful">
          <button 
            onClick={() => handleFeedback(false)}
            className={`${darkMode ? 'text-neutral-400 hover:text-red-400 hover:bg-gray-800' : 'text-gray-500 hover:text-red-600 hover:bg-gray-300/80'} cursor-pointer ${!isLastBotMessage ? 'opacity-0 group-hover/container:opacity-100' : 'opacity-100'}  transition-opacity ease-in-out duration-200 p-3 rounded-md  duration-200`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm10-13h3a2 2 0 012 2v7a2 2 0 01-2 2h-3"></path>
            </svg>
          </button>
          <div className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap opacity-0 group-hover/nothelpful:opacity-100 transition-opacity duration-200 pointer-events-none ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}>
            Not helpful
          </div>
        </div>
      </> 
    ) : (
      <div className={`text-xs px-3 py-1.5 rounded-full transition-all duration-300 ${darkMode ? 'bg-gray-800 text-green-400' : 'bg-gray-100 text-green-600'} flex items-center space-x-1`}>
        <span className="text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
        <span>Thanks for your feedback!</span>
      </div>
    )}
    
    <div className="relative group/retry">
      <button 
        onClick={onRetry}
        className={`${darkMode ? 'text-neutral-400 hover:text-blue-400 hover:bg-gray-800' : 'text-gray-500 hover:text-blue-600 hover:bg-gray-300/80'} cursor-pointer p-3 ${!isLastBotMessage ? 'opacity-0 group-hover/container:opacity-100' : 'opacity-100'}  transition-opacity ease-in-out duration-200 rounded-md  duration-200`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10"></polyline>
          <polyline points="1 20 1 14 7 14"></polyline>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
      </button>
      <div className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap opacity-0 group-hover/retry:opacity-100 transition-opacity duration-200 pointer-events-none ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}>
        Regenerate response
      </div>
    </div>
  </div>
)}


          
        </div>
      </div>
      </div>
    </div>
  );
};

export default Message; 