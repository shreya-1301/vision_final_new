import React from 'react';
import { motion } from 'framer-motion';

const MOCK_CONVERSATIONS = [
  {
    title: "What's the best approach to this problem?",
    date: "Yesterday",
    messages: 3
  },
  {
    title: "How does JSW compare to other steel com",
    date: "3 days ago",
    messages: 12
  },
  {
    title: "Tell me about our production targets for next",
    date: "Last week",
    messages: 6
  },
  {
    title: "What are the key metrics for our productio?",
    date: "Last week",
    messages: 4
  }
];

const RecentConversations = ({ isDarkMode }) => {
  return (
    <>
      <div className="px-3 pt-2">
        <h2 className={`text-sm font-normal mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Recent Conversations
        </h2>
      </div>
      
      <div className="px-1 flex-grow overflow-y-auto relative">
        {MOCK_CONVERSATIONS.map((chat, index) => (
          <motion.div 
            key={index}
            className={`p-3 space-y-2 mb-2 rounded-xl cursor-pointer ${
              isDarkMode ? 'hover:bg-gray-100/10 text-gray-700' : 'hover:bg-gray-200 text-gray-700'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + (index * 0.05), duration: 0.3 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm font-medium w-full whitespace-nowrap overflow-hidden relative pr-4">
                <span className="bg-gradient-to-r from-gray-700 via-gray-700 to-transparent via-70% to-90% bg-clip-text text-transparent">
                  {chat.title}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default RecentConversations; 