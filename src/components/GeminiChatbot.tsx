import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Zap,
  Brain,
  Bot,
  User as UserIcon,
  Trash2,
  Minimize2,
  Maximize2,
  ChevronDown,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
  mode?: 'fast' | 'general' | 'complex';
}

type ModelMode = 'fast' | 'general' | 'complex';

const SUGGESTED_PROMPTS = [
  'What AWS certifications does Sunanda hold?',
  'Explain her experience with Terraform & Kubernetes',
  'How does she implement CI/CD with Jenkins & GitHub Actions?',
  'What is her approach to CloudWatch & Prometheus observability?',
];

const GeminiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [mode, setMode] = useState<ModelMode>('general');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content: `Hello! I am **Sunanda Sri Karumuri's AWS Cloud Ops & DevOps AI Advisor**.\n\nI can provide deep technical insights into Sunanda's cloud architectures, AWS certifications (SAA-C03 & Cloud Practitioner), Terraform IaC, Kubernetes clusters, and CI/CD pipelines.\n\nHow can I assist your engineering team today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.5-flash',
      mode: 'general',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const newTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: textToSend,
      timestamp: newTimestamp,
      mode,
    };

    const updatedHistory = [...messages, newUserMsg];
    setMessages(updatedHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send conversation payload to server-side Gemini route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          mode: mode,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'model',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: data.modelUsed,
          mode: data.mode,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.error || 'Failed to receive AI response');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'model',
        content: `⚠️ **Unable to generate response**: ${err?.message || 'Please verify network or API configurations.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        content: `Conversation reset. Ready to answer questions about Sunanda's AWS architecture and cloud experience!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'gemini-3.5-flash',
        mode,
      },
    ]);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <aside aria-label="Gemini AI Assistant" className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Launcher Trigger - Compact Icon */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="open-gemini-chat-btn"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Open Cloud AI Assistant"
            title="Ask Cloud AI (Gemini 3)"
            className="group relative w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-[0_4px_20px_rgba(14,165,233,0.45)] hover:shadow-[0_6px_25px_rgba(14,165,233,0.65)] border border-sky-400/40 backdrop-blur-md cursor-pointer transition-all duration-300"
          >
            <div className="relative flex items-center justify-center">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-300 rounded-full ring-2 ring-[#060913]" />
            </div>
            
            {/* Tooltip on hover */}
            <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#0c1427]/95 text-slate-100 text-[11px] font-['Space_Grotesk',sans-serif] font-medium border border-sky-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
              Ask Cloud AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="gemini-chat-window"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`bg-[#0c1427] border border-sky-500/30 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col transition-all duration-300 ${
              isExpanded
                ? 'w-[95vw] sm:w-[650px] h-[88vh] max-h-[850px]'
                : 'w-[92vw] sm:w-[420px] h-[600px] max-h-[85vh]'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0c1427] via-[#0f1d3a] to-[#0a152d] border-b border-sky-500/20 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md border border-sky-400/40">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-100 tracking-tight">Sunanda AI Advisor</h3>
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      Live
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                    AWS Ops & DevOps Knowledge Base
                  </p>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1.5 text-slate-400">
                <button
                  onClick={handleClearHistory}
                  title="Reset conversation"
                  className="p-2 hover:text-slate-100 hover:bg-sky-500/10 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Minimize' : 'Expand window'}
                  className="p-2 hover:text-slate-100 hover:bg-sky-500/10 rounded-lg transition-colors cursor-pointer hidden sm:block"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-2 hover:text-slate-100 hover:bg-sky-500/10 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Model Mode Selector Bar */}
            <div className="bg-[#060913] border-b border-sky-500/15 px-3 py-2 flex items-center justify-between gap-1 overflow-x-auto text-[11px] font-mono">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider pl-1 hidden sm:inline">
                Model Engine:
              </span>

              <div className="flex items-center gap-1 w-full sm:w-auto justify-between sm:justify-end">
                {/* Low-Latency Mode */}
                <button
                  type="button"
                  onClick={() => setMode('fast')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                    mode === 'fast'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                      : 'bg-white/5 text-slate-400 border-transparent hover:text-slate-200 hover:bg-sky-500/10'
                  }`}
                  title="Low-Latency Fast Responses (gemini-3.1-flash-lite)"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fast Lite</span>
                </button>

                {/* General Mode */}
                <button
                  type="button"
                  onClick={() => setMode('general')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                    mode === 'general'
                      ? 'bg-sky-500/25 text-sky-200 border-sky-400/50 shadow-sm'
                      : 'bg-white/5 text-slate-400 border-transparent hover:text-slate-200 hover:bg-sky-500/10'
                  }`}
                  title="General Cloud Q&A (gemini-3.5-flash)"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>Flash 3.5</span>
                </button>

                {/* High Thinking Mode */}
                <button
                  type="button"
                  onClick={() => setMode('complex')}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                    mode === 'complex'
                      ? 'bg-indigo-500/25 text-indigo-200 border-indigo-400/50 shadow-sm'
                      : 'bg-white/5 text-slate-400 border-transparent hover:text-slate-200 hover:bg-sky-500/10'
                  }`}
                  title="High Thinking Reasoning Mode (gemini-3.1-pro-preview with ThinkingLevel.HIGH)"
                >
                  <Brain className="w-3.5 h-3.5 text-indigo-400" />
                  <span>High Thinking</span>
                </button>
              </div>
            </div>

            {/* Scrollable Message Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm bg-[radial-gradient(#0284c715_1px,transparent_1px)] bg-[size:16px_16px]">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'model' && (
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex-shrink-0 flex items-center justify-center text-white mt-1 shadow-sm">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed relative group ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-br-none shadow-md font-medium'
                        : 'bg-[#060913]/90 text-slate-200 border border-sky-500/20 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {/* Model & Mode Badge for Assistant */}
                    {msg.role === 'model' && (
                      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-sky-500/15 text-[10px] font-mono text-slate-400">
                        <span className="flex items-center gap-1 text-slate-300">
                          {msg.mode === 'fast' && <Zap className="w-3 h-3 text-amber-400" />}
                          {msg.mode === 'complex' && <Brain className="w-3 h-3 text-indigo-400" />}
                          {msg.mode === 'general' && <Sparkles className="w-3 h-3 text-sky-400" />}
                          {msg.modelUsed || (msg.mode === 'complex' ? 'gemini-3.1-pro-preview' : 'gemini-3.5-flash')}
                        </span>
                        <button
                          onClick={() => copyToClipboard(msg.id, msg.content)}
                          className="opacity-0 group-hover:opacity-100 hover:text-slate-100 transition-opacity p-0.5 cursor-pointer"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}

                    {/* Message Body rendering */}
                    <div className="whitespace-pre-wrap break-words space-y-1.5">
                      {msg.content}
                    </div>

                    <div
                      className={`text-[9px] mt-1.5 font-mono ${
                        msg.role === 'user' ? 'text-sky-100 text-right' : 'text-slate-500'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-xl bg-sky-500/20 border border-sky-500/40 flex-shrink-0 flex items-center justify-center text-sky-300 mt-1">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start items-start"
                >
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white mt-1 animate-pulse">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-[#060913]/90 border border-sky-500/20 rounded-2xl rounded-bl-none p-3.5 text-xs text-slate-300 max-w-[80%] flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 rounded-full bg-cyan-300 animate-bounce" />
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">
                      {mode === 'complex'
                        ? 'Reasoning with High Thinking Mode...'
                        : mode === 'fast'
                        ? 'Streaming low-latency response...'
                        : 'Generating insights with Gemini...'}
                    </span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            {messages.length <= 2 && !isLoading && (
              <div className="px-4 py-2 bg-[#060913] border-t border-sky-500/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider flex-shrink-0">
                  Suggestions:
                </span>
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[11px] text-slate-300 hover:text-slate-100 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer flex-shrink-0"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form Area */}
            <div className="p-3.5 bg-[#080d1a] border-t border-sky-500/20">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-end gap-2"
              >
                <div className="flex-1 bg-[#0c1427] border border-sky-500/25 focus-within:border-sky-400 rounded-2xl px-3.5 py-2 transition-colors">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      mode === 'complex'
                        ? 'Ask a complex architecture question (High Thinking)...'
                        : mode === 'fast'
                        ? 'Quick question (Low-Latency Flash Lite)...'
                        : "Ask anything about Sunanda's AWS & DevOps experience..."
                    }
                    rows={1}
                    className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-xs focus:outline-none resize-none max-h-24 font-normal"
                    style={{ minHeight: '24px' }}
                  />
                </div>

                <button
                  type="submit"
                  id="send-gemini-msg-btn"
                  disabled={!inputMessage.trim() || isLoading}
                  className="w-10 h-10 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all duration-200 shadow-md flex-shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-2 px-1">
                <span>Press Enter to send • Shift+Enter for new line</span>
                <span>Gemini 3 Suite</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};

export default GeminiChatbot;
