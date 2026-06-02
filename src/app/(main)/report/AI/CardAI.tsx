"use client";
import { useState, useEffect, useRef } from "react";
import AiComponent from "./_components/AiComponent";
import StarComponent from "./_components/StarComponent";
import InputChat from "./_components/InputChat";
import Image from "next/image";

type ChatState = "idle" | "thinking" | "answered";
interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

interface CardAIProps {
  onClose?: () => void;
}

const AI_STREAM_ENDPOINT = "/api/ai/ask";

function CardAI({ onClose }: CardAIProps) {
  const [currentState, setCurrentState] = useState<ChatState>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const revealTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, currentState]);

  useEffect(() => {
    return () => {
      if (revealTimeoutRef.current) {
        clearTimeout(revealTimeoutRef.current);
      }
    };
  }, []);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    setCurrentState("thinking");

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: messageText,
    };
    setMessages((prev) => [...prev, userMessage]);

    const aiMessageId = `ai-${Date.now()}`;
    let fullAccumulatedReply = "";
    let displayCharIndex = 0;
    let eventCount = 0;

    const revealNextCharacter = () => {
      if (displayCharIndex < fullAccumulatedReply.length) {
        displayCharIndex++;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId 
              ? { ...msg, text: fullAccumulatedReply.substring(0, displayCharIndex) } 
              : msg
          )
        );
        revealTimeoutRef.current = setTimeout(revealNextCharacter, 20);
      }
    };

    try {
      setCurrentState("answered");
      setMessages((prev) => [...prev, { id: aiMessageId, sender: "ai", text: "" }]);

      const url = new URL(AI_STREAM_ENDPOINT, window.location.origin);
      url.searchParams.append("question", messageText);

      console.log("Opening EventSource to:", url.toString());
      const eventSource = new EventSource(url.toString());
      const startTime = Date.now();

      eventSource.addEventListener("answer", (event) => {
        eventCount++;
        const now = Date.now();
        console.log(`[${now - startTime}ms] Event #${eventCount}:`, event.data.substring(0, 100));
        
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.text) {
            const previousLength = fullAccumulatedReply.length;
            fullAccumulatedReply += parsed.text;
            console.log(`Accumulated text length: ${fullAccumulatedReply.length}`);
            
            if (displayCharIndex === previousLength) {
              revealNextCharacter();
            }
          }
        } catch (error) {
          console.error("Failed to parse answer event:", error);
        }
      });

      eventSource.addEventListener("done", () => {
        console.log(`Stream completed after ${eventCount} events in ${Date.now() - startTime}ms`);
        eventSource.close();
      });

      eventSource.onerror = (error) => {
        console.error("EventSource error after", eventCount, "events:", error);
        if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
        eventSource.close();
        setCurrentState("answered");

        const errorMessage: Message = {
          id: `ai-error-${Date.now()}`,
          sender: "ai",
          text: fullAccumulatedReply || "Sorry, the streaming connection was interrupted. Please try again.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      };
    } catch (error) {
      console.error("Streaming error:", error);
      if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
      setCurrentState("answered");

      const errorText = error instanceof Error ? error.message : "Unknown error";
      const errorMessage: Message = {
        id: `ai-error-${Date.now()}`,
        sender: "ai",
        text: `Sorry, there was an issue: ${errorText}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="w-139 h-162.5 flex items-center justify-center rounded-[16px] bg-white/90 overflow-hidden isolation-isolate">
      <div className="relative w-full h-full overflow-hidden rounded-2xl backdrop-blur-md border border-white/80 shadow-sm flex items-center justify-center">
        <div className="absolute w-84.25 h-84.5 left-30 bottom-12 rounded-full bg-strong-purple blur-[150px] mix-blend-normal opacity-60"></div>
        <div className="absolute w-60 h-60 right-22 bottom-0 rounded-full bg-strong-blue blur-[120px] mix-blend-normal opacity-60"></div>
        <div className="absolute top-0 left-0 z-10 flex items-center p-4 gap-5 w-full h-17.5 text-black font-medium border-b border-gray-200 bg-white/80">
          <div>
            <AiComponent width={40} height={40} />
          </div>
          <div className="flex items-center justify-between w-full pr-2">
            <div>
              <h4>HRD ROOM AI Assistant</h4>
              <p className="font-light text-[14px] text-gray-600">
                Ask any question about your student or any report
              </p>
            </div>
            <div
              onClick={onClose}
              className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
            >
              X
            </div>
          </div>
        </div>
        <div className="w-full h-full flex flex-col items-center justify-end pt-22 pb-4 p-2 text-gray-800 gap-4 overflow-hidden">
          <div className="w-full flex-1 flex flex-col justify-start px-4 pt-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
            <div className="w-full flex flex-col gap-6 min-h-full pb-2">
              {currentState === "idle" && messages.length === 0 && (
                <div className="w-full flex flex-col items-center justify-center text-center my-auto">
                  <StarComponent width={50} height={50} />
                  <p className="mt-4 text-lg font-medium">
                    Ask Our AI Anything
                  </p>
                </div>
              )}
              {messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`w-full flex flex-col gap-2 ${index === 0 ? "mt-auto" : ""}`}
                >
                  {msg.sender === "user" ? (
                    <div className="flex justify-end items-center gap-2 self-end max-w-[85%] ml-auto">
                      <div className="bg-white/80 border border-white text-gray-800 px-4 py-2.5 rounded-2xl shadow-sm text-[14px] z-30">
                        {msg.text}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-purple-200 overflow-hidden shrink-0 border border-white">
                        <Image
                          src="/images/ai/instructor.jpg"
                          unoptimized
                          width={20}
                          height={20}
                          alt="User"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-start items-start gap-2 self-start max-w-[85%] mr-auto text-left">
                      <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-white shrink-0 text-xs font-bold shadow-md">
                        <Image
                          src="/images/ai/white_Logo.png"
                          unoptimized
                          alt="HRD Avatar"
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                      </div>
                      <div className="bg-white/80 border border-white text-gray-800 px-4 py-2.5 rounded-2xl shadow-sm text-[14px] z-30">
                        <p className="leading-relaxed whitespace-pre-wrap wrap-break-word">{msg.text}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {currentState === "thinking" && (
                <div
                  className={`flex justify-start items-start gap-2 self-start max-w-[85%] mr-auto text-left animate-in fade-in duration-200 ${messages.length === 0 ? "mt-auto" : ""}`}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-white shrink-0 text-xs font-bold shadow-md">
                    <Image
                      src="/images/ai/white_Logo.png"
                      unoptimized
                      alt="HRD Avatar"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  </div>
                  <div className="bg-white/80 border border-white text-gray-800 px-4 py-2.5 rounded-2xl shadow-sm text-[14px] z-30">
                    <div className="flex items-center gap-1.5 py-1 px-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="w-full flex relative z-10">
            <InputChat
              onSendMessage={handleSendMessage}
              showSuggestions={messages.length === 0 && currentState === "idle"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardAI;