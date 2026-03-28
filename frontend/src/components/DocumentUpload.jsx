import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const DocumentUpload = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return toast.error("Please select a file first");
        if (file.type !== 'application/pdf') return toast.error("Only PDF files are supported");

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            const res = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Document processed successfully!");
            onUploadSuccess(res.data.document._id);
        } catch (error) {
            toast.error(error.response?.data?.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="glassmorphism p-8 rounded-[2.5rem] border-white/10 purple-glow h-full flex flex-col items-center justify-center text-center">
            <div className="bg-primary/10 p-6 rounded-3xl mb-6">
                <Upload className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2 tracking-tight">PDF Verification</h2>
            <p className="text-slate-400 font-medium mb-8 max-w-xs">Upload your government ID or certificate for AI-powered analysis.</p>
            
            <div className="w-full space-y-4">
                <div className="relative group">
                    <input 
                        type="file" 
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden" 
                        id="pdf-upload"
                    />
                    <label 
                        htmlFor="pdf-upload"
                        className="flex items-center justify-between w-full p-4 bg-slate-900/50 border border-white/10 rounded-2xl cursor-pointer hover:border-primary/50 transition-all group-hover:bg-slate-900"
                    >
                        <span className="text-sm font-bold text-slate-400 truncate pr-4">
                            {file ? file.name : "Select PDF Document"}
                        </span>
                        <FileText className="w-5 h-5 text-slate-600 group-hover:text-primary" />
                    </label>
                </div>

                <button 
                    onClick={handleUpload}
                    disabled={uploading || !file}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/20 flex items-center justify-center disabled:opacity-50 disabled:grayscale"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        "Upload & Verify"
                    )}
                </button>
            </div>
            
            {file && !uploading && (
                <div className="mt-6 flex items-center text-emerald-400 text-xs font-bold uppercase tracking-widest">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    File Ready for Extraction
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;
