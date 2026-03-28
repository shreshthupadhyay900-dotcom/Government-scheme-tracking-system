import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, FileText, BrainCircuit, Sparkles } from 'lucide-react';
import DocumentUpload from '../components/DocumentUpload';
import DocumentChat from '../components/DocumentChat';

const DocumentPage = () => {
    const [documentId, setDocumentId] = useState(null);

    return (
        <div className="min-h-screen bg-[#020617] py-20 px-4 sm:px-6 lg:px-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto space-y-12"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.3em] text-xs mb-4">
                            <div className="w-12 h-[1px] bg-primary"></div>
                            Sovereignty Verification
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none mb-6">
                            AI Document <br/><span className="text-secondary italic">Intelligence.</span>
                        </h1>
                        <p className="text-slate-400 text-xl font-medium leading-relaxed">
                            Autonomous verification engine for identity and eligibility documentation. High-precision extraction and analysis for seamless scheme application.
                        </p>
                    </div>
                    <div className="bg-slate-900/50 p-6 rounded-[2.5rem] border border-white/10 flex items-center gap-4 purple-glow">
                        <div className="p-4 bg-primary/20 rounded-2xl">
                            <ShieldCheck className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <span className="text-[10px] text-primary font-black uppercase tracking-widest block mb-1">Status</span>
                            <span className="text-white font-black text-lg">AES-256 SECURE</span>
                        </div>
                    </div>
                </div>

                {/* Workflow Steps Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
                    {[
                        { step: "01", label: "Cryptographic Upload", icon: <FileText className="w-4 h-4" /> },
                        { step: "02", label: "Feature Extraction", icon: <BrainCircuit className="w-4 h-4" /> },
                        { step: "03", label: "Scheme Resonance", icon: <Sparkles className="w-4 h-4" /> }
                    ].map((s, i) => (
                        <div key={i} className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/5">
                            <span className="text-primary font-black text-sm">{s.step}</span>
                            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">{s.label}</span>
                        </div>
                    ))}
                </div>

                {/* Main Interaction Hub */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 min-h-[600px]">
                    <div className="lg:col-span-5 h-full">
                        <DocumentUpload onUploadSuccess={setDocumentId} />
                    </div>
                    
                    <div className="lg:col-span-7 h-full">
                        <AnimatePresence mode="wait">
                            {documentId ? (
                                <motion.div 
                                    key="chat"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="h-full"
                                >
                                    <DocumentChat documentId={documentId} />
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.5 }}
                                    className="h-full glassmorphism rounded-[2.5rem] border-white/10 flex flex-col items-center justify-center text-center p-12 border-dashed border-2"
                                >
                                    <div className="p-8 bg-slate-900 rounded-full mb-6 border border-white/5">
                                        <BrainCircuit className="w-12 h-12 text-slate-700" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-500 tracking-tight">Intelligence Engine Standby</h3>
                                    <p className="text-slate-600 font-medium max-w-xs mt-2">The AI Verification Node will activate upon successful document ingestion and extraction.</p>
                                    <div className="mt-8 flex items-center gap-3 text-slate-700 font-black text-xs uppercase tracking-[0.2em]">
                                        <ArrowRight className="w-4 h-4 animate-bounce-x" />
                                        Awaiting Ingestion
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default DocumentPage;
