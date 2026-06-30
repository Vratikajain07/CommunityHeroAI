import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User as UserIcon, 
  ArrowRight,
  HelpCircle,
  Clock
} from "lucide-react";
import GlassCard from "./GlassCard";
import { User, ChatMessage } from "../types";
import { apiChat } from "../lib/api";

interface ChatbotProps {
  user: User;
}

export default function Chatbot({ user }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m_welcome",
      role: "model",
      text: `Hello @${user.username}! I am **HeroBot**, your Community Hero AI assistant. 
      
I can help you:
* Guide you on how to **file new complaints** with GPS.
* **Track active complaint files** in our local database.
* Give information about municipal **departments and responsibilities**.
* Offer tips on **general civic awareness and safety**.

What can I help you resolve today?`,
      createdAt: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || sending) return;

    const userMsg: ChatMessage = {
      id: "m_" + Math.random().toString(36).substr(2, 9),
      role: "user",
      text: textToSend,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setSending(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role,
        content: m.text
      }));
      const data = await apiChat(textToSend, chatHistory);

      setMessages(prev => [...prev, {
        id: "m_" + Math.random().toString(36).substring(2, 11),
        role: "model",
        text: data.reply || "No response received",
        createdAt: new Date().toISOString()
      }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: "m_err_" + Math.random().toString(36).substr(2, 9),
        role: "model",
        text: "My apologies, but I had difficulty reaching the core AI server. Please make sure your network is stable and retry.",
        createdAt: new Date().toISOString()
      }]);
    } finally {
      setSending(false);
    }
  };

  // Predefined prompt triggers
  const quickQuestions = [
    "How to file a new complaint?",
    "Check status of CHA000101",
    "What does Electricity Dept do?",
    "Show community safety tips"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Floating Toggle button with ping ring */}
      <button
        id="chatbot-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 flex items-center justify-center text-white shadow-[0_4px_25px_rgba(14,165,233,0.45)] hover:scale-105 active:scale-95 hover:shadow-[0_4px_30px_rgba(14,165,233,0.6)] cursor-pointer transition-all relative group"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform rotate-90" />
        ) : (
          <>
            <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping pointer-events-none" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white pointer-events-none" />
            <MessageSquare className="w-6 h-6" />
          </>
        )}
      </button>

      {/* Slide-out Sidebar Drawer */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] mt-4 rounded-3xl bg-white border border-slate-150 shadow-md flex flex-col justify-between overflow-hidden animate-fade-in relative">
          
          {/* Header */}
          <div className="bg-slate-50/80 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5 text-left">
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100">
                <Bot className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-slate-800">Community HeroBot</h4>
                <p className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span>Gemini Grounded Assistant</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conversation Bubble Panel */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-left ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Profile Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                  msg.role === "user" 
                    ? "bg-sky-50 text-sky-600 border border-sky-100" 
                    : "bg-slate-100 text-slate-600 border border-slate-150"
                }`}>
                  {msg.role === "user" ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Dialog Bubble */}
                <div className={`max-w-[75%] rounded-xl px-4 py-2.5 text-xs leading-relaxed font-sans border ${
                  msg.role === "user"
                    ? "bg-sky-50 border-sky-150 text-slate-800 font-semibold shadow-xs"
                    : "bg-slate-50 border border-slate-150 text-slate-700"
                }`}>
                  {/* Simplistic formatting support for bold/bullets */}
                  {msg.text.split("\n").map((line, lIdx) => {
                    let formatted = line;
                    // Format lists
                    if (formatted.startsWith("* ")) {
                      return <li key={lIdx} className="list-disc ml-4 mt-1">{formatted.replace("* ", "")}</li>;
                    }
                    // Format bold tags manually
                    const boldRegex = /\*\*(.*?)\*\*/g;
                    const parts = [];
                    let lastIdx = 0;
                    let match;
                    while ((match = boldRegex.exec(formatted)) !== null) {
                      if (match.index > lastIdx) {
                        parts.push(formatted.substring(lastIdx, match.index));
                      }
                      parts.push(<strong key={match.index} className="text-sky-600 font-bold">{match[1]}</strong>);
                      lastIdx = boldRegex.lastIndex;
                    }
                    if (lastIdx < formatted.length) {
                      parts.push(formatted.substring(lastIdx));
                    }

                    return (
                      <p key={lIdx} className={lIdx > 0 ? "mt-2" : ""}>
                        {parts.length > 0 ? parts : formatted}
                      </p>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* AI typing skeleton loading */}
            {sending && (
              <div className="flex gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 border border-slate-150 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex space-x-1.5 items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestion Quickchips */}
          {messages.length === 1 && (
            <div className="px-4 pb-3 flex flex-wrap gap-1.5 text-left z-10 relative">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-[10px] text-slate-600 hover:text-sky-600 transition-all cursor-pointer truncate max-w-full font-medium shadow-xs"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Footer Input Controls */}
          <div className="bg-slate-55/60 px-4 py-3 border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask HeroBot something..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputText)}
              className="flex-1 bg-white border border-slate-200 focus:border-sky-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all"
            />
            <button
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim() || sending}
              className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
