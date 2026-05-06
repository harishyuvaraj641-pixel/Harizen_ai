"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Cpu, Paperclip, X, Copy, Check } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import ReactMarkdown from "react-markdown";

export default function ChatUI() {
  const { 
    messages, 
    input, 
    setInput, 
    attachedImage, 
    handleImageUpload, 
    removeImage, 
    selectedModel,
    setSelectedModel,
    isLoading, 
    sendMessage, 
    messagesEndRef 
  } = useChat();
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const AVAILABLE_MODELS = [
    { id: "moonshotai/kimi-k2.6", name: "Kimi K2.6 (Thinking)" },
    { id: "qwen/qwen3.5-122b-a10b", name: "Qwen 3.5 122B (Reasoning)" },
    { id: "meta/llama-3.1-405b-instruct", name: "Llama 3.1 405B" },
    { id: "meta/llama-3.1-70b-instruct", name: "Llama 3.1 70B" },
    { id: "openai/gpt-oss-120b", name: "GPT-OSS 120B" },
    { id: "mistralai/mixtral-8x22b-instruct-v0.1", name: "Mixtral 8x22B" },
  ];

  return (
    <section id="chat" className="relative w-full min-h-screen bg-[#050810] flex items-center justify-center py-8 md:py-20 px-4 md:px-6 overflow-hidden">
      
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00f0ff]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0066ff]/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-4xl glass-panel rounded-2xl border border-[#00f0ff]/20 shadow-[0_0_50px_rgba(0,240,255,0.05)] overflow-hidden flex flex-col h-[85dvh] md:h-[80vh] relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#00f0ff]/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00f0ff] to-[#0066ff] p-[1px]">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                <Cpu size={20} className="text-[#00f0ff]" />
              </div>
            </div>
            <div>
              <h3 className="font-['Orbitron'] font-bold text-white tracking-widest text-glow text-lg">HARIZEN AI</h3>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse box-glow" />
                <span className="text-xs text-[#00f0ff] font-mono tracking-widest">ONLINE</span>
              </div>
            </div>
          </div>
          
          {/* Model Selector */}
          <div>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-black/50 border border-[#00f0ff]/20 text-[#00f0ff] text-xs md:text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#00f0ff]/50 cursor-pointer custom-scrollbar"
            >
              {AVAILABLE_MODELS.map((model) => (
                <option key={model.id} value={model.id} className="bg-black text-[#00f0ff]">
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Welcome Message */}
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl rounded-tl-sm px-5 py-4 glass-panel border-[#00f0ff]/20 bg-black/60 shadow-[0_0_15px_rgba(0,240,255,0.05)]">
              <p className="text-gray-200 text-sm md:text-base leading-relaxed">
                Uplink established. I am Harizen AI, a next-generation cognitive system designed by Harish Yuvaraj. How may I assist you today?
              </p>
            </div>
          </div>

          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                    msg.role === 'user' 
                      ? 'rounded-tr-sm bg-[#0066ff]/20 border border-[#0066ff]/30 text-white' 
                      : 'rounded-tl-sm glass-panel border-[#00f0ff]/20 bg-black/60 text-gray-200 shadow-[0_0_15px_rgba(0,240,255,0.05)]'
                  }`}
                >
                  {msg.image && (
                    <div className="mb-3">
                      <img src={msg.image} alt="User attached" className="max-w-full rounded-lg max-h-64 object-contain border border-white/20" />
                    </div>
                  )}
                  <div className="text-sm md:text-base leading-relaxed font-light prose prose-invert max-w-none">
                    <ReactMarkdown
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || "");
                          const codeText = String(children).replace(/\n$/, "");
                          const id = `code-${idx}-${codeText.substring(0, 10)}`;

                          if (!inline) {
                            return (
                              <div className="relative group my-4 rounded-lg bg-black/80 border border-[#00f0ff]/20 overflow-hidden">
                                <div className="flex justify-between items-center px-4 py-2 bg-black/40 border-b border-[#00f0ff]/20">
                                  <span className="text-xs font-mono text-[#00f0ff] uppercase">{match?.[1] || "code"}</span>
                                  <button
                                    onClick={() => copyToClipboard(codeText, id)}
                                    className="text-gray-400 hover:text-[#00f0ff] transition-colors"
                                  >
                                    {copiedId === id ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                  </button>
                                </div>
                                <div className="p-4 overflow-x-auto custom-scrollbar text-sm font-mono text-gray-300">
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                </div>
                              </div>
                            );
                          }
                          return (
                            <code className="bg-[#00f0ff]/10 text-[#00f0ff] px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm px-5 py-4 glass-panel border-[#00f0ff]/20 bg-black/60">
                <div className="flex gap-1.5 items-center h-5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-1" />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[#00f0ff]/10 bg-black/60 backdrop-blur-md">
          {attachedImage && (
            <div className="mb-3 relative inline-block">
              <img src={attachedImage} alt="Preview" className="h-20 rounded-md border border-[#00f0ff]/30" />
              <button 
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-black/80 text-white rounded-full p-1 border border-[#00f0ff]/50 hover:bg-[#ff2d2d]/20 hover:text-[#ff2d2d] transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <form 
            onSubmit={sendMessage}
            className="relative flex items-end gap-2 max-w-4xl mx-auto"
          >
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 mb-1 rounded-xl bg-transparent border border-transparent hover:bg-[#00f0ff]/10 text-gray-400 hover:text-[#00f0ff] transition-all"
            >
              <Paperclip size={20} />
            </button>
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Transmit message to Harizen AI..."
                className="w-full bg-black/50 border border-[#00f0ff]/20 rounded-xl pl-5 pr-14 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/50 transition-all resize-none min-h-[56px] max-h-[150px] font-light custom-scrollbar"
                rows={1}
              />
              <button
                type="submit"
                disabled={(!input.trim() && !attachedImage) || isLoading}
                className="absolute right-3 bottom-3 p-2 rounded-lg bg-[#00f0ff]/10 text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed group box-glow"
              >
                <Send size={20} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </form>
          <div className="text-center mt-3 text-[10px] text-gray-600 font-mono tracking-widest">
            ENCRYPTED CONNECTION // HARIZEN AI MAY PRODUCE INACCURATE RESPONSES
          </div>
        </div>

      </div>
    </section>
  );
}
