import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { UserPlus, User, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', age: '', income: '', state: '', occupation: '', category: ''
  });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center py-16 bg-[#020617] min-h-screen relative overflow-hidden"
    >
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-4xl glassmorphism rounded-[2.5rem] overflow-hidden relative z-10 purple-glow border-white/10 m-4">
        <div className="p-10 lg:p-14">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">Join the Network</h2>
            <p className="text-slate-400 text-lg font-medium">Complete your profile to unlock personalized AI scheme matching.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Column: Account Info */}
              <div className="space-y-6">
                <h3 className="text-primary font-bold uppercase tracking-widest text-xs mb-4">Account Information</h3>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-300 ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                      <User className="h-5 w-5 text-slate-500" />
                    </div>
                    <input type="text" name="name" required className="pl-12 block w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-white placeholder:text-slate-600" placeholder="John Doe" onChange={handleChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-300 ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                      <Mail className="h-5 w-5 text-slate-500" />
                    </div>
                    <input type="email" name="email" required className="pl-12 block w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-white placeholder:text-slate-600" placeholder="john@example.com" onChange={handleChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-300 ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                      <Lock className="h-5 w-5 text-slate-500" />
                    </div>
                    <input type="password" name="password" required className="pl-12 block w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-white placeholder:text-slate-600" placeholder="••••••••" onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Right Column: Profile Specs */}
              <div className="space-y-6">
                <h3 className="text-secondary font-bold uppercase tracking-widest text-xs mb-4">Eligibility Specs</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-300 ml-1">Age</label>
                    <input type="number" name="age" className="block w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-white placeholder:text-slate-600" placeholder="e.g. 24" onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-300 ml-1">Income (₹)</label>
                    <input type="number" name="income" className="block w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-white placeholder:text-slate-600" placeholder="Annual" onChange={handleChange} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-300 ml-1">Residing State</label>
                  <select name="state" className="block w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-white appearance-none" onChange={handleChange}>
                      <option value="" className="bg-slate-900 text-slate-500">Select State</option>
                      <option value="All" className="bg-slate-900 text-white">All India</option>
                      <option value="Delhi" className="bg-slate-900 text-white">Delhi</option>
                      <option value="Maharashtra" className="bg-slate-900 text-white">Maharashtra</option>
                      <option value="Karnataka" className="bg-slate-900 text-white">Karnataka</option>
                      <option value="Uttar Pradesh" className="bg-slate-900 text-white">Uttar Pradesh</option>
                      <option value="Tamil Nadu" className="bg-slate-900 text-white">Tamil Nadu</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-300 ml-1">Occupation</label>
                    <select name="occupation" className="block w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-white appearance-none" onChange={handleChange}>
                        <option value="" className="bg-slate-900">Select</option>
                        <option value="All" className="bg-slate-900">Any</option>
                        <option value="Student" className="bg-slate-900">Student</option>
                        <option value="Farmer" className="bg-slate-900">Farmer</option>
                        <option value="Self-Employed" className="bg-slate-900">Self-Employed</option>
                        <option value="Worker" className="bg-slate-900">Worker</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-300 ml-1">Category</label>
                    <select name="category" className="block w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-white appearance-none" onChange={handleChange}>
                        <option value="" className="bg-slate-900">Select</option>
                        <option value="All" className="bg-slate-900">General</option>
                        <option value="OBC" className="bg-slate-900">OBC</option>
                        <option value="SC" className="bg-slate-900">SC</option>
                        <option value="ST" className="bg-slate-900">ST</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-5 px-6 rounded-2xl shadow-2xl text-xl font-bold text-white bg-primary hover:bg-primary-dark hover:purple-glow transition-all active:scale-[0.98]"
            >
              <UserPlus className="w-6 h-6 mr-3" />
              Complete Professional Profile
            </button>
          </form>

          <div className="mt-10 text-center">
            <span className="text-slate-500 font-medium">Already part of the network? </span>
            <Link to="/login" className="font-bold text-primary hover:text-white transition-colors underline underline-offset-4 decoration-primary/30">
              Sign In Instead
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
