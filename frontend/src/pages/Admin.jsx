import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import FileUploader from '../components/FileUploader';

const Admin = () => {
  const { user } = useContext(AuthContext);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  // Form state
  const [formData, setFormData] = useState({
    name: '', description: '', benefits: '', minAge: 0, maxIncome: null, state: 'All', occupation: 'All', category: 'All'
  });

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const res = await api.get('/schemes');
      setSchemes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/schemes', {
        name: formData.name,
        description: formData.description,
        benefits: formData.benefits,
        eligibility: {
          minAge: formData.minAge || 0,
          maxIncome: formData.maxIncome || 999999999,
          state: formData.state || 'All',
          occupation: formData.occupation || 'All',
          category: formData.category || 'All',
        }
      });
      alert('Scheme created successfully');
      setFormData({ name: '', description: '', benefits: '', minAge: 0, maxIncome: null, state: 'All', occupation: 'All', category: 'All' });
      fetchSchemes();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create scheme');
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-[#020617] py-16 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-12"
      >
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">Admin Command Center</h1>
            <p className="text-slate-400 mt-2 text-lg font-medium">Global governance scheme orchestration and deployment.</p>
          </div>
          <div className="text-xs font-bold text-secondary bg-secondary/10 px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-secondary/20">Root Access Active</div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Create Scheme Form */}
          <div className="lg:col-span-1 glassmorphism rounded-[2.5rem] border-white/10 p-8 self-start purple-glow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            <h2 className="text-2xl font-black text-white border-b border-white/5 pb-6 mb-8 flex items-center">
               <span className="w-2 h-6 bg-primary rounded-full mr-3"></span>
               Deploy New Scheme
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-300 ml-1">Scheme Nomenclature</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-white placeholder:text-slate-600 text-sm font-medium" placeholder="E.g. PM-Kisan Matrix" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-300 ml-1">Comprehensive Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-white placeholder:text-slate-600 text-sm font-medium h-32 resize-none" placeholder="Detailed strategic overview..." />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-300 ml-1">Benefit Matrix</label>
                <textarea name="benefits" value={formData.benefits} onChange={handleChange} required className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-white placeholder:text-slate-600 text-sm font-medium h-24 resize-none" placeholder="Financial & resource grants..." />
              </div>
              
              <div className="pt-6 border-t border-white/5 mt-8">
                <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-6">Eligibility Logic Config</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Min Age</label>
                    <input type="number" name="minAge" value={formData.minAge} onChange={handleChange} className="w-full bg-slate-900/30 border border-white/5 rounded-xl p-3 outline-none focus:border-primary transition-colors text-white text-xs" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Max Income</label>
                    <input type="number" name="maxIncome" value={formData.maxIncome || ''} placeholder="Infinity" onChange={handleChange} className="w-full bg-slate-900/30 border border-white/5 rounded-xl p-3 outline-none focus:border-primary transition-colors text-white text-xs" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Jurisdiction</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full bg-slate-900/30 border border-white/5 rounded-xl p-3 outline-none focus:border-primary transition-colors text-white text-xs" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Sector</label>
                    <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className="w-full bg-slate-900/30 border border-white/5 rounded-xl p-3 outline-none focus:border-primary transition-colors text-white text-xs" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <FileUploader files={files} setFiles={setFiles} />
              </div>

              <button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/20 active:scale-[0.98]"
              >
                Launch Scheme
              </button>
            </form>
          </div>

          {/* Existing Schemes List */}
          <div className="lg:col-span-2 glassmorphism rounded-[2.5rem] border-white/10 overflow-hidden flex flex-col">
            <div className="border-b border-white/5 px-10 py-8 bg-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-black text-white tracking-tight">Active Repositories</h2>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{schemes.length} Schemes Operational</span>
            </div>
            <div className="divide-y divide-white/5 overflow-y-auto max-h-[1000px] custom-scrollbar">
              {loading && <div className="p-20 text-center text-primary font-bold animate-pulse uppercase tracking-[0.3em]">Synchronizing data...</div>}
              {schemes.map(s => (
                <div key={s._id} className="p-10 hover:bg-white/5 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">{s.name}</h3>
                    <div className="flex gap-2">
                        <button className="p-2 text-slate-500 hover:text-white transition-colors bg-white/5 rounded-lg border border-white/5">Edit</button>
                        <button className="p-2 text-slate-500 hover:text-red-500 transition-colors bg-white/5 rounded-lg border border-white/5">Delete</button>
                    </div>
                  </div>
                  <p className="text-slate-400 font-medium leading-relaxed mb-6 line-clamp-2 max-w-3xl">{s.description}</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2 bg-slate-950 px-4 py-2 rounded-xl border border-white/5">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Age</span>
                        <span className="text-xs font-bold text-slate-300">{s.eligibility.minAge}+</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-slate-950 px-4 py-2 rounded-xl border border-white/5">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Income</span>
                        <span className="text-xs font-bold text-slate-300">{s.eligibility.maxIncome === 999999999 ? 'No Limit' : `₹${s.eligibility.maxIncome.toLocaleString()}`}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-slate-950 px-4 py-2 rounded-xl border border-white/5">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Region</span>
                        <span className="text-xs font-bold text-slate-300">{s.eligibility.state}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Admin;
