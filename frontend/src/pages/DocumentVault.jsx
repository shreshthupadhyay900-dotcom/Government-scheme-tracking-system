import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Trash2, Download, ShieldCheck, Search, Plus } from 'lucide-react';

const DocumentVault = () => {
    const [documents, setDocuments] = useState([
        { id: 1, name: 'Aadhar_Card.pdf', size: '1.2 MB', type: 'ID Proof', date: '2024-03-15' },
        { id: 2, name: 'Income_Certificate_2023.pdf', size: '2.5 MB', type: 'Income Proof', date: '2024-01-10' },
        { id: 3, name: 'Ration_Card_Digital.jpg', size: '850 KB', type: 'Address Proof', date: '2024-02-20' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredDocs = documents.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#020617] py-16 px-4 sm:px-6 lg:px-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                           <ShieldCheck className="text-primary w-8 h-8" />
                           <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">Document Vault</h1>
                        </div>
                        <p className="text-slate-400 text-lg font-medium">Securely encrypted storage for your government application requisites.</p>
                    </div>
                    <button className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 transition-all flex items-center justify-center group whitespace-nowrap">
                        <Upload className="mr-3 w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                        Secure Upload
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="glassmorphism p-6 rounded-3xl border-white/10 mb-10 flex items-center gap-4">
                    <Search className="text-slate-500 w-5 h-5 ml-2" />
                    <input 
                        type="text" 
                        placeholder="Search your secure vault..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none text-white w-full placeholder:text-slate-600 font-medium"
                    />
                </div>

                {/* Document Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDocs.map((doc, idx) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * idx }}
                            className="glassmorphism p-6 rounded-3xl border-white/10 hover:purple-glow transition-all group relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-4 bg-slate-900/50 rounded-2xl text-primary border border-white/5">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-2 text-slate-500 hover:text-white transition-colors"><Download className="w-5 h-5" /></button>
                                    <button className="p-2 text-slate-500 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
                                </div>
                            </div>
                            
                            <h3 className="text-white font-bold text-lg truncate mb-1">{doc.name}</h3>
                            <div className="flex items-center gap-2 mb-4">
                               <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider">{doc.type}</span>
                               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{doc.size}</span>
                            </div>

                            <p className="text-slate-500 text-xs font-medium">Added on {doc.date}</p>

                            {/* Hover Decorative Element */}
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * filteredDocs.length }}
                        className="border-2 border-dashed border-white/10 p-6 rounded-3xl flex flex-col items-center justify-center text-center hover:border-primary/50 transition-all group cursor-pointer"
                    >
                        <div className="p-4 bg-slate-900/30 rounded-full mb-4 group-hover:scale-110 transition-transform">
                           <Plus className="w-8 h-8 text-slate-600 group-hover:text-primary" />
                        </div>
                        <p className="text-slate-500 font-bold">Add New Document</p>
                    </motion.div>
                </div>

                {/* Empty State */}
                {filteredDocs.length === 0 && (
                    <div className="text-center py-20">
                        <FileText className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No documents found</h3>
                        <p className="text-slate-500">Your search didn't match any files in the vault.</p>
                    </div>
                )}

                {/* Security Footer */}
                <div className="mt-16 flex items-center justify-center gap-2 text-slate-600 font-bold text-sm uppercase tracking-[0.2em]">
                    <ShieldCheck className="w-4 h-4" />
                    AES-256 Bit Encrypted Environment
                </div>
            </motion.div>
        </div>
    );
};

export default DocumentVault;
