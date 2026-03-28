import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FileUploader = ({ files, setFiles, label = "Upload Documents" }) => {
  const onDrop = useCallback(acceptedFiles => {
    setFiles([...files, ...acceptedFiles]);
  }, [files, setFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = (name) => {
    setFiles(files.filter(f => f.name !== name));
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-tight">{label}</label>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer bg-slate-50 dark:bg-slate-900/50 ${isDragActive ? 'border-primary bg-blue-50 dark:bg-primary/10' : 'border-slate-200 dark:border-slate-800'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm mb-4">
            <Upload className={`w-8 h-8 ${isDragActive ? 'text-primary' : 'text-slate-400'}`} />
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            {isDragActive ? "Drop the files here" : "Drag & drop files here, or click to select"}
          </p>
          <p className="text-slate-400 text-xs mt-2">PDF, JPG, PNG (Max 5MB)</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <AnimatePresence>
          {files.map((file, i) => (
            <motion.div 
              key={file.name + i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-blue-50 dark:bg-primary/20 p-2 rounded-lg text-primary">
                  <File className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[200px]">{file.name}</p>
                    <p className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <button 
                  onClick={() => removeFile(file.name)}
                  className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FileUploader;
