import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, CheckCircle, XCircle, Zap, ArrowRight, RefreshCw } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const STEPS = ['Profile', 'Location', 'Financial', 'Results'];

const EligibilityCalculator = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [form, setForm] = useState({
    age: '', income: '', state: '', occupation: '', category: ''
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const checkEligibility = async () => {
    if (!form.age || !form.income || !form.state || !form.occupation || !form.category) {
      return toast.error('Please fill all fields');
    }
    setLoading(true);
    try {
      const res = await api.post('/schemes/eligibility', {
        age: Number(form.age),
        income: Number(form.income),
        state: form.state,
        occupation: form.occupation,
        category: form.category,
      });
      setResults(res.data);
      setStep(3);
    } catch (err) {
      toast.error('Check failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setStep(0); setResults(null); setForm({ age: '', income: '', state: '', occupation: '', category: '' }); };

  const inputClass = "w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-600 font-bold outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all";
  const labelClass = "block text-sm font-black text-slate-300 mb-2 uppercase tracking-widest";

  return (
    <div className="min-h-screen bg-[#020617] py-20 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 px-5 py-2 rounded-full text-primary font-black text-xs uppercase tracking-[0.3em] mb-6">
            <Calculator className="w-4 h-4" /> Eligibility Engine
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">
            Find Your <span className="text-primary italic">Schemes.</span>
          </h1>
          <p className="text-slate-400 font-medium text-lg">
            Answer 5 quick questions. Our AI will instantly match you with eligible central, state, and international schemes.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5 -translate-y-1/2 z-0" />
          {STEPS.map((s, i) => (
            <div key={s} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 transition-all ${i < step ? 'bg-primary border-primary text-white' : i === step ? 'border-primary text-primary bg-primary/10' : 'border-white/10 text-slate-700 bg-[#020617]'}`}>
                {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${i <= step ? 'text-primary' : 'text-slate-700'}`}>{s}</span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="glassmorphism rounded-[2.5rem] border-white/10 purple-glow overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-10 space-y-6">
                <h2 className="text-2xl font-black text-white">Personal Profile</h2>
                <div>
                  <label className={labelClass}>Your Age</label>
                  <input type="number" name="age" value={form.age} onChange={handleChange} placeholder="e.g. 28" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Category / Caste</label>
                  <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                    <option value="">Select Category</option>
                    <option value="All">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>
                <button onClick={() => { if (!form.age || !form.category) return toast.error('Fill all fields'); setStep(1); }} className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                  Next <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-10 space-y-6">
                <h2 className="text-2xl font-black text-white">Location & Occupation</h2>
                <div>
                  <label className={labelClass}>Residing State</label>
                  <select name="state" value={form.state} onChange={handleChange} className={inputClass}>
                    <option value="">Select State</option>
                    {['All India','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Occupation</label>
                  <select name="occupation" value={form.occupation} onChange={handleChange} className={inputClass}>
                    <option value="">Select Occupation</option>
                    <option value="All">Any / Not Listed</option>
                    <option value="Student">Student</option>
                    <option value="Farmer">Farmer / Agriculture</option>
                    <option value="Self-Employed">Self-Employed / Entrepreneur</option>
                    <option value="Worker">Daily Wage Worker</option>
                    <option value="Government Employee">Government Employee</option>
                    <option value="Women">Women Entrepreneur</option>
                    <option value="Senior Citizen">Senior Citizen (70+)</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(0)} className="flex-1 py-5 rounded-2xl font-black border border-white/10 text-slate-400 hover:text-white hover:border-primary/50 transition-all">Back</button>
                  <button onClick={() => { if (!form.state || !form.occupation) return toast.error('Fill all fields'); setStep(2); }} className="flex-1 bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-black transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                    Next <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-10 space-y-6">
                <h2 className="text-2xl font-black text-white">Financial Details</h2>
                <div>
                  <label className={labelClass}>Annual Income (₹)</label>
                  <input type="number" name="income" value={form.income} onChange={handleChange} placeholder="e.g. 250000" className={inputClass} />
                  <p className="text-xs text-slate-600 mt-2 font-medium">Used only to match eligibility criteria. Not stored or shared.</p>
                </div>
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5">
                  <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-4">Your Profile Summary</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm text-slate-400 font-bold">
                    <div>Age: <span className="text-white">{form.age} yrs</span></div>
                    <div>Category: <span className="text-white">{form.category}</span></div>
                    <div>State: <span className="text-white">{form.state}</span></div>
                    <div>Occupation: <span className="text-white">{form.occupation}</span></div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 py-5 rounded-2xl font-black border border-white/10 text-slate-400 hover:text-white hover:border-primary/50 transition-all">Back</button>
                  <button onClick={checkEligibility} disabled={loading} className="flex-1 bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-black transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-60">
                    {loading ? <><RefreshCw className="w-5 h-5 animate-spin" /> Analyzing...</> : <><Zap className="w-5 h-5" /> Check Eligibility</>}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && results && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-10 space-y-8">
                <div className="text-center">
                  <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full font-black text-lg mb-4 ${results.eligible?.length > 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {results.eligible?.length > 0 ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                    {results.eligible?.length} Eligible Schemes Found!
                  </div>
                  <h2 className="text-2xl font-black text-white">Analysis Complete</h2>
                </div>

                {results.eligible?.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest">✅ You Qualify For</h3>
                    {results.eligible.slice(0, 5).map(s => (
                      <div key={s._id} className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                        <h4 className="font-black text-white mb-1">{s.name}</h4>
                        <p className="text-sm text-slate-400 line-clamp-2">{s.description}</p>
                      </div>
                    ))}
                    {results.eligible.length > 5 && <p className="text-center text-primary font-bold text-sm">+{results.eligible.length - 5} more schemes available in full view</p>}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={reset} className="flex-1 py-4 rounded-2xl font-black border border-white/10 text-slate-400 hover:text-white hover:border-primary/50 transition-all flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Recalculate
                  </button>
                  <Link to="/schemes" className="flex-1 bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-black transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                    View All Schemes <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default EligibilityCalculator;
