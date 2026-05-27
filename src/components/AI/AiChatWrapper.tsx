"use client"
import { useState } from "react";
import AiComponent from "@/components/AI/_components/AiComponent";
import CardAI from "@/components/AI/CardAI";

export default function AiChatWrapper() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="absolute bottom-6 right-6 flex flex-col items-end gap-4 z-50">
            {isOpen && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-200 origin-bottom-right shadow-2xl">
                    <CardAI onClose={() => setIsOpen(false)} />
                </div>
            )}

            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="cursor-pointer transition-transform duration-200 active:scale-95 hover:scale-105"
                aria-label="Toggle AI Assistant"
            >
                <AiComponent width={70} height={70} />
            </button>
        </div>
    );
}