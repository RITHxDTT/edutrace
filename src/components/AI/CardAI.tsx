"use client"
import { useState } from 'react';
import AiComponent from "@/components/AI/_components/AiComponent";
import StarComponent from "./_components/StarComponent";
import InputChat from "./_components/InputChat";

type ChatState = 'idle' | 'thinking' | 'answered';

function CardAI(){
    const [currentState, setCurrentState] = useState<ChatState>('idle');
    const [selectedQuestion, setSelectedQuestion] = useState<string>('');

    const handleSendMessage = (message: string) => {
        setSelectedQuestion(message);
        setCurrentState('thinking');
        setTimeout(() => {
            setCurrentState('answered');
        }, 2000);
    };

    return (
        <div className='w-139 h-162.5 flex items-center justify-center rounded-[16px]'>
            <div className="relative w-full h-full overflow-hidden rounded-2xl bg-white/60 backdrop-blur-md border border-white/20 shadow-sm flex items-center justify-center">
                <div className="absolute w-84.25 h-84.5 left-30 bottom-12 rounded-full bg-purple blur-[150px] mix-blend-multiply opacity-60"></div>
                <div className="absolute w-60 h-60 right-22 bottom-0 rounded-full bg-blue blur-[120px] mix-blend-multiply opacity-60"></div>
                <div className="absolute top-0 left-0 z-10 flex items-center p-4 gap-5 w-full h-17.5  text-black font-medium border-b border-gray-200">
                    <AiComponent width={40} height={40}/>
                    <div className="flex items-center justify-between w-full pr-2">
                        <div>
                            <h4>HRD ROOM AI Assistant</h4>
                            <p className="font-light text-[14px] text-gray-600">
                                Ask any question about your student or any report
                            </p>
                        </div>
                        <div className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
                            X
                        </div>
                    </div>
                </div>
                <div className='w-full h-full flex flex-col items-center justify-end pt-22 pb-4 p-2 text-gray-800 gap-4 overflow-hidden'>
                    <div className="w-full flex-1 flex flex-col justify-center px-4 overflow-y-auto">
                        {currentState === 'idle' && (
                            <div className="w-full flex flex-col items-center justify-center text-center">
                                <StarComponent width={50} height={50} />
                                <p className="mt-4 text-lg font-medium">
                                    Ask Our AI Anything
                                </p>
                            </div>
                        )}
                        {currentState !== 'idle' && (
                            <div className="w-full flex flex-col gap-4 justify-end pb-2">
                                <div className="flex justify-end items-center gap-2 self-end max-w-[85%] ml-auto">
                                    <div className="bg-white border border-purple-100 text-gray-800 px-4 py-2.5 rounded-2xl rounded-tr-none shadow-sm text-[14px]">
                                        {selectedQuestion}
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-purple-200 overflow-hidden shrink-0 border border-white">
                                        <AiComponent width={32} height={32}/>
                                    </div>
                                </div>

                                <div className="flex justify-start items-start gap-2 self-start max-w-[85%] mr-auto text-left">
                                    <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-white shrink-0 text-xs font-bold shadow-md">
                                        <StarComponent width={20} height={20} color="white" />
                                    </div>
                                    
                                    <div className="bg-white border border-gray-100 text-gray-800 px-4 py-2.5 rounded-2xl shadow-sm text-[14px]">
                                        {currentState === 'thinking' ? (
                                            <div className="flex items-center gap-1.5 py-1 px-2">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                                            </div>
                                        ) : (
                                            <p className="leading-relaxed">
                                                The tasks with the lowest average scores are <strong>
                                                Database Normalization Assignment</strong> 
                                                with an average score of 58%, followed by <strong>
                                                System Design Case Study</strong> at 61%, and <strong>
                                                Algorithm Complexity Quiz</strong> at 64%.
                                            </p>
                                        )}
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>

                    <div className='w-full flex relative z-10'>
                        <InputChat 
                            onSendMessage={handleSendMessage} 
                            showSuggestions={currentState === 'idle'} 
                        />
                    </div>

                </div>

            </div>
        </div>
    )
}

export default CardAI;