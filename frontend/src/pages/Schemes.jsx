import { Link } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { Search, Info, CheckCircle, XCircle, Share2, Tag, Calendar, ExternalLink, Sparkles, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useContext, useState, useEffect } from 'react';

const Schemes = () => {
  const { user } = useContext(AuthContext);
  const [schemes, setSchemes] = useState([]);
  const [eligibleSchemes, setEligibleSchemes] = useState([]);
  const [notEligibleSchemes, setNotEligibleSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('all'); // all, eligible
  const [searchTerm, setSearchTerm] = useState('');

  const handleShare = (scheme) => {
    navigator.clipboard.writeText(`Check out this government scheme: ${scheme.name}\n${scheme.description}`);
    toast.success('Scheme details copied to clipboard!');
  };

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
      // Small artificial delay for shimmer effect
      setTimeout(() => setLoading(false), 800);
    }
  };

  const filteredSchemes = schemes.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const checkEligibility = async () => {
    if (!user) return toast.error("Please login to check eligibility");
    
    try {
      setLoading(true);
      const res = await api.post('/schemes/eligibility', {
        age: user.age,
        income: user.income,
        state: user.state,
        occupation: user.occupation,
        category: user.category
      });
      setEligibleSchemes(res.data.eligible);
      setNotEligibleSchemes(res.data.notEligible);
      setMode('eligible');
      toast.success('Eligibility check complete!');
    } catch (err) {
      toast.error('Failed to check eligibility');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (schemeId) => {
    try {
      await api.post('/applications', { schemeId });
      toast.success("Application submitted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error applying for scheme");
    }
  };

  const SkeletonCard = () => (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 h-full animate-pulse">
        <div className="w-2/3 h-6 bg-slate-100 dark:bg-slate-800 rounded-lg mb-4"></div>
        <div className="w-full h-20 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-6"></div>
        <div className="space-y-3">
            <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
            <div className="w-5/6 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
        </div>
        <div className="mt-8 flex space-x-2">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
            <div className="flex-grow h-10 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] py-20 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto space-y-16"
      >
        {/* Hero & Search Section */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-12">
          <div className="max-w-2xl w-full">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 text-primary font-black uppercase tracking-[0.3em] text-xs">
                <div className="w-12 h-[1px] bg-primary"></div>
                Intelligence Discovery
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-none">
                Governance <br/><span className="text-primary italic">Analytics.</span>
              </h1>
              <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-lg">
                Autonomous identification of national and international welfare opportunities tailored to your cryptographic profile.
              </p>
            </motion.div>
            
            <div className="mt-12 relative group max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-500">
                <Search className="h-6 w-6 group-focus-within:text-primary transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search resonance frequencies (name, benefits, keywords)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-16 block w-full bg-slate-900/50 border border-white/10 rounded-[2.5rem] py-6 px-8 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-white placeholder:text-slate-600 font-bold transition-all shadow-2xl"
              />
            </div>
          </div>
          
          <div className="flex bg-slate-900/50 p-2 rounded-[2rem] border border-white/10 self-end lg:self-center backdrop-blur-xl">
            <button 
              onClick={() => setMode('all')}
              className={`px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${mode === 'all' ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              Omni Channel
            </button>
            <button 
              onClick={checkEligibility}
              className={`px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${mode === 'eligible' ? 'bg-secondary text-white shadow-xl shadow-secondary/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              Match Analysis
            </button>
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode='popLayout'>
          {loading ? (
               [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          ) : mode === 'all' ? (
            filteredSchemes.map((scheme, i) => (
              <motion.div 
                key={scheme._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                layout
              >
                <SchemeCard scheme={scheme} handleApply={handleApply} user={user} handleShare={handleShare} />
              </motion.div>
            ))
          ) : (
            <>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full border-l-4 border-emerald-500 pl-8 py-4 mb-4"
              >
                <h2 className="text-3xl font-black text-white flex items-center tracking-tight">
                    <CheckCircle className="mr-4 text-emerald-500 w-8 h-8" /> 
                    High-Resonance Matches
                </h2>
                <p className="text-slate-500 font-medium mt-2">Schemes where your profile data satisfies &gt;90% of architectural requirements.</p>
              </motion.div>
              {eligibleSchemes.length === 0 ? <p className="col-span-full text-slate-600 font-bold ml-12 py-10">Searching for alignment... zero results in local jurisdiction.</p> : null}
              {eligibleSchemes.map((scheme, i) => (
                <motion.div 
                  key={scheme._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  layout
                >
                  <SchemeCard scheme={scheme} handleApply={handleApply} user={user} isEligible={true} handleShare={handleShare} />
                </motion.div>
              ))}

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full mt-24 mb-10 border-l-4 border-slate-800 pl-8 py-4"
              >
                <h2 className="text-3xl font-black text-slate-500 flex items-center tracking-tight">
                    <XCircle className="mr-4 text-slate-700 w-8 h-8" /> 
                    Divergent Policies
                </h2>
                <p className="text-slate-600 font-medium mt-2">Schemes requiring additional resource qualification or regional alignment.</p>
              </motion.div>
              {notEligibleSchemes.map((item, i) => (
                <motion.div 
                  key={item.scheme._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  layout
                >
                  <SchemeCard scheme={item.scheme} disabled={true} reasons={item.reasons} handleShare={handleShare} />
                </motion.div>
              ))}
            </>
          )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const SchemeCard = ({ scheme, handleApply, user, disabled = false, isEligible = false, reasons = [], handleShare }) => {
  return (
    <motion.div 
      whileHover={{ y: -12 }}
      layout
      className={`h-full glassmorphism rounded-[2.5rem] flex flex-col transition-all duration-500 group overflow-hidden ${disabled ? 'border-white/5 opacity-60' : isEligible ? 'border-emerald-500/30 bg-emerald-500/5 purple-glow' : 'border-white/10 hover:border-primary/50 hover:purple-glow'}`}
    >
      <div className="p-10 flex-grow relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>
        
        <div className="flex justify-between items-start mb-8 gap-4">
            <h3 className="text-2xl font-black text-white line-clamp-2 leading-[1.1] tracking-tight group-hover:text-primary transition-colors">{scheme.name}</h3>
            {isEligible && (
                <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/30">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
            )}
        </div>
        
        <p className="text-slate-400 font-medium text-sm line-clamp-3 mb-10 leading-relaxed border-l-2 border-white/10 pl-5">{scheme.description}</p>
        
        <div className="space-y-6">
          <div className="flex items-center text-primary font-black text-[10px] uppercase tracking-[0.2em]">
            <Tag className="w-4 h-4 mr-3" />
            Strategic Grants
          </div>
          <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-sm text-slate-300 leading-relaxed font-bold italic">
             "{scheme.benefits}"
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-secondary font-black text-[10px] uppercase tracking-[0.2em]">
              <FileText className="w-4 h-4 mr-3" />
              Required Documentation
            </div>
            <div className="flex flex-wrap gap-2">
              {scheme.requiredDocs && scheme.requiredDocs.length > 0 ? (
                scheme.requiredDocs.map((doc, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-slate-400">
                    {doc}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">No documents specified</span>
              )}
            </div>
          </div>
        </div>

        {reasons.length > 0 && (
          <div className="mt-8 bg-red-500/5 p-6 rounded-3xl border border-red-500/10">
            <div className="text-[10px] font-black text-red-500 mb-3 uppercase flex items-center tracking-widest">
                <Info className="w-4 h-4 mr-2" /> Alignment Gaps
            </div>
            <ul className="text-xs text-slate-500 space-y-2 font-bold">
              {reasons.map((r, i) => <li key={i} className="flex items-center"><span className="w-1.5 h-1.5 bg-red-500/40 rounded-full mr-3"></span>{r}</li>)}
            </ul>
          </div>
        )}
      </div>
      
      <div className="px-10 py-8 bg-white/5 border-t border-white/5 flex justify-between items-center gap-6">
        <div className="flex flex-col">
            <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Expiration</div>
            <div className="text-xs text-white font-black">
                {scheme.deadline ? new Date(scheme.deadline).toLocaleDateString() : 'Rolling Access'}
            </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => handleShare(scheme)}
            className="p-4 bg-white/5 text-slate-400 hover:text-white rounded-2xl transition-all border border-white/5 hover:bg-white/10"
            title="Export Data"
          >
            <Share2 className="w-5 h-5" />
          </button>
          
          {!disabled && user && (
            <Link 
              to={`/schemes/${scheme._id}/guide`}
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center"
            >
              AI Guided Roadmap <Sparkles className="w-4 h-4 ml-3" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Schemes;
