import React from 'react';

const SearchBar = ({ isDarkMode }) => {
  return (
    <div className="px-2 rounded-xl mx-1 mt-4 mb-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isDarkMode ? "#9ca3af" : "#6b7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input 
          type="text" 
          className={`pl-10 w-full py-3 rounded-lg ${
            isDarkMode 
              ? 'bg-white/5 border border-neutral-700/20 text-white placeholder-neutral-400' 
              : 'bg-black/5 border-none text-gray-700 placeholder-gray-400'
          } focus:ring-2 focus:ring-blue-300 text-sm focus:outline-none transition-all duration-300`}
          placeholder="Search conversations" 
        />
      </div>
    </div>
  );
};

export default SearchBar; 