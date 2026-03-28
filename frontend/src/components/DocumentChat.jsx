import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const DocumentChat = ({ documentId }) => {
    const [messages, setMessages] = useState([
        { role: 'bot', content: "Hello! I've analyzed your document. Ask me about completeness, missing fields, or scheme eligibility." }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef();

    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async (e) => {
         e.preventDefault();
         if (!input.trim() || loading) return;

         const userMsg = input.trim();
         setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
         setInput('');
         setLoading(true);

         try {
             const res = await api.post('/doc-chat', { documentId, question: userMsg });
             const { answer, status, missing_documents, suggestions, extracted_details } = res.data;

             let metaInfo = "";
             if (status === 'incomplete' || (missing_documents && missing_documents.length > 0)) {
                 metaInfo = `\n\n⚠️ Status: INCOMPLETE\nMissing: ${missing_documents.join(', ') || 'Various requirements'}`;
             }

             const fullResponse = `${answer}${metaInfo}\n\n💡 Sugesstion: ${suggestions}`;

             setMessages(prev => [...prev, { role: 'bot', content: fullResponse, metadata: { status, missing_documents, extracted_details } }]);
         } catch (error) {
             setMessages(prev => [...prev, { role: 'bot', content: "Error connecting to AI verification engine. Please check your connection." }]);
         } finally {
             setLoading(false);
         }
     };

    return (
        <div className="glassmorphism rounded-[2.5rem] border-white/10 flex flex-col h-full overflow-hidden purple-glow">
            <div className="bg-white/5 p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/20 rounded-xl">
                        <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white tracking-tight leading-none">AI Document Analyst</h3>
                        <span className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">Sovereignty Intelligence Active</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed ${
                            msg.role === 'user' 
                                ? 'bg-primary text-white rounded-tr-sm shadow-xl shadow-primary/20' 
                                : 'bg-slate-900/50 text-slate-200 border border-white/10 rounded-tl-sm'
                        }`}>
                            <div className="flex items-center gap-2 mb-2">
                                {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-primary" />}
                                <span className="text-[10px] uppercase font-black tracking-widest opacity-60">
                                    {msg.role === 'user' ? 'Citizen' : 'Analyst Node'}
                                </span>
                            </div>
                            <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
                        </div>
                    </motion.div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-900/50 border border-white/10 rounded-3xl rounded-tl-sm p-4 flex gap-2">
                            <Sparkles className="w-4 h-4 text-primary animate-spin" />
                            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Processing Data...</span>
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSend} className="p-6 bg-white/5 border-t border-white/10">
                <div className="flex items-center gap-3 p-2 bg-slate-950/50 rounded-2xl border border-white/5 shadow-inner group">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your document..."
                        className="flex-1 bg-transparent border-none outline-none py-3 px-4 text-white text-sm placeholder:text-slate-600 font-bold"
                    />
                    <button 
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="p-4 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DocumentChat;
