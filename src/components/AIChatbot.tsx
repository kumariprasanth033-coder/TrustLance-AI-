import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, User, RefreshCw, Database, Shield, CheckCircle2 } from 'lucide-react';
import { aiAssistantApi, authApi } from '../services/api';

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const currentUser = authApi.getCurrentUser();
  const role = currentUser?.role || 'customer';

  const defaultPrompts: Record<string, string[]> = {
    customer: [
      'What is my project status?',
      'Why is my escrow payment held in vault?',
      'How does the AI Broker protect my project budget?'
    ],
    freelancer: [
      'How can I improve my AI Trust Score to Elite tier?',
      'Explain the escrow milestone release process',
      'What factors affect client AI matching score?'
    ],
    admin: [
      'How many disputes are currently pending review?',
      'Audit the total escrow held in the Trust Vault',
      'What is the current platform average Trust Score?'
    ]
  };

  const getInitialMessage = () => ({
    sender: 'ai' as const,
    text: `Hello ${currentUser?.full_name || 'there'}! I am your TrustLance AI Operations Assistant. I am directly synchronized with your live project database, escrow ledger, and verification engine. How can I assist you today?`,
    time: 'Just now'
  });

  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    getInitialMessage()
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleResetChat = () => {
    setMessages([getInitialMessage()]);
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    if (!messageText) setInput('');
    setLoading(true);

    try {
      const response = await aiAssistantApi.ask(textToSend, role);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai' as const,
          text: response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai' as const,
          text: 'Unable to communicate with the AI engine right now. Please verify your connection or try again.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 group bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-2 border-white/20 shadow-blue-500/30"
        aria-label="Open TrustLance AI Assistant"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white" />
        </div>
        <span className="font-bold text-sm tracking-tight pr-1 hidden sm:inline text-white">
          TrustLance AI
        </span>
      </button>

      {/* Slide-out Drawer Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
          <div className="w-full sm:w-[460px] h-full bg-white dark:bg-[#0c1224] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#121930]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 border border-white/10 shrink-0">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base tracking-tight">
                      TrustLance AI Assistant
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-extrabold border border-blue-200 dark:border-blue-700">
                      LIVE
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Synchronized with MySQL Ledger</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  title="Reset conversation"
                  className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Reset chat"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close assistant"
                  className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close assistant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Role Context Bar */}
            <div className="px-5 py-2.5 bg-blue-50 dark:bg-[#15203d] border-b border-blue-200 dark:border-blue-900/50 text-xs font-semibold text-blue-950 dark:text-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>
                  Active Context:{' '}
                  <strong className="capitalize text-blue-700 dark:text-blue-300 font-bold">
                    {currentUser?.role || 'Customer'} Session
                  </strong>
                </span>
              </div>
              <span className="font-mono text-[11px] bg-white dark:bg-[#0c1224] text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-300 dark:border-slate-700 font-bold">
                Gemini AI Engine
              </span>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-100/70 dark:bg-[#090e1c]">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-blue-500/20 border border-white/10">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-br-xs shadow-md font-semibold'
                        : 'bg-white dark:bg-[#17223d] text-slate-900 dark:text-slate-100 rounded-bl-xs border border-slate-200/90 dark:border-slate-700/80 shadow-md font-medium'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    <span
                      className={`text-[10px] mt-2 block font-mono font-semibold tabular-nums ${
                        msg.sender === 'user'
                          ? 'text-blue-100 text-right'
                          : 'text-slate-500 dark:text-slate-400 text-left'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-blue-600/20 font-bold">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#17223d] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold shadow-md max-w-sm">
                  <div className="w-3 h-3 rounded-full bg-blue-600 animate-ping shrink-0" />
                  <span className="flex-1">Synthesizing database records with Gemini AI...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts */}
            <div className="px-5 py-3 bg-slate-50 dark:bg-[#10172c] border-t border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-2">
                Suggested Inquiries
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(defaultPrompts[role] || defaultPrompts.customer).map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="text-xs bg-white dark:bg-[#1a233b] border border-slate-300 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-[#232f50] text-slate-800 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 font-semibold px-3 py-1.5 rounded-xl transition-all duration-150 text-left truncate max-w-full shadow-xs"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121930]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2.5"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about projects, escrow, or trust scores..."
                  className="flex-1 bg-slate-50 dark:bg-[#090e1c] text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-[#0c1224] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all shadow-xs font-semibold"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="btn-primary-gradient px-4 py-3 rounded-xl font-bold flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
