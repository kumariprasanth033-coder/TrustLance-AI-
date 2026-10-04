import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, User, RefreshCw, Database, Shield } from 'lucide-react';
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
        className="fixed bottom-6 right-6 z-40 px-4 py-3.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 group bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-2 border-white/20 dark:border-[#151B2E] shadow-blue-500/35"
        aria-label="Open TrustLance AI Assistant"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0B1020]" />
        </div>
        <span className="font-extrabold text-sm tracking-tight pr-1 hidden sm:inline text-white">
          TrustLance AI
        </span>
      </button>

      {/* Slide-out Drawer Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm transition-opacity duration-300 ease-in-out animate-in fade-in">
          <div className="w-full sm:w-[460px] h-full bg-white dark:bg-[#0B1020] border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col transition-colors duration-300 ease-in-out animate-in slide-in-from-right bold-dark-text">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-[#151B2E] transition-colors duration-300 ease-in-out">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/20 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight bold-dark-text transition-colors duration-300">
                      TrustLance AI
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 font-extrabold border border-blue-300 dark:border-blue-700/60 transition-colors duration-300">
                      LIVE ASSISTANT
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-bold mt-0.5 transition-colors duration-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Synchronized with MySQL Ledger</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  title="Reset conversation"
                  className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors duration-200"
                  aria-label="Reset chat"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close assistant"
                  className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors duration-200"
                  aria-label="Close assistant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Role Context Bar */}
            <div className="px-5 py-2.5 bg-blue-50 dark:bg-[#111827] border-b border-blue-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-slate-200 flex items-center justify-between transition-colors duration-300 ease-in-out bold-dark-text">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>
                  Active Session:{' '}
                  <strong className="capitalize text-blue-700 dark:text-blue-300 font-extrabold">
                    {currentUser?.role || 'Customer'}
                  </strong>
                </span>
              </div>
              <span className="font-mono text-[11px] bg-white dark:bg-[#151B2E] text-slate-900 dark:text-slate-200 px-2 py-0.5 rounded-md border border-slate-300 dark:border-white/15 font-extrabold transition-colors duration-300">
                Gemini AI 3.8
              </span>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-100 dark:bg-[#070B16] transition-colors duration-300 ease-in-out">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-blue-500/25 border border-white/20">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed transition-all duration-200 ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-br-xs shadow-md font-bold'
                        : 'bg-white dark:bg-[#151B2E] text-slate-900 dark:text-[#F8FAFC] rounded-bl-xs border-2 border-slate-300 dark:border-white/10 shadow-md font-semibold bold-dark-text'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    <span
                      className={`text-[10px] mt-2 block font-mono font-bold tabular-nums transition-colors duration-200 ${
                        msg.sender === 'user'
                          ? 'text-blue-100 text-right'
                          : 'text-slate-600 dark:text-slate-400 text-left bold-dark-text'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-blue-600/30 font-bold">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#151B2E] border-2 border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-bold shadow-md max-w-sm transition-colors duration-200 bold-dark-text">
                  <div className="w-3 h-3 rounded-full bg-blue-600 animate-ping shrink-0" />
                  <span className="flex-1">Synthesizing database records with Gemini AI...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts */}
            <div className="px-5 py-3 bg-slate-50 dark:bg-[#111827] border-t border-slate-200 dark:border-white/10 transition-colors duration-300 ease-in-out bold-dark-text">
              <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-200 block mb-2 transition-colors duration-300 bold-dark-text">
                Suggested Inquiries
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(defaultPrompts[role] || defaultPrompts.customer).map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="text-xs bg-white dark:bg-[#151B2E] border-2 border-slate-300 dark:border-white/15 hover:border-blue-600 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-white/10 text-slate-900 dark:text-slate-100 hover:text-blue-700 dark:hover:text-blue-300 font-bold px-3 py-1.5 rounded-xl transition-all duration-200 text-left truncate max-w-full shadow-xs bold-dark-text"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#151B2E] transition-colors duration-300 ease-in-out bold-dark-text">
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
                  className="flex-1 bg-slate-50 dark:bg-[#070B16] text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 text-xs sm:text-sm px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-white/15 focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-[#0B1020] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 shadow-xs font-bold bold-dark-text"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="btn-primary-gradient px-4 py-3 rounded-xl font-bold flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
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
