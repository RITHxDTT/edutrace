"use client"
import { Send } from 'iconsax-react'
import React, { useState } from 'react'

interface InputChatProps {
  onSendMessage: (message: string) => void;
  showSuggestions: boolean;
}

export default function InputChat({ onSendMessage, showSuggestions }: InputChatProps) {
  const [inputValue, setInputValue] = useState('');

  const suggestions = [
    "Which tasks have the lowest average scores?",
    "Which students submitted late most frequently?",
    "Which students may be at risk of failing?"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    onSendMessage(inputValue);
    setInputValue('');
  };

  return (
    <div className='w-full flex flex-col p-2 gap-4 text-[14px]'>
        {showSuggestions && (
          <div className='flex flex-col items-start justify-start gap-2'>
              <p className='font-medium text-gray-600'>Suggestions on what to ask Our AI</p>
              {suggestions.map((text, idx) => (
                <button 
                  key={idx}
                  type="button"
                  onClick={() => onSendMessage(text)}
                  className='bg-white/50 border border-white p-2 rounded-md hover:bg-white/80 hover:border-purple-300 transition-all text-left w-auto'
                >
                  {text}
                </button>
              ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className='w-full mx-auto p-1 flex items-center bg-white border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-purple-200 focus-within:border-purple-400'>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder='Ask me anything about your student performance' 
              className='w-full pl-3 pr-2 py-2 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none'
            />
            <button type='submit' className='pr-2 rounded-lg hover:opacity-90 active:scale-95 transition-all shrink-0'>
              <Send size={25} color="blue" />
            </button>
        </form>
    </div>
  )
}