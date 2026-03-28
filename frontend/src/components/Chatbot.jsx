import React, { useEffect, useState, useContext, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Mic, MicOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hello! I am your AI Gov Assistant. How can I help you discover schemes today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef();

  // Voice Interaction Logic
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { content: userMessage, role: 'user' }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await api.post('/chatbot', { message: userMessage });
      const botReply = res.data.reply;
      const schemesFound = res.data.schemes || [];

      let fullReply = botReply;
      if (schemesFound.length > 0) {
        fullReply += " " + schemesFound.map(s => `\n- ${s.name}`).join('');
      }

      setMessages(prev => [...prev, { content: fullReply, role: 'bot' }]);
    } catch (error) {
      setMessages(prev => [...prev, { content: "Sorry, I am having trouble connecting to the server.", role: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
            className="glassmorphism w-[380px] sm:w-[420px] h-[600px] max-h-[85vh] rounded-3xl flex flex-col overflow-hidden mb-6 purple-glow"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-5 flex justify-between items-center text-white shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none">AI Gov Assistant</h3>
                  <span className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Online & Secure</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-xl transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/30 dark:bg-transparent">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-sm shadow-lg shadow-primary/20' 
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-md border border-slate-100 dark:border-white/5 rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 text-slate-500 shadow-md border border-slate-100 dark:border-white/5 rounded-2xl rounded-tl-sm p-4 text-sm flex space-x-2 items-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/50 dark:bg-[#020617]/50 border-t border-white/10">
              <form onSubmit={handleSend} className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-white/5 shadow-inner">
                <button 
                  type="button"
                  onClick={startListening}
                  className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:text-primary hover:bg-primary/10'}`}
                  title="Voice Command"
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your query..."
                  className="flex-grow bg-transparent border-none px-2 py-2 text-sm focus:ring-0 outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="bg-primary text-white p-3 rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-br from-primary to-secondary text-white p-5 rounded-3xl shadow-2xl purple-glow flex items-center justify-center group relative overflow-hidden"
          title="Ask AI Assistant"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <MessageSquare className="w-7 h-7 relative z-10" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-[#020617] animate-pulse"></span>
        </motion.button>
      )}
    </div>
  );
};

export default Chatbot;
