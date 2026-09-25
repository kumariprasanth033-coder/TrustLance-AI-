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
      'Why is my escrow payment held?',
      'How does the AI Broker protect my project budget?'
    ],
    freelancer: [
      'How can I improve my AI Trust Score to Elite tier?',
      'Explain the escrow milestone release process',
      'What factors affect client AI matching?'
    ],
    admin: [
      'How many disputes are currently pending review?',
      'Audit the total escrow held in the Trust Vault',
      'What is the current average platform Trust Score?'
    ]
  };

  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Hello ${currentUser?.full_name || 'there'}! I am your TrustLance AI Assistant. I am directly synchronized with your live project database and escrow ledger. What would you like to verify or discuss?`,
      time: 'Just now'
    }
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

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { sender: 'user' as const, text: textToSend, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
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
          text: 'Unable to communicate with the AI engine right now. Please verify your connection.',
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
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-3.5 rounded-full shadow-lg shadow-blue-500/25 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
        aria-label="Open TrustLance AI Assistant"
      >
        <div className="relative">
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
        </div>
        <span className="font-semibold text-sm pr-1 hidden sm:inline">TrustLance AI</span>
      </button>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
          <div className="w-full sm:w-[440px] h-full bg-white dark:bg-[#151B2E] border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/70 dark:bg-[#0B1020]/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                    TrustLance AI Assistant
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/20">
                      v2.4
                    </span>
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <Database className="w-3 h-3 text-emerald-500" />
                    <span>Live MySQL Context Synced</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role Context Bar */}
            <div className="px-5 py-2 bg-blue-500/5 dark:bg-blue-500/10 border-b border-blue-500/15 text-[11px] text-blue-700 dark:text-blue-300 flex items-center justify-between">
              <span>Grounded in: <strong className="capitalize font-semibold">{currentUser?.role || 'Guest'} Session</strong></span>
              <span className="tabular-nums font-mono text-[10px] bg-white dark:bg-white/5 px-2 py-0.5 rounded border border-blue-200 dark:border-white/10">
                Gemini 3.8 Flash
              </span>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-xs shadow-md font-medium'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-white/5 shadow-xs font-medium'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className="text-[10px] mt-1.5 block opacity-60 text-right tabular-nums">
                      {msg.time}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 dark:bg-white/10 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400 p-2 font-medium">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  <span>Synthesizing database records with Gemini 3.8...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts */}
            <div className="px-5 py-2.5 bg-slate-50 dark:bg-[#0B1020]/50 border-t border-slate-200 dark:border-white/10">
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                Suggested Inquiries
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(defaultPrompts[role] || defaultPrompts.customer).map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="text-[11px] bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 hover:border-blue-500 dark:hover:border-blue-400 text-slate-800 dark:text-slate-300 font-medium px-2.5 py-1 rounded-xl transition-colors text-left truncate max-w-full shadow-2xs"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#151B2E]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything about projects, escrow, or scores..."
                  className="flex-1 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 focus:border-blue-500 focus:bg-white dark:focus:bg-[#0B1020] focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all shadow-2xs font-medium"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl transition-all shadow-md shadow-blue-500/20 shrink-0"
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
